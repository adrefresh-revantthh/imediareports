import React, { useState } from "react";
import {
  FiGrid,
  FiUsers,
  FiUserCheck,
  FiBarChart2,
  FiActivity,
} from "react-icons/fi";
import Dashboard from "./BusinessOwnerDashBoard";

export default function BusinessOwnerPanel() {
  const [active, setActive] = useState("dashboard");

  const menu = [
    { key: "dashboard", label: "Overview Dashboard", icon: <FiGrid /> },
    { key: "publishers", label: "Publishers Insights", icon: <FiUsers /> },
    { key: "advertisers", label: "Advertisers Insights", icon: <FiUserCheck /> },
    { key: "campaigns", label: "Campaign Analytics", icon: <FiBarChart2 /> },
    { key: "team", label: "Team Activity Logs", icon: <FiActivity /> },
  ];

  return (
    <div style={styles.wrapper}>
      {/* SIDEBAR */}
      <aside style={styles.sidebar}>
        <h2 style={styles.logo}>Business Panel</h2>

        {menu.map((item) => (
          <div
            key={item.key}
            onClick={() => setActive(item.key)}
            style={{
              ...styles.menuItem,
              background: active === item.key ? "#14A4D8" : "transparent",
              color: active === item.key ? "#fff" : "#333",
            }}
          >
            <span style={styles.icon}>{item.icon}</span>
            {item.label}
          </div>
        ))}
      </aside>

      {/* CONTENT AREA */}
      <main style={styles.content}>
        {active === "dashboard" && <Dashboard/>}
        {active === "publishers" && <Publishers />}
        {active === "advertisers" && <Advertisers />}
        {active === "campaigns" && <Campaigns />}
        {active === "team" && <Team />}
      </main>
    </div>
  );
}

/* ------------------------------------ */
/*          FEATURE VIEWS               */
/* ------------------------------------ */



function Publishers() {
  return (
    <div>
      <h1 style={styles.heading}>🏢 Publishers Insights</h1>
      <p style={styles.text}>
        See performance metrics and insights for all publishers.
      </p>
    </div>
  );
}

function Advertisers() {
  return (
    <div>
      <h1 style={styles.heading}>📣 Advertisers Insights</h1>
      <p style={styles.text}>
        View advertiser engagement, spend, and campaign participation.
      </p>
    </div>
  );
}

function Campaigns() {
  return (
    <div>
      <h1 style={styles.heading}>🎯 Campaign Analytics</h1>
      <p style={styles.text}>
        Track impressions, clicks, CTR and campaign effectiveness.
      </p>
    </div>
  );
}

function Team() {
  return (
    <div>
      <h1 style={styles.heading}>👥 Team Activity Logs</h1>
      <p style={styles.text}>
        Get a transparent overview of your team’s activity and uploads.
      </p>
    </div>
  );
}

/* ------------------------------------ */
/*                STYLES                 */
/* ------------------------------------ */

const styles = {
  wrapper: {
    display: "flex",
    height: "100vh",
    background: "#f4f6f9",
    fontFamily: "Poppins, sans-serif",
  },
  sidebar: {
    width: "250px",
    background: "#ffffff",
    borderRight: "1px solid #e5e5e5",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  logo: {
    fontSize: "20px",
    fontWeight: 700,
    color: "#14A4D8",
    marginBottom: "25px",
  },
  menuItem: {
    padding: "12px",
    borderRadius: "8px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    fontSize: "15px",
    transition: "0.2s ease",
  },
  icon: {
    fontSize: "18px",
  },
  content: {
    flex: 1,
    padding: "30px",
    overflowY: "auto",
  },
  heading: {
    fontSize: "26px",
    fontWeight: 700,
    marginBottom: "10px",
  },
  text: {
    fontSize: "15px",
    color: "#555",
  },
};
