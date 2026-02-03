const express = require("express");
const router = express.Router();
const Subject = require("../models/Subject");

/* =========================
   CREATE SUBJECT (ADMIN)
   ========================= */
router.post("/", async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Subject name is required"
      });
    }

    // Generate slug
    const slug = name.toLowerCase().replace(/\s+/g, "-");

    // Prevent duplicates
    const exists = await Subject.findOne({
      $or: [{ name }, { slug }]
    });

    if (exists) {
      return res.status(409).json({
        message: "Subject already exists"
      });
    }

    const subject = await Subject.create({
      name: name.trim(),
      slug,
      description
    });

    res.status(201).json(subject);

  } catch (error) {
    console.error("Create subject error:", error);
    res.status(500).json({
      message: "Failed to create subject"
    });
  }
});

/* =========================
   GET ALL SUBJECTS
   ========================= */
router.get("/", async (req, res) => {
  try {
    const subjects = await Subject.find().sort({ name: 1 });
    res.json(subjects);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch subjects"
    });
  }
});

module.exports = router;
