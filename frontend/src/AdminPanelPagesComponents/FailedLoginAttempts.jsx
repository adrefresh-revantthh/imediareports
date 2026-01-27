
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { ThemeContext } from "../ThemeSettings/ThemeContext";

const FailedLoginAttempts = () => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(5); // ✅ show 5 rows initially

  const themeColors = {
    tableBg: isDark ? "#1e293b" : "#ffffff",
    headerBg: isDark ? "#334155" : "#e3ebef",
    text: isDark ? "#e2e8f0" : "#111827",
    border: isDark ? "#475569" : "#ccc",
    buttonBg: isDark ? "#475569" : "#f3f4f6",
    buttonHover: isDark ? "#64748b" : "#e5e7eb",
  };

  const cleanBrowser = (str) => {
    if (!str) return "N/A";
    if (str.includes("Chrome")) return "Chrome";
    if (str.includes("Firefox")) return "Firefox";
    if (str.includes("Safari") && !str.includes("Chrome")) return "Safari";
    if (str.includes("Edg")) return "Edge";
    return str.slice(0, 20) + "...";
  };

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("jwt"))?.token;

        const res = await axios.get("http://localhost:5000/api/login-history", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const failed = (res.data.logs || []).filter(
          (log) => log.action === "login_failed"
        );

        setLogs(failed);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  // ✅ Pagination logic: show 5 more each click, then toggle back
  const visibleLogs = logs.slice(0, visibleCount);

  const handleViewMore = () => {
    if (visibleCount >= logs.length) {
      setVisibleCount(5); // reset to 5 when end reached
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
          letterSpacing: "0.5px",
        }}
      >
        ❌ Failed Login Attempts
      </h2>

      {loading ? (
        <p style={{ fontSize: "16px", opacity: 0.7 }}>Loading...</p>
      ) : logs.length === 0 ? (
        <p style={{ color: themeColors.text, fontSize: "16px" }}>
          No failed attempts found ✅
        </p>
      ) : (
        <>
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
                <th style={th(themeColors)}>Username</th>
                <th style={th(themeColors)}>Time</th>
                <th style={th(themeColors)}>IP Address</th>
                <th style={th(themeColors)}>Device</th>
                <th style={th(themeColors)}>Status</th>
              </tr>
            </thead>

            <tbody>
              {visibleLogs.map((log) => (
                <tr key={log._id}>
                  <td style={td(themeColors)}>{log.username || "N/A"}</td>
                  <td style={td(themeColors)}>
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td style={td(themeColors)}>{log.ipAddress || "N/A"}</td>
                  <td style={td(themeColors)}>{cleanBrowser(log.browser)}</td>
                  <td
                    style={{
                      ...td(themeColors),
                      color: "red",
                      fontWeight: "600",
                    }}
                  >
                    Failed
                  </td>
                </tr>
              ))}
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
                {visibleCount >= logs.length ? "▲ View Less" : "▼ View More"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const th = (themeColors) => ({
  padding: "12px",
  border: `1px solid ${themeColors.border}`,
  textAlign: "left",
  fontWeight: 600,
  color: themeColors.text,
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

export default FailedLoginAttempts;
