const express = require("express");
const router = express.Router();
const Progress = require("../models/Progress");

router.get("/force-progress", async (req, res) => {
  const doc = await Progress.create({
    user: "697fd973ab13cd785422f468",
    lesson: "6xxxxxxxxxxxxxxxxxxxxxxx",
    completed: true
  });

  res.json(doc);
});

module.exports = router;
