

import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { ThemeContext } from "../ThemeSettings/ThemeContext";

const BlockedUsers = () => {
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(5); // ✅ show 5 rows initially

  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    fetchBlockedUsers();
  }, []);

  // ✅ Fetch Blocked Users
  const fetchBlockedUsers = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("jwt"))?.token;
      const res = await axios.get("http://localhost:5000/api/blocked-users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBlockedUsers(res.data.blockedUsers || []);
    } catch (err) {
      console.error("Error fetching blocked users:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Theme colors
  const isDark = theme === "dark";

  const themeStyles = {
    pageBg: isDark ? "#1e293b" : "#ffffff",
    textColor: isDark ? "#e2e8f0" : "#111827",
    tableBorder: isDark ? "#334155" : "#ccc",
    headerBg: isDark ? "#0f172a" : "#f4f6f8",
    headerText: isDark ? "#f8fafc" : "#111827",
    buttonBg: isDark ? "#475569" : "#f3f4f6",
    buttonHover: isDark ? "#64748b" : "#e5e7eb",
  };

  // ✅ Pagination logic
  const visibleUsers = blockedUsers.slice(0, visibleCount);
  const handleViewMore = () => {
    if (visibleCount >= blockedUsers.length) {
      setVisibleCount(5); // reset
    } else {
      setVisibleCount((prev) => Math.min(prev + 5, blockedUsers.length));
    }
  };

  return (
    <div
      style={{
        padding: "25px",
        background: themeStyles.pageBg,
        color: themeStyles.textColor,
        borderRadius: "10px",
        // fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      <h2
        style={{
          marginBottom: "18px",
          fontWeight: "600",
          color: themeStyles.textColor,
          fontSize: "24px",
          letterSpacing: "0.3px",
        }}
      >
        🚫 Blocked Users
      </h2>

      {loading ? (
        <p style={{ color: themeStyles.textColor, fontSize: "16px" }}>Loading...</p>
      ) : blockedUsers.length === 0 ? (
        <p style={{ color: "green", fontWeight: "500", fontSize: "16px" }}>
          ✅ No Blocked Users Found
        </p>
      ) : (
        <>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              border: `1px solid ${themeStyles.tableBorder}`,
              background: themeStyles.pageBg,
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <thead>
              <tr style={{ background: themeStyles.headerBg }}>
                <th style={thStyle(themeStyles)}>Username</th>
                <th style={thStyle(themeStyles)}>Failed Attempts</th>
                <th style={thStyle(themeStyles)}>Status</th>
                <th style={thStyle(themeStyles)}>Last Attempt</th>
              </tr>
            </thead>

            <tbody>
              {visibleUsers.map((user) => (
                <tr key={user._id}>
                  <td style={tdStyle(themeStyles)}>{user.username}</td>
                  <td style={tdStyle(themeStyles)}>{user.attempts}</td>
                  <td style={tdStyle(themeStyles)}>
                    <span
                      style={{
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        display: "inline-block",
                        backgroundColor: user.blocked ? "#dc2626" : "#22c55e",
                        marginRight: "6px",
                      }}
                    ></span>
                    {user.blocked ? "Blocked" : "Active"}
                  </td>
                  <td style={tdStyle(themeStyles)}>
                    {user.lastAttempt
                      ? new Date(user.lastAttempt).toLocaleString()
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* ✅ View More / View Less Button */}
          {blockedUsers.length > 5 && (
            <div style={{ textAlign: "center", marginTop: "15px" }}>
              <button
                onClick={handleViewMore}
                style={{
                  background: themeStyles.buttonBg,
                  color: themeStyles.textColor,
                  border: `1px solid ${themeStyles.tableBorder}`,
                  padding: "8px 18px",
                  borderRadius: "8px",
                  fontSize: "15px",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "0.2s",
                  // fontFamily: "'Inter', system-ui, sans-serif",
                }}
                onMouseOver={(e) =>
                  (e.target.style.background = themeStyles.buttonHover)
                }
                onMouseOut={(e) =>
                  (e.target.style.background = themeStyles.buttonBg)
                }
              >
                {visibleCount >= blockedUsers.length ? "▲ View Less" : "▼ View More"}
              </button>
            </div>
          )}
        </>
      )}

      {/* ✅ Refresh Button */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button
          onClick={fetchBlockedUsers}
          style={{
            padding: "10px 18px",
            background: themeStyles.headerBg,
            color: themeStyles.headerText,
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600",
            // fontFamily: "'Inter', system-ui, sans-serif",
            transition: "0.2s",
          }}
          onMouseOver={(e) =>
            (e.target.style.opacity = "0.9")
          }
          onMouseOut={(e) =>
            (e.target.style.opacity = "1")
          }
        >
          🔄 Refresh
        </button>
      </div>
    </div>
  );
};

const thStyle = (themeStyles) => ({
  border: `1px solid ${themeStyles.tableBorder}`,
  padding: "12px",
  background: themeStyles.headerBg,
  color: themeStyles.headerText,
  textAlign: "center",
  fontWeight: "600",
  fontSize: "15px",
  letterSpacing: "0.3px",
});

const tdStyle = (themeStyles) => ({
  border: `1px solid ${themeStyles.tableBorder}`,
  padding: "10px",
  textAlign: "center",
  color: themeStyles.textColor,
  fontSize: "14.5px",
  letterSpacing: "0.2px",
  verticalAlign: "middle",
});

export default BlockedUsers;
