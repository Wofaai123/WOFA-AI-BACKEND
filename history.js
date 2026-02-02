const express = require("express");
const router = express.Router();
const Chat = require("../models/Chat");

router.get("/", async (req, res) => {
  const chats = await Chat.find().sort({ createdAt: -1 }).limit(50);
  res.json(chats);
});

module.exports = router;
