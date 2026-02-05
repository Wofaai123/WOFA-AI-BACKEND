const mongoose = require("mongoose");

/* ==========================================
   CONNECT MONGODB — WOFA AI
   ========================================== */
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error("❌ MONGO_URI is missing in .env file");
    }

    // Prevent multiple connections
    if (mongoose.connection.readyState === 1) {
      console.log("⚠️ MongoDB already connected.");
      return;
    }

    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10
    });

    console.log("✅ MongoDB Connected Successfully");
    console.log(`📦 Database: ${conn.connection.name}`);
    console.log(`🌍 Host: ${conn.connection.host}`);

    return conn;

  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
