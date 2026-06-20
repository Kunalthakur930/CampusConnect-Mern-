import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import "./StudentDashboard.css";
import { useNavigate } from "react-router-dom";
import {
  Megaphone,
  Clock,
  Bell,
  AlertTriangle,
  Bot,
  ChevronRight,
  Calendar,
  Sparkles,
} from "lucide-react";

function StudentDashboard() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      const res = await fetch("http://localhost:5000/api/dashboard/student", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const result = await res.json();
      setData(result);
    };
    fetchDashboard();
  }, []);

  if (!data)
    return (
      <Layout>
        <div className="loader-container">
          <Sparkles className="spinning-icon" size={40} />
          <p>Syncing your academic data...</p>
        </div>
      </Layout>
    );

  return (
    <Layout>
      <div className="student-dashboard">
        {/*  WELCOME SECTION */}
        <header className="welcome-header">
          <div className="welcome-text">
            <h1>
              Welcome back, Explorer! <Sparkles size={24} className="sparkle" />
            </h1>
            <p>Here's what's happening in your college today.</p>
          </div>
          <button className="ai-pill" onClick={() => navigate("/chat")}>
            <Bot size={20} /> <span>Talk to AI Assistant</span>
          </button>
        </header>

        {/*  STATS GRID */}
        <div className="stats-container">
          <div className="stat-card" onClick={() => navigate("/announcements")}>
            <div className="stat-icon ann">
              <Megaphone size={24} />
            </div>
            <div className="stat-info">
              <h3>Announcements</h3>
              <p className="stat-value">{data.totalAnnouncements || 0}</p>
            </div>
          </div>

          <div className="stat-card" onClick={() => navigate("/reminders")}>
            <div className="stat-icon upc">
              <Clock size={24} />
            </div>
            <div className="stat-info">
              <h3>Upcoming</h3>
              <p className="stat-value">{data.upcomingReminderCount || 0}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon unread">
              <Bell size={24} />
            </div>
            <div className="stat-info">
              <h3>Unread</h3>
              <p className="stat-value">{data.unreadNotifications || 0}</p>
            </div>
          </div>

          <div className="stat-card danger">
            <div className="stat-icon overdue">
              <AlertTriangle size={24} />
            </div>
            <div className="stat-info">
              <h3>Overdue</h3>
              <p className="stat-value">{data.overdueReminders || 0}</p>
            </div>
          </div>
        </div>

        {/*  LIVE UPDATES & ACTIONS */}
        <div className="dashboard-main-grid">
          <div className="update-panel">
            <div className="panel-header">
              <h2>Latest Updates</h2>
              <button onClick={() => navigate("/announcements")}>
                View All <ChevronRight size={16} />
              </button>
            </div>
            <div className="panel-card wide">
              <div className="card-top">
                <span className="type-tag">New Announcement</span>
                <span className="date-small">
                  {data.latestAnnouncement
                    ? new Date(
                        data.latestAnnouncement.createdAt,
                      ).toLocaleDateString()
                    : ""}
                </span>
              </div>
              <h4>
                {data.latestAnnouncement?.title || "Everything is up to date!"}
              </h4>
              <p>{data.latestAnnouncement?.content?.substring(0, 100)}...</p>
            </div>
          </div>

          <div className="update-panel">
            <div className="panel-header">
              <h2>Next Deadline</h2>
              <button onClick={() => navigate("/reminders")}>
                Timeline <ChevronRight size={16} />
              </button>
            </div>
            <div className="panel-card wide deadline">
              {data.nextReminder ? (
                <>
                  <div className="card-top">
                    <span className="type-tag urgent">Reminder</span>
                    <span className="date-small icon-date">
                      <Calendar size={12} />{" "}
                      {new Date(data.nextReminder.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                  <h4>{data.nextReminder.title}</h4>
                  <p>{data.nextReminder.description?.substring(0, 60)}...</p>
                </>
              ) : (
                <div className="empty-msg">No deadlines scheduled. Enjoy!</div>
              )}
            </div>
          </div>
        </div>

        {/*  QUICK ACTIONS BAR */}
        <div className="quick-actions-bar">
          <h3>Quick Access</h3>
          <div className="actions-btns">
            <button onClick={() => navigate("/announcements")}>Notices</button>
            <button onClick={() => navigate("/reminders")}>Reminders</button>
            <button onClick={() => navigate("/myprofile")}>Profile</button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default StudentDashboard;
