import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: "Name is required" },
    email: {
      type: String,
      required: "Email is required",
      unique: true,
      lowercase: true,
      match: [/.+\@.+\..+/, "Please provide a valid email"],
    },
    password: { type: String, required: "Password is required" }, // ← simple field
    securityQuestion: { type: String },
    securityAnswer: { type: String },
    admin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
