const Progress = require("../models/Progress");

/* ==========================================
   SAVE / UPDATE PROGRESS
   POST /api/progress
   ========================================== */
exports.saveProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId, lessonId, status = "completed" } = req.body;

    if (!lessonId) {
      return res.status(400).json({
        success: false,
        message: "lessonId is required"
      });
    }

    const progress = await Progress.findOneAndUpdate(
      { user: userId, lessonId: lessonId },
      {
        user: userId,
        courseId: courseId || null,
        lessonId: lessonId,
        status: status,
        updatedAt: new Date()
      },
      { upsert: true, new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Progress saved successfully.",
      progress
    });

  } catch (err) {
    console.error("🔥 Progress save error:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to save progress."
    });
  }
};

/* ==========================================
   GET USER PROGRESS
   GET /api/progress
   ========================================== */
exports.getProgress = async (req, res) => {
  try {
    const userId = req.user.id;

    const progress = await Progress.find({ user: userId }).sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      progress
    });

  } catch (err) {
    console.error("🔥 Progress fetch error:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch progress."
    });
  }
};
