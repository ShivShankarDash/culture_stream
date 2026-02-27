export interface User {
  id: string
  name: string
  team: string
  role: string
  slackHandle: string
}

export interface Channel {
  id: string
  name: string
  type: 'cross-team' | 'team-specific' | 'casual'
}

export interface Message {
  id: string
  week: number
  timestamp: string
  userId: string
  userName: string
  userTeam: string
  channelId: string
  channelName: string
  text: string
  sentiment: number
  crossTeam: boolean
  mentions: string[]
  isLateNight: boolean
  isWeekend: boolean
}

export interface WeekMetrics {
  week: number
  silosScore: number
  sentiment: number
  responseTimeHours: number
  burnoutRisk: number
  messageVolume: number
  crossTeamPercentage: number
  lateNightPercentage: number
  blameScore: number
}

export interface Mutation {
  type: 'silos' | 'burnout' | 'trust_erosion'
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
  status: 'healthy' | 'warning' | 'critical' | 'recovery'
  metrics: WeekMetrics
  mutations: Mutation[]
  diagnosis: Diagnosis
  sampleMessages: Message[]
  messageCount: number
}

export interface Simulation {
  id: string
  createdAt: string
  weeks: WeekData[]
}

export type OrgState = 'healthy' | 'warning' | 'critical' | 'recovery'
