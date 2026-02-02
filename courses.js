const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Course = require("../models/Course");

/* =========================
   CREATE COURSE
   ========================= */
router.post("/", async (req, res) => {
  try {
    const { subject, title, description, level } = req.body;

    if (!subject || !mongoose.Types.ObjectId.isValid(subject)) {
      return res.status(400).json({
        message: "Valid subject ID is required"
      });
    }

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Course title is required"
      });
    }

    // Generate slug
    const slug = title.toLowerCase().replace(/\s+/g, "-");

    // Prevent duplicate course under same subject
    const exists = await Course.findOne({
      subject,
      $or: [{ title }, { slug }]
    });

    if (exists) {
      return res.status(409).json({
        message: "Course already exists under this subject"
      });
    }

    const course = await Course.create({
      subject,
      title: title.trim(),
      slug,
      description,
      level
    });

    res.status(201).json(course);

  } catch (error) {
    console.error("Create course error:", error);
    res.status(500).json({
      message: "Failed to create course"
    });
  }
});

/* =========================
   GET COURSES BY SUBJECT
   ========================= */
router.get("/:subjectId", async (req, res) => {
  try {
    const { subjectId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(subjectId)) {
      return res.status(400).json({
        message: "Invalid subject ID"
      });
    }

    const courses = await Course.find({ subject: subjectId })
      .sort({ createdAt: 1 });

    res.json(courses);

  } catch (error) {
    console.error("Fetch courses error:", error);
    res.status(500).json({
      message: "Failed to fetch courses"
    });
  }
});

module.exports = router;
