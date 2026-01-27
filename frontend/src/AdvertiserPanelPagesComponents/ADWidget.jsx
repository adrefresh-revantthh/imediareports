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
//   const INITIAL_ROWS = 7;

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const token = JSON.parse(localStorage.getItem("jwt"))?.token;
//         if (!token) return console.error("No token found");

//         const res = await axios.get("http://localhost:5000/api/getallsheets", {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         const normalize = (n) => n?.trim().toLowerCase().replace(/\s|_/g, "");
//         const allSheets = res.data || [];

//         const adSheet = allSheets.find((s) => {
//           const n = normalize(s.name);
//           return n.includes("adwidget") || n.includes("advertise") || n.includes("widget");
//         });

//         if (!adSheet || !adSheet.data?.length) {
//           console.warn("⚠️ No AdWidget sheet found");
//           return;
//         }

//         const cleaned = adSheet.data.map((item) => {
//           const row = {};
//           for (let k in item) row[k.trim()] = item[k];

//           // Convert Excel serial date → readable format
//           if (!isNaN(row.Date)) {
//             const base = new Date(1899, 11, 30);
//             const jsDate = new Date(base.getTime() + row.Date * 86400000);
//             row.Date = jsDate.toISOString().split("T")[0];
//           }
//           return row;
//         });

//         setData(cleaned);
//         setFilteredData(cleaned);
//       } catch (error) {
//         console.error("❌ Error fetching AdWidget data:", error);
//       }
//     };
//     fetchData();
//   }, []);

//   // ✅ Filter only when both dates are set
//   useEffect(() => {
//     if (!startDate || !endDate) {
//       setFilteredData(data);
//       return;
//     }

//     const start = new Date(startDate);
//     const end = new Date(endDate);

//     const filtered = data.filter((row) => {
//       if (!row.Date) return false;
//       const date = new Date(row.Date);
//       return date >= start && date <= end;
//     });

//     setFilteredData(filtered);
//     setShowAllRows(false);
//   }, [startDate, endDate, data]);

//   const handleClearFilters = () => {
//     setStartDate("");
//     setEndDate("");
//     setFilteredData(data);
//     setShowAllRows(false);
//   };

//   const totalImpressions = filteredData.reduce((a, b) => a + (+b.Impressions || 0), 0);
//   const totalClicks = filteredData.reduce((a, b) => a + (+b.Clicks || 0), 0);
//   const totalSpend = filteredData.reduce((a, b) => a + (+b.Spend || 0), 0);

//   const pieData = [
//     { name: "Impressions", value: totalImpressions },
//     { name: "Clicks", value: totalClicks },
//     { name: "Spend", value: totalSpend },
//   ];

//   const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
//   const rowsToRender = showAllRows ? filteredData : filteredData.slice(0, INITIAL_ROWS);

//   const isFilteredEmpty = startDate && endDate && filteredData.length === 0;
//   const hasData = filteredData && filteredData.length > 0;

//   return (
//     <div style={styles.card}>
//       <h3 style={styles.title}>📊 AdWidget Report</h3>

//       {/* Filter Section */}
//       <div style={styles.filterContainer}>
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
//           style={styles.clearButton}
//           disabled={!startDate && !endDate}
//         >
//           ✖ Clear Filters
//         </button>
//       </div>

//       {/* No Data Found */}
//       {isFilteredEmpty ? (
//         <p style={{ textAlign: "center", color: "#999", marginTop: "20px" }}>
//           ⚠️ No data found in this date range.
//         </p>
//       ) : !hasData ? (
//         <p style={{ textAlign: "center", color: "#999", marginTop: "20px" }}>
//           ⏳ Loading or no AdWidget data available.
//         </p>
//       ) : (
//         <>
//           {/* Chart Section */}
//           <ResponsiveContainer width="100%" height={350}>
//             <ComposedChart data={filteredData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="Date" />
//               <YAxis yAxisId="left" label={{ value: "Impressions/Spend", angle: -90 }} />
//               <YAxis yAxisId="right" orientation="right" label={{ value: "Clicks/CTR", angle: 90 }} />
//               <Tooltip />
//               <Legend />
//               <Bar yAxisId="left" dataKey="Impressions" fill="#0d00ff" barSize={25} />
//               <Bar yAxisId="left" dataKey="Spend" fill="#003a16" barSize={25} />
//               <Line yAxisId="right" type="monotone" dataKey="Clicks" stroke="#9c4600" strokeWidth={2.5} />
//               <Line yAxisId="right" type="monotone" dataKey="CTR" stroke="#f71dff" strokeWidth={2.5} />
//             </ComposedChart>
//           </ResponsiveContainer>

//           {/* Donut Chart */}
//           <ResponsiveContainer width="100%" height={300}>
//             <PieChart>
//               <Pie
//                 data={pieData}
//                 dataKey="value"
//                 nameKey="name"
//                 cx="50%"
//                 cy="50%"
//                 innerRadius={60}
//                 outerRadius={100}
//                 label
//               >
//                 {pieData.map((entry, index) => (
//                   <Cell key={index} fill={COLORS[index % COLORS.length]} />
//                 ))}
//               </Pie>
//               <Tooltip />
//               <Legend />
//             </PieChart>
//           </ResponsiveContainer>

//           {/* Table Section */}
//           <div style={{ marginTop: 30 }}>
//             <div
//               style={{
//                 ...styles.tableContainer,
//                 maxHeight: showAllRows ? "2000px" : "420px",
//               }}
//             >
//               <table style={styles.table}>
//                 <thead>
//                   <tr>
//                     {Object.keys(filteredData[0] || {}).map((head, i) => (
//                       <th key={i} style={styles.th}>
//                         {head}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {rowsToRender.map((row, i) => (
//                     <tr key={i}>
//                       {Object.keys(row || {}).map((key, j) => (
//                         <td key={j} style={styles.td}>
//                           {row[key]}
//                         </td>
//                       ))}
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {/* View More/Less */}
//             {filteredData.length > INITIAL_ROWS && (
//               <div style={{ textAlign: "center", marginTop: 12 }}>
//                 <button
//                   onClick={() => setShowAllRows((s) => !s)}
//                   style={styles.viewMoreBtn}
//                 >
//                   {showAllRows
//                     ? "View less ▴"
//                     : `View more ▾ (${filteredData.length - INITIAL_ROWS} more)`}
//                 </button>
//               </div>
//             )}
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// const styles = {
//   card: {
//     marginTop: "20px",
//     padding: "25px",
//     backgroundColor: "#f8f9fb",
//     borderRadius: "12px",
//     boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
//   },
//   title: {
//     textAlign: "center",
//     color: "#1a1a1a",
//     fontSize: "22px",
//     fontWeight: 600,
//     marginBottom: "20px",
//   },
//   filterContainer: {
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "flex-end",
//     flexWrap: "wrap",
//     gap: "15px",
//     marginBottom: "25px",
//   },
//   filterGroup: {
//     display: "flex",
//     flexDirection: "column",
//   },
//   label: {
//     fontWeight: "600",
//     color: "#333",
//     marginBottom: "6px",
//   },
//   dateInput: {
//     padding: "8px 10px",
//     borderRadius: "6px",
//     border: "1px solid #ccc",
//     fontSize: "14px",
//     outline: "none",
//     transition: "all 0.3s ease",
//   },
//   clearButton: {
//     padding: "9px 16px",
//     borderRadius: "8px",
//     border: "none",
//     background: "linear-gradient(90deg, #e74c3c, #c0392b)",
//     color: "#fff",
//     fontWeight: "600",
//     cursor: "pointer",
//     transition: "0.3s",
//   },
//   viewMoreBtn: {
//     padding: "9px 16px",
//     borderRadius: 8,
//     border: "none",
//     background: "linear-gradient(90deg, #0066ff, #00bfff)",
//     color: "#fff",
//     cursor: "pointer",
//     fontWeight: 600,
//     transition: "0.3s",
//   },
//   tableContainer: {
//     overflow: "hidden",
//     transition: "max-height 400ms ease",
//     borderRadius: 6,
//     border: "1px solid #e6e6e6",
//     background: "#fff",
//   },
//   table: {
//     borderCollapse: "collapse",
//     width: "100%",
//     textAlign: "left",
//   },
//   th: {
//     border: "1px solid #ddd",
//     padding: "8px",
//     backgroundColor: "#ececec",
//     textAlign: "center",
//   },
//   td: {
//     border: "1px solid #ddd",
//     padding: "8px",
//     textAlign: "center",
//   },
// };

// export default AdWidget;

