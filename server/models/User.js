// server/models/User.js
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },

    email: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
      required: true,
    },

    // stored hashed
    password: { type: String, required: true, select: false },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      index: true,
    },

    // used by the admin Suspend/Unsuspend feature
    isSuspended: {
      type: Boolean,
      default: false,
    },

    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
  },
  { timestamps: true }
);

// Hash password before saving if changed
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Helper to compare passwords
userSchema.methods.compare = function (pwd) {
  return bcrypt.compare(pwd, this.password);
};

export default mongoose.model("User", userSchema);
