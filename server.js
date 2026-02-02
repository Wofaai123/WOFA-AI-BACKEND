const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const app = express();

/* =========================
   GLOBAL MIDDLEWARE
   ========================= */

// CORS (open for development)
app.use(cors());

// Parse JSON & large payloads (for images)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/api/progress", require("./routes/progress"));
app.use("/api/quizzes", require("./routes/quizzes"));
app.use("/api/progress", require("./routes/progress"));
app.use("/api/debug", require("./routes/debug"));

// Simple request logger (helps debugging)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

/* =========================
   DATABASE CONNECTION
   ========================= */
(async () => {
  try {
    await connectDB();
  } catch (err) {
    console.error("❌ Failed to start server due to DB error");
    process.exit(1);
  }
})();

/* =========================
   HEALTH CHECK
   ========================= */
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    service: "WOFA AI Backend",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

/* =========================
   ROUTES
   ========================= */
app.use("/api/auth", require("./routes/auth"));
app.use("/api/chat", require("./routes/chat"));
app.use("/api/subjects", require("./routes/subjects"));
app.use("/api/courses", require("./routes/courses"));
app.use("/api/lessons", require("./routes/lessons"));

/* =========================
   404 HANDLER
   ========================= */
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found"
  });
});

/* =========================
   GLOBAL ERROR HANDLER
   ========================= */
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(err.status || 500).json({
    message: err.message || "Internal server error"
  });
});

/* =========================
   SERVER START
   ========================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 WOFA AI backend running on port ${PORT}`);
});
