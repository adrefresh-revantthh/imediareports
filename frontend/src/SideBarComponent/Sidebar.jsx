import React from "react";
import { NavLink } from "react-router-dom";
import {
  BarChart3,
  Calendar,
  PlayCircle,
  LayoutDashboard,
  Monitor,
} from "lucide-react";

const Sidebar = () => {
  const menuItems = [
    { name: "Upload", path: "/main", icon: <LayoutDashboard size={20} /> },
    { name: "Overview", path: "/overall", icon: <Monitor size={20} /> },
    { name: "OTT", path: "/daily", icon: <Calendar size={20} /> },
    { name: "DisplayData", path: "/display", icon: <BarChart3 size={20} /> },
    { name: "Video Ads", path: "/video", icon: <PlayCircle size={20} /> },
    { name: "Widget Report", path: "/adw", icon: <BarChart3 size={20} /> },
  ];

  return (
    <aside
      style={styles.sidebar}
    >
      <h2 style={styles.title}>📊 Analytics</h2>

      {menuItems.map((item, index) => (
        <NavLink
          key={index}
          to={item.path}
          style={({ isActive }) => ({
            ...styles.navItem,
            background: isActive ? "#ffffff" : "transparent",
            color: isActive ? "#000000" : "#ffffff",
          })}
        >
          {item.icon}
          <span>{item.name}</span>
        </NavLink>
      ))}
    </aside>
  );
};

const styles = {
  sidebar: {
    width: "240px",
    minHeight: "100vh",
    background: "#000",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    padding: "20px 15px",
    boxSizing: "border-box",

    // ✅ IMPORTANT FIXES:
    position: "relative",     // ✅ no longer fixed
    left: 0,
    top: 0,
    overflowY: "auto",
  },

  title: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: "20px",
    marginBottom: "25px",
  },

  navItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px 15px",
    borderRadius: "8px",
    textDecoration: "none",
    marginBottom: "12px",
    cursor: "pointer",
    transition: "0.3s",
    fontSize: "15px",
  },
};

export default Sidebar;
