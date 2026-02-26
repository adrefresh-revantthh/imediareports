
// // import React, { useEffect, useState } from "react";
// // import axios from "axios";
// // import {
// //   ResponsiveContainer,
// //   BarChart,
// //   Bar,
// //   XAxis,
// //   YAxis,
// //   Tooltip,
// //   CartesianGrid,
// //   Legend,
// //   Line,
// //   PieChart,
// //   Pie,
// //   Cell,
// // } from "recharts";

// // /* ================= HELPERS ================= */

// // const toNumber = (v) => {
// //   const n = parseFloat(v);
// //   return isNaN(n) ? 0 : n;
// // };

// // /* 🔥 UNIVERSAL DATE PARSER */
// // const parseDate = (value) => {
// //   if (!value) return null;

// //   // Excel serial
// //   if (typeof value === "number") {
// //     const epoch = new Date(Date.UTC(1899, 11, 30));
// //     return new Date(epoch.getTime() + value * 86400000);
// //   }

// //   if (typeof value === "string") {
// //     const cleaned = value.trim();

// //     const iso = new Date(cleaned);
// //     if (!isNaN(iso.getTime())) return iso;

// //     const parts = cleaned.split(/[-/]/);
// //     if (parts.length === 3) {
// //       const [d, m, y] = parts;
// //       const parsed = new Date(`${y}-${m}-${d}`);
// //       if (!isNaN(parsed.getTime())) return parsed;
// //     }
// //   }

// //   return null;
// // };

// // const COLORS = ["#007bff", "#ff4d4f", "#28a745"];

// // /* ================= DASHBOARD ================= */

// // const Dashboard = () => {
// //   const [totals, setTotals] = useState({
// //     impressions: 0,
// //     clicks: 0,
// //     ctr: "0.00",
// //     cpm: "0.00",
// //     spend: "0.00",
// //   });

// //   const [pieData, setPieData] = useState([]);
// //   const [last7Days, setLast7Days] = useState([]);

// //   const [datePreset, setDatePreset] = useState("lastweek");
// //   const [customFrom, setCustomFrom] = useState("");
// //   const [customTo, setCustomTo] = useState("");

// //   /* ================= DATE PRESETS ================= */

// //   const applyPreset = (preset) => {
// //     const today = new Date();
// //     let from, to;

// //     if (preset === "yesterday") {
// //       from = new Date(today);
// //       from.setDate(today.getDate() - 1);
// //       to = new Date(from);
// //     }

// //     if (preset === "lastweek") {
// //       to = new Date(today);
// //       from = new Date(today);
// //       from.setDate(today.getDate() - 7);
// //     }

// //     if (preset === "lastmonth") {
// //       to = new Date(today);
// //       from = new Date(today);
// //       from.setMonth(today.getMonth() - 1);
// //     }

// //     setCustomFrom(from.toISOString().slice(0, 10));
// //     setCustomTo(to.toISOString().slice(0, 10));
// //   };

// //   useEffect(() => {
// //     if (datePreset !== "custom") applyPreset(datePreset);
// //   }, [datePreset]);

// //   /* ================= FETCH ================= */

// //   useEffect(() => {
// //     if (!customFrom || !customTo) return;

// //     const fetchData = async () => {
// //       try {
// //         const jwt = JSON.parse(localStorage.getItem("jwt"));
// //         const token = jwt?.token;
// //         if (!token) return;

// //         const res = await axios.get(
// //           "https://imediareports.onrender.com/api/getallsheets",
// //           { headers: { Authorization: `Bearer ${token}` } }
// //         );

// //         /* ===== SAFE SHEETS ===== */
// //         const allSheets = res.data
// // console.log(allSheets,"sheets");

// //         /* ===== ONLY OTT VIDEO ADWIDGET ===== */
// //         const sheets = allSheets.filter((s) => {
// //           const type =
// //             s.name ||
// //             s.sheetName ||
// //             s.category ||
// //             s.type ||
// //             "";
// //           const lower = type.toLowerCase();

// //           return (
// //             lower.includes("ott") ||
// //             lower.includes("video") ||
// //             lower.includes("adwidget")
// //           );
// //         });

// //         const from = new Date(customFrom);
// //         const to = new Date(customTo);

// //         let impressions = 0;
// //         let clicks = 0;
// //         let spend = 0;

// //         const adTypeMap = { ott: 0, video: 0, adwidget: 0 };
// //         const last7Map = {};

// //         const today = new Date();
// //         const last7Start = new Date();
// //         last7Start.setDate(today.getDate() - 7);

// //         sheets.forEach((sheet) => {
// //           const adType = (sheet.name || "").toLowerCase();

// //           (sheet.data || []).forEach((row) => {
// //             const e = {};
// //             Object.keys(row).forEach(
// //               (k) => (e[k.trim().toLowerCase()] = row[k])
// //             );

// //             /* 🔥 ROBUST DATE */
// //             const d = parseDate(
// //               e.date ||
// //                 e.day ||
// //                 e.reportdate ||
// //                 e.report_date ||
// //                 e["report date"] ||
// //                 e["date"]
// //             );

// //             if (!d) return;

// //             const rowDate = new Date(d.toDateString());
// //             const fromDate = new Date(from.toDateString());
// //             const toDate = new Date(to.toDateString());

// //             if (rowDate < fromDate || rowDate > toDate) return;

// //             const imp = toNumber(
// //               e.impressions ||
// //                 e.impression ||
// //                 e["total impressions"]
// //             );

// //             const clk = toNumber(
// //               e.clicks ||
// //                 e.click ||
// //                 e["total clicks"]
// //             );

// //             const cpm = toNumber(e.cpm);
// //             const cpc = toNumber(e.cpc);

// //             impressions += imp;
// //             clicks += clk;

// //             let rowSpend = 0;
// //             if (cpc > 0) rowSpend = clk * cpc;
// //             else if (cpm > 0) rowSpend = (imp / 1000) * cpm;

// //             spend += rowSpend;

// //             if (adTypeMap[adType] !== undefined)
// //               adTypeMap[adType] += imp;

// //             /* LAST 7 DAYS */
// //             if (rowDate >= last7Start && rowDate <= today) {
// //             const key = rowDate.toISOString().slice(0, 10);
// // last7Map[key] ??= { impressions: 0, clicks: 0 };

// // last7Map[key].impressions += imp;
// // last7Map[key].clicks += clk;
// //             }
// //           });
// //         });

// //         /* PIE */
// //         const pie = Object.keys(adTypeMap).map((k) => ({
// //           name: k.toUpperCase(),
// //           value: adTypeMap[k],
// //         }));

// //         /* LAST 7 */
// //         const last7 = Object.keys(last7Map)
// //           .sort()
// //           .map((d) => ({
// //             date: d,
// //             impressions: last7Map[d].impressions,
// //             clicks: last7Map[d].clicks,
// //           }));

// //         const ctr =
// //           impressions > 0
// //             ? ((clicks / impressions) * 100).toFixed(2)
// //             : "0.00";

// //         const cpm =
// //           impressions > 0
// //             ? ((spend / impressions) * 1000).toFixed(2)
// //             : "0.00";

// //         setTotals({
// //           impressions,
// //           clicks,
// //           ctr,
// //           cpm,
// //           spend: spend.toFixed(2),
// //         });

// //         setPieData(pie);
// //         setLast7Days(last7);
// //       } catch (err) {
// //         console.error("Advertiser dashboard error:", err);
// //       }
// //     };

// //     fetchData();
// //   }, [customFrom, customTo]);

// //   /* ================= UI ================= */

// //   return (
// //     <div style={{ padding: 24, background: "#f9fafb" }}>
// //       <div
// //         style={{
// //           display: "flex",
// //           justifyContent: "space-between",
// //           marginBottom: 20,
// //         }}
// //       >
// //         <h2>📊 Advertiser Dashboard</h2>

// //         {/* DATE FILTER */}
// //         <div>
// //           <select
// //             value={datePreset}
// //             onChange={(e) => setDatePreset(e.target.value)}
// //           >
// //             <option value="yesterday">Yesterday</option>
// //             <option value="lastweek">Last 7 Days</option>
// //             <option value="lastmonth">Last Month</option>
// //             <option value="custom">Custom</option>
// //           </select>

// //           {datePreset === "custom" && (
// //             <>
// //               <input
// //                 type="date"
// //                 value={customFrom}
// //                 onChange={(e) => setCustomFrom(e.target.value)}
// //               />
// //               <input
// //                 type="date"
// //                 value={customTo}
// //                 onChange={(e) => setCustomTo(e.target.value)}
// //               />
// //             </>
// //           )}
// //         </div>
// //       </div>

// //       {/* SUMMARY */}
// //       <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
// //         <Card title="Impressions" value={totals.impressions} />
// //         <Card title="Clicks" value={totals.clicks} />
// //         <Card title="CTR %" value={totals.ctr} />
// //         <Card title="CPM $" value={totals.cpm} />
// //         <Card title="Spend $" value={totals.spend} />
// //       </div>

// //       {/* CHARTS */}
// //       <div style={{ display: "flex", gap: 20 }}>
// //         <div style={{ flex: 1, background: "#fff", padding: 20 }}>
// //           <h3>Impressions by AdType</h3>
// //           <ResponsiveContainer width="100%" height={320}>
// //             <PieChart>
// //               <Pie data={pieData} dataKey="value" outerRadius={110}>
// //                 {pieData.map((_, i) => (
// //                   <Cell key={i} fill={COLORS[i % COLORS.length]} />
// //                 ))}
// //               </Pie>
// //               <Legend />
// //               <Tooltip />
// //             </PieChart>
// //           </ResponsiveContainer>
// //         </div>

// //         <div style={{ flex: 2, background: "#fff", padding: 20 }}>
// //           <h3>Last 7 Days Performance</h3>
// //           <ResponsiveContainer width="100%" height={320}>
// //             <BarChart data={last7Days}>
// //               <CartesianGrid strokeDasharray="3 3" />
// //               <XAxis dataKey="date" />
// //               <YAxis />
// //               <Tooltip />
// //               <Legend />
// //               <Bar dataKey="impressions" fill="#007bff" />
// //               <Line dataKey="clicks" stroke="#ff4d4f" strokeWidth={3} />
// //             </BarChart>
// //           </ResponsiveContainer>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // const Card = ({ title, value }) => (
// //   <div
// //     style={{
// //       background: "#fff",
// //       padding: 20,
// //       borderRadius: 10,
// //       minWidth: 180,
// //       textAlign: "center",
// //     }}
// //   >
// //     <h4>{title}</h4>
// //     <p style={{ fontSize: 22, fontWeight: "bold" }}>{value}</p>
// //   </div>
// // );

// // export default Dashboard;

// // import React, { useEffect, useState } from "react";
// // import axios from "axios";
// // import {
// //   ResponsiveContainer,
// //   BarChart,
// //   Bar,
// //   XAxis,
// //   YAxis,
// //   Tooltip,
// //   CartesianGrid,
// //   Legend,
// //   Line,
// //   PieChart,
// //   Pie,
// //   Cell,
// // } from "recharts";

// // /* ================= HELPERS ================= */

// // const toNumber = (v) => {
// //   const n = parseFloat(v);
// //   return isNaN(n) ? 0 : n;
// // };

// // /* 🔥 UNIVERSAL DATE PARSER */
// // const parseDate = (value) => {
// //   if (!value) return null;

// //   if (typeof value === "number") {
// //     const epoch = new Date(Date.UTC(1899, 11, 30));
// //     return new Date(epoch.getTime() + value * 86400000);
// //   }

// //   if (typeof value === "string") {
// //     const cleaned = value.trim();
// //     const iso = new Date(cleaned);
// //     if (!isNaN(iso.getTime())) return iso;

// //     const parts = cleaned.split(/[-/]/);
// //     if (parts.length === 3) {
// //       const [d, m, y] = parts;
// //       const parsed = new Date(`${y}-${m}-${d}`);
// //       if (!isNaN(parsed.getTime())) return parsed;
// //     }
// //   }

// //   return null;
// // };

// // const COLORS = ["#007bff", "#ff4d4f", "#28a745"];

// // /* ================= DASHBOARD ================= */

// // const Dashboard = () => {
// //   const [totals, setTotals] = useState({
// //     impressions: 0,
// //     clicks: 0,
// //     ctr: "0.00",
// //     cpm: "0.00",
// //     spend: "0.00",
// //   });

// //   const [pieData, setPieData] = useState([]);
// //   const [last7Days, setLast7Days] = useState([]);

// //   const [datePreset, setDatePreset] = useState("lastweek");
// //   const [customFrom, setCustomFrom] = useState("");
// //   const [customTo, setCustomTo] = useState("");

// //   /* ================= DATE PRESETS ================= */

// //   const applyPreset = (preset) => {
// //     const today = new Date();
// //     let from, to;

// //     if (preset === "yesterday") {
// //       from = new Date(today);
// //       from.setDate(today.getDate() - 1);
// //       to = new Date(from);
// //     }

// //     if (preset === "lastweek") {
// //       to = new Date(today);
// //       from = new Date(today);
// //       from.setDate(today.getDate() - 7);
// //     }

// //     if (preset === "lastmonth") {
// //       to = new Date(today);
// //       from = new Date(today);
// //       from.setMonth(today.getMonth() - 1);
// //     }

// //     setCustomFrom(from.toISOString().slice(0, 10));
// //     setCustomTo(to.toISOString().slice(0, 10));
// //   };

// //   useEffect(() => {
// //     if (datePreset !== "custom") applyPreset(datePreset);
// //   }, [datePreset]);

// //   /* ================= FETCH ================= */

// //   useEffect(() => {
// //     if (!customFrom || !customTo) return;

// //     const fetchData = async () => {
// //       try {
// //         const jwt = JSON.parse(localStorage.getItem("jwt"));
// //         const token = jwt?.token;
// //         if (!token) return;

// //         const res = await axios.get(
// //           "https://imediareports.onrender.com/api/getallsheets",
// //           { headers: { Authorization: `Bearer ${token}` } }
// //         );

// //         const allSheets = res.data;

// //         /* ===== ONLY OTT VIDEO ADWIDGET ===== */
// //         const sheets = allSheets.filter((s) => {
// //           const type =
// //             s.name ||
// //             s.sheetName ||
// //             s.category ||
// //             s.type ||
// //             "";
// //           const lower = type.toLowerCase();

// //           return (
// //             lower.includes("ott") ||
// //             lower.includes("video") ||
// //             lower.includes("adwidget")
// //           );
// //         });

// //         const from = new Date(customFrom);
// //         const to = new Date(customTo);

// //         let impressions = 0;
// //         let clicks = 0;
// //         let spend = 0;

// //         const adTypeMap = { ott: 0, video: 0, adwidget: 0 };
// //         const last7Map = {};

// //         sheets.forEach((sheet) => {
// //           const adType = (sheet.name || "").toLowerCase();

// //           (sheet.data || []).forEach((row) => {
// //             const e = {};
// //             Object.keys(row).forEach(
// //               (k) => (e[k.trim().toLowerCase()] = row[k])
// //             );

// //             const d = parseDate(
// //               e.date ||
// //                 e.day ||
// //                 e.reportdate ||
// //                 e.report_date ||
// //                 e["report date"] ||
// //                 e["date"]
// //             );

// //             if (!d) return;

// //             const rowDate = new Date(d.toDateString());
// //             const fromDate = new Date(from.toDateString());
// //             const toDate = new Date(to.toDateString());

// //             if (rowDate < fromDate || rowDate > toDate) return;

// //             const imp = toNumber(
// //               e.impressions ||
// //                 e.impression ||
// //                 e["total impressions"]
// //             );

// //             const clk = toNumber(
// //               e.clicks ||
// //                 e.click ||
// //                 e["total clicks"]
// //             );

// //             const cpm = toNumber(e.cpm);
// //             const cpc = toNumber(e.cpc);

// //             impressions += imp;
// //             clicks += clk;

// //             let rowSpend = 0;
// //             if (cpc > 0) rowSpend = clk * cpc;
// //             else if (cpm > 0) rowSpend = (imp / 1000) * cpm;

// //             spend += rowSpend;

// //             if (adTypeMap[adType] !== undefined)
// //               adTypeMap[adType] += imp;

// //             /* ===== LAST 7 DAYS (Publisher logic) ===== */
// //             const key = rowDate.toISOString().slice(0, 10);

// //             last7Map[key] ??= { impressions: 0, clicks: 0 };
// //             last7Map[key].impressions += imp;
// //             last7Map[key].clicks += clk;
// //           });
// //         });

// //         /* PIE */
// //         const pie = Object.keys(adTypeMap).map((k) => ({
// //           name: k.toUpperCase(),
// //           value: adTypeMap[k],
// //         }));

// //         /* LAST 7 DAYS */
// //         const last7 = Object.keys(last7Map)
// //           .sort()
// //           .slice(-7)
// //           .map((d) => ({
// //             date: d,
// //             impressions: last7Map[d].impressions,
// //             clicks: last7Map[d].clicks,
// //           }));

// //         const ctr =
// //           impressions > 0
// //             ? ((clicks / impressions) * 100).toFixed(2)
// //             : "0.00";

// //         const cpm =
// //           impressions > 0
// //             ? ((spend / impressions) * 1000).toFixed(2)
// //             : "0.00";

// //         setTotals({
// //           impressions,
// //           clicks,
// //           ctr,
// //           cpm,
// //           spend: spend.toFixed(2),
// //         });

// //         setPieData(pie);
// //         setLast7Days(last7);
// //       } catch (err) {
// //         console.error("Advertiser dashboard error:", err);
// //       }
// //     };

// //     fetchData();
// //   }, [customFrom, customTo]);

// //   /* ================= UI ================= */

// //   return (
// //     <div style={{ padding: 24, background: "#f9fafb" }}>
// //       <div
// //         style={{
// //           display: "flex",
// //           justifyContent: "space-between",
// //           marginBottom: 20,
// //         }}
// //       >
// //         <h2>📊 Advertiser Dashboard</h2>

// //         <div>
// //           <select
// //             value={datePreset}
// //             onChange={(e) => setDatePreset(e.target.value)}
// //           >
// //             <option value="yesterday">Yesterday</option>
// //             <option value="lastweek">Last 7 Days</option>
// //             <option value="lastmonth">Last Month</option>
// //             <option value="custom">Custom</option>
// //           </select>

// //           {datePreset === "custom" && (
// //             <>
// //               <input
// //                 type="date"
// //                 value={customFrom}
// //                 onChange={(e) => setCustomFrom(e.target.value)}
// //               />
// //               <input
// //                 type="date"
// //                 value={customTo}
// //                 onChange={(e) => setCustomTo(e.target.value)}
// //               />
// //             </>
// //           )}
// //         </div>
// //       </div>

// //       <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
// //         <Card title="Impressions" value={totals.impressions} />
// //         <Card title="Clicks" value={totals.clicks} />
// //         <Card title="CTR %" value={totals.ctr} />
// //         <Card title="CPM $" value={totals.cpm} />
// //         <Card title="Spend $" value={totals.spend} />
// //       </div>

// //       <div style={{ display: "flex", gap: 20 }}>
// //        <div style={{ flex: 1, background: "#fff", padding: 20 }}>
// //   <h3>Impressions by AdType</h3>
// //   <ResponsiveContainer width="100%" height={320}>
// //     <PieChart>
// //       <Pie data={pieData} dataKey="value" outerRadius={110}>
// //         {pieData.map((_, i) => (
// //           <Cell key={i} fill={COLORS[i % COLORS.length]} />
// //         ))}
// //       </Pie>
// //       <Legend />
// //       <Tooltip
// //         formatter={(value) => `$${value.toLocaleString()}`}
// //       />
// //     </PieChart>
// //   </ResponsiveContainer>
// // </div>

// //         <div style={{ flex: 2, background: "#fff", padding: 20 }}>
// //           <h3>Last 7 Days Performance</h3>
// //           <ResponsiveContainer width="100%" height={320}>
// //             <BarChart data={last7Days}>
// //               <CartesianGrid strokeDasharray="3 3" />
// //               <XAxis dataKey="date" />
// //               <YAxis />
// //               <Tooltip />
// //               <Legend />
// //               <Bar dataKey="impressions" fill="#007bff" />
// //               <Line dataKey="clicks" stroke="#ff4d4f" strokeWidth={3} />
// //             </BarChart>
// //           </ResponsiveContainer>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // const Card = ({ title, value }) => (
// //   <div
// //     style={{
// //       background: "#fff",
// //       padding: 20,
// //       borderRadius: 10,
// //       minWidth: 180,
// //       textAlign: "center",
// //     }}
// //   >
// //     <h4>{title}</h4>
// //     <p style={{ fontSize: 22, fontWeight: "bold" }}>{value}</p>
// //   </div>
// // );

// // export default Dashboard;

// // import React, { useEffect, useState } from "react";
// // import axios from "axios";
// // import {
// //   ResponsiveContainer,
// //   BarChart,
// //   Bar,
// //   XAxis,
// //   YAxis,
// //   Tooltip,
// //   CartesianGrid,
// //   Legend,
// //   Line,
// //   PieChart,
// //   Pie,
// //   Cell,
// // } from "recharts";

// // /* ================= HELPERS ================= */

// // const toNumber = (v) => {
// //   const n = parseFloat(v);
// //   return isNaN(n) ? 0 : n;
// // };

// // const parseDate = (value) => {
// //   if (!value) return null;

// //   if (typeof value === "number") {
// //     const epoch = new Date(Date.UTC(1899, 11, 30));
// //     return new Date(epoch.getTime() + value * 86400000);
// //   }

// //   if (typeof value === "string") {
// //     const cleaned = value.trim();
// //     const iso = new Date(cleaned);
// //     if (!isNaN(iso.getTime())) return iso;

// //     const parts = cleaned.split(/[-/]/);
// //     if (parts.length === 3) {
// //       const [d, m, y] = parts;
// //       const parsed = new Date(`${y}-${m}-${d}`);
// //       if (!isNaN(parsed.getTime())) return parsed;
// //     }
// //   }

// //   return null;
// // };

// // const COLORS = ["#007bff", "#ff4d4f", "#28a745"];

// // /* ================= SKELETON ================= */

// // const skeletonStyle = {
// //   background: "linear-gradient(90deg, #eee 25%, #ddd 37%, #eee 63%)",
// //   backgroundSize: "400% 100%",
// //   animation: "shimmer 1.4s ease infinite",
// // };

// // const shimmerKeyframes = `
// // @keyframes shimmer {
// //   0% { background-position: -400px 0; }
// //   100% { background-position: 400px 0; }
// // }
// // `;

// // /* ================= DASHBOARD ================= */

// // const Dashboard = () => {
// //   const [loading, setLoading] = useState(false);

// //   const [totals, setTotals] = useState({
// //     impressions: 0,
// //     clicks: 0,
// //     ctr: "0.00",
// //     cpm: "0.00",
// //     spend: "0.00",
// //   });

// //   const [pieData, setPieData] = useState([]);
// //   const [last7Days, setLast7Days] = useState([]);

// //   const [datePreset, setDatePreset] = useState("lastweek");
// //   const [customFrom, setCustomFrom] = useState("");
// //   const [customTo, setCustomTo] = useState("");

// //   useEffect(() => {
// //     const style = document.createElement("style");
// //     style.innerHTML = shimmerKeyframes;
// //     document.head.appendChild(style);
// //     return () => document.head.removeChild(style);
// //   }, []);

// //   /* ================= DATE PRESETS ================= */

// //   const applyPreset = (preset) => {
// //     const today = new Date();
// //     let from, to;

// //     if (preset === "yesterday") {
// //       from = new Date(today);
// //       from.setDate(today.getDate() - 1);
// //       to = new Date(from);
// //     }

// //     if (preset === "lastweek") {
// //       to = new Date(today);
// //       from = new Date(today);
// //       from.setDate(today.getDate() - 7);
// //     }

// //     if (preset === "lastmonth") {
// //       to = new Date(today);
// //       from = new Date(today);
// //       from.setMonth(today.getMonth() - 1);
// //     }

// //     setCustomFrom(from.toISOString().slice(0, 10));
// //     setCustomTo(to.toISOString().slice(0, 10));
// //   };

// //   useEffect(() => {
// //     if (datePreset !== "custom") applyPreset(datePreset);
// //   }, [datePreset]);

// //   /* ================= FETCH ================= */

// //   useEffect(() => {
// //     if (!customFrom || !customTo) return;

// //     const fetchData = async () => {
// //       try {
// //         setLoading(true);

// //         const jwt = JSON.parse(localStorage.getItem("jwt"));
// //         const token = jwt?.token;
// //         if (!token) return;

// //         const res = await axios.get(
// //           "https://imediareports.onrender.com/api/getallsheets",
// //           { headers: { Authorization: `Bearer ${token}` } }
// //         );

// //         const sheets = res.data.filter((s) => {
// //           const type =
// //             s.name ||
// //             s.sheetName ||
// //             s.category ||
// //             s.type ||
// //             "";
// //           const lower = type.toLowerCase();

// //           return (
// //             lower.includes("ott") ||
// //             lower.includes("video") ||
// //             lower.includes("adwidget")
// //           );
// //         });

// //         const from = new Date(customFrom);
// //         const to = new Date(customTo);

// //         let impressions = 0;
// //         let clicks = 0;
// //         let spend = 0;

// //         const adTypeMap = { ott: 0, video: 0, adwidget: 0 };
// //         const last7Map = {};

// //         sheets.forEach((sheet) => {
// //           const adType = (sheet.name || "").toLowerCase();

// //           (sheet.data || []).forEach((row) => {
// //             const e = {};
// //             Object.keys(row).forEach(
// //               (k) => (e[k.trim().toLowerCase()] = row[k])
// //             );

// //             const d = parseDate(
// //               e.date ||
// //                 e.day ||
// //                 e.reportdate ||
// //                 e.report_date ||
// //                 e["report date"]
// //             );

// //             if (!d) return;

// //             const rowDate = new Date(d.toDateString());
// //             const fromDate = new Date(from.toDateString());
// //             const toDate = new Date(to.toDateString());

// //             if (rowDate < fromDate || rowDate > toDate) return;

// //             const imp = toNumber(
// //               e.impressions ||
// //                 e.impression ||
// //                 e["total impressions"]
// //             );

// //             const clk = toNumber(
// //               e.clicks ||
// //                 e.click ||
// //                 e["total clicks"]
// //             );

// //             const cpm = toNumber(e.cpm);
// //             const cpc = toNumber(e.cpc);

// //             impressions += imp;
// //             clicks += clk;

// //             let rowSpend = 0;
// //             if (cpc > 0) rowSpend = clk * cpc;
// //             else if (cpm > 0) rowSpend = (imp / 1000) * cpm;

// //             spend += rowSpend;

// //             if (adTypeMap[adType] !== undefined)
// //               adTypeMap[adType] += imp;

// //             const key = rowDate.toISOString().slice(0, 10);
// //             last7Map[key] ??= { impressions: 0, clicks: 0 };
// //             last7Map[key].impressions += imp;
// //             last7Map[key].clicks += clk;
// //           });
// //         });

// //         const pie = Object.keys(adTypeMap).map((k) => ({
// //           name: k.toUpperCase(),
// //           value: adTypeMap[k],
// //         }));

// //         const last7 = Object.keys(last7Map)
// //           .sort()
// //           .slice(-7)
// //           .map((d) => ({
// //             date: d,
// //             impressions: last7Map[d].impressions,
// //             clicks: last7Map[d].clicks,
// //           }));

// //         const ctr =
// //           impressions > 0
// //             ? ((clicks / impressions) * 100).toFixed(2)
// //             : "0.00";

// //         const cpm =
// //           impressions > 0
// //             ? ((spend / impressions) * 1000).toFixed(2)
// //             : "0.00";

// //         setTotals({
// //           impressions,
// //           clicks,
// //           ctr,
// //           cpm,
// //           spend: spend.toFixed(2),
// //         });

// //         setPieData(pie);
// //         setLast7Days(last7);
// //       } catch (err) {
// //         console.error(err);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchData();
// //   }, [customFrom, customTo]);

// //   /* ================= UI ================= */

// //   return (
// //     <div style={{ padding: 24, background: "#f9fafb" }}>
// //       <h2>📊 Advertiser Dashboard</h2>

// //       {/* SUMMARY */}
// //       <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
// //         {loading
// //           ? Array(5)
// //               .fill(0)
// //               .map((_, i) => (
// //                 <div
// //                   key={i}
// //                   style={{
// //                     ...skeletonStyle,
// //                     height: 90,
// //                     borderRadius: 10,
// //                     minWidth: 180,
// //                   }}
// //                 />
// //               ))
// //           : (
// //             <>
// //               <Card title="Impressions" value={totals.impressions} />
// //               <Card title="Clicks" value={totals.clicks} />
// //               <Card title="CTR %" value={totals.ctr} />
// //               <Card title="CPM $" value={totals.cpm} />
// //               <Card title="Spend $" value={totals.spend} />
// //             </>
// //           )}
// //       </div>

// //       {/* CHARTS */}
// //       <div style={{ display: "flex", gap: 20 }}>
// //         <div style={{ flex: 1, background: "#fff", padding: 20 }}>
// //           <h3>Impressions by AdType</h3>

// //           {loading ? (
// //             <div style={{ ...skeletonStyle, height: 320 }} />
// //           ) : (
// //             <ResponsiveContainer width="100%" height={320}>
// //               <PieChart>
// //                 <Pie data={pieData} dataKey="value" outerRadius={110}>
// //                   {pieData.map((_, i) => (
// //                     <Cell key={i} fill={COLORS[i % COLORS.length]} />
// //                   ))}
// //                 </Pie>
// //                 <Legend />
// //                 <Tooltip formatter={(v) => `$${v.toLocaleString()}`} />
// //               </PieChart>
// //             </ResponsiveContainer>
// //           )}
// //         </div>

// //         <div style={{ flex: 2, background: "#fff", padding: 20 }}>
// //           <h3>Last 7 Days Performance</h3>

// //           {loading ? (
// //             <div style={{ ...skeletonStyle, height: 320 }} />
// //           ) : (
// //             <ResponsiveContainer width="100%" height={320}>
// //               <BarChart data={last7Days}>
// //                 <CartesianGrid strokeDasharray="3 3" />
// //                 <XAxis dataKey="date" />
// //                 <YAxis />
// //                 <Tooltip />
// //                 <Legend />
// //                 <Bar dataKey="impressions" fill="#007bff" />
// //                 <Line dataKey="clicks" stroke="#ff4d4f" strokeWidth={3} />
// //               </BarChart>
// //             </ResponsiveContainer>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // const Card = ({ title, value }) => (
// //   <div
// //     style={{
// //       background: "#fff",
// //       padding: 20,
// //       borderRadius: 10,
// //       minWidth: 180,
// //       textAlign: "center",
// //     }}
// //   >
// //     <h4>{title}</h4>
// //     <p style={{ fontSize: 22, fontWeight: "bold" }}>{value}</p>
// //   </div>
// // );

// // export default Dashboard;


// // import React, { useEffect, useState } from "react";
// // import axios from "axios";
// // import {
// //   ResponsiveContainer,
// //   BarChart,
// //   Bar,
// //   XAxis,
// //   YAxis,
// //   Tooltip,
// //   CartesianGrid,
// //   Legend,
// //   Line,
// //   PieChart,
// //   Pie,
// //   Cell,
// // } from "recharts";

// // /* ================= HELPERS ================= */

// // const toNumber = (v) => {
// //   const n = parseFloat(v);
// //   return isNaN(n) ? 0 : n;
// // };

// // const parseDate = (value) => {
// //   if (!value) return null;

// //   if (typeof value === "number") {
// //     const epoch = new Date(Date.UTC(1899, 11, 30));
// //     return new Date(epoch.getTime() + value * 86400000);
// //   }

// //   if (typeof value === "string") {
// //     const cleaned = value.trim();
// //     const iso = new Date(cleaned);
// //     if (!isNaN(iso.getTime())) return iso;

// //     const parts = cleaned.split(/[-/]/);
// //     if (parts.length === 3) {
// //       const [d, m, y] = parts;
// //       const parsed = new Date(`${y}-${m}-${d}`);
// //       if (!isNaN(parsed.getTime())) return parsed;
// //     }
// //   }

// //   return null;
// // };

// // const COLORS = ["#007bff", "#ff4d4f", "#28a745"];

// // /* ================= SKELETON ================= */

// // const skeletonStyle = {
// //   background: "linear-gradient(90deg, #eee 25%, #ddd 37%, #eee 63%)",
// //   backgroundSize: "400% 100%",
// //   animation: "shimmer 1.4s ease infinite",
// // };

// // const shimmerKeyframes = `
// // @keyframes shimmer {
// //   0% { background-position: -400px 0; }
// //   100% { background-position: 400px 0; }
// // }
// // `;

// // /* ================= DASHBOARD ================= */

// // const Dashboard = () => {
// //   const [loading, setLoading] = useState(false);

// //   const [totals, setTotals] = useState({
// //     impressions: 0,
// //     clicks: 0,
// //     ctr: "0.00",
// //     cpm: "0.00",
// //     spend: "0.00",
// //   });

// //   const [pieData, setPieData] = useState([]);
// //   const [last7Days, setLast7Days] = useState([]);

// //   const [datePreset, setDatePreset] = useState("lastweek");
// //   const [customFrom, setCustomFrom] = useState("");
// //   const [customTo, setCustomTo] = useState("");

// //   /* shimmer css */
// //   useEffect(() => {
// //     const style = document.createElement("style");
// //     style.innerHTML = shimmerKeyframes;
// //     document.head.appendChild(style);
// //     return () => document.head.removeChild(style);
// //   }, []);

// //   /* ================= DATE PRESETS ================= */

// //   const applyPreset = (preset) => {
// //     const today = new Date();
// //     let from, to;

// //     if (preset === "yesterday") {
// //       from = new Date(today);
// //       from.setDate(today.getDate() - 1);
// //       to = new Date(from);
// //     }

// //     if (preset === "lastweek") {
// //       to = new Date(today);
// //       from = new Date(today);
// //       from.setDate(today.getDate() - 7);
// //     }

// //     if (preset === "lastmonth") {
// //       to = new Date(today);
// //       from = new Date(today);
// //       from.setMonth(today.getMonth() - 1);
// //     }

// //     setCustomFrom(from.toISOString().slice(0, 10));
// //     setCustomTo(to.toISOString().slice(0, 10));
// //   };

// //   useEffect(() => {
// //     if (datePreset !== "custom") applyPreset(datePreset);
// //   }, [datePreset]);

// //   /* ================= FETCH ================= */

// //   useEffect(() => {
// //     if (!customFrom || !customTo) return;

// //     const fetchData = async () => {
// //       try {
// //         setLoading(true);

// //         const jwt = JSON.parse(localStorage.getItem("jwt"));
// //         const token = jwt?.token;
// //         if (!token) return;

// //         const res = await axios.get(
// //           "https://imediareports.onrender.com/api/getallsheets",
// //           { headers: { Authorization: `Bearer ${token}` } }
// //         );

// //         const sheets = res.data.filter((s) => {
// //           const type =
// //             s.name ||
// //             s.sheetName ||
// //             s.category ||
// //             s.type ||
// //             "";
// //           const lower = type.toLowerCase();

// //           return (
// //             lower.includes("ott") ||
// //             lower.includes("video") ||
// //             lower.includes("adwidget")
// //           );
// //         });

// //         const from = new Date(customFrom);
// //         const to = new Date(customTo);

// //         let impressions = 0;
// //         let clicks = 0;
// //         let spend = 0;

// //         const adTypeMap = { ott: 0, video: 0, adwidget: 0 };
// //         const last7Map = {};

// //         sheets.forEach((sheet) => {
// //           const adType = (sheet.name || "").toLowerCase();

// //           (sheet.data || []).forEach((row) => {
// //             const e = {};
// //             Object.keys(row).forEach(
// //               (k) => (e[k.trim().toLowerCase()] = row[k])
// //             );

// //             const d = parseDate(
// //               e.date ||
// //                 e.day ||
// //                 e.reportdate ||
// //                 e.report_date ||
// //                 e["report date"]
// //             );

// //             if (!d) return;

// //             const rowDate = new Date(d.toDateString());
// //             const fromDate = new Date(from.toDateString());
// //             const toDate = new Date(to.toDateString());

// //             if (rowDate < fromDate || rowDate > toDate) return;

// //             const imp = toNumber(
// //               e.impressions ||
// //                 e.impression ||
// //                 e["total impressions"]
// //             );

// //             const clk = toNumber(
// //               e.clicks ||
// //                 e.click ||
// //                 e["total clicks"]
// //             );

// //             const cpm = toNumber(e.cpm);
// //             const cpc = toNumber(e.cpc);

// //             impressions += imp;
// //             clicks += clk;

// //             let rowSpend = 0;
// //             if (cpc > 0) rowSpend = clk * cpc;
// //             else if (cpm > 0) rowSpend = (imp / 1000) * cpm;

// //             spend += rowSpend;

// //             if (adTypeMap[adType] !== undefined)
// //               adTypeMap[adType] += imp;

// //             const key = rowDate.toISOString().slice(0, 10);
// //             last7Map[key] ??= { impressions: 0, clicks: 0 };
// //             last7Map[key].impressions += imp;
// //             last7Map[key].clicks += clk;
// //           });
// //         });

// //         const pie = Object.keys(adTypeMap).map((k) => ({
// //           name: k.toUpperCase(),
// //           value: adTypeMap[k],
// //         }));

// //         const last7 = Object.keys(last7Map)
// //           .sort()
// //           .slice(-7)
// //           .map((d) => ({
// //             date: d,
// //             impressions: last7Map[d].impressions,
// //             clicks: last7Map[d].clicks,
// //           }));

// //         const ctr =
// //           impressions > 0
// //             ? ((clicks / impressions) * 100).toFixed(2)
// //             : "0.00";

// //         const cpm =
// //           impressions > 0
// //             ? ((spend / impressions) * 1000).toFixed(2)
// //             : "0.00";

// //         setTotals({
// //           impressions,
// //           clicks,
// //           ctr,
// //           cpm,
// //           spend: spend.toFixed(2),
// //         });

// //         setPieData(pie);
// //         setLast7Days(last7);
// //       } catch (err) {
// //         console.error(err);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchData();
// //   }, [customFrom, customTo]);

// //   /* ================= UI ================= */

// //   return (
// //     <div style={{ padding: 24, background: "#f9fafb" }}>
// //       {/* FILTER */}
// //       <div
// //         style={{
// //           display: "flex",
// //           justifyContent: "space-between",
// //           marginBottom: 20,
// //         }}
// //       >
// //         <h2>📊 Advertiser Dashboard</h2>

// //         <div
// //   style={{
// //     display: "flex",
// //     alignItems: "center",
// //     gap: "10px",
// //     flexWrap: "wrap",
// //   }}
// // >
// //   <select
// //     value={datePreset}
// //     onChange={(e) => setDatePreset(e.target.value)}
// //     style={{
// //       padding: "8px 14px",
// //       borderRadius: "6px",
// //       border: "1px solid #dcdcdc",
// //       outline: "none",
// //       fontSize: "14px",
// //       fontWeight: 500,
// //       background: "#fff",
// //       cursor: "pointer",
// //       transition: "all 0.25s ease",
// //       boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
// //     }}
// //     onFocus={(e) => {
// //       e.target.style.border = "1px solid #007bff";
// //       e.target.style.boxShadow = "0 0 0 2px rgba(0,123,255,0.15)";
// //     }}
// //     onBlur={(e) => {
// //       e.target.style.border = "1px solid #dcdcdc";
// //       e.target.style.boxShadow = "0 2px 6px rgba(0,0,0,0.08)";
// //     }}
// //   >
// //     <option value="yesterday">Yesterday</option>
// //     <option value="lastweek">Last 7 Days</option>
// //     <option value="lastmonth">Last Month</option>
// //     <option value="custom">Custom</option>
// //   </select>

// //   {datePreset === "custom" && (
// //     <>
// //       <input
// //         type="date"
// //         value={customFrom}
// //         onChange={(e) => setCustomFrom(e.target.value)}
// //         style={{
// //           padding: "8px 12px",
// //           borderRadius: "6px",
// //           border: "1px solid #dcdcdc",
// //           outline: "none",
// //           fontSize: "14px",
// //           background: "#fff",
// //           transition: "all 0.25s ease",
// //           boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
// //         }}
// //         onFocus={(e) => {
// //           e.target.style.border = "1px solid #007bff";
// //           e.target.style.boxShadow =
// //             "0 0 0 2px rgba(0,123,255,0.15)";
// //         }}
// //         onBlur={(e) => {
// //           e.target.style.border = "1px solid #dcdcdc";
// //           e.target.style.boxShadow =
// //             "0 2px 6px rgba(0,0,0,0.08)";
// //         }}
// //       />

// //       <input
// //         type="date"
// //         value={customTo}
// //         onChange={(e) => setCustomTo(e.target.value)}
// //         style={{
// //           padding: "8px 12px",
// //           borderRadius: "6px",
// //           border: "1px solid #dcdcdc",
// //           outline: "none",
// //           fontSize: "14px",
// //           background: "#fff",
// //           transition: "all 0.25s ease",
// //           boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
// //         }}
// //         onFocus={(e) => {
// //           e.target.style.border = "1px solid #007bff";
// //           e.target.style.boxShadow =
// //             "0 0 0 2px rgba(0,123,255,0.15)";
// //         }}
// //         onBlur={(e) => {
// //           e.target.style.border = "1px solid #dcdcdc";
// //           e.target.style.boxShadow =
// //             "0 2px 6px rgba(0,0,0,0.08)";
// //         }}
// //       />
// //     </>
// //   )}
// // </div>
// //       </div>

// //       {/* SUMMARY */}
// //       <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
// //         {loading
// //           ? Array(5)
// //               .fill(0)
// //               .map((_, i) => (
// //                 <div
// //                   key={i}
// //                   style={{
// //                     ...skeletonStyle,
// //                     height: 90,
// //                     borderRadius: 10,
// //                     minWidth: 180,
// //                   }}
// //                 />
// //               ))
// //           : (
// //             <>
// //             <Card
// //   title="Impressions"
// //   value={Number(totals.impressions).toLocaleString()}
// // />
// //               <Card title="Clicks" value={Number(totals.clicks).toLocaleString()} />
// //               <Card title="CTR %" value={`${totals.ctr}%`} />
// //               <Card title="CPM %" value={`${totals.cpm}%`} />
// //               <Card title="Spend $" value={`$${totals.spend}`} />
// //             </>
// //           )}
// //       </div>

// //       {/* CHARTS */}
// //       <div style={{ display: "flex", gap: 20 }}>
// //         <div style={{ flex: 1, background: "#fff", padding: 20 }}>
// //           <h3>Impressions by AdType</h3>

// //           {loading ? (
// //             <div style={{ ...skeletonStyle, height: 320 }} />
// //           ) : (
// //             <ResponsiveContainer width="100%" height={320}>
// //               <PieChart>
// //                 <Pie data={pieData} dataKey="value" outerRadius={110} >
// //                   {pieData.map((_, i) => (
// //                     <Cell key={i} fill={COLORS[i % COLORS.length]}  />
// //                   ))}
// //                 </Pie>
// //                 <Legend />
// //                 <Tooltip formatter={(v) => `${v.toLocaleString()}`} />
// //               </PieChart>
// //             </ResponsiveContainer>
// //           )}
// //         </div>

// //         <div style={{ flex: 2, background: "#fff", padding: 20 }}>
// //           <h3>Last 7 Days Performance</h3>

// //           {loading ? (
// //             <div style={{ ...skeletonStyle, height: 320 }} />
// //           ) : (
// //             <ResponsiveContainer width="100%" height={320}>
// //               <BarChart data={last7Days}>
// //                 <CartesianGrid strokeDasharray="3 3" />
// //                 <XAxis dataKey="date" />
// //                 <YAxis />
// //                 <Tooltip />
// //                 <Legend />
// //                 <Bar dataKey="impressions" fill="#007bff" />
// //                 <Line dataKey="clicks" stroke="#ff4d4f" strokeWidth={3} />
// //               </BarChart>
// //             </ResponsiveContainer>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // const Card = ({ title, value }) => (
// //   <div
// //     style={{
// //       background: "#fff",
// //       padding: 20,
// //       borderRadius: 10,
// //       minWidth: 180,
// //       textAlign: "center",
// //     }}
// //   >
// //     <h4>{title}</h4>
// //     <p style={{ fontSize: 22, fontWeight: "bold" }}>{value}</p>
// //   </div>
// // );

// // export default Dashboard;

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
//   PieChart,
//   Pie,
//   Cell,
// } from "recharts";

// /* ================= HELPERS ================= */

// const toNumber = (v) => {
//   if (v === null || v === undefined || v === "") return 0;
//   const n = parseFloat(String(v).replace(/[^0-9.-]+/g, ""));
//   return isNaN(n) ? 0 : n;
// };

// const parseDate = (value) => {
//   if (!value) return null;

//   if (typeof value === "number") {
//     const epoch = new Date(Date.UTC(1899, 11, 30));
//     return new Date(epoch.getTime() + value * 86400000);
//   }

//   if (typeof value === "string") {
//     const cleaned = value.trim();
//     const iso = new Date(cleaned);
//     if (!isNaN(iso.getTime())) return iso;

//     const parts = cleaned.split(/[-/]/);
//     if (parts.length === 3) {
//       const [d, m, y] = parts;
//       const parsed = new Date(`${y}-${m}-${d}`);
//       if (!isNaN(parsed.getTime())) return parsed;
//     }
//   }

//   return null;
// };

// /**
//  * Classify a sheet name (already lowercased) into OTT | VIDEO | ADWIDGET | null
//  */
// const classifySheet = (lower) => {
//   if (lower.includes("ott") || lower.includes("ctv") || lower.includes("connected tv") || lower.includes("streaming"))
//     return "OTT";
//   if (lower.includes("video") || lower.includes("preroll") || lower.includes("pre-roll") || lower.includes("instream"))
//     return "VIDEO";
//   if (lower.includes("adwidget") || lower.includes("display") || lower.includes("widget") || lower.includes("banner"))
//     return "ADWIDGET";
//   return null;
// };

// /**
//  * Extract spend from a normalized (lowercased) row.
//  * Priority: spend column → revenue column → CPC → CPM
//  */
// const extractSpend = (e, imp, clk) => {
//   // Check for any key containing "spend" first, then "revenue"
//   const spendKey = Object.keys(e).find((k) => k.includes("spend"));
//   const revenueKey = Object.keys(e).find((k) => k.includes("revenue"));

//   if (spendKey) {
//     const val = toNumber(e[spendKey]);
//     if (val > 0) return val;
//   }
//   if (revenueKey) {
//     const val = toNumber(e[revenueKey]);
//     if (val > 0) return val;
//   }

//   // Fallback: CPC → CPM
//   const cpc = toNumber(e.cpc);
//   const cpm = toNumber(e.cpm);
//   if (cpc > 0) return clk * cpc;
//   if (cpm > 0) return (imp / 1000) * cpm;

//   return 0;
// };

// const COLORS = ["#007bff", "#ff4d4f", "#28a745"];

// /* ================= SKELETON ================= */

// const skeletonStyle = {
//   background: "linear-gradient(90deg, #eee 25%, #ddd 37%, #eee 63%)",
//   backgroundSize: "400% 100%",
//   animation: "shimmer 1.4s ease infinite",
// };

// const shimmerKeyframes = `
// @keyframes shimmer {
//   0% { background-position: -400px 0; }
//   100% { background-position: 400px 0; }
// }
// `;

// /* ================= DASHBOARD ================= */

// const Dashboard = () => {
//   const [loading, setLoading] = useState(false);

//   const [totals, setTotals] = useState({
//     impressions: 0,
//     clicks: 0,
//     ctr: "0.00",
//     cpm: "0.00",
//     spend: "0.00",
//   });

//   const [pieData, setPieData] = useState([]);
//   const [last7Days, setLast7Days] = useState([]);

//   const [datePreset, setDatePreset] = useState("lastweek");
//   const [customFrom, setCustomFrom] = useState("");
//   const [customTo, setCustomTo] = useState("");

//   /* shimmer css */
//   useEffect(() => {
//     const style = document.createElement("style");
//     style.innerHTML = shimmerKeyframes;
//     document.head.appendChild(style);
//     return () => document.head.removeChild(style);
//   }, []);

//   /* ================= DATE PRESETS ================= */

//   const applyPreset = (preset) => {
//     const today = new Date();
//     let from, to;

//     if (preset === "yesterday") {
//       from = new Date(today);
//       from.setDate(today.getDate() - 1);
//       to = new Date(from);
//     }
//     if (preset === "lastweek") {
//       to = new Date(today);
//       from = new Date(today);
//       from.setDate(today.getDate() - 7);
//     }
//     if (preset === "lastmonth") {
//       to = new Date(today);
//       from = new Date(today);
//       from.setMonth(today.getMonth() - 1);
//     }

//     setCustomFrom(from.toISOString().slice(0, 10));
//     setCustomTo(to.toISOString().slice(0, 10));
//   };

//   useEffect(() => {
//     if (datePreset !== "custom") applyPreset(datePreset);
//   }, [datePreset]);

//   /* ================= FETCH ================= */

//   useEffect(() => {
//     if (!customFrom || !customTo) return;

//     const fetchData = async () => {
//       try {
//         setLoading(true);

//         const jwt = JSON.parse(localStorage.getItem("jwt"));
//         const token = jwt?.token;
//         if (!token) return;

//         const res = await axios.get(
//           "https://imediareports.onrender.com/api/getallsheets",
//           { headers: { Authorization: `Bearer ${token}` } }
//         );

//         // Filter only OTT / Video / AdWidget sheets
//         const sheets = res.data.filter((s) => {
//           const lower = (s.name || s.sheetName || s.category || s.type || "").toLowerCase();
//           return lower.includes("ott") || lower.includes("video") || lower.includes("adwidget");
//         });

//         const from = new Date(customFrom);
//         const to = new Date(customTo);

//         let totalImpressions = 0;
//         let totalClicks = 0;
//         let totalSpend = 0;

//         // ✅ FIX: Keys are OTT | VIDEO | ADWIDGET, classified from sheet name
//         const adTypeImpressions = { OTT: 0, VIDEO: 0, ADWIDGET: 0 };
//         const last7Map = {};

//         sheets.forEach((sheet) => {
//           // ✅ FIX: Classify properly instead of using full sheet name as key
//           const sheetNameLower = (sheet.name || "").toLowerCase().trim();
//           const adType = classifySheet(sheetNameLower);

//           console.log(`📄 "${sheet.name}" → ${adType ?? "UNCLASSIFIED"}`);

//           (sheet.data || []).forEach((row) => {
//             // Normalize keys: trim + lowercase
//             const e = {};
//             Object.keys(row).forEach((k) => {
//               e[k.trim().toLowerCase()] = row[k];
//             });

//             const d = parseDate(
//               e.date || e.day || e.reportdate || e.report_date || e["report date"]
//             );
//             if (!d) return;

//             const rowDate = new Date(d.toDateString());
//             const fromDate = new Date(from.toDateString());
//             const toDate = new Date(to.toDateString());
//             if (rowDate < fromDate || rowDate > toDate) return;

//             const imp = toNumber(
//               e.impressions ?? e.impression ?? e["total impressions"]
//             );
//             const clk = toNumber(
//               e.clicks ?? e.click ?? e["total clicks"]
//             );

//             totalImpressions += imp;
//             totalClicks += clk;

//             // ✅ FIX: Extract spend column first (adwidget has "spend" column)
//             const rowSpend = extractSpend(e, imp, clk);
//             totalSpend += rowSpend;

//             // ✅ FIX: Bucket impressions using classified adType, not raw sheet name
//             if (adType && adTypeImpressions[adType] !== undefined) {
//               adTypeImpressions[adType] += imp;
//             }

//             const key = rowDate.toISOString().slice(0, 10);
//             last7Map[key] ??= { impressions: 0, clicks: 0 };
//             last7Map[key].impressions += imp;
//             last7Map[key].clicks += clk;
//           });
//         });

//         console.log("📊 Impressions by Ad Type:", adTypeImpressions);
//         console.log("💰 Total Spend:", totalSpend);

//         // Only show ad types with impressions > 0
//         const pie = Object.keys(adTypeImpressions)
//           .map((k) => ({ name: k, value: adTypeImpressions[k] }))
//           .filter((item) => item.value > 0);

//         const last7 = Object.keys(last7Map)
//           .sort()
//           .slice(-7)
//           .map((d) => ({
//             date: d,
//             impressions: last7Map[d].impressions,
//             clicks: last7Map[d].clicks,
//           }));

//         const ctr =
//           totalImpressions > 0
//             ? ((totalClicks / totalImpressions) * 100).toFixed(2)
//             : "0.00";

//         const avgCpm =
//           totalImpressions > 0
//             ? ((totalSpend / totalImpressions) * 1000).toFixed(2)
//             : "0.00";

//         setTotals({
//           impressions: totalImpressions,
//           clicks: totalClicks,
//           ctr,
//           cpm: avgCpm,
//           spend: totalSpend.toFixed(2),
//         });

//         setPieData(pie);
//         setLast7Days(last7);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [customFrom, customTo]);

//   /* ================= UI ================= */

//   const inputStyle = {
//     padding: "8px 12px",
//     borderRadius: "6px",
//     border: "1px solid #dcdcdc",
//     outline: "none",
//     fontSize: "14px",
//     background: "#fff",
//     transition: "all 0.25s ease",
//     boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
//   };

//   const focusStyle = (e) => {
//     e.target.style.border = "1px solid #007bff";
//     e.target.style.boxShadow = "0 0 0 2px rgba(0,123,255,0.15)";
//   };
//   const blurStyle = (e) => {
//     e.target.style.border = "1px solid #dcdcdc";
//     e.target.style.boxShadow = "0 2px 6px rgba(0,0,0,0.08)";
//   };

//   return (
//     <div style={{ padding: 24, background: "#f9fafb", minHeight: "100vh" }}>
//       {/* HEADER */}
//       <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20, alignItems: "center" }}>
//         <h2 style={{ margin: 0 }}>📊 Advertiser Dashboard</h2>

//         <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
//           <select
//             value={datePreset}
//             onChange={(e) => setDatePreset(e.target.value)}
//             style={{ ...inputStyle, fontWeight: 500, cursor: "pointer", padding: "8px 14px" }}
//             onFocus={focusStyle}
//             onBlur={blurStyle}
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
//                 style={inputStyle}
//                 onFocus={focusStyle}
//                 onBlur={blurStyle}
//               />
//               <span>to</span>
//               <input
//                 type="date"
//                 value={customTo}
//                 onChange={(e) => setCustomTo(e.target.value)}
//                 style={inputStyle}
//                 onFocus={focusStyle}
//                 onBlur={blurStyle}
//               />
//             </>
//           )}
//         </div>
//       </div>

//       {/* SUMMARY CARDS */}
//       <div style={{ display: "flex", gap: 20, marginBottom: 20, flexWrap: "wrap" }}>
//         {loading
//           ? Array(5).fill(0).map((_, i) => (
//               <div key={i} style={{ ...skeletonStyle, height: 90, borderRadius: 10, minWidth: 180, flex: 1 }} />
//             ))
//           : (
//             <>
//               <Card title="Impressions" value={Number(totals.impressions).toLocaleString()} />
//               <Card title="Clicks" value={Number(totals.clicks).toLocaleString()} />
//               <Card title="CTR" value={`${totals.ctr}%`} />
//               <Card title="Avg CPM" value={`$${totals.cpm}`} />
//               <Card title="Total Spend" value={`$${Number(totals.spend).toLocaleString()}`} />
//             </>
//           )}
//       </div>

//       {/* CHARTS */}
//       <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
//         {/* PIE — Impressions by Ad Type */}
//         <div style={{ flex: 1, minWidth: 300, background: "#fff", padding: 20, borderRadius: 10, boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
//           <h3 style={{ marginTop: 0 }}>Impressions by Ad Type</h3>
//           {loading ? (
//             <div style={{ ...skeletonStyle, height: 320, borderRadius: 8 }} />
//           ) : (
//             <ResponsiveContainer width="100%" height={320}>
//               <PieChart>
//                 <Pie
//                   data={pieData}
//                   dataKey="value"
//                   nameKey="name"
//                   outerRadius={110}
//                   label={({ name, value }) =>
//                     `${name}: ${Number(value).toLocaleString()}`
//                   }
//                 >
//                   {pieData.map((_, i) => (
//                     <Cell key={i} fill={COLORS[i % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Legend />
//                 <Tooltip formatter={(v) => Number(v).toLocaleString()} />
//               </PieChart>
//             </ResponsiveContainer>
//           )}
//         </div>

//         {/* BAR — Last 7 Days Impressions + Clicks */}
//         {/* ✅ FIX: Removed <Line> from inside <BarChart> — Line only works in LineChart */}
//         <div style={{ flex: 2, minWidth: 360, background: "#fff", padding: 20, borderRadius: 10, boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
//           <h3 style={{ marginTop: 0 }}>Last 7 Days Performance</h3>
//           {loading ? (
//             <div style={{ ...skeletonStyle, height: 320, borderRadius: 8 }} />
//           ) : (
//             <ResponsiveContainer width="100%" height={320}>
//               <BarChart data={last7Days}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="date" tick={{ fontSize: 11 }} />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Bar dataKey="impressions" fill="#007bff" radius={[4, 4, 0, 0]} />
//                 <Bar dataKey="clicks" fill="#ff4d4f" radius={[4, 4, 0, 0]} />
//               </BarChart>
//             </ResponsiveContainer>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// const Card = ({ title, value }) => (
//   <div
//     style={{
//       background: "#fff",
//       padding: 20,
//       borderRadius: 10,
//       minWidth: 160,
//       flex: 1,
//       textAlign: "center",
//       boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
//     }}
//   >
//     <h4 style={{ margin: "0 0 8px", color: "#666", fontSize: 13 }}>{title}</h4>
//     <p style={{ fontSize: 22, fontWeight: "bold", margin: 0 }}>{value}</p>
//   </div>
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
  PieChart,
  Pie,
  Cell,
} from "recharts";

/* ================= HELPERS ================= */

const toNumber = (v) => {
  if (v === null || v === undefined || v === "") return 0;
  const n = parseFloat(String(v).replace(/[^0-9.-]+/g, ""));
  return isNaN(n) ? 0 : n;
};

const parseDate = (value) => {
  if (!value) return null;

  if (typeof value === "number") {
    const epoch = new Date(Date.UTC(1899, 11, 30));
    return new Date(epoch.getTime() + value * 86400000);
  }

  if (typeof value === "string") {
    const cleaned = value.trim();
    const iso = new Date(cleaned);
    if (!isNaN(iso.getTime())) return iso;

    const parts = cleaned.split(/[-/]/);
    if (parts.length === 3) {
      const [d, m, y] = parts;
      const parsed = new Date(`${y}-${m}-${d}`);
      if (!isNaN(parsed.getTime())) return parsed;
    }
  }

  return null;
};

/**
 * Classify a sheet name (already lowercased) into OTT | VIDEO | ADWIDGET | null
 */
const classifySheet = (lower) => {
  if (lower.includes("ott") || lower.includes("ctv") || lower.includes("connected tv") || lower.includes("streaming"))
    return "OTT";
  if (lower.includes("video") || lower.includes("preroll") || lower.includes("pre-roll") || lower.includes("instream"))
    return "VIDEO";
  if (lower.includes("adwidget") || lower.includes("display") || lower.includes("widget") || lower.includes("banner"))
    return "ADWIDGET";
  return null;
};

/**
 * Extract spend from a normalized (lowercased) row.
 * Priority: spend column → revenue column → CPC → CPM
 */
const extractSpend = (e, imp, clk) => {
  // Check for any key containing "spend" first, then "revenue"
  const spendKey = Object.keys(e).find((k) => k.includes("spend"));
  const revenueKey = Object.keys(e).find((k) => k.includes("revenue"));

  if (spendKey) {
    const val = toNumber(e[spendKey]);
    if (val > 0) return val;
  }
  if (revenueKey) {
    const val = toNumber(e[revenueKey]);
    if (val > 0) return val;
  }

  // Fallback: CPC → CPM
  const cpc = toNumber(e.cpc);
  const cpm = toNumber(e.cpm);
  if (cpc > 0) return clk * cpc;
  if (cpm > 0) return (imp / 1000) * cpm;

  return 0;
};

const COLORS = ["#007bff", "#ff4d4f", "#28a745"];

/* ================= SKELETON ================= */

const skeletonStyle = {
  background: "linear-gradient(90deg, #eee 25%, #ddd 37%, #eee 63%)",
  backgroundSize: "400% 100%",
  animation: "shimmer 1.4s ease infinite",
};

const shimmerKeyframes = `
@keyframes shimmer {
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
}
`;

/* ================= DASHBOARD ================= */

const Dashboard = () => {
  const [loading, setLoading] = useState(false);

  const [totals, setTotals] = useState({
    impressions: 0,
    clicks: 0,
    ctr: "0.00",
    cpm: "0.00",
    spend: "0.00",
  });

  const [pieData, setPieData] = useState([]);
  const [last7Days, setLast7Days] = useState([]);

  const [datePreset, setDatePreset] = useState("lastweek");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  /* shimmer css */
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = shimmerKeyframes;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  /* ================= DATE PRESETS ================= */

  const applyPreset = (preset) => {
    const today = new Date();
    let from, to;

    if (preset === "yesterday") {
      from = new Date(today);
      from.setDate(today.getDate() - 1);
      to = new Date(from);
    }
    if (preset === "lastweek") {
      to = new Date(today);
      from = new Date(today);
      from.setDate(today.getDate() - 7);
    }
    if (preset === "lastmonth") {
      to = new Date(today);
      from = new Date(today);
      from.setMonth(today.getMonth() - 1);
    }

    setCustomFrom(from.toISOString().slice(0, 10));
    setCustomTo(to.toISOString().slice(0, 10));
  };

  useEffect(() => {
    if (datePreset !== "custom") applyPreset(datePreset);
  }, [datePreset]);

  /* ================= FETCH ================= */

  useEffect(() => {
    if (!customFrom || !customTo) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const jwt = JSON.parse(localStorage.getItem("jwt"));
        const token = jwt?.token;
        if (!token) return;

        const res = await axios.get(
          "https://imediareports.onrender.com/api/getallsheets",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Filter only OTT / Video / AdWidget sheets
        const sheets = res.data.filter((s) => {
          const lower = (s.name || s.sheetName || s.category || s.type || "").toLowerCase();
          return lower.includes("ott") || lower.includes("video") || lower.includes("adwidget");
        });

        const from = new Date(customFrom);
        const to = new Date(customTo);

        let totalImpressions = 0;
        let totalClicks = 0;
        let totalSpend = 0;

        // ✅ FIX: Keys are OTT | VIDEO | ADWIDGET, classified from sheet name
        const adTypeImpressions = { OTT: 0, VIDEO: 0, ADWIDGET: 0 };
        const last7Map = {};

        sheets.forEach((sheet) => {
          // ✅ FIX: Classify properly instead of using full sheet name as key
          const sheetNameLower = (sheet.name || "").toLowerCase().trim();
          const adType = classifySheet(sheetNameLower);

          console.log(`📄 "${sheet.name}" → ${adType ?? "UNCLASSIFIED"}`);

          (sheet.data || []).forEach((row) => {
            // Normalize keys: trim + lowercase
            const e = {};
            Object.keys(row).forEach((k) => {
              e[k.trim().toLowerCase()] = row[k];
            });

            const d = parseDate(
              e.date || e.day || e.reportdate || e.report_date || e["report date"]
            );
            if (!d) return;

            const rowDate = new Date(d.toDateString());
            const fromDate = new Date(from.toDateString());
            const toDate = new Date(to.toDateString());
            if (rowDate < fromDate || rowDate > toDate) return;

            const imp = toNumber(
              e.impressions ?? e.impression ?? e["total impressions"] ?? e.imps ?? e.imp
            );
            const clk = toNumber(
              e.clicks ?? e.click ?? e["total clicks"]
            );

            totalImpressions += imp;
            totalClicks += clk;

            // ✅ FIX: Extract spend column first (adwidget has "spend" column)
            const rowSpend = extractSpend(e, imp, clk);
            totalSpend += rowSpend;

            // ✅ FIX: Bucket impressions using classified adType, not raw sheet name
            if (adType && adTypeImpressions[adType] !== undefined) {
              adTypeImpressions[adType] += imp;
            }

            const key = rowDate.toISOString().slice(0, 10);
            last7Map[key] ??= { impressions: 0, clicks: 0 };
            last7Map[key].impressions += imp;
            last7Map[key].clicks += clk;
          });
        });

        console.log("📊 Impressions by Ad Type:", adTypeImpressions);
        console.log("💰 Total Spend:", totalSpend);

        // Only show ad types with impressions > 0
        const pie = Object.keys(adTypeImpressions)
          .map((k) => ({ name: k, value: adTypeImpressions[k] }))
          .filter((item) => item.value > 0);

        const last7 = Object.keys(last7Map)
          .sort()
          .slice(-7)
          .map((d) => ({
            date: d,
            impressions: last7Map[d].impressions,
            clicks: last7Map[d].clicks,
          }));

        const ctr =
          totalImpressions > 0
            ? ((totalClicks / totalImpressions) * 100).toFixed(2)
            : "0.00";

        const avgCpm =
          totalImpressions > 0
            ? ((totalSpend / totalImpressions) * 1000).toFixed(2)
            : "0.00";

        setTotals({
          impressions: totalImpressions,
          clicks: totalClicks,
          ctr,
          cpm: avgCpm,
          spend: totalSpend.toFixed(2),
        });

        setPieData(pie);
        setLast7Days(last7);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [customFrom, customTo]);

  /* ================= UI ================= */

  const inputStyle = {
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid #dcdcdc",
    outline: "none",
    fontSize: "14px",
    background: "#fff",
    transition: "all 0.25s ease",
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
  };

  const focusStyle = (e) => {
    e.target.style.border = "1px solid #007bff";
    e.target.style.boxShadow = "0 0 0 2px rgba(0,123,255,0.15)";
  };
  const blurStyle = (e) => {
    e.target.style.border = "1px solid #dcdcdc";
    e.target.style.boxShadow = "0 2px 6px rgba(0,0,0,0.08)";
  };

  return (
    <div style={{ padding: 24, background: "#f9fafb", minHeight: "100vh" }}>
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20, alignItems: "center" }}>
        <h2 style={{ margin: 0 }}>📊 Advertiser Dashboard</h2>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <select
            value={datePreset}
            onChange={(e) => setDatePreset(e.target.value)}
            style={{ ...inputStyle, fontWeight: 500, cursor: "pointer", padding: "8px 14px" }}
            onFocus={focusStyle}
            onBlur={blurStyle}
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
                style={inputStyle}
                onFocus={focusStyle}
                onBlur={blurStyle}
              />
              <span>to</span>
              <input
                type="date"
                value={customTo}
                onChange={(e) => setCustomTo(e.target.value)}
                style={inputStyle}
                onFocus={focusStyle}
                onBlur={blurStyle}
              />
            </>
          )}
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div style={{ display: "flex", gap: 20, marginBottom: 20, flexWrap: "wrap" }}>
        {loading
          ? Array(5).fill(0).map((_, i) => (
              <div key={i} style={{ ...skeletonStyle, height: 90, borderRadius: 10, minWidth: 180, flex: 1 }} />
            ))
          : (
            <>
              <Card title="Impressions" value={Number(totals.impressions).toLocaleString()} />
              <Card title="Clicks" value={Number(totals.clicks).toLocaleString()} />
              <Card title="CTR" value={`${totals.ctr}%`} />
              <Card title="Avg CPM" value={`$${totals.cpm}`} />
              <Card title="Total Spend" value={`$${Number(totals.spend).toLocaleString()}`} />
            </>
          )}
      </div>

      {/* CHARTS */}
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        {/* PIE — Impressions by Ad Type */}
        <div style={{ flex: 1, minWidth: 300, background: "#fff", padding: 20, borderRadius: 10, boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
          <h3 style={{ marginTop: 0 }}>Impressions by Ad Type</h3>
          {loading ? (
            <div style={{ ...skeletonStyle, height: 320, borderRadius: 8 }} />
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={110}
                  label={({ name, value }) =>
                    `${name}: ${Number(value).toLocaleString()}`
                  }
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip formatter={(v) => Number(v).toLocaleString()} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* BAR — Last 7 Days Impressions + Clicks */}
        {/* ✅ FIX: Removed <Line> from inside <BarChart> — Line only works in LineChart */}
        <div style={{ flex: 2, minWidth: 360, background: "#fff", padding: 20, borderRadius: 10, boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
          <h3 style={{ marginTop: 0 }}>Last 7 Days Performance</h3>
          {loading ? (
            <div style={{ ...skeletonStyle, height: 320, borderRadius: 8 }} />
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={last7Days}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="impressions" fill="#007bff" radius={[4, 4, 0, 0]} />
                <Bar dataKey="clicks" fill="#ff4d4f" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

const Card = ({ title, value }) => (
  <div
    style={{
      background: "#fff",
      padding: 20,
      borderRadius: 10,
      minWidth: 160,
      flex: 1,
      textAlign: "center",
      boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
    }}
  >
    <h4 style={{ margin: "0 0 8px", color: "#666", fontSize: 13 }}>{title}</h4>
    <p style={{ fontSize: 22, fontWeight: "bold", margin: 0 }}>{value}</p>
  </div>
);

export default Dashboard;
