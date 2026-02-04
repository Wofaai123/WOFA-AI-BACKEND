// routes/courses.js
const express = require("express");
const router = express.Router();

/* =========================
   GET ALL COURSES
   Montessori → PhD (Global)
   ========================= */
router.get("/", (req, res) => {
  try {
    res.json([
      {
        _id: "montessori",
        title: "Montessori (Early Childhood)",
        level: "Early Childhood"
      },
      {
        _id: "primary",
        title: "Primary School",
        level: "Basic Education"
      },
      {
        _id: "jhs",
        title: "Junior High School",
        level: "Basic Education"
      },
      {
        _id: "shs",
        title: "Senior High School",
        level: "Secondary Education"
      },
      {
        _id: "undergraduate",
        title: "University (Undergraduate)",
        level: "Tertiary Education"
      },
      {
        _id: "postgraduate",
        title: "Postgraduate / Masters",
        level: "Advanced Studies"
      },
      {
        _id: "phd",
        title: "PhD / Research",
        level: "Doctoral Studies"
      }
    ]);
  } catch (error) {
    console.error("❌ Courses route error:", error);
    res.status(500).json({ message: "Failed to load courses" });
  }
});

module.exports = router;
