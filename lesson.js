const mongoose = require("mongoose");

const LessonSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    objective: {
      type: String,
      trim: true
    },

    // AI-generated lesson content
    content: {
      type: String
    },

    // Lesson teaching level (can override course level)
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"]
    },

    // Has AI already taught this lesson?
    taughtByAI: {
      type: Boolean,
      default: false
    },

    // Lesson format
    type: {
      type: String,
      enum: ["Theory", "Practical", "Visual"],
      default: "Theory"
    },

    // Optional visual aids (diagrams, images)
    images: {
      type: [String]
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Lesson", LessonSchema);
