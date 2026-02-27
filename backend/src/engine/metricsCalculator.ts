import type { MessageMetrics, WeekMetrics } from '../types'

function average(values: number[]): number {
  if (!values.length) return 0
  const sum = values.reduce((acc, v) => acc + v, 0)
  return sum / values.length
}

function round(n: number): number {
  return Math.round(n * 100) / 100
}

/**
 * Aggregate per-message metrics (from GPT) into a single WeekMetrics object.
 */
export function aggregateWeekMetrics(week: number, metrics: MessageMetrics[]): WeekMetrics {
  const total = metrics.length

  return {
    week,
    silosScore: round(average(metrics.map((m) => m.silosScore))),
    sentiment: round(average(metrics.map((m) => m.sentiment))),
    responseTimeHours: round(average(metrics.map((m) => m.responseTimeHours))),
    burnoutRisk: round(average(metrics.map((m) => m.burnoutRisk))),
    messageVolume: total,
    crossTeamPercentage: round(average(metrics.map((m) => m.crossTeamPercentage))),
    lateNightPercentage: round(average(metrics.map((m) => m.lateNightPercentage))),
    blameScore: round(average(metrics.map((m) => m.blameScore))),
    trustScore: round(average(metrics.map((m) => m.trustScore))),
    productivity: round(average(metrics.map((m) => m.productivity))),
    wlb: round(average(metrics.map((m) => m.wlb))),
    workSatisfaction: round(average(metrics.map((m) => m.workSatisfaction))),
  }
}

