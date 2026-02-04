
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { ThemeContext } from "../ThemeSettings/ThemeContext";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "publisher",
    
  });
  const [editUserId, setEditUserId] = useState(null);

  const { theme } = useContext(ThemeContext);
  const token = JSON.parse(localStorage.getItem("jwt"))?.token;

  useEffect(() => {
    fetchUsers();
    fetchBlockedUsers();
  }, []);

  /* ✅ Fetch All Users */
  const fetchUsers = async () => {
    try {
      const res = await axios.get("https://imediareports.onrender.com/api/getallusers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  /* ✅ Fetch Blocked Users */
  const fetchBlockedUsers = async () => {
    try {
      const res = await axios.get("https://imediareports.onrender.com/api/blocked-users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBlockedUsers(res.data.blockedUsers || []);
    } catch (err) {
      console.error("Error fetching blocked users:", err);
    }
  };

  /* ✅ Check If Blocked */
  const isUserBlocked = (name) => {
    return blockedUsers.some((u) => u.username === name && u.blocked === true);
  };

  /* ✅ Block User */
  const handleBlock = async (name) => {
    try {
      await axios.post(
        `https://imediareports.onrender.com/api/block-user/${name}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchBlockedUsers();
      alert(`${name} is Blocked`);
    } catch (err) {
      console.error(err);
    }
  };

  /* ✅ Unblock User */
  const handleUnblock = async (name) => {
    try {
      await axios.post(
        `https://imediareports.onrender.com/api/unblock-user/${name}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchBlockedUsers();
      alert(`${name} is Unblocked`);
    } catch (err) {
      console.error(err);
    }
  };

  /* ✅ Existing form logic untouched */
 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    if (editUserId) {
      await axios.put(
        `https://imediareports.onrender.com/api/updateusers/${editUserId}`,
        formData,
        config
      );
    } else {
      await axios.post(
        "https://imediareports.onrender.com/api/signup",
        formData,
        config
      );
    }

    fetchUsers();
    setFormData({ name: "", email: "", password: "", role: "publisher" });
    setEditUserId(null);
  } catch (err) {
    console.error("Error saving user:", err.response?.data || err);
  }
};
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`https://imediareports.onrender.com/api/deleteuser/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (user) => {
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
    });
    setEditUserId(user._id);
  };

  /* ✅ ORIGINAL theme logic untouched */
  const isDark = theme === "dark";
  const themeColors = {
    containerBg: isDark ? "#1e293b" : "#fff",
    headingColor: isDark ? "#e2e8f0" : "#082f3d",
    borderColor: isDark ? "#334155" : "#ccc",
    tableHeaderBg: isDark ? "#0f172a" : "#082f3d",
    tableHeaderText: "#fff",
    tableRowBg: isDark ? "#1e293b" : "#fff",
    textColor: isDark ? "#e2e8f0" : "#000000",
  };

  return (
    <div
      style={{
        ...styles.container,
        background: themeColors.containerBg,
        color: themeColors.textColor,
      }}
    >
      <h2 style={{ ...styles.heading, color: themeColors.headingColor }}>
        👥 User Management
      </h2>

      {/* ✅ Add/Edit Form unchanged */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          style={{
            ...styles.input,
            background: isDark ? "#0f172a" : "#fff",
            color: themeColors.textColor,
            borderColor: themeColors.borderColor,
          }}
        />

        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          style={{
            ...styles.input,
            background: isDark ? "#0f172a" : "#fff",
            color: themeColors.textColor,
            borderColor: themeColors.borderColor,
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          required={!editUserId}
          style={{
            ...styles.input,
            background: isDark ? "#0f172a" : "#fff",
            color: themeColors.textColor,
            borderColor: themeColors.borderColor,
          }}
        />

        <select
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          style={{
            ...styles.select,
            background: isDark ? "#0f172a" : "#fff",
            color: themeColors.textColor,
            borderColor: themeColors.borderColor,
          }}
        >
          <option value="publisher">Publisher</option>
          <option value="advertiser">Advertiser</option>
          <option value="admin">Admin</option>
                    <option value="executive">Executive</option>
                     <option value="salesperson">Sales-person</option>

        </select>

        <button type="submit" style={styles.addButton}>
          {editUserId ? "Update" : "Add"}
        </button>
      </form>

      {/* ✅ TABLE with new Block/Unblock column */}
      <div style={styles.tableWrapper}>
        <table style={{ ...styles.table, borderColor: themeColors.borderColor }}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Role</th>
              <th style={styles.th}>Actions</th>
              <th style={styles.th}>Block / Unblock</th> {/* ✅ NEW */}
            </tr>
          </thead>

          <tbody>
            {users.map((user) => {
              const blocked = isUserBlocked(user.name);

              return (
                <tr key={user._id}>
                  <td style={styles.td}>{user.name}</td>
                  <td style={styles.td}>{user.email}</td>
                  <td style={styles.td}>
      <span
  style={{
    ...styles.roleBadge,
    backgroundColor:
      user.role === "admin"
        ? "#2563eb"      // blue
        : user.role === "advertiser"
        ? "#10b981"      // green
        : user.role === "executive"
        ? "#8b5cf6"      // purple
        : user.role === "salesperson"
        ? "#ef4444"      // 🔴 red
        : "#f59e0b",     // default (orange)
  }}
>
  {user.role}
</span>

                  </td>

                  <td style={styles.tdAction}>
                    <button
                      style={styles.editButton}
                      onClick={() => handleEdit(user)}
                    >
                       Edit
                    </button>
                    <button
                      style={styles.deleteButton}
                      onClick={() => handleDelete(user._id)}
                    >
                      Delete
                    </button>
                  </td>

                  {/* ✅ NEW COLUMN BLOCK/UNBLOCK */}
                  <td style={styles.td}>
                    {blocked ? (
                      <button
                        style={{
                          ...styles.blockButton,
                          background: "#10b981",
                        }}
                        onClick={() => handleUnblock(user.name)}
                      >
                         Unblock
                      </button>
                    ) : (
                      <button
                        style={{
                          ...styles.blockButton,
                          background: "#ef4444",
                        }}
                        onClick={() => handleBlock(user.name)}
                      >
                        Block
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ✅ ORIGINAL styles + block button added */
const styles = {
  container: {
    width: "90%",
    maxWidth: "100%",
    margin: 0,
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 6px 14px rgba(0,0,0,0.1)",
    // fontFamily: "Inter, sans-serif",
  },
  heading: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginBottom: "20px",
  },
  input: {
    flex: 1,
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "14px",
  },
  select: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "14px",
  },
  addButton: {
    background: "#10b981",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    padding: "10px 18px",
    cursor: "pointer",
    fontWeight: "600",
  },
  tableWrapper: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    border: "2px solid #ddd",
    minWidth: "600px",
  },
  th: {
    padding: "12px",
    textAlign: "left",
    border: "1px solid #ccc",
    fontWeight: "900",
  },
  td: {
    padding: "12px",
    border: "1px solid #ccc",
    textAlign: "center",
     fontWeight: "500",
  },
  tdAction: {
    padding: "12px",
    border: "1px solid #ccc",
    textAlign: "center",
  },
  editButton: {
    background: "#facc15",
    padding: "6px 12px",
    marginRight: "6px",
    borderRadius: "4px",
    cursor: "pointer",
  },
  deleteButton: {
    background: "#ef4444",
    padding: "6px 12px",
    borderRadius: "4px",
    color: "#fff",
    cursor: "pointer",
  },
  blockButton: {
    padding: "6px 12px",
    borderRadius: "4px",
    cursor: "pointer",
    color: "#fff",
    fontWeight: "600",
    textAlign:"center"
  },
  roleBadge: {
    padding: "4px 10px",
    borderRadius: "20px",
    color: "#fff",
    fontSize: "12px",
    fontWeight: "500",
    textTransform: "capitalize",
  },
};

export default UserManagement;
