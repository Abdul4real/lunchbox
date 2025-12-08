import mongoose from "mongoose";
import Recipe from "../models/Recipe.js";
import User from "../models/User.js";
import pick from "../utils/pick.js";

function validateId(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error("Invalid recipe ID");
    err.statusCode = 400;
    throw err;
  }
}

// 🔥 Helper to normalize image URLs for frontend
function normalizeImageURL(image) {
  const FE_BASE = "https://lunchbox-wlgs.vercel.app";
  const BE_BASE = process.env.PUBLIC_API_URL;

  if (!image) return "/images/bowl.jpg";

  // 1. Already absolute URL → return as-is
  if (image.startsWith("http://") || image.startsWith("https://")) {
    // Fix old localhost URLs
    if (image.includes("localhost")) {
      return image.replace("http://localhost:5000", BE_BASE);
    }
    return image;
  }

  // 2. Sample frontend images
  if (image.startsWith("/images/")) {
    return `${FE_BASE}${image}`;
  }

  // 3. Uploaded images
  if (image.startsWith("uploads/")) {
    return `${BE_BASE}/${image}`;
  }

  // 4. Anything else → fallback
  return "/images/bowl.jpg";
}

// -------------------- CREATE RECIPE --------------------
export const createRecipe = async (req, res) => {
  try {
    const { title, time, ingredients, steps, tags, category, image } = req.body;

    if (!title) return res.status(400).json({ message: "Title is required" });

    let imageUrl;

    if (req.file) {
      // Uploaded file → backend URL
      imageUrl = `uploads/${req.file.filename}`;
    } else if (image?.startsWith("/images/")) {
      // Built-in frontend sample image
      imageUrl = image;
    } else if (image?.startsWith("http")) {
      // External link
      imageUrl = image;
    } else {
      // Fallback
      imageUrl = "/images/bowl.jpg";
    }

    const parseList = (v, d = ",") =>
      v ? v.split(d).map(x => x.trim()).filter(Boolean) : [];

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

    // Normalize URL for frontend response
    recipe.image = normalizeImageURL(recipe.image);

    res.status(201).json(recipe);
  } catch (err) {
    console.error(err);
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

// -------------------- LIST RECIPES --------------------
export const listRecipes = async (req, res) => {
  try {
    const { q, tags, sort = "-createdAt", page = 1, limit = 12 } =
      pick(req.query, ["q", "tags", "sort", "page", "limit"]);

    const filter = { status: "approved" };
    if (q) filter.$text = { $search: q };
    if (tags) filter.tags = { $in: tags.split(",") };

    const cursor = Recipe.find(filter);
    const total = await Recipe.countDocuments(filter);

    const data = await cursor
      .sort(sort.split(",").join(" "))
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean();

    // Normalize each recipe image
    data.forEach(r => {
      r.image = normalizeImageURL(r.image);
    });

    res.json({ total, page, limit, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to list recipes" });
  }
};

// -------------------- GET SINGLE RECIPE --------------------
export const getRecipe = async (req, res) => {
  try {
    validateId(req.params.id);
    const recipe = await Recipe.findById(req.params.id).lean();
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    recipe.image = normalizeImageURL(recipe.image);

    res.json(recipe);
  } catch (err) {
    console.error(err);
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

// -------------------- UPDATE RECIPE --------------------
export const updateRecipe = async (req, res) => {
  try {
    validateId(req.params.id);
    const allowed = pick(req.body, [
      "title",
      "image",
      "time",
      "ingredients",
      "steps",
      "tags",
    ]);

    const recipe = await Recipe.findOneAndUpdate(
      { _id: req.params.id, author: req.user._id },
      allowed,
      { new: true }
    );

    if (!recipe)
      return res.status(404).json({ message: "Recipe not found or no permission" });

    recipe.image = normalizeImageURL(recipe.image);

    res.json(recipe);
  } catch (err) {
    console.error(err);
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

// -------------------- DELETE RECIPE --------------------
export const deleteRecipe = async (req, res) => {
  try {
    validateId(req.params.id);
    const recipe = await Recipe.findOneAndDelete({
      _id: req.params.id,
      author: req.user._id,
    });

    if (!recipe)
      return res.status(404).json({ message: "Recipe not found or no permission" });

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

// -------------------- BOOKMARK --------------------
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

// -------------------- ADD REVIEW --------------------
export const addReview = async (req, res) => {
  try {
    const { stars, text } = req.body;

    if (!stars) return res.status(400).json({ message: "Stars rating is required" });

    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    recipe.reviews.unshift({
      by: req.user.name,
      stars,
      text,
    });

    recipe.ratingCount = recipe.reviews.length;
    recipe.ratingAvg =
      recipe.reviews.reduce((acc, r) => acc + r.stars, 0) /
      recipe.ratingCount;

    await recipe.save();

    recipe.image = normalizeImageURL(recipe.image);

    res.json(recipe);
  } catch (err) {
    console.error("FAILED TO ADD REVIEW:", err);
    res.status(500).json({ message: "Failed to add review" });
  }
};
