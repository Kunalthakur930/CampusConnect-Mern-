const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const Announcement = require("../models/Announcement");
const upload = require("../config/multer");
const Notification = require("../models/Notification");
const User = require("../models/User");

const router = express.Router();

// POST ANNOUNCEMENT
router.post("/", protect, upload.single("attachment"), async (req, res) => {
  try {
    if (req.user.role !== "faculty") {
      return res
        .status(403)
        .json({ message: "Only faculty can post announcements" });
    }

    const { title, content } = req.body;

    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }

    let filePath = "";

    if (req.file && req.file.filename) {
      filePath = `/uploads/${req.file.filename}`;
    }

    const announcement = new Announcement({
      title,
      content,
      attachment: filePath,
      postedBy: req.user._id,
    });

    await announcement.save();

    await Notification.create({
      forAdmin: true,
      message: `${req.user.email} posted announcement "${announcement.title}"`,
      type: "announcement",
      announcementId: announcement._id,
    });

    // BACK TO SIMPLE: ALL STUDENTS ONLY
    const students = await User.find({ role: "student" });

    const notifications = students.map((student) => ({
      user: student._id,
      message: `New announcement: ${announcement.title}`,
      type: "announcement",
      announcementId: announcement._id,
    }));

    await Notification.insertMany(notifications);

    res.status(201).json({
      message: "Announcement created successfully",
      announcement,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

//  GET ALL ANNOUNCEMENTS
router.get("/", protect, async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .populate("postedBy", "name email")
      .sort({ createdAt: -1 });

    res.json(announcements);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET SINGLE ANNOUNCEMENT
router.get("/:id", protect, async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id).populate(
      "postedBy",
      "name email",
    );

    if (!announcement) {
      return res.status(404).json({
        message: "Announcement not found",
      });
    }

    res.json(announcement);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error",
    });
  }
});
module.exports = router;
