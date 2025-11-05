// routes/searchRoutes.js
import express from "express";
import {
  searchRecipes,
  searchByIngredient,
  quickSearch,
  searchUsers,
  searchCategories
} from "../controllers/searchController.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// Public search routes
router.get("/recipes", searchRecipes);
router.get("/recipes/ingredient/:ingredient", searchByIngredient);
router.get("/quick", quickSearch);
router.get("/categories", searchCategories);

// Admin-only search routes
router.get("/users", requireAuth, requireAdmin, searchUsers);

export default router;