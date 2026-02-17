
// // import React, { useEffect, useMemo, useState } from "react";
// // import axios from "axios";
// // import { Line } from "react-chartjs-2";
// // import "chart.js/auto";
// // import "./reports.css";

// // /* ================= HELPERS ================= */

// // const safeNumber = (v) => {
// //   if (v === null || v === undefined || v === "") return 0;
// //   if (typeof v === "string") return Number(v.replace(/[$,%]/g, ""));
// //   return Number(v);
// // };

// // const getSpend = (row) =>
// //   safeNumber(
// //     row.Spend ??
// //       row["Spend"] ??
// //       row["spend"] ??
// //       row["Spend($)"] ??
// //       row["Spend ($)"] ??
// //       row["Total Spend"] ??
// //       row["Total Spend ($)"]
// //   );

// // const excelDateToJSDate = (serial) => {
// //   if (!serial || isNaN(serial)) return null;
// //   const epoch = new Date(Date.UTC(1899, 11, 30));
// //   return new Date(epoch.getTime() + serial * 86400000);
// // };

// // const parseRowDate = (val) => {
// //   if (!val) return null;
// //   if (typeof val === "number") return excelDateToJSDate(val);
// //   const d = new Date(val);
// //   return isNaN(d.getTime()) ? null : d;
// // };

// // const formatDate = (date) =>
// //   date
// //     ? date.toLocaleDateString("en-GB", {
// //         day: "2-digit",
// //         month: "short",
// //         year: "numeric",
// //       })
// //     : "";

// // /* ================= METRIC CONFIG ================= */

// // const METRIC_CONFIG = {
// //   video: {
// //     metrics: ["Impressions", "VCR", "Spend"],
// //     graph: "Impressions",
// //   },
// //   display: {
// //     metrics: ["Impressions", "Clicks", "CTR", "NP Convs", "Spend"],
// //     graph: "Clicks",
// //   },
// //   ott: {
// //     metrics: ["Impressions", "Clicks", "CTR", "NP Convs", "Spend"],
// //     graph: "Clicks",
// //   },
// //   adwidget: {
// //     metrics: ["Impressions", "Clicks", "CTR", "NP Convs", "Spend"],
// //     graph: "Clicks",
// //   },
// //   summary: {
// //     metrics: ["Spend", "Total Budget", "Remaining"],
// //     graph: null,
// //   },
// // };

// // /* ================= COMPONENT ================= */

// // export default function PublisherReports() {
// //   const jwt = JSON.parse(localStorage.getItem("jwt"));
// //   const token = jwt?.token;

// //   /* UI STATE */
// //   const [buildMode, setBuildMode] = useState(false);
// //   const [customFrom, setCustomFrom] = useState("");
// //   const [customTo, setCustomTo] = useState("");
// //   const [showGraph, setShowGraph] = useState(false);

// //   /* DATA */
// //   const [allSheets, setAllSheets] = useState([]);

// //   /* FILTERS */
// //   const [selectedAdvertiser, setSelectedAdvertiser] = useState("All");
// //   const [selectedAdType, setSelectedAdType] = useState("All");

// //   /* OUTPUT */
// //   const [summary, setSummary] = useState(null);
// //   const [dailyGraph, setDailyGraph] = useState([]);
// //   const [reportTitle, setReportTitle] = useState("");

// //   /* ================= FETCH SHEETS ================= */

// //   useEffect(() => {
// //     axios
// //       .get("https://imediareports.onrender.com/api/getallsheets", {
// //         headers: { Authorization: `Bearer ${token}` },
// //       })
// //       .then((res) => {
// //         console.log("✅ Sheets fetched:", res.data);
// //         setAllSheets(res.data || []);
// //       })
// //       .catch((err) => console.error("❌ Sheet fetch error:", err));
// //   }, [token]);

// //   /* ================= DROPDOWNS ================= */

// //   const advertisers = useMemo(() => {
// //     const list = allSheets.map((s) => s.advertiser).filter(Boolean);
// //     return ["All", ...new Set(list)];
// //   }, [allSheets]);

// //   const adTypes = useMemo(() => {
// //     const list = allSheets.map((s) => s.name).filter(Boolean);
// //     return ["All", ...new Set(list)];
// //   }, [allSheets]);

// //   /* ================= RUN REPORT ================= */

// //   const runReport = () => {
// //     if (!customFrom || !customTo) {
// //       alert("Select start & end date");
// //       return;
// //     }

// //     const from = new Date(customFrom);
// //     const to = new Date(customTo);

// //     const adTypeKey = selectedAdType
// //       .toLowerCase()
// //       .replace(/\s+/g, "")
// //       .replace("-", "");

// //     const config = METRIC_CONFIG[adTypeKey];
// //     if (!config) {
// //       console.warn("❌ No metric config for:", adTypeKey);
// //       return;
// //     }

// //     const filteredSheets = allSheets.filter((sheet) => {
// //       if (
// //         selectedAdvertiser !== "All" &&
// //         sheet.advertiser !== selectedAdvertiser
// //       )
// //         return false;

// //       if (selectedAdType !== "All" && sheet.name !== selectedAdType)
// //         return false;

// //       return true;
// //     });

// //     console.log("📂 Filtered Sheets:", filteredSheets);

// //     const records = filteredSheets.flatMap((s) => s.data || []);
// //     console.log("📦 Records:", records.length);

// //     let totals = {};
// //     let dailyMap = {};

// //     records.forEach((row) => {
// //       const rowDate = parseRowDate(row.Date || row.date);

// //       // 🔥 DATE FILTER ONLY IF DATE EXISTS
// //       if (rowDate && (rowDate < from || rowDate > to)) return;

// //       const key = rowDate
// //         ? rowDate.toISOString().slice(0, 10)
// //         : "summary";

// //       if (!dailyMap[key]) dailyMap[key] = { date: key };

// //       config.metrics.forEach((m) => {
// //         let value = 0;

// //         switch (m) {
// //           case "Impressions":
// //             value = safeNumber(row.Impressions);
// //             break;
// //           case "Clicks":
// //             value = safeNumber(row.Clicks);
// //             break;
// //           case "VCR":
// //             value = safeNumber(row.VCR);
// //             break;
// //           case "NP Convs":
// //             value = safeNumber(row["NP Convs"]);
// //             break;
// //           case "Spend":
// //             value = getSpend(row);
// //             break;
// //           case "Total Budget":
// //             value = safeNumber(row["Total Budget"]);
// //             break;
// //           case "Remaining":
// //             value = safeNumber(row.Remaining);
// //             break;
// //           default:
// //             break;
// //         }

// //         if (adTypeKey === "summary") {
// //           totals[m] = value;
// //         } else {
// //           totals[m] = (totals[m] || 0) + value;
// //         }

// //         dailyMap[key][m] = (dailyMap[key][m] || 0) + value;
// //       });
// //     });

// //     if (config.metrics.includes("CTR")) {
// //       totals.CTR = totals.Impressions
// //         ? ((totals.Clicks / totals.Impressions) * 100).toFixed(2)
// //         : "0.00";
// //     }

// //     console.log("📊 FINAL TOTALS:", totals);

// //     setSummary(totals);
// //     setDailyGraph(Object.values(dailyMap));
// //     setReportTitle(
// //       `${selectedAdType.toUpperCase()} REPORT` +
// //         (selectedAdvertiser !== "All"
// //           ? ` – ${selectedAdvertiser}`
// //           : "")
// //     );
// //   };

// //   /* ================= UI ================= */

// //   if (!buildMode) {
// //     return (
// //       <div className="report-page">
// //         <div className="report-card">
// //           <h2>Need to run a report?</h2>
// //           <button className="primary-btn" onClick={() => setBuildMode(true)}>
// //             + Build a new report
// //           </button>
// //         </div>
// //       </div>
// //     );
// //   }

// //   const adTypeKey = selectedAdType
// //     .toLowerCase()
// //     .replace(/\s+/g, "")
// //     .replace("-", "");

// //   return (
// //     <div className="report-page">
// //       <div className="report-card">
// //         <h3>{reportTitle || "Publisher Reports"}</h3>

// //         <div className="filter-bar">
// //           <input type="date" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)} />
// //           <input type="date" value={customTo} onChange={(e) => setCustomTo(e.target.value)} />

// //           <select value={selectedAdvertiser} onChange={(e) => setSelectedAdvertiser(e.target.value)}>
// //             {advertisers.map((a) => (
// //               <option key={a}>{a}</option>
// //             ))}
// //           </select>

// //           <select value={selectedAdType} onChange={(e) => setSelectedAdType(e.target.value)}>
// //             {adTypes.map((t) => (
// //               <option key={t}>{t}</option>
// //             ))}
// //           </select>

// //           <label>
// //             <input type="checkbox" checked={showGraph} onChange={() => setShowGraph(!showGraph)} />
// //             Show Graph
// //           </label>

// //           <button className="primary-btn" onClick={runReport}>
// //             View Report
// //           </button>
// //         </div>

// //         {/* ================= METRIC CARDS ================= */}
// //         {summary && (
// //           <div
// //             style={{
// //               display: "grid",
// //               gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
// //               gap: "12px",
// //               marginTop: "16px",
// //             }}
// //           >
// //             {METRIC_CONFIG[adTypeKey].metrics.map((m) => (
// //               <div
// //                 key={m}
// //                 style={{
// //                   padding: "14px",
// //                   background: "#f5f7f9",
// //                   borderRadius: "0px",
// //                   fontWeight: 600,
// //                 }}
// //               >
// //                 <div style={{ fontSize: "12px", opacity: 0.7 }}>{m}</div>
// //                 <div style={{ fontSize: "20px", marginTop: "4px" }}>
// //                   {summary[m]}
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         )}

// //         {/* ================= GRAPH ================= */}
// //         {showGraph &&
// //           METRIC_CONFIG[adTypeKey]?.graph &&
// //           dailyGraph.length > 0 && (
// //             <Line
// //               data={{
// //                 labels: dailyGraph.map((d) =>
// //                   d.date === "summary"
// //                     ? "Summary"
// //                     : formatDate(new Date(d.date))
// //                 ),
// //                 datasets: [
// //                   {
// //                     label: METRIC_CONFIG[adTypeKey].graph,
// //                     data: dailyGraph.map(
// //                       (d) => d[METRIC_CONFIG[adTypeKey].graph]
// //                     ),
// //                     borderColor: "#007f8c",
// //                     tension: 0.3,
// //                   },
// //                 ],
// //               }}
// //             />
// //           )}
// //       </div>
// //     </div>
// //   );
// // }

// import React, { useEffect, useMemo, useState } from "react";
// import axios from "axios";
// import { Line } from "react-chartjs-2";
// import "chart.js/auto";
// import "./reports.css";

// /* ================= HELPERS ================= */

// const safeNumber = (v) => {
//   if (v === null || v === undefined || v === "") return 0;
//   if (typeof v === "string") return Number(v.replace(/[$,%]/g, ""));
//   return Number(v);
// };

// /* -------- DATE NORMALIZATION (ALL FORMATS) -------- */

// const excelDateToJSDate = (serial) => {
//   if (!serial || isNaN(serial)) return null;
//   const epoch = new Date(Date.UTC(1899, 11, 30));
//   return new Date(epoch.getTime() + serial * 86400000);
// };

// const parseRowDate = (val) => {
//   if (!val) return null;

//   // Excel serial
//   if (typeof val === "number") return excelDateToJSDate(val);

//   if (typeof val === "string") {
//     // dd-mm-yyyy or mm-dd-yyyy
//     if (/^\d{1,2}-\d{1,2}-\d{4}$/.test(val)) {
//       const [a, b, y] = val.split("-");
//       return new Date(`${y}-${a.padStart(2, "0")}-${b.padStart(2, "0")}`);
//     }

//     // Month name formats
//     const d = new Date(val);
//     if (!isNaN(d.getTime())) return d;
//   }

//   const d = new Date(val);
//   return isNaN(d.getTime()) ? null : d;
// };

// const formatDate = (date) =>
//   date
//     ? date.toLocaleDateString("en-GB", {
//         day: "2-digit",
//         month: "short",
//         year: "numeric",
//       })
//     : "";

// /* -------- SMART SPEND CALCULATION -------- */

// const getSpend = (row) => {
//   // Known keys
//   const known =
//     row.Spend ??
//     row["Spend"] ??
//     row["spend"] ??
//     row["Spend($)"] ??
//     row["Spend ($)"] ??
//     row["Total Spend"] ??
//     row["Media Cost"] ??
//     row["Cost"];

//   if (known !== undefined) return safeNumber(known);

//   // Fallback: detect highest numeric value (excluding impressions/clicks)
//   let max = 0;
//   Object.entries(row).forEach(([k, v]) => {
//     if (/impression|click|ctr|vcr/i.test(k)) return;
//     const num = safeNumber(v);
//     if (num > max) max = num;
//   });

//   return max;
// };

// /* ================= METRIC CONFIG ================= */

// const METRIC_CONFIG = {
//   video: {
//     metrics: ["Impressions", "VCR", "Spend"],
//     graph: "Impressions",
//   },
//   display: {
//     metrics: ["Impressions", "Clicks", "CTR", "NP Convs", "Spend"],
//     graph: "Clicks",
//   },
//   ott: {
//     metrics: ["Impressions", "Clicks", "CTR", "NP Convs", "Spend"],
//     graph: "Clicks",
//   },
//   adwidget: {
//     metrics: ["Impressions", "Clicks", "Spend"],
//     graph: "Clicks",
//   },
//   summary: {
//     metrics: ["Total Budget", "Spend", "Remaining"],
//     graph: null,
//   },
// };

// /* ================= COMPONENT ================= */

// export default function PublisherReports() {
//   const jwt = JSON.parse(localStorage.getItem("jwt"));
//   const token = jwt?.token;

//   /* UI STATE */
//   const [buildMode, setBuildMode] = useState(false);
//   const [customFrom, setCustomFrom] = useState("");
//   const [customTo, setCustomTo] = useState("");
//   const [showGraph, setShowGraph] = useState(false);

//   /* DATA */
//   const [allSheets, setAllSheets] = useState([]);

//   /* FILTERS */
//   const [selectedAdvertiser, setSelectedAdvertiser] = useState("All");
//   const [selectedAdType, setSelectedAdType] = useState("All");

//   /* OUTPUT */
//   const [summary, setSummary] = useState(null);
//   const [dailyGraph, setDailyGraph] = useState([]);
//   const [reportTitle, setReportTitle] = useState("");

//   /* ================= FETCH SHEETS ================= */

//   useEffect(() => {
//     axios
//       .get("https://imediareports.onrender.com/api/getallsheets", {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then((res) => setAllSheets(res.data || []))
//       .catch((err) => console.error("❌ Sheet fetch error", err));
//   }, [token]);

//   /* ================= DROPDOWNS ================= */

//   const advertisers = useMemo(
//     () => ["All", ...new Set(allSheets.map((s) => s.advertiser).filter(Boolean))],
//     [allSheets]
//   );

//   const adTypes = useMemo(
//     () => ["All", ...new Set(allSheets.map((s) => s.name).filter(Boolean))],
//     [allSheets]
//   );

//   /* ================= RUN REPORT ================= */

//   const runReport = () => {
//     if (!customFrom || !customTo) {
//       alert("Select start & end date");
//       return;
//     }

//     const from = new Date(customFrom);
//     const to = new Date(customTo);

//     const adTypeKey = selectedAdType
//       .toLowerCase()
//       .replace(/[\s-_]/g, "");

//     const config = METRIC_CONFIG[adTypeKey];
//     if (!config) return;

//     const filteredSheets = allSheets.filter((s) => {
//       if (selectedAdvertiser !== "All" && s.advertiser !== selectedAdvertiser)
//         return false;
//       if (selectedAdType !== "All" && s.name !== selectedAdType) return false;
//       return true;
//     });

//     const records = filteredSheets.flatMap((s) => s.data || []);

//     let totals = {};
//     let dailyMap = {};

//     records.forEach((row) => {
//       const rowDate = parseRowDate(row.Date || row.date);

//       // Apply date filter ONLY if date exists
//       if (rowDate && (rowDate < from || rowDate > to)) return;

//       const spend = getSpend(row);

//       const key = rowDate
//         ? rowDate.toISOString().slice(0, 10)
//         : "summary";

//       if (!dailyMap[key]) dailyMap[key] = { date: key };

//       config.metrics.forEach((m) => {
//         let value = 0;

//         switch (m) {
//           case "Impressions":
//             value = safeNumber(row.Impressions);
//             break;
//           case "Clicks":
//             value = safeNumber(row.Clicks);
//             break;
//           case "VCR":
//             value = safeNumber(row.VCR);
//             break;
//           case "NP Convs":
//             value = safeNumber(row["NP Convs"]);
//             break;
//           case "Spend":
//             value = spend;
//             break;
//           case "Total Budget":
//             value = safeNumber(row["Total Budget"]);
//             break;
//           case "Remaining":
//             value = safeNumber(row["Total Budget"]) - spend;
//             break;
//           default:
//             break;
//         }

//         if (adTypeKey === "summary") totals[m] = value;
//         else totals[m] = (totals[m] || 0) + value;

//         dailyMap[key][m] = (dailyMap[key][m] || 0) + value;
//       });
//     });

//     if (config.metrics.includes("CTR")) {
//       totals.CTR = totals.Impressions
//         ? ((totals.Clicks / totals.Impressions) * 100).toFixed(2)
//         : "0.00";
//     }

//     setSummary(totals);
//     setDailyGraph(Object.values(dailyMap));
//     setReportTitle(
//       `${selectedAdType.toUpperCase()} REPORT` +
//         (selectedAdvertiser !== "All"
//           ? ` – ${selectedAdvertiser}`
//           : "")
//     );
//   };

//   /* ================= UI ================= */

//   if (!buildMode) {
//     return (
//       <div className="report-page">
//         <div className="report-card">
//           <h2>Need to run a report?</h2>
//           <button className="primary-btn" onClick={() => setBuildMode(true)}>
//             + Build a new report
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const adTypeKey = selectedAdType
//     .toLowerCase()
//     .replace(/[\s-_]/g, "");

//   return (
//     <div className="report-page">
//       <div className="report-card">
//         <h3>{reportTitle || "Publisher Reports"}</h3>

//         <div className="filter-bar">
//           <input type="date" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)} />
//           <input type="date" value={customTo} onChange={(e) => setCustomTo(e.target.value)} />

//           <select value={selectedAdvertiser} onChange={(e) => setSelectedAdvertiser(e.target.value)}>
//             {advertisers.map((a) => (
//               <option key={a}>{a}</option>
//             ))}
//           </select>

//           <select value={selectedAdType} onChange={(e) => setSelectedAdType(e.target.value)}>
//             {adTypes.map((t) => (
//               <option key={t}>{t}</option>
//             ))}
//           </select>

//           <label>
//             <input type="checkbox" checked={showGraph} onChange={() => setShowGraph(!showGraph)} />
//             Show Graph
//           </label>

//           <button className="primary-btn" onClick={runReport}>
//             View Report
//           </button>
//         </div>

//         {/* ===== METRIC CARDS (UNCHANGED) ===== */}
//         {summary && (
//           <div className="summary-row">
//             {METRIC_CONFIG[adTypeKey].metrics.map((m) => (
//               <div key={m} className="summary-box">
//                 <h4>{m}</h4>
//                 <p>{summary[m]}</p>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* ===== GRAPH (UNCHANGED) ===== */}
//         {showGraph &&
//           METRIC_CONFIG[adTypeKey]?.graph &&
//           dailyGraph.length > 0 && (
//             <Line
//               data={{
//                 labels: dailyGraph.map((d) =>
//                   d.date === "summary"
//                     ? "Summary"
//                     : formatDate(new Date(d.date))
//                 ),
//                 datasets: [
//                   {
//                     label: METRIC_CONFIG[adTypeKey].graph,
//                     data: dailyGraph.map(
//                       (d) => d[METRIC_CONFIG[adTypeKey].graph]
//                     ),
//                     borderColor: "#007f8c",
//                     tension: 0.3,
//                   },
//                 ],
//               }}
//             />
//           )}
//       </div>
//     </div>
//   );
// }

// import React, { useEffect, useMemo, useState } from "react";
// import axios from "axios";
// import { Line } from "react-chartjs-2";
// import "chart.js/auto";
// import "./reports.css";

// /* ================= HELPERS ================= */

// const safeNumber = (v) => {
//   if (v === null || v === undefined || v === "") return 0;
//   if (typeof v === "string") return Number(v.replace(/[$,%]/g, ""));
//   return Number(v);
// };

// /* -------- DATE NORMALIZATION -------- */

// const excelDateToJSDate = (serial) => {
//   if (!serial || isNaN(serial)) return null;
//   const epoch = new Date(Date.UTC(1899, 11, 30));
//   return new Date(epoch.getTime() + serial * 86400000);
// };

// const parseRowDate = (val) => {
//   if (!val) return null;
//   if (typeof val === "number") return excelDateToJSDate(val);
//   const d = new Date(val);
//   return isNaN(d.getTime()) ? null : d;
// };

// const formatDate = (date) =>
//   date
//     ? date.toLocaleDateString("en-GB", {
//         day: "2-digit",
//         month: "short",
//         year: "numeric",
//       })
//     : "";

// /* -------- SPEND -------- */

// const getSpend = (row) => {
//   const known =
//     row.Spend ??
//     row["Spend"] ??
//     row["spend"] ??
//     row["Spend($)"] ??
//     row["Spend ($)"] ??
//     row["Total Spend"] ??
//     row["Media Cost"] ??
//     row["Cost"];

//   if (known !== undefined) return safeNumber(known);

//   let max = 0;
//   Object.entries(row).forEach(([k, v]) => {
//     if (/impression|click|ctr|vcr/i.test(k)) return;
//     const num = safeNumber(v);
//     if (num > max) max = num;
//   });

//   return max;
// };

// /* ================= METRIC CONFIG ================= */

// const METRIC_CONFIG = {
//   video: { metrics: ["Impressions", "VCR", "Spend"], graph: "Impressions" },
//   display: {
//     metrics: ["Impressions", "Clicks", "CTR", "NP Convs", "Spend"],
//     graph: "Clicks",
//   },
//   ott: {
//     metrics: ["Impressions", "Clicks", "CTR", "NP Convs", "Spend"],
//     graph: "Clicks",
//   },
//   adwidget: { metrics: ["Impressions", "Clicks", "Spend"], graph: "Clicks" },
//   summary: { metrics: ["Total Budget", "Spend", "Remaining"], graph: null },
// };

// /* ================= COMPONENT ================= */

// export default function PublisherReports() {
//   const jwt = JSON.parse(localStorage.getItem("jwt"));
//   const token = jwt?.token;

//   const [buildMode, setBuildMode] = useState(false);
//   const [customFrom, setCustomFrom] = useState("");
//   const [customTo, setCustomTo] = useState("");
//   const [showGraph, setShowGraph] = useState(false);

//   const [allSheets, setAllSheets] = useState([]);

//   const [selectedAdvertiser, setSelectedAdvertiser] = useState("All");
//   const [selectedAdType, setSelectedAdType] = useState("All");

//   const [summary, setSummary] = useState(null);
//   const [dailyGraph, setDailyGraph] = useState([]);
//   const [reportTitle, setReportTitle] = useState("");

//   /* ================= FETCH ================= */

//   useEffect(() => {
//     axios
//       .get("https://imediareports.onrender.com/api/getallsheets", {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then((res) => setAllSheets(res.data || []))
//       .catch(console.error);
//   }, [token]);

//   /* ================= DROPDOWNS ================= */

//   const advertisers = useMemo(
//     () => ["All", ...new Set(allSheets.map((s) => s.advertiser).filter(Boolean))],
//     [allSheets]
//   );

//   const adTypes = useMemo(
//     () => ["All", ...new Set(allSheets.map((s) => s.name).filter(Boolean))],
//     [allSheets]
//   );

//   /* ================= RUN REPORT ================= */

//   const runReport = () => {
//     if (!customFrom || !customTo) return alert("Select start & end date");

//     const from = new Date(customFrom);
//     const to = new Date(customTo);

//     const adTypeKey = selectedAdType.toLowerCase().replace(/[\s-_]/g, "");
//     const config = METRIC_CONFIG[adTypeKey];
//     if (!config) return;

//     const sheets = allSheets.filter((s) => {
//       if (selectedAdvertiser !== "All" && s.advertiser !== selectedAdvertiser)
//         return false;
//       if (selectedAdType !== "All" && s.name !== selectedAdType) return false;
//       return true;
//     });

//     const records = sheets.flatMap((s) => s.data || []);
//     let totals = {};
//     let dailyMap = {};

//     records.forEach((row) => {
//       const d = parseRowDate(row.Date || row.date);
//       if (d && (d < from || d > to)) return;

//       const key = d ? d.toISOString().slice(0, 10) : "summary";
//       dailyMap[key] ??= { date: key };

//       const spend = getSpend(row);

//       config.metrics.forEach((m) => {
//         let val = 0;
//         if (m === "Impressions") val = safeNumber(row.Impressions);
//         if (m === "Clicks") val = safeNumber(row.Clicks);
//         if (m === "VCR") val = safeNumber(row.VCR);
//         if (m === "NP Convs") val = safeNumber(row["NP Convs"]);
//         if (m === "Spend") val = spend;
//         if (m === "Total Budget") val = safeNumber(row["Total Budget"]);
//         if (m === "Remaining")
//           val = safeNumber(row["Total Budget"]) - spend;

//         totals[m] = (totals[m] || 0) + val;
//         dailyMap[key][m] = (dailyMap[key][m] || 0) + val;
//       });
//     });

//     if (config.metrics.includes("CTR")) {
//       totals.CTR = totals.Impressions
//         ? ((totals.Clicks / totals.Impressions) * 100).toFixed(2)
//         : "0.00";
//     }

//     setSummary(totals);
//     setDailyGraph(Object.values(dailyMap));
//     setReportTitle(
//       `${selectedAdType.toUpperCase()} REPORT` +
//         (selectedAdvertiser !== "All"
//           ? ` – ${selectedAdvertiser}`
//           : "")
//     );
//   };

//   /* ================= UI ================= */

//   if (!buildMode) {
//     return (
//       <div className="report-page">
//         <div className="report-card">
//           <h2 style={{ fontSize: "32px", fontWeight: 700 }}>
//             Need to run a report?
//           </h2>
//           <button
//             className="primary-btn"
//             style={{ fontSize: "18px", fontWeight: 600 }}
//             onClick={() => setBuildMode(true)}
//           >
//             + Build a new report
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const adTypeKey = selectedAdType.toLowerCase().replace(/[\s-_]/g, "");

//   return (
//     <div className="report-page">
//       <div className="report-card">
//         <h3 style={{ fontSize: "28px", fontWeight: 700 }}>
//           {reportTitle || "Publisher Reports"}
//         </h3>

//         <div className="filter-bar" style={{ fontSize: "18px" }}>
//           <input type="date" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)} />
//           <input type="date" value={customTo} onChange={(e) => setCustomTo(e.target.value)} />

//           <select value={selectedAdvertiser} onChange={(e) => setSelectedAdvertiser(e.target.value)}>
//             {advertisers.map((a) => (
//               <option key={a}>{a}</option>
//             ))}
//           </select>

//           <select value={selectedAdType} onChange={(e) => setSelectedAdType(e.target.value)}>
//             {adTypes.map((t) => (
//               <option key={t}>{t}</option>
//             ))}
//           </select>

//           <label style={{ fontSize: "18px" }}>
//             <input type="checkbox" checked={showGraph} onChange={() => setShowGraph(!showGraph)} />
//             Show Graph
//           </label>

//           <button
//             className="primary-btn"
//             style={{ fontSize: "18px", fontWeight: 600 }}
//             onClick={runReport}
//           >
//             View Report
//           </button>
//         </div>

//         {summary && (
//           <div className="summary-row">
//             {METRIC_CONFIG[adTypeKey].metrics.map((m) => (
//               <div key={m} className="summary-box">
//                 <h4 style={{ fontSize: "20px", fontWeight: 600 }}>{m}</h4>
//                 <p style={{ fontSize: "24px", fontWeight: 700 }}>{summary[m]}</p>
//               </div>
//             ))}
//           </div>
//         )}

//         {showGraph &&
//           METRIC_CONFIG[adTypeKey]?.graph &&
//           dailyGraph.length > 0 && (
//             <Line
//               data={{
//                 labels: dailyGraph.map((d) =>
//                   d.date === "summary" ? "Summary" : formatDate(new Date(d.date))
//                 ),
//                 datasets: [
//                   {
//                     label: METRIC_CONFIG[adTypeKey].graph,
//                     data: dailyGraph.map((d) => d[METRIC_CONFIG[adTypeKey].graph]),
//                     borderColor: "#007f8c",
//                     tension: 0.3,
//                   },
//                 ],
//               }}
//             />
//           )}
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import "./reports.css";

/* ================= HELPERS ================= */

const safeNumber = (v) => {
  if (v === null || v === undefined || v === "") return 0;
  if (typeof v === "string") return Number(v.replace(/[$,%]/g, ""));
  return Number(v);
};

/* -------- DATE NORMALIZATION -------- */

const excelDateToJSDate = (serial) => {
  if (!serial || isNaN(serial)) return null;
  const epoch = new Date(Date.UTC(1899, 11, 30));
  return new Date(epoch.getTime() + serial * 86400000);
};

const parseRowDate = (val) => {
  if (!val) return null;
  if (typeof val === "number") return excelDateToJSDate(val);
  const d = new Date(val);
  return isNaN(d.getTime()) ? null : d;
};

const formatDate = (date) =>
  date
    ? date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";

/* -------- SPEND -------- */

const getSpend = (row) => {
  const known =
    row.Spend ??
    row["Spend"] ??
    row["spend"] ??
    row["Spend($)"] ??
    row["Spend ($)"] ??
    row["Total Spend"] ??
    row["Media Cost"] ??
    row["Cost"];

  if (known !== undefined) return safeNumber(known);

  let max = 0;
  Object.entries(row).forEach(([k, v]) => {
    if (/impression|click|ctr|vcr/i.test(k)) return;
    const num = safeNumber(v);
    if (num > max) max = num;
  });

  return max;
};

/* ================= METRIC CONFIG ================= */

const METRIC_CONFIG = {
  video: { metrics: ["Impressions", "VCR", "Spend"], graph: "Impressions" },
  ott: {
    metrics: ["Impressions", "Clicks", "CTR", "NP Convs", "Spend"],
    graph: "Clicks",
  },
  adwidget: {
    metrics: ["Impressions", "CTR", "Clicks", "NP Convs", "Spend"],
    graph: "Clicks",
  },
};

/* ================= COMPONENT ================= */

export default function PublisherReports() {
  const jwt = JSON.parse(localStorage.getItem("jwt"));
  const token = jwt?.token;

  /* UI STATE */
  const [buildMode, setBuildMode] = useState(false);
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [datePreset, setDatePreset] = useState("");
  const [showGraph, setShowGraph] = useState(false);
  const [showTable, setShowTable] = useState(false);

  /* DATA */
  const [allSheets, setAllSheets] = useState([]);

  /* FILTERS */
  const [selectedAdvertiser, setSelectedAdvertiser] = useState("All");
  const [selectedAdType, setSelectedAdType] = useState("All");

  /* OUTPUT */
  const [summary, setSummary] = useState(null);
  const [dailyGraph, setDailyGraph] = useState([]);
  const [reportTitle, setReportTitle] = useState("");

  /* ================= FETCH ================= */

  useEffect(() => {
    axios
      .get("https://imediareports.onrender.com/api/getallsheets", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setAllSheets(res.data || []))
      .catch(console.error);
  }, [token]);

  /* ================= DROPDOWNS ================= */

  const advertisers = useMemo(
    () => ["All", ...new Set(allSheets.map((s) => s.advertiser).filter(Boolean))],
    [allSheets]
  );

  const adTypes = useMemo(
    () => ["All", ...new Set(allSheets.map((s) => s.name).filter(Boolean))],
    [allSheets]
  );

  /* ================= DATE PRESETS ================= */

  const applyDatePreset = (preset) => {
    const today = new Date();
    let from, to;

    if (preset === "yesterday") {
      from = new Date(today);
      from.setDate(today.getDate() - 1);
      to = new Date(from);
    }

    if (preset === "lastweek") {
      to = new Date(today);
      from = new Date(today);
      from.setDate(today.getDate() - 7);
    }

    if (preset === "lastmonth") {
      to = new Date(today);
      from = new Date(today);
      from.setMonth(today.getMonth() - 1);
    }

    setCustomFrom(from.toISOString().slice(0, 10));
    setCustomTo(to.toISOString().slice(0, 10));
  };

  /* ================= RUN REPORT ================= */
const runReport = () => {
  if (!customFrom || !customTo) return alert("Select date range");

  const from = new Date(customFrom);
  const to = new Date(customTo);

  const adTypeKey = selectedAdType.toLowerCase().replace(/[\s-_]/g, "");
  const config = METRIC_CONFIG[adTypeKey];
  if (!config) return;

  /* ✅ Strict sheet match */
  const sheets = allSheets.filter(
    (s) =>
      (selectedAdvertiser === "All" || s.advertiser === selectedAdvertiser) &&
      (selectedAdType === "All" ||
        s.name?.toLowerCase().replace(/[\s-_]/g, "") === adTypeKey)
  );

  if (!sheets.length) {
    setSummary(null);
    setDailyGraph([]);
    return;
  }

  const records = sheets.flatMap((s) => s.data || []);

  let totals = {};
  let dailyMap = {};

  records.forEach((originalRow) => {
    /* 🔥 NORMALIZE KEYS */
    const row = {};
    Object.keys(originalRow).forEach((key) => {
      row[key.trim()] = originalRow[key];
    });

    const d = parseRowDate(row.Date || row.date);
    if (!d || d < from || d > to) return;

    const key = d.toISOString().slice(0, 10);
    dailyMap[key] ??= { date: key };

    config.metrics.forEach((m) => {
      let val = 0;

      if (m === "Impressions") val = safeNumber(row.Impressions);

      if (m === "Clicks") val = safeNumber(row.Clicks);

      if (m === "VCR") val = safeNumber(row.VCR);

      if (m === "NP Convs") val = safeNumber(row["NP Convs"]);

      if (m === "Spend") val = safeNumber(row.Spend);

      if (m === "CTR") {
        const impressions = safeNumber(row.Impressions);
        const clicks = safeNumber(row.Clicks);
        val = impressions > 0 ? (clicks / impressions) * 100 : 0;
      }

      totals[m] = (totals[m] || 0) + val;
      dailyMap[key][m] = (dailyMap[key][m] || 0) + val;
    });
  });

  setSummary(totals);
  setDailyGraph(Object.values(dailyMap));
  setReportTitle(
    `${selectedAdType.toUpperCase()} REPORT` +
      (selectedAdvertiser !== "All"
        ? ` – ${selectedAdvertiser}`
        : "")
  );
};

  /* ================= DOWNLOAD TABLE ================= */

  const downloadTable = () => {
    if (!dailyGraph.length) return;

    const adTypeKey = selectedAdType.toLowerCase().replace(/[\s-_]/g, "");
    const metrics = METRIC_CONFIG[adTypeKey]?.metrics || [];

    const csv = [
      ["Date", ...metrics],
      ...dailyGraph.map((d) => [
        formatDate(new Date(d.date)),
        ...metrics.map((m) => d[m] ?? 0),
      ]),
    ]
      .map((r) => r.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "publisher-report.csv";
    a.click();
  };

  /* ================= UI ================= */

  if (!buildMode) {
    return (
      <div className="report-page">
        <div className="report-card">
          <h2 style={{ fontSize: "32px", fontWeight: 700 }}>
            Need to run a report?
          </h2>
          <button
            className="primary-btn"
            style={{ fontSize: "18px", fontWeight: 600 }}
            onClick={() => setBuildMode(true)}
          >
            + Build a new report
          </button>
        </div>
      </div>
    );
  }

  const adTypeKey = selectedAdType.toLowerCase().replace(/[\s-_]/g, "");
  const metrics = METRIC_CONFIG[adTypeKey]?.metrics || [];

  return (
    <div className="report-page">
      <div className="report-card">
        <h3 style={{ fontSize: "28px", fontWeight: 700 }}>
          {reportTitle || "Publisher Reports"}
        </h3>

        {/* FILTER BAR */}
        <div className="filter-bar">
          <label>Date Range</label>
          <select
            value={datePreset}
            onChange={(e) => {
              setDatePreset(e.target.value);
              if (e.target.value !== "custom")
                applyDatePreset(e.target.value);
            }}
          >
            <option value="">Select</option>
            <option value="yesterday">Yesterday</option>
            <option value="lastweek">Last 7 Days</option>
            <option value="lastmonth">Last 30 Days</option>
            <option value="custom">Custom</option>
          </select>

          {datePreset === "custom" && (
            <>
              <input
                type="date"
                value={customFrom}
                onChange={(e) => setCustomFrom(e.target.value)}
              />
              <input
                type="date"
                value={customTo}
                onChange={(e) => setCustomTo(e.target.value)}
              />
            </>
          )}

          <label>Advertiser</label>
          <select
            value={selectedAdvertiser}
            onChange={(e) => setSelectedAdvertiser(e.target.value)}
          >
            {advertisers.map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>

          <label>Ad Type</label>
          <select
            value={selectedAdType}
            onChange={(e) => setSelectedAdType(e.target.value)}
          >
            {adTypes.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>

          <label>
            <input
              type="checkbox"
              checked={showGraph}
              onChange={() => setShowGraph(!showGraph)}
            />{" "}
            Graph
          </label>

          <label>
            <input
              type="checkbox"
              checked={showTable}
              onChange={() => setShowTable(!showTable)}
            />{" "}
            Table
          </label>

          <button className="primary-btn" onClick={runReport}>
            View
          </button>

          <button className="primary-btn" onClick={downloadTable}>
            ⬇ Download
          </button>
        </div>

        {/* SUMMARY CARDS */}
        {summary && (
          <div className="summary-row">
            {metrics.map((m) => (
              <div key={m} className="summary-box">
                <h4>{m}</h4>
                <p>
                  {m === "Spend"
                    ? `$${summary[m]?.toLocaleString()}`
                    : m === "CTR"
                    ? `${summary[m]?.toFixed(2)}%`
                    : summary[m]?.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* GRAPH */}
        {showGraph && dailyGraph.length > 0 && (
          <Line
            data={{
              labels: dailyGraph.map((d) =>
                formatDate(new Date(d.date))
              ),
              datasets: [
                {
                  label: METRIC_CONFIG[adTypeKey]?.graph,
                  data: dailyGraph.map(
                    (d) => d[METRIC_CONFIG[adTypeKey]?.graph]
                  ),
                  borderColor: "#007f8c",
                  tension: 0.3,
                },
              ],
            }}
          />
        )}

        {/* TABLE */}
        {showTable && dailyGraph.length > 0 && (
          <table className="report-table">
            <thead>
              <tr>
                <th>Date</th>
                {metrics.map((m) => (
                  <th key={m}>{m}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dailyGraph.map((d, i) => (
                <tr key={i}>
                  <td>{formatDate(new Date(d.date))}</td>
                  {metrics.map((m) => (
                    <td key={m}>
                      {m === "Spend"
                        ? `₹${(d[m] || 0).toLocaleString()}`
                        : m === "CTR"
                        ? `${(d[m] || 0).toFixed(2)}%`
                        : (d[m] || 0).toLocaleString()}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
