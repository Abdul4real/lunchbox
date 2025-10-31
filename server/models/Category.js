import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: "" },
    image: { type: String, default: "" },          // e.g., "/images/italian.jpg"
    tags: [{ type: String }],                      // ["pasta", "pizza", ...]
    recipeCount: { type: Number, default: 0 },     // updated by jobs/seeders
  },
  { timestamps: true }
);

// helpful index for search by name
categorySchema.index({ name: 1 });

const Category = mongoose.model("Category", categorySchema);
export default Category;
