const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      default: "",
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["student", "faculty", "admin"],
      default: "student",
    },

    profilePhoto: {
      type: String,
      default: "",
    },

    mobile: {
      type: String,
      default: "",
    },

    /* ---------- STUDENT FIELDS ---------- */

    course: {
      type: String,
      default: "",
    },
    stdclass: {
      type: String,
      default: "",
    },

    semester: {
      type: String,
      default: "",
    },

    section: {
      type: String,
      default: "",
    },

    enrollmentNo: {
      type: String,
      default: "",
    },

    /* ---------- FACULTY FIELDS ---------- */

    employeeId: {
      type: String,
      default: "",
    },

    department: {
      type: String,
      default: "",
    },

    designation: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("User", userSchema);
