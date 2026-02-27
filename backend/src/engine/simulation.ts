import type { Simulation, WeekData } from '../types'
import { generateWeekMessages } from './messageGenerator'
import { calculateWeekMetrics } from './metricsCalculator'
import { detectMutations } from './mutationDetector'
import { generateDiagnosis, getWeekStatus } from './diagnosisGenerator'

const simulations = new Map<string, Simulation>()

export function createSimulation(): Simulation {
  const id = `sim_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
  const weeks: WeekData[] = []

  for (let week = 1; week <= 8; week++) {
    const messages = generateWeekMessages(week)
    const metrics = calculateWeekMetrics(week, messages)
    const mutations = detectMutations(metrics)
    const diagnosis = generateDiagnosis(week, mutations)
    const status = getWeekStatus(week)

    // Pick 5 representative sample messages
    const sampleMessages = messages
      .filter((_, i) => i % Math.floor(messages.length / 5) === 0)
      .slice(0, 5)

    weeks.push({
      week,
      status,
      metrics,
      mutations,
      diagnosis,
      sampleMessages,
      messageCount: messages.length,
    })
  }

  const simulation: Simulation = {
    id,
    createdAt: new Date().toISOString(),
    weeks,
  }

  simulations.set(id, simulation)
  return simulation
}

export function getSimulation(id: string): Simulation | undefined {
  return simulations.get(id)
}

export function getWeekData(simId: string, week: number): WeekData | undefined {
  const sim = simulations.get(simId)
  if (!sim) return undefined
  return sim.weeks.find(w => w.week === week)
}
