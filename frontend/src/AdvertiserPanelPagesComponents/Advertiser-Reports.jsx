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
// //   display: {
// //     metrics: ["Impressions", "Clicks", "CTR", "NP Convs", "Spend"],
// //     graph: "Clicks",
// //   },
// //   ott: {
// //     metrics: ["Impressions", "Clicks", "CTR", "NP Convs", "Spend"],
// //     graph: "Clicks",
// //   },
// //   adwidget: { metrics: ["Impressions", "Clicks", "Spend"], graph: "Clicks" },
// //   summary: { metrics: ["Total Budget", "Spend", "Remaining"], graph: null },
// // };

// // /* ================= COMPONENT ================= */

// // export default function AdvertiserReports() {
// //   const token = JSON.parse(localStorage.getItem("jwt"))?.token;

// //   /* UI STATE */
// //   const [buildMode, setBuildMode] = useState(false);
// //   const [customFrom, setCustomFrom] = useState("");
// //   const [customTo, setCustomTo] = useState("");
// //   const [showGraph, setShowGraph] = useState(false);

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
// //     axios
// //       .get("https://imediareports.onrender.com/api/getallsheets", {
// //         headers: { Authorization: `Bearer ${token}` },
// //       })
// //       .then((res) => setAllSheets(res.data || []))
// //       .catch(console.error);
// //   }, [token]);

// //   /* ================= DROPDOWNS ================= */

// //   const advertisers = useMemo(
// //     () => ["All", ...new Set(allSheets.map(s => s.advertiser).filter(Boolean))],
// //     [allSheets]
// //   );

// //   const publishers = useMemo(() => {
// //     return [
// //       "All",
// //       ...new Set(
// //         allSheets
// //           .filter(s => selectedAdvertiser === "All" || s.advertiser === selectedAdvertiser)
// //           .map(s => s.publisher)
// //           .filter(Boolean)
// //       ),
// //     ];
// //   }, [allSheets, selectedAdvertiser]);

// //   const campaigns = useMemo(() => {
// //     return [
// //       "All",
// //       ...new Set(
// //         allSheets
// //           .filter(
// //             s =>
// //               (selectedAdvertiser === "All" || s.advertiser === selectedAdvertiser) &&
// //               (selectedPublisher === "All" || s.publisher === selectedPublisher)
// //           )
// //           .map(s => s.campaign)
// //           .filter(Boolean)
// //       ),
// //     ];
// //   }, [allSheets, selectedAdvertiser, selectedPublisher]);

// //   const adTypes = useMemo(
// //     () => ["All", ...new Set(allSheets.map(s => s.name).filter(Boolean))],
// //     [allSheets]
// //   );

// //   /* ================= RUN REPORT ================= */

// //   const runReport = () => {
// //     if (!customFrom || !customTo) return alert("Select date range");

// //     const from = new Date(customFrom);
// //     const to = new Date(customTo);

// //     const adTypeKey = selectedAdType.toLowerCase().replace(/[\s-_]/g, "");
// //     const config = METRIC_CONFIG[adTypeKey];
// //     if (!config) return;

// //     const sheets = allSheets.filter(s => {
// //       if (selectedAdvertiser !== "All" && s.advertiser !== selectedAdvertiser) return false;
// //       if (selectedPublisher !== "All" && s.publisher !== selectedPublisher) return false;
// //       if (selectedCampaign !== "All" && s.campaign !== selectedCampaign) return false;
// //       if (selectedAdType !== "All" && s.name !== selectedAdType) return false;
// //       return true;
// //     });

// //     const records = sheets.flatMap(s => s.data || []);
// //     let totals = {};
// //     let dailyMap = {};

// //     records.forEach(row => {
// //       const d = parseRowDate(row.Date || row.date);
// //       if (d && (d < from || d > to)) return;

// //       const key = d ? d.toISOString().slice(0, 10) : "summary";
// //       dailyMap[key] ??= { date: key };

// //       config.metrics.forEach(m => {
// //         let val = 0;
// //         if (m === "Impressions") val = safeNumber(row.Impressions);
// //         if (m === "Clicks") val = safeNumber(row.Clicks);
// //         if (m === "VCR") val = safeNumber(row.VCR);
// //         if (m === "NP Convs") val = safeNumber(row["NP Convs"]);
// //         if (m === "Spend") val = getSpend(row);
// //         if (m === "Total Budget") val = safeNumber(row["Total Budget"]);
// //         if (m === "Remaining") val = safeNumber(row["Total Budget"]) - getSpend(row);

// //         totals[m] = (totals[m] || 0) + val;
// //         dailyMap[key][m] = (dailyMap[key][m] || 0) + val;
// //       });
// //     });

// //     if (config.metrics.includes("CTR")) {
// //       totals.CTR = totals.Impressions
// //         ? ((totals.Clicks / totals.Impressions) * 100).toFixed(2)
// //         : "0.00";
// //     }

// //     setSummary(totals);
// //     setDailyGraph(Object.values(dailyMap));
// //     setReportTitle(`${selectedAdType} | ${selectedAdvertiser}`);
// //   };

// //   /* ================= UI ================= */

// //   if (!buildMode) {
// //     return (
// //       <div className="report-page">
// //         <div className="report-card">
// //           <h2>Advertiser Dashboard</h2>
// //           <button className="primary-btn" onClick={() => setBuildMode(true)}>
// //             + Build Report
// //           </button>
// //         </div>
// //       </div>
// //     );
// //   }

// //   const adTypeKey = selectedAdType.toLowerCase().replace(/[\s-_]/g, "");

// //   return (
// //     <div className="report-page">
// //       <div className="report-card">
// //         <h3>{reportTitle}</h3>

// //         <div className="filter-bar">
// //           <input type="date" value={customFrom} onChange={e => setCustomFrom(e.target.value)} />
// //           <input type="date" value={customTo} onChange={e => setCustomTo(e.target.value)} />

// //           <select value={selectedAdvertiser} onChange={e => {
// //             setSelectedAdvertiser(e.target.value);
// //             setSelectedPublisher("All");
// //             setSelectedCampaign("All");
// //           }}>
// //             {advertisers.map(a => <option key={a}>{a}</option>)}
// //           </select>

// //           <select value={selectedPublisher} onChange={e => {
// //             setSelectedPublisher(e.target.value);
// //             setSelectedCampaign("All");
// //           }}>
// //             {publishers.map(p => <option key={p}>{p}</option>)}
// //           </select>

// //           <select value={selectedCampaign} onChange={e => setSelectedCampaign(e.target.value)}>
// //             {campaigns.map(c => <option key={c}>{c}</option>)}
// //           </select>

// //           <select value={selectedAdType} onChange={e => setSelectedAdType(e.target.value)}>
// //             {adTypes.map(t => <option key={t}>{t}</option>)}
// //           </select>

// //           <label>
// //             <input type="checkbox" checked={showGraph} onChange={() => setShowGraph(!showGraph)} />
// //             Graph
// //           </label>

// //           <button className="primary-btn" onClick={runReport}>
// //             View Report
// //           </button>
// //         </div>

// //         {summary && (
// //           <div className="summary-row">
// //             {METRIC_CONFIG[adTypeKey]?.metrics.map(m => (
// //               <div key={m} className="summary-box">
// //                 <h4>{m}</h4>
// //                 <p>{summary[m]}</p>
// //               </div>
// //             ))}
// //           </div>
// //         )}

// //         {showGraph && METRIC_CONFIG[adTypeKey]?.graph && dailyGraph.length > 0 && (
// //           <Line
// //             data={{
// //               labels: dailyGraph.map(d =>
// //                 d.date === "summary" ? "Summary" : formatDate(new Date(d.date))
// //               ),
// //               datasets: [
// //                 {
// //                   label: METRIC_CONFIG[adTypeKey].graph,
// //                   data: dailyGraph.map(d => d[METRIC_CONFIG[adTypeKey].graph]),
// //                   borderColor: "#007f8c",
// //                   tension: 0.3,
// //                 },
// //               ],
// //             }}
// //           />
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

// /* -------- SPEND DETECTION -------- */

// const getSpend = (row) => {
//   const known =
//     row.Spend ??
//     row["Spend"] ??
//     row["Spend($)"] ??
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

// export default function AdvertiserReports() {
//   const token = JSON.parse(localStorage.getItem("jwt"))?.token;

//   /* UI STATE */
//   const [buildMode, setBuildMode] = useState(false);
//   const [customFrom, setCustomFrom] = useState("");
//   const [customTo, setCustomTo] = useState("");
//   const [showGraph, setShowGraph] = useState(false);

//   /* DATA */
//   const [allSheets, setAllSheets] = useState([]);

//   /* FILTERS */
//   const [selectedAdvertiser, setSelectedAdvertiser] = useState("All");
//   const [selectedPublisher, setSelectedPublisher] = useState("All");
//   const [selectedCampaign, setSelectedCampaign] = useState("All");
//   const [selectedAdType, setSelectedAdType] = useState("All");

//   /* OUTPUT */
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
//     () => ["All", ...new Set(allSheets.map(s => s.advertiser).filter(Boolean))],
//     [allSheets]
//   );

//   const publishers = useMemo(() => {
//     return [
//       "All",
//       ...new Set(
//         allSheets
//           .filter(s => selectedAdvertiser === "All" || s.advertiser === selectedAdvertiser)
//           .map(s => s.publisher)
//           .filter(Boolean)
//       ),
//     ];
//   }, [allSheets, selectedAdvertiser]);

//   const campaigns = useMemo(() => {
//     return [
//       "All",
//       ...new Set(
//         allSheets
//           .filter(
//             s =>
//               (selectedAdvertiser === "All" || s.advertiser === selectedAdvertiser) &&
//               (selectedPublisher === "All" || s.publisher === selectedPublisher)
//           )
//           .map(s => s.campaign)
//           .filter(Boolean)
//       ),
//     ];
//   }, [allSheets, selectedAdvertiser, selectedPublisher]);

//   const adTypes = useMemo(
//     () => ["All", ...new Set(allSheets.map(s => s.name).filter(Boolean))],
//     [allSheets]
//   );

//   /* ================= RUN REPORT ================= */

//   const runReport = () => {
//     if (!customFrom || !customTo) return alert("Select date range");

//     const from = new Date(customFrom);
//     const to = new Date(customTo);

//     const adTypeKey = selectedAdType.toLowerCase().replace(/[\s-_]/g, "");
//     const config = METRIC_CONFIG[adTypeKey];
//     if (!config) return;

//     const sheets = allSheets.filter(s => {
//       if (selectedAdvertiser !== "All" && s.advertiser !== selectedAdvertiser) return false;
//       if (selectedPublisher !== "All" && s.publisher !== selectedPublisher) return false;
//       if (selectedCampaign !== "All" && s.campaign !== selectedCampaign) return false;
//       if (selectedAdType !== "All" && s.name !== selectedAdType) return false;
//       return true;
//     });

//     const records = sheets.flatMap(s => s.data || []);
//     let totals = {};
//     let dailyMap = {};

//     records.forEach(row => {
//       const d = parseRowDate(row.Date || row.date);
//       if (d && (d < from || d > to)) return;

//       const key = d ? d.toISOString().slice(0, 10) : "summary";
//       dailyMap[key] ??= { date: key };

//       config.metrics.forEach(m => {
//         let val = 0;
//         if (m === "Impressions") val = safeNumber(row.Impressions);
//         if (m === "Clicks") val = safeNumber(row.Clicks);
//         if (m === "VCR") val = safeNumber(row.VCR);
//         if (m === "NP Convs") val = safeNumber(row["NP Convs"]);
//         if (m === "Spend") val = getSpend(row);
//         if (m === "Total Budget") val = safeNumber(row["Total Budget"]);
//         if (m === "Remaining") val = safeNumber(row["Total Budget"]) - getSpend(row);

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
//     setReportTitle(`${selectedAdType} | ${selectedAdvertiser}`);
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

//   return (
//     <div className="report-page">
//       <div className="report-card">
//         <h3 style={{ fontSize: 26, fontWeight: 700 }}>{reportTitle}</h3>

//         <div className="filter-bar" style={{ fontSize: 18 }}>
//           <input type="date" value={customFrom} onChange={e => setCustomFrom(e.target.value)} />
//           <input type="date" value={customTo} onChange={e => setCustomTo(e.target.value)} />

//           <select value={selectedAdvertiser} onChange={e => {
//             setSelectedAdvertiser(e.target.value);
//             setSelectedPublisher("All");
//             setSelectedCampaign("All");
//           }}>
//             {advertisers.map(a => <option key={a}>{a}</option>)}
//           </select>

//           <select value={selectedPublisher} onChange={e => {
//             setSelectedPublisher(e.target.value);
//             setSelectedCampaign("All");
//           }}>
//             {publishers.map(p => <option key={p}>{p}</option>)}
//           </select>

//           <select value={selectedCampaign} onChange={e => setSelectedCampaign(e.target.value)}>
//             {campaigns.map(c => <option key={c}>{c}</option>)}
//           </select>

//           <select value={selectedAdType} onChange={e => setSelectedAdType(e.target.value)}>
//             {adTypes.map(t => <option key={t}>{t}</option>)}
//           </select>

//           <label style={{ fontSize: 18 }}>
//             <input type="checkbox" checked={showGraph} onChange={() => setShowGraph(!showGraph)} />
//             {" "}Graph
//           </label>

//           <button className="primary-btn" onClick={runReport}>
//             View Report
//           </button>
//         </div>

//         {summary && (
//           <div className="summary-row">
//             {METRIC_CONFIG[adTypeKey]?.metrics.map(m => (
//               <div key={m} className="summary-box">
//                 <h4 style={{ fontSize: 22, fontWeight: 600 }}>{m}</h4>
//                 <p style={{ fontSize: 24, fontWeight: 700 }}>{summary[m]}</p>
//               </div>
//             ))}
//           </div>
//         )}

//         {showGraph && METRIC_CONFIG[adTypeKey]?.graph && dailyGraph.length > 0 && (
//           <Line
//             data={{
//               labels: dailyGraph.map(d =>
//                 d.date === "summary" ? "Summary" : formatDate(new Date(d.date))
//               ),
//               datasets: [
//                 {
//                   label: METRIC_CONFIG[adTypeKey].graph,
//                   data: dailyGraph.map(d => d[METRIC_CONFIG[adTypeKey].graph]),
//                   borderColor: "#007f8c",
//                   tension: 0.3,
//                 },
//               ],
//             }}
//           />
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

/* -------- SPEND DETECTION -------- */

const getSpend = (row) => {
  const known =
    row.Spend ??
    row["Spend"] ??
    row["Spend($)"] ??
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
  display: {
    metrics: ["Impressions", "Clicks", "CTR", "NP Convs", "Spend"],
    graph: "Clicks",
  },
  ott: {
    metrics: ["Impressions", "Clicks", "CTR", "NP Convs", "Spend"],
    graph: "Clicks",
  },
  adwidget: { metrics: ["Impressions", "Clicks", "Spend"], graph: "Clicks" },
  summary: { metrics: ["Total Budget", "Spend", "Remaining"], graph: null },
};

/* ================= COMPONENT ================= */

export default function AdvertiserReports() {
  const token = JSON.parse(localStorage.getItem("jwt"))?.token;

  /* UI STATE */
  const [buildMode, setBuildMode] = useState(false);
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [showGraph, setShowGraph] = useState(false);
  const [loading, setLoading] = useState(false); // ✅ NEW

  /* DATA */
  const [allSheets, setAllSheets] = useState([]);

  /* FILTERS */
  const [selectedAdvertiser, setSelectedAdvertiser] = useState("All");
  const [selectedPublisher, setSelectedPublisher] = useState("All");
  const [selectedCampaign, setSelectedCampaign] = useState("All");
  const [selectedAdType, setSelectedAdType] = useState("All");

  /* OUTPUT */
  const [summary, setSummary] = useState(null);
  const [dailyGraph, setDailyGraph] = useState([]);
  const [reportTitle, setReportTitle] = useState("");

  /* ================= FETCH ================= */

  useEffect(() => {
    setLoading(true); // ✅
    axios
      .get("https://imediareports.onrender.com/api/getallsheets", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setAllSheets(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false)); // ✅
  }, [token]);

  /* ================= DROPDOWNS ================= */

  const advertisers = useMemo(
    () => ["All", ...new Set(allSheets.map((s) => s.advertiser).filter(Boolean))],
    [allSheets]
  );

  const publishers = useMemo(() => {
    return [
      "All",
      ...new Set(
        allSheets
          .filter(
            (s) =>
              selectedAdvertiser === "All" ||
              s.advertiser === selectedAdvertiser
          )
          .map((s) => s.publisher)
          .filter(Boolean)
      ),
    ];
  }, [allSheets, selectedAdvertiser]);

  const campaigns = useMemo(() => {
    return [
      "All",
      ...new Set(
        allSheets
          .filter(
            (s) =>
              (selectedAdvertiser === "All" ||
                s.advertiser === selectedAdvertiser) &&
              (selectedPublisher === "All" ||
                s.publisher === selectedPublisher)
          )
          .map((s) => s.campaign)
          .filter(Boolean)
      ),
    ];
  }, [allSheets, selectedAdvertiser, selectedPublisher]);

  const adTypes = useMemo(
    () => ["All", ...new Set(allSheets.map((s) => s.name).filter(Boolean))],
    [allSheets]
  );

  /* ================= RUN REPORT ================= */

  const runReport = () => {
    if (!customFrom || !customTo) return alert("Select date range");

    setLoading(true); // ✅

    const from = new Date(customFrom);
    const to = new Date(customTo);

    const adTypeKey = selectedAdType.toLowerCase().replace(/[\s-_]/g, "");
    const config = METRIC_CONFIG[adTypeKey];
    if (!config) return;

    const sheets = allSheets.filter((s) => {
      if (selectedAdvertiser !== "All" && s.advertiser !== selectedAdvertiser)
        return false;
      if (selectedPublisher !== "All" && s.publisher !== selectedPublisher)
        return false;
      if (selectedCampaign !== "All" && s.campaign !== selectedCampaign)
        return false;
      if (selectedAdType !== "All" && s.name !== selectedAdType) return false;
      return true;
    });

    const records = sheets.flatMap((s) => s.data || []);
    let totals = {};
    let dailyMap = {};

    records.forEach((row) => {
      const d = parseRowDate(row.Date || row.date);
      if (d && (d < from || d > to)) return;

      const key = d ? d.toISOString().slice(0, 10) : "summary";
      dailyMap[key] ??= { date: key };

      config.metrics.forEach((m) => {
        let val = 0;
        if (m === "Impressions") val = safeNumber(row.Impressions);
        if (m === "Clicks") val = safeNumber(row.Clicks);
        if (m === "VCR") val = safeNumber(row.VCR);
        if (m === "NP Convs") val = safeNumber(row["NP Convs"]);
        if (m === "Spend") val = getSpend(row);
        if (m === "Total Budget") val = safeNumber(row["Total Budget"]);
        if (m === "Remaining")
          val = safeNumber(row["Total Budget"]) - getSpend(row);

        totals[m] = (totals[m] || 0) + val;
        dailyMap[key][m] = (dailyMap[key][m] || 0) + val;
      });
    });

    if (config.metrics.includes("CTR")) {
      totals.CTR = totals.Impressions
        ? ((totals.Clicks / totals.Impressions) * 100).toFixed(2)
        : "0.00";
    }

    setSummary(totals);
    setDailyGraph(Object.values(dailyMap));
    setReportTitle(`${selectedAdType} | ${selectedAdvertiser}`);
    setLoading(false); // ✅
  };

  /* ================= UI ================= */

  if (!buildMode) {
    return (
      <div className="report-page">
        <div className="report-card">
          <h2 style={{ fontSize: 30, fontWeight: 700 }}>
            Advertiser Dashboard
          </h2>
          <button className="primary-btn" onClick={() => setBuildMode(true)}>
            + Build Report
          </button>
        </div>
      </div>
    );
  }

  const adTypeKey = selectedAdType.toLowerCase().replace(/[\s-_]/g, "");

  return (
    <div className="report-page">
      <div className="report-card">
        <h3 style={{ fontSize: 26, fontWeight: 700 }}>{reportTitle}</h3>

        <div className="filter-bar" style={{ fontSize: 18 }}>
          <input type="date" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)} />
          <input type="date" value={customTo} onChange={(e) => setCustomTo(e.target.value)} />

          <select value={selectedAdvertiser} onChange={(e) => {
            setSelectedAdvertiser(e.target.value);
            setSelectedPublisher("All");
            setSelectedCampaign("All");
          }}>
            {advertisers.map((a) => <option key={a}>{a}</option>)}
          </select>

          <select value={selectedPublisher} onChange={(e) => {
            setSelectedPublisher(e.target.value);
            setSelectedCampaign("All");
          }}>
            {publishers.map((p) => <option key={p}>{p}</option>)}
          </select>

          <select value={selectedCampaign} onChange={(e) => setSelectedCampaign(e.target.value)}>
            {campaigns.map((c) => <option key={c}>{c}</option>)}
          </select>

          <select value={selectedAdType} onChange={(e) => setSelectedAdType(e.target.value)}>
            {adTypes.map((t) => <option key={t}>{t}</option>)}
          </select>

          <label style={{ fontSize: 18 }}>
            <input type="checkbox" checked={showGraph} onChange={() => setShowGraph(!showGraph)} /> Graph
          </label>

          <button className="primary-btn" onClick={runReport}>
            View Report
          </button>
        </div>

        {/* ===== SUMMARY ===== */}
        {loading ? (
          <div className="summary-row">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="summary-box skeleton-box" />
            ))}
          </div>
        ) : (
          summary && (
            <div className="summary-row">
              {METRIC_CONFIG[adTypeKey]?.metrics.map((m) => (
                <div key={m} className="summary-box">
                  <h4 style={{ fontSize: 22 }}>{m}</h4>
                  <p style={{ fontSize: 24 }}>{summary[m]}</p>
                </div>
              ))}
            </div>
          )
        )}

        {/* ===== GRAPH ===== */}
        {showGraph &&
          (loading ? (
            <div className="skeleton-graph" />
          ) : (
            METRIC_CONFIG[adTypeKey]?.graph &&
            dailyGraph.length > 0 && (
              <Line
                data={{
                  labels: dailyGraph.map((d) =>
                    d.date === "summary" ? "Summary" : formatDate(new Date(d.date))
                  ),
                  datasets: [
                    {
                      label: METRIC_CONFIG[adTypeKey].graph,
                      data: dailyGraph.map((d) => d[METRIC_CONFIG[adTypeKey].graph]),
                      borderColor: "#007f8c",
                      tension: 0.3,
                    },
                  ],
                }}
              />
            )
          ))}

        {/* ===== SKELETON CSS ===== */}
        <style>
          {`
            .skeleton-box,
            .skeleton-graph {
              background: linear-gradient(
                90deg,
                #e5e7eb 25%,
                #f3f4f6 37%,
                #e5e7eb 63%
              );
              background-size: 400% 100%;
              animation: shimmer 1.4s ease infinite;
              border-radius: 10px;
            }

            .skeleton-box {
              height: 90px;
            }

            .skeleton-graph {
              height: 320px;
              margin-top: 20px;
            }

            @keyframes shimmer {
              0% { background-position: 100% 0; }
              100% { background-position: -100% 0; }
            }
          `}
        </style>
      </div>
    </div>
  );
}
