const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const {
  saveProgress,
  getProgress
} = require("../controllers/progressController");

/* ==========================================
   PROGRESS ROUTES — WOFA AI
   ========================================== */

/**
 * POST /api/progress
 * Save progress for a user (course/lesson completion)
 */
router.post("/", auth, saveProgress);

/**
 * GET /api/progress
 * Get progress for logged-in user
 */
router.get("/", auth, getProgress);

module.exports = router;
