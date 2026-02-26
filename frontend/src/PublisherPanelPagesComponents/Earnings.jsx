

// // // import React, { useEffect, useState } from "react";
// // // import axios from "axios";
// // // import {
// // //   BarChart,
// // //   Bar,
// // //   XAxis,
// // //   YAxis,
// // //   Tooltip,
// // //   ResponsiveContainer,
// // //   PieChart,
// // //   Pie,
// // //   Cell,
// // //   Legend,
// // // } from "recharts";

// // // /* ========= CONFIG ========= */
// // // const COLORS = ["#00C49F", "#FFBB28", "#0088FE", "#FF8042"];
// // // const CPM_VALUE = 2.5;

// // // /* ========= HELPERS ========= */
// // // const normalize = (s = "") =>
// // //   s.toLowerCase().trim().replace(/\s+/g, "").replace(/_/g, "");

// // // const num = (v) => {
// // //   if (!v || v === "") return 0;
// // //   if (typeof v === "string") return Number(v.replace(/,/g, "")) || 0;
// // //   return Number(v) || 0;
// // // };

// // // const convertDate = (serial) => {
// // //   const n = num(serial);
// // //   if (!n) return "";
// // //   const epoch = new Date(1899, 11, 30);
// // //   const d = new Date(epoch.getTime() + n * 86400000);
// // //   return d.toISOString().slice(0, 10);
// // // };

// // // const findValueByKeys = (row, keys = []) => {
// // //   const map = {};
// // //   Object.keys(row).forEach(
// // //     (k) => (map[k.toLowerCase().replace(/\s+/g, "")] = k)
// // //   );
// // //   for (const key of keys) {
// // //     const match = Object.keys(map).find((nk) => nk.includes(key));
// // //     if (match) return num(row[map[match]]);
// // //   }
// // //   return 0;
// // // };

// // // const findDate = (row) => {
// // //   const keys = ["date", "day", "timestamp", "createddate", "reportdate"];
// // //   const map = {};
// // //   Object.keys(row).forEach((k) => (map[k.toLowerCase()] = k));

// // //   for (const k of keys) {
// // //     if (map[k]) {
// // //       const raw = row[map[k]];
// // //       return convertDate(num(raw)) || (typeof raw === "string" ? raw : "");
// // //     }
// // //   }

// // //   return (
// // //     convertDate(num(row["Date"])) ||
// // //     convertDate(num(row["Day"])) ||
// // //     "---"
// // //   );
// // // };

// // // export default function Earnings() {
// // //   const [activePlatform, setActivePlatform] = useState("overall");
// // //   const [selectedCampaign, setSelectedCampaign] = useState("All");

// // //   const [metrics, setMetrics] = useState({
// // //     revenue: 0,
// // //     impressions: 0,
// // //     clicks: 0,
// // //     ctr: 0,
// // //   });

// // //   const [campaignList, setCampaignList] = useState([]);
// // //   const [chartData, setChartData] = useState([]);
// // //   const [tableData, setTableData] = useState([]);

// // //   const [adWidgetMetrics, setAdWidgetMetrics] = useState({
// // //     revenue: 0,
// // //     impressions: 0,
// // //     clicks: 0,
// // //     ctr: 0,
// // //   });

// // //   const [adWidgetDailyRows, setAdWidgetDailyRows] = useState([]);
// // //   const [adWidgetChart, setAdWidgetChart] = useState([]);

// // //   const [showAllRows, setShowAllRows] = useState(false);
// // //   const [showAllRowsAD, setShowAllRowsAD] = useState(false);

// // //   useEffect(() => {
// // //     loadData();
// // //   }, [activePlatform, selectedCampaign]);

// // //   const loadData = async () => {
// // //     try {
// // //       const user = JSON.parse(localStorage.getItem("jwt"))?.user;
// // //       if (!user?.name) return;

// // //       const res = await axios.get("http://localhost:5000/api/getalldata");
// // //       const allSheets = res?.data?.sheets || [];

// // //       let publisherSheets = allSheets.filter(
// // //         (s) =>
// // //           normalize(s?.publisher || s?.uploadedByName || "") ===
// // //           normalize(user.name)
// // //       );

// // //       publisherSheets = publisherSheets.filter(
// // //         (s) => !["summary", "totals", "overall"].includes(normalize(s.name))
// // //       );

// // //       setCampaignList([...new Set(publisherSheets.map((s) => s.campaign))]);

// // //       const isVideo = (n) =>
// // //         normalize(n).includes("video") ||
// // //         normalize(n).includes("yt") ||
// // //         normalize(n).includes("youtube");

// // //       const isOtt = (n) =>
// // //         normalize(n).includes("ott") ||
// // //         normalize(n).includes("hotstar") ||
// // //         normalize(n).includes("zee");

// // //       const isAdWidget = (n) =>
// // //         normalize(n).includes("adwidget") ||
// // //         normalize(n).includes("widget") ||
// // //         normalize(n).includes("adwid");

// // //       const videoSheets = publisherSheets.filter((s) => isVideo(s.name));
// // //       const ottSheets = publisherSheets.filter((s) => isOtt(s.name));
// // //       const adSheets = publisherSheets.filter((s) => isAdWidget(s.name));

// // //       const byCamp = (s) =>
// // //         selectedCampaign === "All"
// // //           ? true
// // //           : normalize(s.campaign) === normalize(selectedCampaign);

// // //       const videoFiltered = videoSheets.filter(byCamp);
// // //       const ottFiltered = ottSheets.filter(byCamp);
// // //       const adFiltered = adSheets.filter(byCamp);

// // //       const computeCPM = (sheets) => {
// // //         const rows = sheets.flatMap((s) => s.data || []);
// // //         const impressions = rows.reduce(
// // //           (a, r) =>
// // //             a +
// // //             findValueByKeys(r, [
// // //               "impressions",
// // //               "views",
// // //               "imp",
// // //               "impression",
// // //             ]),
// // //           0
// // //         );
// // //         const clicks = rows.reduce(
// // //           (a, r) => a + findValueByKeys(r, ["clicks", "npclick", "click"]),
// // //           0
// // //         );
// // //         const ctr = impressions ? (clicks / impressions) * 100 : 0;
// // //         const revenue = (impressions / 1000) * CPM_VALUE;

// // //         return { impressions, clicks, ctr, revenue };
// // //       };

// // //       let pool = publisherSheets;
// // //       if (activePlatform === "video") pool = videoFiltered;
// // //       else if (activePlatform === "ott") pool = ottFiltered;
// // //       else if (activePlatform === "adwidget") pool = adFiltered;

// // //       const mainMetrics = computeCPM(pool);
// // //       setMetrics({
// // //         revenue: mainMetrics.revenue.toFixed(2),
// // //         impressions: mainMetrics.impressions,
// // //         clicks: mainMetrics.clicks,
// // //         ctr: mainMetrics.ctr.toFixed(2),
// // //       });

// // //       if (activePlatform !== "adwidget") {
// // //         setTableData(
// // //           pool.flatMap((sheet) =>
// // //             (sheet.data || []).map((r) => {
// // //               const imps = findValueByKeys(r, [
// // //                 "impressions",
// // //                 "views",
// // //                 "imp",
// // //               ]);
// // //               const clicks = findValueByKeys(r, [
// // //                 "clicks",
// // //                 "npclick",
// // //                 "click",
// // //               ]);
// // //               const ctr = imps ? ((clicks / imps) * 100).toFixed(2) : 0;
// // //               const revenue = ((imps / 1000) * CPM_VALUE).toFixed(2);

// // //               return {
// // //                 date: findDate(r),
// // //                 imps,
// // //                 clicks,
// // //                 ctr,
// // //                 revenue,
// // //               };
// // //             })
// // //           )
// // //         );
// // //       }

// // //       /* ========== ADWIDGET TABLE ========== */
// // //       if (adSheets.length) {
// // //         setAdWidgetDailyRows(
// // //           adFiltered.flatMap((sheet) =>
// // //             (sheet.data || []).map((r) => {
// // //               const imps = findValueByKeys(r, [
// // //                 "impressions",
// // //                 "views",
// // //                 "imp",
// // //               ]);
// // //               const clicks = findValueByKeys(r, ["clicks", "npclick"]);
// // //               const ctr = imps ? ((clicks / imps) * 100).toFixed(2) : 0;
// // //               const revenue = ((imps / 1000) * CPM_VALUE).toFixed(2);

// // //               return { date: findDate(r), imps, clicks, ctr, revenue };
// // //             })
// // //           )
// // //         );

// // //         const adMetrics = computeCPM(adFiltered);
// // //         setAdWidgetMetrics({
// // //           revenue: adMetrics.revenue.toFixed(2),
// // //           impressions: adMetrics.impressions,
// // //           clicks: adMetrics.clicks,
// // //           ctr: adMetrics.ctr.toFixed(2),
// // //         });

// // //         const adChart = {};
// // //         adFiltered.forEach((sheet) => {
// // //           const rev = (sheet.data || []).reduce((a, r) => {
// // //             const imps = findValueByKeys(r, ["impressions", "views", "imp"]);
// // //             return a + (imps / 1000) * CPM_VALUE;
// // //           }, 0);
// // //           adChart[sheet.campaign] = (adChart[sheet.campaign] || 0) + rev;
// // //         });

// // //         setAdWidgetChart(
// // //           Object.entries(adChart).map(([name, revenue]) => ({
// // //             name,
// // //             revenue: Number(revenue.toFixed(2)),
// // //           }))
// // //         );
// // //       }

// // //       /* ========== OTHER CHARTS ========== */
// // //       const revChart = {};
// // //       pool.forEach((sheet) => {
// // //         const rev = (sheet.data || []).reduce((a, r) => {
// // //           const imps = findValueByKeys(r, ["impressions", "views", "imp"]);
// // //           return a + (imps / 1000) * CPM_VALUE;
// // //         }, 0);
// // //         revChart[sheet.campaign] = (revChart[sheet.campaign] || 0) + rev;
// // //       });

// // //       setChartData(
// // //         Object.entries(revChart).map(([name, revenue]) => ({
// // //           name,
// // //           revenue: Number(revenue.toFixed(2)),
// // //         }))
// // //       );
// // //     } catch (err) {
// // //       console.error("🔥 Earnings Error:", err);
// // //     }
// // //   };

// // //   const visibleRows = showAllRows
// // //     ? tableData
// // //     : tableData.slice(0, 7);

// // //   const visibleRowsAD = showAllRowsAD
// // //     ? adWidgetDailyRows
// // //     : adWidgetDailyRows.slice(0, 7);

// // //   /* ===== UI ===== */
// // //   return (
// // //     <div style={styles.container}>
// // //       <aside style={styles.sidebar}>
// // //         <h2 style={styles.menuTitle}>Earnings Menu</h2>

// // //         {["overall", "video", "ott", "adwidget"].map((p) => (
// // //           <button
// // //             key={p}
// // //             onClick={() => setActivePlatform(p)}
// // //             style={{
// // //               ...styles.menuBtn,
// // //               background: activePlatform === p ? "#00C49F" : "transparent",
// // //             }}
// // //           >
// // //             {p.toUpperCase()}
// // //           </button>
// // //         ))}

// // //         <div style={{ marginTop: 25 }}>
// // //           <h3 style={{ color: "#fff" }}>Campaigns</h3>
// // //           <select
// // //             value={selectedCampaign}
// // //             onChange={(e) => setSelectedCampaign(e.target.value)}
// // //             style={styles.select}
// // //           >
// // //             <option value="All">All</option>
// // //             {campaignList.map((c, i) => (
// // //               <option key={i} value={c}>
// // //                 {c}
// // //               </option>
// // //             ))}
// // //           </select>
// // //         </div>
// // //       </aside>

// // //       <main style={styles.main}>
// // //         {activePlatform === "adwidget" ? (
// // //           <>
// // //             <h2 style={styles.title}>ADWIDGET Earnings</h2>

// // //             <div style={{ ...styles.metricsRow, animation: "fadeIn 0.5s" }}>
// // //               <div style={styles.metricBox}>
// // //                 <h4>Revenue</h4>
// // //                 <p>${adWidgetMetrics.revenue}</p>
// // //               </div>
// // //               <div style={styles.metricBox}>
// // //                 <h4>Impressions</h4>
// // //                 <p>{adWidgetMetrics.impressions.toLocaleString()}</p>
// // //               </div>
// // //               <div style={styles.metricBox}>
// // //                 <h4>Clicks</h4>
// // //                 <p>{adWidgetMetrics.clicks.toLocaleString()}</p>
// // //               </div>
// // //               <div style={styles.metricBox}>
// // //                 <h4>CTR</h4>
// // //                 <p>{adWidgetMetrics.ctr}%</p>
// // //               </div>
// // //             </div>

// // //             <div style={{ ...styles.card, animation: "slideIn 0.5s" }}>
// // //               <h3>Daily Data</h3>
// // //               <table style={styles.table}>
// // //                 <thead>
// // //                   <tr>
// // //                     <th style={styles.th}>Date</th>
// // //                     <th style={styles.th}>Impressions</th>
// // //                     <th style={styles.th}>Clicks</th>
// // //                     <th style={styles.th}>CTR</th>
// // //                     <th style={styles.th}>Revenue</th>
// // //                   </tr>
// // //                 </thead>
// // //                 <tbody>
// // //                   {visibleRowsAD.map((row, i) => (
// // //                     <tr key={i}>
// // //                       <td style={styles.td}>{row.date}</td>
// // //                       <td style={styles.td}>{row.imps}</td>
// // //                       <td style={styles.td}>{row.clicks}</td>
// // //                       <td style={styles.td}>{row.ctr}%</td>
// // //                       <td style={styles.td}>${row.revenue}</td>
// // //                     </tr>
// // //                   ))}
// // //                 </tbody>
// // //               </table>

// // //               {adWidgetDailyRows.length > 7 && (
// // //                 <button
// // //                   onClick={() => setShowAllRowsAD(!showAllRowsAD)}
// // //                   style={styles.viewBtn}
// // //                 >
// // //                   {showAllRowsAD ? "View Less ▲" : "View More ▼"}
// // //                 </button>
// // //               )}
// // //             </div>

// // //             <div style={styles.chartRow}>
// // //               <div style={styles.card}>
// // //                 <h3>Revenue Share</h3>
// // //                 <ResponsiveContainer width="100%" height={300}>
// // //                   <PieChart>
// // //                     <Pie
// // //                       data={adWidgetChart}
// // //                       dataKey="revenue"
// // //                       nameKey="name"
// // //                       outerRadius={110}
// // //                       label
// // //                     >
// // //                       {adWidgetChart.map((_, i) => (
// // //                         <Cell key={i} fill={COLORS[i % COLORS.length]} />
// // //                       ))}
// // //                     </Pie>
// // //                   </PieChart>
// // //                 </ResponsiveContainer>
// // //               </div>

// // //               <div style={styles.card}>
// // //                 <h3>Revenue Trend</h3>
// // //                 <ResponsiveContainer width="100%" height={300}>
// // //                   <BarChart data={adWidgetChart}>
// // //                     <XAxis dataKey="name" />
// // //                     <YAxis />
// // //                     <Tooltip />
// // //                     <Bar dataKey="revenue" fill="#00C49F" />
// // //                   </BarChart>
// // //                 </ResponsiveContainer>
// // //               </div>
// // //             </div>
// // //           </>
// // //         ) : (
// // //           <>
// // //             <h2 style={styles.title}>
// // //               {activePlatform.toUpperCase()} Earnings
// // //             </h2>

// // //             <div style={{ ...styles.metricsRow, animation: "fadeIn 0.5s" }}>
// // //               <div style={styles.metricBox}>
// // //                 <h4>Revenue</h4>
// // //                 <p>${metrics.revenue}</p>
// // //               </div>
// // //               <div style={styles.metricBox}>
// // //                 <h4>Impressions</h4>
// // //                 <p>{metrics.impressions.toLocaleString()}</p>
// // //               </div>
// // //               <div style={styles.metricBox}>
// // //                 <h4>Clicks</h4>
// // //                 <p>{metrics.clicks.toLocaleString()}</p>
// // //               </div>
// // //               <div style={styles.metricBox}>
// // //                 <h4>CTR</h4>
// // //                 <p>{metrics.ctr}%</p>
// // //               </div>
// // //             </div>

// // //             {activePlatform !== "overall" && (
// // //               <div style={{ ...styles.card, animation: "slideIn 0.5s" }}>
// // //                 <h3>Data Table</h3>
// // //                 <table style={styles.table}>
// // //                   <thead>
// // //                     <tr>
// // //                       <th style={styles.th}>Date</th>
// // //                       <th style={styles.th}>Impressions</th>
// // //                       <th style={styles.th}>Clicks</th>
// // //                       <th style={styles.th}>CTR</th>
// // //                       <th style={styles.th}>Revenue</th>
// // //                     </tr>
// // //                   </thead>
// // //                   <tbody>
// // //                     {visibleRows.map((row, i) => (
// // //                       <tr key={i}>
// // //                         <td style={styles.td}>{row.date}</td>
// // //                         <td style={styles.td}>{row.imps}</td>
// // //                         <td style={styles.td}>{row.clicks}</td>
// // //                         <td style={styles.td}>{row.ctr}%</td>
// // //                         <td style={styles.td}>${row.revenue}</td>
// // //                       </tr>
// // //                     ))}
// // //                   </tbody>
// // //                 </table>

// // //                 {tableData.length > 7 && (
// // //                   <button
// // //                     onClick={() => setShowAllRows(!showAllRows)}
// // //                     style={styles.viewBtn}
// // //                   >
// // //                     {showAllRows ? "View Less ▲" : "View More ▼"}
// // //                   </button>
// // //                 )}
// // //               </div>
// // //             )}

// // //             <div style={styles.chartRow}>
// // //               <div style={styles.card}>
// // //                 <h3>Revenue Share</h3>
// // //                 <ResponsiveContainer width="100%" height={300}>
// // //                   <PieChart>
// // //                     <Pie
// // //                       data={chartData}
// // //                       dataKey="revenue"
// // //                       nameKey="name"
// // //                       outerRadius={110}
// // //                       label
// // //                     >
// // //                       {chartData.map((_, i) => (
// // //                         <Cell key={i} fill={COLORS[i % COLORS.length]} />
// // //                       ))}
// // //                     </Pie>
// // //                   </PieChart>
// // //                 </ResponsiveContainer>
// // //               </div>

// // //               <div style={styles.card}>
// // //                 <h3>Revenue Trend</h3>
// // //                 <ResponsiveContainer width="100%" height={300}>
// // //                   <BarChart data={chartData}>
// // //                     <XAxis dataKey="name" />
// // //                     <YAxis />
// // //                     <Tooltip />
// // //                     <Bar dataKey="revenue" fill="#00C49F" />
// // //                   </BarChart>
// // //                 </ResponsiveContainer>
// // //               </div>
// // //             </div>
// // //           </>
// // //         )}
// // //       </main>
// // //     </div>
// // //   );
// // // }

// // // /* ===== STYLES ===== */
// // // const styles = {
// // //   container: {
// // //     display: "flex",
// // //     minHeight: "100vh",
// // //     background: "#f1f4f9",
// // //     alignItems: "flex-start", // ✅ FIXED VERTICAL GAP
// // //   },
// // //   sidebar: {
// // //     width: "240px",
// // //     background: "#002b36",
// // //     color: "#fff",
// // //     padding: "20px",
// // //     height: "100vh",
// // //     position: "fixed",
// // //     left: 0,
// // //     top: 0,
// // //     overflowY: "auto",
// // //   },
// // //   main: {
// // //     flex: 1,
// // //     padding: "20px 30px 30px 30px",
// // //     // marginLeft: "240px",
// // //     marginTop: "0px",
// // //   },
// // //   menuTitle: {
// // //     fontSize: "18px",
// // //     fontWeight: "bold",
// // //     marginBottom: "20px",
// // //   },
// // //   menuBtn: {
// // //     width: "100%",
// // //     padding: "12px",
// // //     borderRadius: "6px",
// // //     marginBottom: "12px",
// // //     border: "none",
// // //     cursor: "pointer",
// // //     color: "#fff",
// // //     fontSize: "16px",
// // //     transition: "0.2s ease",
// // //   },
// // //   select: {
// // //     width: "100%",
// // //     padding: "10px",
// // //     borderRadius: "6px",
// // //     marginTop: "10px",
// // //   },
// // //   title: {
// // //     fontSize: "26px",
// // //     fontWeight: "bold",
// // //     marginBottom: "20px",
// // //     marginTop: "0px", // ✅ FIX: remove gap
// // //   },
// // //   metricsRow: {
// // //     display: "flex",
// // //     gap: "15px",
// // //     flexWrap: "wrap",
// // //     marginBottom: "30px",
// // //   },
// // //   metricBox: {
// // //     flex: "1 1 250px",
// // //     background: "#fff",
// // //     padding: "25px",
// // //     borderRadius: "10px",
// // //     textAlign: "center",
// // //     boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
// // //     transition: "transform 0.2s",
// // //   },
// // //   card: {
// // //     background: "#fff",
// // //     padding: "20px",
// // //     borderRadius: "10px",
// // //     marginBottom: "20px",
// // //     flex: 1,
// // //     minWidth: "380px",
// // //     animation: "fadeIn 0.4s",
// // //     // marginLeft:"-10%"
// // //   },
// // //   chartRow: {
// // //     display: "flex",
// // //     gap: "20px",
// // //     flexWrap: "wrap",
// // //   },
// // //   table: {
// // //     width: "100%",
// // //     borderCollapse: "collapse",
// // //     marginTop: "15px",
// // //   },
// // //   th: {
// // //     border: "1px solid black",
// // //     padding: "10px",
// // //     background: "#ddd",
// // //   },
// // //   td: {
// // //     border: "1px solid black",
// // //     padding: "10px",
// // //   },
// // //   viewBtn: {
// // //     marginTop: "10px",
// // //     padding: "8px 12px",
// // //     borderRadius: "6px",
// // //     background: "#082f3d",
// // //     color: "#fff",
// // //     cursor: "pointer",
// // //     border: "none",
// // //     fontWeight: "600",
// // //   },
// // // };

// // import React, { useEffect, useState } from "react";
// // import axios from "axios";
// // import {
// //   BarChart,
// //   Bar,
// //   XAxis,
// //   YAxis,
// //   Tooltip,
// //   ResponsiveContainer,
// //   PieChart,
// //   Pie,
// //   Cell,
// // } from "recharts";

// // /* ========= CONFIG ========= */
// // const COLORS = ["#00C49F", "#FFBB28", "#0088FE", "#FF8042"];
// // const CPM_VALUE = 2.5;

// // /* ========= HELPERS ========= */
// // const normalize = (s = "") =>
// //   s.toLowerCase().trim().replace(/\s+/g, "").replace(/_/g, "");

// // const num = (v) => {
// //   if (!v || v === "") return 0;
// //   if (typeof v === "string") return Number(v.replace(/,/g, "")) || 0;
// //   return Number(v) || 0;
// // };

// // const convertDate = (serial) => {
// //   const n = num(serial);
// //   if (!n) return "";
// //   const epoch = new Date(1899, 11, 30);
// //   const d = new Date(epoch.getTime() + n * 86400000);
// //   return d.toISOString().slice(0, 10);
// // };

// // const findValueByKeys = (row, keys = []) => {
// //   const map = {};
// //   Object.keys(row).forEach(
// //     (k) => (map[k.toLowerCase().replace(/\s+/g, "")] = k)
// //   );
// //   for (const key of keys) {
// //     const match = Object.keys(map).find((nk) => nk.includes(key));
// //     if (match) return num(row[map[match]]);
// //   }
// //   return 0;
// // };

// // const findDate = (row) => {
// //   const keys = ["date", "day", "timestamp", "createddate", "reportdate"];
// //   const map = {};
// //   Object.keys(row).forEach((k) => (map[k.toLowerCase()] = k));

// //   for (const k of keys) {
// //     if (map[k]) {
// //       const raw = row[map[k]];
// //       return convertDate(num(raw)) || raw;
// //     }
// //   }
// //   return "---";
// // };

// // /* ========= PLATFORM DETECTORS ========= */
// // const isVideo = (name = "") =>
// //   normalize(name).includes("video") ||
// //   normalize(name).includes("yt") ||
// //   normalize(name).includes("youtube");

// // const isOtt = (name = "") =>
// //   normalize(name).includes("ott") ||
// //   normalize(name).includes("hotstar") ||
// //   normalize(name).includes("zee");

// // const isAdWidget = (name = "") =>
// //   normalize(name).includes("adwidget") ||
// //   normalize(name).includes("widget") ||
// //   normalize(name).includes("adwid");

// // export default function Earnings() {
// //   const [activePlatform, setActivePlatform] = useState("overall");
// //   const [selectedCampaign, setSelectedCampaign] = useState("All");

// //   const [campaignList, setCampaignList] = useState([]);
// //   const [metrics, setMetrics] = useState({
// //     revenue: 0,
// //     impressions: 0,
// //     clicks: 0,
// //     ctr: 0,
// //   });

// //   const [chartData, setChartData] = useState([]);

// //   useEffect(() => {
// //     loadData();
// //   }, [activePlatform, selectedCampaign]);

// //   const loadData = async () => {
// //     try {
// //       const user = JSON.parse(localStorage.getItem("jwt"))?.user;
// //       if (!user?.name) return;

// //       const res = await axios.get("https://imediareports.onrender.com/api/getalldata");
// //       const allSheets = res?.data?.sheets || [];

// //       /* ===== 1️⃣ Publisher sheets ===== */
// //       const publisherSheets = allSheets.filter(
// //         (s) =>
// //           normalize(s.publisher || s.uploadedByName) ===
// //           normalize(user.name)
// //       );

// //       /* ===== 2️⃣ Campaign list (global for publisher) ===== */
// //       setCampaignList([
// //         ...new Set(publisherSheets.map((s) => s.campaign)),
// //       ]);

// //       /* ===== 3️⃣ Platform split ===== */
// //       const videoSheets = publisherSheets.filter((s) =>
// //         isVideo(s.name)
// //       );
// //       const ottSheets = publisherSheets.filter((s) =>
// //         isOtt(s.name)
// //       );
// //       const adWidgetSheets = publisherSheets.filter((s) =>
// //         isAdWidget(s.name)
// //       );

// //       /* ===== 4️⃣ Platform pool ===== */
// //       let pool = publisherSheets;
// //       if (activePlatform === "video") pool = videoSheets;
// //       else if (activePlatform === "ott") pool = ottSheets;
// //       else if (activePlatform === "adwidget") pool = adWidgetSheets;

// //       /* ===== 5️⃣ Campaign filter ===== */
// //       if (selectedCampaign !== "All") {
// //         pool = pool.filter(
// //           (s) =>
// //             normalize(s.campaign) ===
// //             normalize(selectedCampaign)
// //         );
// //       }

// //       /* ===== 6️⃣ Flatten rows ===== */
// //       const rows = pool.flatMap((s) => s.data || []);

// //       /* ===== 7️⃣ Metrics ===== */
// //       const impressions = rows.reduce(
// //         (a, r) =>
// //           a +
// //           findValueByKeys(r, [
// //             "impressions",
// //             "views",
// //             "imp",
// //           ]),
// //         0
// //       );

// //       const clicks = rows.reduce(
// //         (a, r) =>
// //           a + findValueByKeys(r, ["clicks", "npclick"]),
// //         0
// //       );

// //       const ctr = impressions
// //         ? ((clicks / impressions) * 100).toFixed(2)
// //         : 0;

// //       const revenue = ((impressions / 1000) * CPM_VALUE).toFixed(2);

// //       setMetrics({
// //         impressions,
// //         clicks,
// //         ctr,
// //         revenue,
// //       });

// //       /* ===== 8️⃣ Chart data (by campaign) ===== */
// //       const chartMap = {};
// //       pool.forEach((sheet) => {
// //         const rev = (sheet.data || []).reduce((a, r) => {
// //           const imps = findValueByKeys(r, [
// //             "impressions",
// //             "views",
// //             "imp",
// //           ]);
// //           return a + (imps / 1000) * CPM_VALUE;
// //         }, 0);
// //         chartMap[sheet.campaign] =
// //           (chartMap[sheet.campaign] || 0) + rev;
// //       });

// //       setChartData(
// //         Object.entries(chartMap).map(([name, revenue]) => ({
// //           name,
// //           revenue: Number(revenue.toFixed(2)),
// //         }))
// //       );
// //     } catch (err) {
// //       console.error("🔥 Earnings Error:", err);
// //     }
// //   };

// //   return (
// //     <div style={styles.wrapper}>
// //       <h2 style={styles.pageTitle}>
// //         {activePlatform.toUpperCase()} Earnings
// //       </h2>

// //       {/* ===== INNER NAVBAR ===== */}
// //       <div style={styles.innerNavbar}>
// //         <div style={styles.tabs}>
// //           {["overall", "video", "ott", "adwidget"].map((p) => (
// //             <button
// //               key={p}
// //               onClick={() => setActivePlatform(p)}
// //               style={{
// //                 ...styles.tabBtn,
// //                 ...(activePlatform === p && styles.activeTab),
// //               }}
// //             >
// //               {p.toUpperCase()}
// //             </button>
// //           ))}
// //         </div>

// //         <div style={styles.filter}>
// //           <span style={styles.filterLabel}>Campaign</span>
// //           <select
// //             value={selectedCampaign}
// //             onChange={(e) => setSelectedCampaign(e.target.value)}
// //             style={styles.select}
// //           >
// //             <option value="All">All</option>
// //             {campaignList.map((c, i) => (
// //               <option key={i} value={c}>
// //                 {c}
// //               </option>
// //             ))}
// //           </select>
// //         </div>
// //       </div>

// //       {/* ===== METRICS ===== */}
// //       <div style={styles.metricsRow}>
// //         <div style={styles.metricBox}>
// //           <h4>Revenue</h4>
// //           <p>${metrics.revenue}</p>
// //         </div>
// //         <div style={styles.metricBox}>
// //           <h4>Impressions</h4>
// //           <p>{metrics.impressions.toLocaleString()}</p>
// //         </div>
// //         <div style={styles.metricBox}>
// //           <h4>Clicks</h4>
// //           <p>{metrics.clicks.toLocaleString()}</p>
// //         </div>
// //         <div style={styles.metricBox}>
// //           <h4>CTR</h4>
// //           <p>{metrics.ctr}%</p>
// //         </div>
// //       </div>

// //       {/* ===== CHART ===== */}
// //       <div style={styles.card}>
// //         <h3>Revenue Share</h3>
// //         <ResponsiveContainer width="100%" height={320}>
// //           <PieChart>
// //             <Pie
// //               data={chartData}
// //               dataKey="revenue"
// //               nameKey="name"
// //               outerRadius={120}
// //               label
// //             >
// //               {chartData.map((_, i) => (
// //                 <Cell key={i} fill={COLORS[i % COLORS.length]} />
// //               ))}
// //             </Pie>
// //           </PieChart>
// //         </ResponsiveContainer>
// //       </div>
// //     </div>
// //   );
// // }

// // /* ========= STYLES ========= */
// // const styles = {
// //   wrapper: {
// //     minHeight: "100vh",
// //     background: "#f1f4f9",
// //     padding: "24px",
// //   },
// //   pageTitle: {
// //     fontSize: "26px",
// //     fontWeight: "700",
// //     marginBottom: "16px",
// //   },
// //   innerNavbar: {
// //     display: "flex",
// //     justifyContent: "space-between",
// //     alignItems: "center",
// //     background: "#fff",
// //     padding: "12px 16px",
// //     borderRadius: "12px",
// //     marginBottom: "24px",
// //     boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
// //   },
// //   tabs: {
// //     display: "flex",
// //     gap: "10px",
// //   },
// //   tabBtn: {
// //     border: "none",
// //     padding: "8px 16px",
// //     borderRadius: "8px",
// //     background: "#eaeaea",
// //     cursor: "pointer",
// //     fontWeight: "600",
// //   },
// //   activeTab: {
// //     background: "#01303f",
// //     color: "#fff",
// //   },
// //   filter: {
// //     display: "flex",
// //     alignItems: "center",
// //     gap: "10px",
// //   },
// //   filterLabel: {
// //     fontWeight: "600",
// //   },
// //   select: {
// //     padding: "8px",
// //     borderRadius: "6px",
// //   },
// //   metricsRow: {
// //     display: "flex",
// //     gap: "15px",
// //     flexWrap: "wrap",
// //     marginBottom: "24px",
// //   },
// //   metricBox: {
// //     flex: "1 1 220px",
// //     background: "#fff",
// //     padding: "20px",
// //     borderRadius: "10px",
// //     textAlign: "center",
// //     boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
// //   },
// //   card: {
// //     background: "#fff",
// //     padding: "20px",
// //     borderRadius: "12px",
// //     boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
// //   },
// // };

// // import React, { useEffect, useState } from "react";
// // import axios from "axios";
// // import {
// //   BarChart,
// //   Bar,
// //   XAxis,
// //   YAxis,
// //   Tooltip,
// //   ResponsiveContainer,
// //   PieChart,
// //   Pie,
// //   Cell,
// // } from "recharts";

// // /* ========= CONFIG ========= */
// // const COLORS = ["#00C49F", "#FFBB28", "#0088FE", "#FF8042"];
// // const CPM_VALUE = 2.5;

// // /* ========= HELPERS ========= */
// // const normalize = (s = "") =>
// //   s.toLowerCase().trim().replace(/\s+/g, "").replace(/_/g, "");

// // const num = (v) => {
// //   if (!v || v === "") return 0;
// //   if (typeof v === "string") return Number(v.replace(/,/g, "")) || 0;
// //   return Number(v) || 0;
// // };

// // const convertDate = (serial) => {
// //   const n = num(serial);
// //   if (!n) return "";
// //   const epoch = new Date(1899, 11, 30);
// //   const d = new Date(epoch.getTime() + n * 86400000);
// //   return d.toISOString().slice(0, 10);
// // };

// // const findValueByKeys = (row, keys = []) => {
// //   const map = {};
// //   Object.keys(row).forEach(
// //     (k) => (map[k.toLowerCase().replace(/\s+/g, "")] = k)
// //   );
// //   for (const key of keys) {
// //     const match = Object.keys(map).find((nk) => nk.includes(key));
// //     if (match) return num(row[map[match]]);
// //   }
// //   return 0;
// // };

// // const findDate = (row) => {
// //   const keys = ["date", "day", "timestamp", "createddate", "reportdate"];
// //   const map = {};
// //   Object.keys(row).forEach((k) => (map[k.toLowerCase()] = k));

// //   for (const k of keys) {
// //     if (map[k]) {
// //       const raw = row[map[k]];
// //       return convertDate(num(raw)) || raw;
// //     }
// //   }
// //   return "---";
// // };

// // /* ========= PLATFORM DETECTORS ========= */
// // const isVideo = (name = "") =>
// //   normalize(name).includes("video") ||
// //   normalize(name).includes("yt") ||
// //   normalize(name).includes("youtube");

// // const isOtt = (name = "") =>
// //   normalize(name).includes("ott") ||
// //   normalize(name).includes("hotstar") ||
// //   normalize(name).includes("zee");

// // const isAdWidget = (name = "") =>
// //   normalize(name).includes("adwidget") ||
// //   normalize(name).includes("widget") ||
// //   normalize(name).includes("adwid");

// // export default function Earnings() {
// //   const [activePlatform, setActivePlatform] = useState("overall");
// //   const [selectedCampaign, setSelectedCampaign] = useState("All");

// //   const [campaignList, setCampaignList] = useState([]);
// //   const [metrics, setMetrics] = useState({
// //     revenue: 0,
// //     impressions: 0,
// //     clicks: 0,
// //     ctr: 0,
// //   });

// //   const [chartData, setChartData] = useState([]);

// //   useEffect(() => {
// //     loadData();
// //   }, [activePlatform, selectedCampaign]);

// //   const loadData = async () => {
// //     try {
// //       const user = JSON.parse(localStorage.getItem("jwt"))?.user;
// //       if (!user?.name) return;

// //       const res = await axios.get(
// //         "https://imediareports.onrender.com/api/getalldata"
// //       );
// //       const allSheets = res?.data?.sheets || [];

// //       const publisherSheets = allSheets.filter(
// //         (s) =>
// //           normalize(s.publisher || s.uploadedByName) ===
// //           normalize(user.name)
// //       );

// //       setCampaignList([
// //         ...new Set(publisherSheets.map((s) => s.campaign)),
// //       ]);

// //       const videoSheets = publisherSheets.filter((s) => isVideo(s.name));
// //       const ottSheets = publisherSheets.filter((s) => isOtt(s.name));
// //       const adWidgetSheets = publisherSheets.filter((s) =>
// //         isAdWidget(s.name)
// //       );

// //       let pool = publisherSheets;
// //       if (activePlatform === "video") pool = videoSheets;
// //       else if (activePlatform === "ott") pool = ottSheets;
// //       else if (activePlatform === "adwidget") pool = adWidgetSheets;

// //       if (selectedCampaign !== "All") {
// //         pool = pool.filter(
// //           (s) => normalize(s.campaign) === normalize(selectedCampaign)
// //         );
// //       }

// //       const rows = pool.flatMap((s) => s.data || []);

// //       const impressions = rows.reduce(
// //         (a, r) =>
// //           a +
// //           findValueByKeys(r, ["impressions", "views", "imp"]),
// //         0
// //       );

// //       const clicks = rows.reduce(
// //         (a, r) => a + findValueByKeys(r, ["clicks", "npclick"]),
// //         0
// //       );

// //       const ctr = impressions
// //         ? ((clicks / impressions) * 100).toFixed(2)
// //         : 0;

// //       const revenue = ((impressions / 1000) * CPM_VALUE).toFixed(2);

// //       setMetrics({
// //         impressions,
// //         clicks,
// //         ctr,
// //         revenue,
// //       });

// //       const chartMap = {};
// //       pool.forEach((sheet) => {
// //         const rev = (sheet.data || []).reduce((a, r) => {
// //           const imps = findValueByKeys(r, [
// //             "impressions",
// //             "views",
// //             "imp",
// //           ]);
// //           return a + (imps / 1000) * CPM_VALUE;
// //         }, 0);
// //         chartMap[sheet.campaign] =
// //           (chartMap[sheet.campaign] || 0) + rev;
// //       });

// //       setChartData(
// //         Object.entries(chartMap).map(([name, revenue]) => ({
// //           name,
// //           revenue: Number(revenue.toFixed(2)),
// //         }))
// //       );
// //     } catch (err) {
// //       console.error("🔥 Earnings Error:", err);
// //     }
// //   };

// //   return (
// //     <div style={styles.wrapper}>
// //       <h2 style={styles.pageTitle}>
// //         {activePlatform.toUpperCase()} Earnings
// //       </h2>

// //       <div style={styles.innerNavbar}>
// //         <div style={styles.tabs}>
// //           {["overall", "video", "ott", "adwidget"].map((p) => (
// //             <button
// //               key={p}
// //               onClick={() => setActivePlatform(p)}
// //               style={{
// //                 ...styles.tabBtn,
// //                 ...(activePlatform === p && styles.activeTab),
// //               }}
// //             >
// //               {p.toUpperCase()}
// //             </button>
// //           ))}
// //         </div>

// //         <div style={styles.filter}>
// //           <span style={styles.filterLabel}>Campaign</span>
// //           <select
// //             value={selectedCampaign}
// //             onChange={(e) => setSelectedCampaign(e.target.value)}
// //             style={styles.select}
// //           >
// //             <option value="All">All</option>
// //             {campaignList.map((c, i) => (
// //               <option key={i} value={c}>
// //                 {c}
// //               </option>
// //             ))}
// //           </select>
// //         </div>
// //       </div>

// //       <div style={styles.metricsRow}>
// //         <div style={styles.metricBox}>
// //           <h4>Revenue</h4>
// //           <p>${metrics.revenue}</p>
// //         </div>
// //         <div style={styles.metricBox}>
// //           <h4>Impressions</h4>
// //           <p>{metrics.impressions.toLocaleString()}</p>
// //         </div>
// //         <div style={styles.metricBox}>
// //           <h4>Clicks</h4>
// //           <p>{metrics.clicks.toLocaleString()}</p>
// //         </div>
// //         <div style={styles.metricBox}>
// //           <h4>CTR</h4>
// //           <p>{metrics.ctr}%</p>
// //         </div>
// //       </div>

// //       <div style={styles.card}>
// //         <h3>Revenue Share</h3>
// //         <ResponsiveContainer width="100%" height={360}>
// //           <PieChart>
// //             <Pie
// //               data={chartData}
// //               dataKey="revenue"
// //               nameKey="name"
// //               outerRadius={140}
// //               label
// //             >
// //               {chartData.map((_, i) => (
// //                 <Cell key={i} fill={COLORS[i % COLORS.length]} />
// //               ))}
// //             </Pie>
// //           </PieChart>
// //         </ResponsiveContainer>
// //       </div>
// //     </div>
// //   );
// // }

// // /* ========= STYLES (FONT SIZE BOOST ONLY) ========= */
// // const styles = {
// //   wrapper: {
// //     minHeight: "100vh",
// //     background: "#f1f4f9",
// //     padding: "28px",
// //     fontSize: "18px",
// //   },
// //   pageTitle: {
// //     fontSize: "36px",
// //     fontWeight: "800",
// //     marginBottom: "20px",
// //   },
// //   innerNavbar: {
// //     display: "flex",
// //     justifyContent: "space-between",
// //     alignItems: "center",
// //     background: "#fff",
// //     padding: "16px 20px",
// //     borderRadius: "12px",
// //     marginBottom: "28px",
// //     boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
// //   },
// //   tabs: {
// //     display: "flex",
// //     gap: "14px",
// //   },
// //   tabBtn: {
// //     border: "none",
// //     padding: "12px 22px",
// //     borderRadius: "8px",
// //     background: "#eaeaea",
// //     cursor: "pointer",
// //     fontWeight: "700",
// //     fontSize: "18px",
// //   },
// //   activeTab: {
// //     background: "#01303f",
// //     color: "#fff",
// //   },
// //   filter: {
// //     display: "flex",
// //     alignItems: "center",
// //     gap: "12px",
// //   },
// //   filterLabel: {
// //     fontWeight: "700",
// //     fontSize: "18px",
// //   },
// //   select: {
// //     padding: "10px",
// //     borderRadius: "6px",
// //     fontSize: "18px",
// //   },
// //   metricsRow: {
// //     display: "flex",
// //     gap: "18px",
// //     flexWrap: "wrap",
// //     marginBottom: "28px",
// //   },
// //   metricBox: {
// //     flex: "1 1 220px",
// //     background: "#fff",
// //     padding: "26px",
// //     borderRadius: "10px",
// //     textAlign: "center",
// //     boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
// //     fontSize:"28px",
// //     fontWeight:"500"
// //   },
// //   card: {
// //     background: "#fff",
// //     padding: "26px",
// //     borderRadius: "12px",
// //     boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
// //   },
// // };

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
// } from "recharts";

// /* ========= CONFIG ========= */
// const COLORS = ["#00C49F", "#FFBB28", "#0088FE", "#FF8042"];
// const CPM_VALUE = 2.5;

// /* ========= HELPERS ========= */
// const normalize = (s = "") =>
//   s.toLowerCase().trim().replace(/\s+/g, "").replace(/_/g, "");

// const num = (v) => {
//   if (!v || v === "") return 0;
//   if (typeof v === "string") return Number(v.replace(/,/g, "")) || 0;
//   return Number(v) || 0;
// };

// const convertDate = (serial) => {
//   const n = num(serial);
//   if (!n) return "";
//   const epoch = new Date(1899, 11, 30);
//   const d = new Date(epoch.getTime() + n * 86400000);
//   return d.toISOString().slice(0, 10);
// };

// const findValueByKeys = (row, keys = []) => {
//   const map = {};
//   Object.keys(row).forEach(
//     (k) => (map[k.toLowerCase().replace(/\s+/g, "")] = k)
//   );
//   for (const key of keys) {
//     const match = Object.keys(map).find((nk) => nk.includes(key));
//     if (match) return num(row[map[match]]);
//   }
//   return 0;
// };

// const isVideo = (name = "") =>
//   normalize(name).includes("video") ||
//   normalize(name).includes("yt") ||
//   normalize(name).includes("youtube");

// const isOtt = (name = "") =>
//   normalize(name).includes("ott") ||
//   normalize(name).includes("hotstar") ||
//   normalize(name).includes("zee");

// const isAdWidget = (name = "") =>
//   normalize(name).includes("adwidget") ||
//   normalize(name).includes("widget") ||
//   normalize(name).includes("adwid");

// export default function Earnings() {
//   const [activePlatform, setActivePlatform] = useState("overall");
//   const [selectedCampaign, setSelectedCampaign] = useState("All");

//   const [campaignList, setCampaignList] = useState([]);
//   const [metrics, setMetrics] = useState({
//     revenue: 0,
//     impressions: 0,
//     clicks: 0,
//     ctr: 0,
//   });

//   const [chartData, setChartData] = useState([]);
//   const [loading, setLoading] = useState(true); // ✅ ADDED

//   useEffect(() => {
//     loadData();
//   }, [activePlatform, selectedCampaign]);

//   const loadData = async () => {
//     try {
//       setLoading(true); // ✅ ADDED

//       const user = JSON.parse(localStorage.getItem("jwt"))?.user;
//       if (!user?.name) return;

//       const res = await axios.get(
//         "https://imediareports.onrender.com/api/getalldata"
//       );
//       const allSheets = res?.data?.sheets || [];

//       const publisherSheets = allSheets.filter(
//         (s) =>
//           normalize(s.publisher || s.uploadedByName) ===
//           normalize(user.name)
//       );

//       setCampaignList([
//         ...new Set(publisherSheets.map((s) => s.campaign)),
//       ]);

//       const videoSheets = publisherSheets.filter((s) => isVideo(s.name));
//       const ottSheets = publisherSheets.filter((s) => isOtt(s.name));
//       const adWidgetSheets = publisherSheets.filter((s) =>
//         isAdWidget(s.name)
//       );

//       let pool = publisherSheets;
//       if (activePlatform === "video") pool = videoSheets;
//       else if (activePlatform === "ott") pool = ottSheets;
//       else if (activePlatform === "adwidget") pool = adWidgetSheets;

//       if (selectedCampaign !== "All") {
//         pool = pool.filter(
//           (s) => normalize(s.campaign) === normalize(selectedCampaign)
//         );
//       }

//       const rows = pool.flatMap((s) => s.data || []);

//       const impressions = rows.reduce(
//         (a, r) =>
//           a +
//           findValueByKeys(r, ["impressions", "views", "imp"]),
//         0
//       );

//       const clicks = rows.reduce(
//         (a, r) => a + findValueByKeys(r, ["clicks", "npclick"]),
//         0
//       );

//       const ctr = impressions
//         ? ((clicks / impressions) * 100).toFixed(2)
//         : 0;

//       const revenue = ((impressions / 1000) * CPM_VALUE).toFixed(2);

//       setMetrics({ impressions, clicks, ctr, revenue });

//       const chartMap = {};
//       pool.forEach((sheet) => {
//         const rev = (sheet.data || []).reduce((a, r) => {
//           const imps = findValueByKeys(r, [
//             "impressions",
//             "views",
//             "imp",
//           ]);
//           return a + (imps / 1000) * CPM_VALUE;
//         }, 0);
//         chartMap[sheet.campaign] =
//           (chartMap[sheet.campaign] || 0) + rev;
//       });

//       setChartData(
//         Object.entries(chartMap).map(([name, revenue]) => ({
//           name,
//           revenue: Number(revenue.toFixed(2)),
//         }))
//       );
//     } catch (err) {
//       console.error("🔥 Earnings Error:", err);
//     } finally {
//       setLoading(false); // ✅ ADDED
//     }
//   };

//   return (
//     <div style={styles.wrapper}>
//       <h2 style={styles.pageTitle}>
//         {activePlatform.toUpperCase()} Earnings
//       </h2>

//       <div style={styles.innerNavbar}>
//         <div style={styles.tabs}>
//           {["overall", "video", "ott", "adwidget"].map((p) => (
//             <button
//               key={p}
//               onClick={() => setActivePlatform(p)}
//               style={{
//                 ...styles.tabBtn,
//                 ...(activePlatform === p && styles.activeTab),
//               }}
//             >
//               {p.toUpperCase()}
//             </button>
//           ))}
//         </div>

//         <div style={styles.filter}>
//           <span style={styles.filterLabel}>Campaign</span>
//           <select
//             value={selectedCampaign}
//             onChange={(e) => setSelectedCampaign(e.target.value)}
//             style={styles.select}
//           >
//             <option value="All">All</option>
//             {campaignList.map((c, i) => (
//               <option key={i} value={c}>
//                 {c}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {/* ===== METRICS / SKELETON ===== */}
//       <div style={styles.metricsRow}>
//         {loading
//           ? Array.from({ length: 4 }).map((_, i) => (
//               <div key={i} style={styles.skeletonMetric} />
//             ))
//           : (
//             <>
//               <div style={styles.metricBox}>
//                 <h4>Revenue</h4>
//                 <p>${metrics.revenue}</p>
//               </div>
//               <div style={styles.metricBox}>
//                 <h4>Impressions</h4>
//                 <p>{metrics.impressions.toLocaleString()}</p>
//               </div>
//               <div style={styles.metricBox}>
//                 <h4>Clicks</h4>
//                 <p>{metrics.clicks.toLocaleString()}</p>
//               </div>
//               <div style={styles.metricBox}>
//                 <h4>CTR</h4>
//                 <p>{metrics.ctr}%</p>
//               </div>
//             </>
//           )}
//       </div>

//       {/* ===== CHART / SKELETON ===== */}
//       <div style={styles.card}>
//         <h3>Revenue Share</h3>

//         {loading ? (
//           <div style={styles.skeletonChart} />
//         ) : (
//           <ResponsiveContainer width="100%" height={360}>
//             <PieChart>
//               <Pie
//                 data={chartData}
//                 dataKey="revenue"
//                 nameKey="name"
//                 outerRadius={140}
//                 label
//               >
//                 {chartData.map((_, i) => (
//                   <Cell key={i} fill={COLORS[i % COLORS.length]} />
//                 ))}
//               </Pie>
//             </PieChart>
//           </ResponsiveContainer>
//         )}
//       </div>

//       {/* ===== SKELETON ANIMATION ===== */}
//       <style>
//         {`
//           .skeleton {
//             background: linear-gradient(
//               90deg,
//               #e5e7eb 25%,
//               #f3f4f6 37%,
//               #e5e7eb 63%
//             );
//             background-size: 400% 100%;
//             animation: shimmer 1.4s ease infinite;
//           }

//           @keyframes shimmer {
//             0% { background-position: 100% 0; }
//             100% { background-position: -100% 0; }
//           }
//         `}
//       </style>
//     </div>
//   );
// }

// /* ========= STYLES ========= */
// const styles = {
//   wrapper: {
//     minHeight: "100vh",
//     background: "#f1f4f9",
//     padding: "28px",
//     fontSize: "18px",
//   },
//   pageTitle: {
//     fontSize: "36px",
//     fontWeight: "800",
//     marginBottom: "20px",
//   },
//   innerNavbar: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     background: "#fff",
//     padding: "16px 20px",
//     borderRadius: "12px",
//     marginBottom: "28px",
//     boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
//   },
//   tabs: { display: "flex", gap: "14px" },
//   tabBtn: {
//     border: "none",
//     padding: "12px 22px",
//     borderRadius: "8px",
//     background: "#eaeaea",
//     cursor: "pointer",
//     fontWeight: "700",
//     fontSize: "18px",
//   },
//   activeTab: { background: "#01303f", color: "#fff" },
//   filter: { display: "flex", alignItems: "center", gap: "12px" },
//   filterLabel: { fontWeight: "700", fontSize: "18px" },
//   select: { padding: "10px", borderRadius: "6px", fontSize: "18px" },
//   metricsRow: {
//     display: "flex",
//     gap: "18px",
//     flexWrap: "wrap",
//     marginBottom: "28px",
//   },
//   metricBox: {
//     flex: "1 1 220px",
//     background: "#fff",
//     padding: "26px",
//     borderRadius: "10px",
//     textAlign: "center",
//     boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
//     fontSize: "28px",
//     fontWeight: "500",
//   },
//   card: {
//     background: "#fff",
//     padding: "26px",
//     borderRadius: "12px",
//     boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
//   },

//   /* ===== SKELETONS ===== */
//   skeletonMetric: {
//     height: "120px",
//     flex: "1 1 220px",
//     borderRadius: "10px",
//     background: "#e5e7eb",
//   },
//   skeletonChart: {
//     height: "360px",
//     borderRadius: "12px",
//     background: "#e5e7eb",
//   },
// };
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

/* ════════════════════════════════════════
   CONSTANTS
════════════════════════════════════════ */
const COLORS = ["#007bff", "#28a745", "#ff4d4f", "#f5a623", "#9b59b6"];
const PLATFORMS = ["overall", "video", "ott", "adwidget"];

/* ════════════════════════════════════════
   HELPERS
════════════════════════════════════════ */
const norm = (s = "") => s.toLowerCase().trim().replace(/[\s_]/g, "");

const toNum = (v) => {
  if (!v && v !== 0) return 0;
  if (typeof v === "string") return parseFloat(v.replace(/[^0-9.-]+/g, "")) || 0;
  return Number(v) || 0;
};

const excelToDate = (serial) => {
  const n = toNum(serial);
  if (!n) return "";
  return new Date(new Date(1899, 11, 30).getTime() + n * 86400000)
    .toISOString()
    .slice(0, 10);
};

/* Classify sheet by name */
const classifySheet = (name = "") => {
  const s = norm(name);
  if (s.includes("ott") || s.includes("ctv") || s.includes("hotstar") || s.includes("zee") || s.includes("streaming")) return "ott";
  if (s.includes("video") || s.includes("yt") || s.includes("youtube") || s.includes("preroll") || s.includes("instream")) return "video";
  if (s.includes("adwidget") || s.includes("widget") || s.includes("adwid") || s.includes("display") || s.includes("banner")) return "adwidget";
  return "other";
};

/**
 * Extract revenue from a row:
 * 1. Revenue / Revenue (USD) column
 * 2. Spend column
 * 3. CPC fallback
 * 4. CPM fallback
 */
const extractRevenue = (row) => {
  // Normalize row keys
  const e = {};
  Object.keys(row).forEach((k) => { e[k.trim().toLowerCase()] = row[k]; });

  // Priority 1: Revenue column
  const revKey = Object.keys(e).find((k) => k.includes("revenue"));
  if (revKey) { const v = toNum(e[revKey]); if (v > 0) return v; }

  // Priority 2: Spend column
  const spendKey = Object.keys(e).find((k) => k.includes("spend"));
  if (spendKey) { const v = toNum(e[spendKey]); if (v > 0) return v; }

  // Priority 3: CPC / CPM fallback
  const imp = toNum(e.impressions ?? e.imps ?? e.imp ?? e["total impressions"]);
  const clk = toNum(e.clicks ?? e.click);
  const cpc = toNum(e.cpc);
  const cpm = toNum(e.cpm);
  if (cpc > 0) return clk * cpc;
  if (cpm > 0) return (imp / 1000) * cpm;
  return 0;
};

const extractImpressions = (row) => {
  const e = {};
  Object.keys(row).forEach((k) => { e[k.trim().toLowerCase()] = row[k]; });
  return toNum(e.impressions ?? e.imps ?? e.imp ?? e.views ?? e["total impressions"]);
};

const extractClicks = (row) => {
  const e = {};
  Object.keys(row).forEach((k) => { e[k.trim().toLowerCase()] = row[k]; });
  return toNum(e.clicks ?? e.click ?? e.npclick ?? e["total clicks"]);
};

/* ════════════════════════════════════════
   STYLES (matching existing dashboards)
════════════════════════════════════════ */
const S = {
  wrapper: {
    minHeight: "100vh",
    background: "#f9fafb",
    padding: "24px",
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    color: "#1f2937",
  },
  pageTitle: {
    fontSize: "28px",
    fontWeight: "700",
    marginBottom: "20px",
    color: "#1f2937",
  },
  /* ── Tabs + filter bar ── */
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#fff",
    padding: "14px 20px",
    borderRadius: "10px",
    marginBottom: "24px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
    border: "1px solid #dcdcdc",
    flexWrap: "wrap",
    gap: "12px",
  },
  tabs: { display: "flex", gap: "8px", flexWrap: "wrap" },
  tabBtn: {
    border: "1px solid #dcdcdc",
    padding: "8px 18px",
    borderRadius: "6px",
    background: "#f9fafb",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "13px",
    color: "#6b7280",
    transition: "all 0.15s",
  },
  activeTab: {
    background: "#007bff",
    color: "#fff",
    border: "1px solid #007bff",
  },
  filterRow: { display: "flex", alignItems: "center", gap: "10px" },
  filterLabel: { fontWeight: "600", fontSize: "13px", color: "#1f2937" },
  select: {
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid #dcdcdc",
    fontSize: "13px",
    background: "#fff",
    color: "#1f2937",
    outline: "none",
    minWidth: "160px",
  },
  /* ── Metric cards ── */
  metricsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "16px",
    marginBottom: "24px",
  },
  metricCard: {
    background: "#fff",
    padding: "20px 24px",
    borderRadius: "10px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
    border: "1px solid #dcdcdc",
  },
  metricLabel: {
    fontSize: "13px",
    color: "#6b7280",
    fontWeight: "600",
    marginBottom: "8px",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
  metricValue: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#1f2937",
    lineHeight: "1",
  },
  /* ── Chart cards ── */
  chartsRow: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
  },
  chartCard: {
    background: "#fff",
    borderRadius: "10px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
    border: "1px solid #dcdcdc",
    padding: "20px",
    flex: "1",
    minWidth: "300px",
  },
  chartTitle: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: "16px",
  },
  /* ── Skeletons ── */
  skeletonCard: {
    background: "linear-gradient(90deg, #eee 25%, #ddd 37%, #eee 63%)",
    backgroundSize: "400% 100%",
    borderRadius: "10px",
    minHeight: "90px",
    animation: "shimmer 1.4s ease infinite",
  },
  skeletonChart: {
    background: "linear-gradient(90deg, #eee 25%, #ddd 37%, #eee 63%)",
    backgroundSize: "400% 100%",
    borderRadius: "8px",
    height: "300px",
    animation: "shimmer 1.4s ease infinite",
  },
};

/* ════════════════════════════════════════
   COMPONENT
════════════════════════════════════════ */
export default function Earnings() {
  const [activePlatform, setActivePlatform] = useState("overall");
  const [selectedCampaign, setSelectedCampaign] = useState("All");
  const [allSheets, setAllSheets] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ── Fetch once ── */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const user = JSON.parse(localStorage.getItem("jwt"))?.user;
        if (!user?.name) return;

        const res = await axios.get("https://imediareports.onrender.com/api/getalldata");
        const sheets = res?.data?.sheets || [];

        // Filter to current publisher
        const publisherSheets = sheets.filter((s) =>
          norm(s.publisher || s.uploadedByName || "").includes(norm(user.name))
        );

        setAllSheets(publisherSheets);
      } catch (err) {
        console.error("Earnings fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* ── Campaigns list ── */
  const campaignList = useMemo(() => {
    const names = new Set(allSheets.map((s) => s.campaign).filter(Boolean));
    return ["All", ...Array.from(names).sort()];
  }, [allSheets]);

  /* ── Filter pool by platform + campaign ── */
  const filteredSheets = useMemo(() => {
    let pool = allSheets;

    if (activePlatform !== "overall") {
      pool = pool.filter((s) => classifySheet(s.name) === activePlatform);
    }

    if (selectedCampaign !== "All") {
      pool = pool.filter((s) => norm(s.campaign) === norm(selectedCampaign));
    }

    return pool;
  }, [allSheets, activePlatform, selectedCampaign]);

  /* ── Aggregate metrics ── */
  const metrics = useMemo(() => {
    let revenue = 0, impressions = 0, clicks = 0;

    filteredSheets.forEach((sheet) => {
      (sheet.data || []).forEach((row) => {
        revenue     += extractRevenue(row);
        impressions += extractImpressions(row);
        clicks      += extractClicks(row);
      });
    });

    const ctr = impressions > 0 ? ((clicks / impressions) * 100).toFixed(2) : "0.00";
    return { revenue: revenue.toFixed(2), impressions, clicks, ctr };
  }, [filteredSheets]);

  /* ── Pie chart: revenue by campaign ── */
  const pieData = useMemo(() => {
    const map = {};
    filteredSheets.forEach((sheet) => {
      const camp = sheet.campaign || "Unknown";
      (sheet.data || []).forEach((row) => {
        map[camp] = (map[camp] || 0) + extractRevenue(row);
      });
    });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value: Number(value.toFixed(2)) }))
      .filter((d) => d.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [filteredSheets]);

  /* ── Bar chart: revenue by platform (overall only) ── */
  const barData = useMemo(() => {
    if (activePlatform !== "overall") return [];
    const map = { video: 0, ott: 0, adwidget: 0, other: 0 };
    allSheets.forEach((sheet) => {
      const platform = classifySheet(sheet.name);
      (sheet.data || []).forEach((row) => {
        map[platform] = (map[platform] || 0) + extractRevenue(row);
      });
    });
    return Object.entries(map)
      .map(([name, value]) => ({ name: name.toUpperCase(), value: Number(value.toFixed(2)) }))
      .filter((d) => d.value > 0);
  }, [allSheets, activePlatform]);

  /* ════════════════════════════════════════
     RENDER
  ════════════════════════════════════════ */
  return (
    <div style={S.wrapper}>
      {/* Shimmer keyframes */}
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 100% 0; }
          100% { background-position: -100% 0; }
        }
      `}</style>

      {/* PAGE TITLE */}
      <h2 style={S.pageTitle}>
        💰 {activePlatform === "overall" ? "Overall" : activePlatform.toUpperCase()} Earnings
      </h2>

      {/* TOP BAR — tabs + campaign filter */}
      <div style={S.topBar}>
        <div style={S.tabs}>
          {PLATFORMS.map((p) => (
            <button
              key={p}
              onClick={() => { setActivePlatform(p); setSelectedCampaign("All"); }}
              style={{
                ...S.tabBtn,
                ...(activePlatform === p ? S.activeTab : {}),
              }}
            >
              {p === "overall" ? "Overall" : p.toUpperCase()}
            </button>
          ))}
        </div>

        <div style={S.filterRow}>
          <span style={S.filterLabel}>Campaign</span>
          <select
            value={selectedCampaign}
            onChange={(e) => setSelectedCampaign(e.target.value)}
            style={S.select}
          >
            {campaignList.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* METRIC CARDS */}
      <div style={S.metricsRow}>
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} style={S.skeletonCard} />
            ))
          : [
              { label: "Total Revenue",    value: `$${Number(metrics.revenue).toLocaleString("en-US", { minimumFractionDigits: 2 })}` },
              { label: "Impressions",      value: Number(metrics.impressions).toLocaleString() },
              { label: "Clicks",           value: Number(metrics.clicks).toLocaleString() },
              { label: "CTR",              value: `${metrics.ctr}%` },
            ].map(({ label, value }) => (
              <div key={label} style={S.metricCard}>
                <div style={S.metricLabel}>{label}</div>
                <div style={S.metricValue}>{value}</div>
              </div>
            ))}
      </div>

      {/* CHARTS */}
      <div style={S.chartsRow}>

        {/* PIE — Revenue by Campaign */}
        <div style={S.chartCard}>
          <div style={S.chartTitle}>Revenue by Campaign</div>
          {loading ? (
            <div style={S.skeletonChart} />
          ) : pieData.length === 0 ? (
            <p style={{ color: "#6b7280", textAlign: "center", paddingTop: 60 }}>No data</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={110}
                  label={({ name, value }) =>
                    `${name}: $${Number(value).toLocaleString("en-US", { minimumFractionDigits: 2 })}`
                  }
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v) => [`$${Number(v).toLocaleString("en-US", { minimumFractionDigits: 2 })}`, "Revenue"]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* BAR — Revenue by Platform (overall only) OR daily if filtered */}
        {activePlatform === "overall" ? (
          <div style={S.chartCard}>
            <div style={S.chartTitle}>Revenue by Platform</div>
            {loading ? (
              <div style={S.skeletonChart} />
            ) : barData.length === 0 ? (
              <p style={{ color: "#6b7280", textAlign: "center", paddingTop: 60 }}>No data</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData} barCategoryGap="40%">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fontWeight: 600 }} />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    tickFormatter={(v) => `$${v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}`}
                  />
                  <Tooltip formatter={(v) => [`$${Number(v).toLocaleString("en-US", { minimumFractionDigits: 2 })}`, "Revenue"]} />
                  <Bar dataKey="value" fill="#007bff" radius={[4, 4, 0, 0]} name="Revenue" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        ) : (
          /* Campaign revenue breakdown bar for specific platform */
          <div style={S.chartCard}>
            <div style={S.chartTitle}>Revenue by Campaign</div>
            {loading ? (
              <div style={S.skeletonChart} />
            ) : pieData.length === 0 ? (
              <p style={{ color: "#6b7280", textAlign: "center", paddingTop: 60 }}>No data</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={pieData} barCategoryGap="40%">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fontWeight: 600 }} />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    tickFormatter={(v) => `$${v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}`}
                  />
                  <Tooltip formatter={(v) => [`$${Number(v).toLocaleString("en-US", { minimumFractionDigits: 2 })}`, "Revenue"]} />
                  <Bar dataKey="value" fill="#28a745" radius={[4, 4, 0, 0]} name="Revenue" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
