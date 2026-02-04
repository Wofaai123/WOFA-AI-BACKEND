const express = require("express");
const OpenAI = require("openai");
const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/* =========================
   AI CHAT + AUTO LESSON
   ========================= */
router.post("/", async (req, res) => {
  try {
    const {
      question,
      course,
      lesson,
      level = "general"
    } = req.body;

    // 🔑 AUTO-LESSON PROMPT
    const systemPrompt = `
You are WOFA AI, an African-focused education assistant.
Teach clearly, step-by-step, and simply.
Avoid sexual or explicit content.
Use examples relevant to Africa when possible.
`;

    const lessonPrompt = `
Course: ${course || "General Education"}
Lesson: ${lesson || "General Topic"}
Level: ${level}

TASK:
1. Explain the lesson clearly
2. Give simple examples
3. Provide 3 practice questions
4. Give solutions
5. Keep language simple
`;

    const userPrompt = question
      ? `Student Question: ${question}`
      : "Generate a complete lesson.";

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: lessonPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.4
    });

    const answer = completion.choices[0].message.content;

    res.json({
      answer
    });

  } catch (err) {
    console.error("AI error:", err);
    res.status(500).json({
      message: "AI lesson generation failed"
    });
  }
});

module.exports = router;
