
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
//   Line,
// } from "recharts";
// // import PublisherProfileCard from "./PublisherDetails";

// const COLORS = ["#007bff", "#ff4d4f"]; // blue + red theme

// const Dashboard = () => {
//   const [performanceData, setPerformanceData] = useState([]);
//   const [totals, setTotals] = useState({
//     views: 0,
//     clicks: 0,
//     revenue: 0,
//   });

//   const styles = {
//     dashboardGrid: {
//       display: "flex",
//       flexDirection: "column",
//       gap: "20px",
//       padding: "20px",
//       backgroundColor: "#f9fafb",
//       // fontFamily: "Segoe UI, sans-serif",
//       minHeight: "100vh",
//     },
//     card: {
//       backgroundColor: "#fff",
//       borderRadius: "12px",
//       boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
//       padding: "20px",
//       flex: 1,
//     },
//     chartRow: { display: "flex", gap: "20px", flexWrap: "wrap" },
//     table: { width: "100%", borderCollapse: "collapse", marginTop: "10px" },
//     th: {
//       borderBottom: "2px solid #ddd",
//       textAlign: "left",
//       padding: "10px",
//       backgroundColor: "#f4f4f4",
//       fontWeight: "bold",
//     },
//     td: { borderBottom: "1px solid #eee", padding: "10px", textAlign: "left" },
//     heading: {
//       marginBottom: "10px",
//       color: "#333",
//       fontSize: "18px",
//       fontWeight: 600,
//     },
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const storedPublisher = JSON.parse(localStorage.getItem("jwt")).user.name
//         if (!storedPublisher) {
//           console.warn("⚠️ No publisher name found in localStorage");
//           return;
//         }

//         const res = await axios.get("https://imediareports.onrender.com/api/getalldata");
//         const allSheets = [
//           ...(res.data?.sheets || []),
//           ...(res.data?.genealogySheets || []),
//         ];

//         // ✅ Filter by publisher name
//         const filteredSheets = allSheets.filter(
//           (sheet) =>
//             sheet.publisher &&
//             sheet.publisher.toLowerCase() === storedPublisher.toLowerCase()
//         );

//         if (filteredSheets.length === 0) {
//           console.warn("⚠️ No data found for publisher:", storedPublisher);
//           setPerformanceData([]);
//           return;
//         }

//         const publisherMap = {};

//         filteredSheets.forEach((sheet) => {
//           const advertiser = sheet.advertiser || "Unknown Advertiser";
//           const key = advertiser;

//           if (!publisherMap[key]) {
//             publisherMap[key] = {
//               advertiser,
//               totalViews: 0,
//               totalClicks: 0,
//               totalRevenue: 0,
//             };
//           }

//           (sheet.data || []).forEach((row) => {
//             if (typeof row !== "object" || row === null) return;

//             const e = {};
//             Object.keys(row).forEach((k) => (e[k.trim().toLowerCase()] = row[k]));

//             const impressions =
//               parseFloat(e.impressions) ||
//               parseFloat(e["impression"]) ||
//               0;
//             const clicks =
//               parseFloat(e.clicks) ||
//               parseFloat(e["click"]) ||
//               0;
//             const cpm =
//               parseFloat(e.cpm) ||
//               parseFloat(e["cost per mille"]) ||
//               0;
//             const cpc = parseFloat(e.cpc) || 0;

//             if (impressions > 0) publisherMap[key].totalViews += impressions;
//             if (clicks > 0) publisherMap[key].totalClicks += clicks;

//             let rev = 0;
//             if (cpc > 0 && clicks > 0) rev = clicks * cpc;
//             else if (cpm > 0 && impressions > 0)
//               rev = (impressions / 1000) * cpm;
//             else rev = (impressions / 1000) * 1.5;

//             publisherMap[key].totalRevenue += rev;
//           });
//         });

//         const formatted = Object.values(publisherMap).map((pub) => ({
//           advertiser: pub.advertiser,
//           totalViews: pub.totalViews,
//           totalClicks: pub.totalClicks,
//           ctrPercent: pub.totalViews
//             ? ((pub.totalClicks / pub.totalViews) * 100).toFixed(2)
//             : "0.00",
//           totalRevenue: Number(pub.totalRevenue.toFixed(2)),
//         }));

//         // ✅ Calculate totals
//         const totalViews = formatted.reduce((sum, d) => sum + d.totalViews, 0);
//         const totalClicks = formatted.reduce(
//           (sum, d) => sum + d.totalClicks,
//           0
//         );
//         const totalRevenue = formatted.reduce(
//           (sum, d) => sum + d.totalRevenue,
//           0
//         );

//         setPerformanceData(formatted);
//         setTotals({
//           views: totalViews,
//           clicks: totalClicks,
//           revenue: totalRevenue.toFixed(2),
//         });
//       } catch (err) {
//         console.error("Error fetching data:", err);
//       }
//     };

//     fetchData();
//   }, []);

//   return (
//     <div style={styles.dashboardGrid}>
     
//       <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
//         📊 {localStorage.getItem("publisherName") || "Publisher"} Dashboard
//       </h2>

//       {/* ===== Summary Cards ===== */}
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "center",
//           gap: "20px",
//           marginBottom: "25px",
//           flexWrap: "wrap",
//         }}
//       >
//         <div style={summaryCard}>
//           <h4>Total Views</h4>
//           <p style={{ color: "#007bff" }}>{totals.views.toLocaleString()}</p>
//         </div>
//         <div style={summaryCard}>
//           <h4>Total Clicks</h4>
//           <p style={{ color: "#ff4d4f" }}>{totals.clicks.toLocaleString()}</p>
//         </div>
//         <div style={summaryCard}>
//           <h4>Total Revenue</h4>
//           <p style={{ color: "#007bff" }}>${totals.revenue}</p>
//         </div>
//       </div>

//       {/* ===== Table ===== */}
//       <div style={styles.card}>
//         <h3 style={styles.heading}>🎯 Performance by Advertiser</h3>
//         <table style={styles.table}>
//           <thead>
//             <tr>
//               <th style={styles.th}>Advertiser</th>
//               <th style={styles.th}>Views</th>
//               <th style={styles.th}>Clicks</th>
//               <th style={styles.th}>CTR (%)</th>
//               <th style={styles.th}>Revenue ($)</th>
//             </tr>
//           </thead>
//           <tbody>
//             {performanceData.map((row, i) => (
//               <tr key={i}>
//                 <td style={styles.td}>{row.advertiser}</td>
//                 <td style={styles.td}>{row.totalViews.toLocaleString()}</td>
//                 <td style={styles.td}>{row.totalClicks}</td>
//                 <td style={styles.td}>{row.ctrPercent}</td>
//                 <td style={styles.td}>${row.totalRevenue}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* ===== Charts ===== */}
//       <div style={styles.chartRow}>
//         {/* PIE */}
//         <div style={styles.card}>
//           <h3 style={styles.heading}>💰 Revenue Share</h3>
//           <ResponsiveContainer width="100%" height={300}>
//             <PieChart>
//               <Pie
//                 data={performanceData}
//                 dataKey="totalRevenue"
//                 nameKey="advertiser"
//                 cx="50%"
//                 cy="50%"
//                 outerRadius={100}
//                 label={(d) =>
//                   `${d.advertiser.slice(0, 8)}: $${d.totalRevenue}`
//                 }
//               >
//                 {performanceData.map((_, idx) => (
//                   <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
//                 ))}
//               </Pie>
//               <Legend verticalAlign="bottom" />
//               <Tooltip />
//             </PieChart>
//           </ResponsiveContainer>
//         </div>

//         {/* BAR + LINE */}
//         <div style={styles.card}>
//           <h3 style={styles.heading}>📈 Views vs Clicks</h3>
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={performanceData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis
//                 dataKey="advertiser"
//                 tickFormatter={(v) => v.slice(0, 8) + "..."}
//               />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Bar dataKey="totalViews" fill="#007bff" name="Views" />
//               <Line
//                 type="monotone"
//                 dataKey="totalClicks"
//                 stroke="#ff4d4f"
//                 strokeWidth={3}
//                 name="Clicks"
//               />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ✅ Reusable Summary Card Style
// const summaryCard = {
//   backgroundColor: "#fff",
//   borderRadius: "12px",
//   padding: "15px 25px",
//   boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
//   textAlign: "center",
//   minWidth: "200px",
// };

// export default Dashboard;
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
//   Line,
// } from "recharts";

// const COLORS = ["#007bff", "#ff4d4f"]; // blue + red theme

// const Dashboard = () => {
//   const [performanceData, setPerformanceData] = useState([]);
//   const [totals, setTotals] = useState({
//     views: 0,
//     clicks: 0,
//     revenue: 0,
//   });

//   const styles = {
//     dashboardGrid: {
//       display: "flex",
//       flexDirection: "column",
//       gap: "20px",
//       padding: "24px",
//       backgroundColor: "#f9fafb",
//       minHeight: "100vh",
//       fontSize: "18px", // ✅ base font
//     },
//     card: {
//       backgroundColor: "#fff",
//       borderRadius: "12px",
//       boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
//       padding: "24px",
//       flex: 1,
//     },
//     chartRow: { display: "flex", gap: "24px", flexWrap: "wrap" },
//     table: { width: "100%", borderCollapse: "collapse", marginTop: "14px" },
//     th: {
//       borderBottom: "2px solid #ddd",
//       textAlign: "left",
//       padding: "12px",
//       backgroundColor: "#f4f4f4",
//       fontWeight: "700",
//       fontSize: "20px", // ✅
//     },
//     td: {
//       borderBottom: "1px solid #eee",
//       padding: "12px",
//       textAlign: "left",
//       fontSize: "18px", // ✅
//     },
//     heading: {
//       marginBottom: "12px",
//       color: "#333",
//       fontSize: "26px", // ✅
//       fontWeight: 700,
//     },
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const storedPublisher = JSON.parse(localStorage.getItem("jwt")).user.name;
//         if (!storedPublisher) return;

//         const res = await axios.get(
//           "https://imediareports.onrender.com/api/getalldata"
//         );

//         const allSheets = [
//           ...(res.data?.sheets || []),
//           ...(res.data?.genealogySheets || []),
//         ];

//         const filteredSheets = allSheets.filter(
//           (sheet) =>
//             sheet.publisher &&
//             sheet.publisher.toLowerCase() === storedPublisher.toLowerCase()
//         );

//         const publisherMap = {};

//         filteredSheets.forEach((sheet) => {
//           const advertiser = sheet.advertiser || "Unknown Advertiser";
//           const key = advertiser;

//           if (!publisherMap[key]) {
//             publisherMap[key] = {
//               advertiser,
//               totalViews: 0,
//               totalClicks: 0,
//               totalRevenue: 0,
//             };
//           }

//           (sheet.data || []).forEach((row) => {
//             if (typeof row !== "object" || row === null) return;

//             const e = {};
//             Object.keys(row).forEach((k) => (e[k.trim().toLowerCase()] = row[k]));

//             const impressions = parseFloat(e.impressions) || 0;
//             const clicks = parseFloat(e.clicks) || 0;
//             const cpm = parseFloat(e.cpm) || 0;
//             const cpc = parseFloat(e.cpc) || 0;

//             publisherMap[key].totalViews += impressions;
//             publisherMap[key].totalClicks += clicks;

//             let rev = 0;
//             if (cpc > 0 && clicks > 0) rev = clicks * cpc;
//             else if (cpm > 0 && impressions > 0)
//               rev = (impressions / 1000) * cpm;
//             else rev = (impressions / 1000) * 1.5;

//             publisherMap[key].totalRevenue += rev;
//           });
//         });

//         const formatted = Object.values(publisherMap).map((pub) => ({
//           advertiser: pub.advertiser,
//           totalViews: pub.totalViews,
//           totalClicks: pub.totalClicks,
//           ctrPercent: pub.totalViews
//             ? ((pub.totalClicks / pub.totalViews) * 100).toFixed(2)
//             : "0.00",
//           totalRevenue: Number(pub.totalRevenue.toFixed(2)),
//         }));

//         setPerformanceData(formatted);

//         setTotals({
//           views: formatted.reduce((a, b) => a + b.totalViews, 0),
//           clicks: formatted.reduce((a, b) => a + b.totalClicks, 0),
//           revenue: formatted
//             .reduce((a, b) => a + b.totalRevenue, 0)
//             .toFixed(2),
//         });
//       } catch (err) {
//         console.error("Error fetching data:", err);
//       }
//     };

//     fetchData();
//   }, []);

//   return (
//     <div style={styles.dashboardGrid}>
//       <h2
//         style={{
//           textAlign: "center",
//           marginBottom: "24px",
//           fontSize: "32px", // ✅
//           fontWeight: 700,
//         }}
//       >
//         📊 Publisher Dashboard
//       </h2>

//       {/* SUMMARY */}
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "center",
//           gap: "24px",
//           marginBottom: "30px",
//           flexWrap: "wrap",
//         }}
//       >
//         <div style={summaryCard}>
//           <h4 style={{ fontSize: "22px", fontWeight: 600 }}>Total Views</h4>
//           <p style={{ fontSize: "28px", fontWeight: 700, color: "#007bff" }}>
//             {totals.views.toLocaleString()}
//           </p>
//         </div>

//         <div style={summaryCard}>
//           <h4 style={{ fontSize: "22px", fontWeight: 600 }}>Total Clicks</h4>
//           <p style={{ fontSize: "28px", fontWeight: 700, color: "#ff4d4f" }}>
//             {totals.clicks.toLocaleString()}
//           </p>
//         </div>

//         <div style={summaryCard}>
//           <h4 style={{ fontSize: "22px", fontWeight: 600 }}>Total Revenue</h4>
//           <p style={{ fontSize: "28px", fontWeight: 700, color: "#007bff" }}>
//             ${totals.revenue}
//           </p>
//         </div>
//       </div>

//       {/* TABLE */}
//       <div style={styles.card}>
//         <h3 style={styles.heading}>🎯 Performance by Advertiser</h3>
//         <table style={styles.table}>
//           <thead>
//             <tr>
//               <th style={styles.th}>Advertiser</th>
//               <th style={styles.th}>Views</th>
//               <th style={styles.th}>Clicks</th>
//               <th style={styles.th}>CTR (%)</th>
//               <th style={styles.th}>Revenue ($)</th>
//             </tr>
//           </thead>
//           <tbody>
//             {performanceData.map((row, i) => (
//               <tr key={i}>
//                 <td style={styles.td}>{row.advertiser}</td>
//                 <td style={styles.td}>{row.totalViews.toLocaleString()}</td>
//                 <td style={styles.td}>{row.totalClicks}</td>
//                 <td style={styles.td}>{row.ctrPercent}</td>
//                 <td style={styles.td}>${row.totalRevenue}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* CHARTS */}
//       <div style={styles.chartRow}>
//         <div style={styles.card}>
//           <h3 style={styles.heading}>💰 Revenue Share</h3>
//           <ResponsiveContainer width="100%" height={320}>
//             <PieChart>
//               <Pie
//                 data={performanceData}
//                 dataKey="totalRevenue"
//                 nameKey="advertiser"
//                 cx="50%"
//                 cy="50%"
//                 outerRadius={110}
//                 labelStyle={{ fontSize: 16 }} // ✅
//               >
//                 {performanceData.map((_, idx) => (
//                   <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
//                 ))}
//               </Pie>
//               <Legend wrapperStyle={{ fontSize: 16 }} />
//               <Tooltip contentStyle={{ fontSize: 16 }} />
//             </PieChart>
//           </ResponsiveContainer>
//         </div>

//         <div style={styles.card}>
//           <h3 style={styles.heading}>📈 Views vs Clicks</h3>
//           <ResponsiveContainer width="100%" height={320}>
//             <BarChart data={performanceData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="advertiser" tick={{ fontSize: 16 }} />
//               <YAxis tick={{ fontSize: 16 }} />
//               <Tooltip contentStyle={{ fontSize: 16 }} />
//               <Legend wrapperStyle={{ fontSize: 16 }} />
//               <Bar dataKey="totalViews" fill="#007bff" name="Views" />
//               <Line
//                 type="monotone"
//                 dataKey="totalClicks"
//                 stroke="#ff4d4f"
//                 strokeWidth={3}
//                 name="Clicks"
//               />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </div>
//     </div>
//   );
// };

// // SUMMARY CARD STYLE (FONT SIZE ONLY)
// const summaryCard = {
//   backgroundColor: "#fff",
//   borderRadius: "12px",
//   padding: "18px 28px",
//   boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
//   textAlign: "center",
//   minWidth: "220px",
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
  Line,
} from "recharts";

const COLORS = ["#007bff", "#ff4d4f"]; // blue + red theme

const Dashboard = () => {
  const [performanceData, setPerformanceData] = useState([]);
  const [totals, setTotals] = useState({
    views: 0,
    clicks: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true); // ✅ ADDED

  const styles = {
    dashboardGrid: {
      display: "flex",
      flexDirection: "column",
      gap: "20px",
      padding: "24px",
      backgroundColor: "#f9fafb",
      minHeight: "100vh",
      fontSize: "18px",
    },
    card: {
      backgroundColor: "#fff",
      borderRadius: "12px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
      padding: "24px",
      flex: 1,
    },
    chartRow: { display: "flex", gap: "24px", flexWrap: "wrap" },
    table: { width: "100%", borderCollapse: "collapse", marginTop: "14px" },
    th: {
      borderBottom: "2px solid #ddd",
      textAlign: "left",
      padding: "12px",
      backgroundColor: "#f4f4f4",
      fontWeight: "700",
      fontSize: "20px",
    },
    td: {
      borderBottom: "1px solid #eee",
      padding: "12px",
      textAlign: "left",
      fontSize: "28px",
    },
    heading: {
      marginBottom: "12px",
      color: "#333",
      fontSize: "26px",
      fontWeight: 700,
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // ✅ ADDED

        const storedPublisher = JSON.parse(localStorage.getItem("jwt")).user.name;
        if (!storedPublisher) return;

        const res = await axios.get(
          "https://imediareports.onrender.com/api/getalldata"
        );

        const allSheets = [
          ...(res.data?.sheets || []),
          ...(res.data?.genealogySheets || []),
        ];

        const filteredSheets = allSheets.filter(
          (sheet) =>
            sheet.publisher &&
            sheet.publisher.toLowerCase() === storedPublisher.toLowerCase()
        );

        const publisherMap = {};

        filteredSheets.forEach((sheet) => {
          const advertiser = sheet.advertiser || "Unknown Advertiser";
          if (!publisherMap[advertiser]) {
            publisherMap[advertiser] = {
              advertiser,
              totalViews: 0,
              totalClicks: 0,
              totalRevenue: 0,
            };
          }

          (sheet.data || []).forEach((row) => {
            if (!row || typeof row !== "object") return;

            const e = {};
            Object.keys(row).forEach((k) => (e[k.trim().toLowerCase()] = row[k]));

            const impressions = parseFloat(e.impressions) || 0;
            const clicks = parseFloat(e.clicks) || 0;
            const cpm = parseFloat(e.cpm) || 0;
            const cpc = parseFloat(e.cpc) || 0;

            publisherMap[advertiser].totalViews += impressions;
            publisherMap[advertiser].totalClicks += clicks;

            let rev = 0;
            if (cpc > 0 && clicks > 0) rev = clicks * cpc;
            else if (cpm > 0 && impressions > 0)
              rev = (impressions / 1000) * cpm;
            else rev = (impressions / 1000) * 1.5;

            publisherMap[advertiser].totalRevenue += rev;
          });
        });

        const formatted = Object.values(publisherMap).map((pub) => ({
          advertiser: pub.advertiser,
          totalViews: pub.totalViews,
          totalClicks: pub.totalClicks,
          ctrPercent: pub.totalViews
            ? ((pub.totalClicks / pub.totalViews) * 100).toFixed(2)
            : "0.00",
          totalRevenue: Number(pub.totalRevenue.toFixed(2)),
        }));

        setPerformanceData(formatted);

        setTotals({
          views: formatted.reduce((a, b) => a + b.totalViews, 0),
          clicks: formatted.reduce((a, b) => a + b.totalClicks, 0),
          revenue: formatted
            .reduce((a, b) => a + b.totalRevenue, 0)
            .toFixed(2),
        });
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false); // ✅ ADDED
      }
    };

    fetchData();
  }, []);

  return (
    <div style={styles.dashboardGrid}>
      <h2
        style={{
          textAlign: "center",
          marginBottom: "24px",
          fontSize: "32px",
          fontWeight: 700,
        }}
      >
        📊 Publisher Dashboard
      </h2>

      {/* ===== SUMMARY ===== */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "24px",
          marginBottom: "30px",
          flexWrap: "wrap",
        }}
      >
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} style={skeletonSummary} />
            ))
          : (
            <>
              <div style={summaryCard}>
                <h4>Total Views</h4>
                <p style={{ color: "#007bff" }}>
                  {totals.views.toLocaleString()}
                </p>
              </div>
              <div style={summaryCard}>
                <h4>Total Clicks</h4>
                <p style={{ color: "#ff4d4f" }}>
                  {totals.clicks.toLocaleString()}
                </p>
              </div>
              <div style={summaryCard}>
                <h4>Total Revenue</h4>
                <p style={{ color: "#007bff" }}>${totals.revenue}</p>
              </div>
            </>
          )}
      </div>

      {/* ===== TABLE ===== */}
      <div style={styles.card}>
        <h3 style={styles.heading}>🎯 Performance by Advertiser</h3>

        {loading ? (
          <div style={skeletonTable} />
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Advertiser</th>
                <th style={styles.th}>Views</th>
                <th style={styles.th}>Clicks</th>
                <th style={styles.th}>CTR (%)</th>
                <th style={styles.th}>Revenue ($)</th>
              </tr>
            </thead>
            <tbody>
              {performanceData.map((row, i) => (
                <tr key={i}>
                  <td style={styles.td}>{row.advertiser}</td>
                  <td style={styles.td}>
                    {row.totalViews.toLocaleString()}
                  </td>
                  <td style={styles.td}>{row.totalClicks}</td>
                  <td style={styles.td}>{row.ctrPercent}</td>
                  <td style={styles.td}>${row.totalRevenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ===== CHARTS ===== */}
      <div style={styles.chartRow}>
        {loading ? (
          <>
            <div style={skeletonChart} />
            <div style={skeletonChart} />
          </>
        ) : (
          <>
            <div style={styles.card}>
              <h3 style={styles.heading}>💰 Revenue Share</h3>
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={performanceData}
                    dataKey="totalRevenue"
                    nameKey="advertiser"
                    outerRadius={110}
                  >
                    {performanceData.map((_, idx) => (
                      <Cell
                        key={idx}
                        fill={COLORS[idx % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div style={styles.card}>
              <h3 style={styles.heading}>📈 Views vs Clicks</h3>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="advertiser" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="totalViews" fill="#007bff" />
                  <Line
                    type="monotone"
                    dataKey="totalClicks"
                    stroke="#ff4d4f"
                    strokeWidth={3}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>

      {/* ===== SKELETON ANIMATION ===== */}
      <style>
        {`
          .skeleton {
            background: linear-gradient(
              90deg,
              #e5e7eb 25%,
              #f3f4f6 37%,
              #e5e7eb 63%
            );
            background-size: 400% 100%;
            animation: shimmer 1.4s ease infinite;
          }
          @keyframes shimmer {
            0% { background-position: 100% 0; }
            100% { background-position: -100% 0; }
          }
        `}
      </style>
    </div>
  );
};

/* ===== SKELETON STYLES ===== */
const skeletonSummary = {
  height: "110px",
  width: "220px",
  borderRadius: "12px",
  background: "#e5e7eb",
};

const skeletonChart = {
  flex: 1,
  height: "360px",
  borderRadius: "12px",
  background: "#e5e7eb",
};

const skeletonTable = {
  height: "260px",
  borderRadius: "12px",
  background: "#e5e7eb",
};

/* ===== SUMMARY CARD ===== */
const summaryCard = {
  backgroundColor: "#fff",
  borderRadius: "12px",
  padding: "18px 28px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  textAlign: "center",
  minWidth: "220px",
  fontSize: "32px",
  fontWeight: 600,
};

export default Dashboard;
