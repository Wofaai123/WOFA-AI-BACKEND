// groqHelper.js - WOFA MASTER GROQ HELPER (MULTI-FRONTEND SMART VERSION)
// Feb 2026 - Supports WOFA AI, AI Kasa, PreachMe, Rectification + Future Apps
// Render + Vercel + Netlify Compatible

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
   GLOBAL MODEL CONFIG
   ========================================================== */
const DEFAULT_MODEL = "llama-3.3-70b-versatile";

/* ==========================================================
   TIMEOUT WRAPPER (PREVENT BACKEND FREEZE)
   ========================================================== */
function withTimeout(promise, ms = 90000) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Groq request timeout")), ms)
    )
  ]);
}

/* ==========================================================
   DETECT MODE (SMART AUTO ROUTING)
   ========================================================== */
function detectMode({ course = "", lesson = "", question = "", platform = "" }) {
  const text = `${platform} ${course} ${lesson} ${question}`.toLowerCase();

  // Force platform priority
  if (platform.toLowerCase().includes("preach")) return "preachme";
  if (platform.toLowerCase().includes("ai-kasa")) return "ai-kasa";
  if (platform.toLowerCase().includes("wofa")) return "wofa-ai";

  // Auto detect preaching
  if (
    text.includes("sermon") ||
    text.includes("preach") ||
    text.includes("prophetic") ||
    text.includes("deliverance") ||
    text.includes("altar call") ||
    text.includes("fire") ||
    text.includes("holy ghost") ||
    text.includes("i decree") ||
    text.includes("i declare")
  ) {
    return "preachme";
  }

  // Auto detect rectify
  if (
    text.includes("correct") ||
    text.includes("rewrite") ||
    text.includes("grammar") ||
    text.includes("rectify") ||
    text.includes("fix this") ||
    text.includes("improve this")
  ) {
    return "rectify";
  }

  // Auto detect developer
  if (
    text.includes("code") ||
    text.includes("javascript") ||
    text.includes("css") ||
    text.includes("html") ||
    text.includes("react") ||
    text.includes("node") ||
    text.includes("express") ||
    text.includes("backend") ||
    text.includes("api") ||
    text.includes("vercel") ||
    text.includes("netlify") ||
    text.includes("render") ||
    text.includes("mongodb") ||
    text.includes("deployment") ||
    text.includes("bug") ||
    text.includes("error")
  ) {
    return "developer";
  }

  // Default
  return "wofa-ai";
}

/* ==========================================================
   SYSTEM PROMPTS PER MODE
   ========================================================== */
function buildSystemPrompt(mode) {
  if (mode === "preachme") {
    return `
You are PREACHME, a Pentecostal prophetic preaching engine.

Rules:
- Be fire-filled and deeply scriptural.
- Use Bible verses, authority, and revelation.
- Use strong prophetic tone.
- Include declarations: "I decree", "I declare", "I prophesy".
- Include deliverance commands and spiritual warfare prayers.
- End with altar call + salvation prayer when asked.
- Be structured and clear.
- Do not include markdown formatting unless asked.
- If user requests JSON format, return ONLY valid JSON.
    `.trim();
  }

  if (mode === "ai-kasa") {
    return `
You are AI KASA, a child-safe educational assistant for minors and teenagers.

Rules:
- Always be safe for children and minors.
- No adult content, no violence, no self-harm instructions, no sexual topics.
- Teach step-by-step like a friendly teacher.
- Use very simple English for young children.
- Use examples and short sentences.
- Encourage the child often.
- If Maths: show working clearly.
- If English: teach grammar and spelling gently.
- If Science: explain with real-life examples.
- If Social Studies: give accurate facts (especially Ghana topics).
- If question is unsafe: politely refuse and advise asking a parent/teacher.
- Always be kind, friendly, and supportive.
    `.trim();
  }

  if (mode === "rectify") {
    return `
You are WOFA AI Rectification Mode.

Rules:
- Correct grammar, spelling, punctuation, and clarity.
- Rewrite into clean professional English.
- Keep the same meaning.
- Return ONLY the corrected text (no extra commentary).
    `.trim();
  }

  if (mode === "developer") {
    return `
You are WOFA AI Developer Assistant.

Rules:
- Solve programming issues step-by-step.
- Give correct working code.
- Be precise and professional.
- Explain briefly then provide final solution.
- If code is provided, rewrite the entire file with fixes.
- Do not hallucinate APIs or libraries.
    `.trim();
  }

  // WOFA AI DEFAULT (Advanced Tutor)
  return `
You are WOFA AI, a professional African-focused educational assistant and tutor.

Rules:
- Teach clearly step-by-step like a real teacher.
- Explain with examples.
- Use structured headings.
- Be accurate and helpful.
- Use simple English unless user requests advanced level.
- If theology/spiritual topics arise, respond respectfully and biblically.
- If user requests correction, rewrite clearly.
- If user asks academic questions, respond at a high educational level.
    `.trim();
}

/* ==========================================================
   TOKEN CONTROL PER MODE
   ========================================================== */
function getMaxTokens(mode) {
  if (mode === "preachme") return 8192;
  if (mode === "developer") return 2500;
  if (mode === "rectify") return 1400;
  if (mode === "ai-kasa") return 1800;
  return 2200;
}

/* ==========================================================
   TEMPERATURE CONTROL PER MODE
   ========================================================== */
function getTemperature(mode) {
  if (mode === "preachme") return 0.85;
  if (mode === "ai-kasa") return 0.65;
  if (mode === "rectify") return 0.3;
  if (mode === "developer") return 0.35;
  return 0.7;
}

/* ==========================================================
   MAIN AI RESPONSE GENERATOR
   ========================================================== */
async function generateAIResponse({ question, course, lesson, platform }) {
  try {
    const safeQuestion = (question || "").trim();
    const safeCourse = (course || "").trim();
    const safeLesson = (lesson || "").trim();
    const safePlatform = (platform || "").trim();

    if (!safeQuestion) {
      return "⚠️ No question provided.";
    }

    const mode = detectMode({
      course: safeCourse,
      lesson: safeLesson,
      question: safeQuestion,
      platform: safePlatform
    });

    const systemPrompt = buildSystemPrompt(mode);
    const maxTokens = getMaxTokens(mode);
    const temperature = getTemperature(mode);

    let contextText = "";
    if (safePlatform) contextText += `Platform: ${safePlatform}\n`;
    if (safeCourse) contextText += `Course Selected: ${safeCourse}\n`;
    if (safeLesson) contextText += `Lesson Selected: ${safeLesson}\n`;

    const messages = [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `${contextText}\nUser Request:\n${safeQuestion}`
      }
    ];

    const requestPromise = groq.chat.completions.create({
      model: DEFAULT_MODEL,
      messages,
      temperature,
      max_tokens: maxTokens
    });

    const completion = await withTimeout(requestPromise, 120000);

    const content = completion.choices?.[0]?.message?.content;

    if (!content || content.trim().length === 0) {
      return "⚠️ No response generated. Please try again.";
    }

    return content.trim();

  } catch (err) {
    console.error("❌ GROQ HELPER ERROR:", err?.message || err);

    // Safe fallback (prevents frontend freezing)
    return `⚠️ AI request failed: ${err.message || "Unknown error"}`;
  }
}

module.exports = { generateAIResponse };
