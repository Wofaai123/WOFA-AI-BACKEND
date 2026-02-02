const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Generate structured lesson content using AI
 * @param {string} title
 * @param {string} objective
 * @param {string} level
 */
async function generateLessonContent(title, objective, level = "Beginner") {
  try {
    if (!title) {
      return "Lesson title is missing.";
    }

    const response = await client.responses.create({
      model: "gpt-4o",
      input: [
        {
          role: "system",
          content: [
            {
              type: "text",
              text:
                "You are WOFA AI, a professional educational instructor. " +
                "Generate lesson content that is clear, accurate, and easy to understand. " +
                "Structure the lesson strictly as:\n" +
                "1. Introduction\n" +
                "2. Core Explanation\n" +
                "3. Examples\n" +
                "4. Summary / Key Takeaways\n\n" +
                "Use simple language. Avoid fluff. Teach clearly."
            }
          ]
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text:
                `Lesson Title: ${title}\n` +
                `Objective: ${objective || "Understand the topic"}\n` +
                `Level: ${level}\n\n` +
                "Teach this lesson clearly."
            }
          ]
        }
      ],
      max_output_tokens: 900
    });

    // Normalize output
    if (response.output_text) {
      return response.output_text;
    }

    if (response.output && Array.isArray(response.output)) {
      return response.output
        .map(item => item.content?.map(c => c.text).join(" "))
        .join("\n");
    }

    return "Lesson content could not be generated.";

  } catch (error) {
    console.error("Lesson AI error:", error.message);
    return "Lesson content generation failed.";
  }
}

module.exports = { generateLessonContent };
