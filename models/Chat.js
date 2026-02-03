const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true
    },

    answer: {
      type: String,
      required: true
    },

    subject: {
      type: String,
      index: true
    },

    // Optional image used in the chat (Vision AI)
    image: {
      type: String // base64 or URL
    },

    // Type of interaction
    type: {
      type: String,
      enum: ["chat", "image", "lesson"],
      default: "chat"
    },

    // Optional reference to a lesson (for AI teaching)
    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson"
    },

    // Optional future user reference
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  {
    timestamps: true // replaces createdAt manually
  }
);

module.exports = mongoose.model("Chat", ChatSchema);
