const mongoose = require("mongoose");

const ProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  lesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lesson",
    required: true
  },

  status: {
    type: String,
    enum: ["started", "completed"],
    default: "started"
  },

  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Progress", ProgressSchema);
