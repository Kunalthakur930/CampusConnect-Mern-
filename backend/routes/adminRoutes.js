const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const User = require("../models/User");
const Announcement = require("../models/Announcement");
const Reminder = require("../models/Reminder");
const upload = require("../config/multer");
const router = express.Router();

//  ADMIN CHECK
const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};

// STATS
router.get("/stats", protect, adminOnly, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const students = await User.countDocuments({ role: "student" });
    const faculty = await User.countDocuments({ role: "faculty" });

    const announcements = await Announcement.countDocuments();
    const reminders = await Reminder.countDocuments();

    res.json({
      totalUsers,
      students,
      faculty,
      announcements,
      reminders,
    });
  } catch (err) {
    res.status(500).json({ message: "Admin stats error" });
  }
});

//  GET USERS
router.get("/users", protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch {
    res.status(500).json({ message: "User fetch error" });
  }
});

// DELETE
router.delete("/users/:id", protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.deleteOne();
    res.json({ message: "Deleted" });
    await Notification.create({
      forAdmin: true,
      message: `${user.name} deleted from system`,
      type: "admin",
    });
  } catch {
    res.status(500).json({ message: "Delete error" });
  }
});

// UPDATE USER 
router.put(
  "/users/:id",
  protect,
  adminOnly,
  upload.single("profilePhoto"),
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const emailExists = await User.findOne({
        email: req.body.email,
        _id: { $ne: req.params.id },
      });

      if (emailExists) {
        return res.status(400).json({
          message: "This email is already registered",
        });
      }

      const mobileExists = await User.findOne({
        mobile: req.body.mobile,
        _id: { $ne: req.params.id },
      });

      if (mobileExists) {
        return res.status(400).json({
          message: "Mobile number already exists",
        });
      }

      const mobileRegex = /^\+91\s\d{10}$/;

      if (req.body.mobile && !mobileRegex.test(req.body.mobile)) {
        return res.status(400).json({
          message: "Invalid mobile number format. Use +91 9876543210",
        });
      }

      if (req.body.enrollmentNo) {
        const enrollmentExists = await User.findOne({
          enrollmentNo: req.body.enrollmentNo,
          _id: { $ne: req.params.id },
        });

        if (enrollmentExists) {
          return res.status(400).json({
            message: "Enrollment number already exists",
          });
        }
      }

      if (req.body.employeeId) {
        const employeeExists = await User.findOne({
          employeeId: req.body.employeeId,
          _id: { $ne: req.params.id },
        });

        if (employeeExists) {
          return res.status(400).json({
            message: "Employee ID already exists",
          });
        }
      }

      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.mobile = req.body.mobile || user.mobile;

      // STUDENT
      user.course = req.body.course || user.course;
      user.stdclass = req.body.stdclass || user.stdclass;
      user.semester = req.body.semester || user.semester;
      user.section = req.body.section || user.section;
      user.enrollmentNo = req.body.enrollmentNo || user.enrollmentNo;

      // FACULTY
      user.employeeId = req.body.employeeId || user.employeeId;
      user.department = req.body.department || user.department;
      user.designation = req.body.designation || user.designation;
      if (req.file) {
        user.profilePhoto = `/uploads/${req.file.filename}`;
      }
      await user.save();

      res.json({ message: "User updated successfully" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Update error" });
    }
  },
);

module.exports = router;
