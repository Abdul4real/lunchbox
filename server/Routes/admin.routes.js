// server/Routes/admin.routes.js
import express from "express";
import {
  adminLogin,
  getDashboard,
  overview,
  getUsers,
  toggleSuspendUser,
  deleteUser,
  getAdminRecipes,
  setRecipeStatus,
  getAdminReports,
  setReportStatus,
} from "../controllers/admin.controller.js";

const router = express.Router();

// ADMIN AUTH
router.post("/login", adminLogin);

// DASHBOARD
router.get("/dashboard", getDashboard);
router.get("/overview", overview); // legacy but harmless

// USERS
router.get("/users", getUsers); // ?q=&page=&limit=
router.patch("/users/:id/suspend", toggleSuspendUser);
router.delete("/users/:id", deleteUser);

// RECIPES (admin moderation)
router.get("/recipes", getAdminRecipes);
router.patch("/recipes/:id/status", setRecipeStatus);

// REPORTS (admin moderation)
router.get("/reports", getAdminReports);
router.patch("/reports/:id/status", setReportStatus);

export default router;
