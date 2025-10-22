import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['newRecipe', 'comment', 'update', 'admin', 'general'],
    default: 'general'
  },
  message: {
    type: String,
    required: 'Notification message is required'
  },
  read: {
    type: Boolean,
    default: false
  },
  created: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.model('Notification', notificationSchema)
