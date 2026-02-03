const express = require("express");
const router = express.Router();

const { chatAI } = require("../controllers/chatController");

/* =========================
   AI CHAT ENDPOINT
   =========================
   Handles:
   - text questions
   - image explanations (Vision AI)
   - lesson-related queries
*/
router.post("/", chatAI);

module.exports = router;
