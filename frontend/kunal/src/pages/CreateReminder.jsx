import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import "./CreateReminder.css";
import { BellPlus, Calendar, Type, FileText, Trash2, Edit, X, Save } from "lucide-react";

function CreateReminder() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [reminders, setReminders] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const token = localStorage.getItem("token");

  const fetchReminders = async () => {
    const res = await fetch("http://localhost:5000/api/reminders", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setReminders(data);
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingId ? `http://localhost:5000/api/reminders/${editingId}` : "http://localhost:5000/api/reminders";
    const method = editingId ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, description, dueDate }),
    });

    handleReset();
    fetchReminders();
  };

  const handleReset = () => {
    setTitle("");
    setDescription("");
    setDueDate("");
    setEditingId(null);
  };

  const deleteReminder = async (id) => {
    if (!window.confirm("Delete this reminder?")) return;
    await fetch(`http://localhost:5000/api/reminders/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchReminders();
  };

  return (
    <Layout>
      <div className="create-rem-page">
        <header className="page-header">
          <BellPlus size={32} className="header-icon" />
          <div>
            <h1>{editingId ? "Update Reminder" : "Set New Reminder"}</h1>
            <p>Schedule important deadlines for your students</p>
          </div>
        </header>

        <div className="reminder-grid-layout">
          {/* --- LEFT: FORM SECTION --- */}
          <div className="form-section-card">
            <form onSubmit={handleSubmit} className="rem-form">
              <div className="input-field">
                <label><Type size={16} /> Reminder Title</label>
                <input
                  placeholder="e.g. Assignment Submission"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="input-field">
                <label><FileText size={16} /> Description</label>
                <textarea
                  placeholder="Add details about the task..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="input-field">
                <label><Calendar size={16} /> Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-btns">
                <button type="submit" className="primary-btn">
                  {editingId ? <><Save size={18} /> Update</> : <><BellPlus size={18} /> Create</>}
                </button>
                {editingId && (
                  <button type="button" className="cancel-btn" onClick={handleReset}>
                    <X size={18} /> Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* --- RIGHT: LIST SECTION --- */}
          <div className="list-section">
            <h3>Manage Existing Reminders</h3>
            <div className="scrollable-list">
              {reminders.length === 0 ? (
                <p className="no-data">No reminders set yet.</p>
              ) : (
                reminders.map((r) => (
                  <div key={r._id} className="rem-item-card">
                    <div className="item-info">
                      <h4>{r.title}</h4>
                      <p>{r.description}</p>
                      <span className="date-tag">
                        <Calendar size={12} /> {new Date(r.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="item-actions">
                      <button className="edit-mini" onClick={() => {
                        setTitle(r.title);
                        setDescription(r.description);
                        setDueDate(r.dueDate.split("T")[0]);
                        setEditingId(r._id);
                      }}><Edit size={16} /></button>
                      <button className="delete-mini" onClick={() => deleteReminder(r._id)}><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default CreateReminder;