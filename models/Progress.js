const mongoose = require("mongoose");

/* ==========================================
   PROGRESS SCHEMA — WOFA AI
   Stores progress using STRING lessonId
   ========================================== */
const ProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    courseId: {
      type: String,
      default: null
    },

    lessonId: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: ["started", "completed"],
      default: "started"
    }
  },
  {
    timestamps: true
  }
);

/* =========================
   INDEXES
   ========================= */
ProgressSchema.index({ user: 1, lessonId: 1 }, { unique: true });

module.exports = mongoose.model("Progress", ProgressSchema);
