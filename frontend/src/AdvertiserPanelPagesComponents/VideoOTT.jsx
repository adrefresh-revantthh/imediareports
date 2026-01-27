// import React, { useState, useEffect } from "react";
// import * as XLSX from "xlsx";
// import {
//   BarChart,
//   Bar,
//   LineChart,
//   Line,
//   Tooltip,
//   Legend,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   ResponsiveContainer,
// } from "recharts";

// export default function DailyReport() {
//   const [data, setData] = useState([]);
//   const [isMobile, setIsMobile] = useState(false);

//   // KPI totals
//   const [totals, setTotals] = useState({
//     totalSpend: 0,
//     totalImpressions: 0,
//     totalClicks: 0,
//     avgCTR: 0,
//     avgSpendPerDay: 0,
//     peakImpressions: 0,
//     peakClicks: 0,
//     peakSpend: 0,
//   });

//   useEffect(() => {
//     const checkScreen = () => setIsMobile(window.innerWidth < 1024);
//     checkScreen();
//     window.addEventListener("resize", checkScreen);
//     return () => window.removeEventListener("resize", checkScreen);
//   }, []);

//   // Excel serial -> dd-mm-yyyy
//   const excelSerialToDate = (serial) => {
//     if (typeof serial === "number") {
//       const utc_days = Math.floor(serial - 25569);
//       const d = new Date(utc_days * 86400 * 1000);
//       const day = String(d.getDate()).padStart(2, "0");
//       const month = String(d.getMonth() + 1).padStart(2, "0");
//       const year = d.getFullYear();
//       return `${day}-${month}-${year}`;
//     }
//     return serial;
//   };

//   const cleanNumber = (val) => {
//     if (val === undefined || val === null || val === "") return 0;
//     const cleaned = String(val).replace(/[^0-9.-]+/g, "");
//     const parsed = parseFloat(cleaned);
//     return isNaN(parsed) ? 0 : parsed;
//   };

//   const cleanPercent = (val) => {
//     if (val === undefined || val === null || val === "") return 0;
//     const s = String(val).trim().replace("%", "");
//     const parsed = parseFloat(s);
//     if (isNaN(parsed)) return 0;
//     if (parsed > 0 && parsed < 1) return Number((parsed * 100).toFixed(2));
//     return Number(parsed.toFixed(2));
//   };

//   const handleFileUpload = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     const reader = new FileReader();

//     reader.onload = (event) => {
//       const workbook = XLSX.read(event.target.result, { type: "array" });
//       const sheet = workbook.Sheets[workbook.SheetNames[0]];
//       const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: "" });

//       const headers = jsonData.length > 0 ? Object.keys(jsonData[0]) : [];
//       const findHeader = (keys) =>
//         headers.find((h) => keys.some((k) => h.toLowerCase().includes(k)));

//       const dateKey = findHeader(["date"]) || headers[0];
//       const impressionsKey = findHeader(["impressions", "imp"]);
//       const clicksKey = findHeader(["click", "clicks"]);
//       const ctrKey = findHeader(["ctr", "click rate"]);
//       const spendKey = findHeader(["spend", "cost", "amount"]);

//       const formatted = jsonData.map((row) => {
//         return {
//           Date: excelSerialToDate(row[dateKey]),
//           Impressions: cleanNumber(row[impressionsKey]),
//           Clicks: cleanNumber(row[clicksKey]),
//           CTR: cleanPercent(row[ctrKey]),
//           Spend: cleanNumber(row[spendKey]),
//         };
//       });

//       // Totals
//       const totalImpressions = formatted.reduce((s, r) => s + r.Impressions, 0);
//       const totalClicks = formatted.reduce((s, r) => s + r.Clicks, 0);
//       const totalSpend = formatted.reduce((s, r) => s + r.Spend, 0);
//       const avgCTR =
//         formatted.length > 0
//           ? formatted.reduce((s, r) => s + r.CTR, 0) / formatted.length
//           : 0;
//       const avgSpendPerDay =
//         formatted.length > 0 ? totalSpend / formatted.length : 0;
//       const peakImpressions = Math.max(...formatted.map((r) => r.Impressions));
//       const peakClicks = Math.max(...formatted.map((r) => r.Clicks));
//       const peakSpend = Math.max(...formatted.map((r) => r.Spend));

//       setTotals({
//         totalSpend,
//         totalImpressions,
//         totalClicks,
//         avgCTR: avgCTR.toFixed(2),
//         avgSpendPerDay,
//         peakImpressions,
//         peakClicks,
//         peakSpend,
//       });

//       setData(formatted);
//     };
//     reader.readAsArrayBuffer(file);
//   };

//   const COLORS = {
//     spend: "#007bff",
//     impressions: "#28a745",
//     ctr: "#ff9800",
//   };

//   return (
//     <div
//       style={{
//         padding: 30,
//         // fontFamily: "Segoe UI, sans-serif",
//         backgroundColor: "#f5f7fa",
//         minHeight: "100vh",
//       }}
//     >
//       <h1 style={{ textAlign: "center", color: "#222" }}>
//         📊 Daily Ads Performance Dashboard
//       </h1>

//       <div style={{ textAlign: "center", marginBottom: 30 }}>
//         <input
//           type="file"
//           accept=".xlsx,.xls,.csv"
//           onChange={handleFileUpload}
//           style={{
//             background: "#007bff",
//             color: "white",
//             border: "none",
//             padding: "10px 15px",
//             borderRadius: "8px",
//             cursor: "pointer",
//           }}
//         />
//       </div>

//       {isMobile && (
//         <div style={warningBox}>⚠️ Charts are best viewed on larger screens</div>
//       )}

//       {data.length > 0 && (
//         <>
//           {/* KPI CARDS */}
//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: isMobile ? "1fr" : "repeat(4, 1fr)",
//               gap: "20px",
//               marginBottom: "30px",
//             }}
//           >
//             <div style={cardStyle}>
//               <h3 style={cardTitle}>Total Impressions</h3>
//               <p style={cardValue}>{totals.totalImpressions.toLocaleString()}</p>
//               <p style={cardSub}>Peak: {totals.peakImpressions.toLocaleString()}</p>
//             </div>
//             <div style={cardStyle}>
//               <h3 style={cardTitle}>Total Clicks</h3>
//               <p style={cardValue}>{totals.totalClicks.toLocaleString()}</p>
//               <p style={cardSub}>Peak: {totals.peakClicks.toLocaleString()}</p>
//             </div>
//             <div style={cardStyle}>
//               <h3 style={cardTitle}>Avg CTR</h3>
//               <p style={cardValue}>{totals.avgCTR}%</p>
//               <p style={cardSub}>Click Through Rate</p>
//             </div>
//             <div style={cardStyle}>
//               <h3 style={cardTitle}>Total Spend</h3>
//               <p style={cardValue}>
//                 ${totals.totalSpend.toLocaleString(undefined, {
//                   minimumFractionDigits: 2,
//                   maximumFractionDigits: 2,
//                 })}
//               </p>
//               <p style={cardSub}>
//                 Avg/Day: $
//                 {totals.avgSpendPerDay.toLocaleString(undefined, {
//                   minimumFractionDigits: 2,
//                   maximumFractionDigits: 2,
//                 })}
//               </p>
//             </div>
//           </div>

//           {/* Charts */}
//           {!isMobile && (
//             <>
//               <div style={chartContainer}>
//                 <h3>💰 Spend vs Impressions</h3>
//                 <ResponsiveContainer width="100%" height={350}>
//                   <BarChart data={data}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="Date" />
//                     <YAxis />
//                     <Tooltip />
//                     <Legend />
//                     <Bar
//                       dataKey="Spend"
//                       fill={COLORS.spend}
//                       radius={[6, 6, 0, 0]}
//                     />
//                     <Bar
//                       dataKey="Impressions"
//                       fill={COLORS.impressions}
//                       radius={[6, 6, 0, 0]}
//                     />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>

//               <div style={chartContainer}>
//                 <h3>📈 CTR Trend (%)</h3>
//                 <ResponsiveContainer width="100%" height={350}>
//                   <LineChart data={data}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="Date" />
//                     <YAxis />
//                     <Tooltip formatter={(v) => `${v.toFixed(2)}%`} />
//                     <Legend />
//                     <Line
//                       type="monotone"
//                       dataKey="CTR"
//                       stroke={COLORS.ctr}
//                       strokeWidth={3}
//                       dot={{ r: 5 }}
//                     />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </div>
//             </>
//           )}

//           {/* Table */}
//           <div
//             style={{
//               background: "white",
//               padding: 20,
//               borderRadius: 12,
//               boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//               marginTop: 40,
//               overflowX: "auto",
//             }}
//           >
//             <h3>📋 Detailed Daily Report</h3>
//             <table
//               style={{
//                 width: "100%",
//                 borderCollapse: "collapse",
//                 marginTop: "10px",
//                 fontSize: "14px",
//               }}
//             >
//               <thead>
//                 <tr
//                   style={{
//                     background: "#007bff",
//                     color: "white",
//                     textAlign: "left",
//                   }}
//                 >
//                   <th style={thTd}>Date</th>
//                   <th style={thTd}>Impressions</th>
//                   <th style={thTd}>Clicks</th>
//                   <th style={thTd}>CTR (%)</th>
//                   <th style={thTd}>Spend ($)</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {data.map((row, i) => (
//                   <tr
//                     key={i}
//                     style={{
//                       borderBottom: "1px solid #ddd",
//                       background: i % 2 === 0 ? "#fafafa" : "#fff",
//                     }}
//                   >
//                     <td style={thTd}>{row.Date}</td>
//                     <td style={thTd}>{row.Impressions.toLocaleString()}</td>
//                     <td style={thTd}>{row.Clicks.toLocaleString()}</td>
//                     <td style={thTd}>{row.CTR.toFixed(2)}%</td>
//                     <td style={thTd}>
//                       ${row.Spend.toLocaleString("en-US", {
//                         minimumFractionDigits: 2,
//                         maximumFractionDigits: 2,
//                       })}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

// // ---- Inline CSS ----
// const cardStyle = {
//   background: "white",
//   padding: "20px",
//   borderRadius: "12px",
//   boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
//   textAlign: "center",
// };
// const cardTitle = { color: "#555", fontSize: "15px", marginBottom: "8px" };
// const cardValue = { color: "#111", fontSize: "22px", fontWeight: "bold" };
// const cardSub = { color: "#777", fontSize: "13px", marginTop: "5px" };
// const chartContainer = {
//   background: "white",
//   padding: 20,
//   borderRadius: 12,
//   boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//   marginBottom: 40,
// };
// const thTd = {
//   border: "1px solid #ccc",
//   padding: "8px 10px",
// };
// const warningBox = {
//   background: "#ffebcc",
//   color: "#7a5500",
//   textAlign: "center",
//   padding: "10px",
//   borderRadius: "8px",
//   marginBottom: "20px",
// };
import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  Tooltip,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function DailyReport() {
  const [data, setData] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  const [totals, setTotals] = useState({
    totalSpend: 0,
    totalImpressions: 0,
    totalClicks: 0,
    avgCTR: 0,
    avgSpendPerDay: 0,
    peakImpressions: 0,
    peakClicks: 0,
    peakSpend: 0,
  });

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 1024);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const excelSerialToDate = (serial) => {
    if (typeof serial === "number") {
      const utc_days = Math.floor(serial - 25569);
      const d = new Date(utc_days * 86400 * 1000);
      return `${String(d.getDate()).padStart(2, "0")}-${String(
        d.getMonth() + 1
      ).padStart(2, "0")}-${d.getFullYear()}`;
    }
    return serial;
  };

  const cleanNumber = (val) => {
    const n = parseFloat(String(val).replace(/[^0-9.-]+/g, ""));
    return isNaN(n) ? 0 : n;
  };

  const cleanPercent = (val) => {
    const n = parseFloat(String(val).replace("%", ""));
    return isNaN(n) ? 0 : n;
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const workbook = XLSX.read(event.target.result, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: "" });

      const headers = Object.keys(jsonData[0] || {});
      const find = (k) => headers.find((h) => h.toLowerCase().includes(k));

      const formatted = jsonData.map((r) => ({
        Date: excelSerialToDate(r[find("date") || headers[0]]),
        Impressions: cleanNumber(r[find("imp")]),
        Clicks: cleanNumber(r[find("click")]),
        CTR: cleanPercent(r[find("ctr")]),
        Spend: cleanNumber(r[find("spend")]),
      }));

      const totalImpressions = formatted.reduce((s, r) => s + r.Impressions, 0);
      const totalClicks = formatted.reduce((s, r) => s + r.Clicks, 0);
      const totalSpend = formatted.reduce((s, r) => s + r.Spend, 0);

      setTotals({
        totalSpend,
        totalImpressions,
        totalClicks,
        avgCTR:
          formatted.reduce((s, r) => s + r.CTR, 0) / formatted.length || 0,
        avgSpendPerDay: totalSpend / formatted.length || 0,
        peakImpressions: Math.max(...formatted.map((r) => r.Impressions)),
        peakClicks: Math.max(...formatted.map((r) => r.Clicks)),
        peakSpend: Math.max(...formatted.map((r) => r.Spend)),
      });

      setData(formatted);
    };
    reader.readAsArrayBuffer(file);
  };

  // 🎯 Best representation colors
  const COLORS = {
    spend: "#EA4335",
    impressions: "#34A853",
    clicks: "#4285F4",
    ctr: "#FBBC05",
  };

  return (
    <div style={{ padding: 30, background: "#f9fafc", minHeight: "100vh" }}>
      <h1 style={{ textAlign: "center", color: "#202124" }}>
        📊 Daily Ads Performance Dashboard
      </h1>

      <div style={{ textAlign: "center", marginBottom: 30 }}>
        <input
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleFileUpload}
          style={uploadBtn}
        />
      </div>

      {data.length > 0 && (
        <>
          {/* KPI Cards */}
          <div style={kpiGrid}>
            <Kpi title="Total Impressions" value={totals.totalImpressions} color="#34A853" />
            <Kpi title="Total Clicks" value={totals.totalClicks} color="#4285F4" />
            <Kpi title="Avg CTR (%)" value={totals.avgCTR.toFixed(2)} color="#FBBC05" />
            <Kpi
              title="Total Spend ($)"
              value={totals.totalSpend.toFixed(2)}
              color="#EA4335"
            />
          </div>

          {!isMobile && (
            <>
              {/* Spend vs Impressions */}
              <div style={chartBox}>
                <h3>💰 Spend vs Impressions</h3>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={data}>
                    <CartesianGrid stroke="#E0E0E0" strokeDasharray="3 3" />
                    <XAxis dataKey="Date" tick={{ fill: "#5F6368" }} />
                    <YAxis tick={{ fill: "#5F6368" }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Spend" fill={COLORS.spend} radius={[6, 6, 0, 0]} />
                    <Bar
                      dataKey="Impressions"
                      fill={COLORS.impressions}
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* CTR Trend */}
              <div style={chartBox}>
                <h3>📈 CTR Trend (%)</h3>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={data}>
                    <CartesianGrid stroke="#E0E0E0" strokeDasharray="3 3" />
                    <XAxis dataKey="Date" tick={{ fill: "#5F6368" }} />
                    <YAxis tick={{ fill: "#5F6368" }} />
                    <Tooltip formatter={(v) => `${v.toFixed(2)}%`} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="CTR"
                      stroke={COLORS.ctr}
                      strokeWidth={3}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </>
          )}

          {/* Table */}
          <div style={tableBox}>
            <h3>📋 Detailed Daily Report</h3>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#F8F9FA" }}>
                  <th style={th}>Date</th>
                  <th style={th}>Impressions</th>
                  <th style={th}>Clicks</th>
                  <th style={th}>CTR (%)</th>
                  <th style={th}>Spend ($)</th>
                </tr>
              </thead>
              <tbody>
                {data.map((r, i) => (
                  <tr key={i}>
                    <td style={td}>{r.Date}</td>
                    <td style={td}>{r.Impressions.toLocaleString()}</td>
                    <td style={td}>{r.Clicks.toLocaleString()}</td>
                    <td style={td}>{r.CTR.toFixed(2)}%</td>
                    <td style={td}>${r.Spend.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

// 🔹 UI helpers
const uploadBtn = {
  background: "#4285F4",
  color: "#fff",
  padding: "10px 16px",
  borderRadius: 8,
  border: "none",
  cursor: "pointer",
};

const kpiGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: 20,
  marginBottom: 30,
};

const Kpi = ({ title, value, color }) => (
  <div style={{ background: "#fff", padding: 20, borderRadius: 12 }}>
    <div style={{ color: "#5F6368", fontSize: 14 }}>{title}</div>
    <div style={{ fontSize: 22, fontWeight: 700, color }}>{value}</div>
  </div>
);

const chartBox = {
  background: "#fff",
  padding: 20,
  borderRadius: 12,
  marginBottom: 40,
};

const tableBox = {
  background: "#fff",
  padding: 20,
  borderRadius: 12,
};

const th = {
  border: "1px solid #E0E0E0",
  padding: 8,
};

const td = {
  border: "1px solid #E0E0E0",
  padding: 8,
  textAlign: "center",
};
