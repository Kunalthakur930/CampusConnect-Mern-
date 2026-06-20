const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const Announcement = require("../models/Announcement");
const Reminder = require("../models/Reminder");
const Notification = require("../models/Notification");

const router = express.Router();


//  STUDENT DASHBOARD
router.get("/student", protect, async (req, res) => {
  try {

    const now = new Date();

    //  Total announcements
    const totalAnnouncements = await Announcement.countDocuments();

    //  Latest announcement
    const latestAnnouncement = await Announcement
      .findOne()
      .sort({ createdAt: -1 });

    //  Upcoming reminders
    const upcomingReminders = await Reminder.find({
      dueDate: { $gte: now },
    }).sort({ dueDate: 1 });

    const nextReminder = upcomingReminders[0];

    //  Unread notifications
    const unreadNotifications = await Notification.countDocuments({
      user: req.user._id,
      isRead: false,
    });

    //  Overdue reminders
    const overdueReminders = await Reminder.countDocuments({
      dueDate: { $lt: now },
    });

    res.json({
      totalAnnouncements,
      upcomingReminderCount: upcomingReminders.length,
      latestAnnouncement,
      nextReminder,
      unreadNotifications,
      overdueReminders,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Dashboard error" });
  }
});


//  FACULTY DASHBOARD
router.get("/faculty", protect, async (req, res) => {
  try {

    const facultyId = req.user._id;
    const now = new Date();

    // My announcements
    const myAnnouncements = await Announcement.find({
      postedBy: facultyId
    });

    //  My reminders
    const myReminders = await Reminder.find({
      createdBy: facultyId
    });

    const upcomingReminders = myReminders
      .filter(r => new Date(r.dueDate) >= now)
      .sort((a,b)=> new Date(a.dueDate) - new Date(b.dueDate));

    const overdueReminders = myReminders.filter(
      r => new Date(r.dueDate) < now
    );

    const nextReminder = upcomingReminders[0];

    res.json({
      announcementCount: myAnnouncements.length,
      reminderCount: myReminders.length,
      overdueReminders: overdueReminders.length,
      nextReminder
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Faculty dashboard error" });
  }
});

module.exports = router;