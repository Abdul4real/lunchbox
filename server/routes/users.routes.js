import { Router } from "express";
import { requireAuth } from "../middlewares/auth.js";
import { updateProfile, changePassword, deleteAccount } from "../controllers/users.controller.js";

const router = Router();

router.patch("/profile", requireAuth, updateProfile);
router.patch("/password", requireAuth, changePassword);
router.delete("/", requireAuth, deleteAccount);

export default router;
