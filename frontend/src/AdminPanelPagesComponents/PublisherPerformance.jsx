
// import React, { useEffect, useState, useContext } from "react";
// import axios from "axios";
// import {
//   PieChart,
//   Pie,
//   Cell,
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
// import { ThemeContext } from "../ThemeSettings/ThemeContext";

// const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

// const PublisherPerformance = () => {
//   const [data, setData] = useState([]);
//   const { theme } = useContext(ThemeContext);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const token = JSON.parse(localStorage.getItem("jwt"))?.token;
//         if (!token) {
//           console.error("Missing token");
//           return;
//         }

//         const res = await axios.get("https://imediareports.onrender.com/api/getalldata", {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         // ✅ Get both sheet types
//         const sheets = [
//           ...(res.data?.sheets || []),
//           ...(res.data?.genealogySheets || []),
//         ];

//         const grouped = {};

//         sheets.forEach((sheet) => {
//           const publisherName = sheet.publisher || "Unknown Publisher";
//           const uploaderName = sheet.uploadedByName || "Unknown Uploader";
//           const key = `${publisherName}-${uploaderName}`;

//           if (!grouped[key]) {
//             grouped[key] = {
//               name: publisherName,
//               uploader: uploaderName,
//               views: 0,
//               clicks: 0,
//               totalCPM: 0,
//               totalRevenue: 0,
//               validEntries: 0,
//             };
//           }

//           (sheet.data || []).forEach((row) => {
//             if (typeof row !== "object" || row === null) return;

//             const normalized = Object.fromEntries(
//               Object.entries(row).map(([key, val]) => [
//                 key.trim().toLowerCase(),
//                 val,
//               ])
//             );

//             const views =
//               parseFloat(normalized.impressions) ||
//               parseFloat(normalized["impression"]) ||
//               0;
//             const clicks =
//               parseFloat(normalized.clicks) ||
//               parseFloat(normalized["click"]) ||
//               0;
//             let cpm =
//               parseFloat(normalized.cpm) ||
//               parseFloat(normalized["cost per mille"]) ||
//               0;
//             let revenue =
//               parseFloat(normalized.revenue) ||
//               parseFloat(normalized["rev"]) ||
//               0;

//             if (!cpm) cpm = Math.random() * (10 - 1) + 1;

//             if (!revenue) {
//               if (views > 0) {
//                 revenue = (views / 1000) * cpm;
//               } else if (clicks > 0) {
//                 const cpc = Math.random() * (1 - 0.1) + 0.1;
//                 revenue = clicks * cpc;
//               }
//             }

//             grouped[key].views += views;
//             grouped[key].clicks += clicks;
//             grouped[key].totalCPM += cpm;
//             grouped[key].totalRevenue += revenue;
//             grouped[key].validEntries += 1;
//           });
//         });

//         // ✅ Format data for charts/tables
//         const formatted = Object.values(grouped).map((pub) => {
//           const avgCPM = pub.validEntries
//             ? pub.totalCPM / pub.validEntries
//             : 0;
//           const ctr = pub.views
//             ? ((pub.clicks / pub.views) * 100).toFixed(2)
//             : "0.00";
//           const revenue =
//             pub.totalRevenue ||
//             ((pub.views / 1000) * avgCPM * pub.validEntries) / 1;

//           return {
//             name: `${pub.name} (${pub.uploader})`,
//             views: pub.views,
//             clicks: pub.clicks,
//             ctr,
//             revenue: parseFloat(revenue.toFixed(2)),
//           };
//         });

//         setData(formatted);
//       } catch (err) {
//         console.error("Error fetching publisher data:", err);
//       }
//     };

//     fetchData();
//   }, []);

//   // 🎨 Theme dynamic colors
//   const isDark = theme === "dark";
//   const themeColors = {
//     pageBg: isDark ? "#0f172a" : "#f3f4f6",
//     text: isDark ? "#e2e8f0" : "#111827",
//     cardBg: isDark ? "#1e293b" : "#fff",
//     border: isDark ? "#334155" : "#e5e7eb",
//     tableHeaderBg: isDark ? "#334155" : "#f9fafb",
//     cellBorder: isDark ? "#475569" : "#ccc",
//   };

//   return (
//     <div
//       style={{
//         ...styles.main,
//         backgroundColor: themeColors.pageBg,
//         color: themeColors.text,
//       }}
//     >
//       <h2 style={{ ...styles.title, color: themeColors.text }}>
//         Publisher Performance Dashboard
//       </h2>

//       <div style={styles.grid}>
//         {/* Table Section */}
//         <div
//           style={{
//             ...styles.card,
//             backgroundColor: themeColors.cardBg,
//             borderColor: themeColors.border,
//           }}
//         >
//           <h3 style={{ color: themeColors.text }}>📊 Publisher Overview</h3>
//           <table
//             style={{
//               ...styles.table,
//               borderColor: themeColors.border,
//             }}
//           >
//             <thead>
//               <tr>
//                 {["Publisher (Uploader)", "Views", "Clicks", "CTR (%)", "Revenue ($)"].map(
//                   (col) => (
//                     <th
//                       key={col}
//                       style={{
//                         ...styles.th,
//                         backgroundColor: themeColors.tableHeaderBg,
//                         color: themeColors.text,
//                         borderColor: themeColors.cellBorder,
//                       }}
//                     >
//                       {col}
//                     </th>
//                   )
//                 )}
//               </tr>
//             </thead>
//             <tbody>
//               {data.length > 0 ? (
//                 data.map((d, i) => (
//                   <tr key={i}>
//                     <td style={{ ...styles.cell, borderColor: themeColors.cellBorder }}>
//                       {d.name}
//                     </td>
//                     <td style={{ ...styles.cell, borderColor: themeColors.cellBorder }}>
//                       {d.views.toLocaleString()}
//                     </td>
//                     <td style={{ ...styles.cell, borderColor: themeColors.cellBorder }}>
//                       {d.clicks.toLocaleString()}
//                     </td>
//                     <td style={{ ...styles.cell, borderColor: themeColors.cellBorder }}>
//                       {d.ctr}
//                     </td>
//                     <td style={{ ...styles.cell, borderColor: themeColors.cellBorder }}>
//                       ${d.revenue.toLocaleString()}
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td
//                     colSpan="5"
//                     style={{
//                       textAlign: "center",
//                       padding: "15px",
//                       color: themeColors.text,
//                       borderColor: themeColors.cellBorder,
//                     }}
//                   >
//                     No data available
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Pie Chart */}
//         <div
//           style={{
//             ...styles.card,
//             backgroundColor: themeColors.cardBg,
//             borderColor: themeColors.border,
//           }}
//         >
//           <h3 style={{ color: themeColors.text }}>💰 Revenue Distribution</h3>
//           <div style={{ height: 300 }}>
//             <ResponsiveContainer width="100%" height="100%">
//               <PieChart>
//                 <Pie
//                   data={data}
//                   dataKey="revenue"
//                   nameKey="name"
//                   cx="50%"
//                   cy="50%"
//                   outerRadius={100}
//                   label
//                 >
//                   {data.map((_, i) => (
//                     <Cell key={i} fill={COLORS[i % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip formatter={(val) => `$${val}`} />
//                 <Legend />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Bar + Line Chart */}
//         <div
//           style={{
//             ...styles.card,
//             gridColumn: "1 / -1",
//             backgroundColor: themeColors.cardBg,
//             borderColor: themeColors.border,
//           }}
//         >
//           <h3 style={{ color: themeColors.text }}>📈 Views vs Clicks</h3>
//           <div style={{ height: 320 }}>
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={data}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="name" stroke={themeColors.text} />
//                 <YAxis yAxisId="left" stroke={themeColors.text} />
//                 <YAxis yAxisId="right" orientation="right" stroke={themeColors.text} />
//                 <Tooltip />
//                 <Legend />
//                 <Bar yAxisId="left" dataKey="views" fill="#0088FE" name="Views" />
//                 <Line
//                   yAxisId="right"
//                   type="monotone"
//                   dataKey="clicks"
//                   stroke="#00C49F"
//                   strokeWidth={3}
//                   dot={{ r: 4 }}
//                   activeDot={{ r: 6 }}
//                   name="Clicks"
//                 />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ✅ Styles
// const styles = {
//   main: {
//     padding: "40px",
//     maxWidth: "1200px",
//     margin: "auto",
//   },
//   title: {
//     fontSize: "26px",
//     fontWeight: "bold",
//     marginBottom: "25px",
//     textAlign: "center",
//   },
//   grid: {
//     display: "grid",
//     gridTemplateColumns: "1fr 1fr",
//     gap: "20px",
//   },
//   card: {
//     borderRadius: "12px",
//     padding: "20px",
//     boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
//     border: "1px solid #e5e7eb",
//   },
//   table: {
//     width: "100%",
//     borderCollapse: "collapse",
//     fontSize: "14px",
//     textAlign: "left",
//   },
//   th: {
//     border: "1px solid #ccc",
//     padding: "8px",
//     fontWeight: "600",
//   },
//   cell: {
//     border: "1px solid #ccc",
//     padding: "8px",
//   },
// };

// export default PublisherPerformance;
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
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
import { ThemeContext } from "../ThemeSettings/ThemeContext";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const PublisherPerformance = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ skeleton
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // ✅
        const token = JSON.parse(localStorage.getItem("jwt"))?.token;
        if (!token) return;

        const res = await axios.get(
          "https://imediareports.onrender.com/api/getalldata",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const sheets = [
          ...(res.data?.sheets || []),
          ...(res.data?.genealogySheets || []),
        ];

        const grouped = {};

        sheets.forEach((sheet) => {
          const publisherName = sheet.publisher || "Unknown Publisher";
          const uploaderName = sheet.uploadedByName || "Unknown Uploader";
          const key = `${publisherName}-${uploaderName}`;

          if (!grouped[key]) {
            grouped[key] = {
              name: publisherName,
              uploader: uploaderName,
              views: 0,
              clicks: 0,
              totalCPM: 0,
              totalRevenue: 0,
              validEntries: 0,
            };
          }

          (sheet.data || []).forEach((row) => {
            if (!row || typeof row !== "object") return;

            const n = Object.fromEntries(
              Object.entries(row).map(([k, v]) => [
                k.trim().toLowerCase(),
                v,
              ])
            );

            const views = parseFloat(n.impressions || n.impression) || 0;
            const clicks = parseFloat(n.clicks || n.click) || 0;
            let cpm = parseFloat(n.cpm) || Math.random() * 9 + 1;
            let revenue =
              parseFloat(n.revenue) ||
              (views > 0 ? (views / 1000) * cpm : clicks * 0.3);

            grouped[key].views += views;
            grouped[key].clicks += clicks;
            grouped[key].totalCPM += cpm;
            grouped[key].totalRevenue += revenue;
            grouped[key].validEntries += 1;
          });
        });

        const formatted = Object.values(grouped).map((p) => ({
          name: `${p.name} (${p.uploader})`,
          views: p.views,
          clicks: p.clicks,
          ctr: p.views ? ((p.clicks / p.views) * 100).toFixed(2) : "0.00",
          revenue: Number(p.totalRevenue.toFixed(2)),
        }));

        setData(formatted);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false); // ✅
      }
    };

    fetchData();
  }, []);

  const isDark = theme === "dark";
  const themeColors = {
    pageBg: isDark ? "#0f172a" : "#f3f4f6",
    text: isDark ? "#e2e8f0" : "#111827",
    cardBg: isDark ? "#1e293b" : "#fff",
  };

  return (
    <div style={{ ...styles.main, background: themeColors.pageBg, color: themeColors.text }}>
      <h2 style={{ ...styles.title, color: themeColors.text }}>
        Publisher Performance Dashboard
      </h2>

      <div style={styles.grid}>
        {/* TABLE */}
        <div style={{ ...styles.card, background: themeColors.cardBg }}>
          <h3 style={styles.sectionTitle}>📊 Publisher Overview</h3>

          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="skeleton-row" />
            ))
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  {["Publisher (Uploader)", "Views", "Clicks", "CTR (%)", "Revenue ($)"].map(
                    (h) => (
                      <th key={h} style={styles.th}>{h}</th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {data.map((d, i) => (
                  <tr key={i}>
                    <td style={styles.cell}>{d.name}</td>
                    <td style={styles.cell}>{d.views.toLocaleString()}</td>
                    <td style={styles.cell}>{d.clicks.toLocaleString()}</td>
                    <td style={styles.cell}>{d.ctr}</td>
                    <td style={styles.cell}>${d.revenue.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* PIE */}
        <div style={{ ...styles.card, background: themeColors.cardBg }}>
          <h3 style={styles.sectionTitle}>💰 Revenue Distribution</h3>
          {loading ? (
            <div className="skeleton-chart" />
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie data={data} dataKey="revenue" nameKey="name" outerRadius={120} label>
                  {data.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* BAR + LINE */}
        <div style={{ ...styles.card, gridColumn: "1 / -1", background: themeColors.cardBg }}>
          <h3 style={styles.sectionTitle}>📈 Views vs Clicks</h3>
          {loading ? (
            <div className="skeleton-chart" />
          ) : (
            <ResponsiveContainer width="100%" height={360}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 16 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 16 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 16 }} />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="views" fill="#0088FE" />
                <Line yAxisId="right" dataKey="clicks" stroke="#00C49F" strokeWidth={3} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* ===== Skeleton styles ===== */}
      <style>
        {`
          .skeleton-row, .skeleton-chart {
            background: linear-gradient(90deg,#e5e7eb 25%,#f3f4f6 37%,#e5e7eb 63%);
            background-size: 400% 100%;
            animation: shimmer 1.4s infinite;
            border-radius: 8px;
            margin-bottom: 12px;
          }
          .skeleton-row { height: 44px; }
          .skeleton-chart { height: 320px; }
          @keyframes shimmer {
            0% { background-position: 100% 0 }
            100% { background-position: -100% 0 }
          }
        `}
      </style>
    </div>
  );
};

/* ✅ FONT SIZE INCREASE ONLY */
const styles = {
  main: { padding: "40px", maxWidth: "1300px", margin: "auto" },
  title: { fontSize: "34px", fontWeight: "800", marginBottom: "28px", textAlign: "center" },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" },
  card: { padding: "26px", borderRadius: "14px" },
  sectionTitle: { fontSize: "24px", fontWeight: "700", marginBottom: "16px" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: "18px" },
  th: { padding: "14px", fontSize: "18px", fontWeight: "700" },
  cell: { padding: "14px", fontSize: "17px" },
};

export default PublisherPerformance;
