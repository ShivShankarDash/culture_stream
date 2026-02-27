import type { Mutation, WeekMetrics } from '../types'

export function detectMutations(metrics: WeekMetrics): Mutation[] {
  const mutations: Mutation[] = []

  // Silo detection
  if (metrics.silosScore > 0.25) {
    mutations.push({
      type: 'silos',
      severity: metrics.silosScore > 0.50 ? 'critical' : 'warning',
      message: `Cross-team collaboration ↓ ${Math.round((1 - metrics.crossTeamPercentage / 40) * 100)}%`,
      trigger: metrics.silosScore,
    })
  }

  // Burnout detection
  if (metrics.responseTimeHours > 5 || metrics.burnoutRisk > 0.30) {
    mutations.push({
      type: 'burnout',
      severity: metrics.responseTimeHours > 7 ? 'critical' : 'warning',
      message: `Team disengagement: Response time ${metrics.responseTimeHours}h (baseline 3.5h)`,
      trigger: metrics.responseTimeHours,
    })
  }

  // Trust erosion
  if (metrics.sentiment < 0.55) {
    mutations.push({
      type: 'trust_erosion',
      severity: metrics.sentiment < 0.40 ? 'critical' : 'warning',
      message: `Hostile tone detected: Sentiment ${metrics.sentiment.toFixed(2)} (baseline 0.75)`,
      trigger: metrics.sentiment,
    })
  }

  return mutations
}
