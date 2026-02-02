const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB connected");
    console.log("📦 Database:", mongoose.connection.name);
    console.log("🌍 Host:", mongoose.connection.host);
    console.log("🧠 Port:", mongoose.connection.port);

  } catch (error) {
    console.error("❌ MongoDB error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;