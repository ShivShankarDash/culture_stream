import type { Message, OrgState, User } from '../types'
import { USERS, CHANNELS } from '../data/orgConfig'
import { TEMPLATES, TOPICS, FEATURES } from '../data/messageTemplates'

const WEEK_STATES: OrgState[] = [
  'healthy', 'healthy', 'warning', 'warning',
  'critical', 'critical', 'recovery', 'recovery',
]

// Cross-team message probability by state
const CROSS_TEAM_RATIO: Record<OrgState, number> = {
  healthy: 0.40,
  warning: 0.25,
  critical: 0.15,
  recovery: 0.35,
}

// Late-night message probability by state
const LATE_NIGHT_RATIO: Record<OrgState, number> = {
  healthy: 0.02,
  warning: 0.08,
  critical: 0.20,
  recovery: 0.04,
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getUsersFromOtherTeam(user: User): User[] {
  return USERS.filter(u => u.team !== user.team)
}

function fillTemplate(template: string, sender: User, other: User): string {
  return template
    .replace(/{other}/g, other.name)
    .replace(/{team}/g, `#${sender.team}`)
    .replace(/{topic}/g, pick(TOPICS))
    .replace(/{feature}/g, pick(FEATURES))
}

function generateTimestamp(week: number, state: OrgState): string {
  const baseDate = new Date('2025-01-06') // Monday of week 1
  const weekOffset = (week - 1) * 7
  const dayOffset = randInt(0, 6)
  const isLateNight = Math.random() < LATE_NIGHT_RATIO[state]

  let hour: number
  if (isLateNight) {
    hour = Math.random() < 0.5 ? randInt(22, 23) : randInt(0, 5)
  } else {
    hour = randInt(8, 18)
  }

  const date = new Date(baseDate)
  date.setDate(date.getDate() + weekOffset + dayOffset)
  date.setHours(hour, randInt(0, 59), randInt(0, 59))
  return date.toISOString()
}

export function getStateForWeek(week: number): OrgState {
  return WEEK_STATES[week - 1] || 'healthy'
}

export function generateWeekMessages(week: number): Message[] {
  const state = getStateForWeek(week)
  const count = randInt(85, 115)
  const templates = TEMPLATES[state]
  const crossTeamRatio = CROSS_TEAM_RATIO[state]
  const messages: Message[] = []

  for (let i = 0; i < count; i++) {
    const sender = pick(USERS)
    const isCrossTeam = Math.random() < crossTeamRatio
    const otherUsers = isCrossTeam ? getUsersFromOtherTeam(sender) : USERS.filter(u => u.team === sender.team && u.id !== sender.id)
    const other = otherUsers.length > 0 ? pick(otherUsers) : pick(USERS)

    // Pick channel: cross-team goes to #general or other team's channel
    let channel
    if (isCrossTeam) {
      channel = Math.random() < 0.5
        ? CHANNELS.find(c => c.id === 'general')!
        : pick(CHANNELS.filter(c => c.type !== 'team-specific' || c.id !== sender.team))
    } else {
      const teamChannel = CHANNELS.find(c => c.id === sender.team)
      channel = teamChannel || pick(CHANNELS)
    }

    const template = pick(templates)
    const text = fillTemplate(template, sender, other)
    const timestamp = generateTimestamp(week, state)
    const hour = new Date(timestamp).getHours()
    const day = new Date(timestamp).getDay()

    messages.push({
      id: `msg_${week}_${i}`,
      week,
      timestamp,
      userId: sender.id,
      userName: sender.name,
      userTeam: sender.team,
      channelId: channel.id,
      channelName: channel.name,
      text,
      sentiment: calculateMessageSentiment(text, state),
      crossTeam: isCrossTeam,
      mentions: [other.id],
      isLateNight: hour >= 22 || hour < 6,
      isWeekend: day === 0 || day === 6,
    })
  }

  // Sort by timestamp
  messages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
  return messages
}

function calculateMessageSentiment(text: string, state: OrgState): number {
  const positive = ['thanks', 'great', 'appreciate', 'love', 'awesome', 'help', 'collaborate', 'learned', 'improved', '🎉', 'nice', 'good']
  const negative = ['blame', 'fault', 'broken', 'useless', 'terrible', 'hate', 'incompetent', 'toxic', 'disaster', 'frustrated', 'defensive', 'waste']

  const lower = text.toLowerCase()
  let score = { healthy: 0.75, warning: 0.62, critical: 0.35, recovery: 0.65 }[state]

  for (const word of positive) {
    if (lower.includes(word)) score += 0.05
  }
  for (const word of negative) {
    if (lower.includes(word)) score -= 0.08
  }

  // Add some noise
  score += (Math.random() - 0.5) * 0.1
  return Math.max(0, Math.min(1, score))
}
