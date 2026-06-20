import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import "./Reminders.css";
import { Clock, Calendar, User, BellRing, Inbox } from "lucide-react";

function Reminders() {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/reminders", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        const sorted = data.sort((a, b) => b._id.localeCompare(a._id));
        setReminders(sorted);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchReminders();
  }, []);

  return (
    <Layout>
      <div className="reminders-page">
        <div className="reminders-header">
          <div className="title-section">
            <BellRing className="header-icon" size={32} />
            <div>
              <h1>Important Reminders</h1>
              <p>Keep track of upcoming deadlines and tasks</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Fetching reminders...</p>
          </div>
        ) : reminders.length === 0 ? (
          <div className="empty-reminders">
            <Inbox size={48} />
            <p>No reminders available at the moment.</p>
          </div>
        ) : (
          <div className="reminders-grid">
            {reminders.map((item) => (
              <div key={item._id} className="reminder-card">
                <div className="card-accent"></div>
                <div className="card-content">
                  <div className="card-top">
                    <h3>{item.title}</h3>
                    <div className="due-badge">
                      <Clock size={14} />
                      <span>Due Soon</span>
                    </div>
                  </div>
                  
                  <p className="description">{item.description}</p>

                  <div className="card-footer">
                    <div className="meta-info">
                      <Calendar size={14} />
                      <span>Due: {new Date(item.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                    <div className="meta-info">
                      <User size={14} />
                      <span>{item.createdBy?.name || item.createdBy?.email.split('@')[0]}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Reminders;