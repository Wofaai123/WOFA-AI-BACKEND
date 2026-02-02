const Chat = require("../models/Chat");
const { analyzeImage } = require("../services/visionService");

/* =========================
   SUBJECT DETECTION
   ========================= */
function detectSubject(question = "") {
  const q = question.toLowerCase();

  const SUBJECT_KEYWORDS = {
    Mathematics: ["math", "equation", "solve", "algebra", "calculation"],
    Physics: ["physics", "force", "energy", "motion", "velocity"],
    Chemistry: ["chemistry", "reaction", "acid", "base", "compound"],
    Biology: ["biology", "cell", "photosynthesis", "organism", "respiration"],
    History: ["history"],
    Geography: ["geography"],
    "Computer Science": ["programming", "code", "javascript", "python"]
  };

  for (const subject in SUBJECT_KEYWORDS) {
    if (SUBJECT_KEYWORDS[subject].some(keyword => q.includes(keyword))) {
      return subject;
    }
  }

  return "General Education";
}

/* =========================
   SUBJECT DIAGRAMS
   ========================= */
function getSubjectImages(subject) {
  const DIAGRAMS = {
    Biology: [
      "https://upload.wikimedia.org/wikipedia/commons/3/3a/Photosynthesis_en.svg"
    ],
    Mathematics: [
      "https://upload.wikimedia.org/wikipedia/commons/2/2c/Quadratic_formula.svg"
    ],
    Physics: [
      "https://upload.wikimedia.org/wikipedia/commons/8/8f/Free_body_diagram.svg"
    ],
    Chemistry: [
      "https://upload.wikimedia.org/wikipedia/commons/3/3b/Acid-base_reaction.svg"
    ],
    Geography: [
      "https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg"
    ]
  };

  return DIAGRAMS[subject] || [];
}

/* =========================
   MAIN CHAT CONTROLLER
   ========================= */
exports.chatAI = async (req, res) => {
  try {
    const { question, image, lessonId } = req.body;

    /* ---------- Validation ---------- */
    if (!question || typeof question !== "string" || !question.trim()) {
      return res.status(400).json({
        message: "Question is required"
      });
    }

    /* ---------- Subject Detection ---------- */
    const subject = detectSubject(question);

    /* ---------- Lesson Context ---------- */
    let lessonContext = "";
    if (lessonId) {
      lessonContext = `
Lesson context:
The learner is currently studying a lesson.
Answer strictly in relation to the lesson topic and objective.
Use lesson concepts, examples, and explanations.
`;
    }

    /* ---------- Vision AI ---------- */
    let visualContext = "";
    let chatType = "chat";

    if (image) {
      chatType = "image";
      visualContext = await analyzeImage(image, question);
    }

    /* ---------- Diagrams ---------- */
    const diagrams = image ? [] : getSubjectImages(subject);

    /* ---------- Answer Construction ---------- */
    const answer = `
${subject}

Question:
${question}

${lessonContext}

${visualContext}

Explanation:
Answer the question clearly and directly.
Focus on the core idea and explain it in simple, logical steps.

Key takeaway:
Summarize the most important point the learner should remember.

You can ask for:
- deeper explanation
- step-by-step examples
- diagrams or visual support
`.trim();

    /* ---------- Save Chat History ---------- */
    await Chat.create({
      question,
      answer,
      subject,
      image: image || null,
      type: chatType,
      lesson: lessonId || null
    });

    /* ---------- Response ---------- */
    res.json({
      subject,
      answer,
      images: diagrams
    });

  } catch (error) {
    console.error("Chat AI error:", error);
    res.status(500).json({
      message: "Server error"
    });
  }
};
