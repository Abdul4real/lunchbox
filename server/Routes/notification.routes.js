import express from "express";
import * as notificationCtrl from "../controllers/notification.controller.js";
import { requireAuth } from "../middleware/auth.js"; // must set req.userId

const router = express.Router();

// Create a new notification (or for provided userId) & get current user's notifications
router.post("/", requireAuth, notificationCtrl.createNotification);
router.get("/", requireAuth, notificationCtrl.getUserNotifications);

// Mark a single notification as read
router.put("/:notificationId/read", requireAuth, notificationCtrl.markAsRead);

// Mark ALL notifications as read
router.put("/read/all", requireAuth, notificationCtrl.markAllRead);

// Delete a single notification
router.delete("/:notificationId", requireAuth, notificationCtrl.deleteNotification);

// Clear ALL notifications for current user
router.delete("/clear/all", requireAuth, notificationCtrl.deleteAllUserNotifications);

export default router;
