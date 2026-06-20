import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import "./AnnouncementDetail.css";
import { ArrowLeft, Calendar, FileText, Download, Loader2, Image as ImageIcon } from "lucide-react";
import { API_URL } from "../config";

function AnnouncementDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_URL}/api/announcements/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const result = await res.json();
        setAnnouncement(result);
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    };
    fetchData();
  }, [id]);

  if (loading) return (
    <Layout>
      <div className="loader-box"><Loader2 className="spinner" size={40} /><p>Loading Announcement...</p></div>
    </Layout>
  );

  if (!announcement) return (
    <Layout>
      <div className="error-box"><h2>Announcement not found</h2><button onClick={() => navigate(-1)}>Go Back</button></div>
    </Layout>
  );

  return (
    <Layout>
      <div className="detail-wrapper">
        <button className="back-btn-modern" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} /> <span>Back to Feed</span>
        </button>

        <article className="ann-detail-card">
          <header className="ann-detail-header">
            <h1 className="ann-title-main">{announcement.title}</h1>
            <div className="ann-meta-strip">
              <div className="meta-item">
                <Calendar size={14} />
                <span>
                  {new Date(announcement.createdAt).toLocaleString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="meta-item">
                <FileText size={14} />
                <span>Notice ID: {announcement._id.slice(-6)}</span>
              </div>
            </div>
          </header>

          <div className="ann-content-body">
            <p>{announcement.content}</p>
          </div>

          {announcement.attachment && (
            <div className="ann-attachment-section">
              <div className="attach-header">
                <ImageIcon size={18} />
                <h4>Attached Document / Image</h4>
              </div>

              {announcement.attachment.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                <div className="image-preview-wrapper">
                  <img
                    src={`${API_URL}${announcement.attachment}`}
                    alt="attachment"
                    className="ann-image-preview"
                  />
                  <a
                    href={`${API_URL}${announcement.attachment}`}
                    target="_blank"
                    rel="noreferrer"
                    className="overlay-dl"
                  >
                    <Download size={20} /> View Full Image
                  </a>
                </div>
              ) : (
                <a
                  href={`${API_URL}${announcement.attachment}`}
                  target="_blank"
                  rel="noreferrer"
                  className="modern-dl-btn"
                >
                  <Download size={18} /> Download Attachment
                </a>
              )}
            </div>
          )}
        </article>
      </div>
    </Layout>
  );
}

export default AnnouncementDetail;