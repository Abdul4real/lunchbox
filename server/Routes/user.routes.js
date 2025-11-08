// server/routes/user.routes.js
import express from "express";
import userCtrl from "../controllers/user.controller.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

/* ------------------------- helpers (route-only) ------------------------- */
// allow the authenticated user themself OR an admin
const isSelfOrAdmin = (req, res, next) => {
  if (!req.profile) return res.status(400).json({ message: "User not loaded" });
  const isSelf = String(req.profile._id) === String(req.userId);
  if (isSelf || req.role === "admin") return next();
  return res.status(403).json({ message: "Not authorized" });
};

/* ================================ USERS ================================ */

// Public registration endpoint
router.post("/register", userCtrl.create);

// Admin-only list users
router.get("/", requireAuth, requireAdmin, userCtrl.list);

// Bind :userId so req.profile is available downstream
router.param("userId", userCtrl.userByID);

router
  .route("/:userId")
  .get(requireAuth, userCtrl.read)
  .put(requireAuth, isSelfOrAdmin, userCtrl.update)
  .delete(requireAuth, isSelfOrAdmin, userCtrl.remove);

router.route("/:userId/admin").put(requireAuth, requireAdmin, userCtrl.setAdmin);

router.route("/:userId/suspend").put(requireAuth, requireAdmin, userCtrl.setSuspended);

router.route("/:userId/password").put(requireAuth, isSelfOrAdmin, userCtrl.updatePassword);

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
