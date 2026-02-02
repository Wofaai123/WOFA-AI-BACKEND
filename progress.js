const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { markComplete } = require("../controllers/progressController");

router.post("/complete", auth, markComplete);

module.exports = router;

router.get("/summary", auth, async (req, res) => {
  const userId = req.user.id;

  const completed = await Progress.find({
    user: userId,
    completed: true
  }).populate("lesson");

  res.json({
    completedLessons: completed.length,
    lessons: completed
  });
});
