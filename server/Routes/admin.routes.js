import { Router } from "express";
import { requireAuth, requireAdmin } from "../middlewares/auth.js";
import { overview, setRecipeStatus } from "../controllers/admin.controller.js";
const router = Router();
router.get("/overview", requireAuth, requireAdmin, overview);
router.patch("/recipes/:id/status", requireAuth, requireAdmin, setRecipeStatus);
export default router;