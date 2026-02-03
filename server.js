// server.js - WOFA AI Backend (Production-ready 2026 version)

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");          // ← added: security headers
const compression = require("compression"); // ← added: gzip
const morgan = require("morgan");          // ← added: better logging
require("dotenv").config();

const connectDB = require("./config/db");

const app = express();

// ========================
// GLOBAL MIDDLEWARE
// ========================

// Security headers (very important on Render/public APIs)
app.use(helmet());

// Compression (saves bandwidth, faster responses)
app.use(compression());

// CORS (allow all for dev; restrict in prod if needed)
app.use(cors({
  origin: "*", // ← change to your frontend URL(s) in production
  credentials: true,
}));

// Body parsers with sane limits
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Logging (dev = tiny, prod = combined)
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// ========================
// HEALTH CHECK (Render-friendly)
// ========================
app.get("/", (req, res) => {
  res.status(200).json({
    status: "OK",
    service: "WOFA AI Backend",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// ========================
// ROUTES
// ========================
app.use("/api/auth", require("./routes/auth"));
app.use("/api/chat", require("./routes/chat"));
app.use("/api/subjects", require("./routes/subjects"));
app.use("/api/courses", require("./routes/courses"));
app.use("/api/lessons", require("./routes/lessons"));
app.use("/api/progress", require("./routes/progress"));
// app.use("/api/quizzes", require("./routes/quizzes")); // uncomment when ready

// ========================
// 404 HANDLER
// ========================
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ========================
// GLOBAL ERROR HANDLER
// ========================
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack); // full stack in logs
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: status === 500 ? "Internal server error" : err.message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }), // dev only
  });
});

// ========================
// GRACEFUL SHUTDOWN (important on Render)
// ========================
const gracefulShutdown = async () => {
  console.log("Received shutdown signal. Closing server...");
  try {
    // Close DB connection cleanly
    await mongoose.connection.close();
    console.log("MongoDB connection closed.");
    process.exit(0);
  } catch (err) {
    console.error("Error during shutdown:", err);
    process.exit(1);
  }
};

process.on("SIGTERM", gracefulShutdown); // Render / Docker sends SIGTERM
process.on("SIGINT", gracefulShutdown);  // Ctrl+C

// ========================
// START SERVER
// ========================
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 WOFA AI backend running on port ${PORT} in ${process.env.NODE_ENV || "development"} mode`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to start server due to DB error:", err);
    process.exit(1);
  });