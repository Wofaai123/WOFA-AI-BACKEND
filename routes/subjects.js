const express = require("express");
const router = express.Router();

const Subject = require("../models/Subject");
const auth = require("../middleware/authMiddleware");

/* =========================
   HELPER: SLUGIFY
   ========================= */
function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")   // remove symbols
    .replace(/\s+/g, "-");      // spaces to dash
}

/* =========================
   CREATE SUBJECT (PROTECTED)
   POST /api/subjects
   ========================= */
router.post("/", auth, async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Subject name is required."
      });
    }

    const cleanName = name.trim();
    const slug = slugify(cleanName);

    const exists = await Subject.findOne({
      $or: [{ name: cleanName }, { slug }]
    });

    if (exists) {
      return res.status(409).json({
        success: false,
        message: "Subject already exists."
      });
    }

    const subject = await Subject.create({
      name: cleanName,
      slug,
      description: description || ""
    });

    return res.status(201).json({
      success: true,
      message: "Subject created successfully.",
      subject
    });

  } catch (error) {
    console.error("🔥 Create subject error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create subject."
    });
  }
});

/* =========================
   GET ALL SUBJECTS
   GET /api/subjects
   ========================= */
router.get("/", async (req, res) => {
  try {
    const subjects = await Subject.find().sort({ name: 1 });

    return res.status(200).json({
      success: true,
      subjects
    });

  } catch (error) {
    console.error("🔥 Fetch subjects error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch subjects."
    });
  }
});

module.exports = router;
