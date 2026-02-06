// groqHelper.js - WOFA AI Groq Helper (Feb 2026)

require("dotenv").config();
const Groq = require("groq-sdk");

/* ========================
   GROQ CLIENT SETUP
   ======================== */
if (!process.env.GROQ_API_KEY) {
  console.error("❌ GROQ_API_KEY is missing in .env file");
  process.exit(1);
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

/* ========================
   MAIN RESPONSE GENERATOR
   ======================== */
async function generateAIResponse({ question, course, lesson }) {
  let contextText = "";

  if (course) contextText += `Course Selected: ${course}\n`;
  if (lesson) contextText += `Lesson Selected: ${lesson}\n`;

  const systemPrompt = `
You are WOFA AI, a professional African-focused educational assistant and tutor.

Your job:
- Teach clearly step-by-step like a real teacher.
- Explain with examples.
- Be structured and accurate.
- Use simple English unless user requests advanced level.
- If user asks theology/spirituality topics, respond respectfully.
- If user requests correction, correct grammar and rewrite clearly.
`;

  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: `${contextText}\nUser Question: ${question}` }
  ];

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages,
    temperature: 0.7,
    max_tokens: 900
  });

  return completion.choices?.[0]?.message?.content || "No response generated.";
}

module.exports = { generateAIResponse };
