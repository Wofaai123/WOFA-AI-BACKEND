const express = require("express");
const router = express.Router();
const Quiz = require("../models/Quiz");
const QuizResult = require("../models/QuizResult");

/* =========================
   CREATE QUIZ (ADMIN)
   ========================= */
router.post("/", async (req, res) => {
  const quiz = await Quiz.create(req.body);
  res.json(quiz);
});

/* =========================
   GET QUIZ BY LESSON
   ========================= */
router.get("/lesson/:lessonId", async (req, res) => {
  const quiz = await Quiz.findOne({ lesson: req.params.lessonId });
  res.json(quiz);
});

/* =========================
   SUBMIT QUIZ
   ========================= */
router.post("/submit", async (req, res) => {
  const { userId, lessonId, answers } = req.body;

  const quiz = await Quiz.findOne({ lesson: lessonId });
  if (!quiz) return res.status(404).json({ message: "Quiz not found" });

  let score = 0;
  quiz.questions.forEach((q, i) => {
    if (answers[i] === q.correctAnswer) score++;
  });

  const result = await QuizResult.create({
    userId,
    lesson: lessonId,
    score,
    total: quiz.questions.length
  });

  res.json(result);
});

module.exports = router;
