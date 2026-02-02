const mongoose = require("mongoose");

const QuizResultSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  lesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lesson",
    required: true
  },
  score: Number,
  total: Number,
  completedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("QuizResult", QuizResultSchema);
