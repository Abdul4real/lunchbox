// server/routes/notification.routes.js
import express from "express";
import {
  createNotification,
  getUserNotifications,
  markAsRead,
  markAllRead,
  deleteNotification,
  deleteAllUserNotifications,
} from "../controllers/notification.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// Create a new notification or get all for logged-in user
router.route("/")
  .post(requireAuth, createNotification)
  .get(requireAuth, getUserNotifications);

// Mark a single notification as read
router.put("/:notificationId/read", requireAuth, markAsRead);

// Mark all notifications as read
router.put("/read/all", requireAuth, markAllRead);

// Delete a single notification
router.delete("/:notificationId", requireAuth, deleteNotification);

// Clear all notifications for current user
router.delete("/clear/all", requireAuth, deleteAllUserNotifications);

export default router;
