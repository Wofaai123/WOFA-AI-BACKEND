// groqHelper.js - WOFA MASTER GROQ HELPER (PLATFORM INTELLIGENCE VERSION)
// Feb 2026 - Supports WOFA AI, AI Kasa (Minors Safe), PreachMe, Rectify, Developer, Future Apps

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
const DEFAULT_TIMEOUT = 90000;

/* ==========================================================
   TIMEOUT WRAPPER (PREVENT BACKEND FREEZE)
   ========================================================== */
function withTimeout(promise, ms = DEFAULT_TIMEOUT) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Groq request timeout. Try again.")), ms)
    )
  ]);
}

/* ==========================================================
   PLATFORM DETECTION
   ========================================================== */
function detectPlatform(platform = "") {
  const p = (platform || "").toLowerCase().trim();

  if (p.includes("preach")) return "preachme";
  if (p.includes("kasa")) return "ai-kasa";
  if (p.includes("wofa")) return "wofa-ai";

  return "general";
}

/* ==========================================================
   AUTO MODE DETECTION (SECONDARY)
   ========================================================== */
function detectMode(question = "") {
  const text = (question || "").toLowerCase();

  if (
    text.includes("sermon") ||
    text.includes("preach") ||
    text.includes("deliverance") ||
    text.includes("prophetic") ||
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
    text.includes("api") ||
    text.includes("error")
  ) {
    return "developer";
  }

  return "education";
}

/* ==========================================================
   SYSTEM PROMPT BUILDER (BASED ON PLATFORM)
   ========================================================== */
function buildSystemPrompt(platformMode, mode) {
  // PREACHME (Prophetic engine)
  if (platformMode === "preachme" || mode === "preachme") {
    return `
You are PREACHME, a powerful Pentecostal prophetic preaching and Bible teaching engine.

STRICT RULES:
- Write like a real anointed preacher.
- Use Bible scriptures and spiritual authority.
- Use strong prophetic declarations ("I decree", "I declare", "I prophesy").
- Include warfare prayers and deliverance commands.
- Be intense, fiery, revival-focused.
- End with altar call + salvation prayer.
- Do not act like a school teacher.
`;
  }

  // AI KASA (Minors + Basic education)
  if (platformMode === "ai-kasa") {
    return `
You are AI KASA, a safe and friendly learning assistant for children and minors.

STRICT RULES:
- Use simple English.
- Teach like a kind teacher for kids.
- Give short explanations and examples.
- Do NOT use adult content.
- Do NOT use explicit sexual content.
- Do NOT promote violence.
- If question is inappropriate, refuse politely and redirect to safe learning.
- Encourage good morals, respect, and positive behavior.
- Keep answers short, clear, and easy.
`;
  }

  // WOFA AI (Academic + University standard)
  if (platformMode === "wofa-ai") {
    return `
You are WOFA AI, a high-level academic educational assistant.

STRICT RULES:
- Teach at university / professional level.
- Provide structured answers with headings.
- Use definitions, frameworks, examples, and references.
- Use critical thinking and deep explanations.
- If theology/spirituality is asked, respond respectfully with scripture and scholarly balance.
- If user requests code or technical solutions, respond professionally.
`;
  }

  // RECTIFICATION MODE
  if (mode === "rectify") {
    return `
You are WOFA AI Rectification Engine.

RULES:
- Fix grammar, punctuation, spelling, and clarity.
- Rewrite professionally.
- Keep original meaning.
- Return ONLY the corrected version.
`;
  }

  // DEVELOPER MODE
  if (mode === "developer") {
    return `
You are WOFA AI Developer Assistant.

RULES:
- Debug code professionally.
- Explain the bug clearly.
- Rewrite full working code when necessary.
- Do not remove buttons or change IDs unless asked.
- Provide production-ready fixes.
`;
  }

  // GENERAL EDUCATION
  return `
You are WOFA AI General Assistant.

RULES:
- Explain clearly.
- Be accurate.
- Use structured responses.
- Adapt difficulty to user request.
`;
}

/* ==========================================================
   TOKEN CONTROL PER PLATFORM
   ========================================================== */
function getMaxTokens(platformMode, mode) {
  if (platformMode === "preachme" || mode === "preachme") return 8192;
  if (platformMode === "wofa-ai") return 2500;
  if (platformMode === "ai-kasa") return 900;
  if (mode === "developer") return 2000;
  if (mode === "rectify") return 1200;
  return 1500;
}

/* ==========================================================
   MAIN AI RESPONSE GENERATOR
   ========================================================== */
async function generateAIResponse({
  question,
  course,
  lesson,
  platform
}) {
  try {
    const safeQuestion = (question || "").trim();
    const safeCourse = (course || "").trim();
    const safeLesson = (lesson || "").trim();

    if (!safeQuestion) {
      return "⚠️ No question provided.";
    }

    const platformMode = detectPlatform(platform);
    const mode = detectMode(safeQuestion);

    const systemPrompt = buildSystemPrompt(platformMode, mode);
    const maxTokens = getMaxTokens(platformMode, mode);

    let contextText = "";
    if (safeCourse) contextText += `Course: ${safeCourse}\n`;
    if (safeLesson) contextText += `Lesson: ${safeLesson}\n`;
    if (platformMode) contextText += `Platform: ${platformMode}\n`;

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
      temperature: platformMode === "ai-kasa" ? 0.5 : 0.7,
      max_tokens: maxTokens
    });

    const completion = await withTimeout(requestPromise, DEFAULT_TIMEOUT);

    const content = completion.choices?.[0]?.message?.content;

    if (!content || content.trim().length === 0) {
      return "⚠️ No response generated. Please try again.";
    }

    return content;
  } catch (err) {
    console.error("❌ GROQ HELPER ERROR:", err?.message || err);
    return `⚠️ AI request failed: ${err.message || "Unknown error"}`;
  }
}

module.exports = { generateAIResponse };
