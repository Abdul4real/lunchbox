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

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    // Always use Render backend URL
    const baseUrl = process.env.PUBLIC_API_URL;

    let imageUrl;

if (req.file) {
  // Uploaded image
  imageUrl = `${process.env.PUBLIC_API_URL}/uploads/${req.file.filename}`;
} else if (req.body.image && req.body.image.startsWith("http")) {
  // A full URL was provided (keep it as is)
  imageUrl = req.body.image;
} else {
  // Fallback image hosted on frontend
  imageUrl = "https://lunchbox-wlgs.vercel.app/placeholder.png";
}


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
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const id = req.params.id;

    const index = user.bookmarks.indexOf(id);
    if (index >= 0) user.bookmarks.splice(index, 1);
    else user.bookmarks.push(id);

    await user.save();

    res.json({ bookmarks: user.bookmarks });
  } catch (err) {
    console.error("Bookmark Error:", err);
    res.status(500).json({ message: "Failed to toggle bookmark" });
  }
};

 // --- Add review to a recipe ---
 export const addReview = async (req, res) => {
  try {
    const { stars, text } = req.body;

    if (!stars) {
      return res.status(400).json({ message: "Stars rating is required" });
    }

    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    recipe.reviews.unshift({
      by: req.user.name,
      stars,
      text,
    });

    // update rating counts
    recipe.ratingCount = recipe.reviews.length;
    recipe.ratingAvg =
      recipe.reviews.reduce((acc, r) => acc + r.stars, 0) /
      recipe.ratingCount;

    await recipe.save();

    res.json(recipe);
  } catch (err) {
    console.error("FAILED TO ADD REVIEW:", err);
    res.status(500).json({ message: "Failed to add review" });
  }
};


