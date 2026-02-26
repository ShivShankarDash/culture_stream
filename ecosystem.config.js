const path = require("path");

module.exports = {
  apps: [
    {
      name: "culture-stream-backend",
      script: path.join(__dirname, "backend/src/index.ts"),
      interpreter: "/home/ubuntu/.bun/bin/bun",
      cwd: path.join(__dirname, "backend"),
      env: {
        NODE_ENV: "development",
        PORT: 4000,
      },
      max_memory_restart: "500M",
      error_file: "/home/ubuntu/.openclaw/logs/culture-stream-backend-err.log",
      out_file: "/home/ubuntu/.openclaw/logs/culture-stream-backend-out.log",
      autorestart: true,
    },
    {
      name: "culture-stream-frontend",
      script: "python3",
      args: "-m http.server 5556 --directory public",
      cwd: path.join(__dirname, "frontend"),
      env: {
        PORT: 5556,
      },
      max_memory_restart: "200M",
      error_file: "/home/ubuntu/.openclaw/logs/culture-stream-frontend-err.log",
      out_file: "/home/ubuntu/.openclaw/logs/culture-stream-frontend-out.log",
      autorestart: true,
    },
  ],
};
