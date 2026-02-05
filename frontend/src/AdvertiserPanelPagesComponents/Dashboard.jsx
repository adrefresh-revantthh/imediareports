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
//   Legend,
//   Line,
// } from "recharts";

// /* ===== SAFE NUMBER ===== */
// const toNumber = (v) => {
//   const n = parseFloat(v);
//   return isNaN(n) ? 0 : n;
// };

// const Dashboard = () => {
//   const [performanceData, setPerformanceData] = useState([]);
//   const [totals, setTotals] = useState({
//     impressions: 0,
//     clicks: 0,
//     ctr: "0.00",
//   });

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const jwt = JSON.parse(localStorage.getItem("jwt"));
//         const token = jwt?.token;
//         if (!token) return;

//         /* ===== API CALLS ===== */
//         const sheetsRes = await axios.get(
//           "https://imediareports.onrender.com/api/getallsheets",
//           { headers: { Authorization: `Bearer ${token}` } }
//         );

//         const genealogyRes = await axios.get(
//           "https://imediareports.onrender.com/api/getgenealogyrecords",
//           { headers: { Authorization: `Bearer ${token}` } }
//         );

//         /* ===== MERGE ALL SHEETS (NORMAL + GENEALOGY) ===== */
//         const allSheets = [
//           ...(sheetsRes.data?.sheets || []),
//           ...(sheetsRes.data?.genealogySheets || []),
//           ...(genealogyRes.data?.genealogySheets || []),
//         ];

//         console.log("ALL SHEETS:", allSheets);

//         const map = {};

//         allSheets.forEach((sheet) => {
//           const campaign =
//             sheet.campaignName || sheet.campaign || "Unknown Campaign";
//           const publisher = sheet.publisher || "Unknown Publisher";
//           const key = `${campaign} | ${publisher}`;

//           if (!map[key]) {
//             map[key] = {
//               campaignPublisher: key,
//               impressions: 0,
//               clicks: 0,
//             };
//           }

//           /* ✅ SINGLE SOURCE OF TRUTH (WORKS FOR ALL SHEETS) */
//           if (Array.isArray(sheet.data)) {
//             sheet.data.forEach((row) => {
//               if (!row || typeof row !== "object") return;

//               const e = {};
//               Object.keys(row).forEach(
//                 (k) => (e[k.trim().toLowerCase()] = row[k])
//               );

//               map[key].impressions += toNumber(
//                 e.impressions || e.impression
//               );

//               map[key].clicks += toNumber(
//                 e.clicks || e.click
//               );
//             });
//           }
//         });

//         console.log("FINAL AGGREGATED MAP:", map);

//         /* ===== FORMAT DATA ===== */
//         const formatted = Object.values(map).map((d) => ({
//           campaignPublisher: d.campaignPublisher,
//           impressions: d.impressions,
//           clicks: d.clicks,
//           ctr:
//             d.impressions > 0
//               ? ((d.clicks / d.impressions) * 100).toFixed(2)
//               : "0.00",
//         }));

//         /* ===== TOTALS ===== */
//         const totalImpressions = formatted.reduce(
//           (a, b) => a + b.impressions,
//           0
//         );

//         const totalClicks = formatted.reduce(
//           (a, b) => a + b.clicks,
//           0
//         );

//         setPerformanceData(formatted);
//         setTotals({
//           impressions: totalImpressions,
//           clicks: totalClicks,
//           ctr:
//             totalImpressions > 0
//               ? ((totalClicks / totalImpressions) * 100).toFixed(2)
//               : "0.00",
//         });
//       } catch (err) {
//         console.error("Dashboard error:", err);
//       }
//     };

//     fetchData();
//   }, []);

//   return (
//     <div style={{ padding: 20, background: "#f9fafb", minHeight: "100vh" }}>
//       <h2 style={{ textAlign: "center" }}>
//         📊 Campaign + Publisher Performance
//       </h2>

//       {/* SUMMARY */}
//       <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
//         <Card title="Impressions" value={totals.impressions} />
//         <Card title="Clicks" value={totals.clicks} />
//         <Card title="CTR %" value={totals.ctr} />
//       </div>

//       {/* TABLE */}
//       <div style={{ background: "#fff", padding: 20, borderRadius: 12 }}>
//         <table style={{ width: "100%", borderCollapse: "collapse" }}>
//           <thead>
//             <tr>
//               <TH>Campaign | Publisher</TH>
//               <TH>Impressions</TH>
//               <TH>Clicks</TH>
//               <TH>CTR %</TH>
//             </tr>
//           </thead>
//           <tbody>
//             {performanceData.map((r, i) => (
//               <tr key={i}>
//                 <TD>{r.campaignPublisher}</TD>
//                 <TD>{r.impressions.toLocaleString()}</TD>
//                 <TD>{r.clicks}</TD>
//                 <TD>{r.ctr}</TD>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* CHART */}
//       <div
//         style={{
//           background: "#fff",
//           padding: 20,
//           borderRadius: 12,
//           marginTop: 30,
//         }}
//       >
//         <ResponsiveContainer width="100%" height={350}>
//           <BarChart data={performanceData}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="campaignPublisher" />
//             <YAxis />
//             <Tooltip />
//             <Legend />
//             <Bar dataKey="impressions" fill="#007bff" />
//             <Line dataKey="clicks" stroke="#ff4d4f" strokeWidth={3} />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };

// /* ===== UI HELPERS ===== */
// const Card = ({ title, value }) => (
//   <div
//     style={{
//       background: "#fff",
//       padding: 20,
//       borderRadius: 12,
//       minWidth: 220,
//       boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
//       textAlign: "center",
//     }}
//   >
//     <h4>{title}</h4>
//     <p style={{ fontSize: 20, fontWeight: "bold" }}>{value}</p>
//   </div>
// );

// const TH = ({ children }) => (
//   <th style={{ padding: 10, borderBottom: "2px solid #ddd", textAlign: "left" }}>
//     {children}
//   </th>
// );

// const TD = ({ children }) => (
//   <td style={{ padding: 10, borderBottom: "1px solid #eee" }}>{children}</td>
// );

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
//   Legend,
//   Line,
// } from "recharts";

// /* ===== SAFE NUMBER ===== */
// const toNumber = (v) => {
//   const n = parseFloat(v);
//   return isNaN(n) ? 0 : n;
// };

// const Dashboard = () => {
//   const [performanceData, setPerformanceData] = useState([]);
//   const [totals, setTotals] = useState({
//     impressions: 0,
//     clicks: 0,
//     ctr: "0.00",
//   });

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const jwt = JSON.parse(localStorage.getItem("jwt"));
//         const token = jwt?.token;
//         if (!token) return;

//         const sheetsRes = await axios.get(
//           "https://imediareports.onrender.com/api/getallsheets",
//           { headers: { Authorization: `Bearer ${token}` } }
//         );

//         const genealogyRes = await axios.get(
//           "https://imediareports.onrender.com/api/getgenealogyrecords",
//           { headers: { Authorization: `Bearer ${token}` } }
//         );

//         const allSheets = [
//           ...(sheetsRes.data?.sheets || []),
//           ...(sheetsRes.data?.genealogySheets || []),
//           ...(genealogyRes.data?.genealogySheets || []),
//         ];

//         const map = {};

//         allSheets.forEach((sheet) => {
//           const campaign =
//             sheet.campaignName || sheet.campaign || "Unknown Campaign";
//           const publisher = sheet.publisher || "Unknown Publisher";
//           const key = `${campaign} | ${publisher}`;

//           if (!map[key]) {
//             map[key] = {
//               campaignPublisher: key,
//               impressions: 0,
//               clicks: 0,
//             };
//           }

//           if (Array.isArray(sheet.data)) {
//             sheet.data.forEach((row) => {
//               if (!row || typeof row !== "object") return;

//               const e = {};
//               Object.keys(row).forEach(
//                 (k) => (e[k.trim().toLowerCase()] = row[k])
//               );

//               map[key].impressions += toNumber(
//                 e.impressions || e.impression
//               );
//               map[key].clicks += toNumber(e.clicks || e.click);
//             });
//           }
//         });

//         const formatted = Object.values(map).map((d) => ({
//           campaignPublisher: d.campaignPublisher,
//           impressions: d.impressions,
//           clicks: d.clicks,
//           ctr:
//             d.impressions > 0
//               ? ((d.clicks / d.impressions) * 100).toFixed(2)
//               : "0.00",
//         }));

//         const totalImpressions = formatted.reduce(
//           (a, b) => a + b.impressions,
//           0
//         );
//         const totalClicks = formatted.reduce(
//           (a, b) => a + b.clicks,
//           0
//         );

//         setPerformanceData(formatted);
//         setTotals({
//           impressions: totalImpressions,
//           clicks: totalClicks,
//           ctr:
//             totalImpressions > 0
//               ? ((totalClicks / totalImpressions) * 100).toFixed(2)
//               : "0.00",
//         });
//       } catch (err) {
//         console.error("Dashboard error:", err);
//       }
//     };

//     fetchData();
//   }, []);

//   return (
//     <div style={{ padding: 24, background: "#f9fafb", minHeight: "100vh" }}>
//       <h2 style={{ textAlign: "center", fontSize: 30, fontWeight: "700" }}>
//         📊 Campaign + Publisher Performance
//       </h2>

//       {/* SUMMARY */}
//       <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
//         <Card title="Impressions" value={totals.impressions} />
//         <Card title="Clicks" value={totals.clicks} />
//         <Card title="CTR %" value={totals.ctr} />
//       </div>

//       {/* TABLE */}
//       <div
//         style={{
//           background: "#fff",
//           padding: 24,
//           borderRadius: 12,
//           marginTop: 24,
//         }}
//       >
//         <table style={{ width: "100%", borderCollapse: "collapse" }}>
//           <thead>
//             <tr>
//               <TH>Campaign | Publisher</TH>
//               <TH>Impressions</TH>
//               <TH>Clicks</TH>
//               <TH>CTR %</TH>
//             </tr>
//           </thead>
//           <tbody>
//             {performanceData.map((r, i) => (
//               <tr key={i}>
//                 <TD>{r.campaignPublisher}</TD>
//                 <TD>{r.impressions.toLocaleString()}</TD>
//                 <TD>{r.clicks}</TD>
//                 <TD>{r.ctr}</TD>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* CHART */}
//       <div
//         style={{
//           background: "#fff",
//           padding: 24,
//           borderRadius: 12,
//           marginTop: 32,
//         }}
//       >
//         <ResponsiveContainer width="100%" height={380}>
//           <BarChart data={performanceData}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis
//               dataKey="campaignPublisher"
//               tick={{ fontSize: 14 }}
//             />
//             <YAxis tick={{ fontSize: 14 }} />
//             <Tooltip contentStyle={{ fontSize: 14 }} />
//             <Legend wrapperStyle={{ fontSize: 14 }} />
//             <Bar dataKey="impressions" fill="#007bff" />
//             <Line dataKey="clicks" stroke="#ff4d4f" strokeWidth={3} />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };

// /* ===== UI HELPERS (TEXT SIZE INCREASED ONLY) ===== */
// const Card = ({ title, value }) => (
//   <div
//     style={{
//       background: "#fff",
//       padding: 24,
//       borderRadius: 12,
//       minWidth: 240,
//       boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
//       textAlign: "center",
//     }}
//   >
//     <h4 style={{ fontSize: 28, marginBottom: 8 }}>{title}</h4>
//     <p style={{ fontSize: 28, fontWeight: "bold" }}>{value}</p>
//   </div>
// );

// const TH = ({ children }) => (
//   <th
//     style={{
//       padding: 14,
//       borderBottom: "2px solid #ddd",
//       textAlign: "left",
//       fontSize: 28,
//       fontWeight: "700",
//     }}
//   >
//     {children}
//   </th>
// );

// const TD = ({ children }) => (
//   <td
//     style={{
//       padding: 14,
//       borderBottom: "1px solid #eee",
//       fontSize: 22,
//     }}
//   >
//     {children}
//   </td>
// );

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
  Legend,
  Line,
} from "recharts";

/* ===== SAFE NUMBER ===== */
const toNumber = (v) => {
  const n = parseFloat(v);
  return isNaN(n) ? 0 : n;
};

const Dashboard = () => {
  const [performanceData, setPerformanceData] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ NEW
  const [totals, setTotals] = useState({
    impressions: 0,
    clicks: 0,
    ctr: "0.00",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // ✅
        const jwt = JSON.parse(localStorage.getItem("jwt"));
        const token = jwt?.token;
        if (!token) return;

        const sheetsRes = await axios.get(
          "https://imediareports.onrender.com/api/getallsheets",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const genealogyRes = await axios.get(
          "https://imediareports.onrender.com/api/getgenealogyrecords",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const allSheets = [
          ...(sheetsRes.data?.sheets || []),
          ...(sheetsRes.data?.genealogySheets || []),
          ...(genealogyRes.data?.genealogySheets || []),
        ];

        const map = {};

        allSheets.forEach((sheet) => {
          const campaign =
            sheet.campaignName || sheet.campaign || "Unknown Campaign";
          const publisher = sheet.publisher || "Unknown Publisher";
          const key = `${campaign} | ${publisher}`;

          if (!map[key]) {
            map[key] = {
              campaignPublisher: key,
              impressions: 0,
              clicks: 0,
            };
          }

          if (Array.isArray(sheet.data)) {
            sheet.data.forEach((row) => {
              if (!row || typeof row !== "object") return;

              const e = {};
              Object.keys(row).forEach(
                (k) => (e[k.trim().toLowerCase()] = row[k])
              );

              map[key].impressions += toNumber(
                e.impressions || e.impression
              );
              map[key].clicks += toNumber(e.clicks || e.click);
            });
          }
        });

        const formatted = Object.values(map).map((d) => ({
          campaignPublisher: d.campaignPublisher,
          impressions: d.impressions,
          clicks: d.clicks,
          ctr:
            d.impressions > 0
              ? ((d.clicks / d.impressions) * 100).toFixed(2)
              : "0.00",
        }));

        const totalImpressions = formatted.reduce(
          (a, b) => a + b.impressions,
          0
        );
        const totalClicks = formatted.reduce(
          (a, b) => a + b.clicks,
          0
        );

        setPerformanceData(formatted);
        setTotals({
          impressions: totalImpressions,
          clicks: totalClicks,
          ctr:
            totalImpressions > 0
              ? ((totalClicks / totalImpressions) * 100).toFixed(2)
              : "0.00",
        });
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false); // ✅
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ padding: 24, background: "#f9fafb", minHeight: "100vh" }}>
      <h2 style={{ textAlign: "center", fontSize: 30, fontWeight: "700" }}>
        📊 Campaign + Publisher Performance
      </h2>

      {/* SUMMARY */}
      <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton-card" />
          ))
        ) : (
          <>
            <Card title="Impressions" value={totals.impressions} />
            <Card title="Clicks" value={totals.clicks} />
            <Card title="CTR %" value={totals.ctr} />
          </>
        )}
      </div>

      {/* TABLE */}
      <div
        style={{
          background: "#fff",
          padding: 24,
          borderRadius: 12,
          marginTop: 24,
        }}
      >
        {loading ? (
          <div>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton-row" />
            ))}
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <TH>Campaign | Publisher</TH>
                <TH>Impressions</TH>
                <TH>Clicks</TH>
                <TH>CTR %</TH>
              </tr>
            </thead>
            <tbody>
              {performanceData.map((r, i) => (
                <tr key={i}>
                  <TD>{r.campaignPublisher}</TD>
                  <TD>{r.impressions.toLocaleString()}</TD>
                  <TD>{r.clicks}</TD>
                  <TD>{r.ctr}</TD>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* CHART */}
      <div
        style={{
          background: "#fff",
          padding: 24,
          borderRadius: 12,
          marginTop: 32,
        }}
      >
        {loading ? (
          <div className="skeleton-chart" />
        ) : (
          <ResponsiveContainer width="100%" height={380}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="campaignPublisher" tick={{ fontSize: 14 }} />
              <YAxis tick={{ fontSize: 14 }} />
              <Tooltip contentStyle={{ fontSize: 14 }} />
              <Legend wrapperStyle={{ fontSize: 14 }} />
              <Bar dataKey="impressions" fill="#007bff" />
              <Line dataKey="clicks" stroke="#ff4d4f" strokeWidth={3} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* ===== SKELETON CSS ===== */}
      <style>
        {`
          .skeleton-card,
          .skeleton-row,
          .skeleton-chart {
            background: linear-gradient(
              90deg,
              #e5e7eb 25%,
              #f3f4f6 37%,
              #e5e7eb 63%
            );
            background-size: 400% 100%;
            animation: shimmer 1.4s ease infinite;
            border-radius: 10px;
          }

          .skeleton-card {
            height: 120px;
            width: 240px;
          }

          .skeleton-row {
            height: 34px;
            margin-bottom: 12px;
          }

          .skeleton-chart {
            height: 380px;
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

/* ===== UI HELPERS (UNCHANGED) ===== */
const Card = ({ title, value }) => (
  <div
    style={{
      background: "#fff",
      padding: 24,
      borderRadius: 12,
      minWidth: 240,
      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      textAlign: "center",
    }}
  >
    <h4 style={{ fontSize: 28, marginBottom: 8 }}>{title}</h4>
    <p style={{ fontSize: 28, fontWeight: "bold" }}>{value}</p>
  </div>
);

const TH = ({ children }) => (
  <th
    style={{
      padding: 14,
      borderBottom: "2px solid #ddd",
      textAlign: "left",
      fontSize: 28,
      fontWeight: "700",
    }}
  >
    {children}
  </th>
);

const TD = ({ children }) => (
  <td
    style={{
      padding: 14,
      borderBottom: "1px solid #eee",
      fontSize: 22,
    }}
  >
    {children}
  </td>
);

export default Dashboard;
