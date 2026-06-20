import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { useState, useEffect } from "react";
import { Bell, Menu, X, Search } from "lucide-react";
import { API_URL } from "../config";

function Navbar() {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotif, setShowNotif] = useState(false);

  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearch(value);

    if (value.trim() === "") {
      setResults(null);
      return;
    }

    const res = await fetch(`${API_URL}/api/search?q=${value}`, {
      headers: {
        Authorization: ` Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await res.json();
    setResults(data);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_URL}/api/auth/profile`, {
          headers: {
            Authorization: ` Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchNotifications = async () => {
      try {
        const res = await fetch(`${API_URL}/api/notifications`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!res.ok) {
          setNotifications([]);
          return;
        }

        const data = await res.json();
        setNotifications(Array.isArray(data) ? data : []);
      } catch (err) {
        console.log(err);
        setNotifications([]);
      }
    };

    fetchUser();
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      await fetch(`${API_URL}/api/notifications/${id}/read`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
      );
    } catch (err) {
      console.log(err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch(`${API_URL}/api/notifications/read-all`
        , {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-content">
        {/* Left: Logo & Hamburger */}
        <div className="nav-left">
          <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </div>
          <div className="logo" onClick={() => navigate("/")}>
            CampusConnect
          </div>
        </div>

        {/* Center: Search (Hidden on Mobile) */}
        {role !== "admin" && (
          <div className="search-section">
            <div className="search-box">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={handleSearch}
              />
            </div>
            {results && (
              <div className="search-results">
                {results.announcements.map((a) => (
                  <div
                    key={a._id}
                    className="search-item"
                    onClick={() => {
                      navigate(`/announcement/${a._id}`);
                      setResults(null);
                      setSearch("");
                    }}
                  >
                    📢 {a.title}
                  </div>
                ))}
                {results.reminders.map((r) => (
                  <div
                    key={r._id}
                    className="search-item"
                    onClick={() => {
                      navigate(`/reminder/${r._id}`);
                      setResults(null);
                      setSearch("");
                    }}
                  >
                    ⏰ {r.title}
                  </div>
                ))}
                {results.announcements.length === 0 &&
                  results.reminders.length === 0 && (
                    <div className="search-item">No results found</div>
                  )}
              </div>
            )}
          </div>
        )}

        {/* Right: Links & Profile */}
        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          <Link
            to={
              role === "student"
                ? "/student"
                : role === "faculty"
                  ? "/faculty"
                  : "/admin"
            }
            onClick={() => setMenuOpen(false)}
          >
            Dashboard
          </Link>
          {role !== "admin" && (
            <Link to="/chat" onClick={() => setMenuOpen(false)}>
              Chat
            </Link>
          )}

          {role === "student" && (
            <>
              <Link to="/announcements" onClick={() => setMenuOpen(false)}>
                Announcements
              </Link>
              <Link to="/reminders" onClick={() => setMenuOpen(false)}>
                Reminders
              </Link>
            </>
          )}

          {role === "faculty" && (
            <>
              <Link to="/post-announcement" onClick={() => setMenuOpen(false)}>
                Post
              </Link>
              <Link
                to="/manage-announcements"
                onClick={() => setMenuOpen(false)}
              >
                Announcements
              </Link>
              <Link to="/manage-reminders" onClick={() => setMenuOpen(false)}>
                Reminders
              </Link>
            </>
          )}

          {role === "admin" && (
            <>
              <Link to="/admin/users" onClick={() => setMenuOpen(false)}>
                Manage Users
              </Link>
              <Link to="/admin/add-user" onClick={() => setMenuOpen(false)}>
                Add User
              </Link>
              <Link to="/admin/activity" onClick={() => setMenuOpen(false)}>
                Activity
              </Link>
            </>
          )}
        </div>

        <div className="nav-right-icons">
          {(role === "student" || role === "admin") && (
            <div className="notif-area">
              <div
                className="bell-icon"
                onClick={() => {
                  setShowNotif(!showNotif);
                  if (!showNotif) markAllAsRead();
                }}
              >
                <Bell size={22} />
                {notifications.filter((n) => !n.isRead).length > 0 && (
                  <span className="notif-badge">
                    {notifications.filter((n) => !n.isRead).length}
                  </span>
                )}
              </div>
              {showNotif && (
                <div className="notif-dropdown">
                  {notifications.length === 0 ? (
                    <p className="empty-notif">No notifications</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n._id}
                        className={`notif-item ${n.isRead ? "read" : "unread"}`}
                        onClick={() => {
                          markAsRead(n._id);
                          setShowNotif(false);
                        }}
                      >
                        {n.message}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          <div className="profile-area">
            {user && (
              <div className="profile-info" onClick={() => setOpen(!open)}>
                <img
                  src={
                    user.profilePhoto
                      ? `${API_URL}${user.profilePhoto}`
                      : "/default.png"
                  }
                  className="nav-profile"
                  alt="profile"
                />
                <span className="user-name-desktop">
                  {user.name.split(" ")[0]}
                </span>
              </div>
            )}
            {open && (
              <div className="dropdown-menu">
                <p className="profile-role-text">
                  {user?.role === "student"
                    ? `${user?.course} - Sem ${user?.semester}`
                    : `${user?.department} Dept`}
                </p>
                <hr />
                <div
                  className="dropdown-link"
                  onClick={() => {
                    navigate("/myprofile");
                    setOpen(false);
                  }}
                >
                  My Profile
                </div>
                <div
                  className="dropdown-link"
                  onClick={() => {
                    navigate("/change-password");
                    setOpen(false);
                  }}
                >
                  Change Password
                </div>
                <div className="dropdown-link logout" onClick={handleLogout}>
                  Logout
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
