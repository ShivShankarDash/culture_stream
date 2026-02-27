import type { Diagnosis, Mutation, OrgState } from '../types'

interface NarrativeEntry {
  current: string
  suggestion: string
  steps: string[]
}

const NARRATIVES: Record<number, NarrativeEntry> = {
  1: {
    current: 'Healthy baseline. Teams collaborate across boundaries.',
    suggestion: 'Maintain current collaboration practices.',
    steps: [
      'Continue regular cross-team standups',
      'Encourage open-door policy across departments',
      'Recognize collaborative efforts in team meetings',
    ],
  },
  2: {
    current: 'Baseline collaboration maintained. No anomalies detected.',
    suggestion: 'Continue team building activities.',
    steps: [
      'Schedule informal cross-team coffee chats',
      'Share wins across channels to build visibility',
      'Rotate meeting facilitators across teams',
    ],
  },
  3: {
    current: 'Cross-team communication declining. Product and Engineering channels isolating.',
    suggestion: 'Host cross-team sync meetings immediately.',
    steps: [
      'Schedule a joint Product-Engineering sync this week',
      'Create a shared Slack channel for cross-team updates',
      'Leadership should model cross-team collaboration publicly',
      'Review and reduce team-specific meetings that exclude others',
    ],
  },
  4: {
    current: 'Silos intensifying. No @mentions between teams for 2+ days.',
    suggestion: 'Implement team rotation programs.',
    steps: [
      'Pair engineers with product members on feature specs',
      'Introduce a weekly cross-team demo session',
      'Leadership to address silo concerns in all-hands',
      'Assign cross-functional ownership for key initiatives',
      'Set up shared OKRs that require inter-team collaboration',
    ],
  },
  5: {
    current: 'Team morale collapsing. Late-night messages spike. Blame language emerging.',
    suggestion: 'Emergency team retro — address burnout and trust breakdown.',
    steps: [
      'Call an emergency all-hands to acknowledge the situation',
      'Implement a no-meetings-after-6pm policy immediately',
      'Leadership to take ownership and avoid blame language',
      'Offer mental health support and encourage time off',
      'Pause non-critical projects to reduce workload',
      'Set up anonymous feedback channels for safe expression',
    ],
  },
  6: {
    current: 'Peak toxicity. Complete team isolation. Blame threads dominating channels.',
    suggestion: 'Leadership reset: define new values, enforce boundaries.',
    steps: [
      'Leadership must publicly acknowledge the cultural breakdown',
      'Establish clear communication guidelines and enforce them',
      'Remove toxic threads and address individuals privately',
      'Bring in a neutral facilitator for team mediation',
      'Redefine team values collaboratively with all members',
      'Enforce strict work-life boundaries — no weekend messages',
      'Create a recovery roadmap with measurable milestones',
    ],
  },
  7: {
    current: 'Leadership intervention active. Cross-team retros and async-first policy launched.',
    suggestion: 'Continue recovery: team rotation, async-first communication.',
    steps: [
      'Maintain the async-first communication policy',
      'Continue cross-team retrospectives bi-weekly',
      'Celebrate small wins to rebuild morale',
      'Monitor sentiment closely for regression signs',
      'Gradually reintroduce collaborative projects',
    ],
  },
  8: {
    current: 'Culture recovering. Normal collaboration restored. Trust rebuilding.',
    suggestion: 'Celebrate recovery, document lessons learned.',
    steps: [
      'Host a team celebration to mark the recovery milestone',
      'Document the crisis and recovery as organizational learning',
      'Establish early-warning metrics to prevent future breakdowns',
      'Create a culture health dashboard for ongoing monitoring',
      'Schedule quarterly culture check-ins with leadership',
    ],
  },
}

export function generateDiagnosis(week: number, mutations: Mutation[]): Diagnosis & { steps: string[] } {
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
    steps: narrative.steps,
  }
}

export function getWeekStatus(week: number): OrgState {
  const map: OrgState[] = ['healthy', 'healthy', 'warning', 'warning', 'critical', 'critical', 'recovery', 'recovery']
  return map[week - 1] || 'healthy'
}
