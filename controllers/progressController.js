const Progress = require("../models/Progress");

/* =========================
   SAVE / UPDATE PROGRESS
   ========================= */
exports.saveProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { lessonId, status = "completed" } = req.body;

    if (!lessonId) {
      return res.status(400).json({ message: "Lesson ID required" });
    }

    const progress = await Progress.findOneAndUpdate(
      { user: userId, lesson: lessonId },
      { status, updatedAt: new Date() },
      { upsert: true, new: true }
    );

    res.json({
      message: "Lesson marked complete",
      progress
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save progress" });
  }
};

/* =========================
   GET USER PROGRESS
   ========================= */
exports.getProgress = async (req, res) => {
  try {
    const progress = await Progress.find({ user: req.user.id })
      .populate("lesson", "title");

    res.json(progress);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch progress" });
  }
};
