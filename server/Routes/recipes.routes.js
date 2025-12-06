import { Router } from "express"; 
import mongoose from "mongoose";
import { requireAuth } from "../middlewares/auth.js";
import {
  createRecipe,
  listRecipes,
  getRecipe,
  updateRecipe,
  deleteRecipe,
  toggleBookmark,
  addReview,
} from "../controllers/recipes.controller.js";
import { upload } from "../middlewares/upload.js";

const router = Router();

// Middleware to validate MongoDB ObjectId
function validateObjectId(req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid recipe ID" });
  }
  next();
}

// Public routes
router.get("/", listRecipes);
router.get("/:id", validateObjectId, getRecipe);

// Protected routes (require authentication)
router.post("/:id/review", requireAuth, addReview);
router.patch("/:id", requireAuth, validateObjectId, updateRecipe);
router.delete("/:id", requireAuth, validateObjectId, deleteRecipe);
router.post("/:id/bookmark", requireAuth, validateObjectId, toggleBookmark);
router.post("/", requireAuth, upload.single("image"), createRecipe);

export default router;
