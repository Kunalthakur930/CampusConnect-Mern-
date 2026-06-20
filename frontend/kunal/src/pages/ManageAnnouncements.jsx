import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import "./ManageAnnouncements.css";
import {
  Megaphone,
  Trash2,
  Edit3,
  Paperclip,
  X,
  CheckCircle,
} from "lucide-react";
import { API_URL } from "../config";
function ManageAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editFile, setEditFile] = useState(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      const res = await fetch(`${API_URL}/api/announcements`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();
      const myId = JSON.parse(
        atob(localStorage.getItem("token").split(".")[1]),
      ).id;

      const myAnnouncements = data.filter(
        (a) => a.postedBy?._id === myId || a.postedBy === myId,
      );

      setAnnouncements(myAnnouncements);
      setLoading(false);
    };

    fetchAnnouncements();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this announcement?")) return;
    await fetch(`${API_URL}/api/announcements/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setAnnouncements((prev) => prev.filter((a) => a._id !== id));
  };

  const handleUpdate = async (id) => {
    const formData = new FormData();
    formData.append("title", editTitle);
    formData.append("content", editContent);
    if (editFile) formData.append("attachment", editFile);

    await fetch(`${API_URL}/api/announcements/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      body: formData,
    });

    setAnnouncements((prev) =>
      prev.map((a) =>
        a._id === id ? { ...a, title: editTitle, content: editContent } : a,
      ),
    );
    setEditingId(null);
    setEditFile(null);
  };

  if (loading)
    return (
      <Layout>
        <div className="loader-container">
          <div className="spinner"></div>
          <p>Loading Announcements...</p>
        </div>
      </Layout>
    );

  return (
    <Layout>
      <div className="manage-ann-page">
        <div className="page-header">
          <Megaphone className="header-icon" size={32} />
          <div>
            <h1>Manage my announcements</h1>
            <p>Edit or delete information you've shared with the students</p>
          </div>
        </div>

        {announcements.length === 0 ? (
          <div className="empty-state">
            <Megaphone size={48} />
            <p>You haven't posted any announcements yet.</p>
          </div>
        ) : (
          <div className="ann-list-grid">
            {announcements.map((a) => (
              <div
                key={a._id}
                className={`ann-card ${editingId === a._id ? "editing" : ""}`}
              >
                {editingId === a._id ? (
                  /* --- EDIT MODE --- */
                  <div className="edit-mode-form">
                    <h3>Edit Post</h3>
                    <input
                      className="edit-input"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Announcement Title"
                    />
                    <textarea
                      className="edit-textarea"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      placeholder="Write your message here..."
                    />
                    <div className="file-edit-group">
                      <label htmlFor="file-edit" className="file-edit-label">
                        <Paperclip size={16} /> Update Attachment
                      </label>
                      <input
                        id="file-edit"
                        type="file"
                        onChange={(e) => setEditFile(e.target.files[0])}
                      />
                      {editFile && (
                        <span className="file-name-hint">{editFile.name}</span>
                      )}
                    </div>
                    <div className="edit-actions">
                      <button
                        className="save-btn"
                        onClick={() => handleUpdate(a._id)}
                      >
                        <CheckCircle size={18} /> Update
                      </button>
                      <button
                        className="cancel-btn"
                        onClick={() => setEditingId(null)}
                      >
                        <X size={18} /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  /* --- VIEW MODE --- */
                  <>
                    <div className="ann-card-body">
                      <h3>{a.title}</h3>
                      <p>{a.content}</p>
                      {a.attachment && (
                        <a
                          href={`${API_URL}${a.attachment}`}
                          target="_blank"
                          rel="noreferrer"
                          className="view-attach"
                        >
                          <Paperclip size={14} /> View File
                        </a>
                      )}
                    </div>
                    <div className="ann-card-footer">
                      <button
                        className="icon-btn edit"
                        onClick={() => {
                          setEditingId(a._id);
                          setEditTitle(a.title);
                          setEditContent(a.content);
                        }}
                      >
                        <Edit3 size={18} /> Edit
                      </button>
                      <button
                        className="icon-btn delete"
                        onClick={() => handleDelete(a._id)}
                      >
                        <Trash2 size={18} /> Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default ManageAnnouncements;
