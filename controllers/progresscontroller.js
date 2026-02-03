const mongoose = require("mongoose");
const Progress = require("../models/Progress");

/* =========================
   MARK LESSON COMPLETE
   ========================= */
exports.markComplete = async (req, res) => {
  try {
    const { lessonId } = req.body;
    const userId = req.user.id;

    // Validate lesson ID
    if (!mongoose.Types.ObjectId.isValid(lessonId)) {
      return res.status(400).json({
        message: "Invalid lesson ID"
      });
    }

    // Save or update progress (prevents duplicates)
    const progress = await Progress.findOneAndUpdate(
      {
        user: new mongoose.Types.ObjectId(userId),
        lesson: new mongoose.Types.ObjectId(lessonId)
      },
      {
        completed: true,
        completedAt: new Date()
      },
      {
        upsert: true,
        new: true
      }
    );

    res.json({
      message: "Lesson marked complete",
      progress
    });

  } catch (error) {
    console.error("Progress save error:", error);
    res.status(500).json({
      message: "Failed to save progress"
    });
  }
};
