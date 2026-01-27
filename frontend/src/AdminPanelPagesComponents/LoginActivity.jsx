
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { ThemeContext } from "../ThemeSettings/ThemeContext";

const LoginActivity = () => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const [logs, setLogs] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5); // ✅ show only 5 initially

  const themeColors = {
    tableBg: isDark ? "#1e293b" : "#ffffff",
    headerBg: isDark ? "#334155" : "#e8f1f3",
    text: isDark ? "#e2e8f0" : "#111827",
    border: isDark ? "#475569" : "#ccc",
    buttonBg: isDark ? "#475569" : "#f3f4f6",
    buttonHover: isDark ? "#64748b" : "#e5e7eb",
  };

  // ✅ Extract useful parts from user-agent
  const parseBrowser = (ua) => {
    if (!ua) return "Unknown";

    let browser = "Unknown";
    let os = "Unknown";

    if (ua.includes("Chrome") && !ua.includes("Edg")) browser = "Chrome";
    else if (ua.includes("Firefox")) browser = "Firefox";
    else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari";
    else if (ua.includes("Edg")) browser = "Edge";
    else if (ua.includes("OPR") || ua.includes("Opera")) browser = "Opera";

    if (ua.includes("Windows NT 10")) os = "Windows 10";
    else if (ua.includes("Windows NT 6.1")) os = "Windows 7";
    else if (ua.includes("Mac OS")) os = "MacOS";
    else if (ua.includes("Android")) os = "Android";
    else if (ua.includes("iPhone")) os = "iPhone";
    else if (ua.includes("iPad")) os = "iPad";
    else if (ua.includes("Linux")) os = "Linux";

    return `${os} — ${browser}`;
  };

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("jwt"))?.token;

        const res = await axios.get("http://localhost:5000/api/login-history", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = Array.isArray(res.data) ? res.data : res.data.logs || [];
        setLogs(data);
      } catch (error) {
        console.log(error);
        setLogs([]);
      }
    };
    fetchLogs();
  }, []);

  const visibleLogs = logs.slice(0, visibleCount);

  const handleViewMore = () => {
    if (visibleCount >= logs.length) {
      setVisibleCount(5); // reset when all visible
    } else {
      setVisibleCount((prev) => Math.min(prev + 5, logs.length));
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
        👤 Login Activity
      </h2>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: themeColors.tableBg,
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <thead>
          <tr>
            <th style={header(themeColors)}>Username</th>
            <th style={header(themeColors)}>Action</th>
            <th style={header(themeColors)}>Login Time</th>
            <th style={header(themeColors)}>IP Address</th>
            <th style={header(themeColors)}>Device</th>
          </tr>
        </thead>

        <tbody>
          {logs.length === 0 ? (
            <tr>
              <td
                colSpan="5"
                style={{ ...cell(themeColors), fontWeight: "500", textAlign: "center" }}
              >
                No Login Activity Found
              </td>
            </tr>
          ) : (
            visibleLogs.map((log) => (
              <tr key={log._id}>
                <td style={cell(themeColors)}>{log.username || "N/A"}</td>
                <td style={cell(themeColors)}>{log.action || "login"}</td>
                <td style={cell(themeColors)}>
                  {log.timestamp
                    ? new Date(log.timestamp).toLocaleString()
                    : "N/A"}
                </td>
                <td style={cell(themeColors)}>{log.ipAddress || "N/A"}</td>
                <td style={cell(themeColors)}>{parseBrowser(log.browser)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* ✅ View More / View Less Button */}
      {logs.length > 5 && (
        <div style={{ textAlign: "center", marginTop: "15px" }}>
          <button
            onClick={handleViewMore}
            style={{
              background: themeColors.buttonBg,
              color: themeColors.text,
              border: `1px solid ${themeColors.border}`,
              padding: "8px 18px",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "0.2s",
              // fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: "15px",
              fontWeight: "500",
            }}
            onMouseOver={(e) =>
              (e.target.style.background = themeColors.buttonHover)
            }
            onMouseOut={(e) =>
              (e.target.style.background = themeColors.buttonBg)
            }
          >
            {visibleCount >= logs.length ? "▲ View Less" : "▼ View More"}
          </button>
        </div>
      )}
    </div>
  );
};

const header = (themeColors) => ({
  border: `1px solid ${themeColors.border}`,
  padding: "12px",
  background: themeColors.headerBg,
  color: themeColors.text,
  textAlign: "center",
  fontWeight: "600",
  fontSize: "15.5px",
  letterSpacing: "0.3px",
});

const cell = (themeColors) => ({
  border: `1px solid ${themeColors.border}`,
  padding: "12px",
  textAlign: "center",
  fontSize: "14.5px",
  letterSpacing: "0.2px",
  color: themeColors.text,
});

export default LoginActivity;
