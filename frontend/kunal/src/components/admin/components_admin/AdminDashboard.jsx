import { useEffect, useState } from "react";
import Layout from "../../Layout";
import "./AdminDashboard.css";
import { Users, UserCheck, UserCog, Megaphone, Clock, PlusCircle, Activity } from "lucide-react";
import { API_URL } from "../../../config";

function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [activities, setActivities] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchActivity();
    fetchUsers();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/stats`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchActivity = async () => {
    try {
      const res = await fetch(`${API_URL}/api/activity`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      setActivities(Array.isArray(data) ? data.slice(0, 5) : []);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/users`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      setUsers(Array.isArray(data) ? data.slice(0, 5) : []);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Layout>
      <div className="admin-dashboard">
        <header className="dashboard-header">
          <h1>Admin Control Center</h1>
          <p>Manage your institution's users and announcements</p>
        </header>

        {/*  STATS GRID */}
        <div className="stats-grid">
          <div className="card">
            <div className="card-icon"><Users size={24} /></div>
            <div className="card-info">
              <h3>Total Users</h3>
              <p>{stats.totalUsers || 0}</p>
            </div>
          </div>
          <div className="card">
            <div className="card-icon student-icon"><UserCheck size={24} /></div>
            <div className="card-info">
              <h3>Students</h3>
              <p>{stats.students || 0}</p>
            </div>
          </div>
          <div className="card">
            <div className="card-icon faculty-icon"><UserCog size={24} /></div>
            <div className="card-info">
              <h3>Faculty</h3>
              <p>{stats.faculty || 0}</p>
            </div>
          </div>
          <div className="card">
            <div className="card-icon announce-icon"><Megaphone size={24} /></div>
            <div className="card-info">
              <h3>Announcements</h3>
              <p>{stats.announcements || 0}</p>
            </div>
          </div>
        </div>

        {/*  QUICK ACTIONS */}
        <div className="actions-section">
          <button className="btn-primary" onClick={() => (window.location.href = "/admin/add-user")}>
            <PlusCircle size={20} /> Add New User
          </button>
        </div>

        {/*  MAIN CONTENT GRID */}
        <div className="main-grid">
          {/*  RECENT ACTIVITY */}
          <div className="panel">
            <div className="panel-header">
              <Activity size={20} className="panel-icon" />
              <h3>Recent Activity</h3>
            </div>
            <div className="panel-body">
              {activities.length > 0 ? activities.map((a, i) => (
                <div key={i} className="activity-item">
                  <div className={`activity-icon-badge ${a.type}`}>
                    {a.type === "announcement" ? <Megaphone size={16} /> : <Clock size={16} />}
                  </div>
                  <div className="activity-details">
                    <p>{a.title}</p>
                    <small>{new Date(a.time).toLocaleString()}</small>
                  </div>
                </div>
              )) : <p className="no-data">No recent activity</p>}
            </div>
          </div>

          {/*  RECENT USERS */}
          <div className="panel">
            <div className="panel-header">
              <Users size={20} className="panel-icon" />
              <h3>Newly Joined</h3>
            </div>
            <div className="panel-body">
              {users.length > 0 ? users.map((u) => (
                <div key={u._id} className="user-item">
                  <div className="user-meta">
                    <strong>{u.name}</strong>
                    <small>{u.email}</small>
                  </div>
                  <span className={`role-badge ${u.role}`}>{u.role}</span>
                </div>
              )) : <p className="no-data">No new users</p>}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default AdminDashboard;