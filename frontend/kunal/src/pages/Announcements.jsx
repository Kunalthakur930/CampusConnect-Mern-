import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import "./Announcements.css";
import { Megaphone, Paperclip, Calendar, User, Info, Loader2 } from "lucide-react";

function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/announcements", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await response.json();
        setAnnouncements(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  return (
    <Layout>
      <div className="ann-page-container">
        <header className="ann-header">
          <div className="title-box">
            <Megaphone className="header-icon" size={32} />
            <div>
              <h1>College Announcements</h1>
              <p>Stay updated with the latest news and notices</p>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="loading-state">
            <Loader2 className="spinner" size={40} />
            <p>Fetching latest notices...</p>
          </div>
        ) : announcements.length === 0 ? (
          <div className="empty-state">
            <Info size={48} />
            <p>No announcements found.</p>
          </div>
        ) : (
          <div className="ann-grid">
            {announcements.map((item) => (
              <div key={item._id} className="ann-card">
                <div className="ann-card-content">
                  <h3>{item.title}</h3>
                  <p>{item.content}</p>

                  {item.attachment && (
                    <a
                      href={`http://localhost:5000${item.attachment}`}
                      target="_blank"
                      rel="noreferrer"
                      className="download-btn"
                    >
                      <Paperclip size={16} /> View Attachment
                    </a>
                  )}
                </div>

                <div className="ann-card-footer">
                  <div className="meta">
                    <User size={14} />
                    <span>{item.postedBy?.name || item.postedBy?.email.split('@')[0]}</span>
                  </div>
                  <div className="meta">
                    <Calendar size={14} />
                    <span>{new Date(item.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
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

export default Announcements;