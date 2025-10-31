// server/routes/userRoutes.js
import express from "express";
import { listUsers } from "../controllers/userController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();
router.get("/", requireAuth, listUsers);
export default router;
