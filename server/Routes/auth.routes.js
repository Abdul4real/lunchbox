import express from "express";
import authCtrl from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signin", authCtrl.signin);
router.get("/signout", authCtrl.signout);
router.post("/forgot-password", authCtrl.forgotPassword);
router.post("/verify-security-answer", authCtrl.verifySecurityAnswer);
router.post("/reset-password", authCtrl.resetPassword);

export default router;
