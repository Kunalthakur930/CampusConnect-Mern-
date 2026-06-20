import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import "./MyProfile.css";
import { API_URL } from "../config";
import {
  User,
  Mail,
  Phone,
  BookOpen,
  Building,
  ShieldCheck,
  Save,
} from "lucide-react";

function Profile() {
  const [formData, setFormData] = useState({});
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetch(fetch(`${API_URL}/api/auth/profile`), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setFormData(data);
    };
    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(fetch(`${API_URL}/api/auth/profile`), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });
    alert("Profile Updated ✅");
  };

  return (
    <Layout>
      <div className="profile-page">
        <div className="profile-header">
          <h1>Account Settings</h1>
          <p>Manage your personal information and preferences</p>
        </div>

        <div className="profile-content-grid">
          {/* Left Side: Profile Card */}
          <div className="profile-sidebar">
            <div className="avatar-section">
              <img
                src={
                  formData.profilePhoto
                    ? `${API_URL}${formData.profilePhoto}`
                    : "/default.png"
                }
                alt="Profile"
              />
              <h3>{formData.name}</h3>
              <span className="badge-role">{formData.role}</span>
            </div>
            <div className="sidebar-info">
              <div className="info-item">
                <Mail size={16} /> <span>{formData.email}</span>
              </div>
              <div className="info-item">
                <ShieldCheck size={16} />{" "}
                <span>Verified {formData.role} Account</span>
              </div>
            </div>
          </div>

          {/* Right Side: Edit Form */}
          <div className="profile-form-container">
            <form onSubmit={handleSubmit}>
              <div className="form-section">
                <h3>
                  <User size={18} /> Personal Details
                </h3>
                <div className="input-grid">
                  <div className="field">
                    <label>Full Name</label>
                    <input
                      name="name"
                      value={formData.name || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="field">
                    <label>Mobile Number</label>
                    <input
                      name="mobile"
                      value={formData.mobile || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="field">
                    <label>Email Address (Disabled)</label>
                    <input
                      name="email"
                      value={formData.email || ""}
                      disabled
                      className="disabled-input"
                    />
                  </div>
                </div>
              </div>

              {formData.role === "student" && (
                <div className="form-section">
                  <h3>
                    <BookOpen size={18} /> Academic Details
                  </h3>
                  <div className="input-grid">
                    <div className="field">
                      <label>Course</label>
                      <input
                        name="course"
                        value={formData.course || ""}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="field">
                      <label>Class</label>
                      <input
                        name="stdclass"
                        value={formData.stdclass || ""}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="field">
                      <label>Semester</label>
                      <input
                        name="semester"
                        value={formData.semester || ""}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="field">
                      <label>Section</label>
                      <input
                        name="section"
                        value={formData.section || ""}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="field">
                      <label>Enrollment (Disabled)</label>
                      <input
                        value={formData.enrollmentNo || ""}
                        disabled
                        className="disabled-input"
                      />
                    </div>
                  </div>
                </div>
              )}

              {formData.role === "faculty" && (
                <div className="form-section">
                  <h3>
                    <Building size={18} /> Professional Details
                  </h3>
                  <div className="input-grid">
                    <div className="field">
                      <label>Department</label>
                      <input
                        name="department"
                        value={formData.department || ""}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="field">
                      <label>Designation</label>
                      <input
                        name="designation"
                        value={formData.designation || ""}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="field">
                      <label>Employee ID (Disabled)</label>
                      <input
                        value={formData.employeeId || ""}
                        disabled
                        className="disabled-input"
                      />
                    </div>
                  </div>
                </div>
              )}

              <button type="submit" className="save-btn">
                <Save size={18} /> Save Profile
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Profile;
