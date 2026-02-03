const mongoose = require("mongoose");

const SubjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },

    // URL-friendly identifier (useful for frontend routing later)
    slug: {
      type: String,
      unique: true,
      lowercase: true
    },

    description: {
      type: String,
      trim: true
    },

    // Optional difficulty range for the subject
    levels: {
      type: [String],
      default: ["Beginner", "Intermediate", "Advanced"]
    },

    // Allow AI teaching for this subject
    aiEnabled: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Subject", SubjectSchema);
