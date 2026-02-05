// // // // import React, { useEffect, useState, useMemo } from "react";
// // // // import axios from "axios";
// // // // import {
// // // //   ResponsiveContainer,
// // // //   BarChart,
// // // //   Bar,
// // // //   XAxis,
// // // //   YAxis,
// // // //   Tooltip,
// // // //   CartesianGrid,
// // // //   Legend,
// // // //   PieChart,
// // // //   Pie,
// // // //   Cell,
// // // // } from "recharts";

// // // // /* ================= HELPERS ================= */
// // // // const toNumber = (v) => {
// // // //   const n = parseFloat(v);
// // // //   return isNaN(n) ? 0 : n;
// // // // };

// // // // const TABS = ["Overall", "Video", "OTT", "AdWidget"];
// // // // const COLORS = ["#06c19c", "#0088FE", "#FF8042", "#A020F0"];

// // // // /* ================= COMPONENT ================= */
// // // // const AdvertiserEarnings = () => {
// // // //   const [activeTab, setActiveTab] = useState("Overall");
// // // //   const [rawRows, setRawRows] = useState([]);
// // // //   const [loading, setLoading] = useState(false);

// // // //   /* ================= FETCH ================= */
// // // //   useEffect(() => {
// // // //     const fetchData = async () => {
// // // //       try {
// // // //         setLoading(true);

// // // //         const jwt = JSON.parse(localStorage.getItem("jwt"));
// // // //         const token = jwt?.token;
// // // //         if (!token) return;

// // // //         const res = await axios.get(
// // // //           "https://imediareports.onrender.com/api/getgenealogyrecords",
// // // //           { headers: { Authorization: `Bearer ${token}` } }
// // // //         );

// // // //         const sheets = res?.data?.genealogySheets || [];
// // // //         console.log("📦 Advertiser Sheets:", sheets);

// // // //         const rows = [];

// // // //         sheets.forEach((sheet) => {
// // // //           const campaign = sheet.campaign || "Unknown Campaign";
// // // //           const platform = sheet.platform || "AdWidget"; // fallback

// // // //           (sheet.data || []).forEach((row) => {
// // // //             const clean = {};
// // // //             Object.keys(row || {}).forEach(
// // // //               (k) => (clean[k.trim().toLowerCase()] = row[k])
// // // //             );

// // // //             const impressions = toNumber(
// // // //               clean.impressions || clean.impression
// // // //             );
// // // //             const clicks = toNumber(clean.clicks || clean.click);
// // // //             const cpm = toNumber(clean.cpm || clean["cost per mille"]);

// // // //             rows.push({
// // // //               campaign,
// // // //               platform,
// // // //               impressions,
// // // //               clicks,
// // // //               cpm,
// // // //             });
// // // //           });
// // // //         });

// // // //         console.log("✅ Normalized Rows:", rows);
// // // //         setRawRows(rows);
// // // //       } catch (e) {
// // // //         console.error("Advertiser fetch error:", e);
// // // //       } finally {
// // // //         setLoading(false);
// // // //       }
// // // //     };

// // // //     fetchData();
// // // //   }, []);

// // // //   /* ================= FILTER BY TAB ================= */
// // // //   const filteredRows = useMemo(() => {
// // // //     if (activeTab === "Overall") return rawRows;
// // // //     return rawRows.filter(
// // // //       (r) => r.platform?.toLowerCase() === activeTab.toLowerCase()
// // // //     );
// // // //   }, [rawRows, activeTab]);

// // // //   /* ================= METRICS ================= */
// // // //   const metrics = useMemo(() => {
// // // //     const imps = filteredRows.reduce((a, b) => a + b.impressions, 0);
// // // //     const clicks = filteredRows.reduce((a, b) => a + b.clicks, 0);
// // // //     const ctr = imps ? ((clicks / imps) * 100).toFixed(2) : "0.00";
// // // //     const ecpm = imps
// // // //       ? (
// // // //           filteredRows.reduce(
// // // //             (a, b) => a + (b.impressions / 1000) * b.cpm,
// // // //             0
// // // //           ) / imps
// // // //         ).toFixed(2)
// // // //       : "0.00";

// // // //     return { imps, clicks, ctr, ecpm };
// // // //   }, [filteredRows]);

// // // //   /* ================= CHART DATA ================= */
// // // //   const chartData = useMemo(() => {
// // // //     const map = {};
// // // //     filteredRows.forEach((r) => {
// // // //       if (!map[r.campaign]) {
// // // //         map[r.campaign] = {
// // // //           name: r.campaign,
// // // //           impressions: 0,
// // // //           clicks: 0,
// // // //         };
// // // //       }
// // // //       map[r.campaign].impressions += r.impressions;
// // // //       map[r.campaign].clicks += r.clicks;
// // // //     });
// // // //     return Object.values(map);
// // // //   }, [filteredRows]);

// // // //   /* ================= RENDER ================= */
// // // //   return (
// // // //     <div style={{ padding: 24, background: "#f5f7fb", minHeight: "100vh" }}>
// // // //       <h2 style={{ fontWeight: 800 }}>OVERALL Earnings</h2>

// // // //       {/* TABS */}
// // // //       <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
// // // //         {TABS.map((t) => (
// // // //           <button
// // // //             key={t}
// // // //             onClick={() => setActiveTab(t)}
// // // //             style={{
// // // //               padding: "8px 16px",
// // // //               borderRadius: 8,
// // // //               border: "none",
// // // //               cursor: "pointer",
// // // //               fontWeight: 700,
// // // //               background: activeTab === t ? "#000" : "#eaeaea",
// // // //               color: activeTab === t ? "#fff" : "#000",
// // // //             }}
// // // //           >
// // // //             {t.toUpperCase()}
// // // //           </button>
// // // //         ))}
// // // //       </div>

// // // //       {/* CARDS */}
// // // //       <div
// // // //         style={{
// // // //           display: "grid",
// // // //           gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))",
// // // //           gap: 16,
// // // //         }}
// // // //       >
// // // //         <Card title="Impressions" value={metrics.imps.toLocaleString()} />
// // // //         <Card title="Clicks" value={metrics.clicks.toLocaleString()} />
// // // //         <Card title="CTR" value={`${metrics.ctr}%`} />
// // // //         <Card title="eCPM" value={`$${metrics.ecpm}`} />
// // // //       </div>

// // // //       {/* CHART */}
// // // //       <div
// // // //         style={{
// // // //           background: "#fff",
// // // //           borderRadius: 16,
// // // //           padding: 20,
// // // //           marginTop: 30,
// // // //         }}
// // // //       >
// // // //         <h3 style={{ fontWeight: 700 }}>Campaign Performance</h3>
// // // //         <ResponsiveContainer width="100%" height={360}>
// // // //           <BarChart data={chartData}>
// // // //             <CartesianGrid strokeDasharray="3 3" />
// // // //             <XAxis dataKey="name" />
// // // //             <YAxis />
// // // //             <Tooltip />
// // // //             <Legend />
// // // //             <Bar dataKey="impressions" fill="#06c19c" />
// // // //             <Bar dataKey="clicks" fill="#0088FE" />
// // // //           </BarChart>
// // // //         </ResponsiveContainer>
// // // //       </div>

// // // //       {/* TABLE */}
// // // //       <div
// // // //         style={{
// // // //           background: "#fff",
// // // //           borderRadius: 16,
// // // //           padding: 20,
// // // //           marginTop: 30,
// // // //         }}
// // // //       >
// // // //         <h3 style={{ fontWeight: 700 }}>Campaign Breakdown</h3>
// // // //         <table style={{ width: "100%", borderCollapse: "collapse" }}>
// // // //           <thead>
// // // //             <tr>
// // // //               <TH>Campaign</TH>
// // // //               <TH>Platform</TH>
// // // //               <TH>Impressions</TH>
// // // //               <TH>Clicks</TH>
// // // //               <TH>CTR %</TH>
// // // //             </tr>
// // // //           </thead>
// // // //           <tbody>
// // // //             {filteredRows.map((r, i) => (
// // // //               <tr key={i}>
// // // //                 <TD>{r.campaign}</TD>
// // // //                 <TD>{r.platform}</TD>
// // // //                 <TD>{r.impressions.toLocaleString()}</TD>
// // // //                 <TD>{r.clicks}</TD>
// // // //                 <TD>
// // // //                   {r.impressions
// // // //                     ? ((r.clicks / r.impressions) * 100).toFixed(2)
// // // //                     : "0.00"}
// // // //                 </TD>
// // // //               </tr>
// // // //             ))}
// // // //           </tbody>
// // // //         </table>
// // // //       </div>

// // // //       {loading && <p style={{ marginTop: 20 }}>Loading…</p>}
// // // //     </div>
// // // //   );
// // // // };

// // // // /* ================= UI ================= */
// // // // const Card = ({ title, value }) => (
// // // //   <div
// // // //     style={{
// // // //       background: "#fff",
// // // //       padding: 22,
// // // //       borderRadius: 14,
// // // //       boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
// // // //       textAlign: "center",
// // // //     }}
// // // //   >
// // // //     <div style={{ fontSize: 14, fontWeight: 600, color: "#6d7a88" }}>
// // // //       {title}
// // // //     </div>
// // // //     <div style={{ fontSize: 24, fontWeight: 800, marginTop: 6 }}>
// // // //       {value}
// // // //     </div>
// // // //   </div>
// // // // );

// // // // const TH = ({ children }) => (
// // // //   <th
// // // //     style={{
// // // //       padding: 12,
// // // //       borderBottom: "2px solid #eee",
// // // //       textAlign: "left",
// // // //       fontWeight: 700,
// // // //     }}
// // // //   >
// // // //     {children}
// // // //   </th>
// // // // );

// // // // const TD = ({ children }) => (
// // // //   <td style={{ padding: 12, borderBottom: "1px solid #f0f0f0" }}>
// // // //     {children}
// // // //   </td>
// // // // );

// // // // export default AdvertiserEarnings;

// // // // import React, { useEffect, useState, useMemo } from "react";
// // // // import axios from "axios";
// // // // import {
// // // //   ResponsiveContainer,
// // // //   BarChart,
// // // //   Bar,
// // // //   XAxis,
// // // //   YAxis,
// // // //   Tooltip,
// // // //   CartesianGrid,
// // // //   Legend,
// // // // } from "recharts";

// // // // /* ================= HELPERS ================= */
// // // // const toNumber = (v) => {
// // // //   const n = parseFloat(v);
// // // //   return isNaN(n) ? 0 : n;
// // // // };

// // // // /* Detect Ad Type reliably */
// // // // const detectAdType = (sheet) => {
// // // //   const src =
// // // //     `${sheet?.campaign || ""} ${sheet?.name || ""} ${sheet?.type || ""}`
// // // //       .toLowerCase();

// // // //   if (src.includes("retarget")) return "Gen-Retargeting";
// // // //   if (src.includes("segment")) return "Gen-Segments";
// // // //   if (src.includes("ott")) return "OTT";
// // // //   if (src.includes("video")) return "Video";
// // // //   if (src.includes("widget") || src.includes("display")) return "AdWidget";
// // // //   return "AdWidget";
// // // // };

// // // // const TABS = [
// // // //   "Overall",
// // // //   "Video",
// // // //   "OTT",
// // // //   "AdWidget",
// // // //   "Gen-Segments",
// // // //   "Gen-Retargeting",
// // // // ];

// // // // /* ================= COMPONENT ================= */
// // // // const AdvertiserEarnings = () => {
// // // //   const [activeTab, setActiveTab] = useState("Overall");
// // // //   const [campaign, setCampaign] = useState("All");
// // // //   const [rows, setRows] = useState([]);
// // // //   const [loading, setLoading] = useState(false);

// // // //   /* ================= FETCH ================= */
// // // //   useEffect(() => {
// // // //     const fetchData = async () => {
// // // //       try {
// // // //         setLoading(true);
// // // //         const jwt = JSON.parse(localStorage.getItem("jwt"));
// // // //         const token = jwt?.token;
// // // //         if (!token) return;

// // // //         const res = await axios.get(
// // // //           "https://imediareports.onrender.com/api/getgenealogyrecords",
// // // //           { headers: { Authorization: `Bearer ${token}` } }
// // // //         );

// // // //          const result = await axios.get(
// // // //           "https://imediareports.onrender.com/api/getallsheets",
// // // //           { headers: { Authorization: `Bearer ${token}` } }
// // // //         );
// // // //         console.log(result.data,"result");
        

// // // //         const sheets = res?.data?.genealogySheets || [];
// // // //         console.log(sheets,"sheets");
        
// // // //         const normalized = [];

// // // //         sheets.forEach((sheet) => {
// // // //           const adType = detectAdType(sheet);
// // // //           const campaignName = sheet.campaign || "Unknown Campaign";

// // // //           (sheet.data || []).forEach((row) => {
// // // //             const clean = {};
// // // //             Object.keys(row || {}).forEach(
// // // //               (k) => (clean[k.trim().toLowerCase()] = row[k])
// // // //             );

// // // //             normalized.push({
// // // //               campaign: campaignName,
// // // //               adType,
// // // //               impressions: toNumber(
// // // //                 clean.impressions || clean.impression
// // // //               ),
// // // //               clicks: toNumber(clean.clicks || clean.click),
// // // //               cpm: toNumber(clean.cpm || clean["cost per mille"]),
// // // //             });
// // // //           });
// // // //         });

// // // //         setRows(normalized);
// // // //       } catch (e) {
// // // //         console.error("Advertiser fetch error:", e);
// // // //       } finally {
// // // //         setLoading(false);
// // // //       }
// // // //     };

// // // //     fetchData();
// // // //   }, []);

// // // //   /* ================= CAMPAIGNS ================= */
// // // //   const campaigns = useMemo(() => {
// // // //     return ["All", ...new Set(rows.map((r) => r.campaign))];
// // // //   }, [rows]);

// // // //   /* ================= FILTER ================= */
// // // //   const filteredRows = useMemo(() => {
// // // //     return rows.filter((r) => {
// // // //       if (activeTab !== "Overall" && r.adType !== activeTab) return false;
// // // //       if (campaign !== "All" && r.campaign !== campaign) return false;
// // // //       return true;
// // // //     });
// // // //   }, [rows, activeTab, campaign]);

// // // //   /* ================= METRICS ================= */
// // // //   const metrics = useMemo(() => {
// // // //     const imps = filteredRows.reduce((a, b) => a + b.impressions, 0);
// // // //     const clicks = filteredRows.reduce((a, b) => a + b.clicks, 0);
// // // //     const ctr = imps ? ((clicks / imps) * 100).toFixed(2) : "0.00";
// // // //     const ecpm = imps
// // // //       ? (
// // // //           filteredRows.reduce(
// // // //             (a, b) => a + (b.impressions / 1000) * b.cpm,
// // // //             0
// // // //           ) / imps
// // // //         ).toFixed(2)
// // // //       : "0.00";

// // // //     return { imps, clicks, ctr, ecpm };
// // // //   }, [filteredRows]);

// // // //   /* ================= CHART ================= */
// // // //   const chartData = useMemo(() => {
// // // //     const map = {};
// // // //     filteredRows.forEach((r) => {
// // // //       if (!map[r.campaign]) {
// // // //         map[r.campaign] = {
// // // //           name: r.campaign,
// // // //           impressions: 0,
// // // //           clicks: 0,
// // // //         };
// // // //       }
// // // //       map[r.campaign].impressions += r.impressions;
// // // //       map[r.campaign].clicks += r.clicks;
// // // //     });
// // // //     return Object.values(map);
// // // //   }, [filteredRows]);

// // // //   /* ================= RENDER ================= */
// // // //   return (
// // // //     <div style={{ padding: 24, background: "#f5f7fb", minHeight: "100vh" }}>
// // // //       <h2 style={{ fontWeight: 800 }}>OVERALL Earnings</h2>

// // // //       {/* TABS */}
// // // //       <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
// // // //         {TABS.map((t) => (
// // // //           <button
// // // //             key={t}
// // // //             onClick={() => setActiveTab(t)}
// // // //             style={{
// // // //               padding: "8px 16px",
// // // //               borderRadius: 8,
// // // //               border: "none",
// // // //               fontWeight: 700,
// // // //               cursor: "pointer",
// // // //               background: activeTab === t ? "#000" : "#eaeaea",
// // // //               color: activeTab === t ? "#fff" : "#000",
// // // //             }}
// // // //           >
// // // //             {t.toUpperCase()}
// // // //           </button>
// // // //         ))}
// // // //       </div>

// // // //       {/* CAMPAIGN FILTER */}
// // // //       <div style={{ marginBottom: 20 }}>
// // // //         <select
// // // //           value={campaign}
// // // //           onChange={(e) => setCampaign(e.target.value)}
// // // //           style={{
// // // //             padding: 10,
// // // //             borderRadius: 8,
// // // //             fontWeight: 600,
// // // //           }}
// // // //         >
// // // //           {campaigns.map((c) => (
// // // //             <option key={c}>{c}</option>
// // // //           ))}
// // // //         </select>
// // // //       </div>

// // // //       {/* CARDS */}
// // // //       <div
// // // //         style={{
// // // //           display: "grid",
// // // //           gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))",
// // // //           gap: 16,
// // // //         }}
// // // //       >
// // // //         <Card title="Impressions" value={metrics.imps.toLocaleString()} />
// // // //         <Card title="Clicks" value={metrics.clicks.toLocaleString()} />
// // // //         <Card title="CTR" value={`${metrics.ctr}%`} />
// // // //         <Card title="eCPM" value={`$${metrics.ecpm}`} />
// // // //       </div>

// // // //       {/* CHART */}
// // // //       <div
// // // //         style={{
// // // //           background: "#fff",
// // // //           borderRadius: 16,
// // // //           padding: 20,
// // // //           marginTop: 30,
// // // //         }}
// // // //       >
// // // //         <h3 style={{ fontWeight: 700 }}>Campaign Performance</h3>
// // // //         <ResponsiveContainer width="100%" height={360}>
// // // //           <BarChart data={chartData}>
// // // //             <CartesianGrid strokeDasharray="3 3" />
// // // //             <XAxis dataKey="name" />
// // // //             <YAxis />
// // // //             <Tooltip />
// // // //             <Legend />
// // // //             <Bar dataKey="impressions" fill="#06c19c" />
// // // //             <Bar dataKey="clicks" fill="#0088FE" />
// // // //           </BarChart>
// // // //         </ResponsiveContainer>
// // // //       </div>

// // // //       {loading && <p>Loading…</p>}
// // // //     </div>
// // // //   );
// // // // };

// // // // /* ================= UI ================= */
// // // // const Card = ({ title, value }) => (
// // // //   <div
// // // //     style={{
// // // //       background: "#fff",
// // // //       padding: 22,
// // // //       borderRadius: 14,
// // // //       boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
// // // //       textAlign: "center",
// // // //     }}
// // // //   >
// // // //     <div style={{ fontSize: 14, fontWeight: 600, color: "#6d7a88" }}>
// // // //       {title}
// // // //     </div>
// // // //     <div style={{ fontSize: 24, fontWeight: 800, marginTop: 6 }}>
// // // //       {value}
// // // //     </div>
// // // //   </div>
// // // // );

// // // // export default AdvertiserEarnings;
// // // are you dumb bro i need a drop down at the right of campaigns so when i click on one campaign only campaign data should be reflected in the fraphs and cards broimport React, { useEffect, useState, useMemo } from "react";
// // // import axios from "axios";
// // // import {
// // //   ResponsiveContainer,
// // //   BarChart,
// // //   Bar,
// // //   XAxis,
// // //   YAxis,
// // //   Tooltip,
// // //   CartesianGrid,
// // //   Legend,
// // // } from "recharts";

// // // /* ================= HELPERS ================= */
// // // const toNumber = (v) => {
// // //   const n = parseFloat(v);
// // //   return isNaN(n) ? 0 : n;
// // // };

// // // /* ================= TABS ================= */
// // // const TABS = ["Overall", "Video", "OTT", "AdWidget"];

// // // /* ================= ADTYPE FROM AD SHEETS ================= */
// // // const detectAdTypeFromSheet = (sheet) => {
// // //   const name = (sheet?.name || "").toLowerCase();
// // //   if (name === "video") return "Video";
// // //   if (name === "ott") return "OTT";
// // //   if (name === "adwidget" || name === "widget") return "AdWidget";
// // //   return null;
// // // };

// // // /* ================= COMPONENT ================= */
// // // const AdvertiserEarnings = () => {
// // //   const [activeTab, setActiveTab] = useState("Overall");
// // //   const [campaign, setCampaign] = useState("All");
// // //   const [rows, setRows] = useState([]);
// // //   const [loading, setLoading] = useState(true);

// // //   /* ================= FETCH ================= */
// // //   useEffect(() => {
// // //     const fetchData = async () => {
// // //       try {
// // //         setLoading(true);

// // //         const jwt = JSON.parse(localStorage.getItem("jwt"));
// // //         const token = jwt?.token;
// // //         if (!token) return;

// // //         const [genealogyRes, adSheetsRes] = await Promise.all([
// // //           axios.get(
// // //             "https://imediareports.onrender.com/api/getgenealogyrecords",
// // //             { headers: { Authorization: `Bearer ${token}` } }
// // //           ),
// // //           axios.get(
// // //             "https://imediareports.onrender.com/api/getallsheets",
// // //             { headers: { Authorization: `Bearer ${token}` } }
// // //           ),
// // //         ]);

// // //         const normalized = [];

// // //         /* ================= GENEALOGY (UNCHANGED) ================= */
// // //         const genealogySheets = genealogyRes?.data?.genealogySheets || [];

// // //         genealogySheets.forEach((sheet) => {
// // //           const campaignName = sheet.campaign || "Unknown Campaign";
// // //           const publisher =
// // //             sheet.publisher ||
// // //             sheet.publisher_id ||
// // //             sheet.publisherName ||
// // //             "Unknown Publisher";

// // //           (sheet.data || []).forEach((row) => {
// // //             const clean = {};
// // //             Object.keys(row || {}).forEach(
// // //               (k) => (clean[k.trim().toLowerCase()] = row[k])
// // //             );

// // //             normalized.push({
// // //               campaign: campaignName,
// // //               publisher,
// // //               adType: "AdWidget",
// // //               impressions: toNumber(clean.impressions || clean.impression),
// // //               clicks: toNumber(clean.clicks || clean.click),
// // //               cpm: toNumber(clean.cpm || clean["cost per mille"]),
// // //             });
// // //           });
// // //         });

// // //         /* ================= ADTYPE SHEETS ================= */
// // //         const adSheets = adSheetsRes?.data || [];

// // //         adSheets.forEach((sheet) => {
// // //           const adType = detectAdTypeFromSheet(sheet);
// // //           if (!adType) return;

// // //           const campaignName = sheet.campaign || "Unknown Campaign";
// // //           const publisher =
// // //             sheet.publisher ||
// // //             sheet.publisher_id ||
// // //             sheet.publisherName ||
// // //             "Unknown Publisher";

// // //           (sheet.data || []).forEach((row) => {
// // //             const clean = {};
// // //             Object.keys(row || {}).forEach(
// // //               (k) => (clean[k.trim().toLowerCase()] = row[k])
// // //             );

// // //             normalized.push({
// // //               campaign: campaignName,
// // //               publisher,
// // //               adType,
// // //               impressions: toNumber(clean.impressions || clean.impression),
// // //               clicks: toNumber(clean.clicks || clean.click),
// // //               cpm: toNumber(clean.cpm || clean["cost per mille"]),
// // //             });
// // //           });
// // //         });

// // //         setRows(normalized);
// // //       } catch (err) {
// // //         console.error("Advertiser fetch error:", err);
// // //       } finally {
// // //         setLoading(false);
// // //       }
// // //     };

// // //     fetchData();
// // //   }, []);

// // //   /* ================= CAMPAIGN LIST ================= */
// // //   const campaigns = useMemo(() => {
// // //     return ["All", ...new Set(rows.map((r) => r.campaign))];
// // //   }, [rows]);

// // //   /* ================= SELECTED PUBLISHERS ================= */
// // //   const selectedPublishers = useMemo(() => {
// // //     if (campaign === "All") return [];

// // //     return [
// // //       ...new Set(
// // //         rows
// // //           .filter((r) => r.campaign === campaign)
// // //           .map((r) => r.publisher)
// // //       ),
// // //     ];
// // //   }, [campaign, rows]);

// // //   /* ================= TAB CHANGE ================= */
// // //   const handleTabChange = (tab) => {
// // //     setLoading(true);
// // //     setActiveTab(tab);
// // //     setTimeout(() => setLoading(false), 400);
// // //   };

// // //   /* ================= FILTER ================= */
// // //   const filteredRows = useMemo(() => {
// // //     return rows.filter((r) => {
// // //       if (activeTab !== "Overall" && r.adType !== activeTab) return false;
// // //       if (campaign !== "All" && r.campaign !== campaign) return false;
// // //       return true;
// // //     });
// // //   }, [rows, activeTab, campaign]);

// // //   /* ================= METRICS ================= */
// // //   const metrics = useMemo(() => {
// // //     const imps = filteredRows.reduce((a, b) => a + b.impressions, 0);
// // //     const clicks = filteredRows.reduce((a, b) => a + b.clicks, 0);
// // //     const ctr = imps ? ((clicks / imps) * 100).toFixed(2) : "0.00";
// // //     const ecpm = imps
// // //       ? (
// // //           filteredRows.reduce(
// // //             (a, b) => a + (b.impressions / 1000) * b.cpm,
// // //             0
// // //           ) / imps
// // //         ).toFixed(2)
// // //       : "0.00";

// // //     return { imps, clicks, ctr, ecpm };
// // //   }, [filteredRows]);

// // //   /* ================= CHART ================= */
// // //   const chartData = useMemo(() => {
// // //     const map = {};
// // //     filteredRows.forEach((r) => {
// // //       if (!map[r.campaign]) {
// // //         map[r.campaign] = {
// // //           name: r.campaign,
// // //           impressions: 0,
// // //           clicks: 0,
// // //         };
// // //       }
// // //       map[r.campaign].impressions += r.impressions;
// // //       map[r.campaign].clicks += r.clicks;
// // //     });
// // //     return Object.values(map);
// // //   }, [filteredRows]);

// // //   /* ================= UI ================= */
// // //   return (
// // //     <div style={{ padding: 24, background: "#f5f7fb", minHeight: "100vh" }}>
// // //       <h2 style={{ fontWeight: 800 }}>Advertiser Performance</h2>

// // //       {/* TABS */}
// // //       <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
// // //         {TABS.map((t) => (
// // //           <button
// // //             key={t}
// // //             onClick={() => handleTabChange(t)}
// // //             style={{
// // //               padding: "8px 18px",
// // //               borderRadius: 10,
// // //               border: "none",
// // //               fontWeight: 700,
// // //               background: activeTab === t ? "#000" : "#eaeaea",
// // //               color: activeTab === t ? "#fff" : "#000",
// // //               cursor: "pointer",
// // //             }}
// // //           >
// // //             {t}
// // //           </button>
// // //         ))}
// // //       </div>

// // //       {/* CAMPAIGN + PUBLISHER ROW */}
// // //       <div
// // //         style={{
// // //           display: "flex",
// // //           justifyContent: "space-between",
// // //           alignItems: "center",
// // //           marginBottom: 20,
// // //         }}
// // //       >
// // //         <select
// // //           value={campaign}
// // //           onChange={(e) => setCampaign(e.target.value)}
// // //           style={{
// // //             padding: "10px 14px",
// // //             borderRadius: 8,
// // //             fontWeight: 600,
// // //           }}
// // //         >
// // //           {campaigns.map((c) => (
// // //             <option key={c} value={c}>
// // //               {c}
// // //             </option>
// // //           ))}
// // //         </select>

// // //         {/* PUBLISHER DISPLAY */}
// // //         {campaign !== "All" && selectedPublishers.length > 0 && (
// // //           <div style={{ fontWeight: 800, fontSize: 16 }}>
// // //             Publisher:&nbsp;
// // //             <span style={{ color: "#000" }}>
// // //               {selectedPublishers.slice(0, 2).join(", ")}
// // //               {selectedPublishers.length > 2 &&
// // //                 ` +${selectedPublishers.length - 2} more`}
// // //             </span>
// // //           </div>
// // //         )}
// // //       </div>

// // //       {loading ? (
// // //         <Skeleton />
// // //       ) : (
// // //         <>
// // //           {/* CARDS */}
// // //           <div
// // //             style={{
// // //               display: "grid",
// // //               gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))",
// // //               gap: 16,
// // //             }}
// // //           >
// // //             <Card title="Impressions" value={metrics.imps.toLocaleString()} />
// // //             <Card title="Clicks" value={metrics.clicks.toLocaleString()} />
// // //             <Card title="CTR" value={`${metrics.ctr}%`} />
// // //             <Card title="eCPM" value={`$${metrics.ecpm}`} />
// // //           </div>

// // //           {/* CHART */}
// // //           <div
// // //             style={{
// // //               background: "#fff",
// // //               borderRadius: 16,
// // //               padding: 20,
// // //               marginTop: 30,
// // //             }}
// // //           >
// // //             <h3 style={{ fontWeight: 700 }}>Campaign Performance</h3>
// // //             <ResponsiveContainer width="100%" height={360}>
// // //               <BarChart data={chartData}>
// // //                 <CartesianGrid strokeDasharray="3 3" />
// // //                 <XAxis dataKey="name" />
// // //                 <YAxis />
// // //                 <Tooltip />
// // //                 <Legend />
// // //                 <Bar dataKey="impressions" fill="#06c19c" />
// // //                 <Bar dataKey="clicks" fill="#0088FE" />
// // //               </BarChart>
// // //             </ResponsiveContainer>
// // //           </div>
// // //         </>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // /* ================= UI HELPERS ================= */
// // // const Card = ({ title, value }) => (
// // //   <div
// // //     style={{
// // //       background: "#fff",
// // //       padding: 22,
// // //       borderRadius: 14,
// // //       boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
// // //       textAlign: "center",
// // //     }}
// // //   >
// // //     <div style={{ fontSize: 14, fontWeight: 600, color: "#6d7a88" }}>
// // //       {title}
// // //     </div>
// // //     <div style={{ fontSize: 24, fontWeight: 800, marginTop: 6 }}>
// // //       {value}
// // //     </div>
// // //   </div>
// // // );

// // // const Skeleton = () => (
// // //   <div style={{ display: "grid", gap: 16 }}>
// // //     {[1, 2, 3, 4].map((i) => (
// // //       <div
// // //         key={i}
// // //         style={{
// // //           height: 90,
// // //           borderRadius: 14,
// // //           background:
// // //             "linear-gradient(90deg, #eee 25%, #ddd 37%, #eee 63%)",
// // //           backgroundSize: "400% 100%",
// // //           animation: "shimmer 1.4s ease infinite",
// // //         }}
// // //       />
// // //     ))}
// // //   </div>
// // // );

// // // export default AdvertiserDashboard;

// // // import React, { useEffect, useState, useMemo } from "react";
// // // import axios from "axios";
// // // import {
// // //   ResponsiveContainer,
// // //   BarChart,
// // //   Bar,
// // //   XAxis,
// // //   YAxis,
// // //   Tooltip,
// // //   CartesianGrid,
// // //   Legend,
// // // } from "recharts";

// // // /* ================= HELPERS ================= */
// // // const toNumber = (v) => {
// // //   const n = parseFloat(v);
// // //   return isNaN(n) ? 0 : n;
// // // };

// // // const TABS = ["Overall", "Video", "OTT", "AdWidget"];

// // // const detectAdTypeFromSheet = (sheet) => {
// // //   const name = (sheet?.name || "").toLowerCase();
// // //   if (name === "video") return "Video";
// // //   if (name === "ott") return "OTT";
// // //   if (name === "adwidget" || name === "widget") return "AdWidget";
// // //   return null;
// // // };

// // // const AdvertiserDashboard = () => {
// // //   const [activeTab, setActiveTab] = useState("Overall");
// // //   const [campaign, setCampaign] = useState("All");
// // //   const [rows, setRows] = useState([]);
// // //   const [loading, setLoading] = useState(true);

// // //   /* ================= FETCH ================= */
// // //   useEffect(() => {
// // //     const fetchData = async () => {
// // //       try {
// // //         setLoading(true);
// // //         const jwt = JSON.parse(localStorage.getItem("jwt"));
// // //         const token = jwt?.token;
// // //         if (!token) return;

// // //         const [genealogyRes, adSheetsRes] = await Promise.all([
// // //           axios.get("https://imediareports.onrender.com/api/getgenealogyrecords", {
// // //             headers: { Authorization: `Bearer ${token}` },
// // //           }),
// // //           axios.get("https://imediareports.onrender.com/api/getallsheets", {
// // //             headers: { Authorization: `Bearer ${token}` },
// // //           }),
// // //         ]);

// // //         const normalized = [];

// // //         genealogyRes?.data?.genealogySheets?.forEach((sheet) => {
// // //           const campaignName = sheet.campaign || "Unknown Campaign";
// // //           const publisher = sheet.publisher || "Unknown Publisher";

// // //           sheet.data?.forEach((row) => {
// // //             const clean = {};
// // //             Object.keys(row || {}).forEach(
// // //               (k) => (clean[k.trim().toLowerCase()] = row[k])
// // //             );

// // //             normalized.push({
// // //               campaign: campaignName,
// // //               publisher,
// // //               adType: "AdWidget",
// // //               impressions: toNumber(clean.impressions),
// // //               clicks: toNumber(clean.clicks),
// // //               cpm: toNumber(clean.cpm),
// // //             });
// // //           });
// // //         });

// // //         adSheetsRes?.data?.forEach((sheet) => {
// // //           const adType = detectAdTypeFromSheet(sheet);
// // //           if (!adType) return;

// // //           const campaignName = sheet.campaign || "Unknown Campaign";
// // //           const publisher = sheet.publisher || "Unknown Publisher";

// // //           sheet.data?.forEach((row) => {
// // //             const clean = {};
// // //             Object.keys(row || {}).forEach(
// // //               (k) => (clean[k.trim().toLowerCase()] = row[k])
// // //             );

// // //             normalized.push({
// // //               campaign: campaignName,
// // //               publisher,
// // //               adType,
// // //               impressions: toNumber(clean.impressions),
// // //               clicks: toNumber(clean.clicks),
// // //               cpm: toNumber(clean.cpm),
// // //             });
// // //           });
// // //         });

// // //         setRows(normalized);
// // //       } catch (e) {
// // //         console.error(e);
// // //       } finally {
// // //         setLoading(false);
// // //       }
// // //     };

// // //     fetchData();
// // //   }, []);

// // //   /* ================= CAMPAIGNS ================= */
// // //   const campaigns = useMemo(
// // //     () => ["All", ...new Set(rows.map((r) => r.campaign))],
// // //     [rows]
// // //   );

// // //   /* ================= FILTER ================= */
// // //   const filteredRows = useMemo(() => {
// // //     return rows.filter((r) => {
// // //       if (activeTab !== "Overall" && r.adType !== activeTab) return false;
// // //       if (campaign !== "All" && r.campaign !== campaign) return false;
// // //       return true;
// // //     });
// // //   }, [rows, activeTab, campaign]);

// // //   /* ================= METRICS ================= */
// // //   const metrics = useMemo(() => {
// // //     const imps = filteredRows.reduce((a, b) => a + b.impressions, 0);
// // //     const clicks = filteredRows.reduce((a, b) => a + b.clicks, 0);
// // //     const ctr = imps ? ((clicks / imps) * 100).toFixed(2) : "0.00";
// // //     const ecpm = imps
// // //       ? (
// // //           filteredRows.reduce(
// // //             (a, b) => a + (b.impressions / 1000) * b.cpm,
// // //             0
// // //           ) / imps
// // //         ).toFixed(2)
// // //       : "0.00";

// // //     return { imps, clicks, ctr, ecpm };
// // //   }, [filteredRows]);

// // //   /* ================= CHART DATA (THE FIX) ================= */
// // //   const chartData = useMemo(() => {
// // //     const map = {};

// // //     filteredRows.forEach((r) => {
// // //       const key = campaign === "All" ? r.campaign : r.publisher;

// // //       if (!map[key]) {
// // //         map[key] = {
// // //           name: key,
// // //           impressions: 0,
// // //           clicks: 0,
// // //         };
// // //       }

// // //       map[key].impressions += r.impressions;
// // //       map[key].clicks += r.clicks;
// // //     });

// // //     return Object.values(map);
// // //   }, [filteredRows, campaign]);

// // //   /* ================= UI ================= */
// // //   return (
// // //     <div style={{ padding: 24 }}>
// // //       <h2>Advertiser Performance</h2>

// // //       {/* TABS */}
// // //       <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
// // //         {TABS.map((t) => (
// // //           <button key={t} onClick={() => setActiveTab(t)}>
// // //             {t}
// // //           </button>
// // //         ))}
// // //       </div>

// // //       {/* CARDS */}
// // //       <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
// // //         <Card title="Impressions" value={metrics.imps.toLocaleString()} />
// // //         <Card title="Clicks" value={metrics.clicks.toLocaleString()} />
// // //         <Card title="CTR" value={`${metrics.ctr}%`} />
// // //         <Card title="eCPM" value={`$${metrics.ecpm}`} />
// // //       </div>

// // //       {/* CHART HEADER + DROPDOWN (RIGHT SIDE) */}
// // //       <div
// // //         style={{
// // //           display: "flex",
// // //           justifyContent: "space-between",
// // //           alignItems: "center",
// // //           marginTop: 32,
// // //         }}
// // //       >
// // //         <h3>Campaign Performance</h3>

// // //         <select value={campaign} onChange={(e) => setCampaign(e.target.value)}>
// // //           {campaigns.map((c) => (
// // //             <option key={c}>{c}</option>
// // //           ))}
// // //         </select>
// // //       </div>

// // //       {/* CHART */}
// // //       <ResponsiveContainer width="100%" height={360}>
// // //         <BarChart data={chartData}>
// // //           <CartesianGrid strokeDasharray="3 3" />
// // //           <XAxis dataKey="name" />
// // //           <YAxis />
// // //           <Tooltip />
// // //           <Legend />
// // //           <Bar dataKey="impressions" fill="#06c19c" />
// // //           <Bar dataKey="clicks" fill="#0088FE" />
// // //         </BarChart>
// // //       </ResponsiveContainer>
// // //     </div>
// // //   );
// // // };

// // // /* ================= UI HELPERS ================= */
// // // const Card = ({ title, value }) => (
// // //   <div style={{ background: "#fff", padding: 20, borderRadius: 12 }}>
// // //     <div>{title}</div>
// // //     <div style={{ fontSize: 22, fontWeight: 700 }}>{value}</div>
// // //   </div>
// // // );

// // // export default AdvertiserDashboard;

// // // import React, { useEffect, useState, useMemo } from "react";
// // // import axios from "axios";
// // // import {
// // //   ResponsiveContainer,
// // //   BarChart,
// // //   Bar,
// // //   XAxis,
// // //   YAxis,
// // //   Tooltip,
// // //   CartesianGrid,
// // //   Legend,
// // // } from "recharts";
// // // import "./Advertiser.css";

// // // /* ================= HELPERS ================= */
// // // const toNumber = (v) => {
// // //   const n = parseFloat(v);
// // //   return isNaN(n) ? 0 : n;
// // // };

// // // const TABS = ["Overall", "Video", "OTT", "AdWidget"];

// // // const detectAdTypeFromSheet = (sheet) => {
// // //   const name = (sheet?.name || "").toLowerCase();
// // //   if (name === "video") return "Video";
// // //   if (name === "ott") return "OTT";
// // //   if (name === "adwidget" || name === "widget") return "AdWidget";
// // //   return null;
// // // };

// // // const AdvertiserDashboard = () => {
// // //   const [activeTab, setActiveTab] = useState("Overall");
// // //   const [campaign, setCampaign] = useState("All");
// // //   const [rows, setRows] = useState([]);
// // //   const [loading, setLoading] = useState(true);

// // //   /* ================= FETCH ================= */
// // //   useEffect(() => {
// // //     const fetchData = async () => {
// // //       try {
// // //         setLoading(true);
// // //         const jwt = JSON.parse(localStorage.getItem("jwt"));
// // //         const token = jwt?.token;
// // //         if (!token) return;

// // //         const [genealogyRes, adSheetsRes] = await Promise.all([
// // //           axios.get("https://imediareports.onrender.com/api/getgenealogyrecords", {
// // //             headers: { Authorization: `Bearer ${token}` },
// // //           }),
// // //           axios.get("https://imediareports.onrender.com/api/getallsheets", {
// // //             headers: { Authorization: `Bearer ${token}` },
// // //           }),
// // //         ]);

// // //         const normalized = [];

// // //         genealogyRes?.data?.genealogySheets?.forEach((sheet) => {
// // //           const campaignName = sheet.campaign || "Unknown Campaign";
// // //           const publisher = sheet.publisher || "Unknown Publisher";

// // //           sheet.data?.forEach((row) => {
// // //             const clean = {};
// // //             Object.keys(row || {}).forEach(
// // //               (k) => (clean[k.trim().toLowerCase()] = row[k])
// // //             );

// // //             normalized.push({
// // //               campaign: campaignName,
// // //               publisher,
// // //               adType: "AdWidget",
// // //               impressions: toNumber(clean.impressions),
// // //               clicks: toNumber(clean.clicks),
// // //               cpm: toNumber(clean.cpm),
// // //             });
// // //           });
// // //         });

// // //         adSheetsRes?.data?.forEach((sheet) => {
// // //           const adType = detectAdTypeFromSheet(sheet);
// // //           if (!adType) return;

// // //           const campaignName = sheet.campaign || "Unknown Campaign";
// // //           const publisher = sheet.publisher || "Unknown Publisher";

// // //           sheet.data?.forEach((row) => {
// // //             const clean = {};
// // //             Object.keys(row || {}).forEach(
// // //               (k) => (clean[k.trim().toLowerCase()] = row[k])
// // //             );

// // //             normalized.push({
// // //               campaign: campaignName,
// // //               publisher,
// // //               adType,
// // //               impressions: toNumber(clean.impressions),
// // //               clicks: toNumber(clean.clicks),
// // //               cpm: toNumber(clean.cpm),
// // //             });
// // //           });
// // //         });

// // //         setRows(normalized);
// // //       } catch (e) {
// // //         console.error(e);
// // //       } finally {
// // //         setLoading(false);
// // //       }
// // //     };

// // //     fetchData();
// // //   }, []);

// // //   /* ================= CAMPAIGNS ================= */
// // //   const campaigns = useMemo(
// // //     () => ["All", ...new Set(rows.map((r) => r.campaign))],
// // //     [rows]
// // //   );

// // //   /* ================= FILTER ================= */
// // //   const filteredRows = useMemo(() => {
// // //     return rows.filter((r) => {
// // //       if (activeTab !== "Overall" && r.adType !== activeTab) return false;
// // //       if (campaign !== "All" && r.campaign !== campaign) return false;
// // //       return true;
// // //     });
// // //   }, [rows, activeTab, campaign]);

// // //   /* ================= METRICS ================= */
// // //   const metrics = useMemo(() => {
// // //     const imps = filteredRows.reduce((a, b) => a + b.impressions, 0);
// // //     const clicks = filteredRows.reduce((a, b) => a + b.clicks, 0);
// // //     const ctr = imps ? ((clicks / imps) * 100).toFixed(2) : "0.00";
// // //     const ecpm = imps
// // //       ? (
// // //           filteredRows.reduce(
// // //             (a, b) => a + (b.impressions / 1000) * b.cpm,
// // //             0
// // //           ) / imps
// // //         ).toFixed(2)
// // //       : "0.00";

// // //     return { imps, clicks, ctr, ecpm };
// // //   }, [filteredRows]);

// // //   /* ================= CHART DATA ================= */
// // //   const chartData = useMemo(() => {
// // //     const map = {};
// // //     filteredRows.forEach((r) => {
// // //       const key = campaign === "All" ? r.campaign : r.publisher;
// // //       if (!map[key]) {
// // //         map[key] = { name: key, impressions: 0, clicks: 0 };
// // //       }
// // //       map[key].impressions += r.impressions;
// // //       map[key].clicks += r.clicks;
// // //     });
// // //     return Object.values(map);
// // //   }, [filteredRows, campaign]);

// // //   /* ================= UI ================= */
// // //   return (
// // //     <div className="dashboard-wrapper">
// // //       <h2 className="page-title">Advertiser Performance</h2>

// // //       {/* TABS */}
// // //       <div className="tabs">
// // //         {TABS.map((t) => (
// // //           <button
// // //             key={t}
// // //             className={activeTab === t ? "tab active" : "tab"}
// // //             onClick={() => setActiveTab(t)}
// // //           >
// // //             {t}
// // //           </button>
// // //         ))}
// // //       </div>

// // //       {/* CARDS */}
// // //       <div className="cards">
// // //         <Card title="Impressions" value={metrics.imps.toLocaleString()} />
// // //         <Card title="Clicks" value={metrics.clicks.toLocaleString()} />
// // //         <Card title="CTR" value={`${metrics.ctr}%`} />
// // //         <Card title="eCPM" value={`$${metrics.ecpm}`} />
// // //       </div>

// // //       {/* CAMPAIGN PERFORMANCE */}
// // //       <div className="campaign-card">
// // //         <div className="campaign-header">
// // //           <h3>Campaign Performance</h3>

// // //           <select
// // //             className="campaign-select"
// // //             value={campaign}
// // //             onChange={(e) => setCampaign(e.target.value)}
// // //           >
// // //             {campaigns.map((c) => (
// // //               <option key={c} value={c}>
// // //                 {c}
// // //               </option>
// // //             ))}
// // //           </select>
// // //         </div>

// // //         <ResponsiveContainer width="100%" height={360}>
// // //           <BarChart data={chartData}>
// // //             <CartesianGrid strokeDasharray="3 3" />
// // //             <XAxis dataKey="name" />
// // //             <YAxis />
// // //             <Tooltip />
// // //             <Legend />
// // //             <Bar dataKey="impressions" fill="#06c19c" />
// // //             <Bar dataKey="clicks" fill="#0088FE" />
// // //           </BarChart>
// // //         </ResponsiveContainer>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // /* ================= CARD ================= */
// // // const Card = ({ title, value }) => (
// // //   <div className="metric-card">
// // //     <div className="metric-title">{title}</div>
// // //     <div className="metric-value">{value}</div>
// // //   </div>
// // // );

// // // export default AdvertiserDashboard;

// // import React, { useEffect, useState, useMemo } from "react";
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
// // } from "recharts";
// // import "./Advertiser.css";

// // /* ================= HELPERS ================= */
// // const toNumber = (v) => {
// //   const n = parseFloat(v);
// //   return isNaN(n) ? 0 : n;
// // };

// // const TABS = ["Overall", "Video", "OTT", "AdWidget"];

// // const detectAdTypeFromSheet = (sheet) => {
// //   const name = (sheet?.name || "").toLowerCase();
// //   if (name === "video") return "Video";
// //   if (name === "ott") return "OTT";
// //   if (name === "adwidget" || name === "widget") return "AdWidget";
// //   return null;
// // };

// // const AdvertiserDashboard = () => {
// //   const [activeTab, setActiveTab] = useState("Overall");
// //   const [campaign, setCampaign] = useState("All");
// //   const [rows, setRows] = useState([]);
// //   const [loading, setLoading] = useState(true);      // API load
// //   const [uiLoading, setUiLoading] = useState(false); // tabs / dropdown

// //   /* ================= FETCH (ONLY SHEETS) ================= */
// //   useEffect(() => {
// //     const fetchData = async () => {
// //       try {
// //         setLoading(true);
// //         const jwt = JSON.parse(localStorage.getItem("jwt"));
// //         const token = jwt?.token;
// //         if (!token) return;

// //         const { data } = await axios.get(
// //           "https://imediareports.onrender.com/api/getallsheets",
// //           { headers: { Authorization: `Bearer ${token}` } }
// //         );

// //         const normalized = [];

// //         data?.forEach((sheet) => {
// //           const adType = detectAdTypeFromSheet(sheet);
// //           if (!adType) return;

// //           const campaignName = sheet.campaign || "Unknown Campaign";
// //           const publisher = sheet.publisher || "Unknown Publisher";

// //           sheet.data?.forEach((row) => {
// //             const clean = {};
// //             Object.keys(row || {}).forEach(
// //               (k) => (clean[k.trim().toLowerCase()] = row[k])
// //             );

// //             normalized.push({
// //               campaign: campaignName,
// //               publisher,
// //               adType,
// //               impressions: toNumber(clean.impressions),
// //               clicks: toNumber(clean.clicks),
// //               cpm: toNumber(clean.cpm),
// //             });
// //           });
// //         });

// //         setRows(normalized);
// //       } catch (err) {
// //         console.error("Advertiser fetch error:", err);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchData();
// //   }, []);

// //   /* ================= CAMPAIGNS ================= */
// //   const campaigns = useMemo(
// //     () => ["All", ...new Set(rows.map((r) => r.campaign))],
// //     [rows]
// //   );

// //   /* ================= FILTER ================= */
// //   const filteredRows = useMemo(() => {
// //     return rows.filter((r) => {
// //       if (activeTab !== "Overall" && r.adType !== activeTab) return false;
// //       if (campaign !== "All" && r.campaign !== campaign) return false;
// //       return true;
// //     });
// //   }, [rows, activeTab, campaign]);

// //   /* ================= METRICS ================= */
// //   const metrics = useMemo(() => {
// //     const imps = filteredRows.reduce((a, b) => a + b.impressions, 0);
// //     const clicks = filteredRows.reduce((a, b) => a + b.clicks, 0);
// //     const ctr = imps ? ((clicks / imps) * 100).toFixed(2) : "0.00";
// //     const ecpm = imps
// //       ? (
// //           filteredRows.reduce(
// //             (a, b) => a + (b.impressions / 1000) * b.cpm,
// //             0
// //           ) / imps
// //         ).toFixed(2)
// //       : "0.00";

// //     return { imps, clicks, ctr, ecpm };
// //   }, [filteredRows]);

// //   /* ================= CHART DATA ================= */
// //   const chartData = useMemo(() => {
// //     const map = {};

// //     filteredRows.forEach((r) => {
// //       const key = campaign === "All" ? r.campaign : r.publisher;

// //       if (!map[key]) {
// //         map[key] = {
// //           name: key,
// //           impressions: 0,
// //           clicks: 0,
// //         };
// //       }

// //       map[key].impressions += r.impressions;
// //       map[key].clicks += r.clicks;
// //     });

// //     return Object.values(map);
// //   }, [filteredRows, campaign]);

// //   const showSkeleton = loading || uiLoading;

// //   /* ================= UI ================= */
// //   return (
// //     <div className="dashboard-wrapper">
// //       <h2 className="page-title">Advertiser Performance</h2>

// //       {/* TABS */}
// //       <div className="tabs">
// //         {TABS.map((t) => (
// //           <button
// //             key={t}
// //             disabled={showSkeleton}
// //             className={activeTab === t ? "tab active" : "tab"}
// //             onClick={() => {
// //               setUiLoading(true);
// //               setActiveTab(t);
// //               setTimeout(() => setUiLoading(false), 300);
// //             }}
// //           >
// //             {t}
// //           </button>
// //         ))}
// //       </div>

// //       {/* METRIC CARDS */}
// //       <div className="cards">
// //         {showSkeleton ? (
// //           [...Array(4)].map((_, i) => <SkeletonCard key={i} />)
// //         ) : (
// //           <>
// //             <Card title="Impressions" value={metrics.imps.toLocaleString()} />
// //             <Card title="Clicks" value={metrics.clicks.toLocaleString()} />
// //             <Card title="CTR" value={`${metrics.ctr}%`} />
// //             <Card title="eCPM" value={`$${metrics.ecpm}`} />
// //           </>
// //         )}
// //       </div>

// //       {/* CHART */}
// //       <div className="campaign-card">
// //         <div className="campaign-header">
// //           <h3>Campaign Performance</h3>

// //           <select
// //             className="campaign-select"
// //             disabled={showSkeleton}
// //             value={campaign}
// //             onChange={(e) => {
// //               setUiLoading(true);
// //               setCampaign(e.target.value);
// //               setTimeout(() => setUiLoading(false), 300);
// //             }}
// //           >
// //             {campaigns.map((c) => (
// //               <option key={c} value={c}>
// //                 {c}
// //               </option>
// //             ))}
// //           </select>
// //         </div>

// //         {showSkeleton ? (
// //           <SkeletonChart />
// //         ) : (
// //           <ResponsiveContainer width="100%" height={360}>
// //             <BarChart data={chartData}>
// //               <CartesianGrid strokeDasharray="3 3" />
// //               <XAxis dataKey="name" />
// //               <YAxis />
// //               <Tooltip />
// //               <Legend />
// //               <Bar dataKey="impressions" fill="#06c19c" />
// //               <Bar dataKey="clicks" fill="#0088FE" />
// //             </BarChart>
// //           </ResponsiveContainer>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // /* ================= UI COMPONENTS ================= */
// // const Card = ({ title, value }) => (
// //   <div className="metric-card">
// //     <div className="metric-title">{title}</div>
// //     <div className="metric-value">{value}</div>
// //   </div>
// // );

// // const SkeletonCard = () => (
// //   <div className="metric-card skeleton">
// //     <div className="skeleton-line small" />
// //     <div className="skeleton-line big" />
// //   </div>
// // );

// // const SkeletonChart = () => (
// //   <div className="chart-skeleton">
// //     <div className="skeleton-bar" />
// //     <div className="skeleton-bar" />
// //     <div className="skeleton-bar" />
// //   </div>
// // );

// // export default AdvertiserDashboard;

// // import React, { useEffect, useState, useMemo } from "react";
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
// // } from "recharts";
// // import "./Advertiser.css";

// // /* ================= HELPERS ================= */
// // const toNumber = (v) => {
// //   const n = parseFloat(v);
// //   return isNaN(n) ? 0 : n;
// // };

// // const TABS = ["Overall", "Video", "OTT", "AdWidget"];

// // const detectAdTypeFromSheet = (sheet) => {
// //   const name = (sheet?.name || "").toLowerCase();
// //   if (name === "video") return "Video";
// //   if (name === "ott") return "OTT";
// //   if (name === "adwidget" || name === "widget") return "AdWidget";
// //   return null;
// // };

// // /* ================= METRIC CONFIG ================= */
// // const METRIC_CONFIG = {
// //   Video: ["impressions", "clicks", "ctr", "ecpm"],
// //   OTT: ["impressions", "ecpm"],
// //   AdWidget: ["impressions", "clicks", "ctr"],
// //   Overall: ["impressions", "clicks", "ctr", "ecpm"],
// // };

// // const METRIC_LABELS = {
// //   impressions: "Impressions",
// //   clicks: "Clicks",
// //   ctr: "CTR",
// //   ecpm: "eCPM",
// // };

// // const AdvertiserDashboard = () => {
// //   const [activeTab, setActiveTab] = useState("Overall");
// //   const [campaign, setCampaign] = useState("All");
// //   const [rows, setRows] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [uiLoading, setUiLoading] = useState(false);

// //   const [showGraph, setShowGraph] = useState(true);
// //   const [showTable, setShowTable] = useState(false);
// //   const [tableLimit, setTableLimit] = useState(8);

// //   /* ================= FETCH ================= */
// //   useEffect(() => {
// //     const fetchData = async () => {
// //       try {
// //         setLoading(true);
// //         const jwt = JSON.parse(localStorage.getItem("jwt"));
// //         const token = jwt?.token;
// //         if (!token) return;

// //         const { data } = await axios.get(
// //           "https://imediareports.onrender.com/api/getallsheets",
// //           { headers: { Authorization: `Bearer ${token}` } }
// //         );

// //         const normalized = [];

// //         data?.forEach((sheet) => {
// //           const adType = detectAdTypeFromSheet(sheet);
// //           if (!adType) return;

// //           const campaignName = sheet.campaign || "Unknown Campaign";
// //           const publisher = sheet.publisher || "Unknown Publisher";

// //           sheet.data?.forEach((row) => {
// //             const clean = {};
// //             Object.keys(row || {}).forEach(
// //               (k) => (clean[k.trim().toLowerCase()] = row[k])
// //             );

// //             normalized.push({
// //               campaign: campaignName,
// //               publisher,
// //               adType,
// //               impressions: toNumber(clean.impressions),
// //               clicks: toNumber(clean.clicks),
// //               cpm: toNumber(clean.cpm),
// //             });
// //           });
// //         });

// //         setRows(normalized);
// //       } catch (e) {
// //         console.error(e);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchData();
// //   }, []);

// //   /* ================= CAMPAIGNS ================= */
// //   const campaigns = useMemo(
// //     () => ["All", ...new Set(rows.map((r) => r.campaign))],
// //     [rows]
// //   );

// //   /* ================= FILTER ================= */
// //   const filteredRows = useMemo(() => {
// //     return rows.filter((r) => {
// //       if (activeTab !== "Overall" && r.adType !== activeTab) return false;
// //       if (campaign !== "All" && r.campaign !== campaign) return false;
// //       return true;
// //     });
// //   }, [rows, activeTab, campaign]);

// //   /* ================= METRICS ================= */
// //   const metrics = useMemo(() => {
// //     const imps = filteredRows.reduce((a, b) => a + b.impressions, 0);
// //     const clicks = filteredRows.reduce((a, b) => a + b.clicks, 0);
// //     const ctr = imps ? ((clicks / imps) * 100).toFixed(2) : "0.00";
// //     const ecpm = imps
// //       ? (
// //           filteredRows.reduce(
// //             (a, b) => a + (b.impressions / 1000) * b.cpm,
// //             0
// //           ) / imps
// //         ).toFixed(2)
// //       : "0.00";

// //     return { impressions: imps, clicks, ctr, ecpm };
// //   }, [filteredRows]);

// //   /* ================= CHART ================= */
// //   const chartData = useMemo(() => {
// //     const map = {};
// //     filteredRows.forEach((r) => {
// //       if (!map[r.campaign]) {
// //         map[r.campaign] = {
// //           name: r.campaign,
// //           impressions: 0,
// //           clicks: 0,
// //         };
// //       }
// //       map[r.campaign].impressions += r.impressions;
// //       map[r.campaign].clicks += r.clicks;
// //     });
// //     return Object.values(map);
// //   }, [filteredRows]);

// //   const visibleMetrics = METRIC_CONFIG[activeTab];

// //   const showSkeleton = loading || uiLoading;

// //   /* ================= UI ================= */
// //   return (
// //     <div className="dashboard-wrapper">
// //       <h2 className="page-title">Advertiser Performance</h2>

// //       {/* TABS */}
// //       <div className="tabs">
// //         {TABS.map((t) => (
// //           <button
// //             key={t}
// //             className={activeTab === t ? "tab active" : "tab"}
// //             onClick={() => {
// //               setUiLoading(true);
// //               setActiveTab(t);
// //               setTimeout(() => setUiLoading(false), 300);
// //             }}
// //           >
// //             {t}
// //           </button>
// //         ))}
// //       </div>

// //       {/* CONTROLS */}
// //       <div className="controls-row">
// //         <select
// //           value={campaign}
// //           onChange={(e) => setCampaign(e.target.value)}
// //         >
// //           {campaigns.map((c) => (
// //             <option key={c}>{c}</option>
// //           ))}
// //         </select>

// //         <label>
// //           <input
// //             type="checkbox"
// //             checked={showGraph}
// //             onChange={() => setShowGraph(!showGraph)}
// //           />
// //           Show Graph
// //         </label>

// //         <label>
// //           <input
// //             type="checkbox"
// //             checked={showTable}
// //             onChange={() => setShowTable(!showTable)}
// //           />
// //           Show Table
// //         </label>
// //       </div>

// //       {/* METRICS */}
// //       <div className="cards">
// //         {visibleMetrics.map((m) => (
// //           <Card
// //             key={m}
// //             title={METRIC_LABELS[m]}
// //             value={
// //               m === "ctr"
// //                 ? `${metrics[m]}%`
// //                 : metrics[m].toLocaleString()
// //             }
// //           />
// //         ))}
// //       </div>

// //       {/* GRAPH */}
// //       {showGraph && (
// //         <ResponsiveContainer width="100%" height={350}>
// //           <BarChart data={chartData}>
// //             <CartesianGrid strokeDasharray="3 3" />
// //             <XAxis dataKey="name" />
// //             <YAxis />
// //             <Tooltip />
// //             <Legend />
// //             <Bar dataKey="impressions" fill="#06c19c" />
// //             {visibleMetrics.includes("clicks") && (
// //               <Bar dataKey="clicks" fill="#0088FE" />
// //             )}
// //           </BarChart>
// //         </ResponsiveContainer>
// //       )}

// //       {/* TABLE */}
// //       {showTable && (
// //         <div className="table-wrapper">
// //           <table>
// //             <thead>
// //               <tr>
// //                 <th>Campaign</th>
// //                 <th>Publisher</th>
// //                 {visibleMetrics.map((m) => (
// //                   <th key={m}>{METRIC_LABELS[m]}</th>
// //                 ))}
// //               </tr>
// //             </thead>
// //             <tbody>
// //               {filteredRows.slice(0, tableLimit).map((r, i) => (
// //                 <tr key={i}>
// //                   <td>{r.campaign}</td>
// //                   <td>{r.publisher}</td>
// //                   {visibleMetrics.map((m) => (
// //                     <td key={m}>
// //                       {m === "ctr"
// //                         ? `${((r.clicks / r.impressions) * 100 || 0).toFixed(
// //                             2
// //                           )}%`
// //                         : r[m]?.toLocaleString()}
// //                     </td>
// //                   ))}
// //                 </tr>
// //               ))}
// //             </tbody>
// //           </table>

// //           {tableLimit < filteredRows.length && (
// //             <button onClick={() => setTableLimit(tableLimit + 8)}>
// //               Load More
// //             </button>
// //           )}
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // /* ================= UI COMPONENTS ================= */
// // const Card = ({ title, value }) => (
// //   <div className="metric-card">
// //     <div className="metric-title">{title}</div>
// //     <div className="metric-value">{value}</div>
// //   </div>
// // );

// // export default AdvertiserDashboard;

// import React, { useEffect, useState, useMemo } from "react";
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
// } from "recharts";
// import "./Advertiser.css";

// /* ================= HELPERS ================= */
// const toNumber = (v) => {
//   const n = parseFloat(v);
//   return isNaN(n) ? 0 : n;
// };

// const TABS = ["Overall", "Video", "OTT", "AdWidget"];

// const detectAdTypeFromSheet = (sheet) => {
//   const name = (sheet?.name || "").toLowerCase();
//   if (name === "video") return "Video";
//   if (name === "ott") return "OTT";
//   if (name === "adwidget" || name === "widget") return "AdWidget";
//   return null;
// };

// /* ================= METRIC CONFIG ================= */
// const METRIC_CONFIG = {
//   Video: ["impressions", "clicks", "ctr", "ecpm"],
//   OTT: ["impressions", "ecpm"],
//   AdWidget: ["impressions", "clicks", "ctr"],
//   Overall: ["impressions", "clicks", "ctr", "ecpm"],
// };

// const METRIC_LABELS = {
//   impressions: "Impressions",
//   clicks: "Clicks",
//   ctr: "CTR",
//   ecpm: "eCPM",
// };

// const AdvertiserDashboard = () => {
//   const [activeTab, setActiveTab] = useState("Overall");
//   const [campaign, setCampaign] = useState("All");
//   const [rows, setRows] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [uiLoading, setUiLoading] = useState(false);

//   const [showGraph, setShowGraph] = useState(true);
//   const [showTable, setShowTable] = useState(false);
//   const [tableLimit, setTableLimit] = useState(8);

//   /* ================= FETCH ================= */
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const jwt = JSON.parse(localStorage.getItem("jwt"));
//         const token = jwt?.token;
//         if (!token) return;

//         const { data } = await axios.get(
//           "https://imediareports.onrender.com/api/getallsheets",
//           { headers: { Authorization: `Bearer ${token}` } }
//         );

//         const normalized = [];

//         data?.forEach((sheet) => {
//           const adType = detectAdTypeFromSheet(sheet);
//           if (!adType) return;

//           const campaignName = sheet.campaign || "Unknown Campaign";
//           const publisher = sheet.publisher || "Unknown Publisher";

//           sheet.data?.forEach((row) => {
//             const clean = {};
//             Object.keys(row || {}).forEach(
//               (k) => (clean[k.trim().toLowerCase()] = row[k])
//             );

//             normalized.push({
//               campaign: campaignName,
//               publisher,
//               adType,
//               impressions: toNumber(clean.impressions),
//               clicks: toNumber(clean.clicks),
//               cpm: toNumber(clean.cpm),
//             });
//           });
//         });

//         setRows(normalized);
//       } catch (e) {
//         console.error(e);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   /* ================= CAMPAIGNS ================= */
//   const campaigns = useMemo(
//     () => ["All", ...new Set(rows.map((r) => r.campaign))],
//     [rows]
//   );

//   /* ================= FILTER ================= */
//   const filteredRows = useMemo(() => {
//     return rows.filter((r) => {
//       if (activeTab !== "Overall" && r.adType !== activeTab) return false;
//       if (campaign !== "All" && r.campaign !== campaign) return false;
//       return true;
//     });
//   }, [rows, activeTab, campaign]);

//   /* ================= METRICS ================= */
//   const metrics = useMemo(() => {
//     const imps = filteredRows.reduce((a, b) => a + b.impressions, 0);
//     const clicks = filteredRows.reduce((a, b) => a + b.clicks, 0);
//     const ctr = imps ? ((clicks / imps) * 100).toFixed(2) : "0.00";
//     const ecpm = imps
//       ? (
//           filteredRows.reduce(
//             (a, b) => a + (b.impressions / 1000) * b.cpm,
//             0
//           ) / imps
//         ).toFixed(2)
//       : "0.00";

//     return { impressions: imps, clicks, ctr, ecpm };
//   }, [filteredRows]);

//   /* ================= CHART ================= */
//   const chartData = useMemo(() => {
//     const map = {};
//     filteredRows.forEach((r) => {
//       if (!map[r.campaign]) {
//         map[r.campaign] = {
//           name: r.campaign,
//           impressions: 0,
//           clicks: 0,
//         };
//       }
//       map[r.campaign].impressions += r.impressions;
//       map[r.campaign].clicks += r.clicks;
//     });
//     return Object.values(map);
//   }, [filteredRows]);

//   const visibleMetrics = METRIC_CONFIG[activeTab];

//   /* ================= UI ================= */
//   return (
//     <div className="dashboard-wrapper">
//       <h2 className="page-title" style={{ fontSize: 30, fontWeight: 700 }}>
//         Advertiser Performance
//       </h2>

//       {/* TABS */}
//       <div className="tabs">
//         {TABS.map((t) => (
//           <button
//             key={t}
//             className={activeTab === t ? "tab active" : "tab"}
//             style={{ fontSize: 18, fontWeight: 600 }}
//             onClick={() => {
//               setUiLoading(true);
//               setActiveTab(t);
//               setTimeout(() => setUiLoading(false), 300);
//             }}
//           >
//             {t}
//           </button>
//         ))}
//       </div>

//       {/* CONTROLS */}
//       <div className="controls-row" style={{ fontSize: 18 }}>
//         <select
//           value={campaign}
//           onChange={(e) => setCampaign(e.target.value)}
//           style={{ fontSize: 18 }}
//         >
//           {campaigns.map((c) => (
//             <option key={c}>{c}</option>
//           ))}
//         </select>

//         <label style={{ fontSize: 18 }}>
//           <input
//             type="checkbox"
//             checked={showGraph}
//             onChange={() => setShowGraph(!showGraph)}
//           />
//           {" "}Show Graph
//         </label>

//         <label style={{ fontSize: 18 }}>
//           <input
//             type="checkbox"
//             checked={showTable}
//             onChange={() => setShowTable(!showTable)}
//           />
//           {" "}Show Table
//         </label>
//       </div>

//       {/* METRICS */}
//       <div className="cards">
//         {visibleMetrics.map((m) => (
//           <Card
//             key={m}
//             title={METRIC_LABELS[m]}
//             value={
//               m === "ctr"
//                 ? `${metrics[m]}%`
//                 : metrics[m].toLocaleString()
//             }
//           />
//         ))}
//       </div>

//       {/* GRAPH */}
//       {showGraph && (
//         <ResponsiveContainer width="100%" height={380}>
//           <BarChart data={chartData}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="name" tick={{ fontSize: 16 }} />
//             <YAxis tick={{ fontSize: 16 }} />
//             <Tooltip contentStyle={{ fontSize: 16 }} />
//             <Legend wrapperStyle={{ fontSize: 16 }} />
//             <Bar dataKey="impressions" fill="#06c19c" />
//             {visibleMetrics.includes("clicks") && (
//               <Bar dataKey="clicks" fill="#0088FE" />
//             )}
//           </BarChart>
//         </ResponsiveContainer>
//       )}

//       {/* TABLE */}
//       {showTable && (
//         <div className="table-wrapper">
//           <table>
//             <thead>
//               <tr>
//                 <th style={{ fontSize: 20, fontWeight: 700 }}>Campaign</th>
//                 <th style={{ fontSize: 20, fontWeight: 700 }}>Publisher</th>
//                 {visibleMetrics.map((m) => (
//                   <th key={m} style={{ fontSize: 20, fontWeight: 700 }}>
//                     {METRIC_LABELS[m]}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {filteredRows.slice(0, tableLimit).map((r, i) => (
//                 <tr key={i}>
//                   <td style={{ fontSize: 18 }}>{r.campaign}</td>
//                   <td style={{ fontSize: 18 }}>{r.publisher}</td>
//                   {visibleMetrics.map((m) => (
//                     <td key={m} style={{ fontSize: 18 }}>
//                       {m === "ctr"
//                         ? `${((r.clicks / r.impressions) * 100 || 0).toFixed(
//                             2
//                           )}%`
//                         : r[m]?.toLocaleString()}
//                     </td>
//                   ))}
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {tableLimit < filteredRows.length && (
//             <button
//               style={{ fontSize: 18, fontWeight: 600 }}
//               onClick={() => setTableLimit(tableLimit + 8)}
//             >
//               Load More
//             </button>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// /* ================= UI COMPONENT ================= */
// const Card = ({ title, value }) => (
//   <div className="metric-card">
//     <div className="metric-title" style={{ fontSize: 20, fontWeight: 600 }}>
//       {title}
//     </div>
//     <div className="metric-value" style={{ fontSize: 26, fontWeight: 700 }}>
//       {value}
//     </div>
//   </div>
// );

// export default AdvertiserDashboard;
import React, { useEffect, useState, useMemo } from "react";
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
} from "recharts";
import "./Advertiser.css";

/* ================= HELPERS ================= */
const toNumber = (v) => {
  const n = parseFloat(v);
  return isNaN(n) ? 0 : n;
};

const TABS = ["Overall", "Video", "OTT", "AdWidget"];

const detectAdTypeFromSheet = (sheet) => {
  const name = (sheet?.name || "").toLowerCase();
  if (name === "video") return "Video";
  if (name === "ott") return "OTT";
  if (name === "adwidget" || name === "widget") return "AdWidget";
  return null;
};

/* ================= METRIC CONFIG ================= */
const METRIC_CONFIG = {
  Video: ["impressions", "clicks", "ctr", "ecpm"],
  OTT: ["impressions", "ecpm"],
  AdWidget: ["impressions", "clicks", "ctr"],
  Overall: ["impressions", "clicks", "ctr", "ecpm"],
};

const METRIC_LABELS = {
  impressions: "Impressions",
  clicks: "Clicks",
  ctr: "CTR",
  ecpm: "eCPM",
};

const AdvertiserDashboard = () => {
  const [activeTab, setActiveTab] = useState("Overall");
  const [campaign, setCampaign] = useState("All");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true); // ✅
  const [uiLoading, setUiLoading] = useState(false);

  const [showGraph, setShowGraph] = useState(true);
  const [showTable, setShowTable] = useState(false);
  const [tableLimit, setTableLimit] = useState(8);

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // ✅
        const jwt = JSON.parse(localStorage.getItem("jwt"));
        const token = jwt?.token;
        if (!token) return;

        const { data } = await axios.get(
          "https://imediareports.onrender.com/api/getallsheets",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const normalized = [];

        data?.forEach((sheet) => {
          const adType = detectAdTypeFromSheet(sheet);
          if (!adType) return;

          const campaignName = sheet.campaign || "Unknown Campaign";
          const publisher = sheet.publisher || "Unknown Publisher";

          sheet.data?.forEach((row) => {
            const clean = {};
            Object.keys(row || {}).forEach(
              (k) => (clean[k.trim().toLowerCase()] = row[k])
            );

            normalized.push({
              campaign: campaignName,
              publisher,
              adType,
              impressions: toNumber(clean.impressions),
              clicks: toNumber(clean.clicks),
              cpm: toNumber(clean.cpm),
            });
          });
        });

        setRows(normalized);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false); // ✅
      }
    };

    fetchData();
  }, []);

  /* ================= CAMPAIGNS ================= */
  const campaigns = useMemo(
    () => ["All", ...new Set(rows.map((r) => r.campaign))],
    [rows]
  );

  /* ================= FILTER ================= */
  const filteredRows = useMemo(() => {
    return rows.filter((r) => {
      if (activeTab !== "Overall" && r.adType !== activeTab) return false;
      if (campaign !== "All" && r.campaign !== campaign) return false;
      return true;
    });
  }, [rows, activeTab, campaign]);

  /* ================= METRICS ================= */
  const metrics = useMemo(() => {
    const imps = filteredRows.reduce((a, b) => a + b.impressions, 0);
    const clicks = filteredRows.reduce((a, b) => a + b.clicks, 0);
    const ctr = imps ? ((clicks / imps) * 100).toFixed(2) : "0.00";
    const ecpm = imps
      ? (
          filteredRows.reduce(
            (a, b) => a + (b.impressions / 1000) * b.cpm,
            0
          ) / imps
        ).toFixed(2)
      : "0.00";

    return { impressions: imps, clicks, ctr, ecpm };
  }, [filteredRows]);

  /* ================= CHART ================= */
  const chartData = useMemo(() => {
    const map = {};
    filteredRows.forEach((r) => {
      if (!map[r.campaign]) {
        map[r.campaign] = {
          name: r.campaign,
          impressions: 0,
          clicks: 0,
        };
      }
      map[r.campaign].impressions += r.impressions;
      map[r.campaign].clicks += r.clicks;
    });
    return Object.values(map);
  }, [filteredRows]);

  const visibleMetrics = METRIC_CONFIG[activeTab];

  /* ================= UI ================= */
  return (
    <div className="dashboard-wrapper">
      <h2 className="page-title" style={{ fontSize: 30, fontWeight: 700 }}>
        Advertiser Performance
      </h2>

      {/* ===== TABS ===== */}
      <div className="tabs">
        {TABS.map((t) => (
          <button
            key={t}
            className={activeTab === t ? "tab active" : "tab"}
            style={{ fontSize: 18, fontWeight: 600 }}
            onClick={() => {
              setUiLoading(true);
              setActiveTab(t);
              setTimeout(() => setUiLoading(false), 300);
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ===== CONTROLS ===== */}
      <div className="controls-row" style={{ fontSize: 18 }}>
        <select
          value={campaign}
          onChange={(e) => setCampaign(e.target.value)}
          style={{ fontSize: 18 }}
        >
          {campaigns.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <label>
          <input
            type="checkbox"
            checked={showGraph}
            onChange={() => setShowGraph(!showGraph)}
          />{" "}
          Show Graph
        </label>

        <label>
          <input
            type="checkbox"
            checked={showTable}
            onChange={() => setShowTable(!showTable)}
          />{" "}
          Show Table
        </label>
      </div>

      {/* ===== METRIC CARDS ===== */}
      <div className="cards">
        {loading
          ? Array.from({ length: visibleMetrics.length }).map((_, i) => (
              <div key={i} className="metric-card skeleton-card" />
            ))
          : visibleMetrics.map((m) => (
              <Card
                key={m}
                title={METRIC_LABELS[m]}
                value={
                  m === "ctr"
                    ? `${metrics[m]}%`
                    : metrics[m].toLocaleString()
                }
              />
            ))}
      </div>

      {/* ===== GRAPH ===== */}
      {showGraph &&
        (loading ? (
          <div className="skeleton-graph" />
        ) : (
          <ResponsiveContainer width="100%" height={380}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 16 }} />
              <YAxis tick={{ fontSize: 16 }} />
              <Tooltip contentStyle={{ fontSize: 16 }} />
              <Legend wrapperStyle={{ fontSize: 16 }} />
              <Bar dataKey="impressions" fill="#06c19c" />
              {visibleMetrics.includes("clicks") && (
                <Bar dataKey="clicks" fill="#0088FE" />
              )}
            </BarChart>
          </ResponsiveContainer>
        ))}

      {/* ===== TABLE ===== */}
      {showTable &&
        (loading ? (
          <div className="skeleton-table" />
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Campaign</th>
                  <th>Publisher</th>
                  {visibleMetrics.map((m) => (
                    <th key={m}>{METRIC_LABELS[m]}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredRows.slice(0, tableLimit).map((r, i) => (
                  <tr key={i}>
                    <td>{r.campaign}</td>
                    <td>{r.publisher}</td>
                    {visibleMetrics.map((m) => (
                      <td key={m}>
                        {m === "ctr"
                          ? `${(
                              (r.clicks / r.impressions) *
                                100 || 0
                            ).toFixed(2)}%`
                          : r[m]?.toLocaleString()}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            {tableLimit < filteredRows.length && (
              <button onClick={() => setTableLimit(tableLimit + 8)}>
                Load More
              </button>
            )}
          </div>
        ))}

      {/* ===== SKELETON CSS ===== */}
      <style>
        {`
          .skeleton-card,
          .skeleton-graph,
          .skeleton-table {
            background: linear-gradient(
              90deg,
              #e5e7eb 25%,
              #f3f4f6 37%,
              #e5e7eb 63%
            );
            background-size: 400% 100%;
            animation: shimmer 1.4s ease infinite;
            border-radius: 12px;
          }

          .skeleton-card {
            height: 120px;
          }

          .skeleton-graph {
            height: 380px;
            margin-top: 20px;
          }

          .skeleton-table {
            height: 260px;
            margin-top: 20px;
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

/* ================= CARD ================= */
const Card = ({ title, value }) => (
  <div className="metric-card">
    <div className="metric-title">{title}</div>
    <div className="metric-value">{value}</div>
  </div>
);

export default AdvertiserDashboard;
