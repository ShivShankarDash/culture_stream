# 🎯 Culture Stream - Complete Build Specs (Summary for Quick Reference)

## At a Glance

**What:** Real-time culture mutation detector (behavioral signals + visualization)
**Timeline:** 48 hours (hackathon sprint)
**Demo:** 60-second animation showing 8-week degradation → recovery
**Team:** You (frontend + leadership) + backend dev + presenter
**Success:** Judges understand value + demo runs flawlessly

---

## The Product (One Paragraph)

Culture Stream detects organizational culture mutations before people quit. It analyzes behavioral signals from Slack (message patterns, timing, sentiment, collaboration) and alerts leaders to three specific mutations: **silos** (teams stop talking), **burnout** (engagement drops), and **trust erosion** (communication becomes hostile). By detecting these 6 weeks early, leaders have time to act with culture interventions instead of being surprised by resignations.

---

## The 60-Second Demo (What Judges See)

```
Week 1-2: Blue rope, tight bundle
  "Healthy organization, teams collaborate"

Week 3-4: Yellow rope, starting to fray (20%)
  "Cross-team collaboration drops 40%"
  "SILO FORMATION DETECTED"

Week 5-6: Red rope, heavily frayed (50-60%)
  "Multiple mutations: silos, burnout, trust erosion"
  "Blame language spikes, response time 8+ hours"
  "CRITICAL CULTURE BREAKDOWN"

Week 7-8: Orange rope → Blue rope (reintegrating)
  "Leadership intervention: retro, async-first policy"
  "Sentiment improving, collaboration resuming"
  "CULTURE RECOVERED in 6 weeks"

Final: Blue rope, tight again
  "Culture Health: 85% | Risk Score: 12% | Trend: ↗"
```

---

## The 3 Mutations (Exactly These)

| Mutation | When | Metrics | What It Looks Like |
|----------|------|---------|-------------------|
| **Silos** | Week 3-4 | Cross-team mentions ↓ 40% | Teams only talk to themselves, no collaboration |
| **Burnout** | Week 5-6 | Response time ↑ 8h, late-night spikes | People working 2-3 AM, giving up, disengaged |
| **Trust Erosion** | Week 5-6 | Sentiment ↓ 0.35, blame language ↑ | Messages become hostile, defensive, accusatory |

---

## Backend (Your Backend Dev Must Build)

### Core Engine (3 modules)

1. **Message Generator** (`messageGenerator.js`)
   - Input: week number (1-8)
   - Output: 85-115 realistic Slack-like messages
   - Features: Templated (fast), realistic (authentic), configurable by state

2. **Metrics Calculator** (`metricsCalculator.js`)
   - Input: array of messages
   - Output: `{ silos_score, sentiment, response_time_hours, burnout_risk, ... }`
   - Calculation: Aggregate patterns (not individuals)

3. **Mutation Detector** (`mutationDetector.js`)
   - Input: current week metrics vs. baseline
   - Output: `{ mutations: [...], suggestions: [...] }`
   - Rules: Silos > 0.30, Sentiment < 0.60, Response time > 5h

### API Endpoints (3 main)

```
POST /api/simulation/start
  → { simulation_id, week_1_data }

GET /api/simulation/{id}/week/{n}
  → { week, metrics, mutations, diagnosis, sample_messages }

GET /api/simulation/{id}/narrative
  → { story, interventions, timeline }
```

**Key requirement:** All responses < 500ms, deterministic (same seed = same data)

---

## Frontend (Your Job - Shiv)

### Core Components (4)

1. **Rope Animation** (Canvas)
   - Current: Loops through 5 states
   - **Enhancement:** Animate metrics-driven state transitions
   - State changes: Healthy → Warning → Critical → Recovery
   - Color mapping: Sentiment (0.75=blue, 0.35=red)
   - Fraying amount: Silos score (0.1=tight, 0.6=frayed)

2. **Metrics Display** (HTML)
   - Real-time bars for: Silos %, Sentiment, Response Time, Burnout Risk
   - Update every 7 seconds (each week transition)

3. **Diagnostic Box** (Hover)
   - Shows: Week #, Mutation type, Metrics, Root cause, Suggestion
   - Appears on right side during animation
   - Disappears when demo finishes

4. **Controls** (Buttons)
   - Start simulation, Pause, Reset, Speed control
   - Visual feedback (disabled during animation)

### Integration

- Fetch week data from backend every 7 seconds
- Animate rope state transitions smoothly (6-7 second per week)
- Update metrics display with API data
- Show hover boxes with mutation details
- Total demo duration: ~55 seconds

---

## Presenter (Your Team Member Must Do)

### Judge Q&A Script
- 10 anticipated questions + strong answers
- (See JUDGE_FAQ.md)
- Delivery: Confident, data-backed, honest about limitations

### Backup Materials
- Pre-recorded 60-second demo video (in case live breaks)
- 1-page explanation diagram (visual overview)
- Talking points (narrative for each week)
- Product slide deck (optional but good)

### Key Narrative
"Culture Stream detected mutations in Week 5. By Week 6, leaders could act. Now look at Week 8—culture recovered. This is 6 weeks of opportunity that most orgs miss."

---

## Data Structure Reference (Backend Dev)

### Message (What backend generates)
```json
{
  "id": "msg_001",
  "week": 1,
  "timestamp": "2025-01-02T09:30:00Z",
  "userId": "user_1",
  "userName": "Alice",
  "userTeam": "engineering",
  "channelId": "product",
  "text": "Hey @bob, can we sync on the API design?",
  "sentiment": 0.75,
  "cross_team": true,
  "is_late_night": false
}
```

### Metrics (What backend calculates)
```json
{
  "week": 1,
  "silos_score": 0.10,
  "sentiment": 0.75,
  "response_time_hours": 3.5,
  "burnout_risk": 0.05,
  "message_volume": 87,
  "cross_team_percentage": 40,
  "late_night_percentage": 0,
  "blame_score": 0.05
}
```

---

## Metrics Progression (Backend Must Follow This)

```
Week 1:  Silos 0.10, Sentiment 0.75, RT 3.5h (BASELINE)
Week 2:  Silos 0.12, Sentiment 0.73, RT 3.8h (Stable)
Week 3:  Silos 0.30, Sentiment 0.65, RT 5.0h ⚠️ WARNING
Week 4:  Silos 0.40, Sentiment 0.60, RT 6.0h ⚠️ WARNING
Week 5:  Silos 0.55, Sentiment 0.35, RT 8.0h 🚨 CRITICAL
Week 6:  Silos 0.58, Sentiment 0.32, RT 8.5h 🚨 CRITICAL
Week 7:  Silos 0.45, Sentiment 0.50, RT 7.0h ↗️ RECOVERY
Week 8:  Silos 0.18, Sentiment 0.68, RT 4.0h ✅ HEALTHY
```

**Smooth progression (not random jumps)**

---

## Message Templates by State (Backend Uses These)

### Healthy (Weeks 1-2)
- "Hey @{team}, can we sync on {topic}?"
- "Thanks for your help {name}!"
- "Great point! Why didn't we think of that?"

### Warning (Week 3)
- "{Team} handles that, not our problem."
- "Why is {other_team} always asking for changes?"
- "We're stretched thin on our own backlog."

### Critical (Weeks 5-6)
- "@devops you broke the build AGAIN!"
- "Working at 2 AM because nobody helps."
- "This team is toxic. I'm looking for a new job."

### Recovery (Weeks 7-8)
- "Sorry for snapping yesterday. Let's collaborate."
- "Great idea! How can we work together?"
- "Thanks for your patience. We're improving."

---

## 48-Hour Build Plan

### Day 1 (Hours 0-24)

**Hours 0-6 (Parallel Setup)**
- Backend: Express server + messageGenerator skeleton
- Frontend: Canvas skeleton + rope state machine
- Presenter: Judge Q&A outline

**Hours 6-12 (Core Logic)**
- Backend: Generate weeks 1-8, metrics calculation, mutation detection
- Frontend: API integration, metrics display, diagnostic box

**Hours 12-24 (Integration)**
- Both: End-to-end test, bug fixes, performance check
- Presenter: Judge script + backup video plan

### Day 2 (Hours 24-48)

**Hours 0-8 (Polish)**
- Backend: Unit tests, error handling, edge cases
- Frontend: Visual refinement, animations, responsiveness
- Presenter: Practice narrative, Q&A rehearsal

**Hours 8-16 (Demo Prep)**
- Live walkthrough (dry run)
- Fix remaining issues
- Pre-record backup video
- Test on presentation laptop

**Hours 16-24 (Hackathon)**
- Present to judges
- Answer questions
- Celebrate! 🎉

---

## Critical Success Criteria

✅ **Backend:**
- Messages are realistic (not robotic)
- Metrics follow progression (smooth degradation + recovery)
- API responses < 500ms
- Tests pass (80%+ coverage)

✅ **Frontend:**
- Rope animates smoothly (60fps)
- Metrics update correctly
- Hover boxes appear on cue
- No glitches on presentation laptop

✅ **Overall:**
- Demo runs 55 seconds without intervention
- Judges understand value without explanation
- Backup video exists (in case live fails)
- All 10 judge questions have strong answers

---

## Documentation Files (All Created in `/scratch/`)

| File | Purpose | Reader |
|------|---------|--------|
| `CULTURE_STREAM_COLLAB.md` | Collaboration guide + decisions | Everyone |
| `CULTURE_STREAM_TECH_SPEC.md` | Technical architecture | Backend + Frontend |
| `CULTURE_STREAM_DATA_SCHEMA.md` | Data formats + templates | Backend (primary) |
| `CULTURE_STREAM_JUDGE_FAQ.md` | Judge Q&A + answers | Presenter |
| `CULTURE_STREAM_GITHUB_SETUP.md` | Repo setup guide | Everyone |
| `CULTURE_STREAM_GUIDE.md` | Complete collaboration summary | Everyone |
| **THIS FILE** | Quick reference | Everyone |

---

## How to Use This (Right Now)

1. **Read this file** (2 min) — Get oriented
2. **Read CULTURE_STREAM_TECH_SPEC.md** (15 min) — Understand architecture
3. **Backend dev starts** with message generator (CULTURE_STREAM_DATA_SCHEMA.md as guide)
4. **Frontend dev starts** with Canvas enhancements
5. **Daily sync** — Ask questions here
6. **Reference docs** when building (links are in each file)

---

## Questions? Ask Here

This thread is your collaboration hub. I'm monitoring for:
- Questions on architecture
- Code snippets needing review
- Integration issues
- Demo blockers
- Judge Q&A clarifications

**Response time:** < 1 hour (usually faster)

---

## Next Steps (Today)

1. [ ] Create GitHub repo (`culture_stream`)
2. [ ] Add team members as collaborators
3. [ ] Send me the repo link
4. [ ] Backend dev reads TECH_SPEC.md + DATA_SCHEMA.md
5. [ ] Frontend dev reads TECH_SPEC.md
6. [ ] Presenter reads JUDGE_FAQ.md + COLLAB.md
7. [ ] Start coding (daily commits)

---

**Let's build this. You've got 48 hours and a killer team. Go! 🚀**
