
// // import React, { useEffect, useState, useContext, useRef, useCallback } from "react";
// // import axios from "axios";
// // import { ThemeContext } from "../ThemeSettings/ThemeContext";

// // /* ════════════════════════════════════════
// //    CONSTANTS
// // ════════════════════════════════════════ */
// // const HEARTBEAT_INTERVAL = 10_000;  // every 10s — not 3s (3s was causing server overload)
// // const FETCH_INTERVAL     = 15_000;  // fetch online users every 15s
// // const PAGE_SIZE          = 5;

// // /* ════════════════════════════════════════
// //    HELPERS
// // ════════════════════════════════════════ */
// // const getToken = () => JSON.parse(localStorage.getItem("jwt"))?.token;

// // const formatTime = (time) => {
// //   if (!time) return "Never";
// //   const d = new Date(time);
// //   return isNaN(d.getTime()) ? "Invalid" : d.toLocaleString();
// // };

// // /* ════════════════════════════════════════
// //    COMPONENT
// // ════════════════════════════════════════ */
// // const OnlineUsers = () => {
// //   const [users,       setUsers]       = useState([]);
// //   const [loading,     setLoading]     = useState(true);
// //   const [error,       setError]       = useState(null);
// //   const [visibleCount,setVisibleCount]= useState(PAGE_SIZE);
// //   const [lastUpdated, setLastUpdated] = useState(null);

// //   const { theme } = useContext(ThemeContext);
// //   const isDark = theme === "dark";

// //   // ── Theme tokens matching existing dashboards ──
// //   const c = {
// //     bg:       isDark ? "#0f172a" : "#f9fafb",
// //     card:     isDark ? "#1e293b" : "#ffffff",
// //     border:   isDark ? "#334155" : "#dcdcdc",
// //     text:     isDark ? "#e2e8f0" : "#1f2937",
// //     muted:    isDark ? "#94a3b8" : "#6b7280",
// //     thBg:     isDark ? "#1e3a5f" : "#f0f6ff",
// //     thColor:  isDark ? "#93c5fd" : "#1d4ed8",
// //     rowHover: isDark ? "#263348" : "#f8fafc",
// //     btnBg:    isDark ? "#334155" : "#f3f4f6",
// //     btnBorder:isDark ? "#475569" : "#dcdcdc",
// //   };

// //   /* ── Stable axios instance with auth header ── */
// //   const api = useRef(
// //     axios.create({ baseURL: "https://imediareports.onrender.com/api" })
// //   ).current;

// //   /* ────────────────────────────────────────
// //      HEARTBEAT
// //      Tells the server "this user is still active"
// //      Sends every 10s — not 3s to avoid server overload
// //   ──────────────────────────────────────── */
// //   useEffect(() => {
// //     const token = getToken();
// //     if (!token) return;

// //     const beat = async () => {
// //       try {
// //         await api.post(
// //           "/heartbeat",
// //           {},
// //           { headers: { Authorization: `Bearer ${token}` } }
// //         );
// //       } catch (err) {
// //         // Non-critical — just log, don't crash
// //         console.warn("Heartbeat failed:", err.message);
// //       }
// //     };

// //     // Fire immediately on mount so user shows as online right away
// //     beat();
// //     const id = setInterval(beat, HEARTBEAT_INTERVAL);
// //     return () => clearInterval(id);
// //   }, []); // ✅ empty deps — runs once, stable interval

// //   /* ────────────────────────────────────────
// //      FETCH ONLINE USERS
// //      Separate from heartbeat — different cadence
// //   ──────────────────────────────────────── */
// //   const fetchUsers = useCallback(async () => {
// //     const token = getToken();
// //     if (!token) {
// //       setError("Not authenticated");
// //       setLoading(false);
// //       return;
// //     }

// //     try {
// //       const res = await api.get("/online-users", {
// //         headers: { Authorization: `Bearer ${token}` },
// //         params:  { t: Date.now() }, // cache-bust
// //       });

// //       const fetched = res.data?.users || [];
// //       setUsers(fetched);
// //       setLastUpdated(new Date());
// //       setError(null);

// //       console.log(`✅ Online users fetched: ${fetched.length}`);
// //     } catch (err) {
// //       console.error("Fetch users failed:", err.message);
// //       setError("Failed to load users. Retrying…");
// //     } finally {
// //       setLoading(false);
// //     }
// //   }, []); // ✅ stable — no deps that change

// //   useEffect(() => {
// //     fetchUsers(); // immediate on mount
// //     const id = setInterval(fetchUsers, FETCH_INTERVAL);
// //     return () => clearInterval(id);
// //   }, [fetchUsers]);

// //   /* ── Pagination ── */
// //   const visibleUsers = users.slice(0, visibleCount);
// //   const onlineCount  = users.filter((u) => u.isOnline).length;
// //   const offlineCount = users.length - onlineCount;

// //   const handleViewMore = () => {
// //     setVisibleCount((prev) =>
// //       prev >= users.length ? PAGE_SIZE : Math.min(prev + PAGE_SIZE, users.length)
// //     );
// //   };

// //   /* ── Inline styles matching existing dashboards ── */
// //   const s = {
// //     wrap: {
// //       padding: "24px",
// //       background: c.bg,
// //       minHeight: "100vh",
// //       fontFamily: "'Inter', system-ui, sans-serif",
// //       color: c.text,
// //     },
// //     header: {
// //       display: "flex",
// //       alignItems: "center",
// //       justifyContent: "space-between",
// //       marginBottom: "20px",
// //       flexWrap: "wrap",
// //       gap: "10px",
// //     },
// //     title: { fontSize: "22px", fontWeight: "700", color: c.text, margin: 0 },
// //     meta: { fontSize: "12px", color: c.muted },
// //     // Status pill counts
// //     pillRow: { display: "flex", gap: "10px", marginBottom: "16px", flexWrap: "wrap" },
// //     pill: (color) => ({
// //       display: "inline-flex",
// //       alignItems: "center",
// //       gap: "6px",
// //       padding: "4px 12px",
// //       borderRadius: "999px",
// //       fontSize: "12px",
// //       fontWeight: "600",
// //       background: `${color}18`,
// //       color,
// //       border: `1px solid ${color}40`,
// //     }),
// //     dot: (color) => ({
// //       width: "8px", height: "8px",
// //       borderRadius: "50%",
// //       background: color,
// //       flexShrink: 0,
// //     }),
// //     // Card wrapping the table
// //     tableCard: {
// //       background: c.card,
// //       border: `1px solid ${c.border}`,
// //       borderRadius: "10px",
// //       boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
// //       overflow: "hidden",
// //     },
// //     table: { width: "100%", borderCollapse: "collapse", fontSize: "13px" },
// //     th: {
// //       padding: "10px 14px",
// //       textAlign: "left",
// //       fontWeight: "700",
// //       fontSize: "12px",
// //       textTransform: "uppercase",
// //       letterSpacing: "0.05em",
// //       background: c.thBg,
// //       color: c.thColor,
// //       border: `1px solid ${c.border}`,
// //       whiteSpace: "nowrap",
// //     },
// //     td: {
// //       padding: "10px 14px",
// //       fontSize: "13px",
// //       color: c.text,
// //       border: `1px solid ${c.border}`,
// //     },
// //     // Status badge inside table
// //     statusBadge: (online) => ({
// //       display: "inline-flex",
// //       alignItems: "center",
// //       gap: "6px",
// //       padding: "3px 10px",
// //       borderRadius: "999px",
// //       fontSize: "12px",
// //       fontWeight: "600",
// //       background: online ? "#22c55e18" : "#ef444418",
// //       color: online ? "#16a34a" : "#dc2626",
// //       border: `1px solid ${online ? "#22c55e40" : "#ef444440"}`,
// //     }),
// //     statusDot: (online) => ({
// //       width: "7px", height: "7px",
// //       borderRadius: "50%",
// //       background: online ? "#22c55e" : "#ef4444",
// //       flexShrink: 0,
// //     }),
// //     // Refresh + view-more buttons
// //     btnRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "14px" },
// //     btn: {
// //       padding: "8px 18px",
// //       borderRadius: "6px",
// //       border: `1px solid ${c.btnBorder}`,
// //       background: c.btnBg,
// //       color: c.text,
// //       fontSize: "13px",
// //       fontWeight: "500",
// //       cursor: "pointer",
// //       transition: "background 0.15s",
// //     },
// //     refreshBtn: {
// //       padding: "8px 18px",
// //       borderRadius: "6px",
// //       border: "1px solid #007bff",
// //       background: "transparent",
// //       color: "#007bff",
// //       fontSize: "13px",
// //       fontWeight: "500",
// //       cursor: "pointer",
// //     },
// //     // Skeleton
// //     skRow: {
// //       height: "42px", borderRadius: "6px", marginBottom: "8px",
// //       background: "linear-gradient(90deg,#e5e7eb 25%,#f3f4f6 37%,#e5e7eb 63%)",
// //       backgroundSize: "400% 100%", animation: "shimmer 1.4s infinite",
// //     },
// //     emptyCell: { textAlign: "center", color: c.muted, padding: "40px 14px" },
// //     errorBox: {
// //       background: "#fee2e2", color: "#dc2626",
// //       border: "1px solid #fca5a5",
// //       borderRadius: "8px", padding: "12px 16px",
// //       fontSize: "13px", marginBottom: "14px",
// //     },
// //   };

// //   return (
// //     <div style={s.wrap}>
// //       <style>{`
// //         @keyframes shimmer {
// //           0%   { background-position: 100% 0; }
// //           100% { background-position: -100% 0; }
// //         }
// //         .ou-tr:hover td { background: ${c.rowHover} !important; }
// //       `}</style>

// //       {/* ── HEADER ── */}
// //       <div style={s.header}>
// //         <div>
// //           <h2 style={s.title}>👥 User Online Status</h2>
// //           {lastUpdated && (
// //             <div style={s.meta}>
// //               Last updated: {lastUpdated.toLocaleTimeString()} · auto-refreshes every {FETCH_INTERVAL / 1000}s
// //             </div>
// //           )}
// //         </div>
// //         <button style={s.refreshBtn} onClick={fetchUsers}>
// //           ↻ Refresh
// //         </button>
// //       </div>

// //       {/* ── ONLINE / OFFLINE COUNT PILLS ── */}
// //       {!loading && users.length > 0 && (
// //         <div style={s.pillRow}>
// //           <span style={s.pill("#16a34a")}>
// //             <span style={s.dot("#22c55e")} />
// //             {onlineCount} Online
// //           </span>
// //           <span style={s.pill("#dc2626")}>
// //             <span style={s.dot("#ef4444")} />
// //             {offlineCount} Offline
// //           </span>
// //           <span style={s.pill("#6b7280")}>
// //             {users.length} Total
// //           </span>
// //         </div>
// //       )}

// //       {/* ── ERROR ── */}
// //       {error && <div style={s.errorBox}>⚠️ {error}</div>}

// //       {/* ── TABLE ── */}
// //       <div style={s.tableCard}>
// //         {loading ? (
// //           <div style={{ padding: "16px" }}>
// //             {Array.from({ length: 5 }).map((_, i) => (
// //               <div key={i} style={s.skRow} />
// //             ))}
// //           </div>
// //         ) : (
// //           <div style={{ overflowX: "auto" }}>
// //             <table style={s.table}>
// //               <thead>
// //                 <tr>
// //                   {["#", "Name", "Email", "Role", "Status", "Last Active"].map((h) => (
// //                     <th key={h} style={s.th}>{h}</th>
// //                   ))}
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {visibleUsers.length === 0 ? (
// //                   <tr>
// //                     <td colSpan={6} style={{ ...s.td, ...s.emptyCell }}>
// //                       No users found
// //                     </td>
// //                   </tr>
// //                 ) : (
// //                   visibleUsers.map((user, i) => (
// //                     <tr key={user._id || i} className="ou-tr">
// //                       <td style={{ ...s.td, color: c.muted, width: "40px" }}>{i + 1}</td>
// //                       <td style={{ ...s.td, fontWeight: "600" }}>{user.name || "—"}</td>
// //                       <td style={s.td}>{user.email || "—"}</td>
// //                       <td style={s.td}>
// //                         <span style={{
// //                           padding: "2px 8px",
// //                           borderRadius: "4px",
// //                           fontSize: "11px",
// //                           fontWeight: "600",
// //                           background: "#007bff18",
// //                           color: "#007bff",
// //                           textTransform: "capitalize",
// //                         }}>
// //                           {user.role || "user"}
// //                         </span>
// //                       </td>
// //                       <td style={s.td}>
// //                         <span style={s.statusBadge(user.isOnline)}>
// //                           <span style={s.statusDot(user.isOnline)} />
// //                           {user.isOnline ? "Online" : "Offline"}
// //                         </span>
// //                       </td>
// //                       <td style={{ ...s.td, color: c.muted }}>
// //                         {formatTime(user.lastActive)}
// //                       </td>
// //                     </tr>
// //                   ))
// //                 )}
// //               </tbody>
// //             </table>
// //           </div>
// //         )}
// //       </div>

// //       {/* ── PAGINATION ── */}
// //       {users.length > PAGE_SIZE && (
// //         <div style={s.btnRow}>
// //           <span style={{ fontSize: "12px", color: c.muted }}>
// //             Showing {Math.min(visibleCount, users.length)} of {users.length} users
// //           </span>
// //           <button style={s.btn} onClick={handleViewMore}>
// //             {visibleCount >= users.length ? "▲ Show Less" : `▼ Show More (${users.length - visibleCount} remaining)`}
// //           </button>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default OnlineUsers;

// import React, { useEffect, useState, useContext, useRef, useCallback } from "react";
// import axios from "axios";
// import { ThemeContext } from "../ThemeSettings/ThemeContext";

// /* ════════════════════════════════════════
//    TIMING — must stay in sync with backend AUTO_OFFLINE_MS (25s)
   
//    Heartbeat: 8s  → server sees beat every 8s
//    Offline:   25s → needs 3 missed beats to go offline
//    Fetch:     10s → UI refreshes every 10s
// ════════════════════════════════════════ */
// const HEARTBEAT_INTERVAL = 8_000;   // ✅ 8s — well under 25s offline threshold
// const FETCH_INTERVAL     = 10_000;  // ✅ 10s — snappy UI updates
// const PAGE_SIZE          = 5;

// const getToken = () => {
//   try { return JSON.parse(localStorage.getItem("jwt"))?.token; }
//   catch { return null; }
// };

// const formatTime = (time) => {
//   if (!time) return "Never";
//   const d = new Date(time);
//   return isNaN(d.getTime()) ? "—" : d.toLocaleString();
// };

// /* ════════════════════════════════════════
//    COMPONENT
// ════════════════════════════════════════ */
// const OnlineUsers = () => {
//   const [users,        setUsers]        = useState([]);
//   const [loading,      setLoading]      = useState(true);
//   const [error,        setError]        = useState(null);
//   const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
//   const [lastUpdated,  setLastUpdated]  = useState(null);
//   const [heartbeatOk,  setHeartbeatOk]  = useState(null); // ✅ shows beat status

//   const { theme } = useContext(ThemeContext);
//   const isDark = theme === "dark";

//   const c = {
//     bg:       isDark ? "#0f172a" : "#f9fafb",
//     card:     isDark ? "#1e293b" : "#ffffff",
//     border:   isDark ? "#334155" : "#dcdcdc",
//     text:     isDark ? "#e2e8f0" : "#1f2937",
//     muted:    isDark ? "#94a3b8" : "#6b7280",
//     thBg:     isDark ? "#1e3a5f" : "#f0f6ff",
//     thColor:  isDark ? "#93c5fd" : "#1d4ed8",
//     rowHover: isDark ? "#263348" : "#f8fafc",
//     btnBg:    isDark ? "#334155" : "#f3f4f6",
//     btnBorder:isDark ? "#475569" : "#dcdcdc",
//   };

//   // ✅ Stable axios instance — created once, never recreated
//   const api = useRef(
//     axios.create({ baseURL: "https://imediareports.onrender.com/api" })
//   ).current;

//   /* ────────────────────────────────────────
//      HEARTBEAT — fires every 8s
//      Sends Authorization header (NOT body)
//   ──────────────────────────────────────── */
//   useEffect(() => {
//     const token = getToken();
//     if (!token) return;

//     const beat = async () => {
//       try {
//         await api.post(
//           "/heartbeat",
//           {},  // empty body — token goes in header only
//        { headers: { authorization: `Bearer ${token}` } }
//         );
//         setHeartbeatOk(true);
//         console.log("💚 Heartbeat sent:", new Date().toLocaleTimeString());
//       } catch (err) {
//         setHeartbeatOk(false);
//         console.log(err.response?.status, err.message);
        
//         console.warn("💔 Heartbeat failed:", err.response?.status, err.message);
//       }
//     };

//     beat(); // immediate on mount
//     const id = setInterval(beat, HEARTBEAT_INTERVAL);
//     return () => clearInterval(id);
//   }, []); // empty deps — runs once

//   /* ────────────────────────────────────────
//      FETCH ALL USERS — fires every 10s
//   ──────────────────────────────────────── */
//   const fetchUsers = useCallback(async () => {
//     const token = getToken();
//     if (!token) {
//       setError("Not authenticated — please log in again");
//       setLoading(false);
//       return;
//     }

//     try {
//       const res = await api.get("/online-users", {
//         headers: { Authorization: `Bearer ${token}` },
//         params:  { t: Date.now() }, // prevent caching
//       });

//       const fetched = res.data?.users || [];
//       setUsers(fetched);
//       setLastUpdated(new Date());
//       setError(null);

//       const online = fetched.filter((u) => u.isOnline).length;
//       console.log(`👥 Users fetched: ${fetched.length} total, ${online} online`);
//     } catch (err) {
//       console.error("Fetch users error:", err.response?.status, err.message);
//       setError("Could not load users — retrying…");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchUsers();
//     const id = setInterval(fetchUsers, FETCH_INTERVAL);
//     return () => clearInterval(id);
//   }, [fetchUsers]);

//   /* ── Derived values ── */
//   const visibleUsers = users.slice(0, visibleCount);
//   const onlineCount  = users.filter((u) => u.isOnline).length;
//   const offlineCount = users.length - onlineCount;

//   const handleViewMore = () =>
//     setVisibleCount((prev) =>
//       prev >= users.length ? PAGE_SIZE : Math.min(prev + PAGE_SIZE, users.length)
//     );

//   /* ── Styles ── */
//   const s = {
//     wrap: {
//       padding: "24px",
//       background: c.bg,
//       minHeight: "100vh",
//       fontFamily: "'Inter', system-ui, sans-serif",
//       color: c.text,
//     },
//     header: {
//       display: "flex", alignItems: "flex-start",
//       justifyContent: "space-between",
//       marginBottom: "20px", flexWrap: "wrap", gap: "10px",
//     },
//     title: { fontSize: "22px", fontWeight: "700", color: c.text, margin: 0 },
//     meta:  { fontSize: "12px", color: c.muted, marginTop: "4px" },
//     heartbeatDot: {
//       display: "inline-block",
//       width: "8px", height: "8px",
//       borderRadius: "50%",
//       marginRight: "6px",
//       background: heartbeatOk === null ? "#f5a623"
//                 : heartbeatOk         ? "#22c55e"
//                 :                       "#ef4444",
//     },
//     pillRow: { display: "flex", gap: "10px", marginBottom: "16px", flexWrap: "wrap" },
//     pill: (color) => ({
//       display: "inline-flex", alignItems: "center", gap: "6px",
//       padding: "4px 12px", borderRadius: "999px",
//       fontSize: "12px", fontWeight: "600",
//       background: `${color}18`, color,
//       border: `1px solid ${color}40`,
//     }),
//     dot: (color) => ({
//       width: "8px", height: "8px",
//       borderRadius: "50%", background: color, flexShrink: 0,
//     }),
//     tableCard: {
//       background: c.card,
//       border: `1px solid ${c.border}`,
//       borderRadius: "10px",
//       boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
//       overflow: "hidden",
//     },
//     table:  { width: "100%", borderCollapse: "collapse", fontSize: "13px" },
//     th: {
//       padding: "10px 14px", textAlign: "left",
//       fontWeight: "700", fontSize: "12px",
//       textTransform: "uppercase", letterSpacing: "0.05em",
//       background: c.thBg, color: c.thColor,
//       border: `1px solid ${c.border}`, whiteSpace: "nowrap",
//     },
//     td: {
//       padding: "10px 14px", fontSize: "13px",
//       color: c.text, border: `1px solid ${c.border}`,
//     },
//     statusBadge: (online) => ({
//       display: "inline-flex", alignItems: "center", gap: "6px",
//       padding: "3px 10px", borderRadius: "999px",
//       fontSize: "12px", fontWeight: "600",
//       background: online ? "#22c55e18" : "#ef444418",
//       color:      online ? "#16a34a"   : "#dc2626",
//       border: `1px solid ${online ? "#22c55e40" : "#ef444440"}`,
//     }),
//     statusDot: (online) => ({
//       width: "7px", height: "7px",
//       borderRadius: "50%",
//       background: online ? "#22c55e" : "#ef4444",
//       flexShrink: 0,
//       ...(online ? { animation: "pulse 2s infinite" } : {}),
//     }),
//     btnRow: {
//       display: "flex", justifyContent: "space-between",
//       alignItems: "center", marginTop: "14px",
//     },
//     btn: {
//       padding: "8px 18px", borderRadius: "6px",
//       border: `1px solid ${c.btnBorder}`,
//       background: c.btnBg, color: c.text,
//       fontSize: "13px", fontWeight: "500", cursor: "pointer",
//     },
//     refreshBtn: {
//       padding: "8px 18px", borderRadius: "6px",
//       border: "1px solid #007bff",
//       background: "transparent", color: "#007bff",
//       fontSize: "13px", fontWeight: "500", cursor: "pointer",
//     },
//     skRow: {
//       height: "42px", borderRadius: "6px", marginBottom: "8px",
//       background: "linear-gradient(90deg,#e5e7eb 25%,#f3f4f6 37%,#e5e7eb 63%)",
//       backgroundSize: "400% 100%", animation: "shimmer 1.4s infinite",
//     },
//     errorBox: {
//       background: "#fee2e2", color: "#dc2626",
//       border: "1px solid #fca5a5",
//       borderRadius: "8px", padding: "12px 16px",
//       fontSize: "13px", marginBottom: "14px",
//     },
//   };

//   return (
//     <div style={s.wrap}>
//       <style>{`
//         @keyframes shimmer {
//           0%   { background-position: 100% 0; }
//           100% { background-position: -100% 0; }
//         }
//         @keyframes pulse {
//           0%, 100% { opacity: 1; }
//           50%       { opacity: 0.4; }
//         }
//         .ou-tr:hover td { background: ${c.rowHover} !important; }
//       `}</style>

//       {/* HEADER */}
//       <div style={s.header}>
//         <div>
//           <h2 style={s.title}>👥 User Online Status</h2>
//           <div style={s.meta}>
//             <span style={s.heartbeatDot} />
//             {heartbeatOk === null ? "Connecting…"
//              : heartbeatOk        ? "Your heartbeat is active"
//              :                      "Heartbeat failed — check backend"}
//             {lastUpdated && ` · Updated ${lastUpdated.toLocaleTimeString()}`}
//           </div>
//         </div>
//         <button style={s.refreshBtn} onClick={fetchUsers}>↻ Refresh</button>
//       </div>

//       {/* SUMMARY PILLS */}
//       {!loading && users.length > 0 && (
//         <div style={s.pillRow}>
//           <span style={s.pill("#16a34a")}>
//             <span style={s.dot("#22c55e")} />{onlineCount} Online
//           </span>
//           <span style={s.pill("#dc2626")}>
//             <span style={s.dot("#ef4444")} />{offlineCount} Offline
//           </span>
//           <span style={s.pill("#6b7280")}>{users.length} Total</span>
//         </div>
//       )}

//       {/* ERROR */}
//       {error && <div style={s.errorBox}>⚠️ {error}</div>}

//       {/* TABLE */}
//       <div style={s.tableCard}>
//         {loading ? (
//           <div style={{ padding: "16px" }}>
//             {Array.from({ length: 5 }).map((_, i) => (
//               <div key={i} style={s.skRow} />
//             ))}
//           </div>
//         ) : (
//           <div style={{ overflowX: "auto" }}>
//             <table style={s.table}>
//               <thead>
//                 <tr>
//                   {["#", "Name", "Email", "Role", "Status", "Last Active"].map((h) => (
//                     <th key={h} style={s.th}>{h}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {visibleUsers.length === 0 ? (
//                   <tr>
//                     <td colSpan={6} style={{ ...s.td, textAlign: "center", color: c.muted, padding: "40px" }}>
//                       No users found
//                     </td>
//                   </tr>
//                 ) : visibleUsers.map((user, i) => (
//                   <tr key={user._id || i} className="ou-tr">
//                     <td style={{ ...s.td, color: c.muted, width: "40px" }}>{i + 1}</td>
//                     <td style={{ ...s.td, fontWeight: "600" }}>{user.name || "—"}</td>
//                     <td style={s.td}>{user.email || "—"}</td>
//                     <td style={s.td}>
//                       <span style={{
//                         padding: "2px 8px", borderRadius: "4px",
//                         fontSize: "11px", fontWeight: "600",
//                         background: "#007bff18", color: "#007bff",
//                         textTransform: "capitalize",
//                       }}>
//                         {user.role || "user"}
//                       </span>
//                     </td>
//                     <td style={s.td}>
//                       <span style={s.statusBadge(user.isOnline)}>
//                         <span style={s.statusDot(user.isOnline)} />
//                         {user.isOnline ? "Online" : "Offline"}
//                       </span>
//                     </td>
//                     <td style={{ ...s.td, color: c.muted }}>
//                       {formatTime(user.lastActive)}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* PAGINATION */}
//       {users.length > PAGE_SIZE && (
//         <div style={s.btnRow}>
//           <span style={{ fontSize: "12px", color: c.muted }}>
//             Showing {Math.min(visibleCount, users.length)} of {users.length} users
//           </span>
//           <button style={s.btn} onClick={handleViewMore}>
//             {visibleCount >= users.length
//               ? "▲ Show Less"
//               : `▼ Show More (${users.length - visibleCount} remaining)`}
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default OnlineUsers;
import React, { useEffect, useState, useContext, useRef, useCallback } from "react";
import axios from "axios";
import { ThemeContext } from "../ThemeSettings/ThemeContext";
import { io } from "socket.io-client";

const FETCH_INTERVAL = 10000;
const PAGE_SIZE = 5;

const getToken = () => {
  try {
    return JSON.parse(localStorage.getItem("jwt"))?.token;
  } catch {
    return null;
  }
};

const formatTime = (time) => {
  if (!time) return "Never";
  const d = new Date(time);
  return isNaN(d.getTime()) ? "—" : d.toLocaleString();
};

const OnlineUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [lastUpdated, setLastUpdated] = useState(null);

  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const c = {
    bg: isDark ? "#0f172a" : "#f9fafb",
    card: isDark ? "#1e293b" : "#ffffff",
    border: isDark ? "#334155" : "#dcdcdc",
    text: isDark ? "#e2e8f0" : "#1f2937",
    muted: isDark ? "#94a3b8" : "#6b7280",
    thBg: isDark ? "#1e3a5f" : "#f0f6ff",
    thColor: isDark ? "#93c5fd" : "#1d4ed8",
    rowHover: isDark ? "#263348" : "#f8fafc",
    btnBg: isDark ? "#334155" : "#f3f4f6",
    btnBorder: isDark ? "#475569" : "#dcdcdc",
  };

  const api = useRef(
    axios.create({ baseURL: "https://imediareports.onrender.com/api" })
  ).current;

  /* =========================
     FETCH USERS
  ========================= */
  const fetchUsers = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setError("Not authenticated — please log in again");
      setLoading(false);
      return;
    }

    try {
      const res = await api.get("/online-users", {
        headers: { Authorization: `Bearer ${token}` },
        params: { t: Date.now() },
      });

      const fetched = res.data?.users || [];
      setUsers(fetched);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError("Could not load users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
    const id = setInterval(fetchUsers, FETCH_INTERVAL);
    return () => clearInterval(id);
  }, [fetchUsers]);

  /* =========================
     SOCKET.IO REAL-TIME
  ========================= */
  useEffect(() => {
    const token = getToken();
    if (!token) return;

    const socket = io("https://imediareports.onrender.com", {
      auth: { token },
    });

    /* When any user status changes */
    socket.on("users:update", () => {
      fetchUsers();
    });

    return () => socket.disconnect();
  }, [fetchUsers]);

  /* Derived */
  const visibleUsers = users.slice(0, visibleCount);
  const onlineCount = users.filter((u) => u.isOnline).length;
  const offlineCount = users.length - onlineCount;

  const handleViewMore = () =>
    setVisibleCount((prev) =>
      prev >= users.length
        ? PAGE_SIZE
        : Math.min(prev + PAGE_SIZE, users.length)
    );

  /* Styles same as before */
  const s = {
    wrap: {
      padding: "24px",
      background: c.bg,
      minHeight: "100vh",
      fontFamily: "'Inter', system-ui, sans-serif",
      color: c.text,
    },
    header: {
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      marginBottom: "20px",
      flexWrap: "wrap",
      gap: "10px",
    },
    title: { fontSize: "22px", fontWeight: "700", color: c.text, margin: 0 },
    meta: { fontSize: "12px", color: c.muted, marginTop: "4px" },
    pillRow: { display: "flex", gap: "10px", marginBottom: "16px", flexWrap: "wrap" },
    pill: (color) => ({
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      padding: "4px 12px",
      borderRadius: "999px",
      fontSize: "12px",
      fontWeight: "600",
      background: `${color}18`,
      color,
      border: `1px solid ${color}40`,
    }),
    dot: (color) => ({
      width: "8px",
      height: "8px",
      borderRadius: "50%",
      background: color,
    }),
    tableCard: {
      background: c.card,
      border: `1px solid ${c.border}`,
      borderRadius: "10px",
      overflow: "hidden",
    },
    table: { width: "100%", borderCollapse: "collapse", fontSize: "13px" },
    th: {
      padding: "10px 14px",
      textAlign: "left",
      background: c.thBg,
      color: c.thColor,
      border: `1px solid ${c.border}`,
    },
    td: {
      padding: "10px 14px",
      border: `1px solid ${c.border}`,
    },
  };

  return (
    <div style={s.wrap}>
      <div style={s.header}>
        <div>
          <h2 style={s.title}>👥 User Online Status</h2>
          <div style={s.meta}>
            Live tracking enabled
            {lastUpdated && ` · Updated ${lastUpdated.toLocaleTimeString()}`}
          </div>
        </div>
        <button onClick={fetchUsers}>↻ Refresh</button>
      </div>

      <div style={s.pillRow}>
        <span style={s.pill("#16a34a")}>
          <span style={s.dot("#22c55e")} />{onlineCount} Online
        </span>
        <span style={s.pill("#dc2626")}>
          <span style={s.dot("#ef4444")} />{offlineCount} Offline
        </span>
        <span style={s.pill("#6b7280")}>{users.length} Total</span>
      </div>

      <div style={s.tableCard}>
        <table style={s.table}>
          <thead>
            <tr>
              {["#", "Name", "Email", "Role", "Status", "Last Active"].map((h) => (
                <th key={h} style={s.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleUsers.map((user, i) => (
              <tr key={user._id || i}>
                <td style={s.td}>{i + 1}</td>
                <td style={s.td}>{user.name}</td>
                <td style={s.td}>{user.email}</td>
                <td style={s.td}>{user.role}</td>
                <td style={s.td}>{user.isOnline ? "Online" : "Offline"}</td>
                <td style={s.td}>{formatTime(user.lastActive)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length > PAGE_SIZE && (
        <button onClick={handleViewMore}>
          {visibleCount >= users.length ? "Show Less" : "Show More"}
        </button>
      )}
    </div>
  );
};

export default OnlineUsers;