import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, index: "text" },
    image: String,
    time: String,
    ingredients: [String],
    steps: [String],
    tags: { type: [String], index: true },
    ratingAvg: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "approved", index: true }
  },
  { timestamps: true }
);

export default mongoose.model("Recipe", recipeSchema);