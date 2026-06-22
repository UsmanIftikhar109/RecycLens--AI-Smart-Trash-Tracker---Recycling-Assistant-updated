// ─── Mongoose Connection Helper ─────────────
// This file provides a reusable connectDB function.
// Usage in server.js:
//   const connectDB = require("./config/db");
//   await connectDB();

const mongoose = require("mongoose");

const connectDB = async () => {
  const mongoURI =
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/recyclens";

  await mongoose.connect(mongoURI, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });

  console.log("✅ Connected to MongoDB via Mongoose");
};

module.exports = connectDB;
