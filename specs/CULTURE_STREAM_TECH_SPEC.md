# Culture Stream - Architecture & Technical Spec

## 📋 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (Shiv's Domain)                │
│  - Rope visualization (Canvas animation)                    │
│  - Metrics dashboard (real-time updates)                    │
│  - Hover diagnostic boxes (mutation details)                │
│  - Controls (start, pause, reset, speed)                    │
│  - WebSocket listener (for real-time week updates)          │
└──────────────────────────┬──────────────────────────────────┘
                           │ (fetch /api/simulation/...)
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (Dev's Domain)                   │
│  - Synthetic data generator (8 weeks of Slack messages)     │
│  - Mutation detector (silos, burnout, trust erosion)        │
│  - Metrics calculator (sentiment, response_time, silos)     │
│  - API endpoints (RESTful + WebSocket)                      │
│  - Test suite (unit + integration)                          │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                         DATA LAYER                          │
│  - Synthetic Slack messages (JSON)                          │
│  - Mutation definitions (YAML/JSON config)                  │
│  - Baseline metrics (Week 1 reference)                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 🏗️ Backend Technical Spec

### Tech Stack
- **Framework:** Node.js + Express
- **Data:** In-memory (no DB needed for demo)
- **Async:** WebSocket for real-time updates (optional, can do polling)
- **Testing:** Jest

### Core Modules

#### 1. **Synthetic Data Generator** (`backend/src/data/`)

**File:** `messageGenerator.js`

```javascript
// Purpose: Generate realistic Slack-like messages for 8 weeks

class MessageGenerator {
  constructor(orgSize = 15, channels = 6) {
    this.users = this.generateUsers(orgSize);
    this.channels = this.generateChannels(channels);
  }

  generateUsers(count) {
    // Return array of user objects: { id, name, team }
    // Teams: engineering, product, design, devops
  }

  generateChannels(count) {
    // Return: [
    //   { id: 'general', name: '#general', type: 'cross-team' },
    //   { id: 'eng', name: '#engineering', type: 'team-specific' },
    //   ...
    // ]
  }

  generateWeekMessages(weekNumber, org_state) {
    // org_state: "healthy" | "warning" | "critical" | "recovery"
    // Return: array of message objects
    // Each message: { 
    //   id, timestamp, userId, channelId, text, sentiment, 
    //   mentions_count, cross_team, time_of_day 
    // }

    // Week 1-2: healthy messages
    // Week 3-4: silos form (less cross-team)
    // Week 5-6: blame & burnout (hostile tone, late night)
    // Week 7-8: recovery (positive, inclusive)
  }

  getCrossTeamMentionCount(week_number, state) {
    // Returns count based on progression
    // Week 1: 40% cross-team
    // Week 3: 25% cross-team
    // Week 5: 15% cross-team
    // Week 7: 35% cross-team
  }

  getMessageTemplates(state) {
    // Return array of message templates based on state
    // Example templates:
    //   healthy: ["Hey @{other_team}, can we sync on {topic}?", ...]
    //   blame: ["@{team} this is your fault", "Why is {task} still broken?", ...]
    //   recovery: ["Thanks for your help", "Great collaboration!", ...]
  }
}
```

**Key Requirements:**
- Messages should feel realistic (not robotic)
- Timestamps should span work hours (7 AM - 10 PM)
- Week 5-6: Include late-night messages (11 PM, 2 AM, etc.)
- Week 7-8: Return to normal hours
- Sentiment should trend: 0.75 → 0.65 → 0.40 → 0.65

---

#### 2. **Metrics Calculator** (`backend/src/metrics/`)

**File:** `metricsCalculator.js`

```javascript
class MetricsCalculator {
  calculateWeekMetrics(messages) {
    // Return: {
    //   silos_score: 0.10 - 0.55 (0 = no silos, 1 = complete isolation),
    //   sentiment: 0.75 (0.0 = hostile, 1.0 = positive),
    //   response_time_hours: 3.5 (median hours between messages),
    //   burnout_risk: 0.05 (0 = none, 1 = critical)
    // }

    return {
      silos_score: this.calculateSilos(messages),
      sentiment: this.calculateSentiment(messages),
      response_time_hours: this.calculateResponseTime(messages),
      burnout_risk: this.calculateBurnout(messages)
    };
  }

  calculateSilos(messages) {
    // Cross-team message % / baseline
    // If 40% cross-team in week 1, and 10% in week 5:
    // silos_score = (40 - 10) / 40 = 0.75 (75% degradation)
    const crossTeamCount = messages.filter(m => m.cross_team).length;
    const total = messages.length;
    const ratio = crossTeamCount / total;
    const baseline = 0.40; // Week 1 baseline
    return Math.max(0, 1 - (ratio / baseline));
  }

  calculateSentiment(messages) {
    // Average sentiment of all messages
    // Positive words: "thanks", "great", "appreciate", "love"
    // Negative words: "blame", "fault", "broken", "useless"
    // Return 0.0 - 1.0
  }

  calculateResponseTime(messages) {
    // Median hours between consecutive messages
    // Healthy: 3-4 hours
    // Burnout: 8+ hours (people gone for long stretches)
  }

  calculateBurnout(messages) {
    // Count late-night & weekend messages / total
    // Also: spike in response time = burnout indicator
  }
}
```

---

#### 3. **Mutation Detector** (`backend/src/mutations/`)

**File:** `mutationDetector.js`

```javascript
class MutationDetector {
  detectMutations(currentWeekMetrics, baselineMetrics) {
    // Return: {
    //   mutations: ["silos", "burnout", "trust_erosion"],
    //   severity: "warning" | "critical",
    //   triggers: {
    //     silos: { metric: "silos_score", threshold: 0.30, current: 0.55 },
    //     burnout: { metric: "response_time", threshold: "5h", current: "8h" },
    //     trust: { metric: "sentiment", threshold: 0.60, current: 0.35 }
    //   }
    // }

    const mutations = [];

    // Silo detection: if silos_score > 0.30
    if (currentWeekMetrics.silos_score > 0.30) {
      mutations.push({
        type: "silos",
        severity: currentWeekMetrics.silos_score > 0.50 ? "critical" : "warning",
        message: `Cross-team collaboration ↓ ${Math.round((1 - currentWeekMetrics.silos_score) * 100)}%`,
        trigger: currentWeekMetrics.silos_score
      });
    }

    // Burnout detection: if response_time > 5 hours
    if (currentWeekMetrics.response_time_hours > 5) {
      mutations.push({
        type: "burnout",
        severity: currentWeekMetrics.response_time_hours > 7 ? "critical" : "warning",
        message: `Team disengagement: Response time ${currentWeekMetrics.response_time_hours}h (was 3.5h)`,
        trigger: currentWeekMetrics.response_time_hours
      });
    }

    // Trust erosion: if sentiment < 0.60
    if (currentWeekMetrics.sentiment < 0.60) {
      mutations.push({
        type: "trust",
        severity: currentWeekMetrics.sentiment < 0.40 ? "critical" : "warning",
        message: `Hostile tone detected: Sentiment ${currentWeekMetrics.sentiment.toFixed(2)} (was 0.75)`,
        trigger: currentWeekMetrics.sentiment
      });
    }

    return mutations;
  }
}
```

---

#### 4. **API Endpoints** (`backend/src/api/`)

**File:** `routes.js`

```javascript
// POST /api/simulation/start
app.post('/api/simulation/start', (req, res) => {
  // Generate fresh 8-week simulation
  // Return:
  // {
  //   simulation_id: "sim_1234",
  //   week_1_data: { metrics, mutations, sample_messages }
  // }
});

// GET /api/simulation/{sim_id}/week/{week}
app.get('/api/simulation/:sim_id/week/:week', (req, res) => {
  // Return week data:
  // {
  //   week: 3,
  //   status: "warning",
  //   metrics: { silos_score: 0.30, sentiment: 0.65, ... },
  //   mutations: [{ type: "silos", message: "..." }],
  //   diagnosis: {
  //     current: "Communication patterns shifting...",
  //     alert: "Silo formation detected",
  //     suggestion: "Implement cross-team sync"
  //   },
  //   sample_messages: [ 5 representative messages ],
  //   message_count: 87
  // }
});

// GET /api/simulation/{sim_id}/narrative
app.get('/api/simulation/:sim_id/narrative', (req, res) => {
  // Return full 8-week story for judges
  // {
  //   story: "Week 1: Healthy...",
  //   interventions: [ ... ],
  //   timeline: { ... }
  // }
});

// GET /api/simulation/{sim_id}/stats
app.get('/api/simulation/:sim_id/stats', (req, res) => {
  // Return summary stats:
  // {
  //   total_weeks: 8,
  //   mutations_detected: 3,
  //   critical_week: 5,
  //   recovery_start: 6,
  //   final_health_score: 0.85
  // }
});
```

---

### Data Structures

#### Message Object
```javascript
{
  id: "msg_12345",
  week: 1,
  timestamp: "2025-01-02T09:30:00Z",  // timestamp within week
  userId: "user_5",
  userName: "Alice",
  userTeam: "engineering",
  channelId: "product",
  channelName: "#product",
  text: "Hey @Bob, can the product team sync on the API design?",
  sentiment: 0.75,  // 0.0 (negative) to 1.0 (positive)
  cross_team: true,  // mentions someone from different team
  mentions: ["user_3"],  // who is mentioned
  time_of_day: "morning",  // morning, afternoon, evening, night
  is_late_night: false
}
```

#### Metrics Object
```javascript
{
  week: 1,
  silos_score: 0.10,  // 0 (no silos) to 1 (complete isolation)
  sentiment: 0.75,  // 0 (hostile) to 1 (positive)
  response_time_hours: 3.5,  // median
  burnout_risk: 0.05,  // 0 to 1
  message_volume: 87,  // total messages this week
  active_users: 12,
  active_channels: 5,
  late_night_message_count: 2,  // 10 PM - 6 AM
  weekend_message_count: 5
}
```

---

## 🎨 Frontend Technical Spec

### Tech Stack
- **Canvas:** For rope animation (as you already have)
- **API Client:** fetch() to backend
- **Styling:** CSS for hover boxes, metrics display
- **Controls:** Buttons (start, pause, reset, speed)

### Core Components

#### 1. **Rope Animation** (`frontend/src/rope-animation.js`)

Enhance existing animation to:

```javascript
class RopeAnimation {
  constructor(canvasElement, metricsCallback) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    this.animationState = "idle";  // idle, animating, paused
  }

  // NEW: Animate from one week's state to next
  transitionToWeek(weekData) {
    // weekData: { week, status, metrics, mutations, ... }
    // Smoothly transition from current rope state to new state
    
    // status: "healthy" (blue, tight)
    //         "warning" (yellow, fraying 20%)
    //         "critical" (red, fraying 50%)
    //         "recovery" (orange, reintegrating)
    
    this.targetMetrics = weekData.metrics;
    this.targetStatus = weekData.status;
    this.animateDuration = 6000;  // 6 seconds per week
    this.startAnimation();
  }

  animateDuration(progress) {
    // progress: 0 to 1 (where in the animation)
    
    // Calculate rope state based on metrics:
    // - Silos score → fraying amount (0.3 = 30% of strands separate)
    // - Sentiment → color (0.75 blue, 0.65 yellow, 0.35 red)
    // - Response time → animation speed (longer = slower)
    
    this.drawRope(
      frayingAmount: this.lerp(this.currentMetrics.silos_score, this.targetMetrics.silos_score, progress),
      color: this.getColorForSentiment(this.lerp(...)),
      bundlePosition: this.calculateBundlePosition(progress)
    );
  }

  getColorForSentiment(sentiment) {
    // 0.75 → #0066FF (blue, healthy)
    // 0.65 → #FFAA00 (yellow, warning)
    // 0.35 → #FF0000 (red, critical)
    // Returns hex color
  }

  drawRope(frayingAmount, color, bundlePosition) {
    // Draw 20 strands
    // If frayingAmount = 0.3:
    //   - 14 strands stay bundled (tight)
    //   - 6 strands separate (fraying)
    // Animate strands moving in and out
  }
}
```

#### 2. **Metrics Display** (`frontend/src/metrics-display.js`)

```javascript
class MetricsDisplay {
  updateMetrics(metricsData) {
    // metricsData: { silos_score, sentiment, response_time_hours, ... }
    
    // Update display:
    // Silos: [████░░░░] 30%
    // Sentiment: [███████░] 75%
    // Response Time: 3.5h → 8h
    // Burnout: [██░░░░░░] 20%
    
    document.getElementById('silos-bar').style.width = (metricsData.silos_score * 100) + '%';
    document.getElementById('sentiment-bar').style.width = (metricsData.sentiment * 100) + '%';
    // etc.
  }
}
```

#### 3. **Diagnostic Hover Box** (`frontend/src/diagnostic-box.js`)

```javascript
class DiagnosticBox {
  showDiagnosis(weekData) {
    // weekData: { week, mutations, diagnosis, sample_messages, ... }
    
    // Display:
    // [Week 3: Silo Formation Detected]
    // 
    // Metrics:
    // - Cross-team collab ↓ 40%
    // - Sentiment ↓ 10 points
    // 
    // Root Cause:
    // "No mentions between #engineering and #product"
    // Sample message: "@engineering this is a product problem, not yours"
    // 
    // Suggestion:
    // "Implement cross-team sync meetings"
    
    const box = document.getElementById('diagnostic-box');
    box.innerHTML = `
      <h3>Week ${weekData.week}: ${weekData.mutations[0]?.type.toUpperCase()}</h3>
      <div class="metrics">
        ${weekData.mutations.map(m => `
          <div class="mutation">
            <strong>${m.message}</strong>
          </div>
        `).join('')}
      </div>
      <div class="diagnosis">
        <p>${weekData.diagnosis.alert}</p>
        ${weekData.sample_messages[0] ? `
          <quote>"${weekData.sample_messages[0].text}"</quote>
        ` : ''}
      </div>
      <div class="suggestion">
        💡 ${weekData.diagnosis.suggestion}
      </div>
    `;
  }
}
```

#### 4. **Main Controller** (`frontend/src/app.js`)

```javascript
class CultureStreamApp {
  constructor() {
    this.currentWeek = 1;
    this.simulationId = null;
    this.isAnimating = false;
  }

  async startSimulation() {
    // Call backend: POST /api/simulation/start
    const response = await fetch('/api/simulation/start', { method: 'POST' });
    const data = await response.json();
    this.simulationId = data.simulation_id;
    
    // Start animation loop
    this.animateWeeks();
  }

  async animateWeeks() {
    for (let week = 1; week <= 8; week++) {
      // Fetch week data from backend
      const weekData = await fetch(`/api/simulation/${this.simulationId}/week/${week}`).then(r => r.json());
      
      // Update frontend
      this.ropeAnimation.transitionToWeek(weekData);
      this.metricsDisplay.updateMetrics(weekData.metrics);
      this.diagnosticBox.showDiagnosis(weekData);
      
      // Wait for animation to complete
      await this.sleep(7000);  // 7 seconds per week
    }
    
    // Animation complete
    this.showFinalState();
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

---

## 📁 Repository Structure

```
culture_stream/
├── README.md (Overview)
├── ARCHITECTURE.md (This file)
├── docs/
│   ├── PRODUCT_FLOW.md (User journey)
│   ├── DATA_SCHEMA.md (Message/Metrics format)
│   ├── JUDGE_FAQ.md (Expected questions)
│   └── DEPLOYMENT.md (Setup instructions)
│
├── backend/
│   ├── src/
│   │   ├── data/
│   │   │   ├── messageGenerator.js (Generate 8 weeks)
│   │   │   ├── messageTemplates.json (Sentiment-based templates)
│   │   │   └── orgConfig.json (Users, channels, teams)
│   │   ├── metrics/
│   │   │   ├── metricsCalculator.js (Silos, sentiment, response time)
│   │   │   └── burnoutDetector.js (Late-night activity, response lag)
│   │   ├── mutations/
│   │   │   ├── mutationDetector.js (Detect when metrics cross thresholds)
│   │   │   └── mutationRules.json (Thresholds for each mutation)
│   │   ├── api/
│   │   │   ├── routes.js (Express endpoints)
│   │   │   ├── controllers.js (Logic for endpoints)
│   │   │   └── middleware.js (Error handling, logging)
│   │   └── index.js (Server entry point)
│   ├── tests/
│   │   ├── data.test.js
│   │   ├── metrics.test.js
│   │   └── mutations.test.js
│   ├── package.json
│   └── .gitignore
│
├── frontend/
│   ├── public/
│   │   ├── index.html (Main UI)
│   │   └── styles.css
│   ├── src/
│   │   ├── rope-animation.js (Canvas + state transitions)
│   │   ├── metrics-display.js (Real-time metrics)
│   │   ├── diagnostic-box.js (Hover diagnosis)
│   │   ├── api-client.js (Fetch from backend)
│   │   └── app.js (Main controller)
│   └── package.json
│
└── .github/
    └── CODEOWNERS (Team assignments)
```

---

## 🚀 Development Timeline

### Day 1 (First 12 hours)

**Backend Dev (Hours 0-6):**
- [ ] Setup Express server + routes skeleton
- [ ] Build messageGenerator.js (generate week 1 baseline messages)
- [ ] Build metricsCalculator.js (calculate from messages)
- [ ] Test: Verify week 1 baseline metrics correct

**Frontend Dev (Shiv) (Hours 0-6):**
- [ ] Setup Canvas enhancements
- [ ] Build rope state machine (healthy → warning → critical → recovery)
- [ ] Build metrics display component
- [ ] Test: Verify rope animates correctly for mocked week data

**Parallel (Hours 6-12):**
- [ ] Backend: Generate weeks 2-8, implement mutation detector
- [ ] Frontend: Build diagnostic box, connect to backend
- [ ] Integrate: Backend + Frontend end-to-end test

### Day 2 (Next 12 hours)

**Backend Dev:**
- [ ] Polish API endpoints
- [ ] Edge case handling
- [ ] Performance optimization
- [ ] Unit tests

**Frontend Dev:**
- [ ] Polish animations
- [ ] Mobile responsiveness
- [ ] Controls (play, pause, reset)
- [ ] Visual refinements

**Together:**
- [ ] End-to-end demo
- [ ] Fix integration issues
- [ ] Backup demo video

---

## 🎯 Success Criteria

✅ Backend generates realistic 8-week Slack simulation
✅ Metrics correctly track degradation & recovery
✅ Frontend rope animates smoothly through all states
✅ Hover boxes show accurate diagnoses
✅ Full demo runs 55 seconds with no glitches
✅ Judges can understand narrative without explanation
✅ Code is clean + documented

---

## 🔗 Next Steps

1. **Create GitHub repo** (you'll do this)
2. **Backend dev** starts with messageGenerator.js
3. **Frontend dev** (Shiv) enhances rope animation
4. **I'll help** with integration points and debugging
5. **Daily sync** on this thread to unblock issues

Ready to start coding? What questions do you have?
