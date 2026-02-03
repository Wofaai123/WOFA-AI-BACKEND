// config/db.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,   // Fail fast on Render
      maxPoolSize: 10,                  // Reasonable connection pool
      socketTimeoutMS: 45000,           // Prevent long hangs
    });

    console.log(`✅ MongoDB connected successfully`);
    console.log(`📦 Database: ${conn.connection.name}`);
    console.log(`🌍 Host: ${conn.connection.host}`);

  } catch (error) {
    console.error("❌ MongoDB connection failed:", error); // full error object
    process.exit(1);
  }
};

module.exports = connectDB;
