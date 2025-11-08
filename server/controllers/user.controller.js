// server/controllers/user.controller.js
import fs from "fs";
import formidable from "formidable";
import User from "../models/user.model.js";
import Recipe from "../models/Recipe.js";
import Review from "../models/Review.js";
import errorHandler from "./errorController.js";

/* ------------------------------- helpers ------------------------------- */
const publicUser = (u) => {
  if (!u) return u;
  const obj = u.toObject ? u.toObject() : { ...u };
  delete obj.password;
  return obj;
};

const isAdmin = (req) => req.role === "admin";

/* =============================== USERS =============================== */
// Create
const create = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "name, email, and password are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    const user = new User({
      name,
      email,
      password, // pre('save') hashes
      ...(role ? { role } : {}),
    });

    await user.save();
    return res.status(201).json({ message: "User created successfully", user: publicUser(user) });
  } catch (err) {
    if (err?.code === 11000 && err?.keyPattern?.email) {
      return res.status(400).json({ error: "Email is already registered" });
    }
    return res
      .status(400)
      .json({ error: errorHandler?.getErrorMessage?.(err) || err.message || "Could not create user" });
  }
};

// List
const list = async (_req, res) => {
  try {
    const users = await User.find().select("_id name email role isSuspended createdAt updatedAt");
    return res.json(users);
  } catch (err) {
    return res
      .status(400)
      .json({ error: errorHandler?.getErrorMessage?.(err) || "Could not list users" });
  }
};

// Param
const userByID = async (req, res, next, id) => {
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: "User not found" });
    req.profile = user;
    return next();
  } catch (err) {
    return res.status(400).json({ error: "Could not retrieve user" });
  }
};

// Read one (user)
const read = (req, res) => {
  return res.json(publicUser(req.profile));
};

// Update user
const update = async (req, res) => {
  try {
    const user = req.profile;

    const allowed = ["name", "email", "role", "isSuspended", "password"];
    for (const key of allowed) {
      if (key in req.body) {
        if (key === "password") {
          if (!req.body.password || req.body.password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters" });
          }
          user.password = req.body.password; // triggers hashing
        } else {
          user[key] = req.body[key];
        }
      }
    }

    await user.save();
    return res.json(publicUser(user));
  } catch (err) {
    if (err?.code === 11000 && err?.keyPattern?.email) {
      return res.status(400).json({ error: "Email is already registered" });
    }
    return res
      .status(400)
      .json({ error: errorHandler?.getErrorMessage?.(err) || "Could not update user" });
  }
};

// Remove
const remove = async (req, res) => {
  try {
    const deleted = await req.profile.deleteOne();
    return res.json(publicUser(deleted));
  } catch (err) {
    return res
      .status(400)
      .json({ error: errorHandler?.getErrorMessage?.(err) || "Could not delete user" });
  }
};

// Set admin
const setAdmin = async (req, res) => {
  try {
    const user = req.profile;
    const { admin } = req.body; // boolean
    user.role = admin ? "admin" : "user";
    await user.save();
    return res.json({ message: "Role updated", user: publicUser(user) });
  } catch (err) {
    return res.status(400).json({ error: "Could not update role" });
  }
};

// Suspend / Unsuspend
const setSuspended = async (req, res) => {
  try {
    const user = req.profile;
    const { isSuspended } = req.body; // boolean
    user.isSuspended = !!isSuspended;
    await user.save();
    return res.json({ message: "Suspension status updated", user: publicUser(user) });
  } catch (err) {
    return res.status(400).json({ error: "Could not update suspension status" });
  }
};

// Update password
const updatePassword = async (req, res) => {
  try {
    const user = req.profile;
    const { password } = req.body;
    if (!password || password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }
    user.password = password; // triggers hashing
    await user.save();
    return res.json({ message: "Password updated", user: publicUser(user) });
  } catch (err) {
    return res.status(400).json({ error: "Could not update password" });
  }
};

/* ============================== RECIPES =============================== */

// ---- CREATE (with formidable; image is mandatory) ----
const createRecipe = async (req, res) => {
  const form = formidable({ keepExtensions: true, multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(400).json({ message: "Image upload failed" });

    // flatten single-value arrays from formidable
    Object.keys(fields).forEach((k) => {
      if (Array.isArray(fields[k])) fields[k] = fields[k][0];
    });

    try {
      // allow ANY authenticated user
      const currentUser = await User.findById(req.userId).select("name email role");
      if (!currentUser) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (!fields.title || !String(fields.title).trim()) {
        return res.status(400).json({ message: "title is required" });
      }

      // robust image handling (formidable v1 or v2)
      const img = Array.isArray(files?.image) ? files.image[0] : files?.image;
      const filePath = img?.filepath || img?.path;
      if (!filePath) {
        return res.status(400).json({ message: "image is required" });
      }

      // Normalize arrays if provided as JSON strings
      const parsed = { ...fields };
      const tryParse = (val) => {
        try { return typeof val === "string" ? JSON.parse(val) : val; } catch { return val; }
      };
      parsed.ingredients = tryParse(parsed.ingredients) || [];
      parsed.instructions = tryParse(parsed.instructions) || [];
      parsed.metadata = tryParse(parsed.metadata) || {};

      const recipe = new Recipe({
        title: String(parsed.title).trim(),
        description: parsed.description || "",
        ingredients: Array.isArray(parsed.ingredients)
          ? parsed.ingredients
              .map((it) =>
                typeof it === "string"
                  ? { name: it }
                  : { name: it?.name ?? "", quantity: it?.quantity, unit: it?.unit }
              )
              .filter((i) => i.name?.trim())
          : [],
        instructions: Array.isArray(parsed.instructions)
          ? parsed.instructions.map((step, idx) =>
              typeof step === "string"
                ? { stepNumber: idx + 1, description: step }
                : {
                    stepNumber: step?.stepNumber ?? idx + 1,
                    description: step?.description ?? "",
                    duration: step?.duration,
                  }
            )
          : [],
        metadata: parsed.metadata,
        category: parsed.category?.trim(),
        author: {
          userId: currentUser._id,
          username: currentUser.name || (currentUser.email?.split("@")[0] ?? "User"),
        },
        status:
          parsed.status && ["pending", "approved", "rejected"].includes(parsed.status)
            ? parsed.status
            : "approved",
        creator: currentUser.name || (currentUser.email?.split("@")[0] ?? "User"),
      });

      // attach image (mandatory)
      try {
        recipe.image.data = fs.readFileSync(filePath);
        recipe.image.contentType = img?.mimetype || img?.type || "application/octet-stream";
      } catch {
        return res.status(400).json({ message: "Could not read uploaded image" });
      }

      const saved = await recipe.save();
      res.status(201).json(saved);
    } catch (e) {
      res.status(400).json({ error: errorHandler.getErrorMessage(e) });
    }
  });
};

// ---- READ ALL (base64 image to avoid huge buffers) ----
const getAllRecipes = async (_req, res) => {
  try {
    let recipes = await Recipe.find().sort({ createdAt: -1 });

    const out = recipes.map((r) => {
      const obj = r.toObject();
      if (obj.image?.data) {
        obj.image = {
          contentType: obj.image.contentType,
          data: obj.image.data.toString("base64"),
        };
      }
      return obj;
    });

    res.json(out);
  } catch (e) {
    res.status(400).json({ error: errorHandler.getErrorMessage(e) });
  }
};

// ---- PARAM / READ ONE ----
const recipeByID = async (req, res, next, id) => {
  try {
    const recipe = await Recipe.findById(id);
    if (!recipe) return res.status(404).json({ error: "Recipe not found" });
    req.recipe = recipe;
    next();
  } catch {
    res.status(400).json({ error: "Could not retrieve recipe" });
  }
};

const readRecipe = (req, res) => res.json(req.recipe);

// ---- UPDATE (optionally with new image) ----
const updateRecipe = async (req, res) => {
  const form = formidable({ keepExtensions: true, multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(400).json({ error: "Image upload failed" });

    try {
      const recipe = req.recipe;

      // only author (by userId) or admin can update
      const isOwner = recipe?.author?.userId?.toString?.() === String(req.userId);
      if (!isOwner && !isAdmin(req)) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      // flatten single-value arrays
      Object.keys(fields).forEach(
        (k) => (fields[k] = Array.isArray(fields[k]) ? fields[k][0] : fields[k])
      );

      // attempt to parse structured fields when sent as JSON strings
      const tryParse = (val) => {
        try { return typeof val === "string" ? JSON.parse(val) : val; } catch { return val; }
      };

      const updates = { ...fields };
      if ("ingredients" in updates) {
        const ing = tryParse(updates.ingredients) || [];
        updates.ingredients = Array.isArray(ing)
          ? ing
              .map((it) =>
                typeof it === "string"
                  ? { name: it }
                  : { name: it?.name ?? "", quantity: it?.quantity, unit: it?.unit }
              )
              .filter((i) => i.name?.trim())
          : [];
      }
      if ("instructions" in updates) {
        const instr = tryParse(updates.instructions) || [];
        updates.instructions = Array.isArray(instr)
          ? instr.map((step, idx) =>
              typeof step === "string"
                ? { stepNumber: idx + 1, description: step }
                : {
                    stepNumber: step?.stepNumber ?? idx + 1,
                    description: step?.description ?? "",
                    duration: step?.duration,
                  }
            )
          : [];
      }
      if ("metadata" in updates) {
        updates.metadata = tryParse(updates.metadata) || {};
      }
      if ("category" in updates && typeof updates.category === "string") {
        updates.category = updates.category.trim() || undefined;
      }
      if ("title" in updates && typeof updates.title === "string") {
        updates.title = updates.title.trim();
      }

      // handle new image if provided (robust)
      const img = Array.isArray(files?.image) ? files.image[0] : files?.image;
      const filePath = img?.filepath || img?.path;
      if (filePath) {
        try {
          recipe.image.data = fs.readFileSync(filePath);
          recipe.image.contentType = img?.mimetype || img?.type || "application/octet-stream";
        } catch {
          return res.status(400).json({ message: "Could not read uploaded image" });
        }
      }

      Object.assign(recipe, updates);
      recipe.updatedAt = Date.now();

      const updated = await recipe.save();
      res.json(updated);
    } catch (e) {
      res.status(400).json({ error: errorHandler.getErrorMessage(e) });
    }
  });
};

// ---- DELETE ----
const deleteRecipe = async (req, res) => {
  try {
    const recipe = req.recipe;
    const isOwner = recipe?.author?.userId?.toString?.() === String(req.userId);
    if (!isOwner && !isAdmin(req)) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    await Recipe.findByIdAndDelete(recipe._id);
    res.json({ message: "Recipe deleted" });
  } catch (e) {
    res.status(400).json({ error: errorHandler.getErrorMessage(e) });
  }
};

/* ============================== COMMENTS ============================== */
const addComment = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId);
    if (!recipe) return res.status(404).json({ error: "Recipe not found" });

    // use current user for name/email
    const user = await User.findById(req.userId).select("name email");
    const { text, rating } = req.body;

    recipe.comments.push({
      name: user?.name || "Anonymous",
      email: user?.email || "unknown@example.com",
      text,
      rating,
    });
    await recipe.save();

    res.status(201).json({ message: "Comment added", recipe });
  } catch (e) {
    res.status(400).json({ error: errorHandler.getErrorMessage(e) });
  }
};

const updateComment = async (req, res) => {
  try {
    const { recipeId, commentId } = req.params;
    const { text, rating } = req.body;

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) return res.status(404).json({ error: "Recipe not found" });

    const comment = recipe.comments.id(commentId);
    if (!comment) return res.status(404).json({ error: "Comment not found" });

    const user = await User.findById(req.userId).select("email");
    if (!user || user.email !== comment.email) {
      return res.status(403).json({ error: "Not authorized" });
    }

    if (typeof text === "string") comment.text = text;
    if (typeof rating !== "undefined") comment.rating = rating;

    await recipe.save();
    res.json({ message: "Comment updated", recipe });
  } catch {
    res.status(400).json({ error: "Could not update comment" });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { recipeId, commentId } = req.params;
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) return res.status(404).json({ error: "Recipe not found" });

    const comment = recipe.comments.id(commentId);
    if (!comment) return res.status(404).json({ error: "Comment not found" });

    const user = await User.findById(req.userId).select("email");
    const canDelete = isAdmin(req) || (user && user.email === comment.email);
    if (!canDelete) return res.status(403).json({ error: "Not authorized" });

    comment.deleteOne();
    await recipe.save();

    res.json({ message: "Comment deleted", recipe });
  } catch (e) {
    res.status(400).json({ error: errorHandler.getErrorMessage(e) });
  }
};

const getCommentsByUser = async (req, res) => {
  try {
    const email = req.params.email;
    const recipes = await Recipe.find({ "comments.email": email });
    let comments = [];

    recipes.forEach((recipe) => {
      recipe.comments
        .filter((c) => c.email === email)
        .forEach((comment) => {
          comments.push({
            recipeId: recipe._id,
            recipeTitle: recipe.title,
            ...comment.toObject(),
          });
        });
    });

    res.json(comments);
  } catch {
    res.status(400).json({ error: "Could not fetch comments" });
  }
};

/* =============================== FILTERS ============================== */
const getRecipesByFilter = async (req, res) => {
  try {
    const ingredientFilter = req.params["ingredient"].split(",");
    const regexArray = ingredientFilter.map((i) => new RegExp(i.trim(), "i"));

    // match against structured ingredient names
    let recipes = await Recipe.find({ "ingredients.name": { $in: regexArray } });
    const out = recipes.map((r) => {
      const o = r.toObject();
      if (o.image?.data)
        o.image = {
          contentType: o.image.contentType,
          data: o.image.data.toString("base64"),
        };
      return o;
    });

    res.status(200).json(out);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getRecipesByCreator = async (req, res) => {
  try {
    const recipes = await Recipe.find({
      creator: { $regex: req.params.name, $options: "i" },
    });
    res.json(recipes);
  } catch {
    res.status(400).json({ error: "Could not fetch recipes" });
  }
};

/* =============================== REVIEWS ============================== */
// Add review
const addReview = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const { rating, comment = "" } = req.body ?? {};
    if (!rating) return res.status(400).json({ message: "rating is required" });

    const user = await User.findById(req.userId).select("name email");
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    // optional: prevent duplicate reviews by same user for same recipe
    // const existing = await Review.findOne({ recipeId, "author.userId": req.userId });
    // if (existing) return res.status(400).json({ message: "You already reviewed this recipe" });

    const review = await Review.create({
      recipeId,
      author: { userId: req.userId, username: user.name || user.email.split("@")[0] },
      rating,
      comment,
    });

    res.status(201).json({ message: "Review added", review });
  } catch (err) {
    res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

// List reviews for a recipe
const listReviewsByRecipe = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const reviews = await Review.find({ recipeId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

// Update own review
const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body ?? {};
    const r = await Review.findById(reviewId);
    if (!r) return res.status(404).json({ message: "Review not found" });
    if (String(r.author.userId) !== String(req.userId) && !isAdmin(req)) {
      return res.status(403).json({ message: "Not authorized" });
    }
    if (typeof rating !== "undefined") r.rating = rating;
    if (typeof comment !== "undefined") r.comment = comment;
    await r.save();
    res.json({ message: "Review updated", review: r });
  } catch (err) {
    res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

// Delete own review or admin
const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const r = await Review.findById(reviewId);
    if (!r) return res.status(404).json({ message: "Review not found" });
    if (String(r.author.userId) !== String(req.userId) && !isAdmin(req)) {
      return res.status(403).json({ message: "Not authorized" });
    }
    await r.deleteOne();
    res.json({ message: "Review deleted" });
  } catch (err) {
    res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

/* ============================== EXPORTS =============================== */
export default {
  // users
  create,
  list,
  userByID,
  read,
  update,
  remove,
  setAdmin,
  setSuspended,
  updatePassword,

  // recipes
  createRecipe,
  getAllRecipes,
  recipeByID,
  readRecipe,
  updateRecipe,
  deleteRecipe,
  getRecipesByFilter,
  getRecipesByCreator,

  // comments
  addComment,
  updateComment,
  deleteComment,
  getCommentsByUser,

  // reviews
  addReview,
  listReviewsByRecipe,
  updateReview,
  deleteReview,
};
