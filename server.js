// server.js - WOFA AI Backend (Production-ready 2026 version)

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = require("./config/db");

const app = express();

/* ========================
   GLOBAL MIDDLEWARE
   ======================== */

// Security headers
app.use(helmet());

// Compression (faster responses)
app.use(compression());

// CORS Configuration
app.use(
  cors({
    origin: "*", // Change later to your Netlify frontend domain
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false
  })
);

// Body parsers
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

// Logging
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

/* ========================
   HEALTH CHECK
   ======================== */
app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    status: "OK",
    service: "WOFA AI Backend",
    database: mongoose.connection.readyState === 1 ? "connected" : "not connected",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development"
  });
});

/* ========================
   API ROUTES
   ======================== */
app.use("/api/auth", require("./routes/auth"));
app.use("/api/chat", require("./routes/chat"));
app.use("/api/subjects", require("./routes/subjects"));
app.use("/api/courses", require("./routes/courses"));
app.use("/api/lessons", require("./routes/lessons"));
app.use("/api/progress", require("./routes/progress"));

/* ========================
   404 HANDLER
   ======================== */
app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

/* ========================
   GLOBAL ERROR HANDLER
   ======================== */
app.use((err, req, res, next) => {
  console.error("🔥 Unhandled error:", err);

  return res.status(500).json({
    success: false,
    message: "Internal server error"
  });
});

/* ========================
   START SERVER
   ======================== */
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`🚀 WOFA AI backend running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
    process.exit(1);
  }
};

startServer();

/* ========================
   GRACEFUL SHUTDOWN (Render)
   ======================== */
const shutdown = async () => {
  console.log("🛑 Shutdown signal received...");

  try {
    await mongoose.connection.close();
    console.log("✅ MongoDB connection closed.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error during shutdown:", err.message);
    process.exit(1);
  }
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
