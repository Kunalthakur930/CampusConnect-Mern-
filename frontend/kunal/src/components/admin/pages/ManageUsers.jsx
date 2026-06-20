import { useEffect, useState } from "react";
import Layout from "../../Layout";
import "./ManageUsers.css";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [filterRole, setFilterRole] = useState("all");
  const [filterValue, setFilterValue] = useState("all");
  const [search, setSearch] = useState("");
  const [editUser, setEditUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await fetch("http://localhost:5000/api/admin/users", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await res.json();
    setUsers(Array.isArray(data) ? data : []);
  };

  //  DELETE
  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    await fetch(`http://localhost:5000/api/admin/users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    setUsers((prev) => prev.filter((u) => u._id !== id));
  };
  // Update User
  const updateUser = async () => {
    try {
      const formData = new FormData();

      
      Object.keys(editUser).forEach((key) => {
        if (editUser[key]) {
          formData.append(key, editUser[key]);
        }
      });

      const res = await fetch(
        `http://localhost:5000/api/admin/users/${editUser._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, 
          },
          body: formData, // 
        },
      );

      if (res.ok) {
        alert("Updated!");
        setEditUser(null);
        fetchUsers();
      } else {
        const data = await res.json();
        alert(data.message || "Update failed");
      }
    } catch (err) {
      console.log(err);
      alert("Server error");
    }
  };

  //  FILTER + SEARCH
  const filtered = users.filter((u) => {
    // role filter
    if (filterRole !== "all" && u.role !== filterRole) return false;

    //  STUDENT FILTER
    if (
      filterRole === "student" &&
      filterValue !== "all" &&
      u.stdclass?.toLowerCase() !== filterValue.toLowerCase()
    ) {
      return false;
    }

    //  FACULTY FILTER
    if (
      filterRole === "faculty" &&
      filterValue !== "all" &&
      u.department?.toLowerCase() !== filterValue.toLowerCase()
    ) {
      return false;
    }

    //  SEARCH
    const s = search.toLowerCase();

    return (
      u.name?.toLowerCase().includes(s) ||
      u.email?.toLowerCase().includes(s) ||
      u.enrollmentNo?.toLowerCase().includes(s) ||
      u.mobile?.toLowerCase().includes(s)
    );
  });

  return (
    <Layout>
      <div className="admin-container">
        <header className="dashboard-header">
          <h1>Manage Users</h1>
          <p>Search, filter, and edit student/faculty records</p>
        </header>

        {/*  SEARCH + FILTER */}
        <div className="top-bar">
          <input
            type="text"
            placeholder="Search by name, email or enrollment..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="student">Students</option>
            <option value="faculty">Faculty</option>
          </select>

          {filterRole === "student" && (
            <select onChange={(e) => setFilterValue(e.target.value)}>
              <option value="all">All Classes</option>
              <option value="CS">CS</option>
              <option value="CI">CI</option>
              <option value="EC">EC</option>
              <option value="Civil">Civil</option>
              <option value="Mechanical">Mechanical</option>
            </select>
          )}

          {filterRole === "faculty" && (
            <select onChange={(e) => setFilterValue(e.target.value)}>
              <option value="all">All Departments</option>
              <option value="CS">CS</option>
              <option value="CI">CI</option>
              <option value="EC">EC</option>
              <option value="Civil">Civil</option>
              <option value="Mechanical">Mechanical</option>
            </select>
          )}
        </div>

        {/*  USERS GRID */}
        <div className="card-grid">
          {filtered.length > 0 ? (
            filtered.map((u) => (
              <div key={u._id} className="user-card">
                <img
                  src={
                    u.profilePhoto
                      ? `http://localhost:5000${u.profilePhoto}`
                      : "/default.png"
                  }
                  alt="profile"
                  className="profile-img"
                />
                <h3>{u.name}</h3>
                <div className="user-details">
                  <p>
                    <span>Email:</span> <span>{u.email}</span>
                  </p>
                  <p>
                    <span>Mobile:</span> <span>{u.mobile || "-"}</span>
                  </p>

                  {u.role === "student" && (
                    <>
                      <p>
                        <span>Class:</span> <span>{u.stdclass}</span>
                      </p>
                      <p>
                        <span>Semester:</span> <span>{u.semester}</span>
                      </p>
                      <p>
                        <span>Enrollment:</span> <span>{u.enrollmentNo}</span>
                      </p>
                    </>
                  )}

                  {u.role === "faculty" && (
                    <>
                      <p>
                        <span>Dept:</span> <span>{u.department}</span>
                      </p>
                      <p>
                        <span>Designation:</span> <span>{u.designation}</span>
                      </p>
                    </>
                  )}
                </div>

                <span className={`role ${u.role}`}>{u.role}</span>

                <div className="actions">
                  <button onClick={() => setEditUser(u)}>Edit</button>
                  <button onClick={() => deleteUser(u._id)}>Delete</button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-data">No users found matching your search.</div>
          )}
        </div>

        {/* ✏️ EDIT MODAL */}
        {editUser && (
          <div className="modal">
            <div className="modal-box">
              <h3>Update {editUser.role} Profile</h3>

              <label>Name</label>
              <input
                value={editUser.name}
                onChange={(e) =>
                  setEditUser({ ...editUser, name: e.target.value })
                }
              />

              <label>Profile Photo</label>
              <input
                type="file"
                onChange={(e) =>
                  setEditUser({ ...editUser, profilePhoto: e.target.files[0] })
                }
              />

              <label>Email</label>
              <input
                value={editUser.email}
                onChange={(e) =>
                  setEditUser({ ...editUser, email: e.target.value })
                }
              />

              <label>Mobile</label>
              <input
                value={editUser.mobile}
                onChange={(e) =>
                  setEditUser({ ...editUser, mobile: e.target.value })
                }
              />

              {editUser.role === "student" && (
                <>
                <label>Course</label>
                  <input
                    value={editUser.course || ""}
                    placeholder="Course"
                    onChange={(e) =>
                      setEditUser({ ...editUser, course: e.target.value })
                    }
                  />
                  <label>Class</label>
                  <input
                    value={editUser.stdclass || ""}
                    placeholder="Class"
                    onChange={(e) =>
                      setEditUser({ ...editUser, stdclass: e.target.value })
                    }
                  />
                  <label>Semester</label>
                  <input
                    value={editUser.semester || ""}
                    placeholder="Semester"
                    onChange={(e) =>
                      setEditUser({ ...editUser, semester: e.target.value })
                    }
                  />
                </>
              )}

              {editUser.role === "faculty" && (
                <>
                <label>Department</label>
                  <input
                    value={editUser.department || ""}
                    placeholder="Department"
                    onChange={(e) =>
                      setEditUser({ ...editUser, department: e.target.value })
                    }
                  />
                  <label>Designation</label>
                  <input
                    value={editUser.designation || ""}
                    placeholder="Designation"
                    onChange={(e) =>
                      setEditUser({ ...editUser, designation: e.target.value })
                    }
                  />
                </>
              )}

              <div className="modal-actions">
                <button onClick={updateUser}>Save Changes</button>
                <button onClick={() => setEditUser(null)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default ManageUsers;
