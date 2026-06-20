const { protect } = require("../middleware/authMiddleware");

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const upload = require("../config/multer");

const router = express.Router();

router.post("/register", upload.single("profilePhoto"), async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      mobile,
      course,
      stdclass,
      semester,
      section,
      enrollmentNo,
      employeeId,
      department,
      designation,
    } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "This email is already registered",
      });
    }

    const mobileRegex = /^\+91\s\d{10}$/;

    if (!mobileRegex.test(mobile)) {
      return res.status(400).json({
        message: "Invalid mobile number format. Use +91 9876543210",
      });
    }

    const mobileExists = await User.findOne({ mobile });

    if (mobileExists) {
      return res.status(400).json({
        message: "Mobile number already exists",
      });
    }

    if (role === "student") {
      const enrollmentExists = await User.findOne({
        enrollmentNo,
      });

      if (enrollmentExists) {
        return res.status(400).json({
          message: "Enrollment number already exists",
        });
      }
    }

    if (role === "faculty") {
      const employeeExists = await User.findOne({
        employeeId,
      });

      if (employeeExists) {
        return res.status(400).json({
          message: "Employee ID already exists",
        });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let photoPath = "";

    if (req.file) {
      photoPath = `/uploads/${req.file.filename}`;
    }

    await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      profilePhoto: photoPath,
      mobile,
      course,
      stdclass,
      semester,
      section,
      enrollmentNo,
      employeeId,
      department,
      designation,
    });

    res.json({
      message: "User Registered",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Register error",
    });
  }
});

// LOGIN (NO CHANGE)
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  res.json({
    token,
    role: user.role,
  });
});

// GET PROFILE
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "server error" });
  }
});

// UPDATE PROFILE (optional later upgrade for image)
router.put("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    user.name = req.body.name || user.name;
    user.mobile = req.body.mobile || user.mobile;

    user.course = req.body.course || user.course;
    user.stdclass = req.body.stdclass || user.stdclass;
    user.semester = req.body.semester || user.semester;
    user.section = req.body.section || user.section;
    user.enrollmentNo = req.body.enrollmentNo || user.enrollmentNo;

    user.employeeId = req.body.employeeId || user.employeeId;
    user.department = req.body.department || user.department;
    user.designation = req.body.designation || user.designation;

    await user.save();

    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// CHANGE PASSWORD (NO CHANGE)
router.put("/change-password", protect, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
