

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   ComposedChart,
//   Bar,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Legend,
//   CartesianGrid,
//   ResponsiveContainer,
// } from "recharts";

// const OttReport = () => {
//   const [data, setData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [totals, setTotals] = useState({
//     spend: 0,
//     impressions: 0,
//     clicks: 0,
//     ctr: 0,
//   });
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [showAllRows, setShowAllRows] = useState(false);
//   const [chartPage, setChartPage] = useState(0);

//   const CHART_PAGE_SIZE = 10;

//   const cleanNumber = (val) => {
//     if (!val) return 0;
//     const num = parseFloat(String(val).replace(/[^0-9.-]+/g, ""));
//     return isNaN(num) ? 0 : num;
//   };

//   const calculateTotals = (rows) => {
//     const spend = rows.reduce((a, b) => a + (b.spend || 0), 0);
//     const impressions = rows.reduce((a, b) => a + (b.impressions || 0), 0);
//     const clicks = rows.reduce((a, b) => a + (b.clicks || 0), 0);
//     const ctr = impressions ? ((clicks / impressions) * 100).toFixed(2) : 0;
//     setTotals({ spend, impressions, clicks, ctr });
//   };

//   const fetchData = async () => {
//     try {
//       const tokenData = JSON.parse(localStorage.getItem("jwt"));
//       const userToken = tokenData?.token;
//       if (!userToken) {
//         console.error("No token found in localStorage");
//         return;
//       }

//       const res = await axios.get("http://localhost:5000/api/getallsheets", {
//         headers: { Authorization: `Bearer ${userToken}` },
//       });

//       const allSheets = res.data || [];
//       const normalize = (name) =>
//         name?.trim().toLowerCase().replace(/\s|_/g, "");

//       const ottSheet = allSheets.find((s) => {
//         const n = normalize(s.name);
//         return n.includes("ottreport") || n.includes("ott");
//       });

//       if (!ottSheet || !ottSheet.data || ottSheet.data.length === 0) {
//         console.warn("⚠️ No sheet data found for OTTReport");
//         setData([]);
//         return;
//       }

//       const formatted = ottSheet.data.map((r) => {
//         const clean = {};
//         for (let key in r) clean[key.trim()] = r[key];

//         return {
//           date: clean["Date"] || clean["date"] || "",
//           spend: cleanNumber(clean["Spend"] || clean["spend"]),
//           impressions: cleanNumber(clean["Impressions"] || clean["impressions"]),
//           clicks: cleanNumber(clean["Clicks"] || clean["clicks"]),
//           ctr: cleanNumber(clean["CTR"] || clean["ctr"]),
//         };
//       });

//       setData(formatted);
//       setFilteredData(formatted);
//       calculateTotals(formatted);
//     } catch (error) {
//       console.error("❌ Error fetching OTT data:", error);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   // ✅ Date Filtering Logic
//   useEffect(() => {
//     if (!startDate || !endDate) {
//       setFilteredData(data);
//       calculateTotals(data);
//       return;
//     }

//     const start = new Date(startDate);
//     const end = new Date(endDate);

//     const filtered = data.filter((row) => {
//       if (!row.date) return false;
//       const rowDate = new Date(row.date);
//       return rowDate >= start && rowDate <= end;
//     });

//     setFilteredData(filtered);
//     calculateTotals(filtered);
//     setChartPage(0);
//   }, [startDate, endDate, data]);

//   // ✅ Clear Filters
//   const handleClearFilters = () => {
//     setStartDate("");
//     setEndDate("");
//     setFilteredData(data);
//     calculateTotals(data);
//     setChartPage(0);
//   };

//   const isFilteredEmpty = startDate && endDate && filteredData.length === 0;

//   // ✅ Pagination for chart
//   const totalPages = Math.ceil(filteredData.length / CHART_PAGE_SIZE);
//   const currentChunk = filteredData.slice(
//     chartPage * CHART_PAGE_SIZE,
//     chartPage * CHART_PAGE_SIZE + CHART_PAGE_SIZE
//   );

//   // ✅ Table rows (show first 7 initially)
//   const visibleRows = showAllRows ? filteredData : filteredData.slice(0, 7);
//   const headers = filteredData.length > 0 ? Object.keys(filteredData[0]) : [];

//   return (
//     <div
//       style={{
//         padding: 30,
//         // fontFamily: "Segoe UI",
//         background: "#f9fafc",
//         minHeight: "100vh",
//       }}
//     >
//       <h2 style={{ textAlign: "center", marginBottom: 20, color: "#023e8a" }}>
//         📺 OTT Daily Performance
//       </h2>

//       {/* ✅ Filter Section */}
//       <div style={styles.filterRow}>
//         <div style={styles.filterGroup}>
//           <label style={styles.label}>Start Date</label>
//           <input
//             type="date"
//             value={startDate}
//             onChange={(e) => setStartDate(e.target.value)}
//             style={styles.dateInput}
//           />
//         </div>

//         <div style={styles.filterGroup}>
//           <label style={styles.label}>End Date</label>
//           <input
//             type="date"
//             value={endDate}
//             onChange={(e) => setEndDate(e.target.value)}
//             style={styles.dateInput}
//           />
//         </div>

//         <button
//           onClick={handleClearFilters}
//           disabled={!startDate && !endDate}
//           style={{
//             ...styles.clearButton,
//             opacity: !startDate && !endDate ? 0.6 : 1,
//             cursor: !startDate && !endDate ? "not-allowed" : "pointer",
//           }}
//         >
//           ✖ Clear Filters
//         </button>
//       </div>

//       {/* KPI Cards */}
//       {filteredData.length > 0 && !isFilteredEmpty && (
//         <div style={styles.cardGrid}>
//           {[
//             { label: "Total Spend", value: `$${totals.spend.toFixed(2)}` },
//             {
//               label: "Total Impressions",
//               value: totals.impressions.toLocaleString(),
//             },
//             { label: "Total Clicks", value: totals.clicks.toLocaleString() },
//             { label: "CTR", value: `${totals.ctr}%` },
//           ].map((item, i) => (
//             <div key={i} style={styles.kpiCard}>
//               <div style={{ fontSize: 13, color: "#555" }}>{item.label}</div>
//               <div style={{ fontSize: 20, fontWeight: "bold", color: "#023e8a" }}>
//                 {item.value}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Chart Section */}
//       {isFilteredEmpty ? (
//         <p style={{ textAlign: "center", color: "#888", marginTop: 50 }}>
//           ⚠️ No data found in this date range.
//         </p>
//       ) : filteredData.length > 0 ? (
//         <>
//           <div style={styles.chartBox}>
//             <h4 style={{ marginBottom: 20 }}>📈 Spend (Bar) vs Clicks (Line)</h4>
//             <ResponsiveContainer width="100%" height={400}>
//               <ComposedChart data={currentChunk}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis
//                   dataKey="date"
//                   tick={{ fontSize: 11, fill: "#444" }}
//                   angle={-25}
//                   textAnchor="end"
//                   interval={0}
//                 />
//                 <YAxis
//                   yAxisId="left"
//                   label={{
//                     value: "Spend ($)",
//                     angle: -90,
//                     position: "insideLeft",
//                   }}
//                 />
//                 <YAxis
//                   yAxisId="right"
//                   orientation="right"
//                   label={{
//                     value: "Clicks",
//                     angle: 90,
//                     position: "insideRight",
//                   }}
//                 />
//                 <Tooltip />
//                 <Legend />
//                 <Bar
//                   yAxisId="left"
//                   dataKey="spend"
//                   fill="#f50808ff"
//                   barSize={20}
//                   radius={[6, 6, 0, 0]}
//                 />
//                 <Line
//                   yAxisId="right"
//                   type="monotone"
//                   dataKey="clicks"
//                   stroke="  #007bff" // blue
   
//                   strokeWidth={2.5}
//                   dot={false}
//                 />
//               </ComposedChart>
//             </ResponsiveContainer>

//             {/* Pagination Controls */}
//             {filteredData.length > CHART_PAGE_SIZE && (
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
//                   onClick={() =>
//                     setChartPage((p) => Math.min(p + 1, totalPages - 1))
//                   }
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

//           {/* ✅ Detailed Table Section */}
//           <div style={styles.tableCard}>
//             <h3>📋 Detailed OTT Report</h3>
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

//             {/* ✅ View More / Less */}
//             {filteredData.length > 7 && (
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
//       ) : (
//         <p style={{ textAlign: "center", color: "#888", marginTop: 50 }}>
//           ⚠️ No OTT data available from backend.
//         </p>
//       )}
//     </div>
//   );
// };

// // ✅ UI Styles
// const styles = {
//   filterRow: {
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "flex-end",
//     flexWrap: "wrap",
//     gap: "20px",
//     marginBottom: "30px",
//   },
//   filterGroup: { display: "flex", flexDirection: "column" },
//   label: { fontWeight: "600", color: "#333", marginBottom: "6px" },
//   dateInput: {
//     padding: "8px 10px",
//     borderRadius: "6px",
//     border: "1px solid #ccc",
//     fontSize: "14px",
//     outline: "none",
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
//   cardGrid: {
//     display: "flex",
//     flexWrap: "wrap",
//     justifyContent: "center",
//     gap: 20,
//     marginBottom: 40,
//   },
//   kpiCard: {
//     background: "white",
//     padding: "16px 20px",
//     borderRadius: 10,
//     minWidth: 180,
//     textAlign: "center",
//     boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
//   },
//   chartBox: {
//     background: "white",
//     borderRadius: 10,
//     padding: 20,
//     boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//     marginBottom: "30px",
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
//     boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
//   },
//   tableWrapper: { overflowX: "auto" },
//   table: { width: "100%", borderCollapse: "collapse" },
//   th: {
//     border: "1px solid #ddd",
//     padding: "8px",
//     background: "#e9f5ff",
//     textAlign: "center",
//   },
//   td: {
//     border: "1px solid #ddd",
//     padding: "8px",
//     textAlign: "center",
//   },
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

// export default OttReport;
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const OttReport = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [totals, setTotals] = useState({
    spend: 0,
    impressions: 0,
    clicks: 0,
    ctr: 0,
  });
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showAllRows, setShowAllRows] = useState(false);
  const [chartPage, setChartPage] = useState(0);

  const CHART_PAGE_SIZE = 10;

  const cleanNumber = (val) => {
    if (!val) return 0;
    const num = parseFloat(String(val).replace(/[^0-9.-]+/g, ""));
    return isNaN(num) ? 0 : num;
  };

  const calculateTotals = (rows) => {
    const spend = rows.reduce((a, b) => a + (b.spend || 0), 0);
    const impressions = rows.reduce((a, b) => a + (b.impressions || 0), 0);
    const clicks = rows.reduce((a, b) => a + (b.clicks || 0), 0);
    const ctr = impressions ? ((clicks / impressions) * 100).toFixed(2) : 0;
    setTotals({ spend, impressions, clicks, ctr });
  };

  const fetchData = async () => {
    try {
      const tokenData = JSON.parse(localStorage.getItem("jwt"));
      const userToken = tokenData?.token;
      if (!userToken) return;

      const res = await axios.get("http://localhost:5000/api/getallsheets", {
        headers: { Authorization: `Bearer ${userToken}` },
      });

      const allSheets = res.data || [];
      const normalize = (name) =>
        name?.trim().toLowerCase().replace(/\s|_/g, "");

      const ottSheet = allSheets.find((s) =>
        normalize(s.name).includes("ott")
      );

      if (!ottSheet?.data?.length) {
        setData([]);
        return;
      }

      const formatted = ottSheet.data.map((r) => {
        const clean = {};
        for (let key in r) clean[key.trim()] = r[key];

        return {
          date: clean["Date"] || clean["date"] || "",
          spend: cleanNumber(clean["Spend"] || clean["spend"]),
          impressions: cleanNumber(
            clean["Impressions"] || clean["impressions"]
          ),
          clicks: cleanNumber(clean["Clicks"] || clean["clicks"]),
          ctr: cleanNumber(clean["CTR"] || clean["ctr"]),
        };
      });

      setData(formatted);
      setFilteredData(formatted);
      calculateTotals(formatted);
    } catch (error) {
      console.error("❌ Error fetching OTT data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!startDate || !endDate) {
      setFilteredData(data);
      calculateTotals(data);
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    const filtered = data.filter((row) => {
      if (!row.date) return false;
      const rowDate = new Date(row.date);
      return rowDate >= start && rowDate <= end;
    });

    setFilteredData(filtered);
    calculateTotals(filtered);
    setChartPage(0);
  }, [startDate, endDate, data]);

  const handleClearFilters = () => {
    setStartDate("");
    setEndDate("");
    setFilteredData(data);
    calculateTotals(data);
    setChartPage(0);
  };

  const isFilteredEmpty = startDate && endDate && filteredData.length === 0;

  const totalPages = Math.ceil(filteredData.length / CHART_PAGE_SIZE);
  const currentChunk = filteredData.slice(
    chartPage * CHART_PAGE_SIZE,
    chartPage * CHART_PAGE_SIZE + CHART_PAGE_SIZE
  );

  const visibleRows = showAllRows ? filteredData : filteredData.slice(0, 7);
  const headers = filteredData.length > 0 ? Object.keys(filteredData[0]) : [];

  const kpiColors = {
    "Total Spend": "#4285F4",
    "Total Impressions": "#34A853",
    "Total Clicks": "#EA4335",
    CTR: "#FBBC05",
  };

  return (
    <div style={{ padding: 30, background: "#f9fafc", minHeight: "100vh" }}>
      <h2 style={{ textAlign: "center", marginBottom: 20, color: "#202124" }}>
        📺 OTT Daily Performance
      </h2>

      {/* Filters */}
      <div style={styles.filterRow}>
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

      {/* KPI Cards */}
      {filteredData.length > 0 && !isFilteredEmpty && (
        <div style={styles.cardGrid}>
          {[
            { label: "Total Spend", value: `$${totals.spend.toFixed(2)}` },
            { label: "Total Impressions", value: totals.impressions.toLocaleString() },
            { label: "Total Clicks", value: totals.clicks.toLocaleString() },
            { label: "CTR", value: `${totals.ctr}%` },
          ].map((item, i) => (
            <div key={i} style={{ ...styles.kpiCard, borderLeft: `5px solid ${kpiColors[item.label]}` }}>
              <div style={{ fontSize: 13, color: "#5f6368" }}>{item.label}</div>
              <div style={{ fontSize: 20, fontWeight: "bold", color: kpiColors[item.label] }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Chart */}
      {!isFilteredEmpty && filteredData.length > 0 && (
        <div style={styles.chartBox}>
          <h4 style={{ marginBottom: 20, color: "#202124" }}>📈 Spend vs Clicks</h4>
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={currentChunk}>
              <CartesianGrid stroke="#E0E0E0" strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fill: "#5f6368", fontSize: 11 }} angle={0} textAnchor="end" interval={0} />
              <YAxis yAxisId="left" tick={{ fill: "#5f6368" }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: "#5f6368" }} />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="spend" fill="#4285F4" barSize={20} radius={[6, 6, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="clicks" stroke="#EA4335" strokeWidth={3} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

const styles = {
  filterRow: { display: "flex", justifyContent: "center", gap: 20, marginBottom: 30 },
  filterGroup: { display: "flex", flexDirection: "column" },
  label: { fontWeight: 600, color: "#5f6368" },
  dateInput: { padding: "8px 10px", borderRadius: 6, border: "1px solid #ccc" },
  clearButton: { padding: "10px 20px", borderRadius: 8, border: "none", background: "#EA4335", color: "#fff" },
  cardGrid: { display: "flex", justifyContent: "center", gap: 20, marginBottom: 40 },
  kpiCard: { background: "#fff", padding: 16, borderRadius: 10, minWidth: 180, textAlign: "center" },
  chartBox: { background: "#fff", borderRadius: 10, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" },
};

export default OttReport;
