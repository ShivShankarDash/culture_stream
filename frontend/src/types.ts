export type CultureState = 'healthy' | 'warning' | 'critical' | 'recovery'

export interface Metrics {
  silos: number
  sentiment: number
  response_time: number
  burnout_risk: number
}

export interface Mutation {
  type: string
  severity: 'warning' | 'critical'
  message: string
  trigger: number
}

export interface Diagnosis {
  current: string
  alert: string | null
  suggestion: string
}

export interface WeekData {
  week: number
  state: CultureState
  status?: CultureState
  metrics: Metrics
  mutations: Mutation[]
  diagnosis?: Diagnosis
  sampleMessages?: Array<{ userName: string; text: string }>
  root_cause: string
  suggestion: string
  messageCount?: number
}
