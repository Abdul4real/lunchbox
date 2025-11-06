// server/models/Recipe.js
import mongoose from "mongoose";

const ingredientSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  quantity: { type: String, trim: true },
  unit: { type: String, trim: true },
});

const instructionSchema = new mongoose.Schema({
  stepNumber: { type: Number, min: 1 },
  description: { type: String, required: true, trim: true },
  duration: { type: Number, min: 0 }, // minutes
});

const commentSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: "Name is required" },
    email: {
      type: String,
      trim: true,
      match: [/.+\@.+\..+/, "Invalid email"],
    },
    text: { type: String, trim: true, required: "Comment text is required" },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const recipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },

    // Structured ingredients & instructions
    ingredients: [ingredientSchema],
    instructions: [instructionSchema],

    // Metadata (keeps your newer structure; aligns with old preptime/cooktime/servings)
    metadata: {
      prepTime: { type: Number, min: 0 }, // was preptime
      cookTime: { type: Number, min: 0 }, // was cooktime
      servings: { type: Number, min: 1 },
      difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "easy" },
      cuisineType: { type: String, trim: true },
      dietaryTags: [{ type: String, trim: true }],
      mealType: [{ type: String, trim: true }],
      tags: [{ type: String, trim: true }],
    },

    author: {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      username: { type: String, trim: true },
    },
    creator: { type: String, trim: true }, 
    category: { type: String, trim: true },
    image: {
      data: { type: Buffer, required: true },
      contentType: { type: String, required: true },
    },

    comments: [commentSchema],
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Recipe = mongoose.model("Recipe", recipeSchema);
export default Recipe;
