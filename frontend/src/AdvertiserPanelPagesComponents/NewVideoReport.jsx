

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   ResponsiveContainer,
//   ComposedChart,
//   CartesianGrid,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Legend,
//   Bar,
//   Line,
//   PieChart,
//   Pie,
//   Cell,
// } from "recharts";

// const VideoReport = () => {
//   const [data, setData] = useState([]);
//   const [filtered, setFiltered] = useState([]);
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [showAllRows, setShowAllRows] = useState(false);
//   const [chartPage, setChartPage] = useState(0);

//   const CHART_PAGE_SIZE = 10; // show 10 data points per page

//   // ✅ Fetch Video Report Sheet
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const tokenData = JSON.parse(localStorage.getItem("jwt"));
//         const userToken = tokenData?.token;
//         if (!userToken) {
//           console.error("No token found in localStorage");
//           return;
//         }

//         const res = await axios.get("http://localhost:5000/api/getallsheets", {
//           headers: { Authorization: `Bearer ${userToken}` },
//         });

//         const normalize = (n) => n?.trim().toLowerCase().replace(/\s|_/g, "");
//         const allSheets = res.data || [];
//         const videoSheet = allSheets.find((s) => {
//           const name = normalize(s.name);
//           return name.includes("videoreport") || name.includes("video");
//         });

//         if (!videoSheet || !videoSheet.data?.length) {
//           console.warn("⚠️ No valid VideoReport sheet found");
//           return;
//         }

//         const cleanedData = videoSheet.data.map((row) => {
//           const clean = {};
//           for (let key in row) clean[key.trim()] = row[key];

//           // Excel serial → readable date
//           if (!isNaN(clean.Date)) {
//             const excelBase = new Date(1899, 11, 30);
//             const jsDate = new Date(excelBase.getTime() + clean.Date * 86400000);
//             clean.Date = jsDate.toISOString().split("T")[0];
//           }
//           return clean;
//         });

//         setData(cleanedData);
//         setFiltered(cleanedData);
//       } catch (err) {
//         console.error("❌ Error fetching VideoReport data:", err);
//       }
//     };
//     fetchData();
//   }, []);

//   // ✅ Date Filter
//   useEffect(() => {
//     if (!startDate && !endDate) {
//       setFiltered(data);
//       return;
//     }

//     const f = data.filter((row) => {
//       const date = new Date(row.Date);
//       const afterStart = startDate ? date >= new Date(startDate) : true;
//       const beforeEnd = endDate ? date <= new Date(endDate) : true;
//       return afterStart && beforeEnd;
//     });

//     setFiltered(f);
//     setChartPage(0);
//   }, [startDate, endDate, data]);

//   // ✅ Clear Filters Button
//   const handleClearFilters = () => {
//     setStartDate("");
//     setEndDate("");
//     setFiltered(data);
//     setChartPage(0);
//   };

//   // ✅ Chart Pagination
//   const totalPages = Math.ceil(filtered.length / CHART_PAGE_SIZE);
//   const currentChunk = filtered.slice(
//     chartPage * CHART_PAGE_SIZE,
//     chartPage * CHART_PAGE_SIZE + CHART_PAGE_SIZE
//   );

//     //  fill="#f50808ff"
               
//     //                 stroke="  #007bff" // blue
//   const COLORS = ["#f50808ff", "#000000ff", "#3372f2ff", "#030303ff"];
//   const totalImpressions = filtered.reduce((a, b) => a + (+b.Impressions || 0), 0);
//   const totalClicks = filtered.reduce((a, b) => a + (+b.Clicks || 0), 0);
//   const totalSpend = filtered.reduce((a, b) => a + (+b.Spend || 0), 0);
//   const pieData = [
//     { name: "Impressions", value: totalImpressions },
//     { name: "Clicks", value: totalClicks },
//     { name: "Spend", value: totalSpend },
//   ];

//   const headers = filtered.length > 0 ? Object.keys(filtered[0]) : [];
//   const visibleRows = showAllRows ? filtered : filtered.slice(0, 7);

//   const noDataInRange = startDate && endDate && filtered.length === 0;

//   return (
//     <div style={styles.container}>
//       <h2 style={styles.title}>🎥 Video Report Dashboard</h2>

//       {/* 📅 Date Filter Section with Clear Button */}
//       <div style={styles.filterContainer}>
//         <div style={styles.filterGroup}>
//           <label style={styles.label}>Start Date:</label>
//           <input
//             type="date"
//             value={startDate}
//             onChange={(e) => setStartDate(e.target.value)}
//             style={styles.dateInput}
//           />
//         </div>

//         <div style={styles.filterGroup}>
//           <label style={styles.label}>End Date:</label>
//           <input
//             type="date"
//             value={endDate}
//             onChange={(e) => setEndDate(e.target.value)}
//             style={styles.dateInput}
//           />
//         </div>

//         <button
//           onClick={handleClearFilters}
//           style={{
//             ...styles.clearButton,
//             opacity: !startDate && !endDate ? 0.6 : 1,
//             cursor: !startDate && !endDate ? "not-allowed" : "pointer",
//           }}
//           disabled={!startDate && !endDate}
//         >
//           ✖ Clear Filters
//         </button>
//       </div>

//       {/* ⚠️ No Data Handling */}
//       {noDataInRange ? (
//         <h3 style={styles.noData}>⚠️ No records available for this date range</h3>
//       ) : filtered.length === 0 ? (
//         <h3 style={styles.noData}>⏳ Loading or no records found</h3>
//       ) : (
//         <>
//           {/* 📊 Chart Section */}
//           <div style={styles.chartCard}>
//             <h3>Impressions, Spend & Clicks Overview</h3>
//             <ResponsiveContainer width="100%" height={380}>
//               <ComposedChart data={currentChunk}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis
//                   dataKey="Date"
//                   tick={{ fontSize: 11, fill: "#444" }}
//                   angle={-25}
//                   textAnchor="end"
//                   interval={0}
//                 />
//                 <YAxis yAxisId="left" />
//                 <YAxis yAxisId="right" orientation="right" />
//                 <Tooltip />
//                 <Legend />
//                 <Bar yAxisId="left" dataKey="Impressions" fill="#f50808ff" barSize={20} />
//                 <Bar yAxisId="left" dataKey="Spend" fill="#0096c7" barSize={20} />
//                 <Line yAxisId="right" type="monotone" dataKey="Clicks" stroke="#007bff" strokeWidth={2.5} />
//               </ComposedChart>
//             </ResponsiveContainer>
 

//             {/* Pagination Controls */}
//             {filtered.length > CHART_PAGE_SIZE && (
//               <div style={styles.pagination}>
//                 <button
//                   onClick={() => setChartPage((p) => Math.max(p - 1, 0))}
//                   disabled={chartPage === 0}
//                   style={{
//                     ...styles.navButton,
//                     opacity: chartPage === 0 ? 0.5 : 1,
//                   }}
//                 >
//                   ◀ Previous
//                 </button>

//                 <span style={styles.pageIndicator}>
//                   Page {chartPage + 1} of {totalPages}
//                 </span>

//                 <button
//                   onClick={() => setChartPage((p) => Math.min(p + 1, totalPages - 1))}
//                   disabled={chartPage >= totalPages - 1}
//                   style={{
//                     ...styles.navButton,
//                     opacity: chartPage >= totalPages - 1 ? 0.5 : 1,
//                   }}
//                 >
//                   Next ▶
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* 🍩 Pie Summary */}
//           <div style={styles.chartCard}>
//             <h3>Overall Summary</h3>
//             <ResponsiveContainer width="100%" height={300}>
//               <PieChart>
//                 <Pie
//                   data={pieData}
//                   dataKey="value"
//                   nameKey="name"
//                   cx="50%"
//                   cy="50%"
//                   outerRadius={100}
//                   innerRadius={60}
//                   label
//                 >
//                   {pieData.map((_, i) => (
//                     <Cell key={i} fill={COLORS[i % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//                 <Legend />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>

//           {/* 🧾 Table Section */}
//           <div style={styles.tableCard}>
//             <h3>Detailed Report</h3>
//             <div style={styles.tableWrapper}>
//               <table style={styles.table}>
//                 <thead>
//                   <tr>
//                     {headers.map((head, i) => (
//                       <th key={i} style={styles.th}>
//                         {head}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {visibleRows.map((row, i) => (
//                     <tr key={i}>
//                       {headers.map((head, j) => (
//                         <td key={j} style={styles.td}>
//                           {row[head]}
//                         </td>
//                       ))}
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {/* 🔁 View More / Less */}
//             {filtered.length > 7 && (
//               <div style={{ textAlign: "center", marginTop: "15px" }}>
//                 <button
//                   style={styles.viewBtn}
//                   onClick={() => setShowAllRows(!showAllRows)}
//                 >
//                   {showAllRows ? "View Less ▲" : "View More ▼"}
//                 </button>
//               </div>
//             )}
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// // 🎨 Styles
// const styles = {
//   container: { marginTop: "30px", background: "#fff", borderRadius: "10px", padding: "20px" },
//   title: { textAlign: "center", color: "#023e8a" },
//   filterContainer: {
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "flex-end",
//     gap: "20px",
//     flexWrap: "wrap",
//     marginBottom: "25px",
//   },
//   filterGroup: { display: "flex", flexDirection: "column" },
//   label: { fontWeight: "bold", marginBottom: "5px", color: "#333" },
//   dateInput: {
//     padding: "7px 10px",
//     borderRadius: "6px",
//     border: "1px solid #ccc",
//     outline: "none",
//     fontSize: "14px",
//   },
//   clearButton: {
//     padding: "10px 20px",
//     borderRadius: "8px",
//     border: "none",
//     background: "linear-gradient(90deg, #ff4b4b, #b71c1c)",
//     color: "#fff",
//     fontWeight: "600",
//     transition: "0.3s ease",
//   },
//   chartCard: {
//     background: "#f8f9fa",
//     padding: "20px",
//     borderRadius: "10px",
//     marginBottom: "30px",
//     boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
//   },
//   pagination: {
//     textAlign: "center",
//     marginTop: "12px",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     gap: "15px",
//   },
//   navButton: {
//     background: "#0077b6",
//     border: "none",
//     color: "#fff",
//     padding: "8px 16px",
//     borderRadius: "6px",
//     cursor: "pointer",
//     fontWeight: "600",
//   },
//   pageIndicator: { fontWeight: "600", color: "#333" },
//   tableCard: {
//     background: "#fafafa",
//     padding: "20px",
//     borderRadius: "10px",
//     boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
//   },
//   tableWrapper: { overflowX: "auto" },
//   table: { width: "100%", borderCollapse: "collapse" },
//   th: { border: "1px solid #ddd", padding: "8px", background: "#e9f5ff", textAlign: "center" },
//   td: { border: "1px solid #ddd", padding: "8px", textAlign: "center" },
//   noData: { textAlign: "center", color: "#777", marginTop: "40px" },
//   viewBtn: {
//     padding: "10px 20px",
//     background: "linear-gradient(90deg, #0066ff, #00bfff)",
//     color: "#fff",
//     border: "none",
//     borderRadius: "6px",
//     cursor: "pointer",
//     fontWeight: "600",
//     transition: "background 0.3s ease",
//   },
// };

// export default VideoReport;
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ResponsiveContainer,
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const VideoReport = () => {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showAllRows, setShowAllRows] = useState(false);
  const [chartPage, setChartPage] = useState(0);

  const CHART_PAGE_SIZE = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userToken = JSON.parse(localStorage.getItem("jwt"))?.token;
        if (!userToken) return;

        const res = await axios.get("https://imediareports.onrender.com/api/getallsheets", {
          headers: { Authorization: `Bearer ${userToken}` },
        });

        const normalize = (n) => n?.trim().toLowerCase().replace(/\s|_/g, "");
        const videoSheet = (res.data || []).find((s) =>
          normalize(s.name).includes("video")
        );

        if (!videoSheet?.data?.length) return;

        const cleaned = videoSheet.data.map((row) => {
          const r = {};
          for (let k in row) r[k.trim()] = row[k];
          if (!isNaN(r.Date)) {
            const base = new Date(1899, 11, 30);
            r.Date = new Date(base.getTime() + r.Date * 86400000)
              .toISOString()
              .split("T")[0];
          }
          return r;
        });

        setData(cleaned);
        setFiltered(cleaned);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!startDate && !endDate) {
      setFiltered(data);
      return;
    }
    setFiltered(
      data.filter((r) => {
        const d = new Date(r.Date);
        return (!startDate || d >= new Date(startDate)) &&
               (!endDate || d <= new Date(endDate));
      })
    );
    setChartPage(0);
  }, [startDate, endDate, data]);

  const handleClearFilters = () => {
    setStartDate("");
    setEndDate("");
    setFiltered(data);
    setChartPage(0);
  };

  const totalPages = Math.ceil(filtered.length / CHART_PAGE_SIZE);
  const currentChunk = filtered.slice(
    chartPage * CHART_PAGE_SIZE,
    chartPage * CHART_PAGE_SIZE + CHART_PAGE_SIZE
  );

  const totalImpressions = filtered.reduce((a, b) => a + (+b.Impressions || 0), 0);
  const totalClicks = filtered.reduce((a, b) => a + (+b.Clicks || 0), 0);
  const totalSpend = filtered.reduce((a, b) => a + (+b.Spend || 0), 0);

  const pieData = [
    { name: "Impressions", value: totalImpressions },
    { name: "Clicks", value: totalClicks },
    { name: "Spend", value: totalSpend },
  ];

  // 🎯 Best representation colors
  const COLORS = {
    impressions: "#34A853",
    clicks: "#4285F4",
    spend: "#EA4335",
    grid: "#E0E0E0",
    axis: "#5F6368",
  };

  const PIE_COLORS = [
    COLORS.impressions,
    COLORS.clicks,
    COLORS.spend,
  ];

  const headers = filtered.length > 0 ? Object.keys(filtered[0]) : [];
  const visibleRows = showAllRows ? filtered : filtered.slice(0, 7);
  const noDataInRange = startDate && endDate && filtered.length === 0;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🎥 Video Report Dashboard</h2>

      {/* Filters */}
      <div style={styles.filterContainer}>
        <div style={styles.filterGroup}>
          <label style={styles.label}>Start Date</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={styles.dateInput} />
        </div>
        <div style={styles.filterGroup}>
          <label style={styles.label}>End Date</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={styles.dateInput} />
        </div>
        <button onClick={handleClearFilters} disabled={!startDate && !endDate} style={styles.clearButton}>
          ✖ Clear Filters
        </button>
      </div>

      {noDataInRange ? (
        <h3 style={styles.noData}>⚠️ No records available for this date range</h3>
      ) : (
        <>
          {/* Chart */}
          <div style={styles.chartCard}>
            <h3>Impressions, Spend & Clicks Overview</h3>
            <ResponsiveContainer width="100%" height={380}>
              <ComposedChart data={currentChunk}>
                <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
                <XAxis dataKey="Date" tick={{ fill: COLORS.axis, fontSize: 11 }} angle={0} textAnchor="end" interval={0} />
                <YAxis yAxisId="left" tick={{ fill: COLORS.axis }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fill: COLORS.axis }} />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="Impressions" fill={COLORS.impressions} barSize={20} />
                <Bar yAxisId="left" dataKey="Spend" fill={COLORS.spend} barSize={20} />
                <Line yAxisId="right" type="monotone" dataKey="Clicks" stroke={COLORS.clicks} strokeWidth={2.5} />
              </ComposedChart>
            </ResponsiveContainer>

            {filtered.length > CHART_PAGE_SIZE && (
              <div style={styles.pagination}>
                <button onClick={() => setChartPage((p) => Math.max(p - 1, 0))} disabled={chartPage === 0} style={styles.navButton}>
                  ◀ Previous
                </button>
                <span style={styles.pageIndicator}>
                  Page {chartPage + 1} of {totalPages}
                </span>
                <button onClick={() => setChartPage((p) => Math.min(p + 1, totalPages - 1))} disabled={chartPage >= totalPages - 1} style={styles.navButton}>
                  Next ▶
                </button>
              </div>
            )}
          </div>

          {/* Pie */}
          <div style={styles.chartCard}>
            <h3>Overall Summary</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={pieData} dataKey="value" innerRadius={60} outerRadius={100} label>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Table */}
          <div style={styles.tableCard}>
            <h3>Detailed Report</h3>
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    {headers.map((h, i) => (
                      <th key={i} style={styles.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visibleRows.map((row, i) => (
                    <tr key={i}>
                      {headers.map((h, j) => (
                        <td key={j} style={styles.td}>{row[h]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filtered.length > 7 && (
              <div style={{ textAlign: "center", marginTop: 15 }}>
                <button style={styles.viewBtn} onClick={() => setShowAllRows(!showAllRows)}>
                  {showAllRows ? "View Less ▲" : "View More ▼"}
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

// 🎨 Styles (layout same, contrast improved)
const styles = {
  container: { marginTop: 30, background: "#fff", borderRadius: 10, padding: 20 },
  title: { textAlign: "center", color: "#202124", marginBottom: 20 },
  filterContainer: { display: "flex", justifyContent: "center", gap: 20, marginBottom: 25, flexWrap: "wrap" },
  filterGroup: { display: "flex", flexDirection: "column" },
  label: { fontWeight: 600, color: "#5F6368" },
  dateInput: { padding: "7px 10px", borderRadius: 6, border: "1px solid #ccc" },
  clearButton: { background: "#EA4335", color: "#fff", border: "none", padding: "10px 20px", borderRadius: 8 },
  chartCard: { background: "#F8F9FA", padding: 20, borderRadius: 10, marginBottom: 30 },
  pagination: { display: "flex", justifyContent: "center", gap: 15, marginTop: 12 },
  navButton: { background: "#4285F4", color: "#fff", border: "none", padding: "8px 16px", borderRadius: 6 },
  pageIndicator: { fontWeight: 600, color: "#5F6368" },
  tableCard: { background: "#FAFAFA", padding: 20, borderRadius: 10 },
  tableWrapper: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { border: "1px solid #E0E0E0", padding: 8, background: "#F8F9FA" },
  td: { border: "1px solid #E0E0E0", padding: 8, textAlign: "center" },
  noData: { textAlign: "center", color: "#777", marginTop: 40 },
  viewBtn: { background: "#4285F4", color: "#fff", padding: "10px 20px", border: "none", borderRadius: 6 },
};

export default VideoReport;
