import { useState } from "react";
import Layout from "../../Layout";
import "./AddUser.css";
import { API_URL } from "../../../config";
import {
  UserPlus,
  User,
  Mail,
  Lock,
  Phone,
  Image as ImageIcon,
  GraduationCap,
  Briefcase,
} from "lucide-react";

function AddUser() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    mobile: "",
    enrollmentNo: "",
    course: "",
    stdclass: "",
    semester: "",
    section: "",
    department: "",
    designation: "",
    employeeId: "",
    profilePhoto: null,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, profilePhoto: e.target.files[0] });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password || !form.mobile) {
      alert("Name, Email, Password, Mobile are required");
      return;
    }
    // (Validation logic remains same...)
    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        if (key === "stdclass" || key === "department") {
          formData.append(key, form[key].toUpperCase());
        } else {
          formData.append(key, form[key]);
        }
      });

      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        alert(
          `User added successfully!\n\nEmail: ${form.email}\nPassword: ${form.password}`,
        );
        setForm({
          /* Reset all fields... */
        });
      } else {
        alert(data.message || "Error adding user");
      }
    } catch (err) {
      console.log(err);
      alert("Server error");
    }
  };

  return (
    <Layout>
      <div className="add-user-page">
        <div className="form-header">
          <UserPlus size={32} className="header-icon" />
          <h1>Create New Account</h1>
          <p>Register a new student or faculty member to the system</p>
        </div>

        <div className="add-user-card">
          <div className="form-section">
            <h3>
              <User size={18} /> Basic Information
            </h3>
            <div className="form-grid">
              <div className="input-group">
                <label>Full Name</label>
                <input
                  name="name"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>
              <div className="input-group">
                <label>Email Address</label>
                <input
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>
              <div className="input-group">
                <label>Password</label>
                <input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                />
              </div>
              <div className="input-group">
                <label>Mobile Number</label>
                <input
                  name="mobile"
                  placeholder="+91 0000000000"
                  value={form.mobile}
                  onChange={handleChange}
                />
              </div>
              <div className="input-group">
                <label>Select Role</label>
                <select name="role" value={form.role} onChange={handleChange}>
                  <option value="student">Student</option>
                  <option value="faculty">Faculty</option>
                </select>
              </div>
              <div className="input-group">
                <label>Profile Photo</label>
                <div className="file-upload">
                  <input type="file" id="file" onChange={handleFileChange} />
                  <label htmlFor="file" className="file-label">
                    <ImageIcon size={16} />{" "}
                    {form.profilePhoto
                      ? form.profilePhoto.name
                      : "Choose Photo"}
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="form-section role-specific">
            {form.role === "student" ? (
              <>
                <h3>
                  <GraduationCap size={18} /> Student Details
                </h3>
                <div className="form-grid">
                  <input
                    name="course"
                    placeholder="Course (e.g. B.Tech)"
                    value={form.course}
                    onChange={handleChange}
                  />
                  <input
                    name="stdclass"
                    placeholder="Class (e.g. CS)"
                    value={form.stdclass}
                    onChange={handleChange}
                  />
                  <input
                    name="semester"
                    placeholder="Semester"
                    value={form.semester}
                    onChange={handleChange}
                  />
                  <input
                    name="section"
                    placeholder="Section"
                    value={form.section}
                    onChange={handleChange}
                  />
                  <input
                    name="enrollmentNo"
                    placeholder="Enrollment No"
                    value={form.enrollmentNo}
                    onChange={handleChange}
                  />
                </div>
              </>
            ) : (
              <>
                <h3>
                  <Briefcase size={18} /> Faculty Details
                </h3>
                <div className="form-grid">
                  <input
                    name="employeeId"
                    placeholder="Employee ID"
                    value={form.employeeId}
                    onChange={handleChange}
                  />
                  <input
                    name="department"
                    placeholder="Department"
                    value={form.department}
                    onChange={handleChange}
                  />
                  <input
                    name="designation"
                    placeholder="Designation"
                    value={form.designation}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}
          </div>

          <button className="submit-btn" onClick={handleSubmit}>
            Register User
          </button>
        </div>
      </div>
    </Layout>
  );
}

export default AddUser;
