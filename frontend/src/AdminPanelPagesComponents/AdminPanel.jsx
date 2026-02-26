
import React, { useState, useContext, useEffect } from "react";
import { ThemeContext } from "../ThemeSettings/ThemeContext";

import UserManagement from "./UserManagement";
import UploadedReports from "./UploadedReports";
import Settings from "./AdminSettings";
import AdminAnalytics from "./AdminAnalytics";
import SecurityInsights from "./AdminSecurityInsights";

const TABS = [
  "users",
  "Analytics",

  "security insights",
  "settings",
];

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [showProfileModal, setShowProfileModal] = useState(false);
  const { theme } = useContext(ThemeContext);

  const [admin, setAdmin] = useState({
    name: "",
    email: "",
  });

  /* 🔐 FETCH ADMIN FROM JWT */
  useEffect(() => {
    const jwt = JSON.parse(localStorage.getItem("jwt"));
    const user = jwt?.user;

    if (user) {
      setAdmin({
        name: user.name || "Admin",
        email: user.email || "Not Available",
      });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    window.location.href = "/login";
  };

  const renderTab = () => {
    switch (activeTab) {
      case "Analytics":
        return <AdminAnalytics />;
      case "users":
        return <UserManagement />;
      case "uploaded Reports":
        return <UploadedReports />;
      case "settings":
        return <Settings />;
      case "security insights":
        return <SecurityInsights />;
      default:
        return null;
    }
  };

  const colors = {
    pageBg: theme === "dark" ? "#0f172a" : "#f4f6f8",
    navbarBg: "#6D28D9",
    activeLink: "#DFFA33",
    contentBg: theme === "dark" ? "#020617" : "transparent",
  };

  return (
    <div style={{ ...styles.page, background: colors.pageBg }}>
      {/* 🔷 TOP NAVBAR */}
      <div style={{ ...styles.navbar, background: colors.navbarBg }}>
        <div style={styles.brand}>Admin Panel</div>

        <div style={styles.rightSection}>
          {/* NAV LINKS */}
          <div style={styles.navLinks}>
            {TABS.map((tab) => (
              <span
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  ...styles.navLink,
                  ...(activeTab === tab && {
                    color: colors.activeLink,
                    fontWeight: 700,
                  }),
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </span>
            ))}
          </div>

          {/* PROFILE */}
          <div
            style={styles.profileCircle}
            onClick={() => setShowProfileModal(true)}
          >
            {admin.name?.charAt(0)?.toUpperCase() || "A"}
          </div>
        </div>
      </div>

      {/* 🔷 MAIN CONTENT */}
      <main
        style={{
          ...styles.main,
          background: colors.contentBg,
        }}
      >
        {renderTab()}
      </main>

      {/* 🔐 PROFILE MODAL */}
      {showProfileModal && (
        <div
          style={styles.modalOverlay}
          onClick={() => setShowProfileModal(false)}
        >
          <div
            style={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={styles.modalAvatar}>
              {admin.name?.charAt(0)?.toUpperCase() || "A"}
            </div>

            <h3 style={{ marginBottom: 8 }}>{admin.name}</h3>
            <p style={{ color: "#666", marginBottom: 20 }}>
              {admin.email}
            </p>

            <button
              style={styles.logoutBtn}
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ======================= STYLES ======================= */

const styles = {
  page: {
    minHeight: "100vh",
    width: "100%",
  },

  navbar: {
    padding: "14px 28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
  },

  brand: {
    color: "#ffffff",
    fontSize: "20px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },

  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: "28px",
  },

  navLinks: {
    display: "flex",
    gap: "18px",
    flexWrap: "wrap",
  },

  navLink: {
    cursor: "pointer",
    fontSize: "20px",
    color: "#ffffff",
    transition: "0.2s ease",
  },

  profileCircle: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "#ffffff",
    color: "#6D28D9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    cursor: "pointer",
  },

  main: {
    padding: "24px",
    boxSizing: "border-box",
  },

  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },

  modal: {
    width: "360px",
    background: "#fff",
    borderRadius: "16px",
    padding: "30px",
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
  },

  modalAvatar: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    background: "#6D28D9",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 15px",
    fontSize: "28px",
    fontWeight: "bold",
  },

  logoutBtn: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "12px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 600,
  },
};

export default AdminPanel;
