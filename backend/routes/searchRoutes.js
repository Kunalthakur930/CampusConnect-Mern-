const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const Announcement = require("../models/Announcement");
const Reminder = require("../models/Reminder");

const router = express.Router();

// GLOBAL SEARCH
router.get("/", protect, async (req, res) => {
  try {
    const query = req.query.q;

    if (!query) {
      return res.json({ announcements: [], reminders: [] });
    }

    const announcementResults = await Announcement.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } },
      ],
    }).sort({ createdAt: -1 });

    const reminderResults = await Reminder.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    }).sort({ dueDate: 1 });

    res.json({
      announcements: announcementResults,
      reminders: reminderResults,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Search error" });
  }
});

module.exports = router;