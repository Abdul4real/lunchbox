import { Router } from "express";
import { requireAuth, requireAdmin } from "../middlewares/auth.js";
import { createReport, listReports, setReportStatus } from "../controllers/reports.controller.js";

const router = Router();
router.post("/recipes/:id/report", requireAuth, createReport);
router.get("/", requireAuth, requireAdmin, listReports);
router.patch("/:reportId", requireAuth, requireAdmin, setReportStatus);
export default router;

// Admin bundle (optional quick routes):