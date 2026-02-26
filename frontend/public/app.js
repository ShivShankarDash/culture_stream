/**
 * Culture Stream Frontend Application
 * Vanilla JavaScript + anime.js for rope animation
 */

class CultureStreamApp {
  constructor() {
    this.canvas = document.getElementById("rope-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.simulationId = null;
    this.currentWeek = 1;
    this.isRunning = false;
    this.isPaused = false;
    this.speed = 1;
    this.weekDataCache = new Map();

    this.setupEventListeners();
    this.drawInitialState();
  }

  setupEventListeners() {
    document
      .getElementById("start-btn")
      .addEventListener("click", () => this.startSimulation());
    document
      .getElementById("pause-btn")
      .addEventListener("click", () => this.togglePause());
    document
      .getElementById("reset-btn")
      .addEventListener("click", () => this.resetSimulation());
    document
      .getElementById("speed")
      .addEventListener("change", (e) => {
        this.speed = parseFloat(e.target.value);
        document.getElementById("speed-value").textContent = `${this.speed}x`;
      });
  }

  drawInitialState() {
    this.ctx.fillStyle = "white";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = "#667eea";
    this.ctx.font = "bold 24px -apple-system";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText(
      "🌿 Culture Stream",
      this.canvas.width / 2,
      this.canvas.height / 2 - 30
    );

    this.ctx.font = "14px -apple-system";
    this.ctx.fillStyle = "#999";
    this.ctx.fillText(
      "Press Start to Begin - Watch culture degrade and recover over 8 weeks",
      this.canvas.width / 2,
      this.canvas.height / 2 + 30
    );
  }

  async startSimulation() {
    console.log("🚀 Starting Culture Stream simulation...");

    this.simulationId = "sim_" + Date.now();
    this.isRunning = true;
    this.currentWeek = 1;

    document.getElementById("start-btn").disabled = true;
    document.getElementById("pause-btn").disabled = false;
    document.getElementById("reset-btn").disabled = false;

    this.animateWeeks();
  }

  togglePause() {
    this.isPaused = !this.isPaused;
    const btn = document.getElementById("pause-btn");
    btn.textContent = this.isPaused ? "▶️ Resume" : "⏸️ Pause";
  }

  resetSimulation() {
    this.isRunning = false;
    this.isPaused = false;
    this.currentWeek = 1;
    this.simulationId = null;
    this.weekDataCache.clear();

    document.getElementById("start-btn").disabled = false;
    document.getElementById("pause-btn").disabled = true;
    document.getElementById("reset-btn").disabled = true;
    document.getElementById("pause-btn").textContent = "⏸️ Pause";

    this.clearCanvas();
    this.drawInitialState();
    this.clearMetrics();
    this.clearDiagnostics();
  }

  async animateWeeks() {
    while (this.isRunning && this.currentWeek <= 8) {
      if (!this.isPaused) {
        const weekData = this.generateMockWeekData(this.currentWeek);

        await this.animateRope(weekData);
        this.updateMetricsDisplay(weekData);
        this.updateDiagnostics(weekData);

        if (this.currentWeek < 8) {
          this.currentWeek++;
          await new Promise((resolve) =>
            setTimeout(resolve, (7000 / this.speed) * 1)
          );
        } else {
          this.isRunning = false;
          document.getElementById("start-btn").disabled = false;
          document.getElementById("pause-btn").disabled = true;
        }
      } else {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }
  }

  generateMockWeekData(week) {
    const states = [
      "healthy",
      "healthy",
      "warning",
      "warning",
      "critical",
      "critical",
      "recovery",
      "recovery",
    ];
    const state = states[week - 1];

    const metricsMap = {
      1: { silos: 0.1, sentiment: 0.75, response_time: 3.5, burnout_risk: 0.1 },
      2: { silos: 0.12, sentiment: 0.73, response_time: 3.8, burnout_risk: 0.12 },
      3: { silos: 0.3, sentiment: 0.65, response_time: 5.0, burnout_risk: 0.25 },
      4: { silos: 0.4, sentiment: 0.6, response_time: 6.0, burnout_risk: 0.35 },
      5: { silos: 0.55, sentiment: 0.35, response_time: 8.0, burnout_risk: 0.65 },
      6: { silos: 0.58, sentiment: 0.32, response_time: 8.5, burnout_risk: 0.7 },
      7: { silos: 0.45, sentiment: 0.5, response_time: 7.0, burnout_risk: 0.5 },
      8: { silos: 0.18, sentiment: 0.68, response_time: 4.0, burnout_risk: 0.2 },
    };

    const mutations = [];
    if (week >= 3) mutations.push("Silo Formation");
    if (week >= 5) mutations.push("Burnout Risk");
    if (week >= 5) mutations.push("Trust Erosion");

    const causes = {
      1: "Teams collaborating effectively",
      2: "Baseline collaboration maintained",
      3: "Cross-team communication starting to decline",
      4: "Silos forming between teams",
      5: "Team morale dropping, late-night work increasing",
      6: "Trust breakdown, blame language emerging",
      7: "Leadership intervention: team retros, async-first policy",
      8: "Culture recovering, normal collaboration restored",
    };

    const suggestions = {
      1: "Maintain current collaboration practices",
      2: "Continue team building activities",
      3: "Host cross-team sync meetings",
      4: "Implement team rotation programs",
      5: "Emergency team retro and address concerns",
      6: "Leadership reset: define new values and boundaries",
      7: "Team rotation, async-first communication policy",
      8: "Celebrate recovery, document lessons learned",
    };

    return {
      week,
      metrics: metricsMap[week],
      state,
      mutations,
      root_cause: causes[week],
      suggestion: suggestions[week],
    };
  }

  getropeStateForWeek(weekData) {
    const stateColors = {
      healthy: "#667eea",
      warning: "#f5a623",
      critical: "#ff6b6b",
      recovery: "#52d3aa",
    };

    return {
      color: stateColors[weekData.state] || "#667eea",
      frayAmount: weekData.metrics.silos * 100,
      rotation: Math.random() * 360,
      tension: 1 - weekData.metrics.burnout_risk,
    };
  }

  async animateRope(weekData) {
    return new Promise((resolve) => {
      const ropeState = this.getropeStateForWeek(weekData);

      anime({
        targets: ropeState,
        rotation: ropeState.rotation + 180,
        frayAmount: ropeState.frayAmount,
        tension: ropeState.tension,
        duration: 6000 / this.speed,
        easing: "easeInOutQuad",
        update: () => {
          this.drawRope(ropeState, weekData);
        },
        complete: () => {
          resolve();
        },
      });
    });
  }

  drawRope(state, weekData) {
    this.ctx.fillStyle = "white";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawGrid();

    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const ropeRadius = 80;

    const segments = 20;
    const frayFraction = state.frayAmount / 100;

    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * Math.PI * 2 + (state.rotation * Math.PI) / 180;
      const x = centerX + Math.cos(angle) * ropeRadius * (1 - frayFraction * 0.5);
      const y = centerY + Math.sin(angle) * ropeRadius * (1 - frayFraction * 0.5);

      this.ctx.strokeStyle = state.color;
      this.ctx.lineWidth = 3 + frayFraction * 2;
      this.ctx.globalAlpha = 1 - frayFraction * 0.3;
      this.ctx.beginPath();
      this.ctx.moveTo(centerX, centerY);
      this.ctx.lineTo(x, y);
      this.ctx.stroke();
      this.ctx.globalAlpha = 1;
    }

    if (frayFraction > 0.1) {
      this.ctx.strokeStyle = state.color;
      this.ctx.globalAlpha = 0.5;
      this.ctx.lineWidth = 1;

      for (let i = 0; i < Math.floor(segments * frayFraction); i++) {
        const angle = Math.random() * Math.PI * 2 + (state.rotation * Math.PI) / 180;
        const x1 = centerX + Math.cos(angle) * ropeRadius * (1 - frayFraction * 0.5);
        const y1 = centerY + Math.sin(angle) * ropeRadius * (1 - frayFraction * 0.5);
        const x2 = x1 + (Math.random() - 0.5) * 50;
        const y2 = y1 + (Math.random() - 0.5) * 50;

        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
      }

      this.ctx.globalAlpha = 1;
    }

    this.ctx.fillStyle = state.color;
    this.ctx.font = "bold 28px -apple-system";
    this.ctx.textAlign = "center";
    this.ctx.fillText(`Week ${weekData.week}`, this.canvas.width / 2, 40);

    this.ctx.font = "bold 18px -apple-system";
    this.ctx.fillText(`${weekData.state.toUpperCase()}`, this.canvas.width / 2, 70);

    this.drawCornerMetrics(weekData);
  }

  drawGrid() {
    this.ctx.strokeStyle = "#f0f0f0";
    this.ctx.lineWidth = 0.5;
    const gridSize = 50;

    for (let x = 0; x < this.canvas.width; x += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.canvas.height);
      this.ctx.stroke();
    }

    for (let y = 0; y < this.canvas.height; y += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.canvas.width, y);
      this.ctx.stroke();
    }
  }

  drawCornerMetrics(weekData) {
    const metrics = weekData.metrics;
    const fontSize = "12px";

    this.ctx.fillStyle = "#666";
    this.ctx.font = fontSize + " monospace";
    this.ctx.textAlign = "left";

    this.ctx.fillText(
      `Silos: ${(metrics.silos * 100).toFixed(0)}%`,
      10,
      this.canvas.height - 60
    );
    this.ctx.fillText(
      `Sentiment: ${(metrics.sentiment * 100).toFixed(0)}%`,
      10,
      this.canvas.height - 40
    );

    this.ctx.textAlign = "right";
    this.ctx.fillText(
      `Response Time: ${metrics.response_time.toFixed(1)}h`,
      this.canvas.width - 10,
      this.canvas.height - 60
    );
    this.ctx.fillText(
      `Burnout Risk: ${(metrics.burnout_risk * 100).toFixed(0)}%`,
      this.canvas.width - 10,
      this.canvas.height - 40
    );
  }

  updateMetricsDisplay(weekData) {
    const metricsHtml = `
      <div class="metric">
        <span class="metric-label">Silos</span>
        <span class="metric-value">${(weekData.metrics.silos * 100).toFixed(0)}%</span>
        <div class="metric-bar">
          <div class="metric-bar-fill" style="width: ${weekData.metrics.silos * 100}%"></div>
        </div>
      </div>
      <div class="metric">
        <span class="metric-label">Sentiment</span>
        <span class="metric-value">${(weekData.metrics.sentiment * 100).toFixed(0)}%</span>
        <div class="metric-bar">
          <div class="metric-bar-fill" style="width: ${weekData.metrics.sentiment * 100}%"></div>
        </div>
      </div>
      <div class="metric">
        <span class="metric-label">Response Time</span>
        <span class="metric-value">${weekData.metrics.response_time.toFixed(1)}h</span>
        <div class="metric-bar">
          <div class="metric-bar-fill" style="width: ${(weekData.metrics.response_time / 10) * 100}%"></div>
        </div>
      </div>
      <div class="metric">
        <span class="metric-label">Burnout Risk</span>
        <span class="metric-value">${(weekData.metrics.burnout_risk * 100).toFixed(0)}%</span>
        <div class="metric-bar">
          <div class="metric-bar-fill" style="width: ${weekData.metrics.burnout_risk * 100}%"></div>
        </div>
      </div>
    `;

    document.getElementById("metrics-display").innerHTML = metricsHtml;
  }

  updateDiagnostics(weekData) {
    document.getElementById("week-value").textContent = `Week ${weekData.week}`;
    document.getElementById("mutation-value").textContent =
      weekData.mutations.length > 0 ? weekData.mutations.join(", ") : "None";
    document.getElementById("state-value").textContent = weekData.state.toUpperCase();

    const severityMap = {
      healthy: "🟢 Healthy",
      warning: "🟡 Warning",
      critical: "🔴 Critical",
      recovery: "🟠 Recovering",
    };
    document.getElementById("severity-value").textContent = severityMap[weekData.state];

    document.getElementById("root-cause-text").textContent = weekData.root_cause;
    document.getElementById("suggestion-text").textContent = weekData.suggestion;
  }

  clearDiagnostics() {
    document.getElementById("week-value").textContent = "-";
    document.getElementById("mutation-value").textContent = "-";
    document.getElementById("state-value").textContent = "-";
    document.getElementById("severity-value").textContent = "-";
    document.getElementById("root-cause-text").textContent = "-";
    document.getElementById("suggestion-text").textContent = "-";
  }

  clearMetrics() {
    document.getElementById("metrics-display").innerHTML = "";
  }

  clearCanvas() {
    this.ctx.fillStyle = "white";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

// Initialize app when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  console.log("🌿 Culture Stream Frontend initialized");
  new CultureStreamApp();
});
