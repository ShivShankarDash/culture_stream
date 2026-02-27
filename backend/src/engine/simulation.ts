import fs from 'node:fs'
import path from 'node:path'
import type { Simulation, WeekData, MessageMetrics } from '../types'
import { aggregateWeekMetrics } from './metricsCalculator'
import { detectMutations } from './mutationDetector'
import { generateDiagnosis, getWeekStatus } from './diagnosisGenerator'
import { seedMessagesToSlack, type SeedMessage } from '../services/slackSeeder'
import { analyzeMessagesWithOpenAI, type AnalyzableMessage } from '../services/openaiAnalyzer'

const simulations = new Map<string, Simulation>()

type EnrichedMessage = {
  channel: string
  payload: string
  metrics: MessageMetrics
}

type EnrichedMetricsByWeek = Record<string, EnrichedMessage[]>

const ENRICHED_METRICS_PATH = path.join(__dirname, '..', '..', 'data', 'enrichedMetrics.json')
const DATASET_PATH = path.join(__dirname, '..', '..', 'scripts', 'dataset.json')

function loadEnrichedMetrics(): EnrichedMetricsByWeek {
  if (!fs.existsSync(ENRICHED_METRICS_PATH)) {
    return {}
  }
  const raw = fs.readFileSync(ENRICHED_METRICS_PATH, 'utf8').trim()
  if (!raw) return {}
  try {
    return JSON.parse(raw) as EnrichedMetricsByWeek
  } catch (err) {
    console.error('Failed to parse enrichedMetrics.json, starting from empty object:', err)
    return {}
  }
}

/** Updates enrichedMetrics.json by merging the given week key. Never overwrites the whole file. */
function saveEnrichedMetricsByKey(key: string, enriched: EnrichedMessage[]): void {
  const existing = loadEnrichedMetrics()
  existing[key] = enriched
  fs.writeFileSync(ENRICHED_METRICS_PATH, JSON.stringify(existing, null, 2), 'utf8')
}

function loadWeekDataset(week: number): SeedMessage[] {
  if (!fs.existsSync(DATASET_PATH)) {
    throw new Error(`dataset.json not found at "${DATASET_PATH}"`)
  }
  const raw = fs.readFileSync(DATASET_PATH, 'utf8')
  const weeks = JSON.parse(raw) as SeedMessage[][]
  const index = week - 1
  const weekMessages = weeks[index]
  if (!Array.isArray(weekMessages)) {
    throw new Error(`Week ${week} not found in dataset.json`)
  }
  return weekMessages
}

async function ensureWeekEnriched(week: number): Promise<EnrichedMessage[]> {
  const key = String(week)
  const existing = loadEnrichedMetrics()

  if (existing[key] && Array.isArray(existing[key]) && existing[key].length > 0) {
    return existing[key]
  }

  const datasetMessages = loadWeekDataset(week)

  const analyzable: AnalyzableMessage[] = datasetMessages.map((m) => ({
    channel: m.channel,
    payload: m.payload,
  }))

  // Fire-and-forget Slack seeding so the API response time is bounded by Gemini only.
  // The metrics pipeline uses Gemini as the source of truth.
  seedMessagesToSlack(datasetMessages).catch((err) => {
    console.error(`Failed to seed Slack messages for week ${week}:`, err)
  })

  const perMessageMetrics = await analyzeMessagesWithOpenAI(week, analyzable)
  const enriched: EnrichedMessage[] = perMessageMetrics.map((metrics, idx) => ({
    channel: datasetMessages[idx].channel,
    payload: datasetMessages[idx].payload,
    metrics,
  }))

  saveEnrichedMetricsByKey(key, enriched)

  const refreshed = loadEnrichedMetrics()
  return refreshed[key] || []
}

export function createSimulation(): Simulation {
  const id = `sim_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`

  const simulation: Simulation = {
    id,
    createdAt: new Date().toISOString(),
    weeks: [],
  }

  simulations.set(id, simulation)
  return simulation
}

export function getSimulation(id: string): Simulation | undefined {
  return simulations.get(id)
}

export async function getWeekData(simId: string, week: number): Promise<WeekData | undefined> {
  const sim = simulations.get(simId)
  if (!sim) return undefined

  const existingWeek = sim.weeks.find((w) => w.week === week)
  if (existingWeek) return existingWeek

  const enriched = await ensureWeekEnriched(week)

  if (!enriched.length) {
    return undefined
  }

  const metrics = aggregateWeekMetrics(
    week,
    enriched.map((e) => e.metrics),
  )
  const mutations = detectMutations(metrics)
  const diagnosis = generateDiagnosis(week, mutations)
  const status = getWeekStatus(week)

  // Use first 5 messages from enriched data as sample messages for the drawer
  const sampleMessages = enriched.slice(0, 5).map((e, idx) => ({
    id: `w${week}_sample_${idx}`,
    week,
    timestamp: '', // real timestamp is not available from the dataset payload
    userId: '',
    userName: '',
    userTeam: '',
    channelId: '',
    channelName: e.channel,
    text: e.payload,
    sentiment: e.metrics.sentiment,
    crossTeam: false,
    mentions: [],
    isLateNight: false,
    isWeekend: false,
  }))

  const weekData: WeekData = {
    week,
    status,
    metrics,
    mutations,
    diagnosis,
    sampleMessages,
    messageCount: enriched.length,
  }

  sim.weeks.push(weekData)
  return weekData
}

