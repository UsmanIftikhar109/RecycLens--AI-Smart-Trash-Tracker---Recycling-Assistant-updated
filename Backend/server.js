// ──────────────────────────────────────────────
//  RecycLens — Backend Entry Point (server.js)
// ──────────────────────────────────────────────

// ─── 1. Load environment variables ───────────
require('dotenv').config();

// ─── 2. Import dependencies ─────────────────
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const connectDB = require('./config/db');

// ─── 3. Import route files ──────────────────
const authRoutes = require("./routes/auth");
const scanRoutes = require("./routes/scans");
const centerRoutes = require("./routes/centers");
const tipRoutes = require("./routes/tips");
const profileRoutes = require("./routes/profile");

// ─── 4. Initialize Express app ──────────────
const app = express();
const PORT = Number(process.env.PORT) || 5001;
const HOST = process.env.HOST || "0.0.0.0";

// ─── 5. Security & body-parsing middleware ──
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// ─── 6. Request logger (development helper) ─
app.use((req, _res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

// ─── 7. Health-check endpoint ───────────────
app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    service: "recyclens-backend",
    uptime: process.uptime(),
  });
});

// ─── 8. Mount route files ───────────────────
app.use("/api/auth", authRoutes);
app.use("/api/scans", scanRoutes);
app.use("/api/centers", centerRoutes);
app.use("/api/tips", tipRoutes);
app.use("/api/profile", profileRoutes);

// ─── 9. Connect to MongoDB & start server ───
const startServer = async () => {
  try {
    // Connect using the shared helper (calls mongoose.connect once)
    await connectDB();

    // ── Start listening ───────────────────
    app.listen(PORT, HOST, () => {
      console.log(`🚀 Server running on http://${HOST}:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
    process.exit(1);
  }
};

startServer();

// ─── 10. Graceful shutdown ──────────────────
const gracefulShutdown = async (signal) => {
  console.log(`\n${signal} received — shutting down gracefully…`);
  await mongoose.connection.close();
  console.log("🛑 MongoDB connection closed.");
  process.exit(0);
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));