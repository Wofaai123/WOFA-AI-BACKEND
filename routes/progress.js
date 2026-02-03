const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  saveProgress,
  getProgress
} = require("../controllers/progressController");

router.post("/", auth, saveProgress);
router.get("/", auth, getProgress);

module.exports = router;
