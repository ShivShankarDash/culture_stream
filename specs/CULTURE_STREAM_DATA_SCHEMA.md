# Culture Stream - Data Schema & Message Templates

## 📊 Core Data Structures

### 1. Organization Config

```json
{
  "org": {
    "name": "TechCorp",
    "size": 15,
    "teams": [
      { "id": "eng", "name": "Engineering", "members": 5 },
      { "id": "product", "name": "Product", "members": 3 },
      { "id": "design", "name": "Design", "members": 2 },
      { "id": "devops", "name": "DevOps", "members": 2 },
      { "id": "marketing", "name": "Marketing", "members": 3 }
    ],
    "channels": [
      { "id": "general", "name": "#general", "type": "cross-team", "members": 15 },
      { "id": "eng", "name": "#engineering", "type": "team-specific", "members": 5 },
      { "id": "product", "name": "#product", "type": "team-specific", "members": 3 },
      { "id": "design", "name": "#design", "type": "team-specific", "members": 2 },
      { "id": "devops", "name": "#devops", "type": "team-specific", "members": 2 },
      { "id": "random", "name": "#random", "type": "casual", "members": 15 }
    ]
  }
}
```

### 2. User Object

```json
{
  "id": "user_1",
  "name": "Alice Chen",
  "team": "engineering",
  "role": "Senior Engineer",
  "slack_handle": "@alice"
}
```

### 3. Message Object

```json
{
  "id": "msg_001",
  "week": 1,
  "timestamp": "2025-01-02T09:30:00Z",
  "userId": "user_1",
  "userName": "Alice Chen",
  "userTeam": "engineering",
  "channelId": "product",
  "channelName": "#product",
  "text": "Hey @bob, can we sync on the API design?",
  "sentiment": 0.75,
  "sentiment_keywords": ["sync", "can we", "?"],
  "mentions": ["user_3"],
  "mentioned_teams": ["product"],
  "cross_team": true,
  "time_of_day": "morning",
  "hour_of_day": 9,
  "is_weekend": false,
  "is_late_night": false,
  "message_type": "question"
}
```

### 4. Metrics Object

```json
{
  "week": 1,
  "timestamp": "2025-01-08T23:59:59Z",
  "silos_score": 0.10,
  "sentiment": 0.75,
  "response_time_hours": 3.5,
  "burnout_risk": 0.05,
  "message_volume": 87,
  "active_users": 12,
  "active_channels": 5,
  "late_night_message_count": 2,
  "weekend_message_count": 5,
  "cross_team_percentage": 40,
  "blame_language_score": 0.05,
  "question_percentage": 35,
  "sarcasm_percentage": 5
}
```

### 5. Mutation Object

```json
{
  "type": "silos",
  "week_detected": 3,
  "severity": "warning",
  "metric": "silos_score",
  "threshold": 0.30,
  "current_value": 0.30,
  "baseline_value": 0.10,
  "change_percentage": 200,
  "message": "Cross-team collaboration ↓ 40%",
  "root_causes": [
    "Product and engineering channels isolated",
    "No mentions between teams",
    "Separate meeting times"
  ],
  "evidence_messages": [
    "msg_045: 'This is an engineering problem, not product's concern'",
    "msg_087: '@engineering we need this API change'",
    "msg_102: 'Product decided without asking us'"
  ],
  "suggestions": [
    "Implement cross-team sync meetings",
    "Require cross-team reviews",
    "Shared roadmap visibility"
  ]
}
```

### 6. Simulation Object

```json
{
  "id": "sim_abc123",
  "created_at": "2025-01-02T00:00:00Z",
  "org_config": {},
  "week_1_metrics": {},
  "weeks": [
    { "week": 1, "messages": [...], "metrics": {...}, "mutations": [] },
    { "week": 2, "messages": [...], "metrics": {...}, "mutations": [] },
    // ... weeks 3-8
  ],
  "narrative": {
    "week_1": "Healthy baseline established...",
    "week_3": "Silos beginning to form...",
    // etc.
  }
}
```

---

## 💬 Message Templates by State & Week

### HEALTHY (Weeks 1-2)
**Sentiment: 0.70-0.80**
**Cross-team %: 40%**
**Late-night %: 0%**

```json
[
  "Hey @{other_team}, can we sync on {topic}?",
  "@{person} great point! I didn't think of that.",
  "Thanks for catching that bug {name}. Learned something new!",
  "Let's do a quick call to align on {task}.",
  "@{team} heads up, we're shipping {feature} next week.",
  "I appreciate your feedback {name}. Let me revise.",
  "Who wants to pair on {problem}? I'm stuck.",
  "Can someone explain how {system} works? I'm new to it.",
  "@{other_team} we should coordinate on this.",
  "Great work everyone on the launch 🎉",
  "Off for the day, back tomorrow morning!",
  "Anyone free for a quick standup?",
  "@{person} thanks for the help yesterday!",
  "Love this approach. Why didn't we think of it sooner?",
  "Questions? Happy to clarify in slack or call."
]
```

### WARNING (Week 3)
**Sentiment: 0.60-0.70**
**Cross-team %: 25%**
**Late-night %: 5%**

Introduce: Less cross-team collaboration, initial stress

```json
[
  "{Team} handles {task}, not our concern.",
  "Engineering team, let's handle this ourselves.",
  "@{other_team} we have different priorities.",
  "Seems like product isn't listening to our constraints.",
  "We're stretched thin. Need to focus on our backlog.",
  "Why is design always asking for changes late?",
  "@{person} can you check with your team first?",
  "We probably don't have bandwidth for this.",
  "No one else understands our codebase anyway.",
  "Product keeps changing requirements.",
  "Let's just ship what we planned.",
  "Design decisions are ours, not shared.",
  "Marketing doesn't get how hard this is.",
  "DevOps issues are their problem.",
  "Another meeting? We're already packed.",
  "Slack message at 9:30 PM: working late tonight"
]
```

### CRITICAL (Weeks 5-6)
**Sentiment: 0.30-0.45**
**Cross-team %: 15%**
**Late-night %: 20%**

Introduce: Blame language, hostility, late-night desperation

```json
[
  "@devops you broke the build AGAIN.",
  "Engineering deployed broken code. Classic.",
  "Product has NO idea what's feasible.",
  "Why is design making decisions without us?",
  "@{person} this is your fault, not mine.",
  "I'm working at 2 AM because nobody helps.",
  "This is a disaster. Engineering can't ship anything.",
  "Marketing overpromised again.",
  "@{team} figure your own stuff out.",
  "Nobody cares about our constraints.",
  "The blame game never ends here.",
  "Why do I even bother suggesting things?",
  "DevOps is incompetent.",
  "Design is out of touch.",
  "Product doesn't listen to feedback.",
  "Everyone's looking out for themselves only.",
  "Working at 3 AM. This place is broken.",
  "I hate these meetings. Waste of time.",
  "@{person} you're being defensive again.",
  "Nobody trusts anyone here.",
  "I'm looking for a new job.",
  "This team is toxic.",
  "Emergency: Database down, who's responsible?",
  "Slack message at 11:47 PM: still debugging",
  "Sunday 6 AM: Checking if anyone fixed this"
]
```

### RECOVERY (Weeks 7-8)
**Sentiment: 0.65-0.75**
**Cross-team %: 35%**
**Late-night %: 2%**

Introduce: Apologies, gratitude, collaboration resumes

```json
[
  "@{other_team} let's pair on this together.",
  "Thanks for your patience while we fix this.",
  "Learned a lot from the retro. Let's improve.",
  "Sorry for snapping yesterday. I was stressed.",
  "@{person} great idea! How can we collaborate?",
  "Product and engineering alignment call next week?",
  "I appreciate everyone's effort in recovery.",
  "Clear meeting agenda shared 24h in advance.",
  "Let's respect everyone's async hours.",
  "No meetings after 6 PM. New policy working great.",
  "Cross-team review process launched.",
  "Great collaboration on {feature}!",
  "Transparent roadmap shared with all teams.",
  "Thanks @devops for that fix.",
  "@design your perspective really helped.",
  "I was wrong about that. You were right.",
  "Looking forward to working with you again.",
  "Team morale is improving. Great work everyone.",
  "Let's celebrate the progress we've made.",
  "Excited about our new async-first approach.",
  "Working within office hours now. So much better.",
  "Great questions! I'd love to collaborate.",
  "Let's find a solution that works for everyone.",
  "You're doing great, don't give up.",
  "Team gratitude post: awesome job this week!"
]
```

---

## 📈 Metrics Progression by Week

### Week 1 (Baseline - Healthy)
```json
{
  "silos_score": 0.10,
  "sentiment": 0.75,
  "response_time_hours": 3.5,
  "burnout_risk": 0.05,
  "message_volume": 87,
  "cross_team_percentage": 40,
  "late_night_percentage": 0,
  "blame_score": 0.05,
  "question_percentage": 35
}
```

### Week 2 (Healthy)
```json
{
  "silos_score": 0.12,
  "sentiment": 0.73,
  "response_time_hours": 3.8,
  "burnout_risk": 0.08,
  "message_volume": 92,
  "cross_team_percentage": 38,
  "late_night_percentage": 1,
  "blame_score": 0.06,
  "question_percentage": 33
}
```

### Week 3 (Warning - Silos Forming)
```json
{
  "silos_score": 0.30,
  "sentiment": 0.65,
  "response_time_hours": 5.0,
  "burnout_risk": 0.15,
  "message_volume": 95,
  "cross_team_percentage": 25,
  "late_night_percentage": 5,
  "blame_score": 0.12,
  "question_percentage": 28
}
```

### Week 4 (Warning - Silos Intensify)
```json
{
  "silos_score": 0.40,
  "sentiment": 0.60,
  "response_time_hours": 6.0,
  "burnout_risk": 0.25,
  "message_volume": 88,
  "cross_team_percentage": 20,
  "late_night_percentage": 8,
  "blame_score": 0.20,
  "question_percentage": 22
}
```

### Week 5 (Critical - Burnout & Trust)
```json
{
  "silos_score": 0.55,
  "sentiment": 0.35,
  "response_time_hours": 8.0,
  "burnout_risk": 0.45,
  "message_volume": 102,
  "cross_team_percentage": 15,
  "late_night_percentage": 18,
  "blame_score": 0.55,
  "question_percentage": 12
}
```

### Week 6 (Critical Peak, Then Turning)
```json
{
  "silos_score": 0.58,
  "sentiment": 0.32,
  "response_time_hours": 8.5,
  "burnout_risk": 0.50,
  "message_volume": 95,
  "cross_team_percentage": 14,
  "late_night_percentage": 20,
  "blame_score": 0.60,
  "question_percentage": 10
}
```

### Week 7 (Recovery Starting)
```json
{
  "silos_score": 0.45,
  "sentiment": 0.50,
  "response_time_hours": 7.0,
  "burnout_risk": 0.35,
  "message_volume": 98,
  "cross_team_percentage": 25,
  "late_night_percentage": 10,
  "blame_score": 0.35,
  "question_percentage": 18
}
```

### Week 8 (Recovered)
```json
{
  "silos_score": 0.18,
  "sentiment": 0.68,
  "response_time_hours": 4.0,
  "burnout_risk": 0.12,
  "message_volume": 90,
  "cross_team_percentage": 35,
  "late_night_percentage": 2,
  "blame_score": 0.08,
  "question_percentage": 30
}
```

---

## 🔍 Sentiment Analysis Keywords

### Positive (Add +0.1 to base sentiment)
```
"thanks", "appreciate", "great", "love", "awesome", "perfect",
"excited", "amazing", "brilliant", "help", "support", "collaborate",
"learned", "improved", "happy", "yes", "agree", "👍", "❤️", "🎉",
"exactly", "well said", "great point", "nice work", "good catch"
```

### Negative (Subtract -0.15 from base sentiment)
```
"blame", "fault", "broken", "useless", "terrible", "hate", "stupid",
"incompetent", "toxic", "disaster", "useless", "wasted", "frustrated",
"angry", "😤", "😠", "🙄", "sarcasm_marker", "why bother", "give up",
"pointless", "broken", "never works", "you're wrong", "that's stupid"
```

### Neutral (No change)
```
"meeting", "sync", "update", "status", "daily", "sprint", "task",
"deadline", "release", "customer", "product", "engineering", "design"
```

---

## 🎯 Mutation Thresholds

### Silo Mutation
```
Triggers when:
- silos_score > 0.30 (warning)
- silos_score > 0.50 (critical)

Indicators:
- Cross-team messages drop below 25% (warning) / 15% (critical)
- No @mentions between teams for 2+ days
- Separate channels become isolated (message activity concentrated)
```

### Burnout Mutation
```
Triggers when:
- response_time_hours > 5 (warning)
- response_time_hours > 7 (critical)
- burnout_risk > 0.30

Indicators:
- Late-night messages spike (> 10% of messages)
- Weekend activity increases (> 5% of messages)
- Gaps in communication (4+ hour delays)
- Short, terse messages (reply fatigue)
```

### Trust Erosion Mutation
```
Triggers when:
- sentiment < 0.60 (warning)
- sentiment < 0.40 (critical)
- blame_score > 0.20

Indicators:
- Blame language spikes
- Questions drop below 20% (people stop asking)
- Sarcasm/defensive tone increases
- Negative emoji usage (😤, 😠, 🙄)
```

---

## 📋 Message Generation Algorithm

### For a given week, generate messages following this pattern:

```javascript
function generateWeekMessages(weekNumber) {
  const state = getStateForWeek(weekNumber);
  // state: "healthy" | "warning" | "critical" | "recovery"
  
  const messageCount = 85 + Math.random() * 30;  // 85-115 messages
  const messages = [];
  
  for (let i = 0; i < messageCount; i++) {
    const user = randomUser();
    const channel = randomChannel(user.team, state);
    const template = randomTemplate(state);
    const text = fillTemplate(template, user, channel);
    
    const message = {
      id: `msg_${weekNumber}_${i}`,
      week: weekNumber,
      timestamp: randomTimestampInWeek(weekNumber, state),
      userId: user.id,
      userName: user.name,
      userTeam: user.team,
      channelId: channel.id,
      channelName: channel.name,
      text: text,
      sentiment: calculateSentiment(text, state),
      mentions: extractMentions(text),
      mentioned_teams: extractTeams(mentions),
      cross_team: isCrossTeam(user.team, channel, mentions),
      time_of_day: getTimeOfDay(timestamp),
      is_late_night: timestamp.hour >= 22 || timestamp.hour < 6,
      is_weekend: timestamp.day === 0 || timestamp.day === 6
    };
    
    messages.push(message);
  }
  
  return messages;
}
```

---

## 🚀 Implementation Checklist (Backend Dev)

- [ ] Create `users.json` with 15 users across 5 teams
- [ ] Create `channels.json` with 6 channels
- [ ] Create `healthyTemplates.json`, `warningTemplates.json`, etc.
- [ ] Build `messageGenerator.js` that generates week 1-8 messages
- [ ] Build `metricsCalculator.js` that calculates metrics from messages
- [ ] Build `mutationDetector.js` that detects silos/burnout/trust
- [ ] Build API endpoint to generate simulation
- [ ] Build API endpoint to fetch week data
- [ ] Test: Verify week 1 metrics are correct
- [ ] Test: Verify week 5 shows mutations
- [ ] Test: Verify week 8 recovery works

---

Use these templates as your source of truth. Good luck! 🚀
