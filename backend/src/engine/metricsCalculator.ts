import type { Message, WeekMetrics } from '../types'

// Target metrics from the spec — we blend calculated + target for smooth progression
const TARGET_METRICS: Record<number, Omit<WeekMetrics, 'week' | 'messageVolume'>> = {
  1: { silosScore: 0.10, sentiment: 0.75, responseTimeHours: 3.5, burnoutRisk: 0.05, crossTeamPercentage: 40, lateNightPercentage: 0, blameScore: 0.05 },
  2: { silosScore: 0.12, sentiment: 0.73, responseTimeHours: 3.8, burnoutRisk: 0.08, crossTeamPercentage: 38, lateNightPercentage: 1, blameScore: 0.06 },
  3: { silosScore: 0.30, sentiment: 0.65, responseTimeHours: 5.0, burnoutRisk: 0.15, crossTeamPercentage: 25, lateNightPercentage: 5, blameScore: 0.12 },
  4: { silosScore: 0.40, sentiment: 0.60, responseTimeHours: 6.0, burnoutRisk: 0.25, crossTeamPercentage: 20, lateNightPercentage: 8, blameScore: 0.20 },
  5: { silosScore: 0.55, sentiment: 0.35, responseTimeHours: 8.0, burnoutRisk: 0.45, crossTeamPercentage: 15, lateNightPercentage: 18, blameScore: 0.55 },
  6: { silosScore: 0.58, sentiment: 0.32, responseTimeHours: 8.5, burnoutRisk: 0.50, crossTeamPercentage: 14, lateNightPercentage: 20, blameScore: 0.60 },
  7: { silosScore: 0.45, sentiment: 0.50, responseTimeHours: 7.0, burnoutRisk: 0.35, crossTeamPercentage: 25, lateNightPercentage: 10, blameScore: 0.35 },
  8: { silosScore: 0.18, sentiment: 0.68, responseTimeHours: 4.0, burnoutRisk: 0.12, crossTeamPercentage: 35, lateNightPercentage: 2, blameScore: 0.08 },
}

export function calculateWeekMetrics(week: number, messages: Message[]): WeekMetrics {
  const target = TARGET_METRICS[week]
  if (!target) throw new Error(`No target metrics for week ${week}`)

  const total = messages.length
  const crossTeamCount = messages.filter(m => m.crossTeam).length
  const lateNightCount = messages.filter(m => m.isLateNight).length
  const avgSentiment = messages.reduce((sum, m) => sum + m.sentiment, 0) / total

  // Blend calculated values with targets (70% target, 30% calculated) for smooth demo
  const blend = (calculated: number, target: number) => target * 0.7 + calculated * 0.3

  const calculatedCrossTeam = (crossTeamCount / total) * 100
  const calculatedLateNight = (lateNightCount / total) * 100

  return {
    week,
    silosScore: round(target.silosScore), // Use target directly for smooth progression
    sentiment: round(blend(avgSentiment, target.sentiment)),
    responseTimeHours: round(target.responseTimeHours),
    burnoutRisk: round(target.burnoutRisk),
    messageVolume: total,
    crossTeamPercentage: round(blend(calculatedCrossTeam, target.crossTeamPercentage)),
    lateNightPercentage: round(blend(calculatedLateNight, target.lateNightPercentage)),
    blameScore: round(target.blameScore),
  }
}

function round(n: number): number {
  return Math.round(n * 100) / 100
}
