# Culture Stream - Complete Collaboration Guide

## 🎯 One-Page Overview

**What:** Real-time culture mutation detector (behavioral signals → early warning system)
**Why:** Prevent culture degradation before people quit
**How:** Analyze Slack patterns (silos, burnout, trust erosion) → detect mutations → alert leaders
**Timeline:** 48-hour hackathon build
**Demo:** 60-second animation showing 8-week degradation + recovery

---

## 👥 Team Structure & Responsibilities

### **Shiv** (You)
- **Role:** Frontend Dev + Leadership
- **Responsibilities:**
  - Enhance rope visualization (canvas animation)
  - Build metrics display (real-time updates)
  - Build diagnostic hover boxes (mutation details)
  - Integrate with backend API
  - Lead decision-making & strategy
  - Present to judges
- **Success Metric:** Smooth 60-second demo with no glitches
- **Time estimate:** 12-16 hours

### **Backend Dev** (Your Team)
- **Role:** Mutation Detection Engine
- **Responsibilities:**
  - Generate 8 weeks of synthetic Slack data
  - Calculate metrics (silos, sentiment, response_time, burnout_risk)
  - Detect mutations when thresholds crossed
  - Build REST API endpoints
  - Write tests
- **Success Metric:** API returns correct week data in < 500ms
- **Time estimate:** 12-16 hours

### **Presenter** (Your Team)
- **Role:** Judge Communication
- **Responsibilities:**
  - Prepare judge Q&A script (using JUDGE_FAQ.md)
  - Create 1-page explanation diagram
  - Build backup demo video (pre-recorded)
  - Practice narrative (should take 5-7 minutes)
  - Handle live demo failures
- **Success Metric:** Judges leave with clear understanding
- **Time estimate:** 6-8 hours

---

## 📚 Complete Documentation Map

| Document | Purpose | For Whom |
|----------|---------|----------|
| `CULTURE_STREAM_COLLAB.md` | High-level overview, decisions, Q&A | Everyone |
| `CULTURE_STREAM_TECH_SPEC.md` | Detailed architecture, code structure | Backend + Frontend Dev |
| `CULTURE_STREAM_DATA_SCHEMA.md` | Data formats, message templates, metrics | Backend Dev (primary) |
| `CULTURE_STREAM_JUDGE_FAQ.md` | Judge questions + strong answers | Presenter + Leadership |
| `CULTURE_STREAM_README_TEMPLATE.md` | GitHub repo template | Everyone (after repo creation) |

**📌 Read first:** CULTURE_STREAM_COLLAB.md (this gives context)
**📌 Read next:** CULTURE_STREAM_TECH_SPEC.md (architecture)
**📌 Then:** Your role-specific docs

---

## 🏗️ Architecture at a Glance

```
┌─ FRONTEND (Shiv) ────────────────────────────────┐
│  Canvas Rope Animation                            │
│  ├─ Healthy (blue, tight) → Week 1-2             │
│  ├─ Warning (yellow, fraying) → Week 3-4         │
│  ├─ Critical (red, heavy fraying) → Week 5-6     │
│  └─ Recovery (orange→blue, reintegrating) → W7-8 │
│                                                   │
│  Metrics Display (real-time updates)              │
│  Diagnostic Hover Box (mutation details)          │
│  Controls (start, pause, reset, speed)            │
└─────────────────┬───────────────────────────────┘
                  │ fetch /api/simulation/...
┌─ BACKEND (Dev) ─┴───────────────────────────────┐
│  Simulation Engine                                │
│  ├─ Message Generator (8 weeks of Slack data)   │
│  ├─ Metrics Calculator (silos, sentiment, etc.)  │
│  ├─ Mutation Detector (threshold crossing)       │
│  └─ REST API (start, get week, get narrative)    │
│                                                   │
│  Data Layer (in-memory JSON)                      │
│  ├─ Org config (users, teams, channels)          │
│  ├─ Message templates (healthy→critical)         │
│  └─ Mutation rules (thresholds)                  │
└───────────────────────────────────────────────┘
```

---

## 📊 The 8-Week Story (What Backend Generates)

| Week | Status | Metrics | What's Happening | Visual | Alert |
|------|--------|---------|------------------|--------|-------|
| 1-2 | Healthy | Silos 10%, Sentiment 0.75, RT 3.5h | Baseline established | Blue, tight | None |
| 3 | Warning | Silos 30%, Sentiment 0.65, RT 5h | Silos forming | Yellow, 20% fraying | ⚠️ Silo |
| 4 | Warning | Silos 40%, Sentiment 0.60, RT 6h | Silos intensify | Yellow, 30% fraying | ⚠️ Silo |
| 5 | Critical | Silos 55%, Sentiment 0.35, RT 8h | Burnout + blame | Red, 50% fraying | 🚨 All 3 |
| 6 | Critical | Silos 58%, Sentiment 0.32, RT 8.5h | Peak toxicity | Red, 60% fraying | 🚨 All 3 |
| 7 | Recovery | Silos 45%, Sentiment 0.50, RT 7h | Leadership intervenes | Orange, reintegrating | ↗️ Improving |
| 8 | Healthy | Silos 18%, Sentiment 0.68, RT 4h | Culture recovered | Blue, tight again | ✅ Healthy |

**Backend must:**
- Generate 85-115 realistic messages per week
- Calculate accurate metrics for each week
- Show progression (not random jumps)
- Provide sample messages that justify the metrics

---

## 🎬 Frontend Animation Flow

1. **User clicks "START SIMULATION"**
2. Frontend calls `POST /api/simulation/start`
3. Backend returns `{ simulation_id, week_1_data }`
4. Frontend begins loop:
   ```
   Week 1: Animate rope to healthy state (7s)
   Week 2: Animate rope to healthy state (7s)
   Week 3: Animate rope to warning state (7s)
   ...
   Week 8: Animate rope to healthy state (7s)
   ```
5. For each week:
   - Update rope visual (fraying amount, color)
   - Update metrics display (silos %, sentiment, response_time)
   - Show diagnostic box (if mutations detected)
   - Pause 1 second between weeks
6. Total: ~55 seconds

---

## 💻 Technology Stack

**Backend:**
- Node.js + Express
- In-memory data (no DB needed)
- Jest (testing)
- Port: 3000

**Frontend:**
- HTML5 Canvas (rope animation)
- Vanilla JavaScript
- CSS (styling, hover boxes)
- fetch() API (client)
- Port: 5555 (or 9000 for convenience)

**Git:**
- GitHub repo (you create & manage)
- Branch strategy: `main` (production) + `dev` (development)
- Collaborative commits (backend dev commits backend, Shiv commits frontend)

---

## 🚀 48-Hour Build Schedule

### **Day 1 (First 24 hours)**

**Hours 0-6 (Parallel Work):**

Backend Dev:
- [ ] Create Express server skeleton
- [ ] Build `messageGenerator.js` (generate week 1 baseline)
- [ ] Build `metricsCalculator.js` (calculate from messages)
- [ ] Verify week 1 baseline metrics

Frontend Dev (Shiv):
- [ ] Create Canvas skeleton
- [ ] Implement rope state machine (4 states: healthy, warning, critical, recovery)
- [ ] Add metrics display UI
- [ ] Test with mock data

**Hours 6-12 (Continued):**

Backend Dev:
- [ ] Generate weeks 2-8 messages
- [ ] Implement `mutationDetector.js`
- [ ] Build API endpoints (`/api/simulation/start`, `/api/simulation/:id/week/:n`)
- [ ] Write unit tests

Frontend Dev (Shiv):
- [ ] Build diagnostic box component
- [ ] Implement API client (fetch week data)
- [ ] Connect to backend (end-to-end test)
- [ ] Add controls (play, pause, reset)

**Hours 12-24 (Integration):**

Both:
- [ ] Full end-to-end test (backend → frontend)
- [ ] Fix integration bugs
- [ ] Performance testing (animation smoothness)
- [ ] Code cleanup

Presenter:
- [ ] Start judge Q&A script
- [ ] Create 1-page explanation diagram

---

### **Day 2 (Next 24 hours)**

**Hours 0-8 (Polish):**

Backend Dev:
- [ ] Edge case handling
- [ ] Error responses
- [ ] Rate limiting (if needed)
- [ ] Final tests

Frontend Dev (Shiv):
- [ ] Visual refinement (colors, fonts, spacing)
- [ ] Mobile responsiveness
- [ ] Smooth animations
- [ ] Final touches

**Hours 8-16 (Demo Prep):**

All:
- [ ] Live demo walkthrough (dry run)
- [ ] Fix any remaining issues
- [ ] Test on presentation laptop
- [ ] Backup: Pre-recorded demo video

Presenter:
- [ ] Practice narrative (5-7 minutes)
- [ ] Judge Q&A rehearsal
- [ ] Backup materials ready

**Hours 16-24 (Hackathon):**

- [ ] Final presentation
- [ ] Answer judge questions
- [ ] Celebrate! 🎉

---

## 📋 Key Decisions (Lock These In)

### 1. **Data Source: Simulated vs. Real Slack**
- ✅ **Decision:** Fully simulated JSON (no real Slack workspace)
- **Why:** Speed, privacy, control, deterministic demo
- **Future:** Real Slack API ready in architecture

### 2. **Deployment Target**
- ✅ **Decision:** Local (localhost:3000 backend, localhost:5555 frontend)
- **Why:** Judges can see both servers, fast iteration
- **Backup:** Deploy to VPS if needed

### 3. **Message Realism**
- ✅ **Decision:** Templated but realistic (pre-written templates, variable injection)
- **Why:** Balances speed + authenticity
- **Example:** `"Hey @{other_team}, can we sync on {topic}?"` → `"Hey @bob, can we sync on API?"`

### 4. **Mutation Types (Exactly 3)**
- ✅ **Silos:** Cross-team communication drops
- ✅ **Burnout:** Response time spikes, late-night activity
- ✅ **Trust Erosion:** Blame language increases, sentiment drops
- **Why:** More is complexity, 3 is digestible for judges

### 5. **Recovery Narrative**
- ✅ **Decision:** Leadership intervention (retro, async-first policy, team rotation)
- **Why:** Actionable, credible, shows value of early detection
- **Timing:** Week 6-7 (6 weeks from detection to recovery)

---

## 🎯 Critical Success Factors

### **For Backend:**
- [ ] Week 1 metrics are accurate baseline
- [ ] Messages feel realistic (not robotic)
- [ ] Metrics degrade smoothly (no random jumps)
- [ ] API responses < 500ms
- [ ] Tests pass (unit + integration)

### **For Frontend:**
- [ ] Rope animates smoothly (60fps target)
- [ ] Colors transition correctly (blue → yellow → red → orange → blue)
- [ ] Hover boxes show accurate data
- [ ] Controls work (play, pause, reset)
- [ ] No glitches on presentation laptop

### **For Presenter:**
- [ ] Judge Q&A script is confident + conversational
- [ ] Backup demo video is pre-recorded (in case live fails)
- [ ] Narrative is 5-7 minutes (not too long)
- [ ] Judge FAQ has strong answers to all 10 questions

### **Overall:**
- [ ] Demo runs end-to-end without manual intervention
- [ ] Judges leave understanding the value prop
- [ ] Team is energized (morale matters!)

---

## 🔗 How to Reference Docs

**Backend Dev:**
1. Read `CULTURE_STREAM_TECH_SPEC.md` (Backend section)
2. Use `CULTURE_STREAM_DATA_SCHEMA.md` as source of truth
3. Reference `CULTURE_STREAM_COLLAB.md` for context when stuck

**Frontend Dev (Shiv):**
1. Read `CULTURE_STREAM_TECH_SPEC.md` (Frontend section)
2. Reference `CULTURE_STREAM_COLLAB.md` for demo flow
3. Use `CULTURE_STREAM_DATA_SCHEMA.md` to understand API response format

**Presenter:**
1. Read `CULTURE_STREAM_JUDGE_FAQ.md` (entire file)
2. Reference `CULTURE_STREAM_COLLAB.md` for product story
3. Use `CULTURE_STREAM_README_TEMPLATE.md` for context

---

## 💬 Daily Sync Points (Use This Thread)

I'll monitor this thread for:
- ✅ Questions from backend/frontend dev
- ✅ Integration issues
- ✅ Design decisions that need input
- ✅ Demo blockers
- ✅ Judge Q&A clarifications

**Best practices:**
- Share code snippets with questions
- Link to specific docs (e.g., "TECH_SPEC.md line 45")
- Show progress daily (screenshots, code, metrics)
- Ask early if stuck (don't wait)

---

## 🎁 What I'll Provide

- ✅ Architecture & tech spec (done)
- ✅ Data schema & message templates (done)
- ✅ Judge FAQ with answers (done)
- ✅ Collaboration guide (this file)
- ✅ Debugging support during build
- ✅ Integration help when needed
- ✅ Backup demo scripting
- ✅ Last-minute tweaks & polish

---

## ❓ Final Questions Before You Start

**Answer these for maximum clarity:**

1. **Slack Workspace:** Will you create a fake test workspace, or just use simulated data?
2. **Deployment Port:** Frontend on 9000 (like current demo), or 5555?
3. **Git Repo:** What's your GitHub username? (I'll help with setup)
4. **Team Availability:** How many hours per day can backend/frontend devs dedicate?
5. **Backup Plan:** If demo breaks on stage, do you want pre-recorded video or live recovery?

---

## 🚀 Ready to Start?

1. **Create GitHub repo** (`culture_stream`)
2. **Send me the repo link** (I can give feedback on structure)
3. **Backend dev starts** with messageGenerator.js
4. **Frontend dev starts** with Canvas enhancements
5. **Daily sync** here (questions, blockers, progress)
6. **Deploy & celebrate** 🎉

---

**Good luck, team. You've got this. Let's build something amazing.** 🚀

Questions? Ask below. I'm here to help unblock you.
