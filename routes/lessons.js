// routes/lessons.js
const express = require("express");
const router = express.Router();

/* =========================
   GET LESSONS BY COURSE
   Montessori → PhD (Generic)
   ========================= */
router.get("/:courseId", (req, res) => {
  try {
    const { courseId } = req.params;

    // Generic lesson structure (frontend + AI-driven)
    const lessons = [
      {
        _id: `${courseId}-intro`,
        title: "Introduction"
      },
      {
        _id: `${courseId}-core`,
        title: "Core Concepts"
      },
      {
        _id: `${courseId}-practice`,
        title: "Examples & Practice"
      },
      {
        _id: `${courseId}-assessment`,
        title: "Assessment & Review"
      }
    ];

    res.json(lessons);

  } catch (error) {
    console.error("❌ Lessons route error:", error);
    res.status(500).json({ message: "Failed to load lessons" });
  }
});

module.exports = router;
