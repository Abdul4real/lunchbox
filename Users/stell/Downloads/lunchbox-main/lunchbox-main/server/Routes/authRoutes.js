// server/routes/authRoutes.js
import express from "express";
import { registerUser, loginUser, logoutUser } from "../controllers/authController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", registerUser);
router.post("/signin", loginUser);
router.post("/signout", logoutUser);

router.get("/me", requireAuth, (req, res) => {
  res.json({ ok: true, userId: req.userId, role: req.role });
});

export default router;
