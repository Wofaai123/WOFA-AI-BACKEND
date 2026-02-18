// groqHelper.js - WOFA MASTER GROQ HELPER (MULTI-FRONTEND SMART VERSION)
// Feb 2026 - Supports WOFA AI, AI Kasa, PreachMe, Rectification + Future Apps

require("dotenv").config();
const Groq = require("groq-sdk");

/* ==========================================================
   GROQ CLIENT SETUP
   ========================================================== */
if (!process.env.GROQ_API_KEY) {
  console.error("❌ GROQ_API_KEY is missing in .env file");
  process.exit(1);
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

/* ==========================================================
   GLOBAL CONFIG
   ========================================================== */
const DEFAULT_MODEL = "llama-3.3-70b-versatile";

/* ==========================================================
   TIMEOUT WRAPPER (PREVENT BACKEND FREEZE)
   ========================================================== */
function withTimeout(promise, ms = 60000) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Groq request timeout")), ms)
    )
  ]);
}

/* ==========================================================
   AUTO DETECT REQUEST TYPE
   ========================================================== */
function detectMode(course = "", lesson = "", question = "") {
  const text = `${course} ${lesson} ${question}`.toLowerCase();

  if (
    text.includes("sermon") ||
    text.includes("preach") ||
    text.includes("prophetic") ||
    text.includes("deliverance") ||
    text.includes("altar call")
  ) {
    return "preachme";
  }

  if (
    text.includes("correct") ||
    text.includes("rewrite") ||
    text.includes("grammar") ||
    text.includes("rectify") ||
    text.includes("fix this")
  ) {
    return "rectify";
  }

  if (
    text.includes("code") ||
    text.includes("javascript") ||
    text.includes("css") ||
    text.includes("html") ||
    text.includes("react") ||
    text.includes("node") ||
    text.includes("backend") ||
    text.includes("api")
  ) {
    return "developer";
  }

  return "education";
}

/* ==========================================================
   SYSTEM PROMPTS PER MODE
   ========================================================== */
function buildSystemPrompt(mode) {
  if (mode === "preachme") {
    return `
You are PREACHME, a Pentecostal prophetic preaching engine.

Rules:
- Be fire-filled and scriptural.
- Use Bible verses and authority.
- Be bold, prophetic, powerful.
- Use declarations like: "I decree", "I declare", "I prophesy".
- End with altar call and salvation prayer.
- Return ONLY what the user requests.
`;
  }

  if (mode === "rectify") {
    return `
You are WOFA AI Rectification Mode.

Rules:
- Correct grammar, spelling, punctuation, clarity.
- Rewrite into clean professional English.
- Keep the same meaning.
- Return only the corrected text.
`;
  }

  if (mode === "developer") {
    return `
You are WOFA AI Developer Assistant.

Rules:
- Solve programming issues step-by-step.
- Give working code.
- Be precise and professional.
- Do not hallucinate functions.
- If code is provided, rewrite fully with fixes.
`;
  }

  return `
You are WOFA AI, a professional African-focused educational assistant and tutor.

Rules:
- Teach clearly step-by-step like a real teacher.
- Use structured headings.
- Give examples and simple explanations.
- Be accurate and helpful.
- If user asks theology/spiritual topics, respond respectfully.
`;
}

/* ==========================================================
   TOKEN CONTROL PER MODE
   ========================================================== */
function getMaxTokens(mode) {
  if (mode === "preachme") return 8192;
  if (mode === "developer") return 2048;
  if (mode === "rectify") return 1200;
  return 1500;
}

/* ==========================================================
   MAIN AI RESPONSE GENERATOR
   ========================================================== */
async function generateAIResponse({ question, course, lesson }) {
  try {
    const safeQuestion = (question || "").trim();
    const safeCourse = (course || "").trim();
    const safeLesson = (lesson || "").trim();

    if (!safeQuestion) {
      return "⚠️ No question provided.";
    }

    const mode = detectMode(safeCourse, safeLesson, safeQuestion);
    const systemPrompt = buildSystemPrompt(mode);
    const maxTokens = getMaxTokens(mode);

    let contextText = "";
    if (safeCourse) contextText += `Course Selected: ${safeCourse}\n`;
    if (safeLesson) contextText += `Lesson Selected: ${safeLesson}\n`;

    const messages = [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `${contextText}\nUser Request:\n${safeQuestion}`
      }
    ];

    // MAIN GROQ REQUEST
    const requestPromise = groq.chat.completions.create({
      model: DEFAULT_MODEL,
      messages,
      temperature: 0.7,
      max_tokens: maxTokens
    });

    const completion = await withTimeout(requestPromise, 90000);

    const content = completion.choices?.[0]?.message?.content;

    if (!content || content.trim().length === 0) {
      return "⚠️ No response generated. Please try again.";
    }

    return content;
  } catch (err) {
    console.error("❌ GROQ HELPER ERROR:", err?.message || err);

    // Safe fallback response (prevents frontend freezing)
    return `⚠️ AI request failed: ${err.message || "Unknown error"}`;
  }
}

module.exports = { generateAIResponse };
