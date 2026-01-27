// import React, { useEffect, useState, useContext } from "react";
// import { ThemeContext } from "../ThemeSettings/ThemeContext";
// import UserManagement from "./UserManagement";
// import UploadedReports from "./UploadedReports";
// import Settings from "./AdminSettings";
// import AdminAnalytics from "./AdminAnalytics";
// import SecurityInsights from "./AdminSecurityInsights";

// const AdminPanel = () => {
//   const [activeTab, setActiveTab] = useState("users");
//   const { theme } = useContext(ThemeContext);

//   const renderTab = () => {
//     switch (activeTab) {
//       case "Analytics":
//         return <AdminAnalytics />;
//       case "users":
//         return <UserManagement />;
//       case "uploaded Reports":
//         return <UploadedReports />;
//       case "settings":
//         return <Settings />;
//          case "security insights":
//         return <SecurityInsights/>
//       default:
//         return null;
//     }
//   };

//   const colors = {
//     wrapperBg: theme === "dark" ? "#0f172a" : "#f4f6f8",
//     sidebarBg: theme === "dark" ? "#1e293b" : "#002b36",
//     mainText: theme === "dark" ? "#e2e8f0" : "#111",
//     navInactive: theme === "dark" ? "#334155" : "transparent",
//   };

//   return (
//     <div
//       style={{
//         ...styles.wrapper,
//         background: colors.wrapperBg,
//         color: colors.mainText,
//       }}
//     >
//       {/* ✅ Sidebar */}
//       <aside
//         style={{
//           ...styles.sidebar,
//           background: colors.sidebarBg,
//         }}
//       >
//         <h2 style={styles.sidebarTitle}>Admin Panel</h2>

//         {["users", "Analytics", "uploaded Reports","security insights", "settings"].map((tab) => (
//           <button
//             key={tab}
//             style={{
//               ...styles.navBtn,
//               background: activeTab === tab ? "#00C49F" : colors.navInactive,
//               color: "#fff",
//             }}
//             onClick={() => setActiveTab(tab)}
//           >
//             {tab.charAt(0).toUpperCase() + tab.slice(1)}
//           </button>
//         ))}
//       </aside>

//       {/* ✅ Main View */}
//       <main style={styles.main}>{renderTab()}</main>
//     </div>
//   );
// };

// const styles = {
//   wrapper: {
//     width: "100%",
//     minHeight: "100vh",
//     display: "flex",
//     overflowX: "hidden",
//     overflowY: "hidden",
//   },

//   sidebar: {
//     width: "240px",
//     padding: "20px 18px",
//     display: "flex",
//     flexDirection: "column",
//     gap: "14px",
//     position: "fixed",
//     left: 0,
//     top: 0,
//     height: "100vh",
//     overflowY: "auto", // ✅ scroll only inside sidebar
//     boxSizing: "border-box",
//     scrollbarWidth: "thin",
//   },

//   sidebarTitle: {
//     color: "#fff",
//     fontSize: "22px",
//     fontWeight: "700",
//     marginBottom: "30px",
//   },

//   main: {
//     marginLeft: "240px",
//     width: "calc(100% - 240px)",
//     padding: "20px",
//     boxSizing: "border-box", // ✅ prevents stretching
//     overflowY: "auto",
//   },

//   navBtn: {
//     color: "#fff",
//     padding: "12px",
//     border: "none",
//     textAlign: "left",
//     cursor: "pointer",
//     fontSize: "16px",
//     borderRadius: "8px",
//     width: "100%",
//     transition: "0.25s ease",
//     fontWeight: "500",
//     letterSpacing: "0.3px",
//   },
// };

// export default AdminPanel;
import React, { useState, useContext } from "react";
import { ThemeContext } from "../ThemeSettings/ThemeContext";

import UserManagement from "./UserManagement";
import UploadedReports from "./UploadedReports";
import Settings from "./AdminSettings";
import AdminAnalytics from "./AdminAnalytics";
import SecurityInsights from "./AdminSecurityInsights";

const TABS = [
  "users",
  "Analytics",
  "uploaded Reports",
  "security insights",
  "settings",
];

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("users");
  const { theme } = useContext(ThemeContext);

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
    navbarBg: "#6D28D9", // 💜 Violet
    activeBtn: "#D9F99D", // 🍋 Lime
    activeText: "#365314",
    text: "#ffffff",
    contentBg: theme === "dark" ? "#020617" : "transparent",
  };

  return (
    <div style={{ ...styles.page, background: colors.pageBg }}>
      {/* 🔷 TOP NAVBAR */}
      <div style={{ ...styles.navbar, background: colors.navbarBg }}>
        <div style={styles.leftGroup}>
          <div style={styles.brand}>Admin Panel</div>

          <div style={styles.menu}>
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  ...styles.navBtn,
                  ...(activeTab === tab
                    ? {
                        background: colors.activeBtn,
                        color: colors.activeText,
                        fontWeight: 700,
                      }
                    : {}),
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 🔷 MAIN CONTENT */}
      <main style={{ ...styles.main, background: colors.contentBg }}>
        {renderTab()}
      </main>
    </div>
  );
};

// 🎨 STYLES
const styles = {
  page: {
    minHeight: "100vh",
    width: "100%",
  },

  navbar: {
    padding: "14px 28px",
    display: "flex",
    alignItems: "center",
    boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
  },

  leftGroup: {
    display: "flex",
    alignItems: "center",
    gap: "26px",
    flexWrap: "wrap",
  },

  brand: {
    color: "#ffffff",
    fontSize: "20px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },

  menu: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },

  navBtn: {
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.3)",
    color: "#ffffff",
    padding: "8px 16px",
    borderRadius: "999px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "all 0.25s ease",
  },

  main: {
    padding: "24px",
    boxSizing: "border-box",
  },
};

export default AdminPanel;
