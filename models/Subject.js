const mongoose = require("mongoose");

/* ==========================================
   SUBJECT SCHEMA — WOFA AI
   ========================================== */
const SubjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Subject name is required"],
      unique: true,
      trim: true,
      minlength: 2,
      maxlength: 120
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    description: {
      type: String,
      trim: true,
      default: "",
      maxlength: 500
    },

    levels: {
      type: [String],
      default: ["Beginner", "Intermediate", "Advanced"]
    },

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
