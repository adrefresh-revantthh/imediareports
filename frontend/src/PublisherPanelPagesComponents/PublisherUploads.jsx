

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

// export default function PublisherReports() {
//   const jwt = JSON.parse(localStorage.getItem("jwt"));
//   const token = jwt?.token;

//   /* UI STATE */
//   const [buildMode, setBuildMode] = useState(false);
//   const [customFrom, setCustomFrom] = useState("");
//   const [customTo, setCustomTo] = useState("");
//   const [datePreset, setDatePreset] = useState("");
//   const [showGraph, setShowGraph] = useState(false);
//   const [showTable, setShowTable] = useState(false);

//   /* DATA */
//   const [allSheets, setAllSheets] = useState([]);

//   /* FILTERS */
//   // const [selectedAdvertiser, setSelectedAdvertiser] = useState("All");
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

//   const from = new Date(customFrom);
//   const to = new Date(customTo);

//   const adTypeKey = selectedAdType.toLowerCase().replace(/[\s-_]/g, "");
//   const config = METRIC_CONFIG[adTypeKey];
//   if (!config) return;

//   /* ✅ Strict sheet match */
//   const sheets = allSheets.filter(
//     (s) =>
      
//       (selectedAdType === "All" ||
//         s.name?.toLowerCase().replace(/[\s-_]/g, "") === adTypeKey)
//   );

//   if (!sheets.length) {
//     setSummary(null);
//     setDailyGraph([]);
//     return;
//   }

//   const records = sheets.flatMap((s) => s.data || []);

//   let totals = {};
//   let dailyMap = {};

//   records.forEach((originalRow) => {
//     /* 🔥 NORMALIZE KEYS */
//     const row = {};
//     Object.keys(originalRow).forEach((key) => {
//       row[key.trim()] = originalRow[key];
//     });

//     const d = parseRowDate(row.Date || row.date);
//     if (!d || d < from || d > to) return;

//     const key = d.toISOString().slice(0, 10);
//     dailyMap[key] ??= { date: key };

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
//       dailyMap[key][m] = (dailyMap[key][m] || 0) + val;
//     });
//   });

//   setSummary(totals);
//   setDailyGraph(Object.values(dailyMap));
//   setReportTitle(
//     `${selectedAdType.toUpperCase()} REPORT` +
//       (selectedAdvertiser !== "All"
//         ? ` – ${selectedAdvertiser}`
//         : "")
//   );
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
//     a.download = "publisher-report.csv";
//     a.click();
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
//   const metrics = METRIC_CONFIG[adTypeKey]?.metrics || [];

//   return (
//     <div className="report-page">
//       <div className="report-card">
//         <h3 style={{ fontSize: "28px", fontWeight: 700 }}>
//           {reportTitle || "Publisher Reports"}
//         </h3>

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
// {/* 
//           <label>Advertiser</label>
//           <select
//             value={selectedAdvertiser}
//             onChange={(e) => setSelectedAdvertiser(e.target.value)}
//           >
//             {advertisers.map((a) => (
//               <option key={a}>{a}</option>
//             ))}
//           </select> */}

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
//                   tension: 0.3,
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
   Classify a sheet name → "OTT" | "VIDEO" | "ADWIDGET" | null
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
   Flexible row value extraction — handles varied column names
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
      // Check explicit spend/revenue keys first
      const spendKey = Object.keys(row).find((k) => {
        const l = k.trim().toLowerCase();
        return l.includes("spend") || l.includes("revenue");
      });
      if (spendKey) {
        const val = safeNumber(row[spendKey]);
        if (val > 0) return val;
      }
      // CPM / CPC fallback
      const imp = safeNumber(
        row["Impressions"] ?? row["Imps"] ?? row["imps"] ?? row["impressions"]
      );
      const clk = safeNumber(row["Clicks"] ?? row["clicks"]);
      const cpm = safeNumber(row["CPM"] ?? row["cpm"]);
      const cpc = safeNumber(row["CPC"] ?? row["cpc"]);
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
};

/* ================================================================
   COMPONENT
================================================================ */
export default function PublisherReports() {
  const jwt   = JSON.parse(localStorage.getItem("jwt"));
  const token = jwt?.token;

  /* UI */
  const [buildMode,   setBuildMode]   = useState(false);
  const [datePreset,  setDatePreset]  = useState("");
  const [customFrom,  setCustomFrom]  = useState("");
  const [customTo,    setCustomTo]    = useState("");
  const [showGraph,   setShowGraph]   = useState(false);
  const [showTable,   setShowTable]   = useState(false);
  const [loading,     setLoading]     = useState(false);

  /* Data */
  const [allSheets, setAllSheets] = useState([]);

  /* Filters */
  const [selectedPlatform, setSelectedPlatform] = useState("All");

  /* Output */
  const [summary,     setSummary]     = useState(null);
  const [dailyGraph,  setDailyGraph]  = useState([]);
  const [reportTitle, setReportTitle] = useState("");

  /* ── Fetch all sheets once ── */
  useEffect(() => {
    if (!token) return;
    axios
      .get("https://imediareports.onrender.com/api/getallsheets", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setAllSheets(res.data || []))
      .catch(console.error);
  }, [token]);

  /* ── Available platforms derived from actual sheet names ── */
  const platforms = useMemo(() => {
    const found = new Set();
    allSheets.forEach((s) => {
      const p = classifySheet(s.name);
      if (p) found.add(p);
    });
    return ["All", ...Array.from(found).sort()];
  }, [allSheets]);

  /* ── Active metric config ── */
  const activeConfig = useMemo(() => {
    if (selectedPlatform === "All") {
      // Merge all metrics when "All" is selected
      return { metrics: ["Impressions", "Clicks", "CTR", "VCR", "NP Convs", "Spend"], graph: "Impressions" };
    }
    return METRIC_CONFIG[selectedPlatform] || { metrics: [], graph: "" };
  }, [selectedPlatform]);

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

  /* ── Run Report ── */
  const runReport = () => {
    if (!customFrom || !customTo) return alert("Please select a date range");

    const from = new Date(customFrom);
    const to   = new Date(customTo);

    // Filter sheets by selected platform
    const sheets = allSheets.filter((s) => {
      if (selectedPlatform === "All") return classifySheet(s.name) !== null;
      return classifySheet(s.name) === selectedPlatform;
    });

    if (!sheets.length) {
      alert("No data found for the selected platform");
      setSummary(null);
      setDailyGraph([]);
      return;
    }

    const { metrics } = activeConfig;
    const totals   = {};
    const dailyMap = {};

    // Init totals
    metrics.forEach((m) => { totals[m] = 0; });

    sheets.forEach((sheet) => {
      (sheet.data || []).forEach((originalRow) => {
        // Normalize keys — trim whitespace only, preserve original casing for lookup
        const row = {};
        Object.keys(originalRow).forEach((k) => {
          row[k.trim()] = originalRow[k];
        });

        const d = parseRowDate(row.Date || row.date);
        if (!d) return;

        const rowDate = new Date(d.toDateString());
        const fromDate = new Date(from.toDateString());
        const toDate   = new Date(to.toDateString());
        if (rowDate < fromDate || rowDate > toDate) return;

        const key = rowDate.toISOString().slice(0, 10);
        dailyMap[key] ??= { date: key, _imp: 0, _clk: 0 };

        metrics.forEach((m) => {
          if (m === "CTR") return; // calculated after aggregation

          const val = extractFromRow(row, m);
          totals[m]          = (totals[m] || 0) + val;
          dailyMap[key][m]   = (dailyMap[key][m] || 0) + val;

          // Track raw imp/clk for CTR calculation
          if (m === "Impressions") dailyMap[key]._imp += val;
          if (m === "Clicks")      dailyMap[key]._clk += val;
        });
      });
    });

    // ── Calculate CTR correctly (not summed) ──
    if (metrics.includes("CTR")) {
      totals["CTR"] =
        totals["Impressions"] > 0
          ? (totals["Clicks"] / totals["Impressions"]) * 100
          : 0;

      Object.values(dailyMap).forEach((day) => {
        day["CTR"] =
          day._imp > 0 ? (day._clk / day._imp) * 100 : 0;
      });
    }

    const sortedDays = Object.values(dailyMap).sort((a, b) =>
      a.date.localeCompare(b.date)
    );

    setSummary(totals);
    setDailyGraph(sortedDays);
    setReportTitle(`${selectedPlatform} REPORT  •  ${formatDate(from)} – ${formatDate(to)}`);

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
            m === "CTR"
              ? (d[m] || 0).toFixed(2)
              : (d[m] || 0).toLocaleString()
          ),
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const a    = document.createElement("a");
    a.href     = URL.createObjectURL(blob);
    a.download = `${selectedPlatform}-report.csv`;
    a.click();
  };




  
  /* ================================================================
     RENDER — Landing
  ================================================================ */
  if (!buildMode) {
    return (
      <div className="report-page" style={{textAlign:'center'}}>
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

  /* ================================================================
     RENDER — Report Builder
  ================================================================ */
  const { metrics, graph: graphMetric } = activeConfig;

  return (
    <div className="report-page">
      <div className="report-card">
        <h3 style={{ fontSize: "28px", fontWeight: 700 }}>
          {reportTitle || "Publisher Reports"}
        </h3>

        {/* ── FILTER BAR ── */}
        <div className="filter-bar">

          <label>Platform</label>
          <select
            value={selectedPlatform}
            onChange={(e) => {
              setSelectedPlatform(e.target.value);
              setSummary(null);
              setDailyGraph([]);
            }}
          >
            {platforms.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>

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

          <button className="primary-btn" onClick={runReport}>
            ▶ Run Report
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
                    ? `$${(summary[m] || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
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
                          ? `$${(d[m] || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
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
            No data found for the selected date range.
          </p>
        )}
      </div>
    </div>
  );
}
