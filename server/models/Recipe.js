import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      default: "",
    },

    time: {
      type: String,
      default: "20 min",
    },

    ingredients: {
      type: [String],
      default: [],
      set: arr => arr.filter(v => v && v.trim() !== ""),
    },

    steps: {
      type: [String],
      default: [],
      set: arr => arr.filter(v => v && v.trim() !== ""),
    },

    tags: {
      type: [String],
      default: [],
      set: arr => arr.filter(v => v && v.trim() !== ""),
    },

    category: {
      type: String,
      default: "Uncategorized",
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      default: "approved",
      enum: ["approved", "pending", "rejected"],
    },

    ratingAvg: {
      type: Number,
      default: 0,
    },

    ratingCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Recipe", recipeSchema);
