# Culture Stream - Real-Time Culture Mutation Detector

**Real-time behavioral monitoring system for detecting organizational culture mutations before they escalate.**

---

## 🎯 The Challenge

Most organizations notice culture problems **too late**. By the time leadership realizes the team is toxic, people have already quit. Culture Stream detects mutations **6 weeks early**, giving leaders time to act.

---

## 🚀 The Solution

Detect organizational culture mutations by analyzing behavioral signals from Slack:
- **Silos:** Teams stop talking across boundaries
- **Burnout Risk:** Engagement drops, response times spike  
- **Trust Erosion:** Communication becomes hostile, blame increases

---

## 📊 The Demo (60 seconds)

Animated visualization showing 8-week degradation + recovery:
- **Week 1-2:** Healthy (blue rope, tight bundle)
- **Week 3-4:** Warning (yellow rope, silos forming)
- **Week 5-6:** Critical (red rope, burnout + trust breakdown)
- **Week 7-8:** Recovery (orange→blue, culture heals)

---

## 📋 Complete Specifications (In `/docs/`)

Start here → [**`docs/00_START_HERE.md`**](docs/00_START_HERE.md)

All documentation:
1. **`00_START_HERE.md`** — Overview + what to do today
2. **`CULTURE_STREAM_QUICK_REF.md`** — One-page summary
3. **`CULTURE_STREAM_COLLAB.md`** — High-level strategy
4. **`CULTURE_STREAM_TECH_SPEC.md`** — Technical architecture
5. **`CULTURE_STREAM_DATA_SCHEMA.md`** — Data structures + templates
6. **`CULTURE_STREAM_JUDGE_FAQ.md`** — Judge Q&A script
7. **`CULTURE_STREAM_GITHUB_SETUP.md`** — Repo setup guide
8. **`CULTURE_STREAM_DAILY_CHECKLIST.md`** — 48-hour task breakdown
9. **`CULTURE_STREAM_GUIDE.md`** — Detailed collaboration guide
10. **`CULTURE_STREAM_README_TEMPLATE.md`** — GitHub repo template

---

## 🏗️ Architecture

```
BACKEND (Node.js + Express)
├─ Message Generator (8 weeks of synthetic Slack data)
├─ Metrics Calculator (silos, sentiment, response time, burnout)
├─ Mutation Detector (threshold-based detection)
└─ REST API endpoints

FRONTEND (Canvas + JavaScript)
├─ Rope animation (state transitions based on metrics)
├─ Metrics display (real-time updates)
├─ Diagnostic boxes (mutation details, root cause, suggestions)
└─ Controls (start, pause, reset, speed)

PRESENTER
├─ Judge Q&A script (10 questions + answers)
├─ Backup demo video (pre-recorded)
├─ 1-page explanation diagram
└─ Narrative walkthrough (5-7 minutes)
```

---

## 👥 Team

- **Shiv** — Frontend + Leadership
- **Backend Dev** — Mutation detection engine  
- **Presenter** — Judge communication

---

## 🎯 48-Hour Build Timeline

**Day 1:** Build core functionality (message generator, metrics, API, animation)
**Day 2:** Polish, test, prepare for presentation

See [`CULTURE_STREAM_DAILY_CHECKLIST.md`](docs/CULTURE_STREAM_DAILY_CHECKLIST.md) for hour-by-hour breakdown.

---

## 🚀 Quick Start

```bash
# Backend
cd backend
npm install
npm start
# Server runs on http://localhost:3000

# Frontend
cd frontend
npm install
npm start
# Opens on http://localhost:5555
```

---

## 📌 Key Points

✅ **Predictive:** Detects culture degradation 6 weeks early
✅ **Behavioral:** Observes natural Slack signals (not surveys)
✅ **Specific:** "Silos between eng/product" not vague "morale low"
✅ **Actionable:** Suggests specific interventions (retros, async-first, team rotation)

---

## 🎓 For Judges

**Why this matters:**
- Culture breaks slowly but resignations happen fast
- Early detection = 6 weeks to act instead of being surprised
- One prevented resignation (~$100K) justifies a year of subscription

**Differentiation:**
- vs. Culture Amp: Predictive (real-time) not retrospective (surveys)
- vs. Gallup: Continuous detection vs. annual eNPS
- vs. Officevibe: Specific mutations vs. general scores

**Key narrative:**
"Culture Stream detected mutations in Week 5. By Week 6, leaders could act. By Week 8, culture recovered. This is 6 weeks of opportunity most orgs miss."

---

## 📖 How to Use These Docs

1. **Read first:** `docs/00_START_HERE.md` (5 min)
2. **Then read:** Your role-specific doc:
   - Backend: `CULTURE_STREAM_TECH_SPEC.md` + `CULTURE_STREAM_DATA_SCHEMA.md`
   - Frontend: `CULTURE_STREAM_TECH_SPEC.md` + `CULTURE_STREAM_QUICK_REF.md`
   - Presenter: `CULTURE_STREAM_JUDGE_FAQ.md` + `CULTURE_STREAM_COLLAB.md`
3. **Reference:** `CULTURE_STREAM_DAILY_CHECKLIST.md` while building

---

## 🔗 Collaboration

Ask questions in this thread. Response time: < 1 hour.

Progress updates:
- Morning (8 AM IST): 5-minute standup
- Afternoon (1 PM IST): Code reviews
- Evening (6 PM IST): Commits + progress update

---

## 📄 License

MIT

---

**Ready to build? Start with `docs/00_START_HERE.md` 🚀**
