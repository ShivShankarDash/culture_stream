# Culture Stream

**Real-time behavioral monitoring system for detecting organizational culture mutations before they escalate.**

---

## 🎯 The Problem

Most organizations notice culture problems **too late**. By the time leadership realizes the team is toxic, people have already quit. Culture degradation is predictable but invisible until it's critical.

**Culture Stream detects mutations 6 weeks early, giving leaders time to act.**

---

## 🚀 The Solution

Culture Stream observes natural behavioral signals from your organization's communication (Slack patterns, message timing, sentiment, collaboration frequency) and detects early warning signs of:

1. **Silo Formation** — Teams stop talking across boundaries
2. **Burnout Risk** — Engagement drops, response times spike
3. **Trust Erosion** — Communication becomes hostile, blame increases

### How It Works

**Week 1:** Establish baseline (what's "normal" for your org)
→ **Weeks 2-6:** Detect when metrics deviate from baseline
→ **Week 6 alert:** Leadership acts
→ **Week 8+:** Culture recovers before resignations happen

---

## 🏗️ Architecture

```
Frontend (Rope Visualization)
         ↓ (fetch week data)
Backend (Mutation Detection Engine)
         ↓ (generate from)
Synthetic Slack Data (8-week narrative)
```

**Backend:** Node.js + Express
- Generates 8-week synthetic Slack simulation
- Calculates metrics (silos, sentiment, response time)
- Detects mutations when thresholds crossed
- Serves metrics via REST API

**Frontend:** Canvas + JavaScript
- Animates rope visualization (healthy → fraying → recovering)
- Displays real-time metrics
- Shows diagnostic information (root cause, suggestions)
- Compresses 8 weeks into 60-second demo

---

## 📊 Demo Flow (60 Seconds)

1. **Week 1-2 (Healthy):** Blue rope, tight bundle
2. **Week 3-4 (Warning):** Yellow rope, silos forming
3. **Week 5-6 (Critical):** Red rope, blame + burnout detected
4. **Week 6.5:** Leadership intervention
5. **Week 7-8 (Recovery):** Orange → Blue, culture rebuilds

Each transition shows:
- Real-time metrics (silos %, sentiment, response time)
- Root cause diagnosis (specific problems detected)
- Suggested actions (culture recovery steps)

---

## 🛠️ Setup & Development

### Prerequisites
- Node.js v16+
- npm

### Backend Setup

```bash
cd backend
npm install
npm start
# Server runs on http://localhost:3000
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
# Opens on http://localhost:5555
```

### API Documentation

**POST /api/simulation/start**
- Generates fresh 8-week simulation
- Returns: `{ simulation_id, week_1_data }`

**GET /api/simulation/:sim_id/week/:week**
- Returns metrics, mutations, and diagnostics for specific week

**GET /api/simulation/:sim_id/narrative**
- Returns full 8-week story with interventions

[Full API docs in `docs/API.md`]

---

## 📁 Project Structure

```
culture_stream/
├── backend/          # Mutation detection engine
├── frontend/         # Rope visualization + UI
├── docs/             # Architecture, flow, FAQ
└── README.md         # This file
```

---

## 👥 Team

- **Shiv** - Frontend (rope visualization, leadership)
- **Backend Dev** - Mutation detection engine
- **Presenter** - Judge Q&A, narrative

---

## 🎓 For Judges

**Key Differentiators:**
- ✅ **Predictive** (not retrospective) — detects before impact
- ✅ **Behavioral** (not surveys) — observes natural data
- ✅ **Specific** (not vague) — "silos between eng/product" not "morale low"
- ✅ **LOVE-grounded** — embodies empathy + psychological safety

**FAQ:** See `docs/JUDGE_FAQ.md` for anticipated questions + answers

---

## 📝 Development

See `ARCHITECTURE.md` for detailed technical specification.

### Quick Start (Dev)

```bash
# Clone repo
git clone https://github.com/your-username/culture_stream.git
cd culture_stream

# Install dependencies
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

# Run both servers
npm run dev  # (or start backend & frontend in separate terminals)

# Open http://localhost:5555 in browser
```

---

## 🔮 Future Roadmap

- [ ] Real Slack API integration (not just simulation)
- [ ] Email + calendar integration (Microsoft Teams, Google Workspace)
- [ ] Historical analysis (track culture over months/years)
- [ ] Team-specific dashboards (see your team's culture health)
- [ ] Actionable recommendations (specific interventions)
- [ ] Culture coaching (AI-powered suggestions)

---

## 📧 Questions?

Reach out to [@your-slack-handle] or open an issue.

---

## 📄 License

MIT
