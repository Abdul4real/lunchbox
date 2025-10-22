import express from "express";
import notificationCtrl from "../controllers/notification.controller.js";
import authCtrl from "../controllers/auth.controller.js";

const router = express.Router();

// Create a new notification or get all for the user
router
  .route("/")
  .post(authCtrl.requireSignin, notificationCtrl.createNotification)
  .get(authCtrl.requireSignin, notificationCtrl.getUserNotifications);

// Mark a single notification as read
router
  .route("/:notificationId/read")
  .put(authCtrl.requireSignin, notificationCtrl.markAsRead);

// Delete a single notification
router
  .route("/:notificationId")
  .delete(authCtrl.requireSignin, notificationCtrl.deleteNotification);

// Clear all notifications for current user
router
  .route("/clear/all")
  .delete(authCtrl.requireSignin, notificationCtrl.deleteAllUserNotifications);

export default router;
