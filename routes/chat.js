const express = require("express");
const router = express.Router();
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

router.post("/", async (req, res) => {
  try {
    const { question, course, lesson } = req.body;

    if (!course || !lesson) {
      return res.json({
        answer:
          "📘 Please select a course and lesson from the learning panel first."
      });
    }

    /* =========================
       SYSTEM PROMPT (CORE BRAIN)
       ========================= */
    const systemPrompt = `
You are WOFA AI, an African-centered intelligent learning assistant.

Teach the lesson clearly and patiently.

Course: ${course}
Lesson: ${lesson}

Rules:
- Explain like a professional teacher
- Use simple language first, then deeper explanation
- Use African / global examples when helpful
- Avoid sexual content
- Be accurate, structured, and encouraging
- End with 2 reflection questions
`;

    const userPrompt = question
      ? question
      : `Teach me this lesson from scratch.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ]
    });

    res.json({
      answer: completion.choices[0].message.content
    });

  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({
      answer: "❌ WOFA AI could not generate this lesson right now."
    });
  }
});

module.exports = router;
