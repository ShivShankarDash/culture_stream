import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || "3000", 10);

// Middleware
app.use(cors());
app.use(express.json());

// Types
interface HealthStatus {
  status: "ok" | "error";
  timestamp: string;
  service: string;
  environment: string;
  uptime: number;
}

// Health check endpoint
app.get("/health", (req, res) => {
  const health: HealthStatus = {
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "culture-stream-backend",
    environment: process.env.NODE_ENV || "development",
    uptime: process.uptime(),
  };
  res.json(health);
});

// TODO: Import routes
// import routes from './api/routes';
// app.use('/api', routes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    path: req.path,
    method: req.method,
  });
});

// Error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err);
  res.status(500).json({
    error: "Internal Server Error",
    message: process.env.NODE_ENV === "production" ? "Error" : err.message,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Culture Stream Backend`);
  console.log(`📍 Server: http://localhost:${PORT}`);
  console.log(`✅ Health: http://localhost:${PORT}/health`);
  console.log(`⚙️  Runtime: Bun ${Bun.version}`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || "development"}`);
});

export default app;
