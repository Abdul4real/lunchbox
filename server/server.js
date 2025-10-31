// server/config/db.js
import mongoose from "mongoose";
import { seedAdmins } from "../utils/seedAdmins.js";

export async function connectDB() {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error("MONGO_URI not defined in .env");

    await mongoose.connect(uri);
    console.log("✅ MongoDB connected successfully");

    // Seed static admin users (only if missing)
    await seedAdmins();
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
}
