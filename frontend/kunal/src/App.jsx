import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import FacultyDashboard from "./pages/FacultyDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Chat from "./pages/Chat";
import PostAnnouncement from "./pages/PostAnnouncemet";
import Announcements from "./pages/Announcements";
import CreateReminder from "./pages/CreateReminder";
import Reminders from "./pages/Reminders";
import MyProfile from "./pages/MyProfile";
import ChangePassword from "./pages/ChangePassword";
import ManageAnnouncements from "./pages/ManageAnnouncements";
import AnnouncementDetail from "./pages/AnnouncementDetail";
import ReminderDetail from "./pages/ReminderDetail";
import AdminDashboard from "./components/admin/components_admin/AdminDashboard";
import ManageUsers from "./components/admin/pages/ManageUsers";
import AddUser from "./components/admin/pages/AddUser";
import AdminActivity from "./components/admin/pages/AdminActivity";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRole="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/faculty"
          element={
            <ProtectedRoute allowedRole="faculty">
              <FacultyDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />

        <Route
          path="/post-announcement"
          element={
            <ProtectedRoute>
              <PostAnnouncement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/announcements"
          element={
            <ProtectedRoute>
              <Announcements />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage-reminders"
          element={
            <ProtectedRoute allowedRole="faculty">
              <CreateReminder />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reminders"
          element={
            <ProtectedRoute>
              <Reminders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/myprofile"
          element={
            <ProtectedRoute>
              <MyProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/change-password"
          element={
            <ProtectedRoute>
              <ChangePassword />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage-announcements"
          element={
            <ProtectedRoute>
              <ManageAnnouncements />
            </ProtectedRoute>
          }
        />
        <Route
          path="/announcement/:id"
          element={
            <ProtectedRoute>
              <AnnouncementDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reminder/:id"
          element={
            <ProtectedRoute>
              <ReminderDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              <ManageUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/add-user"
          element={
            <ProtectedRoute>
              <AddUser />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/activity"
          element={
            <ProtectedRoute>
              <AdminActivity />
            </ProtectedRoute>
          }
        />
        
      </Routes>
    </Router>
  );
}

export default App;
