import type { Diagnosis, Mutation, OrgState } from '../types'

const NARRATIVES: Record<number, { current: string; suggestion: string }> = {
  1: { current: 'Healthy baseline. Teams collaborate across boundaries.', suggestion: 'Maintain current collaboration practices.' },
  2: { current: 'Baseline collaboration maintained. No anomalies detected.', suggestion: 'Continue team building activities.' },
  3: { current: 'Cross-team communication declining. Product and Engineering channels isolating.', suggestion: 'Host cross-team sync meetings immediately.' },
  4: { current: 'Silos intensifying. No @mentions between teams for 2+ days.', suggestion: 'Implement team rotation programs.' },
  5: { current: 'Team morale collapsing. Late-night messages spike. Blame language emerging.', suggestion: 'Emergency team retro — address burnout and trust breakdown.' },
  6: { current: 'Peak toxicity. Complete team isolation. Blame threads dominating channels.', suggestion: 'Leadership reset: define new values, enforce boundaries.' },
  7: { current: 'Leadership intervention active. Cross-team retros and async-first policy launched.', suggestion: 'Continue recovery: team rotation, async-first communication.' },
  8: { current: 'Culture recovering. Normal collaboration restored. Trust rebuilding.', suggestion: 'Celebrate recovery, document lessons learned.' },
}

export function generateDiagnosis(week: number, mutations: Mutation[]): Diagnosis {
  const narrative = NARRATIVES[week] || NARRATIVES[1]

  let alert: string | null = null
  if (mutations.length > 0) {
    const types = mutations.map(m => {
      switch (m.type) {
        case 'silos': return 'Silo Formation'
        case 'burnout': return 'Burnout Risk'
        case 'trust_erosion': return 'Trust Erosion'
      }
    })
    alert = `MUTATION DETECTED: ${types.join(', ')}`
  }

  return {
    current: narrative.current,
    alert,
    suggestion: narrative.suggestion,
  }
}

export function getWeekStatus(week: number): OrgState {
  const map: OrgState[] = ['healthy', 'healthy', 'warning', 'warning', 'critical', 'critical', 'recovery', 'recovery']
  return map[week - 1] || 'healthy'
}
