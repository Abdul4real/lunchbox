// server/routes/user.routes.js
import express from "express";
import userCtrl from "../controllers/user.controller.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

/* =============================== RECIPES =============================== */

// Public list (returns base64 image metadata) and Admin create (image required)
router
  .route("/recipes")
  .get(userCtrl.getAllRecipes)
  .post(requireAuth, userCtrl.createRecipe);

// Filters
router.get("/recipes/filter/ingredient/:ingredient", userCtrl.getRecipesByFilter);
router.get("/recipes/creator/:name", userCtrl.getRecipesByCreator);

// Bind :recipeId to load a recipe into req.recipe
router.param("recipeId", userCtrl.recipeByID);

// Read (public), Update/Delete (auth; controller checks owner/admin)
router
  .route("/recipes/:recipeId")
  .get(userCtrl.readRecipe)
  .put(requireAuth, userCtrl.updateRecipe)
  .delete(requireAuth, userCtrl.deleteRecipe);

/* =============================== COMMENTS ============================== */

// Add comment (auth required)
router.post("/recipes/:recipeId/comments", requireAuth, userCtrl.addComment);

// Update/Delete own comment (auth required; controller checks ownership/admin)
router.put("/recipes/:recipeId/comments/:commentId", requireAuth, userCtrl.updateComment);
router.delete("/recipes/:recipeId/comments/:commentId", requireAuth, userCtrl.deleteComment);

// List comments by email (public)
router.get("/comments/by/:email", userCtrl.getCommentsByUser);

/* ================================ REVIEWS ============================== */

// Add review (auth)
router.post("/recipes/:recipeId/reviews", requireAuth, userCtrl.addReview);

// List reviews for a recipe (public)
router.get("/recipes/:recipeId/reviews", userCtrl.listReviewsByRecipe);

// Update/Delete own review or admin (auth; controller checks)
router.put("/reviews/:reviewId", requireAuth, userCtrl.updateReview);
router.delete("/reviews/:reviewId", requireAuth, userCtrl.deleteReview);

export default router;
