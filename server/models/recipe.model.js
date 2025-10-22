import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: "Name is required" },
    email: { type: String, trim: true, match: [/.+\@.+\..+/, "Invalid email"] },
    text: { type: String, trim: true, required: "Comment text is required" },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const recipeSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true, required: "Title is required" },
    ingredients: {
      type: String,
      trim: true,
      required: "At least one ingredient is required",
    },
    instructions: {
      type: String,
      trim: true,
      required: "Instructions are required",
    },
    creator: { type: String, trim: true },
    preptime: { type: Number, min: 0 },
    cooktime: { type: Number, min: 0 },
    servings: { type: Number, min: 1 },
    image: { data: Buffer, contentType: String },
    category: { type: String, trim: true },
    comments: [commentSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Recipe", recipeSchema);
