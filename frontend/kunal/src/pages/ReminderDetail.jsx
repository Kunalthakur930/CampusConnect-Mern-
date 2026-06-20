import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import "./ReminderDetail.css";
import { ArrowLeft, Clock, Calendar, User, Info, CheckCircle2 } from "lucide-react";

function ReminderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchReminder = async () => {
      const res = await fetch(`http://localhost:5000/api/reminders/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const result = await res.json();
      setData(result);
    };
    fetchReminder();
  }, [id]);

  if (!data) {
    return (
      <Layout>
        <div className="rem-detail-loader">
          <div className="spinner"></div>
          <p>Loading Task Details...</p>
        </div>
      </Layout>
    );
  }

  // Logic to check if overdue
  const isOverdue = new Date(data.dueDate) < new Date();

  return (
    <Layout>
      <div className="reminder-detail-wrapper">
        <button className="back-link" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} /> <span>Back</span>
        </button>

        <div className="reminder-detail-card">
          <div className="card-header-section">
            <div className={`status-pill ${isOverdue ? "overdue" : "pending"}`}>
              {isOverdue ? "Overdue" : "In Progress"}
            </div>
            <h1 className="reminder-title-main">{data.title}</h1>
          </div>

          <div className="reminder-content">
            <div className="info-grid">
              <div className="info-box">
                <Calendar className="icon-purple" size={20} />
                <div>
                  <label>Due Date</label>
                  <p>{new Date(data.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
              </div>
              <div className="info-box">
                <Clock className="icon-purple" size={20} />
                <div>
                  <label>Due Time</label>
                  <p>{new Date(data.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
              <div className="info-box">
                <User className="icon-purple" size={20} />
                <div>
                  <label>Assigned By</label>
                  <p>{data.createdBy?.name || "Faculty Member"}</p>
                </div>
              </div>
            </div>

            <div className="description-section">
              <h3><Info size={18} /> Description</h3>
              <p>{data.description}</p>
            </div>

            <div className="completion-tip">
              <CheckCircle2 size={20} />
              <p>Make sure to complete this task before the deadline to stay on track.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ReminderDetail;