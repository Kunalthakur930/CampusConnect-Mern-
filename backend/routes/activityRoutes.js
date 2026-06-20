const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const Announcement = require("../models/Announcement");
const Reminder = require("../models/Reminder");

const router = express.Router();

router.get("/", protect, async (req, res) => {
  try {

    const announcements = await Announcement.find()
      .populate("postedBy", "name email") 
      .sort({ createdAt: -1 });

    const reminders = await Reminder.find()
      .populate("createdBy", "name email")  
      .sort({ createdAt: -1 });

    const activity = [];

    announcements.forEach(a => {
      activity.push({
        type: "announcement",
        title: a.title,
        content: a.content,
        attachment: a.attachment,
        user: `${a.postedBy?.name || "Unknown"} (${a.postedBy?.email || ""})`,  
        time: a.createdAt,
      });
    });

    reminders.forEach(r => {
      activity.push({
        type: "reminder",
        title: r.title,
        content: r.description,
        user:` ${r.createdBy?.name || "Unknown"} (${r.createdBy?.email || ""})`, 
        time: r.createdAt,
      });
    });

    activity.sort((a, b) => new Date(b.time) - new Date(a.time));

    res.json(activity);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Activity error" });
  }
});

module.exports = router;