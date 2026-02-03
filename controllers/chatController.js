const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/* =========================
   SMART PROMPT BUILDER
   ========================= */
function buildPrompt({ course, lesson, level, question, mode }) {
  const baseContext = `
You are WOFA AI, a world-class educational assistant.
Audience level: ${level || "General"}
Course: ${course || "General Education"}
Lesson topic: ${lesson || "General Topic"}
Language: Simple, clear, structured.
Audience may include learners in low-bandwidth regions.
`;

  if (mode === "lesson") {
    return `
${baseContext}

TASK:
Teach the lesson "${lesson}".

REQUIREMENTS:
- Start with a clear introduction
- Explain concepts step-by-step
- Use simple examples
- End with a short summary
- Avoid unnecessary jargon
`;
  }

  if (mode === "outline") {
    return `
${baseContext}

TASK:
Create a structured lesson outline for "${lesson}".

FORMAT:
1. Lesson Objectives
2. Key Concepts
3. Examples
4. Practice Ideas
5. Summary
`;
  }

  if (mode === "quiz") {
    return `
${baseContext}

TASK:
Create a short quiz on "${lesson}".

FORMAT:
- 5 multiple choice questions
- Provide correct answers at the end
- Keep difficulty appropriate for ${level}
`;
  }

  // Default: chat / Q&A
  return `
${baseContext}

TASK:
Answer the student's question clearly and helpfully.

QUESTION:
${question}
`;
}

/* =========================
   CHAT ENDPOINT
   ========================= */
exports.chatAI = async (req, res) => {
  try {
    const {
      question,
      course,
      lesson,
      level,
      mode = "chat"
    } = req.body;

    const prompt = buildPrompt({
      course,
      lesson,
      level,
      question,
      mode
    });

    const response = await client.responses.create({
      model: "gpt-4.1-mini", // cheaper + fast
      input: prompt,
      max_output_tokens: 900
    });

    res.json({
      answer: response.output_text,
      meta: {
        course,
        lesson,
        level,
        mode
      }
    });

  } catch (error) {
    console.error("WOFA AI chat error:", error);
    res.status(500).json({
      message: "AI service unavailable. Try again."
    });
  }
};
