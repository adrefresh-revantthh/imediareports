

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
 
//   ott: {
//     metrics: ["Impressions", "Clicks", "CTR", "NP Convs","Spend"],
//     graph: "Clicks",
//   },
//   adwidget: { metrics: ["Impressions","CTR" ,"Clicks","NP Convs","Spend"], graph: "Clicks" },

// };

// /* ================= COMPONENT ================= */

// export default function AdvertiserReports() {
//   const token = JSON.parse(localStorage.getItem("jwt"))?.token;

//   /* UI STATE */
//   const [buildMode, setBuildMode] = useState(false);
//   const [customFrom, setCustomFrom] = useState("");
//   const [customTo, setCustomTo] = useState("");
//   const [datePreset, setDatePreset] = useState("");
//   const [showGraph, setShowGraph] = useState(false);
//   const [showTable, setShowTable] = useState(false);
//   const [loading, setLoading] = useState(false);

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
//     setLoading(true);
//     axios
//       .get("https://imediareports.onrender.com/api/getallsheets", {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then((res) => setAllSheets(res.data || []))
//       .catch(console.error)
//       .finally(() => setLoading(false));
//   }, [token]);

//   /* ================= DROPDOWNS ================= */
// // console.log(allSheets,"sheets")
//   const advertisers = useMemo(
//     () => ["All", ...new Set(allSheets.map((s) => s.advertiser).filter(Boolean))],
//     [allSheets]
//   );

//   const publishers = useMemo(
//     () => [
//       "All",
//       ...new Set(
//         allSheets
//           .filter(
//             (s) =>
//               selectedAdvertiser === "All" ||
//               s.advertiser === selectedAdvertiser
//           )
//           .map((s) => s.publisher)
//           .filter(Boolean)
//       ),
//     ],
//     [allSheets, selectedAdvertiser]
//   );

//   const campaigns = useMemo(
//     () => [
//       "All",
//       ...new Set(
//         allSheets
//           .filter(
//             (s) =>
//               (selectedAdvertiser === "All" ||
//                 s.advertiser === selectedAdvertiser) &&
//               (selectedPublisher === "All" ||
//                 s.publisher === selectedPublisher)
//           )
//           .map((s) => s.campaign)
//           .filter(Boolean)
//       ),
//     ],
//     [allSheets, selectedAdvertiser, selectedPublisher]
//   );

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

//   const runReport = () => {
//   if (!customFrom || !customTo) return alert("Select date range");

//   setLoading(true);

//   const from = new Date(customFrom);
//   const to = new Date(customTo);

//   const adTypeKey = selectedAdType.toLowerCase().replace(/[\s-_]/g, "");
//   const config = METRIC_CONFIG[adTypeKey];
//   if (!config) return;

//   /* ✅ STRICTLY MATCH ONLY SELECTED SHEET */
//   const selectedSheet = allSheets.find(
//     (s) =>
//       s.name?.toLowerCase().trim() ===
//       selectedAdType.toLowerCase().trim() &&
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

//   records.forEach((row) => {
//     const d = parseRowDate(row.Date || row.date);
//     if (!d || d < from || d > to) return;

//     const key = d.toISOString().slice(0, 10);
//     map[key] ??= { date: key };

//     config.metrics.forEach((m) => {
//       let val = 0;

//       if (m === "Impressions") val = safeNumber(row.Impressions);
//       if (m === "Clicks") val = safeNumber(row.Clicks);
//       if (m === "VCR") val = safeNumber(row.VCR);

//       /* ✅ SPEND FROM THIS SHEET ONLY */
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
//   setReportTitle(`${selectedAdType} | ${selectedAdvertiser}`);
//   setLoading(false);
// };

//   /* ================= DOWNLOAD TABLE ================= */

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
//               <input type="date" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)} />
//               <input type="date" value={customTo} onChange={(e) => setCustomTo(e.target.value)} />
//             </>
//           )}

//           {/* <label>Advertiser</label>
//           <select value={selectedAdvertiser} onChange={(e) => setSelectedAdvertiser(e.target.value)}>
//             {advertisers.map((a) => <option key={a}>{a}</option>)}
//           </select> */}

//           <label>Publisher</label>
//           <select value={selectedPublisher} onChange={(e) => setSelectedPublisher(e.target.value)}>
//             {publishers.map((p) => <option key={p}>{p}</option>)}
//           </select>

//           <label>Campaign</label>
//           <select value={selectedCampaign} onChange={(e) => setSelectedCampaign(e.target.value)}>
//             {campaigns.map((c) => <option key={c}>{c}</option>)}
//           </select>

//           <label>Ad Type</label>
//           <select value={selectedAdType} onChange={(e) => setSelectedAdType(e.target.value)}>
//             {adTypes.map((t) => <option key={t}>{t}</option>)}
//           </select>

//           <label>
//             <input type="checkbox" checked={showGraph} onChange={() => setShowGraph(!showGraph)} /> Graph
//           </label>

//           <label>
//             <input type="checkbox" checked={showTable} onChange={() => setShowTable(!showTable)} /> Table
//           </label>

//           <button className="primary-btn" onClick={runReport}>View</button>
//           <button className="primary-btn" onClick={downloadTable}>⬇ Download</button>
//         </div>

//         {/* SUMMARY CARDS */}
//         {summary && (
//           <div className="summary-row">
//             {metrics.map((m) => (
//               <div key={m} className="summary-box">
//                 <h4>{m}</h4>
//                 <p>
//                   {m === "Spend"
//                     ? `₹${summary[m]?.toLocaleString()}`
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
//               labels: dailyGraph.map((d) => formatDate(new Date(d.date))),
//               datasets: [
//                 {
//                   label: METRIC_CONFIG[adTypeKey]?.graph,
//                   data: dailyGraph.map((d) => d[METRIC_CONFIG[adTypeKey]?.graph]),
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
//                 {metrics.map((m) => <th key={m}>{m}</th>)}
//               </tr>
//             </thead>
//             <tbody>
//               {dailyGraph.map((d, i) => (
//                 <tr key={i}>
//                   <td>{formatDate(new Date(d.date))}</td>
//                   {metrics.map((m) => (
//                     <td key={m}>
//                       {m === "Spend"
//                         ? `₹${(d[m] || 0).toLocaleString()}`
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

export default function AdvertiserReports() {
  const token = JSON.parse(localStorage.getItem("jwt"))?.token;

  const [buildMode, setBuildMode] = useState(false);
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [datePreset, setDatePreset] = useState("");
  const [showGraph, setShowGraph] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [loading, setLoading] = useState(false);

  const [allSheets, setAllSheets] = useState([]);

  const [selectedPublisher, setSelectedPublisher] = useState("All");
  const [selectedCampaign, setSelectedCampaign] = useState("All");
  const [selectedAdType, setSelectedAdType] = useState("All");

  const [summary, setSummary] = useState(null);
  const [dailyGraph, setDailyGraph] = useState([]);
  const [reportTitle, setReportTitle] = useState("");

  /* ================= FETCH ================= */

  useEffect(() => {
    setLoading(true);
    axios
      .get("https://imediareports.onrender.com/api/getallsheets", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setAllSheets(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);
console.log(allSheets,"sheets");

  /* ================= DROPDOWNS ================= */

  const publishers = useMemo(
    () => ["All", ...new Set(allSheets.map((s) => s.publisher).filter(Boolean))],
    [allSheets]
  );

  const campaigns = useMemo(
    () => [
      "All",
      ...new Set(
        allSheets
          .filter(
            (s) =>
              selectedPublisher === "All" ||
              s.publisher === selectedPublisher
          )
          .map((s) => s.campaign)
          .filter(Boolean)
      ),
    ],
    [allSheets, selectedPublisher]
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

  setLoading(true);

  const from = new Date(customFrom);
  const to = new Date(customTo);

  const adTypeKey = selectedAdType.toLowerCase().replace(/[\s-_]/g, "");
  const config = METRIC_CONFIG[adTypeKey];
  if (!config) {
    setLoading(false);
    return;
  }

  /* ✅ Strict sheet match */
  const selectedSheet = allSheets.find(
    (s) =>
      s.name &&
      s.name.toLowerCase().replace(/[\s-_]/g, "") === adTypeKey &&
      (selectedPublisher === "All" || s.publisher === selectedPublisher) &&
      (selectedCampaign === "All" || s.campaign === selectedCampaign)
  );

  if (!selectedSheet) {
    setSummary(null);
    setDailyGraph([]);
    setLoading(false);
    return;
  }

  const records = selectedSheet.data || [];

  let totals = {};
  let map = {};

  records.forEach((originalRow) => {
    /* 🔥 NORMALIZE KEYS (THIS FIXES EVERYTHING) */
    const row = {};
    Object.keys(originalRow).forEach((key) => {
      row[key.trim()] = originalRow[key];
    });

    const d = parseRowDate(row.Date || row.date);
    if (!d || d < from || d > to) return;

    const key = d.toISOString().slice(0, 10);
    map[key] ??= { date: key };

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
      map[key][m] = (map[key][m] || 0) + val;
    });
  });

  setSummary(totals);
  setDailyGraph(Object.values(map));
  setReportTitle(selectedAdType);
  setLoading(false);
};


  /* ================= DOWNLOAD ================= */

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
    a.download = "advertiser-report.csv";
    a.click();
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
  const metrics = METRIC_CONFIG[adTypeKey]?.metrics || [];

  return (
    <div className="report-page">
      <div className="report-card">
        <h3 style={{ fontSize: 26, fontWeight: 700 }}>{reportTitle}</h3>

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

          <label>Publisher</label>
          <select
            value={selectedPublisher}
            onChange={(e) => setSelectedPublisher(e.target.value)}
          >
            {publishers.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>

          <label>Campaign</label>
          <select
            value={selectedCampaign}
            onChange={(e) => setSelectedCampaign(e.target.value)}
          >
            {campaigns.map((c) => (
              <option key={c}>{c}</option>
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
                        ? `$${(d[m] || 0).toLocaleString()}`
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
