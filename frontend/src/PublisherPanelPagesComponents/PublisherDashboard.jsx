

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   CartesianGrid,
//   PieChart,
//   Pie,
//   Cell,
//   Legend,
// } from "recharts";

// /* ================= HELPERS ================= */

// const COLORS = ["#007bff", "#ff4d4f", "#28a745"];

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

// const safeNumber = (v) => {
//   if (v === null || v === undefined || v === "") return 0;
//   if (typeof v === "string") return Number(v.replace(/[$,%]/g, "")) || 0;
//   return Number(v) || 0;
// };

// /**
//  * Extracts revenue from a row:
//  * 1. Looks for a direct "Revenue" (or "revenue") column first.
//  * 2. Falls back to CPC → CPM → flat CPM fallback logic.
//  */
// const extractRevenue = (row) => {
//   // ── Priority 1: explicit Revenue / Spend column ──
//   const revenueKey = Object.keys(row).find((k) => {
//     const key = k.toLowerCase();
//     return key.includes("revenue") || key.includes("spend");
//   });

//   if (revenueKey) {
//     const rawValue = row[revenueKey];

//     if (rawValue !== undefined && rawValue !== null && rawValue !== "") {
//       const revenue =
//         parseFloat(rawValue.toString().replace(/[^0-9.-]+/g, "")) || 0;

//       return revenue; // 🔥 THIS WAS MISSING
//     }
//   }

//   // ── Priority 2: CPC / CPM fallback ──
//   const impressions = safeNumber(row.Impressions ?? row.impressions);
//   const clk = safeNumber(row.Clicks ?? row.clicks);
//   const cpc = safeNumber(row.CPC ?? row.cpc);
//   const cpm = safeNumber(row.CPM ?? row.cpm);

//   if (cpc > 0) return clk * cpc;
//   if (cpm > 0) return (impressions / 1000) * cpm;

//   return 0; // no fake fallback revenue
// };

// /* ================= CUSTOM PIE LABEL ================= */

// const renderCustomLabel = ({
//   cx,
//   cy,
//   midAngle,
//   innerRadius,
//   outerRadius,
//   name,
//   value,
// }) => {
//   if (value === 0) return null;
//   const RADIAN = Math.PI / 180;
//   const radius = outerRadius + 30;
//   const x = cx + radius * Math.cos(-midAngle * RADIAN);
//   const y = cy + radius * Math.sin(-midAngle * RADIAN);

//   return (
//     <text
//       x={x}
//       y={y}
//       fill="#333"
//       textAnchor={x > cx ? "start" : "end"}
//       dominantBaseline="central"
//       fontSize={12}
//       fontWeight={600}
//     >
//       {`${name}: $${Number(value).toLocaleString("en-US", {
//         minimumFractionDigits: 2,
//         maximumFractionDigits: 2,
//       })}`}
//     </text>
//   );
// };

// /* ================= DASHBOARD ================= */

// const Dashboard = () => {
//   const [revenueByType, setRevenueByType] = useState([]);
//   const [last7DaysRevenue, setLast7DaysRevenue] = useState([]);
//   const [totals, setTotals] = useState({ views: 0, clicks: 0, revenue: 0 });

//   const [loading, setLoading] = useState(true);
//   const [datePreset, setDatePreset] = useState("lastweek");
//   const [customFrom, setCustomFrom] = useState("");
//   const [customTo, setCustomTo] = useState("");

//   /* ===== DATE PRESET ===== */

//   const applyDatePreset = (preset) => {
//     if (preset === "custom") return;

//     const today = new Date();
//     let from = new Date();
//     let to = new Date();

//     if (preset === "yesterday") {
//       from.setDate(today.getDate() - 1);
//       to = new Date(from);
//     }
//     if (preset === "lastweek") {
//       from.setDate(today.getDate() - 7);
//     }
//     if (preset === "lastmonth") {
//       from.setMonth(today.getMonth() - 1);
//     }

//     setCustomFrom(from.toISOString().slice(0, 10));
//     setCustomTo(to.toISOString().slice(0, 10));
//   };

//   useEffect(() => {
//     applyDatePreset(datePreset);
//   }, [datePreset]);

//   /* ================= FETCH DATA ================= */

//   useEffect(() => {
//     if (!customFrom || !customTo) return;

//     const fetchData = async () => {
//       try {
//         setLoading(true);

//         const storedPublisher =
//           JSON.parse(localStorage.getItem("jwt"))?.user?.name || "";

//         const res = await axios.get(
//           "https://imediareports.onrender.com/api/getalldata"
//         );
// console.log(res.data,"dta");

//         const allSheets = [
//           ...(res.data?.sheets || []),
//           ...(res.data?.genealogySheets || []),
//         ];

//         const filteredSheets = allSheets.filter((sheet) =>
//           (sheet.publisher || "")
//             .toLowerCase()
//             .trim()
//             .includes(storedPublisher.toLowerCase().trim())
//         );

//         const from = new Date(customFrom);
//         const to = new Date(customTo);

//         let totalViews = 0;
//         let totalClicks = 0;
//         let totalRevenue = 0;

//         const adTypeMap = {
//           OTT: 0,
//           VIDEO: 0,
//           ADWIDGET: 0,
//         };

//         const revenueDays = {};

//         filteredSheets.forEach((sheet) => {
//           const sheetName = (sheet.name || "").toLowerCase();

//           // Classify sheet ad type once per sheet
//           let adType = null;
//           if (
//             sheetName.includes("Ott") ||
//             sheetName.includes("ctv") ||
//             sheetName.includes("connected")
//           ) {
//             adType = "Ott";
//           } else if (
//             sheetName.includes("video") ||
//             sheetName.includes("preroll")
//           ) {
//             adType = "VIDEO";
//           } else if (
//             sheetName.includes("adwidget") ||
//             sheetName.includes("display")
//           ) {
//             adType = "ADWIDGET";
//           }

//           (sheet.data || []).forEach((originalRow) => {
//             // Normalize keys (trim whitespace)
//             const row = {};
//             Object.keys(originalRow).forEach((k) => {
//               row[k.trim()] = originalRow[k];
//             });

//             const d = parseRowDate(row.Date || row.date);
//             if (!d || d < from || d > to) return;

//             const impressions = safeNumber(row.Impressions ?? row.impressions);
//             const clk = safeNumber(row.Clicks ?? row.clicks);

//             totalViews += impressions;
//             totalClicks += clk;

//             // ── Revenue extraction (column first, then CPM/CPC) ──
//             const rev = extractRevenue(row);
//             totalRevenue += rev;

//             // ── Ad type bucketing ──
//             if (adType) {
//               adTypeMap[adType] += rev;
//             }

//             // ── Daily revenue map ──
//             const key = d.toISOString().slice(0, 10);
//             revenueDays[key] = (revenueDays[key] ?? 0) + rev;
//           });
//         });

//         // Build pie data — include all three even if zero so the legend is stable
//         const pie = Object.keys(adTypeMap).map((k) => ({
//           name: k,
//           value: Number(adTypeMap[k].toFixed(2)),
//         }));

//         const last7 = Object.keys(revenueDays)
//           .sort()
//           .slice(-7)
//           .map((d) => ({
//             date: d,
//             revenue: Number(revenueDays[d].toFixed(2)),
//           }));

//         setRevenueByType(pie);
//         setLast7DaysRevenue(last7);
//         setTotals({
//           views: totalViews,
//           clicks: totalClicks,
//           revenue: totalRevenue.toFixed(2),
//         });
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [customFrom, customTo]);

//   /* ================= UI ================= */

//   return (
//     <div style={{ padding: "24px", background: "#f9fafb", minHeight: "100vh" }}>
//       {/* Header */}
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           marginBottom: "20px",
//         }}
//       >
//         <h2 style={{ fontSize: "32px", fontWeight: 700, margin: 0 }}>
//           📊 Publisher Dashboard
//         </h2>

//         <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
//           <select
//             value={datePreset}
//             onChange={(e) => setDatePreset(e.target.value)}
//             style={{
//               padding: "8px 14px",
//               borderRadius: "6px",
//               border: "1px solid #dcdcdc",
//               fontSize: "14px",
//             }}
//           >
//             <option value="yesterday">Yesterday</option>
//             <option value="lastweek">Last 7 Days</option>
//             <option value="lastmonth">Last Month</option>
//             <option value="custom">Custom</option>
//           </select>

//           {datePreset === "custom" && (
//             <>
//               <input
//                 type="date"
//                 value={customFrom}
//                 onChange={(e) => setCustomFrom(e.target.value)}
//                 style={{
//                   padding: "8px",
//                   borderRadius: "6px",
//                   border: "1px solid #dcdcdc",
//                 }}
//               />
//               <span>to</span>
//               <input
//                 type="date"
//                 value={customTo}
//                 onChange={(e) => setCustomTo(e.target.value)}
//                 style={{
//                   padding: "8px",
//                   borderRadius: "6px",
//                   border: "1px solid #dcdcdc",
//                 }}
//               />
//             </>
//           )}
//         </div>
//       </div>

//       {loading && (
//         <p style={{ color: "#888", marginBottom: "16px" }}>Loading data…</p>
//       )}

//       {/* SUMMARY CARDS */}
//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
//           gap: 16,
//           marginBottom: 28,
//         }}
//       >
//         {[
//           {
//             label: "Total Impressions",
//             value: Number(totals.views).toLocaleString(),
//           },
//           { label: "Total Clicks", value: Number(totals.clicks).toLocaleString() },
//           { label: "Total Revenue", value: `$${Number(totals.revenue).toLocaleString()}` },
//         ].map(({ label, value }) => (
//           <div
//             key={label}
//             style={{
//               background: "#fff",
//               borderRadius: 10,
//               padding: "20px 24px",
//               boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
//             }}
//           >
//             <h4 style={{ margin: "0 0 8px", color: "#666", fontSize: 14 }}>
//               {label}
//             </h4>
//             <p style={{ fontSize: 28, fontWeight: "bold", margin: 0 }}>{value}</p>
//           </div>
//         ))}
//       </div>

//       {/* CHARTS */}
//       <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
//         {/* PIE — Revenue Share by Ad Type */}
//         <div
//           style={{
//             flex: 1,
//             minWidth: 320,
//             background: "#fff",
//             padding: "20px",
//             borderRadius: 10,
//             boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
//           }}
//         >
//           <h3 style={{ marginTop: 0 }}>Revenue Share by Ad Type</h3>
//           <ResponsiveContainer width="100%" height={340}>
//             <PieChart>
//               <Pie
//                 data={revenueByType}
//                 dataKey="value"
//                 nameKey="name"
//                 outerRadius={100}
//                 labelLine={true}
//                 label={renderCustomLabel}
//               >
//                 {revenueByType.map((_, i) => (
//                   <Cell key={i} fill={COLORS[i % COLORS.length]} />
//                 ))}
//               </Pie>
//               <Legend
//                 formatter={(value, entry) =>
//                   `${value}: $${Number(entry.payload.value).toLocaleString("en-US", {
//                     minimumFractionDigits: 2,
//                     maximumFractionDigits: 2,
//                   })}`
//                 }
//               />
//               <Tooltip
//                 formatter={(value, name) => [
//                   `$${Number(value).toLocaleString("en-US", {
//                     minimumFractionDigits: 2,
//                     maximumFractionDigits: 2,
//                   })}`,
//                   name,
//                 ]}
//               />
//             </PieChart>
//           </ResponsiveContainer>
//         </div>

//         {/* BAR — Last 7 Days Revenue */}
//         <div
//           style={{
//             flex: 1,
//             minWidth: 320,
//             background: "#fff",
//             padding: "20px",
//             borderRadius: 10,
//             boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
//           }}
//         >
//           <h3 style={{ marginTop: 0 }}>Last 7 Days Revenue</h3>
//           <ResponsiveContainer width="100%" height={340}>
//             <BarChart data={last7DaysRevenue}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="date" tick={{ fontSize: 11 }} />
//               <YAxis tickFormatter={(v) => `$${v}`} />
//               <Tooltip formatter={(v) => [`$${v}`, "Revenue"]} />
//               <Bar dataKey="revenue" fill="#007bff" radius={[4, 4, 0, 0]} />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

/* ================= HELPERS ================= */

const COLORS = ["#007bff", "#ff4d4f", "#28a745"];

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

const safeNumber = (v) => {
  if (v === null || v === undefined || v === "") return 0;
  if (typeof v === "string") return Number(v.replace(/[$,%]/g, "")) || 0;
  return Number(v) || 0;
};

const extractRevenue = (row) => {
  const revenueKey = Object.keys(row).find((k) => {
    const lower = k.trim().toLowerCase();
    return lower.includes("revenue") || lower.includes("spend");
  });

  if (revenueKey !== undefined) {
    const raw = row[revenueKey];
    if (raw !== null && raw !== undefined && raw !== "") {
      const num = parseFloat(String(raw).replace(/[^0-9.-]+/g, ""));
      if (!isNaN(num)) return num;
    }
  }

  // ── Priority 2: CPC / CPM fallback ──
  
  const impressions = safeNumber(row.Impressions ?? row.impressions);
  const clk = safeNumber(row.Clicks ?? row.clicks);
  const cpc = safeNumber(row.CPC ?? row.cpc);
  const cpm = safeNumber(row.CPM ?? row.cpm);

  if (cpc > 0) return clk * cpc;
  if (cpm > 0) return (impressions / 1000) * cpm;

  return 0;
};

/**
 * Classify a sheet name into OTT | VIDEO | ADWIDGET | null.
 * @param {string} s - already lowercased sheet name
 */
const classifySheet = (s) => {
  // ✅ BUG FIX: was "Ott" (capital O) — never matched because s is lowercased
  if (s.includes("ott") || s.includes("ctv") || s.includes("connected tv") || s.includes("streaming"))
    return "OTT";

  if (s.includes("video") || s.includes("preroll") || s.includes("pre-roll") || s.includes("instream"))
    return "VIDEO";

  if (s.includes("adwidget") || s.includes("display") || s.includes("widget") || s.includes("banner") || s.includes("native"))
    return "ADWIDGET";

  return null;
};

/* ================= CUSTOM PIE LABEL ================= */

const renderCustomLabel = ({ cx, cy, midAngle, outerRadius, name, value }) => {
  if (!value || value === 0) return null;
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 34;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#333"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={12}
      fontWeight={600}
    >
      {`${name}: $${Number(value).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`}
    </text>
  );
};

/* ================= DASHBOARD ================= */

const Dashboard = () => {
  const [revenueByType, setRevenueByType] = useState([]);
  const [last7DaysRevenue, setLast7DaysRevenue] = useState([]);
  const [totals, setTotals] = useState({ views: 0, clicks: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);
  const [datePreset, setDatePreset] = useState("lastweek");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  /* ===== DATE PRESET ===== */
  const applyDatePreset = (preset) => {
    if (preset === "custom") return;
    const today = new Date();
    let from = new Date();
    let to = new Date();

    if (preset === "yesterday") {
      from.setDate(today.getDate() - 1);
      to = new Date(from);
    }
    if (preset === "lastweek") from.setDate(today.getDate() - 7);
    if (preset === "lastmonth") from.setMonth(today.getMonth() - 1);

    setCustomFrom(from.toISOString().slice(0, 10));
    setCustomTo(to.toISOString().slice(0, 10));
  };

  useEffect(() => {
    applyDatePreset(datePreset);
  }, [datePreset]);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    if (!customFrom || !customTo) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const storedPublisher =
          JSON.parse(localStorage.getItem("jwt"))?.user?.name || "";

        const res = await axios.get(
          "https://imediareports.onrender.com/api/getalldata"
        );

        const allSheets = [
          ...(res.data?.sheets || []),
          ...(res.data?.genealogySheets || []),
        ];

        const filteredSheets = allSheets.filter((sheet) =>
          (sheet.publisher || "")
            .toLowerCase()
            .trim()
            .includes(storedPublisher.toLowerCase().trim())
        );

        const from = new Date(customFrom);
        const to = new Date(customTo);

        let totalViews = 0;
        let totalClicks = 0;
        let totalRevenue = 0;

        const adTypeMap = { OTT: 0, VIDEO: 0, ADWIDGET: 0 };
        const revenueDays = {};

        filteredSheets.forEach((sheet) => {
          // ✅ Always lowercase BEFORE classifying — critical fix
          const sheetNameLower = (sheet.name || "").toLowerCase().trim();
          const sheetAdType = classifySheet(sheetNameLower);

          // 🔍 Debug: open browser console to see sheet names & their classification
          console.log(`📄 "${sheet.name}" → ${sheetAdType ?? "UNCLASSIFIED"}`);

          (sheet.data || []).forEach((originalRow) => {
            // Normalize row keys (trim whitespace from column headers)
            const row = {};
            Object.keys(originalRow).forEach((k) => {
              row[k.trim()] = originalRow[k];
            });

            const d = parseRowDate(row.Date || row.date);
            if (!d || d < from || d > to) return;

            const impressions = safeNumber(row.Impressions ?? row.impressions);
            const clk = safeNumber(row.Clicks ?? row.clicks);

            totalViews += impressions;
            totalClicks += clk;

            // ── Revenue extraction: "Revenue (USD)" column first, then CPM/CPC ──
            const rev = extractRevenue(row);
            totalRevenue += rev;

            // ── Bucket into ad type ──
            if (sheetAdType && adTypeMap[sheetAdType] !== undefined) {
              adTypeMap[sheetAdType] += rev;
            }

            // ── Daily revenue ──
            const key = d.toISOString().slice(0, 10);
            revenueDays[key] = (revenueDays[key] ?? 0) + rev;
          });
        });

        console.log("💰 Final Ad Type Revenue:", adTypeMap);

        // Only show ad types with revenue > 0
        const pie = Object.keys(adTypeMap)
          .map((k) => ({ name: k, value: Number(adTypeMap[k].toFixed(2)) }))
          .filter((item) => item.value > 0);

        const last7 = Object.keys(revenueDays)
          .sort()
          .slice(-7)
          .map((d) => ({ date: d, revenue: Number(revenueDays[d].toFixed(2)) }));

        setRevenueByType(pie);
        setLast7DaysRevenue(last7);
        setTotals({
          views: totalViews,
          clicks: totalClicks,
          revenue: totalRevenue.toFixed(2),
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [customFrom, customTo]);

  /* ================= UI ================= */
  return (
    <div style={{ padding: "24px", background: "#f9fafb", minHeight: "100vh" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ fontSize: "32px", fontWeight: 700, margin: 0 }}>
          📊 Publisher Dashboard
        </h2>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <select
            value={datePreset}
            onChange={(e) => setDatePreset(e.target.value)}
            style={{
              padding: "8px 14px",
              borderRadius: "6px",
              border: "1px solid #dcdcdc",
              fontSize: "14px",
            }}
          >
            <option value="yesterday">Yesterday</option>
            <option value="lastweek">Last 7 Days</option>
            <option value="lastmonth">Last Month</option>
            <option value="custom">Custom</option>
          </select>

          {datePreset === "custom" && (
            <>
              <input
                type="date"
                value={customFrom}
                onChange={(e) => setCustomFrom(e.target.value)}
                style={{ padding: "8px", borderRadius: "6px", border: "1px solid #dcdcdc" }}
              />
              <span>to</span>
              <input
                type="date"
                value={customTo}
                onChange={(e) => setCustomTo(e.target.value)}
                style={{ padding: "8px", borderRadius: "6px", border: "1px solid #dcdcdc" }}
              />
            </>
          )}
        </div>
      </div>

      {loading && (
        <p style={{ color: "#888", marginBottom: "16px" }}>Loading data…</p>
      )}

      {/* SUMMARY CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16,
          marginBottom: 28,
        }}
      >
        {[
          { label: "Total Impressions", value: Number(totals.views).toLocaleString() },
          { label: "Total Clicks", value: Number(totals.clicks).toLocaleString() },
          { label: "Total Revenue", value: `$${Number(totals.revenue).toLocaleString()}` },
        ].map(({ label, value }) => (
          <div
            key={label}
            style={{
              background: "#fff",
              borderRadius: 10,
              padding: "20px 24px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            }}
          >
            <h4 style={{ margin: "0 0 8px", color: "#666", fontSize: 14 }}>{label}</h4>
            <p style={{ fontSize: 28, fontWeight: "bold", margin: 0 }}>{value}</p>
          </div>
        ))}
      </div>

      {/* CHARTS */}
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {/* PIE — Revenue Share by Ad Type */}
        <div
          style={{
            flex: 1,
            minWidth: 320,
            background: "#fff",
            padding: "20px",
            borderRadius: 10,
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
          }}
        >
          <h3 style={{ marginTop: 0 }}>Revenue Share by Ad Type</h3>
          <ResponsiveContainer width="100%" height={340}>
            <PieChart>
              <Pie
                data={revenueByType}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                labelLine
                label={renderCustomLabel}
              >
                {revenueByType.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Legend
                formatter={(value, entry) =>
                  `${value}: $${Number(entry.payload.value).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`
                }
              />
              <Tooltip
                formatter={(value, name) => [
                  `$${Number(value).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`,
                  name,
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* BAR — Last 7 Days Revenue */}
        <div
          style={{
            flex: 1,
            minWidth: 320,
            background: "#fff",
            padding: "20px",
            borderRadius: 10,
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
          }}
        >
          <h3 style={{ marginTop: 0 }}>Last 7 Days Revenue</h3>
          <ResponsiveContainer width="100%" height={340}>
            <BarChart data={last7DaysRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(v) => `$${v}`} />
              <Tooltip formatter={(v) => [`$${v}`, "Revenue"]} />
              <Bar dataKey="revenue" fill="#007bff" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
