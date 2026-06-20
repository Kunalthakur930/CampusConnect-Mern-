import { useState } from "react";
import Layout from "../components/Layout";
import "./ChangePassword.css";
import { Lock, ShieldCheck, KeyRound } from "lucide-react";
import { API_URL } from "../config";

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("New password do not match");
      return;
    }
    const res = await fetch(`${API_URL}/api/auth/change-password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ oldPassword, newPassword }),
    });

    const data = await res.json();
    alert(data.message);
  };

  return (
    <Layout>
      <div className="security-page">
        <div className="security-card">
          <div className="security-header">
            <div className="lock-icon">
              <ShieldCheck size={40} />
            </div>
            <h2>Update Password</h2>
            <p>
              Ensure your account is using a long, random password to stay
              secure.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="security-form">
            <div className="input-group">
              <label>
                <Lock size={14} /> Current Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                required
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label>
                <KeyRound size={14} /> New Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                required
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label>
                <KeyRound size={14} /> Confirm New Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                required
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="update-btn">
              Update Password
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default ChangePassword;
