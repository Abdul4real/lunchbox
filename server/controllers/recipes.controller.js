// import { z } from "zod";
// import Recipe from "../models/Recipe.js";
// import User from "../models/User.js";
// import pick from "../utils/pick.js";



// export const createRecipe = async (req, res) => {
//   try {
//     // Destructure form fields from the request body
//     const { title, time, ingredients, steps, tags, category } = req.body;

//     if (!title) return res.status(400).json({ message: "Title is required" });

//     // Build the image URL
//     const baseUrl = process.env.API_URL || `http://localhost:${process.env.PORT || 5000}`;
//     const imageUrl = req.file ? `${baseUrl}/uploads/${req.file.filename}` : `${baseUrl}/images/bowl.jpg`;

//     // Create the recipe
//       const parseList = (value, delimiter = ",") =>
//       value
//         ? value.split(delimiter).map(v => v.trim()).filter(v => v !== "")
//         : [];

//     const recipe = await Recipe.create({
//       title,
//       time: time || "20 min",
//       ingredients: parseList(ingredients),
//       steps: parseList(steps, "\n"),
//       tags: parseList(tags),
//       category,
//       image: imageUrl,
//       author: req.user._id
//     });


//     res.status(201).json(recipe);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to create recipe" });
//   }
// };

// export const listRecipes = async (req, res) => {
//   // q=keyword&tags=Vegan,Quick&sort=rating|-createdAt&page=1&limit=12
//   const { q, tags, sort = "-createdAt", page = 1, limit = 12 } = pick(req.query, ["q","tags","sort","page","limit"]);
//   const filter = { status: "approved" };
//   if (q) filter.$text = { $search: q };
//   if (tags) filter.tags = { $in: tags.split(",") };

//   const cursor = Recipe.find(filter);
//   const total = await Recipe.countDocuments(filter);
//   const data = await cursor
//     .sort(sort.split(",").join(" "))
//     .skip((Number(page) - 1) * Number(limit))
//     .limit(Number(limit))
//     .lean();

//   res.json({ total, page: Number(page), limit: Number(limit), data });
// };

// export const getRecipe = async (req, res) => {
//   const r = await Recipe.findById(req.params.id).lean();
//   if (!r) return res.status(404).json({ message: "Not found" });
//   res.json(r);
// };

// export const updateRecipe = async (req, res) => {
//   const allowed = pick(req.body, ["title","image","time","ingredients","steps","tags"]);
//   const r = await Recipe.findOneAndUpdate({ _id: req.params.id, author: req.user.id }, allowed, { new: true });
//   if (!r) return res.status(404).json({ message: "Not found or no permission" });
//   res.json(r);
// };

// export const deleteRecipe = async (req, res) => {
//   const r = await Recipe.findOneAndDelete({ _id: req.params.id, author: req.user.id });
//   if (!r) return res.status(404).json({ message: "Not found or no permission" });
//   res.json({ ok: true });
// };

// export const toggleBookmark = async (req, res) => {
//   const user = await User.findById(req.user.id);
//   const idx = user.bookmarks.findIndex(id => id.toString() === req.params.id);
//   if (idx > -1) user.bookmarks.splice(idx, 1);
//   else user.bookmarks.push(req.params.id);
//   await user.save();
//   res.json({ bookmarks: user.bookmarks });
// };
import mongoose from "mongoose";
import Recipe from "../models/Recipe.js";
import User from "../models/User.js";
import pick from "../utils/pick.js";

// --- Helper to validate ObjectId ---
function validateId(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error("Invalid recipe ID");
    err.statusCode = 400;
    throw err;
  }
}

// --- Create a new recipe ---
export const createRecipe = async (req, res) => {
  try {
    const { title, time, ingredients, steps, tags, category } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });

    const baseUrl = process.env.API_URL || `http://localhost:${process.env.PORT || 5000}`;
    const imageUrl = req.file ? `${baseUrl}/uploads/${req.file.filename}` : `${baseUrl}/images/bowl.jpg`;

    const parseList = (value, delimiter = ",") =>
      value ? value.split(delimiter).map(v => v.trim()).filter(Boolean) : [];

    const recipe = await Recipe.create({
      title,
      time: time || "20 min",
      ingredients: parseList(ingredients),
      steps: parseList(steps, "\n"),
      tags: parseList(tags),
      category,
      image: imageUrl,
      author: req.user._id,
    });

    res.status(201).json(recipe);
  } catch (err) {
    console.error(err);
    res.status(err.statusCode || 500).json({ message: err.message || "Failed to create recipe" });
  }
};

// --- List recipes with filtering & pagination ---
export const listRecipes = async (req, res) => {
  try {
    const { q, tags, sort = "-createdAt", page = 1, limit = 12 } = pick(req.query, ["q","tags","sort","page","limit"]);
    const filter = { status: "approved" };
    if (q) filter.$text = { $search: q };
    if (tags) filter.tags = { $in: tags.split(",") };

    const cursor = Recipe.find(filter);
    const total = await Recipe.countDocuments(filter);
    const data = await cursor
      .sort(sort.split(",").join(" "))
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .lean();

    res.json({ total, page: Number(page), limit: Number(limit), data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to list recipes" });
  }
};

// --- Get a single recipe ---
export const getRecipe = async (req, res) => {
  try {
    validateId(req.params.id);
    const recipe = await Recipe.findById(req.params.id).lean();
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    res.json(recipe);
  } catch (err) {
    console.error(err);
    res.status(err.statusCode || 500).json({ message: err.message || "Failed to get recipe" });
  }
};

// --- Update recipe ---
export const updateRecipe = async (req, res) => {
  try {
    validateId(req.params.id);
    const allowed = pick(req.body, ["title","image","time","ingredients","steps","tags"]);
    const recipe = await Recipe.findOneAndUpdate(
      { _id: req.params.id, author: req.user._id },
      allowed,
      { new: true }
    );
    if (!recipe) return res.status(404).json({ message: "Recipe not found or no permission" });
    res.json(recipe);
  } catch (err) {
    console.error(err);
    res.status(err.statusCode || 500).json({ message: err.message || "Failed to update recipe" });
  }
};

// --- Delete recipe ---
export const deleteRecipe = async (req, res) => {
  try {
    validateId(req.params.id);
    const recipe = await Recipe.findOneAndDelete({ _id: req.params.id, author: req.user._id });
    if (!recipe) return res.status(404).json({ message: "Recipe not found or no permission" });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(err.statusCode || 500).json({ message: err.message || "Failed to delete recipe" });
  }
};

// --- Toggle bookmark ---
export const toggleBookmark = async (req, res) => {
  try {
    validateId(req.params.id);
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const idx = user.bookmarks.findIndex(id => id.toString() === req.params.id);
    if (idx > -1) user.bookmarks.splice(idx, 1);
    else user.bookmarks.push(req.params.id);

    await user.save();
    res.json({ bookmarks: user.bookmarks });
  } catch (err) {
    console.error(err);
    res.status(err.statusCode || 500).json({ message: err.message || "Failed to toggle bookmark" });
  }
};
 // --- Add review to a recipe ---
 export const addReview = async (req, res) => {
  const { stars, text } = req.body;
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) return res.status(404).json({ message: "Recipe not found" });

  recipe.reviews.unshift({ by: req.user.name || "Anonymous", stars, text });
  await recipe.save();

  res.status(201).json(recipe);
};

