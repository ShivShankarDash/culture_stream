import type { OrgState } from '../types'

const HEALTHY: string[] = [
  "Hey {other}, can we sync on {topic}?",
  "{other} great point! I didn't think of that.",
  "Thanks for catching that bug {other}. Learned something new!",
  "Let's do a quick call to align on {topic}.",
  "{team} heads up, we're shipping {feature} next week.",
  "I appreciate your feedback {other}. Let me revise.",
  "Who wants to pair on {topic}? I'm stuck.",
  "Can someone explain how {feature} works? I'm new to it.",
  "{other} we should coordinate on this.",
  "Great work everyone on the launch 🎉",
  "Off for the day, back tomorrow morning!",
  "Anyone free for a quick standup?",
  "{other} thanks for the help yesterday!",
  "Love this approach. Why didn't we think of it sooner?",
  "Questions? Happy to clarify in slack or call.",
]

const WARNING: string[] = [
  "{team} handles {topic}, not our concern.",
  "Engineering team, let's handle this ourselves.",
  "{other} we have different priorities right now.",
  "Seems like product isn't listening to our constraints.",
  "We're stretched thin. Need to focus on our backlog.",
  "Why is design always asking for changes late?",
  "{other} can you check with your team first?",
  "We probably don't have bandwidth for this.",
  "No one else understands our codebase anyway.",
  "Product keeps changing requirements.",
  "Let's just ship what we planned.",
  "Design decisions are ours, not shared.",
  "Marketing doesn't get how hard this is.",
  "DevOps issues are their problem.",
  "Another meeting? We're already packed.",
  "Working late tonight, too much on my plate.",
]

const CRITICAL: string[] = [
  "{other} you broke the build AGAIN.",
  "Engineering deployed broken code. Classic.",
  "Product has NO idea what's feasible.",
  "Why is design making decisions without us?",
  "{other} this is your fault, not mine.",
  "I'm working at 2 AM because nobody helps.",
  "This is a disaster. Engineering can't ship anything.",
  "Marketing overpromised again.",
  "{team} figure your own stuff out.",
  "Nobody cares about our constraints.",
  "The blame game never ends here.",
  "Why do I even bother suggesting things?",
  "DevOps is incompetent.",
  "Design is out of touch.",
  "Product doesn't listen to feedback.",
  "Everyone's looking out for themselves only.",
  "Working at 3 AM. This place is broken.",
  "I hate these meetings. Waste of time.",
  "{other} you're being defensive again.",
  "Nobody trusts anyone here.",
  "This team is toxic.",
  "Emergency: system down, who's responsible?",
  "Still debugging at midnight...",
  "Sunday morning: checking if anyone fixed this.",
]

const RECOVERY: string[] = [
  "{other} let's pair on this together.",
  "Thanks for your patience while we fix this.",
  "Learned a lot from the retro. Let's improve.",
  "Sorry for snapping yesterday. I was stressed.",
  "{other} great idea! How can we collaborate?",
  "Product and engineering alignment call next week?",
  "I appreciate everyone's effort in recovery.",
  "Clear meeting agenda shared 24h in advance.",
  "Let's respect everyone's async hours.",
  "No meetings after 6 PM. New policy working great.",
  "Cross-team review process launched.",
  "Great collaboration on {feature}!",
  "Transparent roadmap shared with all teams.",
  "Thanks {other} for that fix.",
  "{other} your perspective really helped.",
  "I was wrong about that. You were right.",
  "Looking forward to working with you again.",
  "Team morale is improving. Great work everyone.",
  "Let's celebrate the progress we've made.",
  "Working within office hours now. So much better.",
]

export const TEMPLATES: Record<OrgState, string[]> = {
  healthy: HEALTHY,
  warning: WARNING,
  critical: CRITICAL,
  recovery: RECOVERY,
}

export const TOPICS = [
  'the API redesign', 'sprint planning', 'the deployment pipeline',
  'user onboarding flow', 'database migration', 'the new dashboard',
  'performance optimization', 'the auth system', 'CI/CD setup',
  'the mobile release', 'customer feedback', 'the search feature',
]

export const FEATURES = [
  'user dashboard', 'notification system', 'analytics module',
  'payment integration', 'search engine', 'auth overhaul',
  'mobile app v2', 'admin panel', 'reporting tool',
]
