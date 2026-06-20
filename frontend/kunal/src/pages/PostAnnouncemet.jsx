import { useState, useRef } from "react";
import Layout from "../components/Layout";
import "./PostAnnouncement.css";
import { Send, Type, FileText, Upload, AlertCircle, CheckCircle2 } from "lucide-react";
import { API_URL } from "../config";
function PostAnnouncement() {
  const [form, setForm] = useState({
    title: "",
    content: "",
    targetRole: "all"
  });

  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const fileRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("content", form.content);
    formData.append("targetRole", form.targetRole);

    if (file) {
      formData.append("attachment", file);
    }

    try {
      const res = await fetch(`${API_URL}/api/announcements`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Announcement posted successfully!");
        setForm({ title: "", content: "", targetRole: "all" });
        setFile(null);
        fileRef.current.value = "";
        setTimeout(() => setMessage(""), 5000); // Hide message after 5s
      } else {
        setMessage("❌ " + data.message);
      }
    } catch (err) {
      console.log(err);
      setMessage("❌ Server error");
    }
  };

  return (
    <Layout>
      <div className="post-ann-container">
        <div className="form-wrapper">
          <div className="form-header">
            <Send className="header-icon" size={28} />
            <h1>Create Announcement</h1>
            <p>Broadcast important information to students and staff</p>
          </div>

          <form onSubmit={handleSubmit} className="post-ann-form">
            <div className="input-group">
              <label><Type size={16} /> Title</label>
              <input
                placeholder="What is this announcement about?"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>

            <div className="input-group">
              <label><FileText size={16} /> Description</label>
              <textarea
                placeholder="Provide details about the announcement..."
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                required
              />
            </div>

            <div className="input-group">
              <label><Upload size={16} /> Attachment (Optional)</label>
              <div className="custom-file-upload">
                <input
                  type="file"
                  id="file-upload"
                  ref={fileRef}
                  onChange={(e) => setFile(e.target.files[0])}
                />
                <label htmlFor="file-upload" className="file-box">
                  <Upload size={24} />
                  <span>{file ? file.name : "Click to upload or drag a file"}</span>
                  <small>PDF, Images, or Documents (Max 5MB)</small>
                </label>
              </div>
            </div>

            <button type="submit" className="submit-btn">
              <Send size={18} /> Post Announcement
            </button>
          </form>

          {message && (
            <div className={`status-message ${message.includes("✅") ? "success" : "error"}`}>
              {message.includes("✅") ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              {message}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default PostAnnouncement;