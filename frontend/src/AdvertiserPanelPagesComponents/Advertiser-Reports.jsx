

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

// // /* -------- DATE NORMALIZATION -------- */

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

// // /* -------- SPEND DETECTION -------- */

// // const getSpend = (row) => {
// //   const known =
// //     row.Spend ??
// //     row["Spend"] ??
// //     row["Spend($)"] ??
// //     row["Media Cost"] ??
// //     row["Cost"];

// //   if (known !== undefined) return safeNumber(known);

// //   let max = 0;
// //   Object.entries(row).forEach(([k, v]) => {
// //     if (/impression|click|ctr|vcr/i.test(k)) return;
// //     const num = safeNumber(v);
// //     if (num > max) max = num;
// //   });

// //   return max;
// // };

// // /* ================= METRIC CONFIG ================= */

// // const METRIC_CONFIG = {
// //   video: { metrics: ["Impressions", "VCR", "Spend"], graph: "Impressions" },
 
// //   ott: {
// //     metrics: ["Impressions", "Clicks", "CTR", "NP Convs","Spend"],
// //     graph: "Clicks",
// //   },
// //   adwidget: { metrics: ["Impressions","CTR" ,"Clicks","NP Convs","Spend"], graph: "Clicks" },

// // };

// // /* ================= COMPONENT ================= */

// // export default function AdvertiserReports() {
// //   const token = JSON.parse(localStorage.getItem("jwt"))?.token;

// //   /* UI STATE */
// //   const [buildMode, setBuildMode] = useState(false);
// //   const [customFrom, setCustomFrom] = useState("");
// //   const [customTo, setCustomTo] = useState("");
// //   const [datePreset, setDatePreset] = useState("");
// //   const [showGraph, setShowGraph] = useState(false);
// //   const [showTable, setShowTable] = useState(false);
// //   const [loading, setLoading] = useState(false);

// //   /* DATA */
// //   const [allSheets, setAllSheets] = useState([]);

// //   /* FILTERS */
// //   const [selectedAdvertiser, setSelectedAdvertiser] = useState("All");
// //   const [selectedPublisher, setSelectedPublisher] = useState("All");
// //   const [selectedCampaign, setSelectedCampaign] = useState("All");
// //   const [selectedAdType, setSelectedAdType] = useState("All");

// //   /* OUTPUT */
// //   const [summary, setSummary] = useState(null);
// //   const [dailyGraph, setDailyGraph] = useState([]);
// //   const [reportTitle, setReportTitle] = useState("");

// //   /* ================= FETCH ================= */

// //   useEffect(() => {
// //     setLoading(true);
// //     axios
// //       .get("https://imediareports.onrender.com/api/getallsheets", {
// //         headers: { Authorization: `Bearer ${token}` },
// //       })
// //       .then((res) => setAllSheets(res.data || []))
// //       .catch(console.error)
// //       .finally(() => setLoading(false));
// //   }, [token]);

// //   /* ================= DROPDOWNS ================= */
// // // console.log(allSheets,"sheets")
// //   const advertisers = useMemo(
// //     () => ["All", ...new Set(allSheets.map((s) => s.advertiser).filter(Boolean))],
// //     [allSheets]
// //   );

// //   const publishers = useMemo(
// //     () => [
// //       "All",
// //       ...new Set(
// //         allSheets
// //           .filter(
// //             (s) =>
// //               selectedAdvertiser === "All" ||
// //               s.advertiser === selectedAdvertiser
// //           )
// //           .map((s) => s.publisher)
// //           .filter(Boolean)
// //       ),
// //     ],
// //     [allSheets, selectedAdvertiser]
// //   );

// //   const campaigns = useMemo(
// //     () => [
// //       "All",
// //       ...new Set(
// //         allSheets
// //           .filter(
// //             (s) =>
// //               (selectedAdvertiser === "All" ||
// //                 s.advertiser === selectedAdvertiser) &&
// //               (selectedPublisher === "All" ||
// //                 s.publisher === selectedPublisher)
// //           )
// //           .map((s) => s.campaign)
// //           .filter(Boolean)
// //       ),
// //     ],
// //     [allSheets, selectedAdvertiser, selectedPublisher]
// //   );

// //   const adTypes = useMemo(
// //     () => ["All", ...new Set(allSheets.map((s) => s.name).filter(Boolean))],
// //     [allSheets]
// //   );

// //   /* ================= DATE PRESETS ================= */

// //   const applyDatePreset = (preset) => {
// //     const today = new Date();
// //     let from, to;

// //     if (preset === "yesterday") {
// //       from = new Date(today);
// //       from.setDate(today.getDate() - 1);
// //       to = new Date(from);
// //     }

// //     if (preset === "lastweek") {
// //       to = new Date(today);
// //       from = new Date(today);
// //       from.setDate(today.getDate() - 7);
// //     }

// //     if (preset === "lastmonth") {
// //       to = new Date(today);
// //       from = new Date(today);
// //       from.setMonth(today.getMonth() - 1);
// //     }

// //     setCustomFrom(from.toISOString().slice(0, 10));
// //     setCustomTo(to.toISOString().slice(0, 10));
// //   };

// //   /* ================= RUN REPORT ================= */

// //   const runReport = () => {
// //   if (!customFrom || !customTo) return alert("Select date range");

// //   setLoading(true);

// //   const from = new Date(customFrom);
// //   const to = new Date(customTo);

// //   const adTypeKey = selectedAdType.toLowerCase().replace(/[\s-_]/g, "");
// //   const config = METRIC_CONFIG[adTypeKey];
// //   if (!config) return;

// //   /* ✅ STRICTLY MATCH ONLY SELECTED SHEET */
// //   const selectedSheet = allSheets.find(
// //     (s) =>
// //       s.name?.toLowerCase().trim() ===
// //       selectedAdType.toLowerCase().trim() &&
// //       (selectedPublisher === "All" || s.publisher === selectedPublisher) &&
// //       (selectedCampaign === "All" || s.campaign === selectedCampaign)
// //   );

// //   if (!selectedSheet) {
// //     setSummary(null);
// //     setDailyGraph([]);
// //     setLoading(false);
// //     return;
// //   }

// //   const records = selectedSheet.data || [];

// //   let totals = {};
// //   let map = {};

// //   records.forEach((row) => {
// //     const d = parseRowDate(row.Date || row.date);
// //     if (!d || d < from || d > to) return;

// //     const key = d.toISOString().slice(0, 10);
// //     map[key] ??= { date: key };

// //     config.metrics.forEach((m) => {
// //       let val = 0;

// //       if (m === "Impressions") val = safeNumber(row.Impressions);
// //       if (m === "Clicks") val = safeNumber(row.Clicks);
// //       if (m === "VCR") val = safeNumber(row.VCR);

// //       /* ✅ SPEND FROM THIS SHEET ONLY */
// //       if (m === "Spend") val = safeNumber(row.Spend);

// //       if (m === "CTR") {
// //         const impressions = safeNumber(row.Impressions);
// //         const clicks = safeNumber(row.Clicks);
// //         val = impressions > 0 ? (clicks / impressions) * 100 : 0;
// //       }

// //       totals[m] = (totals[m] || 0) + val;
// //       map[key][m] = (map[key][m] || 0) + val;
// //     });
// //   });

// //   setSummary(totals);
// //   setDailyGraph(Object.values(map));
// //   setReportTitle(`${selectedAdType} | ${selectedAdvertiser}`);
// //   setLoading(false);
// // };

// //   /* ================= DOWNLOAD TABLE ================= */

// //   const downloadTable = () => {
// //     if (!dailyGraph.length) return;

// //     const adTypeKey = selectedAdType.toLowerCase().replace(/[\s-_]/g, "");
// //     const metrics = METRIC_CONFIG[adTypeKey]?.metrics || [];

// //     const csv = [
// //       ["Date", ...metrics],
// //       ...dailyGraph.map((d) => [
// //         formatDate(new Date(d.date)),
// //         ...metrics.map((m) => d[m] ?? 0),
// //       ]),
// //     ]
// //       .map((r) => r.join(","))
// //       .join("\n");

// //     const blob = new Blob([csv], { type: "text/csv" });
// //     const a = document.createElement("a");
// //     a.href = URL.createObjectURL(blob);
// //     a.download = "advertiser-report.csv";
// //     a.click();
// //   };

// //   /* ================= UI ================= */

// //   if (!buildMode) {
// //     return (
// //       <div className="report-page">
// //         <div className="report-card">
// //           <h2 style={{ fontSize: 30, fontWeight: 700 }}>
// //             Advertiser Dashboard
// //           </h2>
// //           <button className="primary-btn" onClick={() => setBuildMode(true)}>
// //             + Build Report
// //           </button>
// //         </div>
// //       </div>
// //     );
// //   }

// //   const adTypeKey = selectedAdType.toLowerCase().replace(/[\s-_]/g, "");
// //   const metrics = METRIC_CONFIG[adTypeKey]?.metrics || [];

// //   return (
// //     <div className="report-page">
// //       <div className="report-card">
// //         <h3 style={{ fontSize: 26, fontWeight: 700 }}>{reportTitle}</h3>

// //         {/* FILTER BAR */}
// //         <div className="filter-bar">
// //           <label>Date Range</label>
// //           <select
// //             value={datePreset}
// //             onChange={(e) => {
// //               setDatePreset(e.target.value);
// //               if (e.target.value !== "custom")
// //                 applyDatePreset(e.target.value);
// //             }}
// //           >
// //             <option value="">Select</option>
// //             <option value="yesterday">Yesterday</option>
// //             <option value="lastweek">Last 7 Days</option>
// //             <option value="lastmonth">Last 30 Days</option>
// //             <option value="custom">Custom</option>
// //           </select>

// //           {datePreset === "custom" && (
// //             <>
// //               <input type="date" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)} />
// //               <input type="date" value={customTo} onChange={(e) => setCustomTo(e.target.value)} />
// //             </>
// //           )}

// //           {/* <label>Advertiser</label>
// //           <select value={selectedAdvertiser} onChange={(e) => setSelectedAdvertiser(e.target.value)}>
// //             {advertisers.map((a) => <option key={a}>{a}</option>)}
// //           </select> */}

// //           <label>Publisher</label>
// //           <select value={selectedPublisher} onChange={(e) => setSelectedPublisher(e.target.value)}>
// //             {publishers.map((p) => <option key={p}>{p}</option>)}
// //           </select>

// //           <label>Campaign</label>
// //           <select value={selectedCampaign} onChange={(e) => setSelectedCampaign(e.target.value)}>
// //             {campaigns.map((c) => <option key={c}>{c}</option>)}
// //           </select>

// //           <label>Ad Type</label>
// //           <select value={selectedAdType} onChange={(e) => setSelectedAdType(e.target.value)}>
// //             {adTypes.map((t) => <option key={t}>{t}</option>)}
// //           </select>

// //           <label>
// //             <input type="checkbox" checked={showGraph} onChange={() => setShowGraph(!showGraph)} /> Graph
// //           </label>

// //           <label>
// //             <input type="checkbox" checked={showTable} onChange={() => setShowTable(!showTable)} /> Table
// //           </label>

// //           <button className="primary-btn" onClick={runReport}>View</button>
// //           <button className="primary-btn" onClick={downloadTable}>⬇ Download</button>
// //         </div>

// //         {/* SUMMARY CARDS */}
// //         {summary && (
// //           <div className="summary-row">
// //             {metrics.map((m) => (
// //               <div key={m} className="summary-box">
// //                 <h4>{m}</h4>
// //                 <p>
// //                   {m === "Spend"
// //                     ? `₹${summary[m]?.toLocaleString()}`
// //                     : m === "CTR"
// //                     ? `${summary[m]?.toFixed(2)}%`
// //                     : summary[m]?.toLocaleString()}
// //                 </p>
// //               </div>
// //             ))}
// //           </div>
// //         )}

// //         {/* GRAPH */}
// //         {showGraph && dailyGraph.length > 0 && (
// //           <Line
// //             data={{
// //               labels: dailyGraph.map((d) => formatDate(new Date(d.date))),
// //               datasets: [
// //                 {
// //                   label: METRIC_CONFIG[adTypeKey]?.graph,
// //                   data: dailyGraph.map((d) => d[METRIC_CONFIG[adTypeKey]?.graph]),
// //                   borderColor: "#007f8c",
// //                 },
// //               ],
// //             }}
// //           />
// //         )}

// //         {/* TABLE */}
// //         {showTable && dailyGraph.length > 0 && (
// //           <table className="report-table">
// //             <thead>
// //               <tr>
// //                 <th>Date</th>
// //                 {metrics.map((m) => <th key={m}>{m}</th>)}
// //               </tr>
// //             </thead>
// //             <tbody>
// //               {dailyGraph.map((d, i) => (
// //                 <tr key={i}>
// //                   <td>{formatDate(new Date(d.date))}</td>
// //                   {metrics.map((m) => (
// //                     <td key={m}>
// //                       {m === "Spend"
// //                         ? `₹${(d[m] || 0).toLocaleString()}`
// //                         : m === "CTR"
// //                         ? `${(d[m] || 0).toFixed(2)}%`
// //                         : (d[m] || 0).toLocaleString()}
// //                     </td>
// //                   ))}
// //                 </tr>
// //               ))}
// //             </tbody>
// //           </table>
// //         )}
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

// /* ================= METRIC CONFIG ================= */

// const METRIC_CONFIG = {
//   video: { metrics: ["Impressions", "VCR", "Spend"], graph: "Impressions" },
//   ott: {
//     metrics: ["Impressions", "Clicks", "CTR", "NP Convs", "Spend"],
//     graph: "Clicks",
//   },
//   adwidget: {
//     metrics: ["Impressions", "CTR", "Clicks", "NP Convs", "Spend"],
//     graph: "Clicks",
//   },
// };

// /* ================= COMPONENT ================= */

// export default function AdvertiserReports() {
//   const token = JSON.parse(localStorage.getItem("jwt"))?.token;

//   const [buildMode, setBuildMode] = useState(false);
//   const [customFrom, setCustomFrom] = useState("");
//   const [customTo, setCustomTo] = useState("");
//   const [datePreset, setDatePreset] = useState("");
//   const [showGraph, setShowGraph] = useState(false);
//   const [showTable, setShowTable] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const [allSheets, setAllSheets] = useState([]);

//   // const [selectedPublisher, setSelectedPublisher] = useState("All");
//   const [selectedCampaign, setSelectedCampaign] = useState("All");
//   const [selectedAdType, setSelectedAdType] = useState("All");

//   const [summary, setSummary] = useState(null);
//   const [dailyGraph, setDailyGraph] = useState([]);
//   const [reportTitle, setReportTitle] = useState("");

//   /* ================= FETCH ================= */

//   useEffect(() => {
//     setLoading(true);
//     axios
//       .get("https://imediareports.onrender.com/api/getallsheets", {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then((res) => setAllSheets(res.data || []))
//       .catch(console.error)
//       .finally(() => setLoading(false));
//   }, [token]);
// console.log(allSheets,"sheets");

//   /* ================= DROPDOWNS ================= */



//   const adTypes = useMemo(
//     () => ["All", ...new Set(allSheets.map((s) => s.name).filter(Boolean))],
//     [allSheets]
//   );

//   /* ================= DATE PRESETS ================= */

//   const applyDatePreset = (preset) => {
//     const today = new Date();
//     let from, to;

//     if (preset === "yesterday") {
//       from = new Date(today);
//       from.setDate(today.getDate() - 1);
//       to = new Date(from);
//     }

//     if (preset === "lastweek") {
//       to = new Date(today);
//       from = new Date(today);
//       from.setDate(today.getDate() - 7);
//     }

//     if (preset === "lastmonth") {
//       to = new Date(today);
//       from = new Date(today);
//       from.setMonth(today.getMonth() - 1);
//     }

//     setCustomFrom(from.toISOString().slice(0, 10));
//     setCustomTo(to.toISOString().slice(0, 10));
//   };

//   /* ================= RUN REPORT ================= */
// const runReport = () => {
//   if (!customFrom || !customTo) return alert("Select date range");

//   setLoading(true);

//   const from = new Date(customFrom);
//   const to = new Date(customTo);

//   const adTypeKey = selectedAdType.toLowerCase().replace(/[\s-_]/g, "");
//   const config = METRIC_CONFIG[adTypeKey];
//   if (!config) {
//     setLoading(false);
//     return;
//   }

//   /* ✅ Strict sheet match */
//   const selectedSheet = allSheets.find(
//     (s) =>
//       s.name &&
//       s.name.toLowerCase().replace(/[\s-_]/g, "") === adTypeKey &&
//       (selectedPublisher === "All" || s.publisher === selectedPublisher) &&
//       (selectedCampaign === "All" || s.campaign === selectedCampaign)
//   );

//   if (!selectedSheet) {
//     setSummary(null);
//     setDailyGraph([]);
//     setLoading(false);
//     return;
//   }

//   const records = selectedSheet.data || [];

//   let totals = {};
//   let map = {};

//   records.forEach((originalRow) => {
//     /* 🔥 NORMALIZE KEYS (THIS FIXES EVERYTHING) */
//     const row = {};
//     Object.keys(originalRow).forEach((key) => {
//       row[key.trim()] = originalRow[key];
//     });

//     const d = parseRowDate(row.Date || row.date);
//     if (!d || d < from || d > to) return;

//     const key = d.toISOString().slice(0, 10);
//     map[key] ??= { date: key };

//     config.metrics.forEach((m) => {
//       let val = 0;

//       if (m === "Impressions") val = safeNumber(row.Impressions);

//       if (m === "Clicks") val = safeNumber(row.Clicks);

//       if (m === "VCR") val = safeNumber(row.VCR);

//       if (m === "NP Convs") val = safeNumber(row["NP Convs"]);

//       if (m === "Spend") val = safeNumber(row.Spend);

//       if (m === "CTR") {
//         const impressions = safeNumber(row.Impressions);
//         const clicks = safeNumber(row.Clicks);
//         val = impressions > 0 ? (clicks / impressions) * 100 : 0;
//       }

//       totals[m] = (totals[m] || 0) + val;
//       map[key][m] = (map[key][m] || 0) + val;
//     });
//   });

//   setSummary(totals);
//   setDailyGraph(Object.values(map));
//   setReportTitle(selectedAdType);
//   setLoading(false);
// };


//   /* ================= DOWNLOAD ================= */

//   const downloadTable = () => {
//     if (!dailyGraph.length) return;

//     const adTypeKey = selectedAdType.toLowerCase().replace(/[\s-_]/g, "");
//     const metrics = METRIC_CONFIG[adTypeKey]?.metrics || [];

//     const csv = [
//       ["Date", ...metrics],
//       ...dailyGraph.map((d) => [
//         formatDate(new Date(d.date)),
//         ...metrics.map((m) => d[m] ?? 0),
//       ]),
//     ]
//       .map((r) => r.join(","))
//       .join("\n");

//     const blob = new Blob([csv], { type: "text/csv" });
//     const a = document.createElement("a");
//     a.href = URL.createObjectURL(blob);
//     a.download = "advertiser-report.csv";
//     a.click();
//   };

//   /* ================= UI ================= */

//   if (!buildMode) {
//     return (
//       <div className="report-page">
//         <div className="report-card">
//           <h2 style={{ fontSize: 30, fontWeight: 700 }}>
//             Advertiser Dashboard
//           </h2>
//           <button className="primary-btn" onClick={() => setBuildMode(true)}>
//             + Build Report
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const adTypeKey = selectedAdType.toLowerCase().replace(/[\s-_]/g, "");
//   const metrics = METRIC_CONFIG[adTypeKey]?.metrics || [];

//   return (
//     <div className="report-page">
//       <div className="report-card">
//         <h3 style={{ fontSize: 26, fontWeight: 700 }}>{reportTitle}</h3>

//         {/* FILTER BAR */}
//         <div className="filter-bar">
//           <label>Date Range</label>
//           <select
//             value={datePreset}
//             onChange={(e) => {
//               setDatePreset(e.target.value);
//               if (e.target.value !== "custom")
//                 applyDatePreset(e.target.value);
//             }}
//           >
//             <option value="">Select</option>
//             <option value="yesterday">Yesterday</option>
//             <option value="lastweek">Last 7 Days</option>
//             <option value="lastmonth">Last 30 Days</option>
//             <option value="custom">Custom</option>
//           </select>

//           {datePreset === "custom" && (
//             <>
//               <input
//                 type="date"
//                 value={customFrom}
//                 onChange={(e) => setCustomFrom(e.target.value)}
//               />
//               <input
//                 type="date"
//                 value={customTo}
//                 onChange={(e) => setCustomTo(e.target.value)}
//               />
//             </>
//           )}

//           {/* <label>Publisher</label>
//           <select
//             value={selectedPublisher}
//             onChange={(e) => setSelectedPublisher(e.target.value)}
//           >
//             {publishers.map((p) => (
//               <option key={p}>{p}</option>
//             ))}
//           </select> */}

//           <label>Campaign</label>
//           <select
//             value={selectedCampaign}
//             onChange={(e) => setSelectedCampaign(e.target.value)}
//           >
//             {campaigns.map((c) => (
//               <option key={c}>{c}</option>
//             ))}
//           </select>

//           <label>Ad Type</label>
//           <select
//             value={selectedAdType}
//             onChange={(e) => setSelectedAdType(e.target.value)}
//           >
//             {adTypes.map((t) => (
//               <option key={t}>{t}</option>
//             ))}
//           </select>

//           <label>
//             <input
//               type="checkbox"
//               checked={showGraph}
//               onChange={() => setShowGraph(!showGraph)}
//             />{" "}
//             Graph
//           </label>

//           <label>
//             <input
//               type="checkbox"
//               checked={showTable}
//               onChange={() => setShowTable(!showTable)}
//             />{" "}
//             Table
//           </label>

//           <button className="primary-btn" onClick={runReport}>
//             View
//           </button>
//           <button className="primary-btn" onClick={downloadTable}>
//             ⬇ Download
//           </button>
//         </div>

//         {/* SUMMARY CARDS */}
//         {summary && (
//           <div className="summary-row">
//             {metrics.map((m) => (
//               <div key={m} className="summary-box">
//                 <h4>{m}</h4>
//                 <p>
//                   {m === "Spend"
//                     ? `$${summary[m]?.toLocaleString()}`
//                     : m === "CTR"
//                     ? `${summary[m]?.toFixed(2)}%`
//                     : summary[m]?.toLocaleString()}
//                 </p>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* GRAPH */}
//         {showGraph && dailyGraph.length > 0 && (
//           <Line
//             data={{
//               labels: dailyGraph.map((d) =>
//                 formatDate(new Date(d.date))
//               ),
//               datasets: [
//                 {
//                   label: METRIC_CONFIG[adTypeKey]?.graph,
//                   data: dailyGraph.map(
//                     (d) => d[METRIC_CONFIG[adTypeKey]?.graph]
//                   ),
//                   borderColor: "#007f8c",
//                 },
//               ],
//             }}
//           />
//         )}

//         {/* TABLE */}
//         {showTable && dailyGraph.length > 0 && (
//           <table className="report-table">
//             <thead>
//               <tr>
//                 <th>Date</th>
//                 {metrics.map((m) => (
//                   <th key={m}>{m}</th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {dailyGraph.map((d, i) => (
//                 <tr key={i}>
//                   <td>{formatDate(new Date(d.date))}</td>
//                   {metrics.map((m) => (
//                     <td key={m}>
//                       {m === "Spend"
//                         ? `$${(d[m] || 0).toLocaleString()}`
//                         : m === "CTR"
//                         ? `${(d[m] || 0).toFixed(2)}%`
//                         : (d[m] || 0).toLocaleString()}
//                     </td>
//                   ))}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// }
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import "./reports.css";

/* ================================================================
   HELPERS
================================================================ */

const safeNumber = (v) => {
  if (v === null || v === undefined || v === "") return 0;
  const n = parseFloat(String(v).replace(/[^0-9.-]+/g, ""));
  return isNaN(n) ? 0 : n;
};

const excelDateToJS = (serial) => {
  if (!serial || isNaN(serial)) return null;
  const epoch = new Date(Date.UTC(1899, 11, 30));
  return new Date(epoch.getTime() + serial * 86400000);
};

const parseRowDate = (val) => {
  if (!val) return null;
  if (typeof val === "number") return excelDateToJS(val);
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

/* ----------------------------------------------------------------
   Classify sheet name → "OTT" | "VIDEO" | "ADWIDGET" | null
---------------------------------------------------------------- */
const classifySheet = (name = "") => {
  const s = name.toLowerCase();
  if (s.includes("ott") || s.includes("ctv") || s.includes("connected tv") || s.includes("streaming"))
    return "OTT";
  if (s.includes("video") || s.includes("preroll") || s.includes("pre-roll") || s.includes("instream"))
    return "VIDEO";
  if (s.includes("adwidget") || s.includes("display") || s.includes("widget") || s.includes("banner"))
    return "ADWIDGET";
  return null;
};

/* ----------------------------------------------------------------
   Flexible metric extraction — handles varied column names
---------------------------------------------------------------- */
const extractFromRow = (row, metric) => {
  switch (metric) {
    case "Impressions":
      return safeNumber(
        row["Impressions"] ?? row["impressions"] ?? row["Imps"] ??
        row["imps"] ?? row["Imp"] ?? row["Total Impressions"]
      );
    case "Clicks":
      return safeNumber(
        row["Clicks"] ?? row["clicks"] ?? row["Click"] ?? row["Total Clicks"]
      );
    case "VCR":
      return safeNumber(row["VCR"] ?? row["vcr"] ?? row["View Completion Rate"]);
    case "NP Convs":
      return safeNumber(
        row["NP Convs"] ?? row["NP Conv"] ?? row["Conversions"] ?? row["Conv"]
      );
    case "Spend": {
      // Priority 1: any key containing "spend" or "revenue"
      const spendKey = Object.keys(row).find((k) => {
        const l = k.trim().toLowerCase();
        return l.includes("spend") || l.includes("revenue");
      });
      if (spendKey) {
        const val = safeNumber(row[spendKey]);
        if (val > 0) return val;
      }
      // Fallback: CPC → CPM
      const imp = safeNumber(row["Impressions"] ?? row["Imps"] ?? row["imps"]);
      const clk = safeNumber(row["Clicks"] ?? row["clicks"]);
      const cpc = safeNumber(row["CPC"] ?? row["cpc"]);
      const cpm = safeNumber(row["CPM"] ?? row["cpm"]);
      if (cpc > 0) return clk * cpc;
      if (cpm > 0) return (imp / 1000) * cpm;
      return 0;
    }
    default:
      return 0;
  }
};

/* ================================================================
   METRIC CONFIG per platform
================================================================ */
const METRIC_CONFIG = {
  OTT:      { metrics: ["Impressions", "Clicks", "CTR", "NP Convs", "Spend"], graph: "Impressions" },
  VIDEO:    { metrics: ["Impressions", "VCR", "Spend"],                        graph: "Impressions" },
  ADWIDGET: { metrics: ["Impressions", "Clicks", "CTR", "NP Convs", "Spend"], graph: "Clicks"      },
  All:      { metrics: ["Impressions", "Clicks", "CTR", "VCR", "NP Convs", "Spend"], graph: "Impressions" },
};

/* ================================================================
   COMPONENT
================================================================ */
export default function AdvertiserReports() {
  const token = JSON.parse(localStorage.getItem("jwt"))?.token;

  const [buildMode,  setBuildMode]  = useState(false);
  const [customFrom, setCustomFrom] = useState("");
  const [customTo,   setCustomTo]   = useState("");
  const [datePreset, setDatePreset] = useState("");
  const [showGraph,  setShowGraph]  = useState(false);
  const [showTable,  setShowTable]  = useState(false);
  const [loading,    setLoading]    = useState(false);

  const [allSheets, setAllSheets] = useState([]);

  // ✅ Campaign replaces Publisher — derived from sheet.campaign field
  const [selectedCampaign, setSelectedCampaign] = useState("All");
  const [selectedAdType,   setSelectedAdType]   = useState("All");

  const [summary,     setSummary]     = useState(null);
  const [dailyGraph,  setDailyGraph]  = useState([]);
  const [reportTitle, setReportTitle] = useState("");

  /* ── Fetch sheets ── */
  useEffect(() => {
    if (!token) return;
    setLoading(true);
    axios
      .get("https://imediareports.onrender.com/api/getallsheets", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setAllSheets(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  /* ── Platforms dropdown — classified from sheet names ── */
  const adTypes = useMemo(() => {
    const found = new Set();
    allSheets.forEach((s) => {
      const p = classifySheet(s.name);
      if (p) found.add(p);
    });
    return ["All", ...Array.from(found).sort()];
  }, [allSheets]);

  /* ── Campaigns dropdown — from sheet.campaign or sheet.name fallback ──
     Filters by selected ad type so campaigns are contextual             */
  const campaigns = useMemo(() => {
    const relevant = allSheets.filter((s) => {
      if (selectedAdType === "All") return classifySheet(s.name) !== null;
      return classifySheet(s.name) === selectedAdType;
    });

    const names = new Set();
    relevant.forEach((s) => {
      // Try common campaign field names
      const camp =
        s.campaign ||
        s.Campaign ||
        s.campaignName ||
        s.campaign_name ||
        s.advertiser ||
        null;
      if (camp) names.add(camp);
    });

    // If no campaign field exists, fall back to sheet name as label
    if (names.size === 0) {
      relevant.forEach((s) => { if (s.name) names.add(s.name); });
    }

    return ["All", ...Array.from(names).sort()];
  }, [allSheets, selectedAdType]);

  /* ── Date presets ── */
  const applyDatePreset = (preset) => {
    const today = new Date();
    let from, to;
    if (preset === "yesterday") {
      from = new Date(today); from.setDate(today.getDate() - 1);
      to   = new Date(from);
    }
    if (preset === "lastweek") {
      to   = new Date(today);
      from = new Date(today); from.setDate(today.getDate() - 7);
    }
    if (preset === "lastmonth") {
      to   = new Date(today);
      from = new Date(today); from.setMonth(today.getMonth() - 1);
    }
    setCustomFrom(from.toISOString().slice(0, 10));
    setCustomTo(to.toISOString().slice(0, 10));
  };

  /* ── Active config ── */
  const activeConfig = METRIC_CONFIG[selectedAdType] || METRIC_CONFIG["All"];

  /* ================================================================
     RUN REPORT
  ================================================================ */
  const runReport = () => {
    if (!customFrom || !customTo) return alert("Please select a date range");

    const from = new Date(customFrom);
    const to   = new Date(customTo);

    // Filter sheets by Ad Type classification
    const sheets = allSheets.filter((s) => {
      const platform = classifySheet(s.name);
      if (!platform) return false; // skip unclassified

      const adTypeMatch =
        selectedAdType === "All" || platform === selectedAdType;

      // Campaign filter — match against any campaign field or sheet name
      const camp =
        s.campaign || s.Campaign || s.campaignName ||
        s.campaign_name || s.advertiser || s.name || "";

      const campaignMatch =
        selectedCampaign === "All" || camp === selectedCampaign;

      return adTypeMatch && campaignMatch;
    });

    if (!sheets.length) {
      alert("No matching sheets found for the selected filters");
      setSummary(null);
      setDailyGraph([]);
      return;
    }

    const { metrics } = activeConfig;
    const totals   = {};
    const dailyMap = {};

    metrics.forEach((m) => { totals[m] = 0; });

    sheets.forEach((sheet) => {
      (sheet.data || []).forEach((originalRow) => {
        // Normalize keys — trim whitespace
        const row = {};
        Object.keys(originalRow).forEach((k) => {
          row[k.trim()] = originalRow[k];
        });

        const d = parseRowDate(row.Date || row.date);
        if (!d) return;

        const rowDate  = new Date(d.toDateString());
        const fromDate = new Date(from.toDateString());
        const toDate   = new Date(to.toDateString());
        if (rowDate < fromDate || rowDate > toDate) return;

        const key = rowDate.toISOString().slice(0, 10);
        dailyMap[key] ??= { date: key, _imp: 0, _clk: 0 };

        metrics.forEach((m) => {
          if (m === "CTR") return; // calculated after

          const val = extractFromRow(row, m);
          totals[m]        = (totals[m] || 0) + val;
          dailyMap[key][m] = (dailyMap[key][m] || 0) + val;

          if (m === "Impressions") dailyMap[key]._imp += val;
          if (m === "Clicks")      dailyMap[key]._clk += val;
        });
      });
    });

    // ✅ CTR recalculated correctly — never summed
    if (metrics.includes("CTR")) {
      totals["CTR"] =
        totals["Impressions"] > 0
          ? (totals["Clicks"] / totals["Impressions"]) * 100
          : 0;

      Object.values(dailyMap).forEach((day) => {
        day["CTR"] = day._imp > 0 ? (day._clk / day._imp) * 100 : 0;
      });
    }

    const sortedDays = Object.values(dailyMap).sort((a, b) =>
      a.date.localeCompare(b.date)
    );

    setSummary(totals);
    setDailyGraph(sortedDays);
    setReportTitle(
      `${selectedAdType} REPORT` +
      (selectedCampaign !== "All" ? ` — ${selectedCampaign}` : "") +
      `  •  ${formatDate(from)} – ${formatDate(to)}`
    );

    console.log("📊 Totals:", totals);
    console.log("📅 Daily:", sortedDays);
  };

  /* ── Download CSV ── */
  const downloadCSV = () => {
    if (!dailyGraph.length) return;
    const { metrics } = activeConfig;
    const csv = [
      ["Date", ...metrics].join(","),
      ...dailyGraph.map((d) =>
        [
          formatDate(new Date(d.date)),
          ...metrics.map((m) =>
            m === "CTR" || m === "VCR"
              ? (d[m] || 0).toFixed(2)
              : (d[m] || 0)
          ),
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const a    = document.createElement("a");
    a.href     = URL.createObjectURL(blob);
    a.download = `${selectedAdType}-advertiser-report.csv`;
    a.click();
  };

  /* ================================================================
     RENDER — Landing
  ================================================================ */
  if (!buildMode) {
    return (
      <div className="report-page">
        <div className="report-card" style={{textAlign:"center"}}>
          <h2 style={{ fontSize: 30, fontWeight: 700 }}>Advertiser Dashboard</h2>
          <button className="primary-btn" onClick={() => setBuildMode(true)}>
            + Build Report
          </button>
        </div>
      </div>
    );
  }

  /* ================================================================
     RENDER — Report Builder
  ================================================================ */
  const { metrics, graph: graphMetric } = activeConfig;

  return (
    <div className="report-page">
      <div className="report-card">
        <h3 style={{ fontSize: 26, fontWeight: 700 }}>
          {reportTitle || "Advertiser Reports"}
        </h3>

        {/* ── FILTER BAR ── */}
        <div className="filter-bar">

          {/* Ad Type */}
          <label>Ad Type</label>
          <select
            value={selectedAdType}
            onChange={(e) => {
              setSelectedAdType(e.target.value);
              setSelectedCampaign("All"); // reset campaign when ad type changes
              setSummary(null);
              setDailyGraph([]);
            }}
          >
            {adTypes.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>

          {/* Campaign */}
          <label>Campaign</label>
          <select
            value={selectedCampaign}
            onChange={(e) => setSelectedCampaign(e.target.value)}
          >
            {campaigns.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          {/* Date Range */}
          <label>Date Range</label>
          <select
            value={datePreset}
            onChange={(e) => {
              setDatePreset(e.target.value);
              if (e.target.value !== "custom") applyDatePreset(e.target.value);
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

          {/* Toggles */}
          <label>
            <input
              type="checkbox"
              checked={showGraph}
              onChange={() => setShowGraph((v) => !v)}
            />{" "}
            Graph
          </label>

          <label>
            <input
              type="checkbox"
              checked={showTable}
              onChange={() => setShowTable((v) => !v)}
            />{" "}
            Table
          </label>

          <button className="primary-btn" onClick={runReport} disabled={loading}>
            {loading ? "Loading…" : "▶ Run Report"}
          </button>

          {dailyGraph.length > 0 && (
            <button className="primary-btn" onClick={downloadCSV}>
              ⬇ Download CSV
            </button>
          )}
        </div>

        {/* ── SUMMARY CARDS ── */}
        {summary && (
          <div className="summary-row">
            {metrics.map((m) => (
              <div key={m} className="summary-box">
                <h4>{m}</h4>
                <p>
                  {m === "Spend"
                    ? `$${(summary[m] || 0).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`
                    : m === "CTR" || m === "VCR"
                    ? `${(summary[m] || 0).toFixed(2)}%`
                    : (summary[m] || 0).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* ── GRAPH ── */}
        {showGraph && dailyGraph.length > 0 && graphMetric && (
          <div style={{ marginTop: 24 }}>
            <h4 style={{ marginBottom: 8 }}>{graphMetric} over time</h4>
            <Line
              data={{
                labels: dailyGraph.map((d) => formatDate(new Date(d.date))),
                datasets: [
                  {
                    label: graphMetric,
                    data: dailyGraph.map((d) => d[graphMetric] || 0),
                    borderColor: "#007f8c",
                    backgroundColor: "rgba(0,127,140,0.08)",
                    fill: true,
                    tension: 0.3,
                    pointRadius: 4,
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } },
              }}
            />
          </div>
        )}

        {/* ── TABLE ── */}
        {showTable && dailyGraph.length > 0 && (
          <div style={{ overflowX: "auto", marginTop: 24 }}>
            <table className="report-table">
              <thead>
                <tr>
                  <th>Date</th>
                  {metrics.map((m) => <th key={m}>{m}</th>)}
                </tr>
              </thead>
              <tbody>
                {dailyGraph.map((d, i) => (
                  <tr key={i}>
                    <td>{formatDate(new Date(d.date))}</td>
                    {metrics.map((m) => (
                      <td key={m}>
                        {m === "Spend"
                          ? `$${(d[m] || 0).toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}`
                          : m === "CTR" || m === "VCR"
                          ? `${(d[m] || 0).toFixed(2)}%`
                          : (d[m] || 0).toLocaleString()}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── EMPTY STATE ── */}
        {summary && dailyGraph.length === 0 && (
          <p style={{ color: "#888", marginTop: 24, textAlign: "center" }}>
            No data found for the selected filters and date range.
          </p>
        )}
      </div>
    </div>
  );
}
