const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema(
  {
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
      index: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    // URL-friendly identifier (for frontend routing)
    slug: {
      type: String,
      lowercase: true,
      unique: true
    },

    description: {
      type: String,
      trim: true
    },

    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
      index: true
    },

    // Enable / disable AI teaching for this course
    aiEnabled: {
      type: Boolean,
      default: true
    },

    // Course visibility
    status: {
      type: String,
      enum: ["Draft", "Published"],
      default: "Draft"
    },

    // Optional estimate (minutes)
    estimatedDuration: {
      type: Number
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Course", CourseSchema);
