const express = require("express");
const path = require("path");

const app = express();
const PORT = 9000;

// Serve static files from public directory
app.use(express.static(path.join(__dirname, "public")));

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "culture-stream-demo" });
});

// Serve index.html for root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`🌿 Culture Stream Demo`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`✅ Running on port ${PORT}`);
});
