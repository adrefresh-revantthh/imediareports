

import React, { useContext } from "react";
import { ThemeContext } from "../ThemeSettings/ThemeContext";

const Settings = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  const isDark = theme === "dark";

  // 🎨 Theme-specific colors
  const themeColors = {
    containerBg: isDark ? "#1e293b" : "#ffffff",
    textColor: isDark ? "#e2e8f0" : "#111827",
    borderColor: isDark ? "#334155" : "#e5e7eb",
    headingColor: isDark ? "#f8fafc" : "#111827",
    labelColor: isDark ? "#cbd5e1" : "#374151",
    buttonBg: isDark ? "#0ea5e9" : "#00C49F",
    buttonHover: isDark ? "#38bdf8" : "#06d6a0",
  };

  return (
    <div
      style={{
        ...styles.container,
        background: themeColors.containerBg,
        color: themeColors.textColor,
        border: `1px solid ${themeColors.borderColor}`,
        transition: "background 0.3s, color 0.3s, border 0.3s",
      }}
    >
      <h2 style={{ ...styles.heading, color: themeColors.headingColor }}>
        ⚙️ Admin Settings
      </h2>

      <div style={styles.section}>
        <label style={{ ...styles.label, color: themeColors.labelColor }}>
          Theme:
        </label>
        <button
          style={{
            ...styles.toggleBtn,
            background: themeColors.buttonBg,
          }}
          onMouseOver={(e) => (e.target.style.background = themeColors.buttonHover)}
          onMouseOut={(e) => (e.target.style.background = themeColors.buttonBg)}
          onClick={toggleTheme}
        >
          Switch to {theme === "light" ? "🌙 Dark" : "☀️ Light"} Mode
        </button>
      </div>

      <p
        style={{
          marginTop: "10px",
          fontSize: "14px",
          opacity: 0.8,
          color: themeColors.textColor,
        }}
      >
        Current theme: <b>{theme}</b>
      </p>
    </div>
  );
};

// ✅ Styles (shared layout, dynamic colors applied via inline)
const styles = {
  container: {
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    maxWidth: "400px",
    margin: "auto",
  },
  heading: {
    marginBottom: "20px",
    fontWeight: "600",
    fontSize: "20px",
  },
  section: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "10px",
  },
  label: {
    fontSize: "16px",
    fontWeight: "500",
  },
  toggleBtn: {
    color: "#fff",
    padding: "8px 14px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
    transition: "background 0.2s ease-in-out",
  },
};

export default Settings;
