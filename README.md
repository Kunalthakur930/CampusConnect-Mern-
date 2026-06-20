# CampusConnect - Virtual Assistant for Students and Faculty

A full-stack MERN application designed to improve communication and academic management between students, faculty members, and administrators. The system provides a centralized platform where users can access announcements, reminders, notifications, profile management features, and role-based dashboards.

## Project Overview

Managing academic information manually often leads to communication gaps, missed announcements, and difficulty in tracking important updates. This project solves these challenges by providing a secure web-based platform that allows faculty members to share information instantly while enabling students to receive updates in real time.

The application supports three different user roles:

* Admin
* Faculty
* Student

Each role has access to dedicated features and permissions based on their responsibilities.

---

## Features

### Authentication & Authorization

* Secure Login System
* JWT Based Authentication
* Role-Based Access Control
* Protected Routes

### Admin Module

* Add New Users
* Edit Existing Users
* Delete Users
* Filter Users by Class and Department
* Activity Monitoring
* Admin Notifications

### Faculty Module

* Post Announcements
* Upload Announcement Attachments
* Create Reminders
* Manage Announcements
* Manage Reminders
* Profile Management

### Student Module

* View Announcements
* View Reminder Updates
* Receive Notifications
* Search Announcements and Reminders
* Update Profile Information

### Notification System

* Real-Time Notification Management
* Announcement Notifications
* Reminder Notifications
* Read/Unread Status Tracking

### Search Functionality

* Search Announcements by Title
* Search Reminders by Title
* Quick Navigation to Details Page

### Profile Management

* Profile Photo Upload
* Personal Information Management
* Change Password Functionality

---

## Technology Stack

### Frontend

* React.js
* React Router DOM
* CSS3
* Fetch API

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### Authentication & Security

* JWT (JSON Web Token)
* bcrypt.js

### File Upload

* Multer

---

## Project Structure

```bash
CampusConnect
│
├── backend
│   ├── config
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── uploads
│   └── server.js
│
└── frontend
    └── kunal
        ├── public
        ├── src
        ├── package.json
        └── vite.config.js
```

---

## Database Collections

* Users
* Announcements
* Reminders
* Notifications
* Chats

---

## Key Modules

### User Management

The administrator can manage student and faculty accounts, update user information, and maintain academic records.

### Announcement Management

Faculty members can create announcements with file attachments that are instantly visible to students.

### Reminder Management

Important academic reminders can be created and shared with students to improve task tracking.

### Notification System

Automatic notifications are generated whenever announcements or reminders are created.

### Smart Search

Users can quickly search announcements and reminders using keywords and access detailed information.

---

## Future Enhancements

* AI-Powered Academic Assistant
* Email Notification Integration
* Mobile Application Development
* Real-Time Chat using Socket.io
* Attendance Management System
* Assignment Submission Module
* Analytics Dashboard

---

## Author

**Kunal Thakur**

B.Tech (Computer Science & Information Technology)

MERN Stack Developer

---

## Project Status

Completed and successfully submitted as a Final Year Major Project.
