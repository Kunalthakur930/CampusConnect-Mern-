const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    forAdmin: {
      type: Boolean,
      default: false,
    },

    message: String,

    type: String,

    isRead: {
      type: Boolean,
      default: false,
    },

    announcementId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Announcement",
    },

    reminderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reminder",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Notification", notificationSchema);
