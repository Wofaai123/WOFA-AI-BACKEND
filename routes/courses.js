const express = require("express");
const router = express.Router();
const Course = require("../models/Course");

// ✅ Get ALL courses
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find().populate("subject", "name");
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch courses" });
  }
});

module.exports = router;
