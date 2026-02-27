const API_BASE = '/api'

export interface BackendWeekMetrics {
  silosScore: number
  sentiment: number
  responseTimeHours: number
  burnoutRisk: number
  crossTeamPercentage: number
  lateNightPercentage: number
  blameScore: number
  trustScore: number
  productivity: number
  wlb: number
  workSatisfaction: number
}

export interface BackendMutation {
  type: 'silos' | 'burnout' | 'trust_erosion'
  severity: 'warning' | 'critical'
  message: string
  trigger: number
}

export interface BackendDiagnosis {
  current: string
  alert: string | null
  suggestion: string
}

export interface BackendSampleMessage {
  userName: string
  text: string
  [key: string]: unknown
}

export interface BackendWeekData {
  week: number
  status: 'healthy' | 'warning' | 'critical' | 'recovery'
  metrics: BackendWeekMetrics
  mutations: BackendMutation[]
  diagnosis: BackendDiagnosis
  sampleMessages?: BackendSampleMessage[]
  messageCount: number
}

export async function startSimulation(): Promise<{ simulation_id: string; total_weeks: number; week_1_data: unknown }> {
  const res = await fetch(`${API_BASE}/simulation/start`, { method: 'POST' })
  if (!res.ok) throw new Error('Failed to start simulation')
  return res.json()
}

export async function getWeekData(simId: string, week: number): Promise<BackendWeekData> {
  const res = await fetch(`${API_BASE}/simulation/${simId}/week/${week}`)
  if (!res.ok) throw new Error(`Failed to fetch week ${week}`)
  return res.json() as Promise<BackendWeekData>
}
