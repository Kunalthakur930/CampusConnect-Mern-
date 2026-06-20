import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import "./FacultyDashboard.css";
import { Megaphone, BellPlus, Calendar, PlusCircle, LayoutDashboard, ChevronRight, Briefcase } from "lucide-react";

function FacultyDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("http://localhost:5000/api/dashboard/faculty", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      const result = await res.json();
      setData(result);
    };
    fetchData();
  }, []);

  if (!data) return (
    <Layout>
      <div className="loader-container">
        <div className="spinner"></div>
        <p>Preparing Faculty Desk...</p>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="faculty-dashboard-container">
        {/*  HEADER SECTION */}
        <header className="dashboard-header">
          <div className="header-info">
            <div className="header-icon-box">
              <Briefcase size={28} />
            </div>
            <div>
              <h1>Faculty Control Desk</h1>
              <p>Manage your classroom communications and deadlines effortlessly.</p>
            </div>
          </div>
        </header>

        {/*  ANALYTICS GRID */}
        <div className="faculty-stats-grid">
          <div className="f-stat-card">
            <div className="f-stat-icon ann-icon"><Megaphone size={24} /></div>
            <div className="f-stat-content">
              <h3>My Announcements</h3>
              <p>{data.announcementCount}</p>
            </div>
          </div>

          <div className="f-stat-card">
            <div className="f-stat-icon rem-icon"><BellPlus size={24} /></div>
            <div className="f-stat-content">
              <h3>My Reminders</h3>
              <p>{data.reminderCount}</p>
            </div>
          </div>

          <div className="f-stat-card wide-stat">
            <div className="f-stat-icon next-icon"><Calendar size={24} /></div>
            <div className="f-stat-content">
              <h3>Upcoming Deadline</h3>
              <p>
                {data.nextReminder
                  ? `${data.nextReminder.title} (${new Date(data.nextReminder.dueDate).toLocaleDateString('en-GB')})`
                  : "No active deadlines"}
              </p>
            </div>
          </div>
        </div>

        {/*  ACTION CENTER */}
        <div className="action-center">
          <h2>Quick Management</h2>
          <div className="action-grid">
            <div className="action-box" onClick={() => window.location.href = "/post-announcement"}>
              <div className="action-inner">
                <PlusCircle size={30} />
                <div className="action-text">
                  <h4>Post Announcement</h4>
                  <p>Broadcast updates to all students</p>
                </div>
              </div>
              <ChevronRight size={20} className="arrow" />
            </div>

            <div className="action-box" onClick={() => window.location.href = "/manage-reminders"}>
              <div className="action-inner">
                <BellPlus size={30} />
                <div className="action-text">
                  <h4>Set New Reminder</h4>
                  <p>Create deadlines and schedules</p>
                </div>
              </div>
              <ChevronRight size={20} className="arrow" />
            </div>

            <div className="action-box" onClick={() => window.location.href = "/manage-announcements"}>
              <div className="action-inner">
                <LayoutDashboard size={30} />
                <div className="action-text">
                  <h4>Manage Posts</h4>
                  <p>Edit or delete previous messages</p>
                </div>
              </div>
              <ChevronRight size={20} className="arrow" />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default FacultyDashboard;