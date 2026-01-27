// import React, { useState, useEffect, useContext } from "react";
// import axios from "axios";
// import {
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Legend,
//   CartesianGrid,
// } from "recharts";
// import { ThemeContext } from "./ThemeSettings/ThemeContext";

// const CHART_PAGE_SIZE = 10;
// const ROWS_PER_PAGE = 7;

// const normalizeKey = (key = "") =>
//   key.toString().trim().toLowerCase().replace(/\s+/g, "_").replace(/[^\w]/g, "");

// const findFieldKey = (keys, terms) =>
//   keys.find((key) => terms.some((t) => key.includes(t))) || null;

// const safeNum = (v) => {
//   if (v === null || v === undefined || v === "") return 0;
//   const s = String(v).replace(/,/g, "").replace(/[^0-9.\-]/g, "");
//   const n = parseFloat(s);
//   return Number.isFinite(n) ? n : 0;
// };

// // Convert Excel serial date → readable date
// const convertExcelDate = (excelDate) => {
//   if (!excelDate || isNaN(excelDate)) return excelDate;
//   const epoch = new Date(1899, 11, 30);
//   const date = new Date(epoch.getTime() + excelDate * 86400000);
//   return date.toISOString().split("T")[0];
// };

// const exportToCSV = (rows, columns, title) => {
//   if (!rows || !columns) return;
//   const csvRows = [columns.join(",")];
//   rows.forEach((r) => {
//     const rowData = columns.map((c) => {
//       const val = r[c];
//       return val == null ? "" : `"${String(val).replace(/"/g, '""')}"`;
//     });
//     csvRows.push(rowData.join(","));
//   });
//   const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
//   const url = window.URL.createObjectURL(blob);
//   const a = document.createElement("a");
//   a.href = url;
//   a.download = `${title.replace(/\s+/g, "_")}_${new Date()
//     .toISOString()
//     .slice(0, 10)}.csv`;
//   document.body.appendChild(a);
//   a.click();
//   document.body.removeChild(a);
// };

// export default function DisplayData() {
//   const { theme } = useContext(ThemeContext);
//   const [sections, setSections] = useState({
//     genealogysegments: null,
//     genealogyretargeting: null,
//     genealogysites: null,
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [expandedTables, setExpandedTables] = useState({});
//   const [chartPages, setChartPages] = useState({});

//   const colors = {
//     bg:
//       theme === "dark"
//         ? "linear-gradient(135deg,#0f172a,#1e293b)"
//         : "linear-gradient(135deg,#f8fafc,#e0f2fe)",
//     cardBg: theme === "dark" ? "rgba(30,41,59,0.9)" : "#ffffff",
//     text: theme === "dark" ? "#e2e8f0" : "#0f172a",
//     border: theme === "dark" ? "#334155" : "#cbd5e1",
//     primary: "#007bff", // blue
//     secondary: "#f00000ff", // teal
//   };

//   useEffect(() => {
//     const fetchGenealogy = async () => {
//       setLoading(true);
//       setError("");
//       try {
//         const tokenObj = JSON.parse(localStorage.getItem("jwt") || "null");
//         const token = tokenObj?.token;
//         if (!token) throw new Error("No JWT token found. Please login.");

//         const res = await axios.get(
//           "http://localhost:5000/api/getgenealogyrecords",
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         console.log(res,"res");
        

//         const docs = Array.isArray(res.data)
//           ? res.data
//           : res.data?.genealogySheets || [];

//         const processDoc = (doc) => {
//           if (!doc || !Array.isArray(doc.data)) return null;
//           const rows = doc.data.filter(
//             (r) => r && typeof r === "object" && Object.values(r).some((v) => v !== "")
//           );
//           if (!rows.length) return null;

//           // 🧹 Remove "__EMPTY", "Unnamed", "Column", etc.
//           const headers = Array.from(new Set(rows.flatMap((r) => Object.keys(r)))).filter(
//             (h) =>
//               h &&
//               h.trim().length > 0 &&
//               !/^(__empty|unnamed|column|blank)/i.test(h.trim())
//           );

//           const cleaned = rows.map((r) => {
//             const o = {};
//             headers.forEach((h) => {
//               const val = r[h];
//               if (val !== null && val !== undefined && String(val).trim() !== "")
//                 o[h] = val;
//             });
//             return o;
//           });

//           const keys = headers.map(normalizeKey);
//           const impressionsKey =
//             findFieldKey(keys, ["impression", "impr", "view", "delivery"]) || keys[0];
//           const clicksKey = findFieldKey(keys, ["click"]) || keys[1];
//           const spendKey =
//             findFieldKey(keys, ["spend", "cost", "amount", "budget"]) || keys[2];
//           const ctrKey = findFieldKey(keys, ["ctr"]) || null;
//           const dateKey = findFieldKey(keys, ["date", "day", "time"]) || keys[0];

//           let totalImpressions = 0,
//             totalClicks = 0,
//             totalSpend = 0,
//             totalCtrSum = 0,
//             ctrCount = 0;

//           const chartRows = cleaned.map((r) => {
//             const impressions = safeNum(r[headers[keys.indexOf(impressionsKey)]]);
//             const clicks = safeNum(r[headers[keys.indexOf(clicksKey)]]);
//             const spend = safeNum(r[headers[keys.indexOf(spendKey)]]);
//             const ctr = ctrKey
//               ? safeNum(r[headers[keys.indexOf(ctrKey)]])
//               : impressions > 0
//               ? (clicks / impressions) * 100
//               : 0;

//             totalImpressions += impressions;
//             totalClicks += clicks;
//             totalSpend += spend;
//             if (ctr > 0) {
//               totalCtrSum += ctr;
//               ctrCount++;
//             }

//             return {
//               date: convertExcelDate(r[headers[keys.indexOf(dateKey)]]) || "",
//               impressions,
//               clicks,
//               spend,
//               ctr: Number(parseFloat(ctr).toFixed(2)),
//             };
//           });

//           const avgCTR = ctrCount > 0 ? (totalCtrSum / ctrCount).toFixed(2) : 0;

//           return {
//             name: doc.name,
//             chartRows,
//             stats: { totalImpressions, totalClicks, totalSpend, avgCTR },
//             rows: cleaned,
//             columns: headers,
//           };
//         };

//         setSections({
//           genealogysegments: processDoc(
//             docs.find((d) => d.name?.toLowerCase().includes("genealogysegments"))
//           ),
//           genealogyretargeting: processDoc(
//             docs.find((d) => d.name?.toLowerCase().includes("genealogyretargeting"))
//           ),
//           genealogysites: processDoc(
//             docs.find((d) => d.name?.toLowerCase().includes("genealogysites"))
//           ),
//         });
//         setLoading(false);
//       } catch (err) {
//         console.error("Error fetching genealogy:", err);
//         setError(err.message || "Failed to fetch genealogy data.");
//         setLoading(false);
//       }
//     };
//     fetchGenealogy();
//   }, [theme]);

//   if (loading)
//     return <div style={{ padding: 30, textAlign: "center" }}>Loading Genealogy Dashboard...</div>;
//   if (error)
//     return (
//       <div style={{ padding: 30, textAlign: "center", color: "red" }}>
//         Error: {error}
//       </div>
//     );

//   const StatCard = ({ label, value }) => (
//     <div
//       style={{
//         padding: 12,
//         borderRadius: 8,
//         background: "linear-gradient(90deg,#007bff,#00bfa6)",
//         color: "#fff",
//         minWidth: 140,
//         textAlign: "center",
//         boxShadow: "0 3px 6px rgba(0,0,0,0.15)",
//       }}
//     >
//       <b>{label}</b>
//       <div style={{ fontSize: 16, fontWeight: 600 }}>{value}</div>
//     </div>
//   );

//   const Section = ({ title, payload, sectionKey }) => {
//     if (!payload)
//       return (
//         <div style={{ background: colors.cardBg, padding: 20, borderRadius: 12, marginBottom: 30 }}>
//           <h3>{title}</h3>
//           <p>No data available.</p>
//         </div>
//       );

//     const { chartRows, stats, columns, rows } = payload;
//     const expanded = expandedTables[sectionKey];
//     const chartPage = chartPages[sectionKey] || 0;
//     const totalPages = Math.ceil(chartRows.length / CHART_PAGE_SIZE);
//     const currentChunk = chartRows.slice(
//       chartPage * CHART_PAGE_SIZE,
//       chartPage * CHART_PAGE_SIZE + CHART_PAGE_SIZE
//     );

//     return (
//       <div
//         style={{
//           background: colors.cardBg,
//           padding: 24,
//           borderRadius: 12,
//           marginBottom: 30,
//           boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
//         }}
//       >
//         <h2
//           style={{
//             textAlign: "center",
//             marginBottom: 16,
//             background: "linear-gradient(90deg,#007bff,#00bfa6)",
//             WebkitBackgroundClip: "text",
//             WebkitTextFillColor: "transparent",
//           }}
//         >
//           📊 {title}
//         </h2>

//         {/* Export Button */}
//         <div style={{ textAlign: "right", marginBottom: "12px" }}>
//           <button
//             onClick={() => exportToCSV(rows, columns, title)}
//             style={{
//               background: colors.primary,
//               color: "#fff",
//               border: "none",
//               padding: "8px 14px",
//               borderRadius: 6,
//               cursor: "pointer",
//               fontWeight: 600,
//             }}
//           >
//             ⬇️ Export CSV
//           </button>
//         </div>

//         {/* Stats */}
//         <div
//           style={{
//             display: "flex",
//             gap: 12,
//             flexWrap: "wrap",
//             justifyContent: "center",
//             marginBottom: 24,
//           }}
//         >
//           <StatCard label="Impressions" value={stats.totalImpressions.toLocaleString()} />
//           <StatCard label="Clicks" value={stats.totalClicks.toLocaleString()} />
//           <StatCard label="CTR" value={`${stats.avgCTR}%`} />
//           <StatCard label="Spend" value={`$${Number(stats.totalSpend).toLocaleString()}`} />
//         </div>

//         {/* CTR Insight */}
//         {stats.totalImpressions > 10000 && stats.avgCTR < 1 ? (
//           <p
//             style={{
//               textAlign: "center",
//               color: "#ff4b4b",
//               fontWeight: 600,
//               marginBottom: "20px",
//             }}
//           >
//             ⚠️ CTR appears low because impressions are very high. This is normal behavior.
//           </p>
//         ) : (
//           <p
//             style={{
//               textAlign: "center",
//               color: "#00bfa6",
//               fontWeight: 600,
//               marginBottom: "20px",
//             }}
//           >
//             ✅ CTR is within a healthy range.
//           </p>
//         )}

//         {/* Chart */}
//        {/* Chart */}
// <div style={{ height: 320, marginBottom: "25px" }}>
//   <ResponsiveContainer width="100%" height="100%">
//     <BarChart data={currentChunk}>
//       <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
//       <XAxis
//         dataKey="date"
//         tick={{ fontSize: 11, fill: colors.text }}
//         angle={-25}
//         textAnchor="end"
//         interval={0}
//       />
      
//       {/* ✅ Dual Axis setup */}
//       <YAxis
//         yAxisId="left"
//         orientation="left"
//         tick={{ fontSize: 12, fill: colors.text }}
//         label={{
//           value: "Impressions",
//           angle: -90,
//           position: "insideLeft",
//           fill: colors.text,
//           fontSize: 12,
//         }}
//       />
//       <YAxis
//         yAxisId="right"
//         orientation="right"
//         tick={{ fontSize: 12, fill: colors.text }}
//         label={{
//           value: "Clicks / CTR",
//           angle: 90,
//           position: "insideRight",
//           fill: colors.text,
//           fontSize: 12,
//         }}
//       />

//       <Tooltip
//         content={({ payload }) => {
//           if (!payload || !payload.length) return null;
//           const { impressions, clicks, ctr } = payload[0].payload;
//           return (
//             <div
//               style={{
//                 background: "#fff",
//                 border: "1px solid #ddd",
//                 padding: "10px",
//                 borderRadius: "8px",
//                 fontSize: "12px",
//                 boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
//               }}
//             >
//               <p><b>Date:</b> {payload[0].payload.date}</p>
//               <p>Impressions: {impressions.toLocaleString()}</p>
//               <p>Clicks: {clicks.toLocaleString()}</p>
//               <p>CTR: {ctr}%</p>
//               {impressions > 10000 && ctr < 1 && (
//                 <p style={{ color: "#ff4b4b", fontWeight: 600 }}>
//                   ⚠ High impressions may cause low CTR
//                 </p>
//               )}
//             </div>
//           );
//         }}
//       />

//       <Legend />

//       {/* ✅ Impressions on Left Axis */}
//       <Bar
//         yAxisId="left"
//         dataKey="impressions"
//         fill={colors.secondary}
//         name="Impressions"
//         radius={[2, 3, 0, 0]}
//           strokeWidth={1.5}
//       />

//       {/* ✅ Clicks on Right Axis */}
//       <Line
//         yAxisId="right"
//         type="monotone"
//         dataKey="clicks"
//         stroke={colors.primary}
//         strokeWidth={3.5}
//         name="Clicks"
//         dot={{ r: 3 }}
//       />

//       {/* ✅ CTR also on Right Axis */}
//       <Line
//         yAxisId="right"
//         type="monotone"
//         dataKey="ctr"
//         stroke="#8884d8"
//         strokeWidth={2}
//         name="CTR (%)"
//         dot={false}
//       />
//     </BarChart>
//   </ResponsiveContainer>
// </div>

//         {/* Chart Pagination */}
//         {chartRows.length > CHART_PAGE_SIZE && (
//           <div
//             style={{
//               textAlign: "center",
//               marginTop: 10,
//               display: "flex",
//               justifyContent: "center",
//               gap: 15,
//             }}
//           >
//             <button
//               onClick={() =>
//                 setChartPages((prev) => ({
//                   ...prev,
//                   [sectionKey]: Math.max((prev[sectionKey] || 0) - 1, 0),
//                 }))
//               }
//               disabled={chartPage === 0}
//               style={{
//                 background: colors.primary,
//                 border: "none",
//                 color: "#fff",
//                 padding: "8px 16px",
//                 borderRadius: "6px",
//                 opacity: chartPage === 0 ? 0.5 : 1,
//                 cursor: chartPage === 0 ? "not-allowed" : "pointer",
//               }}
//             >
//               ◀ Prev
//             </button>
//             <span style={{ fontWeight: 600 }}>
//               Page {chartPage + 1} of {totalPages}
//             </span>
//             <button
//               onClick={() =>
//                 setChartPages((prev) => ({
//                   ...prev,
//                   [sectionKey]: Math.min(
//                     (prev[sectionKey] || 0) + 1,
//                     totalPages - 1
//                   ),
//                 }))
//               }
//               disabled={chartPage >= totalPages - 1}
//               style={{
//                 background: colors.primary,
//                 border: "none",
//                 color: "#fff",
//                 padding: "8px 16px",
//                 borderRadius: "6px",
//                 opacity: chartPage >= totalPages - 1 ? 0.5 : 1,
//                 cursor:
//                   chartPage >= totalPages - 1 ? "not-allowed" : "pointer",
//               }}
//             >
//               Next ▶
//             </button>
//           </div>
//         )}

//         {/* Table */}
//         <div
//           style={{
//             background: "#fff",
//             borderRadius: 10,
//             padding: 20,
//             marginTop: 25,
//             overflowX: "auto",
//           }}
//         >
//           <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "center" }}>
//             <thead>
//               <tr>
//                 {columns.map((col, idx) => (
//                   <th
//                     key={idx}
//                     style={{
//                       background: colors.primary,
//                       color: "#fff",
//                       padding: 10,
//                       border: "1px solid #ddd",
//                     }}
//                   >
//                     {col}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {(expanded ? rows : rows.slice(0, ROWS_PER_PAGE)).map((r, ri) => (
//                 <tr key={ri} style={{ background: ri % 2 === 0 ? "#f9fafb" : "#ffffff" }}>
//                   {columns.map((c, ci) => (
//                     <td
//                       key={ci}
//                       style={{
//                         padding: 8,
//                         border: "1px solid #eee",
//                         textAlign: "center",
//                       }}
//                     >
//                       {r[c] ?? "-"}
//                     </td>
//                   ))}
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {/* View More/Less */}
//           {rows.length > ROWS_PER_PAGE && (
//             <div style={{ textAlign: "center", marginTop: 15 }}>
//               <button
//                 onClick={() =>
//                   setExpandedTables((prev) => ({
//                     ...prev,
//                     [sectionKey]: !prev[sectionKey],
//                   }))
//                 }
//                 style={{
//                   background: "linear-gradient(90deg,#007bff,#00bfa6)",
//                   border: "none",
//                   color: "#fff",
//                   padding: "10px 20px",
//                   borderRadius: "6px",
//                   cursor: "pointer",
//                   fontWeight: 600,
//                 }}
//               >
//                 {expanded ? "View Less ▲" : "View More ▼"}
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div
//       style={{
//         background: colors.bg,
//         color: colors.text,
//         padding: "2rem",
//         // fontFamily: "Poppins, sans-serif",
//         minHeight: "100vh",
//       }}
//     >
//       <h1 style={{ textAlign: "center", fontSize: "2rem", fontWeight: 700, marginBottom: "2rem" }}>
//         🧬 Genealogy Dashboard
//       </h1>

//       <Section title="Genealogy Segments" payload={sections.genealogysegments} sectionKey="segments" />
//       <Section title="Genealogy Retargeting" payload={sections.genealogyretargeting} sectionKey="retargeting" />
//       <Section title="Genealogy Sites" payload={sections.genealogysites} sectionKey="sites" />

//       <p style={{ textAlign: "center", color: "#64748b", marginTop: "1rem" }}>
//         Showing first {ROWS_PER_PAGE} rows initially per section with chart pagination.
//       </p>
//     </div>
//   );
// }
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { ThemeContext } from "./ThemeSettings/ThemeContext";

const CHART_PAGE_SIZE = 10;
const ROWS_PER_PAGE = 7;

const normalizeKey = (key = "") =>
  key.toString().trim().toLowerCase().replace(/\s+/g, "_").replace(/[^\w]/g, "");

const findFieldKey = (keys, terms) =>
  keys.find((key) => terms.some((t) => key.includes(t))) || null;

const safeNum = (v) => {
  if (v === null || v === undefined || v === "") return 0;
  const s = String(v).replace(/,/g, "").replace(/[^0-9.\-]/g, "");
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : 0;
};

const convertExcelDate = (excelDate) => {
  if (!excelDate || isNaN(excelDate)) return excelDate;
  const epoch = new Date(1899, 11, 30);
  const date = new Date(epoch.getTime() + excelDate * 86400000);
  return date.toISOString().split("T")[0];
};

const exportToCSV = (rows, columns, title) => {
  const csvRows = [columns.join(",")];
  rows.forEach((r) => {
    csvRows.push(
      columns.map((c) => `"${String(r[c] ?? "").replace(/"/g, '""')}"`).join(",")
    );
  });
  const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${title}_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
};

export default function DisplayData() {
  const { theme } = useContext(ThemeContext);

  const colors = {
    bg:
      theme === "dark"
        ? "linear-gradient(135deg,#0f172a,#1e293b)"
        : "linear-gradient(135deg,#f8fafc,#e0f2fe)",
    cardBg: theme === "dark" ? "#1e293b" : "#ffffff",
    text: theme === "dark" ? "#e5e7eb" : "#202124",
    border: "#E0E0E0",

    impressions: "#34A853",
    clicks: "#4285F4",
    ctr: "#FBBC05",
    spend: "#EA4335",
  };

  const [sections, setSections] = useState({});
  const [expandedTables, setExpandedTables] = useState({});
  const [chartPages, setChartPages] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = JSON.parse(localStorage.getItem("jwt"))?.token;
      const res = await axios.get("http://localhost:5000/api/getgenealogyrecords", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const docs = res.data || [];

      const processDoc = (doc) => {
        if (!doc?.data?.length) return null;

        const headers = Object.keys(doc.data[0]);
        const keys = headers.map(normalizeKey);

        const impressionsKey = findFieldKey(keys, ["impression"]) || keys[1];
        const clicksKey = findFieldKey(keys, ["click"]) || keys[2];
        const spendKey = findFieldKey(keys, ["spend", "cost"]) || keys[3];
        const dateKey = findFieldKey(keys, ["date"]) || keys[0];

        let totalImpressions = 0,
          totalClicks = 0,
          totalSpend = 0;

        const chartRows = doc.data.map((r) => {
          const impressions = safeNum(r[headers[keys.indexOf(impressionsKey)]]);
          const clicks = safeNum(r[headers[keys.indexOf(clicksKey)]]);
          const spend = safeNum(r[headers[keys.indexOf(spendKey)]]);
          const ctr = impressions ? ((clicks / impressions) * 100).toFixed(2) : 0;

          totalImpressions += impressions;
          totalClicks += clicks;
          totalSpend += spend;

          return {
            date: convertExcelDate(r[headers[keys.indexOf(dateKey)]]),
            impressions,
            clicks,
            spend,
            ctr,
          };
        });

        return {
          name: doc.name,
          chartRows,
          rows: doc.data,
          columns: headers,
          stats: { totalImpressions, totalClicks, totalSpend },
        };
      };

      setSections({
        segments: processDoc(docs.find((d) => d.name.includes("segments"))),
        retargeting: processDoc(docs.find((d) => d.name.includes("retargeting"))),
        sites: processDoc(docs.find((d) => d.name.includes("sites"))),
      });

      setLoading(false);
    };

    fetchData();
  }, [theme]);

  if (loading) return <p style={{ textAlign: "center" }}>Loading…</p>;

  const StatCard = ({ label, value, color }) => (
    <div
      style={{
        background: "#fff",
        padding: 14,
        borderRadius: 10,
        borderLeft: `6px solid ${color}`,
        minWidth: 150,
        textAlign: "center",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      }}
    >
      <div style={{ color: "#5F6368", fontSize: 13 }}>{label}</div>
      <div style={{ color, fontSize: 18, fontWeight: 700 }}>{value}</div>
    </div>
  );

  const Section = ({ title, payload, keyName }) => {
    if (!payload) return null;

    const { chartRows, stats, rows, columns } = payload;
    const page = chartPages[keyName] || 0;
    const chunk = chartRows.slice(
      page * CHART_PAGE_SIZE,
      page * CHART_PAGE_SIZE + CHART_PAGE_SIZE
    );

    return (
      <div style={{ background: colors.cardBg, padding: 24, borderRadius: 14, marginBottom: 40 }}>
        <h2 style={{ textAlign: "center" }}>{title}</h2>

        <div style={{ display: "flex", justifyContent: "center", gap: 14, marginBottom: 20 }}>
          <StatCard label="Impressions" value={stats.totalImpressions.toLocaleString()} color={colors.impressions} />
          <StatCard label="Clicks" value={stats.totalClicks.toLocaleString()} color={colors.clicks} />
          <StatCard label="Spend" value={`$${stats.totalSpend.toLocaleString()}`} color={colors.spend} />
        </div>

        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={chunk}>
            <CartesianGrid stroke={colors.border} strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fill: colors.text }} angle={0} textAnchor="end" />
            <YAxis yAxisId="left" tick={{ fill: colors.text }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fill: colors.text }} />
            <Tooltip />
            <Legend />

            <Bar yAxisId="left" dataKey="impressions" fill={colors.impressions} />
            <Bar yAxisId="left" dataKey="spend" fill={colors.spend} />
            <Line yAxisId="right" dataKey="clicks" stroke={colors.clicks} strokeWidth={3} />
            <Line yAxisId="right" dataKey="ctr" stroke={colors.ctr} strokeWidth={2} dot={false} />
          </BarChart>
        </ResponsiveContainer>

        <div style={{ marginTop: 20, textAlign: "center" }}>
          <button
            onClick={() => exportToCSV(rows, columns, title)}
            style={{
              background: colors.clicks,
              color: "#fff",
              border: "none",
              padding: "10px 20px",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            ⬇ Export CSV
          </button>
        </div>
      </div>
    );
  };

  return (
    <div style={{ background: colors.bg, minHeight: "100vh", padding: 30 }}>
      <h1 style={{ textAlign: "center", marginBottom: 30 }}>🧬 Genealogy Dashboard</h1>

      <Section title="Genealogy Segments" payload={sections.segments} keyName="segments" />
      <Section title="Genealogy Retargeting" payload={sections.retargeting} keyName="retargeting" />
      <Section title="Genealogy Sites" payload={sections.sites} keyName="sites" />
    </div>
  );
}
