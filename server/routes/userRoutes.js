
import express from "express";
import { listUsers } from "../controllers/userController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// Any authenticated user can list users
router.get("/", requireAuth, listUsers);

export default router;
