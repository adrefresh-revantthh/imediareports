
// // import React, { useEffect, useState } from "react";
// // import axios from "axios";
// // import {
// //   ComposedChart,
// //   CartesianGrid,
// //   XAxis,
// //   YAxis,
// //   Tooltip,
// //   Legend,
// //   Bar,
// //   Line,
// //   ResponsiveContainer,
// //   PieChart,
// //   Pie,
// //   Cell,
// // } from "recharts";

// // const AdWidget = () => {
// //   const [data, setData] = useState([]);
// //   const [filteredData, setFilteredData] = useState([]);
// //   const [startDate, setStartDate] = useState("");
// //   const [endDate, setEndDate] = useState("");
// //   const [showAllRows, setShowAllRows] = useState(false);
// //   const [chartPage, setChartPage] = useState(0);

// //   const INITIAL_ROWS = 7;
// //   const CHART_PAGE_SIZE = 10;

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       try {
// //         const token = JSON.parse(localStorage.getItem("jwt"))?.token;
// //         if (!token) return console.error("No token found");

// //         const res = await axios.get("http://localhost:5000/api/getallsheets", {
// //           headers: { Authorization: `Bearer ${token}` },
// //         });
// // console.log(res,"result");

// //         const normalize = (n) => n?.trim().toLowerCase().replace(/\s|_/g, "");
// //         const allSheets = res.data || [];

// //         const adSheet = allSheets.find((s) => {
// //           const n = normalize(s.name);
// //           return n.includes("adwidget") || n.includes("advertise") || n.includes("widget");
// //         });

// //         console.log(adSheet,"adSheet")

        

// //         if (!adSheet || !adSheet.data?.length) {
// //           console.warn("⚠️ No AdWidget sheet found");
// //           return;
// //         }

// //         const cleaned = adSheet.data.map((item) => {
// //           const row = {};
// //           for (let k in item) row[k.trim()] = item[k];

// //           // Convert Excel serial → readable date
// //           if (!isNaN(row.Date)) {
// //             const base = new Date(1899, 11, 30);
// //             const jsDate = new Date(base.getTime() + row.Date * 86400000);
// //             row.Date = jsDate.toISOString().split("T")[0];
// //           }
// //           return row;
// //         });

// //         setData(cleaned);
// //         setFilteredData(cleaned);
// //       } catch (error) {
// //         console.error("❌ Error fetching AdWidget data:", error);
// //       }
// //     };
// //     fetchData();
// //   }, []);

// //   // ✅ Date filtering logic
// //   useEffect(() => {
// //     if (!startDate || !endDate) {
// //       setFilteredData(data);
// //       return;
// //     }

// //     const start = new Date(startDate);
// //     const end = new Date(endDate);

// //     const filtered = data.filter((row) => {
// //       if (!row.Date) return false;
// //       const date = new Date(row.Date);
// //       return date >= start && date <= end;
// //     });

// //     setFilteredData(filtered);
// //     setChartPage(0);
// //     setShowAllRows(false);
// //   }, [startDate, endDate, data]);

// //   // ✅ Clear both filters
// //   const handleClearFilters = () => {
// //     setStartDate("");
// //     setEndDate("");
// //     setFilteredData(data);
// //     setShowAllRows(false);
// //     setChartPage(0);
// //   };

// //   // ✅ Pagination for charts
// //   const totalPages = Math.ceil(filteredData.length / CHART_PAGE_SIZE);
// //   const currentChunk = filteredData.slice(
// //     chartPage * CHART_PAGE_SIZE,
// //     chartPage * CHART_PAGE_SIZE + CHART_PAGE_SIZE
// //   );

// //   // 📊 Totals
// //   const totalImpressions = filteredData.reduce((a, b) => a + (+b.Impressions || 0), 0);
// //   const totalClicks = filteredData.reduce((a, b) => a + (+b.Clicks || 0), 0);
// //   const totalSpend = filteredData.reduce((a, b) => a + (+b.Spend || 0), 0);

// //   const pieData = [
// //     { name: "Impressions", value: totalImpressions },
// //     { name: "Clicks", value: totalClicks },
// //     { name: "Spend", value: totalSpend },
// //   ];

// //   const COLORS = ["#f50808ff", "#0d0d0dff","#007bff","#757575ff", ];
// //   const rowsToRender = showAllRows ? filteredData : filteredData.slice(0, INITIAL_ROWS);

// //   const isFilteredEmpty = startDate && endDate && filteredData.length === 0;
// //   const hasData = filteredData && filteredData.length > 0;

// //   return (
// //     <div style={styles.card}>
// //       <h3 style={styles.title}>📊 AdWidget Report</h3>

// //       {/* Date Filter Row */}
// //       <div style={styles.filterRow}>
// //         <div style={styles.filterGroup}>
// //           <label style={styles.label}>Start Date</label>
// //           <input
// //             type="date"
// //             value={startDate}
// //             onChange={(e) => setStartDate(e.target.value)}
// //             style={styles.dateInput}
// //           />
// //         </div>

// //         <div style={styles.filterGroup}>
// //           <label style={styles.label}>End Date</label>
// //           <input
// //             type="date"
// //             value={endDate}
// //             onChange={(e) => setEndDate(e.target.value)}
// //             style={styles.dateInput}
// //           />
// //         </div>

// //         <button
// //           onClick={handleClearFilters}
// //           disabled={!startDate && !endDate}
// //           style={{
// //             ...styles.clearButton,
// //             opacity: !startDate && !endDate ? 0.6 : 1,
// //             cursor: !startDate && !endDate ? "not-allowed" : "pointer",
// //           }}
// //         >
// //           ✖ Clear Filters
// //         </button>
// //       </div>

// //       {/* No Data or Charts */}
// //       {isFilteredEmpty ? (
// //         <p style={styles.noData}>⚠️ No data found in this date range.</p>
// //       ) : !hasData ? (
// //         <p style={styles.noData}>⏳ Loading or no AdWidget data available.</p>
// //       ) : (
// //         <>
// //           {/* Chart Section */}
// //           <ResponsiveContainer width="100%" height={360}>
// //             <ComposedChart data={currentChunk}>
// //               <CartesianGrid strokeDasharray="3 3" />
// //               <XAxis
// //                 dataKey="Date"
// //                 tick={{ fontSize: 11, fill: "#000000ff" }}
// //                 interval={0}
// //                 angle={-25}
// //                 textAnchor="end"
// //               />
// //               <YAxis
// //                 yAxisId="left"
// //                 label={{ value: "Impressions/Spend", angle: -90, position: "insideLeft" }}
// //               />
// //               <YAxis
// //                 yAxisId="right"
// //                 orientation="right"
// //                 label={{ value: "Clicks/CTR", angle: 90, position: "insideRight" }}
// //               />
// //               <Tooltip />
// //               <Legend />
// //               <Bar yAxisId="left" dataKey="Impressions" fill="#4862f4ff" barSize={20} />
// //               <Bar yAxisId="left" dataKey="Spend" fill="#ff0404ff" barSize={20} />
// //               <Line yAxisId="right" type="monotone" dataKey="Clicks" stroke="#000000ff" strokeWidth={2.5} />
// //               <Line yAxisId="right" type="monotone" dataKey="CTR" stroke="#48cae4" strokeWidth={2.5} />
// //             </ComposedChart>
// //           </ResponsiveContainer>

// //           {/* Chart Pagination Controls */}
// //           {filteredData.length > CHART_PAGE_SIZE && (
// //             <div style={styles.pagination}>
// //               <button
// //                 onClick={() => setChartPage((p) => Math.max(p - 1, 0))}
// //                 disabled={chartPage === 0}
// //                 style={{
// //                   ...styles.navButton,
// //                   opacity: chartPage === 0 ? 0.5 : 1,
// //                 }}
// //               >
// //                 ◀ Previous
// //               </button>

// //               <span style={styles.pageIndicator}>
// //                 Page {chartPage + 1} of {totalPages}
// //               </span>

// //               <button
// //                 onClick={() => setChartPage((p) => Math.min(p + 1, totalPages - 1))}
// //                 disabled={chartPage >= totalPages - 1}
// //                 style={{
// //                   ...styles.navButton,
// //                   opacity: chartPage >= totalPages - 1 ? 0.5 : 1,
// //                 }}
// //               >
// //                 Next ▶
// //               </button>
// //             </div>
// //           )}

// //           {/* Pie Chart */}
// //           <ResponsiveContainer width="100%" height={300}>
// //             <PieChart>
// //               <Pie
// //                 data={pieData}
// //                 dataKey="value"
// //                 nameKey="name"
// //                 cx="50%"
// //                 cy="50%"
// //                 innerRadius={60}
// //                 outerRadius={100}
// //                 label
// //               >
// //                 {pieData.map((entry, index) => (
// //                   <Cell key={index} fill={COLORS[index % COLORS.length]} />
// //                 ))}
// //               </Pie>
// //               <Tooltip />
// //               <Legend />
// //             </PieChart>
// //           </ResponsiveContainer>

// //           {/* Table */}
// //           <div style={{ marginTop: 30 }}>
// //             <div
// //               style={{
// //                 ...styles.tableContainer,
// //                 maxHeight: showAllRows ? "2000px" : "420px",
// //               }}
// //             >
// //               <table style={styles.table}>
// //                 <thead>
// //                   <tr>
// //                     {Object.keys(filteredData[0] || {}).map((head, i) => (
// //                       <th key={i} style={styles.th}>
// //                         {head}
// //                       </th>
// //                     ))}
// //                   </tr>
// //                 </thead>
// //                 <tbody>
// //                   {rowsToRender.map((row, i) => (
// //                     <tr key={i}>
// //                       {Object.keys(row || {}).map((key, j) => (
// //                         <td key={j} style={styles.td}>
// //                           {row[key]}
// //                         </td>
// //                       ))}
// //                     </tr>
// //                   ))}
// //                 </tbody>
// //               </table>
// //             </div>

// //             {/* View More / Less */}
// //             {filteredData.length > INITIAL_ROWS && (
// //               <div style={{ textAlign: "center", marginTop: 12 }}>
// //                 <button
// //                   onClick={() => setShowAllRows((s) => !s)}
// //                   style={styles.viewMoreBtn}
// //                 >
// //                   {showAllRows
// //                     ? "View less ▴"
// //                     : `View more ▾ (${filteredData.length - INITIAL_ROWS} more)`}
// //                 </button>
// //               </div>
// //             )}
// //           </div>
// //         </>
// //       )}
// //     </div>
// //   );
// // };

// // // 🎨 Styles
// // const styles = {
// //   card: {
// //     marginTop: "20px",
// //     padding: "25px",
// //     backgroundColor: "#f8f9fb",
// //     borderRadius: "12px",
// //     boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
// //   },
// //   title: {
// //     textAlign: "center",
// //     color: "#023e8a",
// //     fontSize: "22px",
// //     fontWeight: 700,
// //     marginBottom: "25px",
// //   },
// //   filterRow: {
// //     display: "flex",
// //     justifyContent: "center",
// //     alignItems: "flex-end",
// //     gap: "20px",
// //     flexWrap: "wrap",
// //     marginBottom: "25px",
// //   },
// //   filterGroup: { display: "flex", flexDirection: "column" },
// //   label: { fontWeight: "600", color: "#333", marginBottom: "6px" },
// //   dateInput: {
// //     padding: "7px 10px",
// //     borderRadius: "6px",
// //     border: "1px solid #ccc",
// //     fontSize: "14px",
// //     outline: "none",
// //   },
// //   clearButton: {
// //     padding: "9px 18px",
// //     borderRadius: "8px",
// //     border: "none",
// //     background: "linear-gradient(90deg, #ff4b4b, #b71c1c)",
// //     color: "#fff",
// //     fontWeight: "600",
// //     transition: "0.3s ease",
// //   },
// //   pagination: {
// //     textAlign: "center",
// //     marginTop: "12px",
// //     display: "flex",
// //     justifyContent: "center",
// //     alignItems: "center",
// //     gap: "15px",
// //   },
// //   navButton: {
// //     background: "#0077b6",
// //     border: "none",
// //     color: "#fff",
// //     padding: "8px 16px",
// //     borderRadius: "6px",
// //     cursor: "pointer",
// //     fontWeight: "600",
// //   },
// //   pageIndicator: { fontWeight: "600", color: "#333" },
// //   tableContainer: {
// //     overflow: "hidden",
// //     transition: "max-height 400ms ease",
// //     borderRadius: 6,
// //     border: "1px solid #e6e6e6",
// //     background: "#fff",
// //   },
// //   table: { borderCollapse: "collapse", width: "100%" },
// //   th: {
// //     border: "1px solid #ddd",
// //     padding: "8px",
// //     backgroundColor: "#e9f5ff",
// //     textAlign: "center",
// //   },
// //   td: { border: "1px solid #ddd", padding: "8px", textAlign: "center" },
// //   noData: { textAlign: "center", color: "#777", marginTop: "25px" },
// //   viewMoreBtn: {
// //     padding: "9px 16px",
// //     borderRadius: 8,
// //     border: "none",
// //     background: "linear-gradient(90deg, #0066ff, #00bfff)",
// //     color: "#fff",
// //     cursor: "pointer",
// //     fontWeight: 600,
// //   },
// // };

// // export default AdWidget;
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   ComposedChart,
//   CartesianGrid,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Legend,
//   Bar,
//   Line,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
// } from "recharts";

// const AdWidget = () => {
//   const [data, setData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [showAllRows, setShowAllRows] = useState(false);
//   const [chartPage, setChartPage] = useState(0);

//   const INITIAL_ROWS = 7;
//   const CHART_PAGE_SIZE = 10;

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const token = JSON.parse(localStorage.getItem("jwt"))?.token;
//         if (!token) return;

//         const res = await axios.get("https://imediareports.onrender.com/api/getallsheets", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         console.log(res,"widget");
        

//         const normalize = (n) => n?.trim().toLowerCase().replace(/\s|_/g, "");
//         const adSheet = (res.data || []).find((s) =>
//           ["adwidget", "advertise", "widget"].some((k) =>
//             normalize(s.name).includes(k)
//           )
//         );

//         if (!adSheet?.data?.length) return;

//         const cleaned = adSheet.data.map((item) => {
//           const row = {};
//           for (let k in item) row[k.trim()] = item[k];

//           if (!isNaN(row.Date)) {
//             const base = new Date(1899, 11, 30);
//             row.Date = new Date(base.getTime() + row.Date * 86400000)
//               .toISOString()
//               .split("T")[0];
//           }
//           return row;
//         });

//         setData(cleaned);
//         setFilteredData(cleaned);
//       } catch (e) {
//         console.error(e);
//       }
//     };
//     fetchData();
//   }, []);

//   useEffect(() => {
//     if (!startDate || !endDate) {
//       setFilteredData(data);
//       return;
//     }

//     const start = new Date(startDate);
//     const end = new Date(endDate);

//     setFilteredData(
//       data.filter((r) => new Date(r.Date) >= start && new Date(r.Date) <= end)
//     );
//     setChartPage(0);
//     setShowAllRows(false);
//   }, [startDate, endDate, data]);

//   const handleClearFilters = () => {
//     setStartDate("");
//     setEndDate("");
//     setFilteredData(data);
//     setShowAllRows(false);
//     setChartPage(0);
//   };

//   const totalPages = Math.ceil(filteredData.length / CHART_PAGE_SIZE);
//   const currentChunk = filteredData.slice(
//     chartPage * CHART_PAGE_SIZE,
//     chartPage * CHART_PAGE_SIZE + CHART_PAGE_SIZE
//   );

//   const totalImpressions = filteredData.reduce((a, b) => a + (+b.Impressions || 0), 0);
//   const totalClicks = filteredData.reduce((a, b) => a + (+b.Clicks || 0), 0);
//   const totalSpend = filteredData.reduce((a, b) => a + (+b.Spend || 0), 0);

//   const pieData = [
//     { name: "Impressions", value: totalImpressions },
//     { name: "Clicks", value: totalClicks },
//     { name: "Spend", value: totalSpend },
//   ];

//   // 🎯 Best-representation colors
//   const COLORS = {
//     impressions: "#34A853",
//     clicks: "#4285F4",
//     spend: "#EA4335",
//     ctr: "#FBBC05",
//     grid: "#E0E0E0",
//     axis: "#5F6368",
//   };

//   const PIE_COLORS = [
//     COLORS.impressions,
//     COLORS.clicks,
//     COLORS.spend,
//   ];

//   const rowsToRender = showAllRows
//     ? filteredData
//     : filteredData.slice(0, INITIAL_ROWS);

//   const isFilteredEmpty = startDate && endDate && filteredData.length === 0;

//   return (
//     <div style={styles.card}>
//       <h3 style={styles.title}>📊 AdWidget Report</h3>

//       {/* Filters */}
//       <div style={styles.filterRow}>
//         <div style={styles.filterGroup}>
//           <label style={styles.label}>Start Date</label>
//           <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={styles.dateInput} />
//         </div>
//         <div style={styles.filterGroup}>
//           <label style={styles.label}>End Date</label>
//           <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={styles.dateInput} />
//         </div>
//         <button onClick={handleClearFilters} disabled={!startDate && !endDate} style={styles.clearButton}>
//           ✖ Clear Filters
//         </button>
//       </div>

//       {isFilteredEmpty ? (
//         <p style={styles.noData}>⚠️ No data found in this date range.</p>
//       ) : (
//         <>
//           {/* Composed Chart */}
//           <ResponsiveContainer width="100%" height={360}>
//             <ComposedChart data={currentChunk}>
//               <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
//               <XAxis dataKey="Date" tick={{ fill: COLORS.axis, fontSize: 11 }} angle={0} textAnchor="end" interval={0} />
//               <YAxis yAxisId="left" tick={{ fill: COLORS.axis }} />
//               <YAxis yAxisId="right" orientation="right" tick={{ fill: COLORS.axis }} />
//               <Tooltip />
//               <Legend />
//               <Bar yAxisId="left" dataKey="Impressions" fill={COLORS.impressions} barSize={20} />
//               <Bar yAxisId="left" dataKey="Spend" fill={COLORS.spend} barSize={20} />
//               <Line yAxisId="right" type="monotone" dataKey="Clicks" stroke={COLORS.clicks} strokeWidth={2.5} />
//               <Line yAxisId="right" type="monotone" dataKey="CTR" stroke={COLORS.ctr} strokeWidth={2.5} />
//             </ComposedChart>
//           </ResponsiveContainer>

//           {/* Pagination */}
//           {filteredData.length > CHART_PAGE_SIZE && (
//             <div style={styles.pagination}>
//               <button onClick={() => setChartPage((p) => Math.max(p - 1, 0))} disabled={chartPage === 0} style={styles.navButton}>
//                 ◀ Previous
//               </button>
//               <span style={styles.pageIndicator}>
//                 Page {chartPage + 1} of {totalPages}
//               </span>
//               <button onClick={() => setChartPage((p) => Math.min(p + 1, totalPages - 1))} disabled={chartPage >= totalPages - 1} style={styles.navButton}>
//                 Next ▶
//               </button>
//             </div>
//           )}

//           {/* Pie */}
//           <ResponsiveContainer width="100%" height={300}>
//             <PieChart>
//               <Pie data={pieData} dataKey="value" innerRadius={60} outerRadius={100} label>
//                 {pieData.map((_, i) => (
//                   <Cell key={i} fill={PIE_COLORS[i]} />
//                 ))}
//               </Pie>
//               <Tooltip />
//               <Legend />
//             </PieChart>
//           </ResponsiveContainer>

//           {/* Table */}
//           <div style={styles.tableContainer}>
//             <table style={styles.table}>
//               <thead>
//                 <tr>
//                   {Object.keys(filteredData[0] || {}).map((h, i) => (
//                     <th key={i} style={styles.th}>{h}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {rowsToRender.map((r, i) => (
//                   <tr key={i}>
//                     {Object.keys(r).map((k, j) => (
//                       <td key={j} style={styles.td}>{r[k]}</td>
//                     ))}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// // 🎨 Styles (unchanged layout, better contrast)
// const styles = {
//   card: { padding: 25, background: "#f9fafc", borderRadius: 12 },
//   title: { textAlign: "center", color: "#202124", marginBottom: 25 },
//   filterRow: { display: "flex", justifyContent: "center", gap: 20, marginBottom: 25 },
//   filterGroup: { display: "flex", flexDirection: "column" },
//   label: { fontWeight: 600, color: "#5F6368" },
//   dateInput: { padding: 8, borderRadius: 6, border: "1px solid #ccc" },
//   clearButton: { background: "#EA4335", color: "#fff", border: "none", padding: "8px 16px", borderRadius: 6 },
//   pagination: { display: "flex", justifyContent: "center", gap: 15, marginTop: 12 },
//   navButton: { background: "#4285F4", color: "#fff", border: "none", padding: "8px 16px", borderRadius: 6 },
//   pageIndicator: { fontWeight: 600, color: "#5F6368" },
//   tableContainer: { marginTop: 30, overflowX: "auto", background: "#fff", borderRadius: 6 },
//   table: { width: "100%", borderCollapse: "collapse" },
//   th: { border: "1px solid #E0E0E0", padding: 8, background: "#F8F9FA" },
//   td: { border: "1px solid #E0E0E0", padding: 8, textAlign: "center" },
//   noData: { textAlign: "center", color: "#777" },
// };

// export default AdWidget;
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
  Legend,
  Line,
} from "recharts";

/* ===== UTIL ===== */
const toNumber = (v) => {
  const n = parseFloat(v);
  return isNaN(n) ? 0 : n;
};

const AdvertiserDashboard = () => {
  const [campaignData, setCampaignData] = useState([]);
  const [totals, setTotals] = useState({
    impressions: 0,
    clicks: 0,
    ctr: "0.00",
    ecpm: "0.00",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jwt = JSON.parse(localStorage.getItem("jwt"));
        const token = jwt?.token;
        if (!token) return;

        /* 🔹 API (token already filters advertiser data in backend) */
        const res = await axios.get(
          "https://imediareports.onrender.com/api/getgenealogyrecords",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const sheets = res.data?.genealogySheets || [];
        console.log("ADVERTISER SHEETS:", sheets);

        const map = {};
        let totalImps = 0;
        let totalClicks = 0;
        let totalSpend = 0;

        sheets.forEach((sheet) => {
          const campaign = sheet.campaign || "Unknown Campaign";

          if (!map[campaign]) {
            map[campaign] = {
              campaign,
              impressions: 0,
              clicks: 0,
              spend: 0,
            };
          }

          if (Array.isArray(sheet.data)) {
            sheet.data.forEach((row) => {
              if (!row || typeof row !== "object") return;

              const e = {};
              Object.keys(row).forEach(
                (k) => (e[k.trim().toLowerCase()] = row[k])
              );

              const imps = toNumber(e.impressions || e.impression);
              const clicks = toNumber(e.clicks || e.click);
              const cpm = toNumber(e.cpm || e["cost per mille"]);
              const cpc = toNumber(e.cpc);

              let spend = 0;
              if (cpc && clicks) spend = clicks * cpc;
              else if (cpm && imps) spend = (imps / 1000) * cpm;

              map[campaign].impressions += imps;
              map[campaign].clicks += clicks;
              map[campaign].spend += spend;

              totalImps += imps;
              totalClicks += clicks;
              totalSpend += spend;
            });
          }
        });

        const formatted = Object.values(map).map((c) => ({
          campaign: c.campaign,
          impressions: c.impressions,
          clicks: c.clicks,
          ctr:
            c.impressions > 0
              ? ((c.clicks / c.impressions) * 100).toFixed(2)
              : "0.00",
          ecpm:
            c.impressions > 0
              ? ((c.spend / c.impressions) * 1000).toFixed(2)
              : "0.00",
        }));

        setCampaignData(formatted);
        setTotals({
          impressions: totalImps,
          clicks: totalClicks,
          ctr:
            totalImps > 0
              ? ((totalClicks / totalImps) * 100).toFixed(2)
              : "0.00",
          ecpm:
            totalImps > 0
              ? ((totalSpend / totalImps) * 1000).toFixed(2)
              : "0.00",
        });
      } catch (err) {
        console.error("Advertiser dashboard error:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ padding: 24, background: "#f5f7fb", minHeight: "100vh" }}>
      <h2 style={{ fontWeight: 800, marginBottom: 20 }}>
        📊 Advertiser Campaign Performance
      </h2>

      {/* ===== SUMMARY CARDS ===== */}
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        <Card label="Total Impressions" value={totals.impressions.toLocaleString()} />
        <Card label="Total Clicks" value={totals.clicks.toLocaleString()} />
        <Card label="Overall CTR %" value={totals.ctr} />
        <Card label="Avg eCPM ($)" value={totals.ecpm} />
      </div>

      {/* ===== TABLE ===== */}
      <div style={cardWrap}>
        <h3 style={sectionTitle}>Campaign Breakdown</h3>
        <table style={tableStyle}>
          <thead>
            <tr>
              <TH>Campaign</TH>
              <TH>Impressions</TH>
              <TH>Clicks</TH>
              <TH>CTR %</TH>
              <TH>eCPM ($)</TH>
            </tr>
          </thead>
          <tbody>
            {campaignData.map((c, i) => (
              <tr key={i}>
                <TD style={{ fontWeight: 700 }}>{c.campaign}</TD>
                <TD>{c.impressions.toLocaleString()}</TD>
                <TD>{c.clicks}</TD>
                <TD>{c.ctr}</TD>
                <TD>{c.ecpm}</TD>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===== CHART ===== */}
      <div style={cardWrap}>
        <h3 style={sectionTitle}>Impressions vs Clicks</h3>
        <ResponsiveContainer width="100%" height={360}>
          <BarChart data={campaignData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="campaign" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="impressions" fill="#06c19c" />
            <Line dataKey="clicks" stroke="#ff4d4f" strokeWidth={3} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

/* ===== UI ===== */
const cardWrap = {
  background: "#fff",
  padding: 22,
  borderRadius: 14,
  marginTop: 28,
  boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
};

const sectionTitle = {
  fontWeight: 800,
  marginBottom: 14,
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
};

const TH = ({ children }) => (
  <th style={{ padding: 12, borderBottom: "2px solid #e5e7eb", textAlign: "left" }}>
    {children}
  </th>
);

const TD = ({ children, style }) => (
  <td style={{ padding: 12, borderBottom: "1px solid #eee", ...style }}>
    {children}
  </td>
);

const Card = ({ label, value }) => (
  <div
    style={{
      background: "#fff",
      padding: 22,
      borderRadius: 14,
      minWidth: 220,
      boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
    }}
  >
    <div style={{ fontSize: 14, fontWeight: 600, color: "#6b7280" }}>
      {label}
    </div>
    <div style={{ fontSize: 24, fontWeight: 900, marginTop: 6 }}>
      {value}
    </div>
  </div>
);

export default AdvertiserDashboard;