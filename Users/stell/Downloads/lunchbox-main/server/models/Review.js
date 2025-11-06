import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    recipeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipe",
      required: true,
    },
    author: {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      username: { type: String },
    },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, default: "" },

    // for the admin “Review Reports” flow
    // (so an admin can approve/dismiss a report)
    resolution: {
      type: String,
      enum: ["pending", "approved", "dismissed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

reviewSchema.index({ recipeId: 1, createdAt: -1 });

const Review = mongoose.model("Review", reviewSchema);
export default Review;
