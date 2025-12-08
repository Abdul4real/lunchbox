import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    by: { type: String, required: true },
    stars: { type: Number, min: 1, max: 5, required: true },
    text: { type: String, trim: true },
    createdAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const recipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },

    image: { type: String, default: "" },

    time: { type: String, default: "20 min" },

    ingredients: {
      type: [String],
      default: [],
      set: arr => arr.filter(v => v.trim() !== "")
    },

    steps: {
      type: [String],
      default: [],
      set: arr => arr.filter(v => v.trim() !== "")
    },

    tags: {
      type: [String],
      default: [],
      set: arr => arr.filter(v => v.trim() !== "")
    },

    category: { type: String, default: "Uncategorized" },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

   
    reviews: {
      type: [reviewSchema],
      default: [],
    },

    status: {
      type: String,
      default: "approved",
      enum: ["approved", "pending", "rejected"],
    },

    ratingAvg: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Recipe", recipeSchema);
