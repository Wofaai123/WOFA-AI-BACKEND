const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Analyze an image using OpenAI Vision
 * @param {string} base64Image - data:image/...;base64,...
 * @param {string} question
 */
async function analyzeImage(base64Image, question) {
  try {
    if (!base64Image || typeof base64Image !== "string") {
      return "";
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
                "You are WOFA AI, an expert educational visual analyst. " +
                "Teach the image clearly and accurately. " +
                "Structure your response as:\n" +
                "1. What is visible in the image\n" +
                "2. What it represents\n" +
                "3. How it relates to the question\n" +
                "4. Key learning takeaway"
            }
          ]
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: question || "Explain this image clearly for learning purposes."
            },
            {
              type: "input_image",
              image_url: base64Image
            }
          ]
        }
      ],
      max_output_tokens: 700
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

    return "No visual explanation was generated.";

  } catch (error) {
    console.error("Vision AI error:", error.message);
    return "I could not analyze the image at this time.";
  }
}

module.exports = { analyzeImage };
