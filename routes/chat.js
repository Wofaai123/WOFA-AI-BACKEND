const express = require("express");
const OpenAI = require("openai");

const router = express.Router();

/* =========================
   OPENAI CLIENT
   ========================= */
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/* =========================
   POST /api/chat
   ========================= */
router.post("/", async (req, res) => {
  try {
    const { question, course, lesson, level, image } = req.body;

    // Validate input
    if (!question && !course && !lesson && !image) {
      return res.status(400).json({
        success: false,
        message: "Please provide a question, lesson, course, or image."
      });
    }

    // System prompt (controls WOFA AI personality)
    const systemPrompt = `
You are WOFA AI, a smart educational assistant built for African-focused learning.
You must teach clearly like a professional teacher.

RULES:
- Be simple, clear, and structured.
- If course/lesson is provided, focus strongly on that topic.
- Give step-by-step explanations.
- Use examples (especially African context when possible).
- If the user asks for code, provide working code examples.
- Avoid sexual, explicit, or harmful content.
- If question is unclear, ask the user a clarifying question.
- End with a short "Quick Summary" section when possible.
`;

    // Build user prompt (course + lesson context)
    let userPrompt = "";

    if (course || lesson) {
      userPrompt = `
COURSE: ${course || "Not specified"}
LESSON: ${lesson || "Not specified"}
LEVEL: ${level || "General"}

STUDENT QUESTION:
${question || "Explain this lesson clearly."}
`;
    } else {
      userPrompt = question || "Teach me something useful today.";
    }

    /* =========================
       IMAGE SUPPORT (BASE64)
       ========================= */
    let messages = [
      { role: "system", content: systemPrompt }
    ];

    if (image) {
      // GPT-4o-mini supports vision input
      messages.push({
        role: "user",
        content: [
          { type: "text", text: userPrompt },
          {
            type: "image_url",
            image_url: {
              url: image
            }
          }
        ]
      });
    } else {
      messages.push({ role: "user", content: userPrompt });
    }

    /* =========================
       OPENAI REQUEST
       ========================= */
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.4,
      max_tokens: 800
    });

    const answer = completion?.choices?.[0]?.message?.content;

    if (!answer) {
      return res.status(500).json({
        success: false,
        message: "AI returned an empty response."
      });
    }

    return res.status(200).json({
      success: true,
      answer
    });

  } catch (err) {
    console.error("🔥 Chat AI Error:", err);

    // Handle OpenAI errors safely
    return res.status(500).json({
      success: false,
      message: "AI request failed. Please try again."
    });
  }
});

module.exports = router;
