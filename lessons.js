const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Lesson = require("../models/Lesson");
const { generateLessonContent } = require("../services/lessonAIService");

/* =========================
   CREATE LESSON
   ========================= */
router.post("/", async (req, res) => {
  try {
    const { course, title, objective, type } = req.body;

    if (!course || !mongoose.Types.ObjectId.isValid(course)) {
      return res.status(400).json({
        message: "Valid course ID is required"
      });
    }

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Lesson title is required"
      });
    }

    const lesson = await Lesson.create({
      course,
      title: title.trim(),
      objective,
      type
    });

    res.status(201).json(lesson);

  } catch (error) {
    console.error("Create lesson error:", error);
    res.status(500).json({
      message: "Failed to create lesson"
    });
  }
});

/* =========================
   GET LESSONS BY COURSE
   ========================= */
router.get("/:courseId", async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        message: "Invalid course ID"
      });
    }

    const lessons = await Lesson.find({ course: courseId })
      .sort({ createdAt: 1 });

    res.json(lessons);

  } catch (error) {
    console.error("Fetch lessons error:", error);
    res.status(500).json({
      message: "Failed to fetch lessons"
    });
  }
});

/* =========================
   TEACH LESSON WITH AI
   ========================= */
router.post("/teach/:lessonId", async (req, res) => {
  try {
    const { lessonId } = req.params;
    const level = req.body.level || "Beginner";

    if (!mongoose.Types.ObjectId.isValid(lessonId)) {
      return res.status(400).json({
        message: "Invalid lesson ID"
      });
    }

    const lesson = await Lesson.findById(lessonId);

    if (!lesson) {
      return res.status(404).json({
        message: "Lesson not found"
      });
    }

    const content = await generateLessonContent(
      lesson.title,
      lesson.objective,
      level
    );

    lesson.content = content;
    lesson.level = level;
    lesson.taughtByAI = true;

    await lesson.save();

    res.json({
      lessonId: lesson._id,
      level,
      content
    });

  } catch (error) {
    console.error("Teach lesson error:", error);
    res.status(500).json({
      message: "Failed to teach lesson"
    });
  }
});

module.exports = router;
