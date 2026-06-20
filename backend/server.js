const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const chatRoutes = require("./routes/chatRoutes");
const adminRoutes = require("./routes/adminRoutes");
const activityRoutes= require("./routes/activityRoutes")

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/chat", chatRoutes);
app.use("/api/announcements", require("./routes/announcementRoutes"));
app.use("/api/reminders", require("./routes/reminderRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/uploads", express.static("uploads"));
app.use("/api/search", require("./routes/searchRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/admin", adminRoutes);
app.use('/api/activity',activityRoutes)

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`),
);
