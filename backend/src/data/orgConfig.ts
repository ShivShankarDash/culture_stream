import type { User, Channel } from '../types'

export const USERS: User[] = [
  { id: 'u1', name: 'Alice Chen', team: 'engineering', role: 'Senior Engineer', slackHandle: '@alice' },
  { id: 'u2', name: 'Bob Kumar', team: 'engineering', role: 'Engineer', slackHandle: '@bob' },
  { id: 'u3', name: 'Carol Zhang', team: 'engineering', role: 'Tech Lead', slackHandle: '@carol' },
  { id: 'u4', name: 'Dan Patel', team: 'engineering', role: 'Engineer', slackHandle: '@dan' },
  { id: 'u5', name: 'Eve Santos', team: 'engineering', role: 'Junior Engineer', slackHandle: '@eve' },
  { id: 'u6', name: 'Frank Lee', team: 'product', role: 'Product Manager', slackHandle: '@frank' },
  { id: 'u7', name: 'Grace Kim', team: 'product', role: 'Product Analyst', slackHandle: '@grace' },
  { id: 'u8', name: 'Hiro Tanaka', team: 'product', role: 'Product Owner', slackHandle: '@hiro' },
  { id: 'u9', name: 'Iris Novak', team: 'design', role: 'Lead Designer', slackHandle: '@iris' },
  { id: 'u10', name: 'Jake Rivera', team: 'design', role: 'UX Designer', slackHandle: '@jake' },
  { id: 'u11', name: 'Kara Singh', team: 'devops', role: 'DevOps Lead', slackHandle: '@kara' },
  { id: 'u12', name: 'Leo Müller', team: 'devops', role: 'SRE', slackHandle: '@leo' },
  { id: 'u13', name: 'Maya Johnson', team: 'marketing', role: 'Marketing Lead', slackHandle: '@maya' },
  { id: 'u14', name: 'Nate Williams', team: 'marketing', role: 'Content Writer', slackHandle: '@nate' },
  { id: 'u15', name: 'Olivia Brown', team: 'marketing', role: 'Growth Manager', slackHandle: '@olivia' },
]

export const CHANNELS: Channel[] = [
  { id: 'general', name: '#general', type: 'cross-team' },
  { id: 'engineering', name: '#engineering', type: 'team-specific' },
  { id: 'product', name: '#product', type: 'team-specific' },
  { id: 'design', name: '#design', type: 'team-specific' },
  { id: 'devops', name: '#devops', type: 'team-specific' },
  { id: 'random', name: '#random', type: 'casual' },
]

export const TEAMS = ['engineering', 'product', 'design', 'devops', 'marketing'] as const
