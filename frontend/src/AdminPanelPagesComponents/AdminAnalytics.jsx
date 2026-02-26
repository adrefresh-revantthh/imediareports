// import React, { useState, useContext } from "react";
// import PublisherPerformance from "./PublisherPerformance";
// import AdvertiserPerformance from "./AdvertiserPerformance";
// import { ThemeContext } from "../ThemeSettings/ThemeContext";

// export default function AdminAnalytics() {
//   const [activeTab, setActiveTab] = useState("publisher");
//   const { theme } = useContext(ThemeContext);

//   // ✅ Theme colors
//   const isDark = theme === "dark";
//   const colors = {
//     text: isDark ? "#e2e8f0" : "#111827",
//     bg: isDark ? "#0f172a" : "#f3f4f6",
//     card: isDark ? "#1e293b" : "#ffffff",
//     tabActive: "#10b981",
//     tabInactive: isDark ? "#334155" : "#e5e7eb",
//     tabInactiveHover: isDark ? "#475569" : "#d1d5db",
//   };

//   return (
//     <div
//       style={{
//         width: "100%",
//         padding: "25px",
//         boxSizing: "border-box",
//         background: colors.bg,
//         color: colors.text,
//       }}
//     >
//       {/* ✅ Title */}
//       <h2
//         style={{
//           fontSize: "26px",
//           fontWeight: "bold",
//           marginBottom: "25px",
//           textAlign: "left",
//           color: colors.text,
//         }}
//       >
//         Admin Analytics & Performance Dashboard
//       </h2>

//       {/* ✅ Tabs */}
//       <div
//         style={{
//           display: "flex",
//           gap: "10px",
//           marginBottom: "25px",
//           flexWrap: "wrap",
//         }}
//       >
//         <button
//           onClick={() => setActiveTab("publisher")}
//           style={{
//             padding: "10px 18px",
//             borderRadius: "6px",
//             cursor: "pointer",
//             border: "none",
//             fontWeight: "600",
//             background:
//               activeTab === "publisher" ? colors.tabActive : colors.tabInactive,
//             color: activeTab === "publisher" ? "#ffffff" : colors.text,
//             transition: "0.3s",
//           }}
//         >
//           Publisher Performance
//         </button>

//         <button
//           onClick={() => setActiveTab("advertiser")}
//           style={{
//             padding: "10px 18px",
//             borderRadius: "6px",
//             cursor: "pointer",
//             border: "none",
//             fontWeight: "600",
//             background:
//               activeTab === "advertiser" ? colors.tabActive : colors.tabInactive,
//             color: activeTab === "advertiser" ? "#ffffff" : colors.text,
//             transition: "0.3s",
//           }}
//         >
//           Advertiser Performance
//         </button>
//       </div>

//       {/* ✅ Render Section */}
//       <div
//         style={{
//           width: "100%",
//           display: "flex",
//           flexDirection: "column",
//           gap: "20px",
//         }}
//       >
//         {activeTab === "publisher" && (
//           <div
//             style={{
//               width: "100%",
//               background: colors.card,
//               padding: "15px",
//               borderRadius: "12px",
//               overflow: "hidden",
//             }}
//           >
//             <PublisherPerformance />
//           </div>
//         )}

//         {activeTab === "advertiser" && (
//           <div
//             style={{
//               width: "100%",
//               background: colors.card,
//               padding: "15px",
//               borderRadius: "12px",
//               overflow: "hidden",
//             }}
//           >
//             <AdvertiserPerformance />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
import React, { useState, useContext } from "react";
import PublisherPerformance from "./PublisherPerformance";
import AdvertiserPerformance from "./AdvertiserPerformance";
import { ThemeContext } from "../ThemeSettings/ThemeContext";

/* ════════════════════════════════════════
   TABS CONFIG — easy to extend
════════════════════════════════════════ */
const TABS = [
  { key: "publisher",  label: "Publisher Performance",  Component: PublisherPerformance  },
  { key: "advertiser", label: "Advertiser Performance", Component: AdvertiserPerformance },
];

export default function AdminAnalytics() {
  const [activeTab, setActiveTab] = useState("publisher");
  const { theme } = useContext(ThemeContext);

  const isDark = theme === "dark";

  /* ── Theme tokens ── */
  const colors = {
    bg:              isDark ? "#0f172a"  : "#f9fafb",
    card:            isDark ? "#1e293b"  : "#ffffff",
    border:          isDark ? "#334155"  : "#dcdcdc",
    text:            isDark ? "#e2e8f0"  : "#1f2937",
    muted:           isDark ? "#94a3b8"  : "#6b7280",
    tabActiveBg:     "#007bff",
    tabActiveColor:  "#ffffff",
    tabInactiveBg:   isDark ? "#334155"  : "#f3f4f6",
    tabInactiveColor:isDark ? "#cbd5e1"  : "#6b7280",
    tabHoverBg:      isDark ? "#475569"  : "#e5e7eb",
  };

  const ActiveComponent = TABS.find((t) => t.key === activeTab)?.Component;

  /* ── Styles ── */
  const s = {
    page: {
      width: "100%",
      minHeight: "100vh",
      padding: "28px",
      boxSizing: "border-box",
      background: colors.bg,
      color: colors.text,
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    },
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "24px",
      flexWrap: "wrap",
      gap: "12px",
    },
    title: {
      fontSize: "24px",
      fontWeight: "700",
      color: colors.text,
      margin: 0,
    },
    tabBar: {
      display: "flex",
      gap: "8px",
      marginBottom: "24px",
      borderBottom: `1px solid ${colors.border}`,
      paddingBottom: "0",
    },
    tabBtn: (isActive) => ({
      padding: "9px 20px",
      borderRadius: "0",
      border: "none",
      borderBottom: isActive ? "2px solid #007bff" : "2px solid transparent",
      marginBottom: "-1px",
      cursor: "pointer",
      fontWeight: isActive ? "700" : "500",
      fontSize: "14px",
      background: "transparent",
      color: isActive ? "#007bff" : colors.muted,
      transition: "all 0.15s",
    }),
    contentCard: {
      width: "100%",
      background: colors.card,
      border: `1px solid ${colors.border}`,
      borderRadius: "10px",
      boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
      overflow: "hidden",

      /* ── Table border injection ──
         Targets any <table> rendered inside child components
         so PublisherPerformance / AdvertiserPerformance tables
         automatically get bordered cells                        */
    },
  };

  return (
    <div style={s.page}>

      {/* Global table border styles — injected once here so all
          child component tables get bordered cells automatically */}
      <style>{`
        /* Border for ALL table cells inside AdminAnalytics */
        .admin-analytics-content table {
          border-collapse: collapse !important;
          width: 100% !important;
        }
        .admin-analytics-content table th,
        .admin-analytics-content table td {
          border: 1px solid ${colors.border} !important;
          padding: 10px 14px !important;
        }
        .admin-analytics-content table th {
          background: ${isDark ? "#1e3a5f" : "#f0f6ff"} !important;
          color: ${isDark ? "#93c5fd" : "#1d4ed8"} !important;
          font-size: 12px !important;
          font-weight: 700 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.05em !important;
          white-space: nowrap !important;
        }
        .admin-analytics-content table td {
          font-size: 13px !important;
          color: ${colors.text} !important;
          background: ${colors.card} !important;
        }
        .admin-analytics-content table tbody tr:hover td {
          background: ${isDark ? "#1e293b" : "#f8fafc"} !important;
        }
        .admin-analytics-content table tbody tr:last-child td {
          border-bottom: 1px solid ${colors.border} !important;
        }
      `}</style>

      {/* HEADER */}
      <div style={s.header}>
        <h2 style={s.title}>📊 Analytics & Performance</h2>
      </div>

      {/* TABS */}
      <div style={s.tabBar}>
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            style={s.tabBtn(activeTab === key)}
            onMouseEnter={(e) => {
              if (activeTab !== key) e.target.style.color = colors.text;
            }}
            onMouseLeave={(e) => {
              if (activeTab !== key) e.target.style.color = colors.muted;
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div style={s.contentCard} className="admin-analytics-content">
        {ActiveComponent && <ActiveComponent />}
      </div>

    </div>
  );
}
