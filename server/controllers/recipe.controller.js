import Recipe from "../models/recipe.model.js";
import errorHandler from "./errorController.js";
import formidable from "formidable";
import fs from "fs";

// ---------------- CREATE ----------------
const createRecipe = async (req, res) => {
  const form = formidable({ keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(400).json({ message: "Image upload failed" });

    Object.keys(fields).forEach((k) => {
      if (Array.isArray(fields[k])) fields[k] = fields[k][0];
    });

    try {
      const recipe = new Recipe(fields);
      recipe.creator = req.auth?.name || "Anonymous";

      if (files.image) {
        recipe.image.data = fs.readFileSync(files.image.filepath);
        recipe.image.contentType = files.image.mimetype;
      }

      const saved = await recipe.save();
      res.status(201).json(saved);
    } catch (e) {
      res.status(400).json({ error: errorHandler.getErrorMessage(e) });
    }
  });
};

// ---------------- READ ALL ----------------
const getAllRecipes = async (_req, res) => {
  try {
    let recipes = await Recipe.find().select(
      "title ingredients instructions creator preptime cooktime servings category createdAt updatedAt image comments"
    );

    recipes = recipes.map((r) => {
      const obj = r.toObject();
      if (obj.image?.data) {
        obj.image = {
          contentType: obj.image.contentType,
          data: obj.image.data.toString("base64"),
        };
      }
      return obj;
    });

    res.json(recipes);
  } catch (e) {
    res.status(400).json({ error: errorHandler.getErrorMessage(e) });
  }
};

// ---------------- PARAM ----------------
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

const read = (req, res) => res.json(req.recipe);

// ---------------- UPDATE ----------------
const updateRecipe = async (req, res) => {
  const form = formidable({ keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(400).json({ error: "Image upload failed" });

    let recipe = req.recipe;
    Object.keys(fields).forEach((k) => (recipe[k] = fields[k]));
    recipe.updatedAt = Date.now();

    if (files.image) {
      recipe.image.data = fs.readFileSync(files.image.filepath);
      recipe.image.contentType = files.image.mimetype;
    }

    try {
      const updated = await recipe.save();
      res.json(updated);
    } catch (e) {
      res.status(400).json({ error: errorHandler.getErrorMessage(e) });
    }
  });
};

// ---------------- DELETE ----------------
const deleteRecipe = async (req, res) => {
  try {
    const recipe = req.recipe;
    if (recipe.creator !== req.auth?.name && !req.auth?.admin) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    await Recipe.findByIdAndDelete(recipe._id);
    res.json({ message: "Recipe deleted" });
  } catch (e) {
    res.status(400).json({ error: errorHandler.getErrorMessage(e) });
  }
};

// ---------------- COMMENTS ----------------
const addComment = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId);
    if (!recipe) return res.status(404).json({ error: "Recipe not found" });

    const { name, email, text, rating } = req.body;
    recipe.comments.push({ name, email, text, rating });
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

    if (req.auth.email !== comment.email)
      return res.status(403).json({ error: "Not authorized" });

    comment.text = text;
    comment.rating = rating;
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

    recipe.comments = recipe.comments.filter(
      (c) => c._id.toString() !== commentId
    );
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

// ---------------- FILTERS ----------------
const getRecipesByFilter = async (req, res) => {
  try {
    const ingredientFilter = req.params["ingredient"].split(",");
    const regexArray = ingredientFilter.map((i) => new RegExp(i.trim(), "i"));

    let recipes = await Recipe.find({ ingredients: { $in: regexArray } });
    recipes = recipes.map((r) => {
      const o = r.toObject();
      if (o.image?.data)
        o.image = {
          contentType: o.image.contentType,
          data: o.image.data.toString("base64"),
        };
      return o;
    });

    res.status(200).json(recipes);
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

// ---------------- EXPORT ----------------
export default {
  createRecipe,
  getAllRecipes,
  recipeByID,
  read,
  updateRecipe,
  deleteRecipe,
  addComment,
  updateComment,
  deleteComment,
  getCommentsByUser,
  getRecipesByFilter,
  getRecipesByCreator,
};
