import mongoose from "mongoose";
import { seedAdmins } from "../utils/seedAdmins.js";

export async function connectDB() {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error("MONGO_URI not defined in .env/.env.local");

    await mongoose.connect(uri);
    console.log("✅ MongoDB connected");

    // Ensure static admins exist
    await seedAdmins();
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
}
