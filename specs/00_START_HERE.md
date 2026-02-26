# 🚀 Culture Stream - START HERE

## What You Have (Complete Specifications)

I've created **9 comprehensive documents** with everything you need to build Culture Stream in 48 hours:

### 📋 Read These (In This Order)

| File | Purpose | Read First | Size |
|------|---------|-----------|------|
| **This file** | Overview + roadmap | ✅ Yes | 1min |
| `CULTURE_STREAM_QUICK_REF.md` | One-page summary | ✅ Yes (2min) | Quick |
| `CULTURE_STREAM_COLLAB.md` | High-level strategy | Everyone | 15min |
| `CULTURE_STREAM_TECH_SPEC.md` | Technical architecture | Backend + Frontend | 20min |
| `CULTURE_STREAM_DATA_SCHEMA.md` | Data formats + templates | Backend (primary) | 15min |
| `CULTURE_STREAM_JUDGE_FAQ.md` | Judge Q&A script | Presenter | 20min |
| `CULTURE_STREAM_GITHUB_SETUP.md` | Repo setup guide | Everyone | 10min |
| `CULTURE_STREAM_DAILY_CHECKLIST.md` | Hour-by-hour tasks | Everyone (daily) | 5min |
| `CULTURE_STREAM_README_TEMPLATE.md` | GitHub repo template | Copypaste | 5min |
| `CULTURE_STREAM_GUIDE.md` | Detailed collaboration | Reference | 10min |

---

## ⚡ 60-Second Summary

**What:** Real-time culture mutation detector (behavioral signals from Slack → early warning system)

**Why:** Detect culture degradation 6 weeks early so leaders can fix it before resignations happen

**How:** Analyze message patterns (silos, sentiment, timing) → detect 3 mutations (Silo Formation, Burnout, Trust Erosion) → show in 60-second animated demo

**Demo:** Rope visualization degrades blue → yellow → red (weeks 1-6), then recovers back to blue (weeks 7-8)

**Team:** You (Frontend + Leadership) + Backend Dev + Presenter

**Timeline:** 48 hours (Day 1 = build, Day 2 = polish)

---

## 🎯 Your Job Right Now

### ✅ TODAY (Next 4 hours)

1. **Create GitHub repo:**
   - Go to github.com/new
   - Name: `culture_stream`
   - Public + MIT license
   - Clone locally

2. **Share with team:**
   - Add backend dev as collaborator
   - Add presenter as collaborator
   - Send them this START_HERE.md + QUICK_REF.md

3. **Read the specs:**
   - You: Read QUICK_REF.md (5 min)
   - Backend dev: Read TECH_SPEC.md + DATA_SCHEMA.md
   - Presenter: Read JUDGE_FAQ.md
   - Everyone: Skim COLLAB.md (context)

4. **Start coding:**
   - Backend: Open `messageGenerator.js` (DATA_SCHEMA.md shows exact format)
   - You (Frontend): Enhance rope animation (TECH_SPEC.md has code examples)
   - Make first commits by tonight

---

## 🏗️ Architecture (30 seconds)

```
BACKEND (Dev's job):
  ├─ Generate 8 weeks of Slack-like messages
  ├─ Calculate metrics (silos %, sentiment, response time, burnout)
  ├─ Detect mutations (when metrics cross thresholds)
  └─ API endpoints (start, get week, get narrative)

FRONTEND (Your job):
  ├─ Canvas rope animation (state transitions)
  ├─ Metrics display (real-time bars)
  ├─ Diagnostic boxes (mutation details)
  └─ Integrate with backend (fetch + animate)

PRESENTER (Team's job):
  ├─ Judge Q&A script (10 questions prepared)
  ├─ Backup demo video (pre-recorded)
  └─ Narrative walkthrough (5-7 minutes)
```

---

## 📊 The 8-Week Story (What Backend Generates)

```
Week 1-2: HEALTHY
  Silos 0.10 | Sentiment 0.75 | Response Time 3.5h
  Blue rope, tight bundle → "Baseline established"

Week 3-4: WARNING
  Silos 0.30-0.40 | Sentiment 0.65-0.60 | RT 5-6h
  Yellow rope, 20% fraying → "Silos forming"

Week 5-6: CRITICAL
  Silos 0.55-0.58 | Sentiment 0.35-0.32 | RT 8-8.5h
  Red rope, 50-60% fraying → "Burnout + Trust broken"

Week 7-8: RECOVERY
  Silos 0.18 | Sentiment 0.68 | RT 4h
  Orange→Blue rope, reintegrating → "Culture healed"
```

---

## 🎬 Frontend Tasks (For You)

### Day 1 (12-16 hours)
- [ ] Enhance rope animation (state → visual)
- [ ] Build metrics display (real-time bars)
- [ ] Build diagnostic box (hover info)
- [ ] Connect to backend API
- [ ] Test end-to-end

### Day 2 (6-8 hours)
- [ ] Polish animations (smoothness)
- [ ] Visual refinement (colors, spacing)
- [ ] Handle edge cases (errors, slow network)
- [ ] Final testing on presentation laptop

---

## 🔧 Backend Tasks (For Backend Dev)

### Day 1 (12-16 hours)
- [ ] Message generator (8 weeks, realistic templates)
- [ ] Metrics calculator (silos, sentiment, response_time, burnout)
- [ ] Mutation detector (threshold logic)
- [ ] API endpoints (3 routes)
- [ ] Unit tests

### Day 2 (6-8 hours)
- [ ] Bug fixes + edge cases
- [ ] Performance optimization
- [ ] Integration tests
- [ ] Final testing

---

## 🎤 Presenter Tasks (For Team Member)

### Day 1 (6-8 hours)
- [ ] Memorize judge Q&A (JUDGE_FAQ.md)
- [ ] Create slide deck (problem → solution → demo → market)
- [ ] Record backup demo video
- [ ] Create 1-page explanation

### Day 2 (4-6 hours)
- [ ] Practice narrative (5-7 min walkthrough)
- [ ] Mock Q&A session (team asks questions)
- [ ] Final presentation prep
- [ ] Confidence building

---

## 📚 Key Documents (What Each One Does)

### `CULTURE_STREAM_QUICK_REF.md` ⭐
**Read this if you have 5 minutes.** One-page summary + data structure reference.

### `CULTURE_STREAM_TECH_SPEC.md` ⭐
**Read this if you're coding.** Complete architecture with code examples.

### `CULTURE_STREAM_DATA_SCHEMA.md` ⭐
**Backend dev: Use this as your source of truth.** Exact message templates, metrics, thresholds.

### `CULTURE_STREAM_JUDGE_FAQ.md` ⭐
**Presenter: Memorize this.** 10 judge questions + confident answers.

### `CULTURE_STREAM_DAILY_CHECKLIST.md` ⭐
**Use this daily.** Hour-by-hour tasks to stay on track.

### `CULTURE_STREAM_COLLAB.md`
High-level vision, judge attack vectors, product flow.

### `CULTURE_STREAM_GITHUB_SETUP.md`
Step-by-step repo creation, git workflow, file structure.

### `CULTURE_STREAM_README_TEMPLATE.md`
Copy-paste this into your GitHub repo's README.md

### `CULTURE_STREAM_GUIDE.md`
Detailed collaboration guide (reference when confused).

---

## 🎯 Critical Success Factors

✅ **Backend:** Messages are realistic, metrics smooth progression, API < 500ms
✅ **Frontend:** Rope animates smoothly, metrics update correctly, no glitches
✅ **Demo:** Runs 55 seconds without intervention, judges understand immediately
✅ **Backup:** Pre-recorded video exists (in case live breaks)
✅ **Q&A:** All 10 judge attacks have confident answers

---

## 🔗 How to Reference Docs During Build

**If you're stuck on backend:**
- First: Read `CULTURE_STREAM_DATA_SCHEMA.md` (message templates, metrics)
- Then: Check `CULTURE_STREAM_TECH_SPEC.md` (Backend section)
- Finally: Ask in collab thread with code snippet

**If you're stuck on frontend:**
- First: Read `CULTURE_STREAM_TECH_SPEC.md` (Frontend section)
- Then: Check `CULTURE_STREAM_QUICK_REF.md` (data structure reference)
- Finally: Ask in collab thread with screenshot

**If you're stuck on judge Q&A:**
- First: Read `CULTURE_STREAM_JUDGE_FAQ.md` (entire file)
- Then: Check `CULTURE_STREAM_COLLAB.md` (context)
- Finally: Ask in collab thread

---

## 💬 Collaboration Workflow

**This thread is your war room.** Daily sync pattern:

1. **Morning (8 AM):** 5-minute standup
   - Backend: "Built X, working on Y, stuck on Z"
   - Frontend: Same
   - Presenter: Same

2. **Afternoon (1 PM):** Code review
   - Swap branches, review each other's code
   - Catch bugs before integration

3. **Evening (6 PM):** Progress update
   - Commit changes + push
   - Update thread with screenshot/metric
   - Plan tomorrow

---

## ✅ Checklist (Do These Right Now)

- [ ] Read this file (you are here ✓)
- [ ] Read `CULTURE_STREAM_QUICK_REF.md` (5 min)
- [ ] Create GitHub repo
- [ ] Add team members
- [ ] Share QUICK_REF.md + this file with team
- [ ] Backend dev: Open `CULTURE_STREAM_DATA_SCHEMA.md`
- [ ] Frontend dev (you): Start rope animation
- [ ] Presenter: Start JUDGE_FAQ.md
- [ ] Make first commit by tonight

---

## 🚀 You're Set. Start Building.

**No more planning. Everything is specified. Time to execute.**

Questions? Ask here.
Blockers? Ask here.
Wins? Celebrate here.

Go build something amazing. 🚀

---

**Next step:** Create repo + start coding. See you in the collab thread! 💪
