
import express from "express";
import { registerUser, loginUser, logoutUser } from "../controllers/authController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", registerUser);
router.post("/signin", loginUser);
router.post("/signout", logoutUser);

// a simple protected route to test tokens
router.get("/me", requireAuth, (req, res) => {
  res.json({ ok: true, userId: req.userId });
});

export default router;
