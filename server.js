// server.js - WOFA AI Backend (GROQ Backbone Version - Feb 2026)
// MongoDB Removed
// Authentication Removed
// Backend serves Groq AI requests securely

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
require("dotenv").config();

const { generateAIResponse } = require("./groqHelper");

const app = express();

/* ========================
   CHECK ENV VARIABLES
   ======================== */
if (!process.env.GROQ_API_KEY) {
  console.error("❌ ERROR: GROQ_API_KEY is missing in .env file");
  process.exit(1);
}

/* ========================
   GLOBAL MIDDLEWARE
   ======================== */
app.use(helmet());
app.use(compression());

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
    credentials: false
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

/* ========================
   HEALTH CHECK
   ======================== */
app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    status: "OK",
    service: "WOFA AI Backend (Groq)",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development"
  });
});

/* ========================
   AI CHAT ENDPOINT
   ======================== */
app.post("/api/chat", async (req, res) => {
  try {
    const { question, course, lesson } = req.body;

    if (!question || question.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Question is required."
      });
    }

    const answer = await generateAIResponse({
      question,
      course,
      lesson
    });

    return res.status(200).json({
      success: true,
      answer
    });

  } catch (err) {
    console.error("❌ /api/chat error:", err?.message || err);

    return res.status(500).json({
      success: false,
      message: "AI request failed. Check backend logs."
    });
  }
});

/* ========================
   RECTIFICATION ENDPOINT
   ======================== */
app.post("/api/rectify", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Text is required."
      });
    }

    const corrected = await generateAIResponse({
      question: `Correct and improve this text. Fix grammar, spelling, punctuation, and clarity. Return only the corrected version:\n\n${text}`,
      course: "Rectification Mode",
      lesson: "Grammar Correction"
    });

    return res.status(200).json({
      success: true,
      corrected
    });

  } catch (err) {
    console.error("❌ /api/rectify error:", err?.message || err);

    return res.status(500).json({
      success: false,
      message: "Rectification failed. Check backend logs."
    });
  }
});

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
   START SERVER
   ======================== */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 WOFA AI backend running on port ${PORT}`);
});
