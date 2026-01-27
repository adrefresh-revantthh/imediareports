
import React, { useEffect, useState, useContext } from "react";
import LoginActivity from "./LoginActivity";
import FailedLoginAttempts from "./FailedLoginAttempts";
import OnlineUsers from "./Onlineuser";
import { ThemeContext } from "../ThemeSettings/ThemeContext";
import BlockedUsers from "./BlockedUsers";

export default function SecurityInsights() {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const [onlineUsers, setOnlineUsers] = useState([]);
  const [lastLogin, setLastLogin] = useState([]);
  const [blockedAccounts, setBlockedAccounts] = useState([]);

  // 🎨 Theme-specific colors
  const themeColors = {
    cardBg: isDark ? "#1e293b" : "#ffffff",
    text: isDark ? "#e2e8f0" : "#111827",
    border: isDark ? "#334155" : "#ccc",
    tableHeaderBg: isDark ? "#334155" : "#082f3d",
    pageBg: isDark ? "#0f172a" : "#f8fafc",
    shadow: isDark ? "0 2px 8px rgba(0,0,0,0.5)" : "0 2px 8px rgba(0,0,0,0.08)",
  };

  useEffect(() => {
    loadOnlineUsers();
    loadLastLogin();
    loadBlockedAccounts();
  }, []);

  // ✅ Dummy values until API ready
  const loadOnlineUsers = () => {
    setOnlineUsers([
      { user: "admin", status: "online", lastActive: "11:35 AM" },
      { user: "user1", status: "offline", lastActive: "10:10 AM" },
      { user: "user2", status: "online", lastActive: "11:32 AM" },
    ]);
  };

  const loadLastLogin = () => {
    setLastLogin([
      { user: "admin", time: "2025-02-11 08:45 AM", ip: "192.168.1.101", device: "Chrome" },
      { user: "user1", time: "2025-02-11 09:22 AM", ip: "192.168.1.102", device: "Firefox" },
      { user: "user2", time: "2025-02-11 10:12 AM", ip: "192.168.1.103", device: "Edge" },
    ]);
  };

  const loadBlockedAccounts = () => {
    setBlockedAccounts([
      { user: "user4", reason: "3 failed attempts", blockedAt: "2025-02-11 09:30 AM" },
    ]);
  };

  return (
    <div
      style={{
        padding: "20px",
        background: themeColors.pageBg,
        minHeight: "100vh",
        color: themeColors.text,
        transition: "0.3s",
      }}
    >
      <h1 style={{ fontSize: "26px", fontWeight: "bold", marginBottom: "20px", color: themeColors.text }}>
        Security & Login Monitoring
      </h1>

      {/* ✅ LOGIN ACTIVITY SECTION */}
      <section
        style={{
          ...styles.card,
          background: themeColors.cardBg,
          color: themeColors.text,
          border: `1px solid ${themeColors.border}`,
          boxShadow: themeColors.shadow,
        }}
      >
         <OnlineUsers />
        
      </section>

      {/* ✅ FAILED LOGIN ATTEMPTS SECTION */}
      <section
        style={{
          ...styles.card,
          background: themeColors.cardBg,
          color: themeColors.text,
          border: `1px solid ${themeColors.border}`,
          boxShadow: themeColors.shadow,
        }}
      >
        <FailedLoginAttempts />
      </section>

      {/* ✅ NEW FEATURE 2 — ONLINE USERS */}
      <section
        style={{
          ...styles.card,
          background: themeColors.cardBg,
          color: themeColors.text,
          border: `1px solid ${themeColors.border}`,
          boxShadow: themeColors.shadow,
        }}
      >
       <LoginActivity />
      </section>

 <section
        style={{
          ...styles.card,
          background: themeColors.cardBg,
          color: themeColors.text,
          border: `1px solid ${themeColors.border}`,
          boxShadow: themeColors.shadow,
        }}
      >
        <BlockedUsers/>
      </section>
     
    </div>
  );
}

const styles = {
  card: {
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "25px",
    transition: "0.3s ease",
  },
  th: {
    padding: "10px",
    fontWeight: "600",
    color: "white",
  },
  td: {
    padding: "10px",
  },
};
