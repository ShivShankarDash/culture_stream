// Culture Stream - Main Frontend Application
// This will be enhanced with:
// - Rope animation (Canvas)
// - Metrics display (real-time updates)
// - Diagnostic boxes (mutation info)
// - API integration (connect to backend)

const API_BASE = 'http://localhost:3000';

class CultureStreamApp {
  constructor() {
    this.simulationId = null;
    this.currentWeek = 1;
    this.isRunning = false;
    this.isPaused = false;
    this.speed = 1;
    this.canvas = document.getElementById('rope-canvas');
    this.ctx = this.canvas.getContext('2d');
    
    this.setupEventListeners();
  }

  setupEventListeners() {
    document.getElementById('start-btn').addEventListener('click', () => this.startSimulation());
    document.getElementById('pause-btn').addEventListener('click', () => this.togglePause());
    document.getElementById('reset-btn').addEventListener('click', () => this.resetSimulation());
    document.getElementById('speed').addEventListener('change', (e) => {
      this.speed = parseFloat(e.target.value);
    });
  }

  async startSimulation() {
    try {
      console.log('Starting simulation...');
      // TODO: Call backend POST /api/simulation/start
      // const response = await fetch(`${API_BASE}/api/simulation/start`, { method: 'POST' });
      // const data = await response.json();
      // this.simulationId = data.simulation_id;
      
      this.isRunning = true;
      this.currentWeek = 1;
      document.getElementById('start-btn').disabled = true;
      document.getElementById('pause-btn').disabled = false;
      document.getElementById('reset-btn').disabled = false;
      
      this.animate();
    } catch (error) {
      console.error('Error starting simulation:', error);
    }
  }

  togglePause() {
    this.isPaused = !this.isPaused;
    document.getElementById('pause-btn').textContent = this.isPaused ? 'Resume' : 'Pause';
  }

  resetSimulation() {
    this.isRunning = false;
    this.isPaused = false;
    this.currentWeek = 1;
    this.simulationId = null;
    document.getElementById('start-btn').disabled = false;
    document.getElementById('pause-btn').disabled = true;
    document.getElementById('reset-btn').disabled = true;
    document.getElementById('pause-btn').textContent = 'Pause';
    this.clearCanvas();
  }

  async animate() {
    if (!this.isRunning) return;
    
    if (!this.isPaused) {
      // TODO: Fetch week data from backend
      // const response = await fetch(`${API_BASE}/api/simulation/${this.simulationId}/week/${this.currentWeek}`);
      // const weekData = await response.json();
      
      this.renderWeek(this.currentWeek);
      
      if (this.currentWeek < 8) {
        this.currentWeek++;
        setTimeout(() => this.animate(), (7000 / this.speed)); // 7 seconds per week (adjusted by speed)
      } else {
        this.isRunning = false;
        document.getElementById('start-btn').disabled = false;
        document.getElementById('pause-btn').disabled = true;
      }
    } else {
      setTimeout(() => this.animate(), 100);
    }
  }

  renderWeek(week) {
    // TODO: Render rope animation based on week data
    // This will be enhanced with Canvas rope animation logic
    console.log(`Rendering week ${week}`);
    
    // Placeholder: Draw something on canvas
    this.ctx.fillStyle = '#667eea';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.ctx.fillStyle = 'white';
    this.ctx.font = '20px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(`Week ${week}`, this.canvas.width / 2, this.canvas.height / 2);
  }

  clearCanvas() {
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new CultureStreamApp();
  console.log('Culture Stream App initialized');
});
