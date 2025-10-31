import express from "express";
import recipeCtrl from "../controllers/recipe.controller.js";
import authCtrl from "../controllers/auth.controller.js";

const router = express.Router();

// ---------------- Main Recipes ----------------
// Create a new recipe / Get all recipes
router.route("/")
  .post(authCtrl.requireSignin, authCtrl.setUser, recipeCtrl.createRecipe)
  .get(recipeCtrl.getAllRecipes);

// ---------------- Single Recipe ----------------
// Get / Update / Delete a recipe by ID
router.route("/:recipeId")
  .get(recipeCtrl.read)
  .put(authCtrl.requireSignin, authCtrl.setUser, recipeCtrl.updateRecipe)
  .delete(authCtrl.requireSignin, authCtrl.setUser, recipeCtrl.deleteRecipe);

// ---------------- Comments ----------------
// Add a new comment to a recipe
router.route("/:recipeId/comments")
  .post(authCtrl.requireSignin, authCtrl.setUser, recipeCtrl.addComment);

// Update or delete a specific comment
router.route("/:recipeId/comments/:commentId")
  .put(authCtrl.requireSignin, authCtrl.setUser, recipeCtrl.updateComment)
  .delete(authCtrl.requireSignin, authCtrl.setUser, recipeCtrl.deleteComment);

// Get all comments by a user (by email)
router.route("/comments/byuser/:email")
  .get(authCtrl.requireSignin, authCtrl.setUser, recipeCtrl.getCommentsByUser);

// ---------------- Filtering & Search ----------------
// Get recipes by ingredient(s)
router.route("/ingredient/:ingredient")
  .get(authCtrl.requireSignin, authCtrl.setUser, recipeCtrl.getRecipesByFilter);

// Get recipes by creator name
router.route("/creator/:name")
  .get(authCtrl.requireSignin, authCtrl.setUser, recipeCtrl.getRecipesByCreator);

// ---------------- Params ----------------
router.param("recipeId", recipeCtrl.recipeByID);

export default router;
