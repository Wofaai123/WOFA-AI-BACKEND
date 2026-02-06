// openaiHelper.js - WOFA AI OpenAI Helper (Feb 2026)
// Handles normal chat + image vision support

const OpenAI = require("openai");

/* ========================
   OPENAI CLIENT SETUP
   ======================== */
if (!process.env.OPENAI_API_KEY) {
  console.error("❌ OPENAI_API_KEY is missing in .env file");
  process.exit(1);
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/* ========================
   MAIN RESPONSE GENERATOR
   ======================== */
async function generateAIResponse({ question, course, lesson, image }) {
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
- If user asks for theology or spirituality topics, respond respectfully.
- If user requests correction, correct grammar and rewrite clearly.
`;

  // Default messages (text mode)
  let messages = [
    { role: "system", content: systemPrompt },
    {
      role: "user",
      content: `${contextText}\nUser Question: ${question}`
    }
  ];

  // If image exists (vision mode)
  if (image) {
    messages = [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: [
          { type: "text", text: `${contextText}\nUser Question: ${question}` },
          { type: "image_url", image_url: { url: image } }
        ]
      }
    ];
  }

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
    temperature: 0.7,
    max_tokens: 900
  });

  return completion.choices?.[0]?.message?.content || "No response generated.";
}

module.exports = { generateAIResponse };
