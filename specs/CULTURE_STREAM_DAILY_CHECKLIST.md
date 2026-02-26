# 🚀 Culture Stream - Daily Build Checklist

## Today's Priorities

- [ ] Create GitHub repo (culture_stream)
- [ ] Add team members as collaborators
- [ ] Send repo link to collaborate hub
- [ ] Backend dev starts messageGenerator.js
- [ ] Frontend dev (Shiv) starts rope animation enhancements
- [ ] Presenter starts judge Q&A script
- [ ] Daily commit to show progress

---

## 📋 Backend Dev Checklist (Day 1)

### Hours 0-6 (Setup)
- [ ] Clone repo locally
- [ ] `npm install` (backend folder)
- [ ] Create Express server skeleton (`src/index.js`)
- [ ] Create `src/data/messageGenerator.js` (empty class)
- [ ] Create `src/data/orgConfig.json` (15 users, 6 channels)
- [ ] Create `src/data/messageTemplates.json` (healthy/warning/critical/recovery)
- [ ] Run server locally (`npm start` → http://localhost:3000)
- [ ] Verify `/health` endpoint works
- [ ] First commit: "Initial backend setup"

### Hours 6-12 (Core Logic)
- [ ] Implement `messageGenerator.generateUsers()`
- [ ] Implement `messageGenerator.generateChannels()`
- [ ] Implement `messageGenerator.generateWeekMessages(week, state)`
- [ ] Test: Week 1 generates 85-115 messages
- [ ] Create `src/metrics/metricsCalculator.js`
- [ ] Implement all metric calculations (silos, sentiment, response_time, burnout)
- [ ] Test: Verify metrics match progression (see DATA_SCHEMA.md)
- [ ] Create `src/mutations/mutationDetector.js`
- [ ] Implement mutation detection (3 types)
- [ ] Second commit: "Add message generator and metrics calculator"

### Hours 12-24 (API + Tests)
- [ ] Create `src/api/routes.js` with 3 endpoints
- [ ] Implement POST `/api/simulation/start`
- [ ] Implement GET `/api/simulation/:id/week/:n`
- [ ] Implement GET `/api/simulation/:id/narrative`
- [ ] Test all endpoints with curl/Postman
- [ ] Create `tests/` folder with unit tests
- [ ] Write tests for messageGenerator
- [ ] Write tests for metricsCalculator
- [ ] Write tests for mutationDetector
- [ ] Run `npm test` (should pass all)
- [ ] Third commit: "Add API endpoints and tests"

### Daily (Throughout)
- [ ] Commit changes every 2-3 hours
- [ ] Test locally before pushing
- [ ] Update progress in collab thread
- [ ] Ask questions early if stuck
- [ ] Review frontend dev's changes (code review)

---

## 🎨 Frontend Dev (Shiv) Checklist (Day 1)

### Hours 0-6 (Canvas Setup)
- [ ] Clone repo locally
- [ ] Navigate to frontend folder
- [ ] Understand current rope animation (from existing demo at port 9000)
- [ ] Create `src/rope-animation.js` (enhance from existing)
- [ ] Define 4 rope states: healthy, warning, critical, recovery
- [ ] Implement `transitionToWeek(weekData)` method
- [ ] Map metrics to visual state:
  - [ ] Sentiment → Color (0.75=blue, 0.35=red)
  - [ ] Silos → Fraying (0.1=tight, 0.6=frayed)
  - [ ] Response time → Animation speed (longer=slower)
- [ ] Test animation with mock data
- [ ] First commit: "Add rope state transitions"

### Hours 6-12 (UI Components)
- [ ] Create `src/metrics-display.js` (real-time bars)
- [ ] Create `src/diagnostic-box.js` (hover mutation info)
- [ ] Create `src/api-client.js` (fetch from backend)
- [ ] Implement metrics display for:
  - [ ] Silos %
  - [ ] Sentiment score
  - [ ] Response time
  - [ ] Burnout risk
- [ ] Implement diagnostic box showing:
  - [ ] Week number
  - [ ] Mutation type
  - [ ] Metrics change
  - [ ] Root cause
  - [ ] Suggestion
- [ ] Test components with mock data
- [ ] Second commit: "Add metrics and diagnostic components"

### Hours 12-24 (Integration)
- [ ] Create `src/app.js` (main controller)
- [ ] Implement `startSimulation()` (calls backend)
- [ ] Implement animation loop:
  - [ ] Fetch week 1-8 from backend
  - [ ] Animate rope transition (7s per week)
  - [ ] Update metrics (smooth transitions)
  - [ ] Show diagnostic box for mutations
  - [ ] Wait before next week
- [ ] Add controls (play, pause, reset)
- [ ] Test end-to-end with running backend
- [ ] Verify total demo duration ~55 seconds
- [ ] Third commit: "Add backend integration and controls"

### Daily (Throughout)
- [ ] Commit changes every 2-3 hours
- [ ] Test animations visually (no weird jumps)
- [ ] Verify API integration works
- [ ] Check performance (60fps target)
- [ ] Update progress in collab thread
- [ ] Review backend dev's API design (does it match needs?)
- [ ] Ask for changes if API doesn't fit frontend

---

## 📝 Presenter Checklist (Day 1)

### Hours 0-4 (Preparation)
- [ ] Read JUDGE_FAQ.md (entire file)
- [ ] Read CULTURE_STREAM_COLLAB.md (context)
- [ ] Highlight 10 key judge questions
- [ ] Prepare answer script for each (conversational, not robotic)
- [ ] Practice answers out loud (60 seconds each)

### Hours 4-8 (Script)
- [ ] Create presentation slide deck (optional but good):
  - [ ] Problem slide (culture breaks too late)
  - [ ] Solution slide (early detection)
  - [ ] Metrics slide (what we measure)
  - [ ] Demo slide (60-second video)
  - [ ] Market slide (who buys this)
  - [ ] Call to action slide
- [ ] Create 1-page explanation diagram (visual overview)
- [ ] Create narrative script (5-7 minutes walkthrough)
- [ ] Script should cover:
  - [ ] Week 1-2 (healthy baseline)
  - [ ] Week 3-4 (silos form)
  - [ ] Week 5-6 (culture breaks)
  - [ ] Week 6.5 (leadership intervenes)
  - [ ] Week 7-8 (recovery)
  - [ ] Why this matters (6-week head start)

### Hours 8-12 (Backup)
- [ ] Record backup demo video (screen recording + narration)
- [ ] Video should be 60 seconds, high quality
- [ ] Store locally + upload to backup location
- [ ] Test playback on presentation laptop
- [ ] Prepare "Demo failed" recovery script (what to say if live breaks)

### Daily (Throughout)
- [ ] Practice 10-question Q&A (at least once)
- [ ] Refine answers based on team feedback
- [ ] Update progress in collab thread
- [ ] Ask Shiv/Backend dev if unclear on technical details
- [ ] Create final presentation materials (slides, handout, one-pager)

---

## 🔗 Daily Collaboration (All Team Members)

### Morning (8 AM IST)
- [ ] Everyone: Sync on progress (5-minute standup)
- [ ] Backend: What did you ship yesterday? What's blocking you?
- [ ] Frontend: What did you ship yesterday? Any API changes needed?
- [ ] Presenter: Q&A script status?

### Midday (1 PM IST)
- [ ] Everyone: Code review (swap branches, check for bugs)
- [ ] Backend reviews Frontend changes
- [ ] Frontend reviews Backend API design
- [ ] Presenter reviews code context (for Q&A prep)

### Evening (6 PM IST)
- [ ] Everyone: Update progress in collab thread
- [ ] Commit changes + push to GitHub
- [ ] Highlight blockers or questions
- [ ] Plan next day's work

### Before Sleep (10 PM IST)
- [ ] Shiv: Check for overnight questions
- [ ] Respond to blockers ASAP
- [ ] Plan next morning's priorities

---

## 🎯 Integration Points (Where Things Connect)

### Backend → Frontend
```
Backend generates: 8 weeks of messages + metrics
Frontend consumes: /api/simulation/{id}/week/{n}
Format: { week, metrics, mutations, diagnosis, sample_messages }

Example flow:
1. Frontend: startSimulation() → POST /api/simulation/start
2. Backend: Create simulation, return sim_id
3. Frontend: fetch /api/simulation/{sim_id}/week/1
4. Backend: Return week 1 data
5. Frontend: Animate rope, show metrics, display hover box
6. Frontend: wait 7 seconds, fetch week 2
7. Repeat for weeks 3-8
```

### Code Review Points
- **Backend dev**: Review Shiv's API calls (make sure format matches)
- **Frontend dev**: Review backend API design (can you fetch data easily?)
- **Both**: Verify error handling (what if API is slow?)

### Testing Points
- **Backend**: Test each endpoint with curl
- **Frontend**: Test with mock data first, then real backend
- **Both**: Test end-to-end (full 8-week demo)

---

## ⚠️ Common Pitfalls (Avoid These)

### Backend
- ❌ Messages feel robotic → Use templates with variety
- ❌ Metrics don't progress smoothly → Test progression (see DATA_SCHEMA.md)
- ❌ API response is slow → Use caching, test performance
- ❌ Mutations don't make sense → Test detection logic against each week

### Frontend
- ❌ Animation is janky → Test 60fps, use requestAnimationFrame
- ❌ Rope doesn't degrade realistically → Match visual to metrics
- ❌ Hover box doesn't appear → Debug z-index, timing
- ❌ Controls don't work → Test state management

### Overall
- ❌ Demo breaks on judge's laptop → Pre-record backup video
- ❌ Team doesn't understand each other's code → Daily code reviews
- ❌ Integration fails at last minute → End-to-end test by Day 1 evening
- ❌ Judge questions aren't prepared → Practice Q&A daily

---

## 📊 Daily Progress Tracker

### Day 1 Targets
- [ ] GitHub repo created + team added
- [ ] Backend: Message generator + metrics working
- [ ] Frontend: Rope animation + metrics display working
- [ ] Integration: Full end-to-end demo (may be rough)
- [ ] Presenter: Judge Q&A script drafted

### Day 2 Targets
- [ ] Backend: All tests pass, API stable
- [ ] Frontend: Smooth animations, no visual glitches
- [ ] Integration: Demo runs 55 seconds perfectly
- [ ] Demo prep: Dry run successful, backup video ready
- [ ] Judge materials: Slide deck + 1-pager ready

### Hackathon Day (Target)
- [ ] Present to judges (5-7 minute pitch)
- [ ] Answer all 10 Q&A questions confidently
- [ ] Show working demo
- [ ] Win hackathon! 🎉

---

## 🆘 If You Get Stuck

1. **Check the docs first:**
   - Backend issue → CULTURE_STREAM_DATA_SCHEMA.md + TECH_SPEC.md
   - Frontend issue → CULTURE_STREAM_TECH_SPEC.md + QUICK_REF.md
   - Judge Q&A → CULTURE_STREAM_JUDGE_FAQ.md

2. **Ask in collab thread:**
   - Include: What you tried, error message, what you expect
   - Include: Code snippet (pastebin or GitHub link)
   - Include: Context (which file, which line)

3. **Response time:** < 1 hour (usually faster)

4. **Escalate if:**
   - Architectural issue (needs design change)
   - Team disagreement (needs leadership decision)
   - Can't unblock after 2 hours

---

## 🎉 Success Criteria

### End of Day 1
✅ Repo is live with commits from all team members
✅ Backend API is returning data (rough but works)
✅ Frontend is fetching data and animating (may be jerky)
✅ Integration test successful (end-to-end)
✅ No blocking issues (rough edges OK)

### End of Day 2
✅ All unit tests passing
✅ Demo runs smoothly (55 seconds, no glitches)
✅ Judge Q&A script is ready
✅ Backup demo video is recorded
✅ Presentation materials are done
✅ Team is energized (morale high!)

### Hackathon Day
✅ Demo runs perfectly
✅ Judges understand immediately
✅ Team answers all questions confidently
✅ Culture Stream wins! 🏆

---

**Print this, check boxes daily, celebrate progress. You've got this! 🚀**
