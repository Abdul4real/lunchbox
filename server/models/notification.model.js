// server/models/Notification.js
import mongoose from "mongoose";

const { Schema } = mongoose;

const notificationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ["newRecipe", "comment", "update", "admin", "general"],
      default: "general",
    },

    title: { type: String, trim: true },

    message: {
      type: String,
      required: [true, "Notification message is required"],
      trim: true,
      maxlength: 1000,
    },

    // Optional metadata for deep links or rendering
    data: { type: Schema.Types.Mixed, default: {} }, // e.g. { recipeId, reviewId }

    // Optional helpers if you ever add multi-channel notifications
    channel: { type: String, enum: ["inapp", "email", "push"], default: "inapp" },
    link: { type: String, trim: true }, // e.g. "/recipes/123#reviews"

    // Read/archive tracking
    readAt: { type: Date, default: null },
    archivedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// Fast “my notifications” list
notificationSchema.index({ userId: 1, createdAt: -1 });

// Fast unread queries (readAt is null)
notificationSchema.index({ userId: 1, readAt: 1, createdAt: -1 });

export default mongoose.model("Notification", notificationSchema);
