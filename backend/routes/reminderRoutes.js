const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const Reminder = require("../models/Reminder");
const Notification = require("../models/Notification");
const User = require("../models/User");

const router = express.Router();

// POST /api/reminders
router.post("/", protect, async (req, res) => {
  try {
    // FIX (admin allowed)
    if (req.user.role !== "faculty") {
      return res
        .status(403)
        .json({ message: "Only faculty can create reminders" });
    }

    const { title, description, dueDate } = req.body;

    if (!title || !description || !dueDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const reminder = new Reminder({
      title,
      description,
      dueDate,
      createdBy: req.user._id,
    });

    await reminder.save();

    await Notification.create({
      forAdmin: true,
      message: `${req.user.email} created reminder "${reminder.title}"`,
      type: "reminder",
      reminderId: reminder._id,
    });

    const students = await User.find({ role: "student" });

    if (students.length > 0) {
      const notifications = students.map((s) => ({
        user: s._id,
        message: ` New reminder: ${reminder.title}`,
        type: "reminder",
        reminderId: reminder._id,
      }));

      await Notification.insertMany(notifications);
    }

    res.status(201).json({ message: "Reminder created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

//  GET ALL REMINDERS (🔥 FIX HERE)
router.get("/", protect, async (req, res) => {
  try {
    const reminders = await Reminder.find()
      .populate("createdBy", "email role")
      .sort({ createdAt: -1 });

    res.json(reminders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET SINGLE
router.get("/:id", protect, async (req, res) => {
  try {
    const reminder = await Reminder.findById(req.params.id);

    if (!reminder) {
      return res.status(404).json({ message: "Reminder not found" });
    }

    res.json(reminder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE
router.delete("/:id", protect, async (req, res) => {
  try {
    if (req.user.role !== "faculty") {
      return res
        .status(403)
        .json({ message: "Only faculty can delete reminders" });
    }

    const reminder = await Reminder.findById(req.params.id);

    if (!reminder) {
      return res.status(404).json({ message: "Reminder not found" });
    }

    await reminder.deleteOne();

    res.json({ message: "Reminder deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE
router.put("/:id", protect, async (req, res) => {
  try {
    if (req.user.role !== "faculty") {
      return res
        .status(403)
        .json({ message: "Only faculty can update reminders" });
    }

    const { title, description, dueDate } = req.body;

    const reminder = await Reminder.findById(req.params.id);

    if (!reminder) {
      return res.status(404).json({ message: "Reminder not found" });
    }

    reminder.title = title || reminder.title;
    reminder.description = description || reminder.description;
    reminder.dueDate = dueDate || reminder.dueDate;

    await reminder.save();

    res.json({ message: "Reminder updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
