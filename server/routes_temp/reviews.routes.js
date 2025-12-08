import { Router } from "express";
import { requireAuth } from "../middlewares/auth.js";
import { addReview, listReviews } from "../controllers/reviews.controller.js";
const router = Router({ mergeParams: true });
router.get("/", listReviews);
router.post("/", requireAuth, addReview);
export default router;

// Reports (user reports & admin actions)