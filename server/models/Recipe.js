import mongoose from "mongoose";

const ingredientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: String },
  unit: { type: String },
});

const instructionSchema = new mongoose.Schema({
  stepNumber: { type: Number },
  description: { type: String, required: true },
  duration: { type: Number }, // in minutes
});

const recipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String },
    ingredients: [ingredientSchema],
    instructions: [instructionSchema],
    metadata: {
      prepTime: Number,
      cookTime: Number,
      servings: Number,
      difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "easy" },
      cuisineType: String,
      dietaryTags: [String],
      mealType: [String],
      tags: [String],
    },
    author: {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      username: String,
    },
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
