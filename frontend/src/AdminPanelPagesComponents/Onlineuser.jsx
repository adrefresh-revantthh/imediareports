

import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { ThemeContext } from "../ThemeSettings/ThemeContext";

const OnlineUsers = () => {
  const [users, setUsers] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const themeColors = {
    tableBg: isDark ? "#1e293b" : "#ffffff",
    headerBg: isDark ? "#334155" : "#f4f4f4",
    text: isDark ? "#e2e8f0" : "#111827",
    border: isDark ? "#475569" : "#ccc",
    buttonBg: isDark ? "#475569" : "#f3f4f6",
    buttonHover: isDark ? "#64748b" : "#e5e7eb",
  };

  /* ---------------------------------------------------------
      🔵 HEARTBEAT — updates user status every 10 seconds
  --------------------------------------------------------- */
useEffect(() => {
  const token = JSON.parse(localStorage.getItem("jwt"))?.token;
  if (!token) return;

  const sendHeartbeat = async () => {
    await axios.post(
      "https://imediareports.onrender.com/api/heartbeat",
      { token },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
  };

  sendHeartbeat();
  const interval = setInterval(sendHeartbeat, 10000);
  return () => clearInterval(interval);
}, []);


  /* ---------------------------------------------------------
      🔵 Fetch Online Users every 10 sec
  --------------------------------------------------------- */
  useEffect(() => {
    fetchOnlineUsers();
    const interval = setInterval(fetchOnlineUsers, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchOnlineUsers = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("jwt"))?.token;

      const res = await axios.get("http://localhost:5000/api/online-users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(res.data.users);
    } catch (err) {
      console.log("User fetch error:", err.message);
    }
  };

  const formatTime = (time) =>
    !time ? "Never Active" : new Date(time).toLocaleString();

  const visibleUsers = users.slice(0, visibleCount);

  const handleViewMore = () => {
    if (visibleCount >= users.length) {
      setVisibleCount(5);
    } else {
      setVisibleCount((prev) => Math.min(prev + 5, users.length));
    }
  };

  return (
    <div
      style={{
        padding: "25px",
        color: themeColors.text,
        // fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      <h2
        style={{
          marginBottom: "20px",
          fontSize: "24px",
          fontWeight: "600",
          letterSpacing: "0.4px",
        }}
      >
        👥 User Online Status
      </h2>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: themeColors.tableBg,
          border: `1px solid ${themeColors.border}`,
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <thead>
          <tr style={{ background: themeColors.headerBg }}>
            <th style={th(themeColors)}>Name</th>
            <th style={th(themeColors)}>Email</th>
            <th style={th(themeColors)}>Role</th>
            <th style={th(themeColors)}>Status</th>
            <th style={th(themeColors)}>Last Active</th>
          </tr>
        </thead>

        <tbody>
          {visibleUsers.map((user) => (
            <tr key={user._id}>
              <td style={td(themeColors)}>{user.name}</td>
              <td style={td(themeColors)}>{user.email}</td>
              <td style={td(themeColors)}>{user.role}</td>

              <td style={td(themeColors)}>
                <span
                  style={{
                    width: "12px",
                    height: "12px",
                    display: "inline-block",
                    borderRadius: "50%",
                    marginRight: "8px",
                    backgroundColor: user.isOnline ? "#22c55e" : "red",
                  }}
                ></span>
                {user.isOnline ? "Online" : "Offline"}
              </td>

              <td style={td(themeColors)}>{formatTime(user.lastActive)}</td>
            </tr>
          ))}

          {users.length === 0 && (
            <tr>
              <td
                colSpan="5"
                style={{
                  ...td(themeColors),
                  textAlign: "center",
                  fontWeight: "500",
                }}
              >
                No Users Found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {users.length > 5 && (
        <div style={{ textAlign: "center", marginTop: "15px" }}>
          <button
            onClick={handleViewMore}
            style={{
              background: themeColors.buttonBg,
              color: themeColors.text,
              border: `1px solid ${themeColors.border}`,
              padding: "8px 18px",
              borderRadius: "8px",
              fontSize: "15px",
              cursor: "pointer",
              transition: "0.2s",
              // fontFamily: "'Inter', system-ui, sans-serif",
            }}
            onMouseOver={(e) =>
              (e.target.style.background = themeColors.buttonHover)
            }
            onMouseOut={(e) =>
              (e.target.style.background = themeColors.buttonBg)
            }
          >
            {visibleCount >= users.length ? "▲ View Less" : "▼ View More"}
          </button>
        </div>
      )}
    </div>
  );
};

const th = (themeColors) => ({
  padding: "12px",
  border: `1px solid ${themeColors.border}`,
  background: themeColors.headerBg,
  color: themeColors.text,
  fontWeight: 600,
  textAlign: "left",
  fontSize: "15px",
  letterSpacing: "0.3px",
});

const td = (themeColors) => ({
  padding: "12px",
  border: `1px solid ${themeColors.border}`,
  textAlign: "left",
  color: themeColors.text,
  fontSize: "14.5px",
  letterSpacing: "0.2px",
});

export default OnlineUsers;
