class RopeAnimation {
  constructor() {
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.isRunning = false;
    this.isPaused = false;
    this.speed = 1;
    this.currentWeek = 1;
    this.animationFrameId = null;

    this.setupEventListeners();
    this.drawBlank();
  }

  setupEventListeners() {
    document.getElementById("start-btn").addEventListener("click", () => this.start());
    document.getElementById("pause-btn").addEventListener("click", () => this.togglePause());
    document.getElementById("reset-btn").addEventListener("click", () => this.reset());
    document.getElementById("speed").addEventListener("change", (e) => {
      this.speed = parseFloat(e.target.value);
      document.getElementById("speed-value").textContent = this.speed + "x";
    });
  }

  drawBlank() {
    this.ctx.fillStyle = "white";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  getWeekData(week) {
    const data = {
      1: { color: "#667eea", fray: 0, label: "Week 1 - Healthy" },
      2: { color: "#667eea", fray: 0, label: "Week 2 - Healthy" },
      3: { color: "#f5a623", fray: 0.2, label: "Week 3 - Warning" },
      4: { color: "#f5a623", fray: 0.3, label: "Week 4 - Warning" },
      5: { color: "#ff6b6b", fray: 0.5, label: "Week 5 - Critical" },
      6: { color: "#ff6b6b", fray: 0.6, label: "Week 6 - Critical" },
      7: { color: "#52d3aa", fray: 0.4, label: "Week 7 - Recovery" },
      8: { color: "#667eea", fray: 0.1, label: "Week 8 - Healed" },
    };
    return data[week] || data[1];
  }

  drawRope(weekData) {
    this.drawBlank();

    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const radius = 80;

    // Draw rope segments
    const segments = 20;
    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      this.ctx.strokeStyle = weekData.color;
      this.ctx.lineWidth = 3;
      this.ctx.globalAlpha = 1 - weekData.fray * 0.3;
      this.ctx.beginPath();
      this.ctx.moveTo(centerX, centerY);
      this.ctx.lineTo(x, y);
      this.ctx.stroke();
      this.ctx.globalAlpha = 1;
    }

    // Draw fraying if applicable
    if (weekData.fray > 0.05) {
      this.ctx.strokeStyle = weekData.color;
      this.ctx.globalAlpha = 0.4;
      this.ctx.lineWidth = 1;

      for (let i = 0; i < Math.floor(segments * weekData.fray); i++) {
        const angle = Math.random() * Math.PI * 2;
        const x1 = centerX + Math.cos(angle) * radius;
        const y1 = centerY + Math.sin(angle) * radius;
        const x2 = x1 + (Math.random() - 0.5) * 60;
        const y2 = y1 + (Math.random() - 0.5) * 60;

        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
      }

      this.ctx.globalAlpha = 1;
    }

    // Draw label
    this.ctx.fillStyle = weekData.color;
    this.ctx.font = "bold 24px monospace";
    this.ctx.textAlign = "center";
    this.ctx.fillText(weekData.label, this.canvas.width / 2, 50);
  }

  async animateWeek(week) {
    return new Promise((resolve) => {
      const weekData = this.getWeekData(week);
      const startTime = Date.now();
      const duration = (7000 / this.speed);

      const animate = () => {
        if (this.isPaused) {
          this.animationFrameId = requestAnimationFrame(animate);
          return;
        }

        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Interpolate fray value
        const prevData = week > 1 ? this.getWeekData(week - 1) : weekData;
        const interpolatedFray = prevData.fray + (weekData.fray - prevData.fray) * progress;

        const displayData = {
          color: weekData.color,
          fray: interpolatedFray,
          label: weekData.label,
        };

        this.drawRope(displayData);

        if (progress < 1) {
          this.animationFrameId = requestAnimationFrame(animate);
        } else {
          resolve();
        }
      };

      this.animationFrameId = requestAnimationFrame(animate);
    });
  }

  async start() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.currentWeek = 1;

    document.getElementById("start-btn").disabled = true;
    document.getElementById("pause-btn").disabled = false;
    document.getElementById("reset-btn").disabled = false;
    document.getElementById("speed").disabled = false;

    for (let week = 1; week <= 8; week++) {
      if (!this.isRunning) break;
      this.currentWeek = week;
      await this.animateWeek(week);
    }

    this.isRunning = false;
    document.getElementById("start-btn").disabled = false;
    document.getElementById("pause-btn").disabled = true;
    document.getElementById("speed").disabled = true;
  }

  togglePause() {
    this.isPaused = !this.isPaused;
    const btn = document.getElementById("pause-btn");
    btn.textContent = this.isPaused ? "Resume" : "Pause";
  }

  reset() {
    this.isRunning = false;
    this.isPaused = false;
    this.currentWeek = 1;

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    document.getElementById("start-btn").disabled = false;
    document.getElementById("pause-btn").disabled = true;
    document.getElementById("pause-btn").textContent = "Pause";
    document.getElementById("reset-btn").disabled = true;
    document.getElementById("speed").disabled = true;

    this.drawBlank();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new RopeAnimation();
});
