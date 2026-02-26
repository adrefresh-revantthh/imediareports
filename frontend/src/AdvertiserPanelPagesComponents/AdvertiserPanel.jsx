
import React, { useState, useEffect } from "react";
import Dashboard from "./Dashboard";
import AdvertiserReports from "./Advertiser-Reports";
import AdvertiserDashboard from "./Advertiser-Detailed";
import AdvertiserProfileCard from "./AdvertiserProfile";

const AdvertiserPanel = () => {
  const [activeTab, setActiveTab] = useState("Overview");
  const [showProfileModal, setShowProfileModal] = useState(false);

  // ✅ Real logged user state
  const [advertiser, setAdvertiser] = useState({
    name: "",
    email: "",
  });

  // ✅ Fetch user from JWT (same as your profile card)
  useEffect(() => {
    const jwt = JSON.parse(localStorage.getItem("jwt"));
    const user = jwt?.user;

    if (user) {
      setAdvertiser({
        name: user.name || "Unknown Advertiser",
        email: user.email || "Not Available",
      });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    window.location.href = "/login"; // change route if needed
  };

  const renderTab = () => {
    switch (activeTab) {
      case "Overview":
        return <Dashboard />;
      case "Reports":
        return <AdvertiserReports />;
      case "Campaign-Performance":
        return <AdvertiserDashboard />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div style={styles.wrapper}>
      {/* NAVBAR */}
      <nav style={styles.navbar}>
        <h2 style={styles.logo}>Advertiser Panel</h2>

        <div style={styles.rightSection}>
          <div style={styles.navLinks}>
            {["Overview", "Reports", "Campaign-Performance"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  ...styles.navBtn,
                  ...(activeTab === tab && styles.activeNavBtn),
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* PROFILE ICON */}
          <div
            style={styles.profileCircle}
            onClick={() => setShowProfileModal(true)}
          >
            {advertiser.name?.charAt(0)?.toUpperCase() || "A"}
          </div>
        </div>
      </nav>

      {/* PROFILE MODAL */}
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
              {advertiser.name?.charAt(0)?.toUpperCase() || "A"}
            </div>

            <h3 style={{ marginBottom: "10px" }}>
              {advertiser.name}
            </h3>
            <p style={{ color: "#666", marginBottom: "20px" }}>
              {advertiser.email}
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

      <AdvertiserProfileCard />
      <main style={styles.main}>{renderTab()}</main>
    </div>
  );
};

export default AdvertiserPanel;

/* ================= STYLES ================= */

const styles = {
  wrapper: {
    width: "100vw",
    minHeight: "100vh",
    background: "#f4f6f8",
  },

  navbar: {
    height: "64px",
    background: "#813dff",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 20px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
  },

  logo: {
    color: "#fff",
    fontSize: "20px",
    fontWeight: "bold",
  },

  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },

  navLinks: {
    display: "flex",
    gap: "10px",
  },

  navBtn: {
    color: "white",
    border: "none",
    padding: "8px 14px",
    cursor: "pointer",
    borderRadius: "8px",
    background: "transparent",
  },

  activeNavBtn: {
    background: "#dffa33",
    fontWeight: "600",
    color: "black",
  },

  profileCircle: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "#fff",
    color: "#813dff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    cursor: "pointer",
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
    width: "350px",
    background: "#fff",
    borderRadius: "12px",
    padding: "30px",
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
  },

  modalAvatar: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    background: "#813dff",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 15px",
    fontSize: "28px",
    fontWeight: "bold",
  },

  logoutBtn: {
    background: "#ff4d4f",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
  },

  main: {
    padding: "30px",
  },
};
