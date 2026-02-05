
// // import React, { useEffect, useState, useContext } from "react";
// // import LoginActivity from "./LoginActivity";
// // import FailedLoginAttempts from "./FailedLoginAttempts";
// // import OnlineUsers from "./Onlineuser";
// // import { ThemeContext } from "../ThemeSettings/ThemeContext";
// // import BlockedUsers from "./BlockedUsers";

// // export default function SecurityInsights() {
// //   const { theme } = useContext(ThemeContext);
// //   const isDark = theme === "dark";

// //   const [onlineUsers, setOnlineUsers] = useState([]);
// //   const [lastLogin, setLastLogin] = useState([]);
// //   const [blockedAccounts, setBlockedAccounts] = useState([]);

// //   // 🎨 Theme-specific colors
// //   const themeColors = {
// //     cardBg: isDark ? "#1e293b" : "#ffffff",
// //     text: isDark ? "#e2e8f0" : "#111827",
// //     border: isDark ? "#334155" : "#ccc",
// //     tableHeaderBg: isDark ? "#334155" : "#082f3d",
// //     pageBg: isDark ? "#0f172a" : "#f8fafc",
// //     shadow: isDark ? "0 2px 8px rgba(0,0,0,0.5)" : "0 2px 8px rgba(0,0,0,0.08)",
// //   };

// //   useEffect(() => {
// //     loadOnlineUsers();
// //     loadLastLogin();
// //     loadBlockedAccounts();
// //   }, []);

// //   // ✅ Dummy values until API ready
// //   const loadOnlineUsers = () => {
// //     setOnlineUsers([
// //       { user: "admin", status: "online", lastActive: "11:35 AM" },
// //       { user: "user1", status: "offline", lastActive: "10:10 AM" },
// //       { user: "user2", status: "online", lastActive: "11:32 AM" },
// //     ]);
// //   };

// //   const loadLastLogin = () => {
// //     setLastLogin([
// //       { user: "admin", time: "2025-02-11 08:45 AM", ip: "192.168.1.101", device: "Chrome" },
// //       { user: "user1", time: "2025-02-11 09:22 AM", ip: "192.168.1.102", device: "Firefox" },
// //       { user: "user2", time: "2025-02-11 10:12 AM", ip: "192.168.1.103", device: "Edge" },
// //     ]);
// //   };

// //   const loadBlockedAccounts = () => {
// //     setBlockedAccounts([
// //       { user: "user4", reason: "3 failed attempts", blockedAt: "2025-02-11 09:30 AM" },
// //     ]);
// //   };

// //   return (
// //     <div
// //       style={{
// //         padding: "20px",
// //         background: themeColors.pageBg,
// //         minHeight: "100vh",
// //         color: themeColors.text,
// //         transition: "0.3s",
// //       }}
// //     >
// //       <h1 style={{ fontSize: "26px", fontWeight: "bold", marginBottom: "20px", color: themeColors.text }}>
// //         Security & Login Monitoring
// //       </h1>

// //       {/* ✅ LOGIN ACTIVITY SECTION */}
// //       <section
// //         style={{
// //           ...styles.card,
// //           background: themeColors.cardBg,
// //           color: themeColors.text,
// //           border: `1px solid ${themeColors.border}`,
// //           boxShadow: themeColors.shadow,
// //         }}
// //       >
// //          <OnlineUsers />
        
// //       </section>

// //       {/* ✅ FAILED LOGIN ATTEMPTS SECTION */}
// //       <section
// //         style={{
// //           ...styles.card,
// //           background: themeColors.cardBg,
// //           color: themeColors.text,
// //           border: `1px solid ${themeColors.border}`,
// //           boxShadow: themeColors.shadow,
// //         }}
// //       >
// //         <FailedLoginAttempts />
// //       </section>

// //       {/* ✅ NEW FEATURE 2 — ONLINE USERS */}
// //       <section
// //         style={{
// //           ...styles.card,
// //           background: themeColors.cardBg,
// //           color: themeColors.text,
// //           border: `1px solid ${themeColors.border}`,
// //           boxShadow: themeColors.shadow,
// //         }}
// //       >
// //        <LoginActivity />
// //       </section>

// //  <section
// //         style={{
// //           ...styles.card,
// //           background: themeColors.cardBg,
// //           color: themeColors.text,
// //           border: `1px solid ${themeColors.border}`,
// //           boxShadow: themeColors.shadow,
// //         }}
// //       >
// //         <BlockedUsers/>
// //       </section>
     
// //     </div>
// //   );
// // }

// // const styles = {
// //   card: {
// //     padding: "20px",
// //     borderRadius: "10px",
// //     marginBottom: "25px",
// //     transition: "0.3s ease",
// //   },
// //   th: {
// //     padding: "10px",
// //     fontWeight: "600",
// //     color: "white",
// //   },
// //   td: {
// //     padding: "10px",
// //   },
// // };

// import React, { useEffect, useState, useContext } from "react";
// import LoginActivity from "./LoginActivity";
// import FailedLoginAttempts from "./FailedLoginAttempts";
// import OnlineUsers from "./Onlineuser";
// import BlockedUsers from "./BlockedUsers";
// import { ThemeContext } from "../ThemeSettings/ThemeContext";

// export default function SecurityInsights() {
//   const { theme } = useContext(ThemeContext);
//   const isDark = theme === "dark";

//   const [loading, setLoading] = useState(true); // ✅ skeleton

//   // 🎨 Theme colors
//   const themeColors = {
//     cardBg: isDark ? "#1e293b" : "#ffffff",
//     text: isDark ? "#e2e8f0" : "#111827",
//     border: isDark ? "#334155" : "#ccc",
//     pageBg: isDark ? "#0f172a" : "#f8fafc",
//     shadow: isDark
//       ? "0 4px 12px rgba(0,0,0,0.6)"
//       : "0 4px 12px rgba(0,0,0,0.08)",
//   };

//   useEffect(() => {
//     // simulate loading (API ready later)
//     setTimeout(() => setLoading(false), 1200);
//   }, []);

//   return (
//     <div
//       style={{
//         padding: "40px",
//         background: themeColors.pageBg,
//         minHeight: "100vh",
//         color: themeColors.text,
//       }}
//     >
//       <h1
//         style={{
//           fontSize: "42px",
//           fontWeight: 800,
//           marginBottom: "35px",
//           textAlign: "center",
//         }}
//       >
//         🔐 Security & Login Monitoring
//       </h1>

//       {/* ===== LOGIN ACTIVITY ===== */}
//       <SectionCard themeColors={themeColors}>
//         {loading ? <SkeletonBlock /> : <OnlineUsers />}
//       </SectionCard>

//       {/* ===== FAILED LOGINS ===== */}
//       <SectionCard themeColors={themeColors}>
//         {loading ? <SkeletonBlock /> : <FailedLoginAttempts />}
//       </SectionCard>

//       {/* ===== USER LOGIN HISTORY ===== */}
//       <SectionCard themeColors={themeColors}>
//         {loading ? <SkeletonBlock /> : <LoginActivity />}
//       </SectionCard>

//       {/* ===== BLOCKED USERS ===== */}
//       <SectionCard themeColors={themeColors}>
//         {loading ? <SkeletonBlock /> : <BlockedUsers />}
//       </SectionCard>

//       {/* Skeleton styles */}
//       <style>
//         {`
//           .skeleton {
//             height: 160px;
//             border-radius: 14px;
//             background: linear-gradient(
//               90deg,
//               #e5e7eb 25%,
//               #f3f4f6 37%,
//               #e5e7eb 63%
//             );
//             background-size: 400% 100%;
//             animation: shimmer 1.4s infinite;
//           }

//           @keyframes shimmer {
//             0% { background-position: 100% 0 }
//             100% { background-position: -100% 0 }
//           }
//         `}
//       </style>
//     </div>
//   );
// }

// /* ================= REUSABLE CARD ================= */
// const SectionCard = ({ children, themeColors }) => (
//   <section
//     style={{
//       padding: "28px",
//       borderRadius: "14px",
//       marginBottom: "32px",
//       background: themeColors.cardBg,
//       border: `1px solid ${themeColors.border}`,
//       boxShadow: themeColors.shadow,
//     }}
//   >
//     {children}
//   </section>
// );

// /* ================= SKELETON ================= */
// const SkeletonBlock = () => <div className="skeleton" />;
import React, { useEffect, useState, useContext } from "react";
import LoginActivity from "./LoginActivity";
import FailedLoginAttempts from "./FailedLoginAttempts";
import OnlineUsers from "./Onlineuser";
import BlockedUsers from "./BlockedUsers";
import { ThemeContext } from "../ThemeSettings/ThemeContext";

export default function SecurityInsights() {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const [loading, setLoading] = useState(true);

  const themeColors = {
    cardBg: isDark ? "#1e293b" : "#ffffff",
    text: isDark ? "#e2e8f0" : "#111827",
    border: isDark ? "#334155" : "#ccc",
    pageBg: isDark ? "#0f172a" : "#f8fafc",
    shadow: isDark
      ? "0 4px 14px rgba(0,0,0,0.6)"
      : "0 4px 14px rgba(0,0,0,0.1)",
  };

  useEffect(() => {
    setTimeout(() => setLoading(false), 1200);
  }, []);

  return (
    <div
      style={{
        padding: "48px",
        background: themeColors.pageBg,
        minHeight: "100vh",
        color: themeColors.text,
        fontSize: "20px", // ✅ GLOBAL BASE SIZE
      }}
    >
      <h1
        style={{
          fontSize: "46px",
          fontWeight: 800,
          marginBottom: "40px",
          textAlign: "center",
        }}
      >
        🔐 Security & Login Monitoring
      </h1>

      <SectionCard themeColors={themeColors}>
        {loading ? <SkeletonBlock /> : <OnlineUsers />}
      </SectionCard>

      <SectionCard themeColors={themeColors}>
        {loading ? <SkeletonBlock /> : <FailedLoginAttempts />}
      </SectionCard>

      <SectionCard themeColors={themeColors}>
        {loading ? <SkeletonBlock /> : <LoginActivity />}
      </SectionCard>

      <SectionCard themeColors={themeColors}>
        {loading ? <SkeletonBlock /> : <BlockedUsers />}
      </SectionCard>

      <style>
        {`
          .skeleton {
            height: 180px;
            border-radius: 16px;
            background: linear-gradient(
              90deg,
              #e5e7eb 25%,
              #f3f4f6 37%,
              #e5e7eb 63%
            );
            background-size: 400% 100%;
            animation: shimmer 1.4s infinite;
          }

          @keyframes shimmer {
            0% { background-position: 100% 0 }
            100% { background-position: -100% 0 }
          }

          /* 🔥 FORCE BIGGER TEXT INSIDE ALL SECTIONS */
          section * {
            font-size: 20px !important;
          }

          table th {
            font-size: 22px !important;
            font-weight: 700 !important;
          }

          table td {
            font-size: 20px !important;
          }

          h2, h3 {
            font-size: 28px !important;
            font-weight: 700 !important;
          }
        `}
      </style>
    </div>
  );
}

/* ================= CARD ================= */
const SectionCard = ({ children, themeColors }) => (
  <section
    style={{
      padding: "32px",
      borderRadius: "16px",
      marginBottom: "36px",
      background: themeColors.cardBg,
      border: `1px solid ${themeColors.border}`,
      boxShadow: themeColors.shadow,
    }}
  >
    {children}
  </section>
);

/* ================= SKELETON ================= */
const SkeletonBlock = () => <div className="skeleton" />;
