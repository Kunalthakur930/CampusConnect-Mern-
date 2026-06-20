import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { Mail, Lock, LogIn, Sparkles } from "lucide-react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);

        if (data.role === "student") navigate("/student");
        else if (data.role === "faculty") navigate("/faculty");
        else if (data.role === "admin") navigate("/admin");
      } else {
        alert("Login Failed: " + (data.message || "Invalid Credentials"));
      }
    } catch (error) {
      console.log("Error:", error);
      alert("Server error, please try again later.");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-visuals">
        <div className="glow-sphere"></div>
      </div>
      
      <div className="login-card">
        <div className="login-header">
          <div className="logo-icon">
            <Sparkles size={32} />
          </div>
          <h1>Virtual Assistant</h1>
          <p>Login to access your academic portal</p>
        </div>

        <div className="login-form">
          <div className="input-field">
            <label><Mail size={16} /> Email Address</label>
            <input
              type="email"
              placeholder="name@college.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-field">
            <label><Lock size={16} /> Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="login-btn" onClick={handleLogin}>
            <span>Sign In</span>
            <LogIn size={20} />
          </button>
        </div>

        <div className="login-footer">
          <p>Secure Academic Gateway v3.0</p>
        </div>
      </div>
    </div>
  );
}

export default Login;