const mongoose = require("mongoose");

/* ==========================================
   USER SCHEMA — WOFA AI
   ========================================== */
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 2,
      maxlength: 100
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 150
    },

    password: {
      type: String,
      default: null
      // For Google users password will remain null
    },

    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local"
    },

    googleId: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

/* =========================
   INDEXES (IMPORTANT)
   ========================= */
UserSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model("User", UserSchema);
