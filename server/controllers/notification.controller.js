// server/controllers/notificationController.js
import Notification from "../models/notification.model.js";
import errorHandler from "./errorController.js";

/**
 * Create a notification
 * - if userId not provided in body, falls back to req.userId
 */
export const createNotification = async (req, res) => {
  try {
    const {
      userId,
      type = "general",
      title,
      message,
      data = {},
      link,
      channel = "inapp",
    } = req.body ?? {};

    const targetUserId = userId || req.userId;
    if (!targetUserId || !message) {
      return res.status(400).json({ error: "User ID and message are required" });
    }

    const notification = await Notification.create({
      userId: targetUserId,
      type,
      title,
      message,
      data,
      link,
      channel,
      // readAt defaults to null (unread)
    });

    res.status(201).json({ message: "Notification created", notification });
  } catch (err) {
    res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};


export const getUserNotifications = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || "20", 10), 1), 100);
    const onlyUnread = req.query.unread === "1";

    const filter = { userId: req.userId, ...(onlyUnread ? { readAt: null } : {}) };

    const [items, total] = await Promise.all([
      Notification.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      Notification.countDocuments(filter),
    ]);

    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      items,
    });
  } catch (err) {
    res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

/**
 * Mark one notification as read
 */
export const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const n = await Notification.findOneAndUpdate(
      { _id: notificationId, userId: req.userId },
      { $set: { readAt: new Date() } },
      { new: true }
    );
    if (!n) return res.status(404).json({ error: "Notification not found" });

    res.json({ message: "Notification marked as read", notification: n });
  } catch (err) {
    res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

/**
 * Mark all notifications as read
 */
export const markAllRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.userId, readAt: null },
      { $set: { readAt: new Date() } }
    );
    res.json({ message: "All notifications marked as read" });
  } catch (err) {
    res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

/**
 * Delete a single notification (only if it belongs to the user)
 */
export const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const n = await Notification.findOneAndDelete({
      _id: notificationId,
      userId: req.userId,
    });
    if (!n) return res.status(404).json({ error: "Notification not found" });

    res.json({ message: "Notification deleted" });
  } catch (err) {
    res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

/**
 * Delete all notifications for current user
 */
export const deleteAllUserNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({ userId: req.userId });
    res.json({ message: "All notifications deleted" });
  } catch (err) {
    res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};
