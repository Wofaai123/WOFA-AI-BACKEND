const mongoose = require("mongoose");

const QuizSchema = new mongoose.Schema({
  lesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lesson",
    required: true
  },
  title: {
    type: String,
    required: true
  },
  questions: [
    {
      question: String,
      options: [String],
      correctAnswer: Number // index of correct option
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Quiz", QuizSchema);
