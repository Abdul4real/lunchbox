import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    recipe: { type: mongoose.Schema.Types.ObjectId, ref: "Recipe", index: true },
    user:   { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    stars:  { type: Number, min: 1, max: 5, required: true },
    text:   { type: String, trim: true }
  },
  { timestamps: true }
);

export default mongoose.model("Review", reviewSchema);