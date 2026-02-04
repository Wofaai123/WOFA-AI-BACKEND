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
    const { question, course, lesson, level } = req.body;

    const systemPrompt = `
You are WOFA AI, a smart educational assistant.
If course or lesson is provided, tailor your response.
If not, answer normally like a general AI tutor.
Avoid sexual or explicit content.
Use clear and simple explanations.
`;

    let userPrompt = "";

    // 🎓 CONTEXT-AWARE MODE
    if (course || lesson) {
      userPrompt = `
Course: ${course || "Not specified"}
Lesson: ${lesson || "Not specified"}
Level: ${level || "General"}

Student request:
${question || "Teach this topic clearly."}
`;
    }
    // 💬 FREE CHAT MODE
    else {
      userPrompt = question || "Teach me something useful.";
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.4
    });

    res.json({
      answer: completion.choices[0].message.content
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "AI request failed" });
  }
});


module.exports = router;
