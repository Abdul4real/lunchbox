import { Router } from "express";
import { requireAuth } from "../middlewares/auth.js";
import {
  createRecipe, listRecipes, getRecipe,
  updateRecipe, deleteRecipe, toggleBookmark
} from "../controllers/recipes.controller.js";

const router = Router();
router.get("/", listRecipes);
router.get("/:id", getRecipe);
router.post("/", requireAuth, createRecipe);
router.patch("/:id", requireAuth, updateRecipe);
router.delete("/:id", requireAuth, deleteRecipe);
router.post("/:id/bookmark", requireAuth, toggleBookmark);
export default router;
