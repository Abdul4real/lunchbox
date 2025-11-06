import express from "express";
import { adminLogin } from "../controllers/adminAuthController.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import {
  dashboard,
  listUsers,
  suspendUser,
  resetUserPassword,
  deleteUser,
  createRecipe,
  listRecipes,
  updateRecipeStatus,
  editRecipe,
  deleteRecipe,
  listReports,
  resolveReport,
} from "../controllers/adminController.js";

const router = express.Router();

router.post("/login", adminLogin); // Public login
router.use(requireAuth, requireAdmin); // Admin-only routes below

// Dashboard
router.get("/dashboard", dashboard);

// Users
router.get("/users", listUsers);
router.patch("/users/:id/suspend", suspendUser);
router.patch("/users/:id/reset-password", resetUserPassword);
router.delete("/users/:id", deleteUser);

// Recipes
router.post("/recipes", createRecipe); 
router.get("/recipes", listRecipes);
router.patch("/recipes/:id/status", updateRecipeStatus);
router.patch("/recipes/:id", editRecipe);
router.delete("/recipes/:id", deleteRecipe);

// Reports
router.get("/reports", listReports);
router.patch("/reports/:id/resolve", resolveReport);

export default router;
