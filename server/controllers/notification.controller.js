import Notification from '../models/notification.model.js'
import errorHandler from '../controllers/errorController.js'

// Create a new notification
const createNotification = async (req, res) => {
  try {
    const { userId, message, type } = req.body

    if (!userId || !message)
      return res.status(400).json({ error: "User ID and message are required" })

    const notification = new Notification({
      user: userId,
      message,
      type: type || 'general'
    })

    await notification.save()
    res.status(201).json({ message: "Notification created", notification })
  } catch (err) {
    res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
}

// Get all notifications for logged-in user
const getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.auth._id }).sort({ created: -1 })
    res.json(notifications)
  } catch (err) {
    res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
}

// Mark notification as read
const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params
    const notification = await Notification.findById(notificationId)
    if (!notification)
      return res.status(404).json({ error: "Notification not found" })

    // Security: make sure the notification belongs to this user
    if (notification.user.toString() !== req.auth._id.toString())
      return res.status(403).json({ error: "Not authorized" })

    notification.read = true
    await notification.save()
    res.json({ message: "Notification marked as read", notification })
  } catch (err) {
    res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
}

// Delete a single notification
const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params
    const notification = await Notification.findById(notificationId)
    if (!notification)
      return res.status(404).json({ error: "Notification not found" })

    if (notification.user.toString() !== req.auth._id.toString())
      return res.status(403).json({ error: "Not authorized" })

    await notification.deleteOne()
    res.json({ message: "Notification deleted" })
  } catch (err) {
    res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
}

// Delete all notifications for current user
const deleteAllUserNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({ user: req.auth._id })
    res.json({ message: "All notifications deleted" })
  } catch (err) {
    res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
}

export default {
  createNotification,
  getUserNotifications,
  markAsRead,
  deleteNotification,
  deleteAllUserNotifications
}
