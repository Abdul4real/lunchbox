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
// Create (admin utility; your public signup happens in authController)
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
const read = (req, res) => res.json(publicUser(req.profile));

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
/** CREATE (multipart/form-data; image required) - any authenticated user */
const createRecipe = async (req, res) => {
  // Limit size a bit and keep single file
  const form = formidable({
    keepExtensions: true,
    multiples: false,
    allowEmptyFiles: false,
    maxFileSize: 10 * 1024 * 1024, // 10MB
  });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(400).json({ message: "Image upload failed" });

    // flatten single-value arrays
    Object.keys(fields).forEach((k) => {
      if (Array.isArray(fields[k])) fields[k] = fields[k][0];
    });

    try {
      // ensure authenticated user exists
      const currentUser = await User.findById(req.userId).select("name email role");
      if (!currentUser) return res.status(401).json({ message: "Unauthorized" });

      if (!fields.title || !String(fields.title).trim()) {
        return res.status(400).json({ message: "title is required" });
      }

      // robust file handling (formidable v1/v2)
      const img = Array.isArray(files?.image) ? files.image[0] : files?.image;
      const filePath = img?.filepath || img?.path;
      if (!filePath) return res.status(400).json({ message: "image is required" });

      // parse structured fields if sent as JSON strings
      const tryParse = (val) => {
        try { return typeof val === "string" ? JSON.parse(val) : val; } catch { return val; }
      };
      const parsed = {
        ...fields,
        ingredients: tryParse(fields.ingredients) || [],
        instructions: tryParse(fields.instructions) || [],
        metadata: tryParse(fields.metadata) || {},
      };

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

      // attach image (required)
      try {
        recipe.image.data = fs.readFileSync(filePath);
        recipe.image.contentType = img?.mimetype || img?.type || "application/octet-stream";
      } catch {
        return res.status(400).json({ message: "Could not read uploaded image" });
      }

      const saved = await recipe.save();
      res.status(201).json(saved);
    } catch (e) {
      console.error("createRecipe error:", e);
      res.status(400).json({ error: errorHandler.getErrorMessage(e) });
    }
  });
};

/** READ ALL (return base64 image when present) */
const getAllRecipes = async (_req, res) => {
  try {
    const docs = await Recipe.find().sort({ createdAt: -1 }).lean();
    const out = (docs || []).map((r) => {
      const obj = {
        _id: String(r._id),
        title: r.title,
        description: r.description || "",
        category: r.category || "",
        metadata: r.metadata || {},
        ingredients: Array.isArray(r.ingredients) ? r.ingredients : [],
        instructions: Array.isArray(r.instructions) ? r.instructions : [],
        creator: r.creator || "",
        reviews: Array.isArray(r.reviews) ? r.reviews : [],
        rating: typeof r.rating === "number" ? r.rating : 0,
        bookmarks: typeof r.bookmarks === "number" ? r.bookmarks : 0,
        bookmarked: !!r.bookmarked,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
      };

      const data = r?.image?.data;
      if (data && Buffer.isBuffer(data)) {
        obj.image = {
          contentType: r.image.contentType || "image/jpeg",
          data: data.toString("base64"),
        };
      }
      return obj;
    });

    return res.json(out);
  } catch (e) {
    console.error("getAllRecipes error:", e);
    return res.status(400).json({ error: "Failed to load recipes" });
  }
};

// Param / Read one
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

/** UPDATE (multipart OR JSON; image optional) */
const updateRecipe = async (req, res) => {
  // Accept both application/json and multipart/form-data
  const contentType = req.headers["content-type"] || "";
  const isMultipart = contentType.startsWith("multipart/form-data");

  if (!isMultipart) {
    // JSON body update
    try {
      const recipe = req.recipe;

      const isOwner = recipe?.author?.userId?.toString?.() === String(req.userId);
      if (!isOwner && !isAdmin(req)) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      const updates = { ...req.body };

      // normalize known structured fields if provided
      const toArrIng = (v) =>
        Array.isArray(v)
          ? v
              .map((it) =>
                typeof it === "string"
                  ? { name: it }
                  : { name: it?.name ?? "", quantity: it?.quantity, unit: it?.unit }
              )
              .filter((i) => i.name?.trim())
          : undefined;

      const toArrSteps = (v) =>
        Array.isArray(v)
          ? v.map((step, idx) =>
              typeof step === "string"
                ? { stepNumber: idx + 1, description: step }
                : {
                    stepNumber: step?.stepNumber ?? idx + 1,
                    description: step?.description ?? "",
                    duration: step?.duration,
                  }
            )
          : undefined;

      if ("ingredients" in updates) updates.ingredients = toArrIng(updates.ingredients) ?? [];
      if ("instructions" in updates) updates.instructions = toArrSteps(updates.instructions) ?? [];
      if ("category" in updates && typeof updates.category === "string") {
        updates.category = updates.category.trim() || undefined;
      }
      if ("title" in updates && typeof updates.title === "string") {
        updates.title = updates.title.trim();
      }

      Object.assign(recipe, updates);
      recipe.updatedAt = Date.now();
      const updated = await recipe.save();
      return res.json(updated);
    } catch (e) {
      console.error("updateRecipe (JSON) error:", e);
      return res.status(400).json({ error: errorHandler.getErrorMessage(e) });
    }
  }

  // Multipart branch (may include a new image)
  const form = formidable({
    keepExtensions: true,
    multiples: false,
    allowEmptyFiles: false,
    maxFileSize: 10 * 1024 * 1024,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(400).json({ error: "Image upload failed" });

    try {
      const recipe = req.recipe;

      const isOwner = recipe?.author?.userId?.toString?.() === String(req.userId);
      if (!isOwner && !isAdmin(req)) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      Object.keys(fields).forEach(
        (k) => (fields[k] = Array.isArray(fields[k]) ? fields[k][0] : fields[k])
      );

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
      if ("metadata" in updates) updates.metadata = tryParse(updates.metadata) || {};
      if ("category" in updates && typeof updates.category === "string") {
        updates.category = updates.category.trim() || undefined;
      }
      if ("title" in updates && typeof updates.title === "string") {
        updates.title = updates.title.trim();
      }

      // optional new image
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
      console.error("updateRecipe (multipart) error:", e);
      res.status(400).json({ error: errorHandler.getErrorMessage(e) });
    }
  });
};

// stream recipe image as binary
const recipeImage = async (req, res) => {
  try {
    const r = await Recipe.findById(req.params.recipeId).select("image");
    if (!r || !r.image || !r.image.data) return res.status(404).end();
    res.set("Content-Type", r.image.contentType || "image/jpeg");
    return res.send(r.image.data); // Buffer
  } catch {
    return res.status(400).json({ error: "Could not retrieve image" });
  }
};


// Delete
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
const addReview = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const { rating, comment = "" } = req.body ?? {};
    if (!rating) return res.status(400).json({ message: "rating is required" });

    const user = await User.findById(req.userId).select("name email");
    if (!user) return res.status(401).json({ message: "Unauthorized" });

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

const listReviewsByRecipe = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const reviews = await Review.find({ recipeId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

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
  recipeImage,
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
