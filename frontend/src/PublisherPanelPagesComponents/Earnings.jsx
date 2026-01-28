

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
//   Legend,
// } from "recharts";

// /* ========= CONFIG ========= */
// const COLORS = ["#00C49F", "#FFBB28", "#0088FE", "#FF8042"];
// const CPM_VALUE = 2.5;

// /* ========= HELPERS ========= */
// const normalize = (s = "") =>
//   s.toLowerCase().trim().replace(/\s+/g, "").replace(/_/g, "");

// const num = (v) => {
//   if (!v || v === "") return 0;
//   if (typeof v === "string") return Number(v.replace(/,/g, "")) || 0;
//   return Number(v) || 0;
// };

// const convertDate = (serial) => {
//   const n = num(serial);
//   if (!n) return "";
//   const epoch = new Date(1899, 11, 30);
//   const d = new Date(epoch.getTime() + n * 86400000);
//   return d.toISOString().slice(0, 10);
// };

// const findValueByKeys = (row, keys = []) => {
//   const map = {};
//   Object.keys(row).forEach(
//     (k) => (map[k.toLowerCase().replace(/\s+/g, "")] = k)
//   );
//   for (const key of keys) {
//     const match = Object.keys(map).find((nk) => nk.includes(key));
//     if (match) return num(row[map[match]]);
//   }
//   return 0;
// };

// const findDate = (row) => {
//   const keys = ["date", "day", "timestamp", "createddate", "reportdate"];
//   const map = {};
//   Object.keys(row).forEach((k) => (map[k.toLowerCase()] = k));

//   for (const k of keys) {
//     if (map[k]) {
//       const raw = row[map[k]];
//       return convertDate(num(raw)) || (typeof raw === "string" ? raw : "");
//     }
//   }

//   return (
//     convertDate(num(row["Date"])) ||
//     convertDate(num(row["Day"])) ||
//     "---"
//   );
// };

// export default function Earnings() {
//   const [activePlatform, setActivePlatform] = useState("overall");
//   const [selectedCampaign, setSelectedCampaign] = useState("All");

//   const [metrics, setMetrics] = useState({
//     revenue: 0,
//     impressions: 0,
//     clicks: 0,
//     ctr: 0,
//   });

//   const [campaignList, setCampaignList] = useState([]);
//   const [chartData, setChartData] = useState([]);
//   const [tableData, setTableData] = useState([]);

//   const [adWidgetMetrics, setAdWidgetMetrics] = useState({
//     revenue: 0,
//     impressions: 0,
//     clicks: 0,
//     ctr: 0,
//   });

//   const [adWidgetDailyRows, setAdWidgetDailyRows] = useState([]);
//   const [adWidgetChart, setAdWidgetChart] = useState([]);

//   const [showAllRows, setShowAllRows] = useState(false);
//   const [showAllRowsAD, setShowAllRowsAD] = useState(false);

//   useEffect(() => {
//     loadData();
//   }, [activePlatform, selectedCampaign]);

//   const loadData = async () => {
//     try {
//       const user = JSON.parse(localStorage.getItem("jwt"))?.user;
//       if (!user?.name) return;

//       const res = await axios.get("http://localhost:5000/api/getalldata");
//       const allSheets = res?.data?.sheets || [];

//       let publisherSheets = allSheets.filter(
//         (s) =>
//           normalize(s?.publisher || s?.uploadedByName || "") ===
//           normalize(user.name)
//       );

//       publisherSheets = publisherSheets.filter(
//         (s) => !["summary", "totals", "overall"].includes(normalize(s.name))
//       );

//       setCampaignList([...new Set(publisherSheets.map((s) => s.campaign))]);

//       const isVideo = (n) =>
//         normalize(n).includes("video") ||
//         normalize(n).includes("yt") ||
//         normalize(n).includes("youtube");

//       const isOtt = (n) =>
//         normalize(n).includes("ott") ||
//         normalize(n).includes("hotstar") ||
//         normalize(n).includes("zee");

//       const isAdWidget = (n) =>
//         normalize(n).includes("adwidget") ||
//         normalize(n).includes("widget") ||
//         normalize(n).includes("adwid");

//       const videoSheets = publisherSheets.filter((s) => isVideo(s.name));
//       const ottSheets = publisherSheets.filter((s) => isOtt(s.name));
//       const adSheets = publisherSheets.filter((s) => isAdWidget(s.name));

//       const byCamp = (s) =>
//         selectedCampaign === "All"
//           ? true
//           : normalize(s.campaign) === normalize(selectedCampaign);

//       const videoFiltered = videoSheets.filter(byCamp);
//       const ottFiltered = ottSheets.filter(byCamp);
//       const adFiltered = adSheets.filter(byCamp);

//       const computeCPM = (sheets) => {
//         const rows = sheets.flatMap((s) => s.data || []);
//         const impressions = rows.reduce(
//           (a, r) =>
//             a +
//             findValueByKeys(r, [
//               "impressions",
//               "views",
//               "imp",
//               "impression",
//             ]),
//           0
//         );
//         const clicks = rows.reduce(
//           (a, r) => a + findValueByKeys(r, ["clicks", "npclick", "click"]),
//           0
//         );
//         const ctr = impressions ? (clicks / impressions) * 100 : 0;
//         const revenue = (impressions / 1000) * CPM_VALUE;

//         return { impressions, clicks, ctr, revenue };
//       };

//       let pool = publisherSheets;
//       if (activePlatform === "video") pool = videoFiltered;
//       else if (activePlatform === "ott") pool = ottFiltered;
//       else if (activePlatform === "adwidget") pool = adFiltered;

//       const mainMetrics = computeCPM(pool);
//       setMetrics({
//         revenue: mainMetrics.revenue.toFixed(2),
//         impressions: mainMetrics.impressions,
//         clicks: mainMetrics.clicks,
//         ctr: mainMetrics.ctr.toFixed(2),
//       });

//       if (activePlatform !== "adwidget") {
//         setTableData(
//           pool.flatMap((sheet) =>
//             (sheet.data || []).map((r) => {
//               const imps = findValueByKeys(r, [
//                 "impressions",
//                 "views",
//                 "imp",
//               ]);
//               const clicks = findValueByKeys(r, [
//                 "clicks",
//                 "npclick",
//                 "click",
//               ]);
//               const ctr = imps ? ((clicks / imps) * 100).toFixed(2) : 0;
//               const revenue = ((imps / 1000) * CPM_VALUE).toFixed(2);

//               return {
//                 date: findDate(r),
//                 imps,
//                 clicks,
//                 ctr,
//                 revenue,
//               };
//             })
//           )
//         );
//       }

//       /* ========== ADWIDGET TABLE ========== */
//       if (adSheets.length) {
//         setAdWidgetDailyRows(
//           adFiltered.flatMap((sheet) =>
//             (sheet.data || []).map((r) => {
//               const imps = findValueByKeys(r, [
//                 "impressions",
//                 "views",
//                 "imp",
//               ]);
//               const clicks = findValueByKeys(r, ["clicks", "npclick"]);
//               const ctr = imps ? ((clicks / imps) * 100).toFixed(2) : 0;
//               const revenue = ((imps / 1000) * CPM_VALUE).toFixed(2);

//               return { date: findDate(r), imps, clicks, ctr, revenue };
//             })
//           )
//         );

//         const adMetrics = computeCPM(adFiltered);
//         setAdWidgetMetrics({
//           revenue: adMetrics.revenue.toFixed(2),
//           impressions: adMetrics.impressions,
//           clicks: adMetrics.clicks,
//           ctr: adMetrics.ctr.toFixed(2),
//         });

//         const adChart = {};
//         adFiltered.forEach((sheet) => {
//           const rev = (sheet.data || []).reduce((a, r) => {
//             const imps = findValueByKeys(r, ["impressions", "views", "imp"]);
//             return a + (imps / 1000) * CPM_VALUE;
//           }, 0);
//           adChart[sheet.campaign] = (adChart[sheet.campaign] || 0) + rev;
//         });

//         setAdWidgetChart(
//           Object.entries(adChart).map(([name, revenue]) => ({
//             name,
//             revenue: Number(revenue.toFixed(2)),
//           }))
//         );
//       }

//       /* ========== OTHER CHARTS ========== */
//       const revChart = {};
//       pool.forEach((sheet) => {
//         const rev = (sheet.data || []).reduce((a, r) => {
//           const imps = findValueByKeys(r, ["impressions", "views", "imp"]);
//           return a + (imps / 1000) * CPM_VALUE;
//         }, 0);
//         revChart[sheet.campaign] = (revChart[sheet.campaign] || 0) + rev;
//       });

//       setChartData(
//         Object.entries(revChart).map(([name, revenue]) => ({
//           name,
//           revenue: Number(revenue.toFixed(2)),
//         }))
//       );
//     } catch (err) {
//       console.error("🔥 Earnings Error:", err);
//     }
//   };

//   const visibleRows = showAllRows
//     ? tableData
//     : tableData.slice(0, 7);

//   const visibleRowsAD = showAllRowsAD
//     ? adWidgetDailyRows
//     : adWidgetDailyRows.slice(0, 7);

//   /* ===== UI ===== */
//   return (
//     <div style={styles.container}>
//       <aside style={styles.sidebar}>
//         <h2 style={styles.menuTitle}>Earnings Menu</h2>

//         {["overall", "video", "ott", "adwidget"].map((p) => (
//           <button
//             key={p}
//             onClick={() => setActivePlatform(p)}
//             style={{
//               ...styles.menuBtn,
//               background: activePlatform === p ? "#00C49F" : "transparent",
//             }}
//           >
//             {p.toUpperCase()}
//           </button>
//         ))}

//         <div style={{ marginTop: 25 }}>
//           <h3 style={{ color: "#fff" }}>Campaigns</h3>
//           <select
//             value={selectedCampaign}
//             onChange={(e) => setSelectedCampaign(e.target.value)}
//             style={styles.select}
//           >
//             <option value="All">All</option>
//             {campaignList.map((c, i) => (
//               <option key={i} value={c}>
//                 {c}
//               </option>
//             ))}
//           </select>
//         </div>
//       </aside>

//       <main style={styles.main}>
//         {activePlatform === "adwidget" ? (
//           <>
//             <h2 style={styles.title}>ADWIDGET Earnings</h2>

//             <div style={{ ...styles.metricsRow, animation: "fadeIn 0.5s" }}>
//               <div style={styles.metricBox}>
//                 <h4>Revenue</h4>
//                 <p>${adWidgetMetrics.revenue}</p>
//               </div>
//               <div style={styles.metricBox}>
//                 <h4>Impressions</h4>
//                 <p>{adWidgetMetrics.impressions.toLocaleString()}</p>
//               </div>
//               <div style={styles.metricBox}>
//                 <h4>Clicks</h4>
//                 <p>{adWidgetMetrics.clicks.toLocaleString()}</p>
//               </div>
//               <div style={styles.metricBox}>
//                 <h4>CTR</h4>
//                 <p>{adWidgetMetrics.ctr}%</p>
//               </div>
//             </div>

//             <div style={{ ...styles.card, animation: "slideIn 0.5s" }}>
//               <h3>Daily Data</h3>
//               <table style={styles.table}>
//                 <thead>
//                   <tr>
//                     <th style={styles.th}>Date</th>
//                     <th style={styles.th}>Impressions</th>
//                     <th style={styles.th}>Clicks</th>
//                     <th style={styles.th}>CTR</th>
//                     <th style={styles.th}>Revenue</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {visibleRowsAD.map((row, i) => (
//                     <tr key={i}>
//                       <td style={styles.td}>{row.date}</td>
//                       <td style={styles.td}>{row.imps}</td>
//                       <td style={styles.td}>{row.clicks}</td>
//                       <td style={styles.td}>{row.ctr}%</td>
//                       <td style={styles.td}>${row.revenue}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>

//               {adWidgetDailyRows.length > 7 && (
//                 <button
//                   onClick={() => setShowAllRowsAD(!showAllRowsAD)}
//                   style={styles.viewBtn}
//                 >
//                   {showAllRowsAD ? "View Less ▲" : "View More ▼"}
//                 </button>
//               )}
//             </div>

//             <div style={styles.chartRow}>
//               <div style={styles.card}>
//                 <h3>Revenue Share</h3>
//                 <ResponsiveContainer width="100%" height={300}>
//                   <PieChart>
//                     <Pie
//                       data={adWidgetChart}
//                       dataKey="revenue"
//                       nameKey="name"
//                       outerRadius={110}
//                       label
//                     >
//                       {adWidgetChart.map((_, i) => (
//                         <Cell key={i} fill={COLORS[i % COLORS.length]} />
//                       ))}
//                     </Pie>
//                   </PieChart>
//                 </ResponsiveContainer>
//               </div>

//               <div style={styles.card}>
//                 <h3>Revenue Trend</h3>
//                 <ResponsiveContainer width="100%" height={300}>
//                   <BarChart data={adWidgetChart}>
//                     <XAxis dataKey="name" />
//                     <YAxis />
//                     <Tooltip />
//                     <Bar dataKey="revenue" fill="#00C49F" />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>
//           </>
//         ) : (
//           <>
//             <h2 style={styles.title}>
//               {activePlatform.toUpperCase()} Earnings
//             </h2>

//             <div style={{ ...styles.metricsRow, animation: "fadeIn 0.5s" }}>
//               <div style={styles.metricBox}>
//                 <h4>Revenue</h4>
//                 <p>${metrics.revenue}</p>
//               </div>
//               <div style={styles.metricBox}>
//                 <h4>Impressions</h4>
//                 <p>{metrics.impressions.toLocaleString()}</p>
//               </div>
//               <div style={styles.metricBox}>
//                 <h4>Clicks</h4>
//                 <p>{metrics.clicks.toLocaleString()}</p>
//               </div>
//               <div style={styles.metricBox}>
//                 <h4>CTR</h4>
//                 <p>{metrics.ctr}%</p>
//               </div>
//             </div>

//             {activePlatform !== "overall" && (
//               <div style={{ ...styles.card, animation: "slideIn 0.5s" }}>
//                 <h3>Data Table</h3>
//                 <table style={styles.table}>
//                   <thead>
//                     <tr>
//                       <th style={styles.th}>Date</th>
//                       <th style={styles.th}>Impressions</th>
//                       <th style={styles.th}>Clicks</th>
//                       <th style={styles.th}>CTR</th>
//                       <th style={styles.th}>Revenue</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {visibleRows.map((row, i) => (
//                       <tr key={i}>
//                         <td style={styles.td}>{row.date}</td>
//                         <td style={styles.td}>{row.imps}</td>
//                         <td style={styles.td}>{row.clicks}</td>
//                         <td style={styles.td}>{row.ctr}%</td>
//                         <td style={styles.td}>${row.revenue}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>

//                 {tableData.length > 7 && (
//                   <button
//                     onClick={() => setShowAllRows(!showAllRows)}
//                     style={styles.viewBtn}
//                   >
//                     {showAllRows ? "View Less ▲" : "View More ▼"}
//                   </button>
//                 )}
//               </div>
//             )}

//             <div style={styles.chartRow}>
//               <div style={styles.card}>
//                 <h3>Revenue Share</h3>
//                 <ResponsiveContainer width="100%" height={300}>
//                   <PieChart>
//                     <Pie
//                       data={chartData}
//                       dataKey="revenue"
//                       nameKey="name"
//                       outerRadius={110}
//                       label
//                     >
//                       {chartData.map((_, i) => (
//                         <Cell key={i} fill={COLORS[i % COLORS.length]} />
//                       ))}
//                     </Pie>
//                   </PieChart>
//                 </ResponsiveContainer>
//               </div>

//               <div style={styles.card}>
//                 <h3>Revenue Trend</h3>
//                 <ResponsiveContainer width="100%" height={300}>
//                   <BarChart data={chartData}>
//                     <XAxis dataKey="name" />
//                     <YAxis />
//                     <Tooltip />
//                     <Bar dataKey="revenue" fill="#00C49F" />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>
//           </>
//         )}
//       </main>
//     </div>
//   );
// }

// /* ===== STYLES ===== */
// const styles = {
//   container: {
//     display: "flex",
//     minHeight: "100vh",
//     background: "#f1f4f9",
//     alignItems: "flex-start", // ✅ FIXED VERTICAL GAP
//   },
//   sidebar: {
//     width: "240px",
//     background: "#002b36",
//     color: "#fff",
//     padding: "20px",
//     height: "100vh",
//     position: "fixed",
//     left: 0,
//     top: 0,
//     overflowY: "auto",
//   },
//   main: {
//     flex: 1,
//     padding: "20px 30px 30px 30px",
//     // marginLeft: "240px",
//     marginTop: "0px",
//   },
//   menuTitle: {
//     fontSize: "18px",
//     fontWeight: "bold",
//     marginBottom: "20px",
//   },
//   menuBtn: {
//     width: "100%",
//     padding: "12px",
//     borderRadius: "6px",
//     marginBottom: "12px",
//     border: "none",
//     cursor: "pointer",
//     color: "#fff",
//     fontSize: "16px",
//     transition: "0.2s ease",
//   },
//   select: {
//     width: "100%",
//     padding: "10px",
//     borderRadius: "6px",
//     marginTop: "10px",
//   },
//   title: {
//     fontSize: "26px",
//     fontWeight: "bold",
//     marginBottom: "20px",
//     marginTop: "0px", // ✅ FIX: remove gap
//   },
//   metricsRow: {
//     display: "flex",
//     gap: "15px",
//     flexWrap: "wrap",
//     marginBottom: "30px",
//   },
//   metricBox: {
//     flex: "1 1 250px",
//     background: "#fff",
//     padding: "25px",
//     borderRadius: "10px",
//     textAlign: "center",
//     boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
//     transition: "transform 0.2s",
//   },
//   card: {
//     background: "#fff",
//     padding: "20px",
//     borderRadius: "10px",
//     marginBottom: "20px",
//     flex: 1,
//     minWidth: "380px",
//     animation: "fadeIn 0.4s",
//     // marginLeft:"-10%"
//   },
//   chartRow: {
//     display: "flex",
//     gap: "20px",
//     flexWrap: "wrap",
//   },
//   table: {
//     width: "100%",
//     borderCollapse: "collapse",
//     marginTop: "15px",
//   },
//   th: {
//     border: "1px solid black",
//     padding: "10px",
//     background: "#ddd",
//   },
//   td: {
//     border: "1px solid black",
//     padding: "10px",
//   },
//   viewBtn: {
//     marginTop: "10px",
//     padding: "8px 12px",
//     borderRadius: "6px",
//     background: "#082f3d",
//     color: "#fff",
//     cursor: "pointer",
//     border: "none",
//     fontWeight: "600",
//   },
// };

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

/* ========= CONFIG ========= */
const COLORS = ["#00C49F", "#FFBB28", "#0088FE", "#FF8042"];
const CPM_VALUE = 2.5;

/* ========= HELPERS ========= */
const normalize = (s = "") =>
  s.toLowerCase().trim().replace(/\s+/g, "").replace(/_/g, "");

const num = (v) => {
  if (!v || v === "") return 0;
  if (typeof v === "string") return Number(v.replace(/,/g, "")) || 0;
  return Number(v) || 0;
};

const convertDate = (serial) => {
  const n = num(serial);
  if (!n) return "";
  const epoch = new Date(1899, 11, 30);
  const d = new Date(epoch.getTime() + n * 86400000);
  return d.toISOString().slice(0, 10);
};

const findValueByKeys = (row, keys = []) => {
  const map = {};
  Object.keys(row).forEach(
    (k) => (map[k.toLowerCase().replace(/\s+/g, "")] = k)
  );
  for (const key of keys) {
    const match = Object.keys(map).find((nk) => nk.includes(key));
    if (match) return num(row[map[match]]);
  }
  return 0;
};

const findDate = (row) => {
  const keys = ["date", "day", "timestamp", "createddate", "reportdate"];
  const map = {};
  Object.keys(row).forEach((k) => (map[k.toLowerCase()] = k));

  for (const k of keys) {
    if (map[k]) {
      const raw = row[map[k]];
      return convertDate(num(raw)) || raw;
    }
  }
  return "---";
};

/* ========= PLATFORM DETECTORS ========= */
const isVideo = (name = "") =>
  normalize(name).includes("video") ||
  normalize(name).includes("yt") ||
  normalize(name).includes("youtube");

const isOtt = (name = "") =>
  normalize(name).includes("ott") ||
  normalize(name).includes("hotstar") ||
  normalize(name).includes("zee");

const isAdWidget = (name = "") =>
  normalize(name).includes("adwidget") ||
  normalize(name).includes("widget") ||
  normalize(name).includes("adwid");

export default function Earnings() {
  const [activePlatform, setActivePlatform] = useState("overall");
  const [selectedCampaign, setSelectedCampaign] = useState("All");

  const [campaignList, setCampaignList] = useState([]);
  const [metrics, setMetrics] = useState({
    revenue: 0,
    impressions: 0,
    clicks: 0,
    ctr: 0,
  });

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    loadData();
  }, [activePlatform, selectedCampaign]);

  const loadData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("jwt"))?.user;
      if (!user?.name) return;

      const res = await axios.get("https://imediareports.onrender.com/api/getalldata");
      const allSheets = res?.data?.sheets || [];

      /* ===== 1️⃣ Publisher sheets ===== */
      const publisherSheets = allSheets.filter(
        (s) =>
          normalize(s.publisher || s.uploadedByName) ===
          normalize(user.name)
      );

      /* ===== 2️⃣ Campaign list (global for publisher) ===== */
      setCampaignList([
        ...new Set(publisherSheets.map((s) => s.campaign)),
      ]);

      /* ===== 3️⃣ Platform split ===== */
      const videoSheets = publisherSheets.filter((s) =>
        isVideo(s.name)
      );
      const ottSheets = publisherSheets.filter((s) =>
        isOtt(s.name)
      );
      const adWidgetSheets = publisherSheets.filter((s) =>
        isAdWidget(s.name)
      );

      /* ===== 4️⃣ Platform pool ===== */
      let pool = publisherSheets;
      if (activePlatform === "video") pool = videoSheets;
      else if (activePlatform === "ott") pool = ottSheets;
      else if (activePlatform === "adwidget") pool = adWidgetSheets;

      /* ===== 5️⃣ Campaign filter ===== */
      if (selectedCampaign !== "All") {
        pool = pool.filter(
          (s) =>
            normalize(s.campaign) ===
            normalize(selectedCampaign)
        );
      }

      /* ===== 6️⃣ Flatten rows ===== */
      const rows = pool.flatMap((s) => s.data || []);

      /* ===== 7️⃣ Metrics ===== */
      const impressions = rows.reduce(
        (a, r) =>
          a +
          findValueByKeys(r, [
            "impressions",
            "views",
            "imp",
          ]),
        0
      );

      const clicks = rows.reduce(
        (a, r) =>
          a + findValueByKeys(r, ["clicks", "npclick"]),
        0
      );

      const ctr = impressions
        ? ((clicks / impressions) * 100).toFixed(2)
        : 0;

      const revenue = ((impressions / 1000) * CPM_VALUE).toFixed(2);

      setMetrics({
        impressions,
        clicks,
        ctr,
        revenue,
      });

      /* ===== 8️⃣ Chart data (by campaign) ===== */
      const chartMap = {};
      pool.forEach((sheet) => {
        const rev = (sheet.data || []).reduce((a, r) => {
          const imps = findValueByKeys(r, [
            "impressions",
            "views",
            "imp",
          ]);
          return a + (imps / 1000) * CPM_VALUE;
        }, 0);
        chartMap[sheet.campaign] =
          (chartMap[sheet.campaign] || 0) + rev;
      });

      setChartData(
        Object.entries(chartMap).map(([name, revenue]) => ({
          name,
          revenue: Number(revenue.toFixed(2)),
        }))
      );
    } catch (err) {
      console.error("🔥 Earnings Error:", err);
    }
  };

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.pageTitle}>
        {activePlatform.toUpperCase()} Earnings
      </h2>

      {/* ===== INNER NAVBAR ===== */}
      <div style={styles.innerNavbar}>
        <div style={styles.tabs}>
          {["overall", "video", "ott", "adwidget"].map((p) => (
            <button
              key={p}
              onClick={() => setActivePlatform(p)}
              style={{
                ...styles.tabBtn,
                ...(activePlatform === p && styles.activeTab),
              }}
            >
              {p.toUpperCase()}
            </button>
          ))}
        </div>

        <div style={styles.filter}>
          <span style={styles.filterLabel}>Campaign</span>
          <select
            value={selectedCampaign}
            onChange={(e) => setSelectedCampaign(e.target.value)}
            style={styles.select}
          >
            <option value="All">All</option>
            {campaignList.map((c, i) => (
              <option key={i} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ===== METRICS ===== */}
      <div style={styles.metricsRow}>
        <div style={styles.metricBox}>
          <h4>Revenue</h4>
          <p>${metrics.revenue}</p>
        </div>
        <div style={styles.metricBox}>
          <h4>Impressions</h4>
          <p>{metrics.impressions.toLocaleString()}</p>
        </div>
        <div style={styles.metricBox}>
          <h4>Clicks</h4>
          <p>{metrics.clicks.toLocaleString()}</p>
        </div>
        <div style={styles.metricBox}>
          <h4>CTR</h4>
          <p>{metrics.ctr}%</p>
        </div>
      </div>

      {/* ===== CHART ===== */}
      <div style={styles.card}>
        <h3>Revenue Share</h3>
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="revenue"
              nameKey="name"
              outerRadius={120}
              label
            >
              {chartData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* ========= STYLES ========= */
const styles = {
  wrapper: {
    minHeight: "100vh",
    background: "#f1f4f9",
    padding: "24px",
  },
  pageTitle: {
    fontSize: "26px",
    fontWeight: "700",
    marginBottom: "16px",
  },
  innerNavbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#fff",
    padding: "12px 16px",
    borderRadius: "12px",
    marginBottom: "24px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },
  tabs: {
    display: "flex",
    gap: "10px",
  },
  tabBtn: {
    border: "none",
    padding: "8px 16px",
    borderRadius: "8px",
    background: "#eaeaea",
    cursor: "pointer",
    fontWeight: "600",
  },
  activeTab: {
    background: "#01303f",
    color: "#fff",
  },
  filter: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  filterLabel: {
    fontWeight: "600",
  },
  select: {
    padding: "8px",
    borderRadius: "6px",
  },
  metricsRow: {
    display: "flex",
    gap: "15px",
    flexWrap: "wrap",
    marginBottom: "24px",
  },
  metricBox: {
    flex: "1 1 220px",
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    textAlign: "center",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  },
  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  },
};
