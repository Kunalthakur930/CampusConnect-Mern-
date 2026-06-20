import { useEffect, useState } from "react";
import Layout from "../../Layout";
import "./AdminActivity.css";
import { Activity, Megaphone, Clock, Paperclip, Calendar, User } from "lucide-react";

function AdminActivity() {
  const [activities, setActivities] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchActivity();
  }, []);

  const fetchActivity = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/activity", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setActivities(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const filteredData = activities.filter((a) => {
    if (filter === "all") return true;
    return a.type === filter;
  });

  return (
    <Layout>
      <div className="activity-page">
        <div className="activity-header">
          <div className="header-title">
            <Activity className="icon-main" size={30} />
            <div>
              <h1>System Activity Logs</h1>
              <p>Monitor all announcements and reminders posted on the platform</p>
            </div>
          </div>

          <div className="filter-bar">
            <button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>All Logs</button>
            <button className={filter === "announcement" ? "active" : ""} onClick={() => setFilter("announcement")}>
              <Megaphone size={16} /> Announcements
            </button>
            <button className={filter === "reminder" ? "active" : ""} onClick={() => setFilter("reminder")}>
              <Clock size={16} /> Reminders
            </button>
          </div>
        </div>

        <div className="activity-list">
          {filteredData.length > 0 ? (
            filteredData.map((a, i) => (
              <div key={i} className={`activity-card ${a.type}`}>
                <div className="card-left">
                   <div className="type-icon">
                      {a.type === "announcement" ? <Megaphone size={20} /> : <Clock size={20} />}
                   </div>
                </div>
                
                <div className="card-right">
                  <div className="card-header">
                    <h3>{a.title}</h3>
                    <span className={`status-badge ${a.type}`}>{a.type}</span>
                  </div>
                  
                  <p className="activity-content">{a.content}</p>

                  {a.attachment && (
                    <a href={`http://localhost:5000${a.attachment}`} target="_blank" rel="noreferrer" className="attachment-link">
                      <Paperclip size={14} /> View Attached File
                    </a>
                  )}

                  <div className="activity-meta">
                    <span><User size={14} /> {a.user}</span>
                    <span><Calendar size={14} /> {new Date(a.time).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-activity">
              <Activity size={48} />
              <p>No activity found for this category.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default AdminActivity;