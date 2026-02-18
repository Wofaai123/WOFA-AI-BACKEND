// server.js - WOFA MASTER BACKEND (MULTI FRONTEND INTELLIGENCE ENGINE)
// Feb 2026 - One Backend Serving WOFA AI, AI Kasa, PreachMe, and Future Apps

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const { generateAIResponse } = require("./groqHelper");

const app = express();

/* ==========================================================
   ENV CHECK
   ========================================================== */
if (!process.env.GROQ_API_KEY) {
  console.error("❌ ERROR: GROQ_API_KEY missing in .env file");
  process.exit(1);
}

/* ==========================================================
   TRUST PROXY (IMPORTANT FOR RENDER)
   ========================================================== */
app.set("trust proxy", 1);

/* ==========================================================
   FRONTEND DOMAINS (10 FRONTENDS READY)
   Add your 10 frontends here.
   Future apps can be added easily.
   ========================================================== */
const allowedOrigins = [
  // WOFA AI
  "https://wofa-ai.vercel.app",

  // AI KASA
  "https://ai-kasa.vercel.app",

  // PREACHME
  "https://preachme.vercel.app",

  // OTHER APPS (future)
  "https://app1.vercel.app",
  "https://app2.vercel.app",
  "https://app3.vercel.app",
  "https://app4.vercel.app",
  "https://app5.vercel.app",
  "https://app6.vercel.app",
  "https://app7.vercel.app",

  // Localhost
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:5500"
];

/* ==========================================================
   CORS CONFIG (MULTI FRONTEND SAFE)
   ========================================================== */
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.log("⛔ Blocked by CORS:", origin);
    return callback(new Error("CORS blocked: Origin not allowed"), false);
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
  credentials: false
};

/* ==========================================================
   GLOBAL MIDDLEWARE
   ========================================================== */
app.use(helmet());
app.use(compression());
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

/* ==========================================================
   RATE LIMIT (PREVENT SPAM ACROSS ALL APPS)
   ========================================================== */
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 80,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please wait and try again."
  }
});

app.use("/api", limiter);

/* ==========================================================
   HELPER: SAFE JSON PARSER
   (Used for preachme structured output)
   ========================================================== */
function safeJsonParse(text) {
  try {
    return JSON.parse(text);
  } catch (err) {
    const first = text.indexOf("{");
    const last = text.lastIndexOf("}");
    if (first === -1 || last === -1) return null;

    try {
      return JSON.parse(text.slice(first, last + 1));
    } catch (err2) {
      return null;
    }
  }
}

/* ==========================================================
   HEALTH CHECK
   ========================================================== */
app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    status: "OK",
    service: "WOFA MASTER BACKEND (WOFA AI + AI KASA + PREACHME)",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    allowedFrontends: allowedOrigins.length
  });
});

app.get("/api/health", (req, res) => {
  return res.status(200).json({
    success: true,
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

/* ==========================================================
   MAIN CHAT ENDPOINT (WOFA AI + AI KASA)
   Frontends must send:
   { question, course, lesson, platform }
   platform = "wofa-ai" | "ai-kasa" | "general"
   ========================================================== */
app.post("/api/chat", async (req, res) => {
  try {
    const { question, course, lesson, platform } = req.body;

    if (!question || question.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Question is required."
      });
    }

    const answer = await generateAIResponse({
      question,
      course,
      lesson,
      platform
    });

    return res.status(200).json({
      success: true,
      platform: platform || "general",
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

/* ==========================================================
   RECTIFICATION ENDPOINT
   ========================================================== */
app.post("/api/rectify", async (req, res) => {
  try {
    const { text, platform } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Text is required."
      });
    }

    const corrected = await generateAIResponse({
      question: `Correct and improve this text. Fix grammar, spelling, punctuation, and clarity. Return ONLY the corrected version:\n\n${text}`,
      course: "Rectification",
      lesson: "Grammar",
      platform: platform || "wofa-ai"
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

/* ==========================================================
   PREACHME SERMON ENDPOINT
   Frontend sends:
   { topic, mode, previousText, platform:"preachme" }
   ========================================================== */
app.post("/api/preach", async (req, res) => {
  try {
    const { topic, mode, previousText } = req.body;

    if (!topic || topic.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Topic is required."
      });
    }

    const cleanTopic = topic.trim();
    const finalMode = mode || "new";

    // CONTINUE MODE
    if (finalMode === "continue") {
      if (!previousText || previousText.trim().length < 50) {
        return res.status(400).json({
          success: false,
          message: "previousText is required for continue mode."
        });
      }

      const continuation = await generateAIResponse({
        question: `
Continue this prophetic sermon on "${cleanTopic}".

Do NOT repeat previous content.
Continue with warfare prayers, declarations, and deliverance.

Previous sermon:
"""
${previousText.slice(0, 20000)}
"""

Return ONLY the continuation preaching script.
        `,
        course: "PREACHME CONTINUATION",
        lesson: cleanTopic,
        platform: "preachme"
      });

      return res.status(200).json({
        success: true,
        preachingScript: continuation
      });
    }

    // NEW SERMON MODE (JSON STRUCTURED)
    const sermonJsonText = await generateAIResponse({
      question: `
Generate a complete prophetic sermon on:

"${cleanTopic}"

Return ONLY JSON in this exact structure:

{
  "title": "",
  "definition": "",
  "teachingOutline": ["", "", "", "", "", "", "", "", "", ""],
  "teachingScript": "",
  "preachingScript": ""
}

Rules:
- teachingOutline MUST contain exactly 10 points
- End preachingScript with altar call + salvation prayer
- Use Pentecostal prophetic fire and deliverance language
- No markdown, no explanations.
      `,
      course: "PREACHME SERMON MODE",
      lesson: cleanTopic,
      platform: "preachme"
    });

    const parsed = safeJsonParse(sermonJsonText);

    if (!parsed) {
      console.error("❌ PREACHME JSON PARSE FAILED:", sermonJsonText);
      return res.status(500).json({
        success: false,
        message: "AI returned invalid sermon JSON. Try again."
      });
    }

    if (!parsed.teachingScript || !parsed.preachingScript) {
      return res.status(500).json({
        success: false,
        message: "Sermon generation incomplete. Try again."
      });
    }

    if (!Array.isArray(parsed.teachingOutline) || parsed.teachingOutline.length !== 10) {
      parsed.teachingOutline = Array(10).fill("Key teaching point");
    }

    return res.status(200).json({
      success: true,
      title: parsed.title || cleanTopic,
      definition: parsed.definition || "",
      teachingOutline: parsed.teachingOutline,
      teachingScript: parsed.teachingScript,
      preachingScript: parsed.preachingScript
    });
  } catch (err) {
    console.error("❌ /api/preach error:", err?.message || err);

    return res.status(500).json({
      success: false,
      message: "Sermon generation failed. Check backend logs."
    });
  }
});

/* ==========================================================
   404 HANDLER
   ========================================================== */
app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

/* ==========================================================
   GLOBAL ERROR HANDLER
   ========================================================== */
app.use((err, req, res, next) => {
  console.error("🔥 GLOBAL ERROR:", err.message);

  return res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});

/* ==========================================================
   START SERVER
   ========================================================== */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 WOFA MASTER backend running on port ${PORT}`);
  console.log(`🌍 Allowed Frontends: ${allowedOrigins.length}`);
});
