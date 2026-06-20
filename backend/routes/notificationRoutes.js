const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const Notification = require("../models/Notification");

const router = express.Router();

//  GET USER NOTIFICATIONS
router.get("/", protect, async (req, res) => {
  try {
    let notifications = [];

    // ADMIN
    if (req.user.role === "admin") {
      notifications = await Notification.find({
        forAdmin: true,
      }).sort({ createdAt: -1 });
    }

    // NORMAL USERS
    else {
      notifications = await Notification.find({
        user: req.user._id,
      }).sort({ createdAt: -1 });
    }

    res.json(notifications);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Notification fetch error" });
  }
});
// ⭐ MARK ALL AS READ
router.put("/read-all", protect, async (req, res) => {
  try {
    // ADMIN
    if (req.user.role === "admin") {
      await Notification.updateMany(
        { forAdmin: true, isRead: false },
        { isRead: true },
      );
    }

    // NORMAL USERS
    else {
      await Notification.updateMany(
        { user: req.user._id, isRead: false },
        { isRead: true },
      );
    }

    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Read all error" });
  }
});
// MARK AS READ
router.put("/:id/read", protect, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    if (
      notification.user &&
      notification.user.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not allowed" });
    }

    notification.isRead = true;

    await notification.save();

    res.json({ message: "Marked as read" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Read update error" });
  }
});

module.exports = router;
