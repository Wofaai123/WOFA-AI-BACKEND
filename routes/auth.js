const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const User = require("../models/User");

const router = express.Router();

/* =========================
   GOOGLE CLIENT
   ========================= */
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/* =========================
   HELPER: SIGN JWT
   ========================= */
function signToken(userId) {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

/* =========================
   REGISTER (EMAIL/PASSWORD)
   POST /api/auth/register
   ========================= */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required."
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists. Please login instead."
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      provider: "local"
    });

    const token = signToken(newUser._id);

    return res.status(201).json({
      success: true,
      message: "Registration successful.",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email
      }
    });

  } catch (err) {
    console.error("🔥 Register error:", err);
    return res.status(500).json({
      success: false,
      message: "Registration failed."
    });
  }
});

/* =========================
   LOGIN (EMAIL/PASSWORD)
   POST /api/auth/login
   ========================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required."
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials."
      });
    }

    // Prevent logging in locally if user is Google account
    if (user.provider === "google") {
      return res.status(401).json({
        success: false,
        message: "This account uses Google login. Please login with Google."
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials."
      });
    }

    const token = signToken(user._id);

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {
    console.error("🔥 Login error:", err);
    return res.status(500).json({
      success: false,
      message: "Login failed."
    });
  }
});

/* =========================
   GOOGLE LOGIN
   POST /api/auth/google
   ========================= */
router.post("/google", async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: "Google token is missing."
      });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();

    if (!payload) {
      return res.status(401).json({
        success: false,
        message: "Invalid Google token."
      });
    }

    const { email, name } = payload;

    let user = await User.findOne({ email });

    // Create user if not exists
    if (!user) {
      user = await User.create({
        name,
        email,
        password: await bcrypt.hash("google-oauth-user", 10),
        provider: "google"
      });
    }

    const token = signToken(user._id);

    return res.status(200).json({
      success: true,
      message: "Google login successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {
    console.error("🔥 Google auth error:", err);
    return res.status(401).json({
      success: false,
      message: "Google authentication failed."
    });
  }
});

module.exports = router;
