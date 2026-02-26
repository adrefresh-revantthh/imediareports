

// // import React, { useEffect, useState, useContext } from "react";
// // import axios from "axios";
// // import {
// //   PieChart,
// //   Pie,
// //   Cell,
// //   ResponsiveContainer,
// //   BarChart,
// //   Bar,
// //   XAxis,
// //   YAxis,
// //   Tooltip,
// //   Legend,
// //   CartesianGrid,
// // } from "recharts";
// // import { ThemeContext } from "../ThemeSettings/ThemeContext";

// // const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A855F7"];

// // const AdvertiserPerformance = () => {
// //   const [data, setData] = useState([]);
// //   const { theme } = useContext(ThemeContext);

// //   useEffect(() => {
// //     const fetchAdvertiserData = async () => {
// //       try {
// //         const token = JSON.parse(localStorage.getItem("jwt"))?.token;
// //         if (!token) {
// //           console.error("Missing token");
// //           return;
// //         }

// //         const res = await axios.get("https://imediareports.onrender.com/api/getalldata", {
// //           headers: { Authorization: `Bearer ${token}` },
// //         });

// //         // ✅ Combine both main & genealogy sheets
// //         const allSheets = [
// //           ...(res.data?.sheets || []),
// //           ...(res.data?.genealogySheets || []),
// //         ];

// //         const grouped = {};

// //         allSheets.forEach((sheet) => {
// //           const advertiserName = sheet.advertiser || "Unknown Advertiser";
// //           const uploaderName = sheet.uploadedByName || "Unknown Uploader";
// //           const key = `${advertiserName}-${uploaderName}`;

// //           if (!grouped[key]) {
// //             grouped[key] = {
// //               advertiser: advertiserName,
// //               uploader: uploaderName,
// //               views: 0,
// //               clicks: 0,
// //               totalCPM: 0,
// //               totalSpend: 0,
// //               validEntries: 0,
// //             };
// //           }

// //           (sheet.data || []).forEach((row) => {
// //             if (typeof row !== "object" || row === null) return;

// //             const normalized = Object.fromEntries(
// //               Object.entries(row).map(([key, val]) => [
// //                 key.trim().toLowerCase(),
// //                 val,
// //               ])
// //             );

// //             const views =
// //               parseFloat(normalized.impressions) ||
// //               parseFloat(normalized["impression"]) ||
// //               0;
// //             const clicks =
// //               parseFloat(normalized.clicks) ||
// //               parseFloat(normalized["click"]) ||
// //               0;

// //             let cpm =
// //               parseFloat(normalized.cpm) ||
// //               parseFloat(normalized["cost per mille"]) ||
// //               0;
// //             let spend =
// //               parseFloat(normalized.spend) ||
// //               parseFloat(normalized["total spend"]) ||
// //               parseFloat(normalized["budget spent"]) ||
// //               0;

// //             if (!cpm) cpm = Math.random() * (10 - 1) + 1;

// //             if (!spend) {
// //               if (views > 0) {
// //                 spend = (views / 1000) * cpm;
// //               } else if (clicks > 0) {
// //                 const cpc = Math.random() * (1 - 0.1) + 0.1;
// //                 spend = clicks * cpc;
// //               }
// //             }

// //             grouped[key].views += views;
// //             grouped[key].clicks += clicks;
// //             grouped[key].totalCPM += cpm;
// //             grouped[key].totalSpend += spend;
// //             grouped[key].validEntries += 1;
// //           });
// //         });

// //         // ✅ Format aggregated data
// //         const formatted = Object.values(grouped).map((adv) => {
// //           const ctr = adv.views
// //             ? ((adv.clicks / adv.views) * 100).toFixed(2)
// //             : "0.00";

// //           return {
// //             name: `${adv.advertiser} (${adv.uploader})`,
// //             views: adv.views,
// //             clicks: adv.clicks,
// //             ctr,
// //             budgetSpent: parseFloat(adv.totalSpend.toFixed(2)),
// //           };
// //         });

// //         setData(formatted);
// //       } catch (err) {
// //         console.error("Error fetching advertiser data:", err);
// //       }
// //     };

// //     fetchAdvertiserData();
// //   }, []);

// //   // 🎨 Theme-based color palette
// //   const isDark = theme === "dark";
// //   const themeColors = {
// //     pageBg: isDark ? "#0f172a" : "#f3f4f6",
// //     text: isDark ? "#e2e8f0" : "#111827",
// //     cardBg: isDark ? "#1e293b" : "#fff",
// //     border: isDark ? "#334155" : "#e5e7eb",
// //     tableHeaderBg: isDark ? "#334155" : "#f9fafb",
// //     cellBorder: isDark ? "#475569" : "#ccc",
// //   };

// //   return (
// //     <div
// //       style={{
// //         ...styles.main,
// //         backgroundColor: themeColors.pageBg,
// //         color: themeColors.text,
// //       }}
// //     >
// //       <h2 style={{ ...styles.title, color: themeColors.text }}>
// //         Advertiser Performance Dashboard
// //       </h2>

// //       <div style={styles.grid}>
// //         {/* Table Section */}
// //         <div
// //           style={{
// //             ...styles.card,
// //             backgroundColor: themeColors.cardBg,
// //             borderColor: themeColors.border,
// //           }}
// //         >
// //           <h3 style={{ color: themeColors.text }}>📊 Advertiser Campaign Summary</h3>
// //           <table
// //             style={{
// //               ...styles.table,
// //               borderColor: themeColors.border,
// //             }}
// //           >
// //             <thead>
// //               <tr>
// //                 {["Advertiser (Uploader)", "Views", "Clicks", "CTR (%)", "Budget Spent ($)"].map(
// //                   (col) => (
// //                     <th
// //                       key={col}
// //                       style={{
// //                         ...styles.th,
// //                         backgroundColor: themeColors.tableHeaderBg,
// //                         color: themeColors.text,
// //                         borderColor: themeColors.cellBorder,
// //                       }}
// //                     >
// //                       {col}
// //                     </th>
// //                   )
// //                 )}
// //               </tr>
// //             </thead>
// //             <tbody>
// //               {data.length > 0 ? (
// //                 data.map((d, i) => (
// //                   <tr key={i}>
// //                     <td
// //                       style={{
// //                         ...styles.cell,
// //                         color: themeColors.text,
// //                         borderColor: themeColors.cellBorder,
// //                       }}
// //                     >
// //                       {d.name}
// //                     </td>
// //                     <td
// //                       style={{
// //                         ...styles.cell,
// //                         color: themeColors.text,
// //                         borderColor: themeColors.cellBorder,
// //                       }}
// //                     >
// //                       {d.views.toLocaleString()}
// //                     </td>
// //                     <td
// //                       style={{
// //                         ...styles.cell,
// //                         color: themeColors.text,
// //                         borderColor: themeColors.cellBorder,
// //                       }}
// //                     >
// //                       {d.clicks.toLocaleString()}
// //                     </td>
// //                     <td
// //                       style={{
// //                         ...styles.cell,
// //                         color: themeColors.text,
// //                         borderColor: themeColors.cellBorder,
// //                       }}
// //                     >
// //                       {d.ctr}
// //                     </td>
// //                     <td
// //                       style={{
// //                         ...styles.cell,
// //                         color: themeColors.text,
// //                         borderColor: themeColors.cellBorder,
// //                       }}
// //                     >
// //                       ${d.budgetSpent.toLocaleString()}
// //                     </td>
// //                   </tr>
// //                 ))
// //               ) : (
// //                 <tr>
// //                   <td
// //                     colSpan="5"
// //                     style={{
// //                       textAlign: "center",
// //                       padding: "15px",
// //                       color: themeColors.text,
// //                       borderColor: themeColors.cellBorder,
// //                     }}
// //                   >
// //                     No data available
// //                   </td>
// //                 </tr>
// //               )}
// //             </tbody>
// //           </table>
// //         </div>

// //         {/* Pie Chart */}
// //         <div
// //           style={{
// //             ...styles.card,
// //             backgroundColor: themeColors.cardBg,
// //             borderColor: themeColors.border,
// //           }}
// //         >
// //           <h3 style={{ color: themeColors.text }}>💰 Budget Distribution</h3>
// //           <div style={{ height: 300 }}>
// //             <ResponsiveContainer width="100%" height="100%">
// //               <PieChart>
// //                 <Pie
// //                   data={data}
// //                   dataKey="budgetSpent"
// //                   nameKey="name"
// //                   cx="50%"
// //                   cy="50%"
// //                   outerRadius={100}
// //                   label
// //                 >
// //                   {data.map((_, i) => (
// //                     <Cell key={i} fill={COLORS[i % COLORS.length]} />
// //                   ))}
// //                 </Pie>
// //                 <Tooltip formatter={(val) => `$${val}`} />
// //                 <Legend />
// //               </PieChart>
// //             </ResponsiveContainer>
// //           </div>
// //         </div>

// //         {/* Bar Chart */}
// //         <div
// //           style={{
// //             ...styles.card,
// //             gridColumn: "1 / -1",
// //             backgroundColor: themeColors.cardBg,
// //             borderColor: themeColors.border,
// //           }}
// //         >
// //           <h3 style={{ color: themeColors.text }}>📈 Views vs Budget Spent</h3>
// //           <div style={{ height: 320 }}>
// //             <ResponsiveContainer width="100%" height="100%">
// //               <BarChart data={data}>
// //                 <CartesianGrid strokeDasharray="3 3" />
// //                 <XAxis dataKey="name" stroke={themeColors.text} />
// //                 <YAxis stroke={themeColors.text} />
// //                 <Tooltip />
// //                 <Legend />
// //                 <Bar dataKey="views" fill="#0088FE" name="Views" />
// //                 <Bar dataKey="budgetSpent" fill="#FF8042" name="Budget Spent ($)" />
// //               </BarChart>
// //             </ResponsiveContainer>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // // ✅ Styles
// // const styles = {
// //   main: {
// //     padding: "40px",
// //     maxWidth: "1200px",
// //     margin: "auto",
// //   },
// //   title: {
// //     fontSize: "26px",
// //     fontWeight: "bold",
// //     marginBottom: "25px",
// //     textAlign: "center",
// //   },
// //   grid: {
// //     display: "grid",
// //     gridTemplateColumns: "1fr 1fr",
// //     gap: "20px",
// //   },
// //   card: {
// //     borderRadius: "12px",
// //     padding: "20px",
// //     boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
// //     border: "1px solid #e5e7eb",
// //   },
// //   table: {
// //     width: "100%",
// //     borderCollapse: "collapse",
// //     fontSize: "14px",
// //     textAlign: "left",
// //   },
// //   th: {
// //     border: "1px solid #ccc",
// //     padding: "8px",
// //     fontWeight: "600",
// //   },
// //   cell: {
// //     border: "1px solid #ccc",
// //     padding: "8px",
// //   },
// // };

// // export default AdvertiserPerformance;

// import React, { useEffect, useState, useContext } from "react";
// import axios from "axios";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Legend,
//   CartesianGrid,
// } from "recharts";
// import { ThemeContext } from "../ThemeSettings/ThemeContext";

// const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A855F7"];

// const AdvertiserPerformance = () => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true); // ✅ skeleton
//   const { theme } = useContext(ThemeContext);

//   useEffect(() => {
//     const fetchAdvertiserData = async () => {
//       try {
//         setLoading(true); // ✅
//         const token = JSON.parse(localStorage.getItem("jwt"))?.token;
//         if (!token) return;

//         const res = await axios.get(
//           "https://imediareports.onrender.com/api/getalldata",
//           { headers: { Authorization: `Bearer ${token}` } }
//         );

//         const allSheets = [
//           ...(res.data?.sheets || []),
//           ...(res.data?.genealogySheets || []),
//         ];

//         const grouped = {};

//         allSheets.forEach((sheet) => {
//           const advertiserName = sheet.advertiser || "Unknown Advertiser";
//           const uploaderName = sheet.uploadedByName || "Unknown Uploader";
//           const key = `${advertiserName}-${uploaderName}`;

//           if (!grouped[key]) {
//             grouped[key] = {
//               advertiser: advertiserName,
//               uploader: uploaderName,
//               views: 0,
//               clicks: 0,
//               totalSpend: 0,
//             };
//           }

//           (sheet.data || []).forEach((row) => {
//             if (!row || typeof row !== "object") return;

//             const n = Object.fromEntries(
//               Object.entries(row).map(([k, v]) => [k.trim().toLowerCase(), v])
//             );

//             const views = parseFloat(n.impressions || n.impression) || 0;
//             const clicks = parseFloat(n.clicks || n.click) || 0;
//             let cpm = parseFloat(n.cpm) || Math.random() * 9 + 1;
//             let spend = parseFloat(n.spend) || (views / 1000) * cpm;

//             grouped[key].views += views;
//             grouped[key].clicks += clicks;
//             grouped[key].totalSpend += spend;
//           });
//         });

//         const formatted = Object.values(grouped).map((a) => ({
//           name: `${a.advertiser} (${a.uploader})`,
//           views: a.views,
//           clicks: a.clicks,
//           ctr: a.views ? ((a.clicks / a.views) * 100).toFixed(2) : "0.00",
//           budgetSpent: Number(a.totalSpend.toFixed(2)),
//         }));

//         setData(formatted);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false); // ✅
//       }
//     };

//     fetchAdvertiserData();
//   }, []);

//   const isDark = theme === "dark";
//   const themeColors = {
//     pageBg: isDark ? "#0f172a" : "#f3f4f6",
//     text: isDark ? "#e2e8f0" : "#111827",
//     cardBg: isDark ? "#1e293b" : "#fff",
//     border: isDark ? "#334155" : "#e5e7eb",
//     tableHeaderBg: isDark ? "#334155" : "#f9fafb",
//     cellBorder: isDark ? "#475569" : "#ccc",
//   };

//   return (
//     <div style={{ ...styles.main, background: themeColors.pageBg, color: themeColors.text }}>
//       <h2 style={{ ...styles.title, color: themeColors.text }}>
//         Advertiser Performance Dashboard
//       </h2>

//       <div style={styles.grid}>
//         {/* TABLE */}
//         <div style={{ ...styles.card, background: themeColors.cardBg }}>
//           <h3 style={styles.sectionTitle}>📊 Advertiser Campaign Summary</h3>

//           {loading ? (
//             Array.from({ length: 6 }).map((_, i) => (
//               <div key={i} className="skeleton-row" />
//             ))
//           ) : (
//             <table style={styles.table}>
//               <thead>
//                 <tr>
//                   {["Advertiser (Uploader)", "Views", "Clicks", "CTR (%)", "Budget Spent ($)"].map(
//                     (h) => (
//                       <th key={h} style={styles.th}>{h}</th>
//                     )
//                   )}
//                 </tr>
//               </thead>
//               <tbody>
//                 {data.map((d, i) => (
//                   <tr key={i}>
//                     <td style={styles.cell}>{d.name}</td>
//                     <td style={styles.cell}>{d.views.toLocaleString()}</td>
//                     <td style={styles.cell}>{d.clicks.toLocaleString()}</td>
//                     <td style={styles.cell}>{d.ctr}</td>
//                     <td style={styles.cell}>${d.budgetSpent.toLocaleString()}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>

//         {/* PIE */}
//         <div style={{ ...styles.card, background: themeColors.cardBg }}>
//           <h3 style={styles.sectionTitle}>💰 Budget Distribution</h3>
//           {loading ? (
//             <div className="skeleton-chart" />
//           ) : (
//             <ResponsiveContainer width="100%" height={320}>
//               <PieChart>
//                 <Pie data={data} dataKey="budgetSpent" nameKey="name" outerRadius={110} label>
//                   {data.map((_, i) => (
//                     <Cell key={i} fill={COLORS[i % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//                 <Legend />
//               </PieChart>
//             </ResponsiveContainer>
//           )}
//         </div>

//         {/* BAR */}
//         <div style={{ ...styles.card, gridColumn: "1 / -1", background: themeColors.cardBg }}>
//           <h3 style={styles.sectionTitle}>📈 Views vs Budget Spent</h3>
//           {loading ? (
//             <div className="skeleton-chart" />
//           ) : (
//             <ResponsiveContainer width="100%" height={360}>
//               <BarChart data={data}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="name" tick={{ fontSize: 16 }} />
//                 <YAxis tick={{ fontSize: 16 }} />
//                 <Tooltip />
//                 <Legend />
//                 <Bar dataKey="views" fill="#0088FE" />
//                 <Bar dataKey="budgetSpent" fill="#FF8042" />
//               </BarChart>
//             </ResponsiveContainer>
//           )}
//         </div>
//       </div>

//       {/* ===== SKELETON STYLES ===== */}
//       <style>
//         {`
//           .skeleton-row, .skeleton-chart {
//             background: linear-gradient(90deg,#e5e7eb 25%,#f3f4f6 37%,#e5e7eb 63%);
//             background-size: 400% 100%;
//             animation: shimmer 1.4s infinite;
//             border-radius: 8px;
//             margin-bottom: 12px;
//           }
//           .skeleton-row { height: 42px; }
//           .skeleton-chart { height: 320px; }
//           @keyframes shimmer {
//             0% { background-position: 100% 0 }
//             100% { background-position: -100% 0 }
//           }
//         `}
//       </style>
//     </div>
//   );
// };

// /* ===== STYLES (FONT SIZE INCREASE ONLY) ===== */
// const styles = {
//   main: { padding: "40px", maxWidth: "1300px", margin: "auto" },
//   title: { fontSize: "34px", fontWeight: "800", marginBottom: "30px", textAlign: "center" },
//   grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" },
//   card: { padding: "26px", borderRadius: "14px" },
//   sectionTitle: { fontSize: "24px", fontWeight: "700", marginBottom: "16px" },
//   table: { width: "100%", borderCollapse: "collapse", fontSize: "18px" },
//   th: { padding: "14px", fontSize: "18px", fontWeight: "700" },
//   cell: { padding: "14px", fontSize: "17px" },
// };

// export default AdvertiserPerformance;
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis,
  Tooltip, Legend, CartesianGrid,
} from "recharts";
import { ThemeContext } from "../ThemeSettings/ThemeContext";

/* ════════════════════════════════════════
   COLORS — matches existing dashboards
════════════════════════════════════════ */
const CHART_COLORS = ["#007bff", "#28a745", "#ff4d4f", "#f5a623", "#9b59b6"];

/* ════════════════════════════════════════
   HELPERS
════════════════════════════════════════ */
const toNum = (v) => {
  if (!v && v !== 0) return 0;
  const n = parseFloat(String(v).replace(/[^0-9.-]+/g, ""));
  return isNaN(n) ? 0 : n;
};

const normalizeRow = (row) => {
  const e = {};
  Object.keys(row || {}).forEach((k) => { e[k.trim().toLowerCase()] = row[k]; });
  return e;
};

// ✅ Real spend extraction — no Math.random()
const extractSpend = (row) => {
  const e = normalizeRow(row);

  const spendKey = Object.keys(e).find((k) => k.includes("spend"));
  if (spendKey) { const v = toNum(e[spendKey]); if (v > 0) return v; }

  const revKey = Object.keys(e).find((k) => k.includes("revenue"));
  if (revKey) { const v = toNum(e[revKey]); if (v > 0) return v; }

  const imp = toNum(e.impressions ?? e.imps ?? e.imp ?? e["total impressions"]);
  const clk = toNum(e.clicks ?? e.click);
  const cpc = toNum(e.cpc);
  const cpm = toNum(e.cpm);
  if (cpc > 0) return clk * cpc;
  if (cpm > 0) return (imp / 1000) * cpm;
  return 0;
};

const extractImp = (row) => {
  const e = normalizeRow(row);
  return toNum(e.impressions ?? e.imps ?? e.imp ?? e["total impressions"]);
};

const extractClk = (row) => {
  const e = normalizeRow(row);
  return toNum(e.clicks ?? e.click ?? e["total clicks"]);
};

/* ════════════════════════════════════════
   COMPONENT
════════════════════════════════════════ */
const AdvertiserPerformance = () => {
  const [data,    setData]    = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useContext(ThemeContext);

  const isDark = theme === "dark";
  const c = {
    bg:       isDark ? "#0f172a" : "#f9fafb",
    card:     isDark ? "#1e293b" : "#ffffff",
    border:   isDark ? "#334155" : "#dcdcdc",
    text:     isDark ? "#e2e8f0" : "#1f2937",
    muted:    isDark ? "#94a3b8" : "#6b7280",
    thBg:     isDark ? "#1e3a5f" : "#f0f6ff",
    thColor:  isDark ? "#93c5fd" : "#1d4ed8",
    rowHover: isDark ? "#1e293b" : "#f8fafc",
  };

  useEffect(() => {
    const fetch_ = async () => {
      try {
        setLoading(true);
        const token = JSON.parse(localStorage.getItem("jwt"))?.token;
        if (!token) return;

        const res = await axios.get(
          "https://imediareports.onrender.com/api/getalldata",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const sheets = [
          ...(res.data?.sheets || []),
          ...(res.data?.genealogySheets || []),
        ];

        // Group by advertiser
        const grouped = {};
        sheets.forEach((sheet) => {
          const adv = sheet.advertiser || "Unknown Advertiser";
          if (!grouped[adv]) {
            grouped[adv] = { name: adv, imp: 0, clk: 0, spend: 0 };
          }
          (sheet.data || []).forEach((row) => {
            grouped[adv].imp   += extractImp(row);
            grouped[adv].clk   += extractClk(row);
            grouped[adv].spend += extractSpend(row);
          });
        });

        setData(
          Object.values(grouped)
            .map((a) => ({
              name:        a.name,
              views:       a.imp,
              clicks:      a.clk,
              ctr:         a.imp > 0 ? ((a.clk / a.imp) * 100).toFixed(2) : "0.00",
              budgetSpent: Number(a.spend.toFixed(2)),
            }))
            .sort((a, b) => b.budgetSpent - a.budgetSpent)
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch_();
  }, []);

  /* ── Inline styles ── */
  const s = {
    wrap: {
      padding: "24px",
      background: c.bg,
      color: c.text,
      fontFamily: "'Inter', system-ui, sans-serif",
      minHeight: "100%",
    },
    title: { fontSize: "22px", fontWeight: "700", marginBottom: "20px", color: c.text },
    grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" },
    card: {
      background: c.card,
      border: `1px solid ${c.border}`,
      borderRadius: "10px",
      padding: "20px",
      boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
    },
    cardFull: { gridColumn: "1 / -1" },
    cardTitle: { fontSize: "15px", fontWeight: "700", marginBottom: "16px", color: c.text },
    /* TABLE */
    table: { width: "100%", borderCollapse: "collapse", fontSize: "13px" },
    th: {
      padding: "10px 14px",
      textAlign: "left",
      fontWeight: "700",
      fontSize: "12px",
      textTransform: "uppercase",
      letterSpacing: "0.05em",
      background: c.thBg,
      color: c.thColor,
      border: `1px solid ${c.border}`,    // ✅ bordered
      whiteSpace: "nowrap",
    },
    td: {
      padding: "10px 14px",
      fontSize: "13px",
      color: c.text,
      border: `1px solid ${c.border}`,    // ✅ bordered
    },
    /* SKELETON */
    skRow: {
      height: "42px", borderRadius: "6px", marginBottom: "10px",
      background: "linear-gradient(90deg,#e5e7eb 25%,#f3f4f6 37%,#e5e7eb 63%)",
      backgroundSize: "400% 100%", animation: "shimmer 1.4s infinite",
    },
    skChart: {
      height: "300px", borderRadius: "8px",
      background: "linear-gradient(90deg,#e5e7eb 25%,#f3f4f6 37%,#e5e7eb 63%)",
      backgroundSize: "400% 100%", animation: "shimmer 1.4s infinite",
    },
  };

  return (
    <div style={s.wrap}>
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 100% 0; }
          100% { background-position: -100% 0; }
        }
        .adv-tr:hover td { background: ${c.rowHover} !important; }
      `}</style>

      <h2 style={s.title}>📢 Advertiser Performance</h2>

      <div style={s.grid}>

        {/* ── TABLE ── */}
        <div style={{ ...s.card, ...s.cardFull }}>
          <div style={s.cardTitle}>Advertiser Campaign Summary</div>
          {loading
            ? Array.from({ length: 5 }).map((_, i) => <div key={i} style={s.skRow} />)
            : (
              <div style={{ overflowX: "auto" }}>
                <table style={s.table}>
                  <thead>
                    <tr>
                      {["Advertiser", "Impressions", "Clicks", "CTR", "Budget Spent"].map((h) => (
                        <th key={h} style={s.th}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.length === 0 ? (
                      <tr><td colSpan={5} style={{ ...s.td, textAlign: "center", color: c.muted }}>No data found</td></tr>
                    ) : data.map((d, i) => (
                      <tr key={i} className="adv-tr">
                        <td style={s.td}>{d.name}</td>
                        <td style={s.td}>{d.views.toLocaleString()}</td>
                        <td style={s.td}>{d.clicks.toLocaleString()}</td>
                        <td style={s.td}>{d.ctr}%</td>
                        <td style={{ ...s.td, fontWeight: "700", color: "#007bff" }}>
                          ${d.budgetSpent.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
        </div>

        {/* ── PIE — Budget Distribution ── */}
        <div style={s.card}>
          <div style={s.cardTitle}>💰 Budget by Advertiser</div>
          {loading ? <div style={s.skChart} /> : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="budgetSpent"
                  nameKey="name"
                  outerRadius={100}
                  label={({ name, percent }) =>
                    `${name.length > 12 ? name.slice(0, 12) + "…" : name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {data.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v) => [`$${Number(v).toLocaleString("en-US", { minimumFractionDigits: 2 })}`, "Budget Spent"]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* ── BAR — Impressions vs Budget Spent ── */}
        <div style={s.card}>
          <div style={s.cardTitle}>📈 Impressions vs Budget Spent</div>
          {loading ? <div style={s.skChart} /> : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data} barCategoryGap="35%">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => v.length > 10 ? v.slice(0, 10) + "…" : v}
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}
                />
                <Tooltip
                  formatter={(v, name) => [
                    name === "views"
                      ? Number(v).toLocaleString()
                      : `$${Number(v).toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
                    name === "views" ? "Impressions" : "Budget Spent",
                  ]}
                />
                <Legend formatter={(v) => v === "views" ? "Impressions" : "Budget Spent"} />
                <Bar dataKey="views"       fill="#007bff" radius={[4,4,0,0]} name="views" />
                <Bar dataKey="budgetSpent" fill="#ff4d4f" radius={[4,4,0,0]} name="budgetSpent" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdvertiserPerformance;
