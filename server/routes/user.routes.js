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
router.post("/recipes/:recipeId/comments", requireAuth, userCtrl.addComment);
router.put("/recipes/:recipeId/comments/:commentId", requireAuth, userCtrl.updateComment);
router.delete("/recipes/:recipeId/comments/:commentId", requireAuth, userCtrl.deleteComment);
router.get("/comments/by/:email", userCtrl.getCommentsByUser);

/* ================================ REVIEWS ============================== */
router.post("/recipes/:recipeId/reviews", requireAuth, userCtrl.addReview);
router.get("/recipes/:recipeId/reviews", userCtrl.listReviewsByRecipe);
router.put("/reviews/:reviewId", requireAuth, userCtrl.updateReview);
router.delete("/reviews/:reviewId", requireAuth, userCtrl.deleteReview);

export default router;
