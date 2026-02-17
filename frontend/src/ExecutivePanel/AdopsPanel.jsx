

// import React, { useState, useEffect } from "react";
// import * as XLSX from "xlsx";
// import axios from "axios";
// // import "./AdopsPanel.css"
// // ========================= MAIN PANEL ========================= //
// const AdopsPanel = () => {
//   const [activeSection, setActiveSection] = useState("Overview");

//   const renderSection = () => {
//     switch (activeSection) {
//       case "Overview":
//         return <UploadCenter />;
//       case "Upload History":
//         return <UploadHistory />;
//       case "Sheet Validator":
//         return <SheetValidator />;
//       case "Error Logs":
//         return <ErrorLogs />;
//       case "Mapping Assistant":
//         return <MappingAssistant />;
//       case "Approvals":
//         return <Approvals />;
//       default:
//         return <UploadCenter />;
//     }
//   };

//   return (
//     <div style={styles.wrapper}>
//       <Sidebar active={activeSection} setActive={setActiveSection} />
//       <div style={styles.contentArea}>{renderSection()}</div>
//     </div>
//   );
// };

// // ========================= SIDEBAR ========================= //
// const Sidebar = ({ active, setActive }) => {
//   const menu = [
//     "Overview",
//     "Upload History",
//     "Sheet Validator",
//     "Error Logs",
//     "Mapping Assistant",
//     "Approvals",
//   ];

//   return (
//     <div style={styles.sidebar}>
//       <h3 style={styles.sideTitle}>AdOps Executive Tools</h3>

//       {menu.map((item) => (
//         <button
//           key={item}
//           onClick={() => setActive(item)}
//           style={active === item ? styles.sideItemActive : styles.sideItem}
//         >
//           {item}
//         </button>
//       ))}
//     </div>
//   );
// };

// // ========================= 1️⃣ UPLOAD CENTER ========================= //
// // ========================= 1️⃣ UPLOAD CENTER ========================= //
// const UploadCenter = () => {
//   const [publisher, setPublisher] = useState("");
//   const [advertiser, setAdvertiser] = useState("");
//   const [uploadedBy, setUploadedBy] = useState("");
//   const [campaign, setCampaign] = useState("");
//   const [customCampaign, setCustomCampaign] = useState("");
//   const [uploading, setUploading] = useState(false);

//   const [publishers, setPublishers] = useState([]);
//   const [advertisers, setAdvertisers] = useState([]);
//   const [uploaders, setUploaders] = useState([]);

//   const campaigns = [
//     "Select Campaign",
//     "BigFest2025",
//     "SummerSale",
//     "Launch_X",
//     "BrandAwareness",
//     "Other",
//   ];

//   useEffect(() => {
//     const token = JSON.parse(localStorage.getItem("jwt"))?.token;
//     if (!token) return;

//     axios
//       .get("http://localhost:5000/api/publishers", {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then((res) => setPublishers(res.data));

//     axios
//       .get("http://localhost:5000/api/advertisers", {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then((res) => setAdvertisers(res.data));

//     axios
//       .get("http://localhost:5000/api/executives", {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then((res) => setUploaders(res.data));
//   }, []);

//   const handleFileUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     if (!publisher) return alert("Select publisher");
//     if (!advertiser) return alert("Select advertiser");
//     if (!uploadedBy) return alert("Select uploaded by");

//     const finalCampaign =
//       campaign === "Other" ? customCampaign.trim() : campaign;
//     if (!finalCampaign || finalCampaign === "Select Campaign")
//       return alert("Select campaign");

//     setUploading(true);

//     const reader = new FileReader();
//     reader.onload = async (event) => {
//       const workbook = XLSX.read(new Uint8Array(event.target.result), {
//         type: "array",
//       });

//       const parsedSheets = workbook.SheetNames.map((sheetName) => ({
//         name: sheetName.trim().toLowerCase().replace(/\s+/g, ""),
//         original: sheetName,
//         data: XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
//           defval: "",
//         }),
//       }));

//       const genealogySheets = parsedSheets.filter((s) =>
//         ["genealogy", "tree", "referral", "network", "lineage"].some((k) =>
//           s.name.includes(k)
//         )
//       );

//       const normalSheets = parsedSheets.filter(
//         (s) =>
//           !["genealogy", "tree", "referral", "network", "lineage"].some((k) =>
//             s.name.includes(k)
//           )
//       );

//       const token = JSON.parse(localStorage.getItem("jwt"))?.token;
//       const uploaderObj = uploaders.find((u) => u._id === uploadedBy);

//       const commonMeta = {
//         publisher_id: publisher._id,
//         publisher: publisher.name,
//         advertiser_id: advertiser._id,
//         advertiser: advertiser.name,
//         uploadedBy: uploadedBy,
//         uploadedByName: uploaderObj?.name,
//         campaign: finalCampaign,
//         uploadTime: new Date().toISOString(),
//       };

//       try {
//         if (normalSheets.length > 0) {
//           await axios.post(
//             "http://localhost:5000/api/upload",
//             { sheets: normalSheets, meta: commonMeta },
//             { headers: { Authorization: `Bearer ${token}` } }
//           );
//         }

//         if (genealogySheets.length > 0) {
//           await axios.post(
//             "http://localhost:5000/api/uploadGenealogy",
//             { sheets: genealogySheets, meta: commonMeta },
//             { headers: { Authorization: `Bearer ${token}` } }
//           );
//         }

//         alert("📤 Upload Successful!");
//       } catch (err) {
//         console.error("❌ Upload Error:", err);
//         alert(err?.response?.data?.message || "Upload failed");
//       } finally {
//         setUploading(false);
//       }
//     };

//     reader.readAsArrayBuffer(file);
//   };

//   return (
//     <div style={styles.panelCard}>
//       <h2 style={styles.title}>📊 AdOps Upload Center</h2>
//       <p style={styles.subtitle}>Attach metadata & upload your Excel report</p>

//       {/* FORM START */}
//       <div style={styles.grid}>

//         {/* Publisher */}
//         <div>
//           <label style={styles.label}>Publisher</label>
//           <select
//             style={styles.select}
//             value={publisher?._id || ""}
//             onChange={(e) =>
//               setPublisher(publishers.find((p) => p._id === e.target.value))
//             }
//           >
//             <option value="">Select Publisher</option>
//             {publishers.map((p) => (
//               <option key={p._id} value={p._id}>
//                 {p.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Advertiser */}
//         <div>
//           <label style={styles.label}>Advertiser</label>
//           <select
//             style={styles.select}
//             value={advertiser?._id || ""}
//             onChange={(e) =>
//               setAdvertiser(advertisers.find((a) => a._id === e.target.value))
//             }
//           >
//             <option value="">Select Advertiser</option>
//             {advertisers.map((a) => (
//               <option key={a._id} value={a._id}>
//                 {a.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Uploaded By */}
//         <div>
//           <label style={styles.label}>Uploaded By</label>
//           <select
//             style={styles.select}
//             value={uploadedBy}
//             onChange={(e) => setUploadedBy(e.target.value)}
//           >
//             <option value="">Select Uploader</option>
//             {uploaders.map((u) => (
//               <option key={u._id} value={u._id}>
//                 {u.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Campaign */}
//         <div>
//           <label style={styles.label}>Campaign</label>
//           <select
//             style={styles.select}
//             value={campaign}
//             onChange={(e) => setCampaign(e.target.value)}
//           >
//             {campaigns.map((c) => (
//               <option key={c}>{c}</option>
//             ))}
//           </select>
//         </div>

//         {/* Custom Campaign */}
//         {campaign === "Other" && (
//           <div>
//             <label style={styles.label}>Custom Campaign</label>
//             <input
//               type="text"
//               style={styles.input}
//               placeholder="Enter custom campaign"
//               value={customCampaign}
//               onChange={(e) => setCustomCampaign(e.target.value)}
//             />
//           </div>
//         )}

//         {/* File Upload (full width) */}
//         <div style={{ gridColumn: "1 / 3" }}>
//           <label style={styles.label}>Upload Excel File</label>
//           <input
//             type="file"
//             accept=".xlsx,.xls"
//             onChange={handleFileUpload}
//             style={styles.file}
//           />
//         </div>

//       </div>

//       <button style={styles.button} disabled={uploading}>
//         {uploading ? "Uploading..." : "🚀 Upload Report"}
//       </button>
//     </div>
//   );
// };


// // ========================= 2️⃣ UPLOAD HISTORY ========================= //
// const UploadHistory = () => {
//   const [history, setHistory] = useState([]);

//   useEffect(() => {
//     const token = JSON.parse(localStorage.getItem("jwt"))?.token;

//     axios
//       .get("http://localhost:5000/api/upload-history", {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then((res) => setHistory(res.data.logs || []));
//   }, []);

//   return (
//     <div style={styles.sectionBox}>
//       <h2 style={styles.title}>📚 Upload History</h2>
//       <p style={styles.subtitle}>Track all uploaded sheets.</p>

//       <ul style={{ marginTop: 15 }}>
//         {history.map((h) => (
//           <li key={h._id} style={{ marginBottom: 6 }}>
//             {h.fileName} — {h.uploadedByName} —{" "}
//             {new Date(h.time).toLocaleString()}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// // ========================= 3️⃣ SHEET VALIDATOR ========================= //
// const SheetValidator = () => (
//   <div style={styles.sectionBox}>
//     <h2 style={styles.title}>🧪 Sheet Validator</h2>
//     <p style={styles.subtitle}>Auto-detect missing columns & wrong formats.</p>
//   </div>
// );

// // ========================= 4️⃣ ERROR LOGS ========================= //
// const ErrorLogs = () => (
//   <div style={styles.sectionBox}>
//     <h2 style={styles.title}>⚠️ Error Logs</h2>
//     <p style={styles.subtitle}>View genealogy errors & rejected uploads.</p>
//   </div>
// );

// // ========================= 5️⃣ MAPPING ASSISTANT ========================= //
// const MappingAssistant = () => (
//   <div style={styles.sectionBox}>
//     <h2 style={styles.title}>🧩 Mapping Assistant</h2>
//     <p style={styles.subtitle}>Map Excel columns → database fields.</p>
//   </div>
// );

// // ========================= 6️⃣ APPROVALS ========================= //
// const Approvals = () => (
//   <div style={styles.sectionBox}>
//     <h2 style={styles.title}>✔ Approvals</h2>
//     <p style={styles.subtitle}>Approve or reject uploaded sheets.</p>
//   </div>
// );

// // ========================= STYLES ========================= //
// const styles = {
//   wrapper: {
//     display: "flex",
//     background: "#ecf1f9",
//     minHeight: "100vh",
//     // fontFamily: "'Inter', system-ui, sans-serif",
//   },
//   sidebar: {
//     width: "230px",
//     background: "#000",
//     padding: "25px 15px",
//     display: "flex",
//     flexDirection: "column",
//   },
//   sideTitle: {
//     color: "white",
//     fontSize: "18px",
//     fontWeight: "bold",
//     marginBottom: "25px",
//   },
//   sideItem: {
//     background: "transparent",
//     border: "none",
//     color: "#dcdcdc",
//     textAlign: "left",
//     padding: "10px 15px",
//     borderRadius: "8px",
//     cursor: "pointer",
//     marginBottom: "8px",
//   },
//   sideItemActive: {
//     background: "#1e5bff",
//     border: "none",
//     color: "white",
//     textAlign: "left",
//     padding: "10px 15px",
//     borderRadius: "8px",
//     cursor: "pointer",
//     marginBottom: "8px",
//   },
//   contentArea: {
//     flex: 1,
//     padding: "40px",
//     display: "flex",
//     justifyContent: "center",
//   },
//   panelCard: {
//     width: "650px",
//     background: "#ffffff",
//     padding: "30px 28px",
//     borderRadius: "16px",
//     boxShadow: "0 6px 25px rgba(0,0,0,0.08)",
//   },
//   title: {
//     fontSize: "22px",
//     fontWeight: "700",
//     textAlign: "center",
//     color: "#1D2B4E",
//   },
//   subtitle: {
//     fontSize: "14px",
//     textAlign: "center",
//     marginBottom: "25px",
//     color: "#5A6273",
//   },
//   sectionBox: {
//     width: "650px",
//     background: "#fff",
//     padding: "35px",
//     borderRadius: "16px",
//     boxShadow: "0 4px 18px rgba(0,0,0,0.08)",
//     textAlign: "center",
//   },
  
  

//  wrapper: {
//     display: "flex",
//     background: "#ecf1f9",
//     minHeight: "100vh",
//     // fontFamily: "'Inter', system-ui, sans-serif",
//   },
//   sidebar: {
//     width: "230px",
//     background: "#000",
//     padding: "25px 15px",
//     display: "flex",
//     flexDirection: "column",
//   },
//   sideTitle: {
//     color: "white",
//     fontSize: "18px",
//     fontWeight: "bold",
//     marginBottom: "25px",
//   },
//   sideItem: {
//     background: "transparent",
//     border: "none",
//     color: "#dcdcdc",
//     textAlign: "left",
//     padding: "10px 15px",
//     borderRadius: "8px",
//     cursor: "pointer",
//     marginBottom: "8px",
//   },
//   sideItemActive: {
//     background: "#1e5bff",
//     border: "none",
//     color: "white",
//     textAlign: "left",
//     padding: "10px 15px",
//     borderRadius: "8px",
//     cursor: "pointer",
//     marginBottom: "8px",
//   },
//   contentArea: {
//     flex: 1,
//     padding: "40px",
//     display: "flex",
//     justifyContent: "center",
//   },
//   panelCard: {
//     width: "650px",
//     background: "#ffffff",
//     padding: "30px 28px",
//     borderRadius: "16px",
//     boxShadow: "0 6px 25px rgba(0,0,0,0.08)",
//   },
//   title: {
//     fontSize: "22px",
//     fontWeight: "700",
//     textAlign: "center",
//     color: "#1D2B4E",
//   },
//   subtitle: {
//     fontSize: "14px",
//     textAlign: "center",
//     marginBottom: "25px",
//     color: "#5A6273",
//   },
//   sectionBox: {
//     width: "650px",
//     background: "#fff",
//     padding: "35px",
//     borderRadius: "16px",
//     boxShadow: "0 4px 18px rgba(0,0,0,0.08)",
//     textAlign: "center",
//   },
  
//   panelCard: {
//     width: "650px",
//     background: "#ffffff",
//     padding: "32px 30px",
//     borderRadius: "16px",
//     boxShadow: "0 8px 25px rgba(0,0,0,0.07)",
//     display: "flex",
//     flexDirection: "column",
//     gap: "20px",
//   },

//   title: {
//     fontSize: "22px",
//     fontWeight: "700",
//     textAlign: "center",
//     color: "#1D2B4E",
//     marginBottom: "4px",
//   },

//   subtitle: {
//     fontSize: "14px",
//     textAlign: "center",
//     color: "#667085",
//     marginBottom: "20px",
//   },

//   grid: {
//     display: "grid",
//     gridTemplateColumns: "1fr 1fr",
//     gap: "20px",
//   },

//   label: {
//     fontSize: "13px",
//     fontWeight: "600",
//     color: "#344054",
//     marginBottom: "6px",
//     display: "block",
//   },

//   select: {
//     width: "100%",
//     padding: "10px 12px",
//     borderRadius: "8px",
//     border: "1px solid #d0d5dd",
//     background: "#fafbfc",
//     fontSize: "14px",
//     outline: "none",
//     transition: "0.2s",
//   },

//   input: {
//     width: "100%",
//     padding: "10px 12px",
//     borderRadius: "8px",
//     border: "1px solid #b1c7f1ff",
//     background: "#fafbfc",
//     fontSize: "14px",
//   },

//   file: {
//     width: "100%",
//     padding: "10px 0px",
//     fontSize: "14px",
//   },

//   button: {
//     padding: "12px",
//     background: "#1e5bff",
//     color: "#fff",
//     fontWeight: 600,
//     borderRadius: "8px",
//     border: "none",
//     cursor: "pointer",
//     fontSize: "15px",
//     marginTop: "8px",
//     transition: "0.25s",
//   },

// };

// export default AdopsPanel;




 
// import React, { useState, useEffect } from "react";
// import * as XLSX from "xlsx";
// import axios from "axios";
// import Navbar from "./AdopsNavbar";

// // ========================= MAIN PANEL ========================= //
// const AdopsPanel = () => {
//   const [activeSection, setActiveSection] = useState("Overview");

//   const renderSection = () => {
//     switch (activeSection) {
//       case "Overview":
//         return <UploadCenter />;
//       case "Upload History":
//         return <UploadHistory />;
//       case "Sheet Validator":
//         return <SheetValidator />;
//       case "Error Logs":
//         return <ErrorLogs />;
//       case "Mapping Assistant":
//         return <MappingAssistant />;
//       case "Approvals":
//         return <Approvals />;
//       default:
//         return <UploadCenter />;
//     }
//   };

//   return (
//     <div style={styles.page}>
//       <Navbar active={activeSection} setActive={setActiveSection} />
//       <div style={styles.content}>{renderSection()}</div>
//     </div>
//   );
// };

// // ========================= UPLOAD CENTER ========================= //
// const UploadCenter = () => {
//   const [publisher, setPublisher] = useState("");
//   const [advertiser, setAdvertiser] = useState("");
//   const [uploadedBy, setUploadedBy] = useState("");
//   const [campaign, setCampaign] = useState("");
//   const [customCampaign, setCustomCampaign] = useState("");
//   const [uploading, setUploading] = useState(false);

//   const [publishers, setPublishers] = useState([]);
//   const [advertisers, setAdvertisers] = useState([]);
//   const [uploaders, setUploaders] = useState([]);

//   const campaigns = [
//     "Select Campaign",
//     "BigFest2025",
//     "SummerSale",
//     "Launch_X",
//     "BrandAwareness",
//     "Other",
//   ];

//   useEffect(() => {
//     const token = JSON.parse(localStorage.getItem("jwt"))?.token;
//     if (!token) return;

//     axios.get("https://imediareports.onrender.com/api/publishers", {
//       headers: { Authorization: `Bearer ${token}` },
//     }).then((res) => setPublishers(res.data));

//     axios.get("https://imediareports.onrender.com/api/advertisers", {
//       headers: { Authorization: `Bearer ${token}` },
//     }).then((res) => setAdvertisers(res.data));

//     axios.get("https://imediareports.onrender.com/api/executives", {
//       headers: { Authorization: `Bearer ${token}` },
//     }).then((res) => setUploaders(res.data));
//   }, []);

//   const handleFileUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     if (!publisher || !advertiser || !uploadedBy)
//       return alert("Please fill all required fields");

//     const finalCampaign =
//       campaign === "Other" ? customCampaign.trim() : campaign;

//     if (!finalCampaign || finalCampaign === "Select Campaign")
//       return alert("Select campaign");

//     setUploading(true);

//     const reader = new FileReader();
//     reader.onload = async (event) => {
//       const workbook = XLSX.read(event.target.result, { type: "array" });

//       const parsedSheets = workbook.SheetNames.map((name) => ({
//         name: name.trim().toLowerCase(),
//         original: name,
//         data: XLSX.utils.sheet_to_json(workbook.Sheets[name], { defval: "" }),
//       }));

//       // ✅ ONLY NEW LOGIC (SPLIT SHEETS)
//       const genealogySheets = parsedSheets.filter((s) =>
//         ["genealogy", "tree", "referral", "network", "lineage"].some((k) =>
//           s.name.includes(k)
//         )
//       );

//       const normalSheets = parsedSheets.filter(
//         (s) =>
//           !["genealogy", "tree", "referral", "network", "lineage"].some((k) =>
//             s.name.includes(k)
//           )
//       );

//       const token = JSON.parse(localStorage.getItem("jwt"))?.token;
//       const uploaderObj = uploaders.find((u) => u._id === uploadedBy);

//       const meta = {
//         publisher_id: publisher._id,
//         publisher: publisher.name,
//         advertiser_id: advertiser._id,
//         advertiser: advertiser.name,
//         uploadedBy,
//         uploadedByName: uploaderObj?.name,
//         campaign: finalCampaign,
//         uploadTime: new Date().toISOString(),
//       };

//       try {
//         // ✅ NORMAL SHEETS
//         if (normalSheets.length > 0) {
//           await axios.post(
//             "https://imediareports.onrender.com/api/upload",
//             { sheets: normalSheets, meta },
//             { headers: { Authorization: `Bearer ${token}` } }
//           );
//         }

//         // ✅ GENEALOGY SHEETS (THIS WAS MISSING)
//         if (genealogySheets.length > 0) {
//           await axios.post(
//             "https://imediareports.onrender.com/api/uploadGenealogy",
//             { sheets: genealogySheets, meta },
//             { headers: { Authorization: `Bearer ${token}` } }
//           );
//         }

//         alert("📤 Upload Successful!");
//       } catch (err) {
//         console.error(err);
//         alert("Upload failed");
//       } finally {
//         setUploading(false);
//       }
//     };

//     reader.readAsArrayBuffer(file);
//   };

//   return (
//     <div style={styles.card}>
//       <h2 style={styles.title}>📊 AdOps Upload Center</h2>
//       <div style={styles.grid}>
//         <select
//           style={styles.input}
//           onChange={(e) =>
//             setPublisher(publishers.find((p) => p._id === e.target.value))
//           }
//         >
//           <option value="">Select Publisher</option>
//           {publishers.map((p) => (
//             <option key={p._id} value={p._id}>
//               {p.name}
//             </option>
//           ))}
//         </select>

//         <select
//           style={styles.input}
//           onChange={(e) =>
//             setAdvertiser(advertisers.find((a) => a._id === e.target.value))
//           }
//         >
//           <option value="">Select Advertiser</option>
//           {advertisers.map((a) => (
//             <option key={a._id} value={a._id}>
//               {a.name}
//             </option>
//           ))}
//         </select>

//         <select
//           style={styles.input}
//           onChange={(e) => setUploadedBy(e.target.value)}
//         >
//           <option value="">Uploaded By</option>
//           {uploaders.map((u) => (
//             <option key={u._id} value={u._id}>
//               {u.name}
//             </option>
//           ))}
//         </select>

//         <select
//           style={styles.input}
//           value={campaign}
//           onChange={(e) => setCampaign(e.target.value)}
//         >
//           {campaigns.map((c) => (
//             <option key={c}>{c}</option>
//           ))}
//         </select>

//         {campaign === "Other" && (
//           <input
//             style={styles.input}
//             placeholder="Custom Campaign"
//             onChange={(e) => setCustomCampaign(e.target.value)}
//           />
//         )}

//         <input type="file" onChange={handleFileUpload} />
//       </div>

//       <button style={styles.button} disabled={uploading}>
//         {uploading ? "Uploading..." : "🚀 Upload"}
//       </button>
//     </div>
//   );
// };

// // ========================= OTHER SECTIONS ========================= //
// const UploadHistory = () => <Section title="📚 Upload History" />;
// const SheetValidator = () => <Section title="🧪 Sheet Validator" />;
// const ErrorLogs = () => <Section title="⚠️ Error Logs" />;
// const MappingAssistant = () => <Section title="🧩 Mapping Assistant" />;
// const Approvals = () => <Section title="✔ Approvals" />;

// const Section = ({ title }) => (
//   <div style={styles.card}>
//     <h2 style={styles.title}>{title}</h2>
//     <p>Content coming soon...</p>
//   </div>
// );

// // ========================= STYLES ========================= //
// const styles = {
//   page: { background: "#EEF2FF", minHeight: "100vh" },
//   content: { padding: "40px", display: "flex", justifyContent: "center" },
//   card: {
//     background: "#fff",
//     width: 650,
//     padding: 30,
//     borderRadius: 16,
//     boxShadow: "0 6px 25px rgba(0,0,0,0.08)",
//   },
//   title: { textAlign: "center", marginBottom: 20 },
//   grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15 },
//   input: {
//     padding: 10,
//     borderRadius: 8,
//     border: "1px solid #d0d5dd",
//   },
//   button: {
//     marginTop: 20,
//     padding: 12,
//     borderRadius: 8,
//     border: "none",
//     background: "#6D28D9",
//     color: "#fff",
//     fontWeight: 700,
//     cursor: "pointer",
//   },
// };

// export default AdopsPanel;

// import React, { useEffect, useState } from "react";
// import * as XLSX from "xlsx";
// import axios from "axios";
// import Navbar from "./AdopsNavbar";

// /* ========================= MAIN PANEL ========================= */
// const AdopsPanel = () => {
//   const [activeSection, setActiveSection] = useState("Overview");

//   const renderSection = () => {
//     switch (activeSection) {
//       case "Overview":
//         return <UploadCenter />;
//       case "Upload History":
//         return <Section title="📚 Upload History" />;
//       case "Sheet Validator":
//         return <Section title="🧪 Sheet Validator" />;
//       case "Error Logs":
//         return <Section title="⚠️ Error Logs" />;
//       case "Mapping Assistant":
//         return <Section title="🧩 Mapping Assistant" />;
//       case "Approvals":
//         return <Section title="✔ Approvals" />;
//       default:
//         return <UploadCenter />;
//     }
//   };

//   return (
//     <div style={styles.page}>
//       <Navbar active={activeSection} setActive={setActiveSection} />
//       <div style={styles.content}>{renderSection()}</div>
//     </div>
//   );
// };

// /* ========================= UPLOAD CENTER ========================= */
// const UploadCenter = () => {
//   const [publisher, setPublisher] = useState("");
//   const [advertiser, setAdvertiser] = useState("");
//   const [uploadedBy, setUploadedBy] = useState("");
//   const [campaign, setCampaign] = useState("");
//   const [customCampaign, setCustomCampaign] = useState("");
//   const [uploading, setUploading] = useState(false);
//   const [loading, setLoading] = useState(true);

//   const [publishers, setPublishers] = useState([]);
//   const [advertisers, setAdvertisers] = useState([]);
//   const [uploaders, setUploaders] = useState([]);

//   const campaigns = [
//     "Select Campaign",
//     "BigFest2025",
//     "SummerSale",
//     "Launch_X",
//     "BrandAwareness",
//     "Other",
//   ];

//   useEffect(() => {
//     const token = JSON.parse(localStorage.getItem("jwt"))?.token;
//     if (!token) return;

//     Promise.all([
//       axios.get("https://imediareports.onrender.com/api/publishers", {
//         headers: { Authorization: `Bearer ${token}` },
//       }),
//       axios.get("https://imediareports.onrender.com/api/advertisers", {
//         headers: { Authorization: `Bearer ${token}` },
//       }),
//       axios.get("https://imediareports.onrender.com/api/executives", {
//         headers: { Authorization: `Bearer ${token}` },
//       }),
//     ])
//       .then(([p, a, u]) => {
//         setPublishers(p.data);
//         setAdvertisers(a.data);
//         setUploaders(u.data);
//       })
//       .finally(() => setLoading(false));
//   }, []);

//   const handleFileUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     if (!publisher || !advertiser || !uploadedBy)
//       return alert("Please fill all required fields");

//     const finalCampaign =
//       campaign === "Other" ? customCampaign.trim() : campaign;

//     if (!finalCampaign || finalCampaign === "Select Campaign")
//       return alert("Select campaign");

//     setUploading(true);

//     const reader = new FileReader();
//     reader.onload = async (event) => {
//       const workbook = XLSX.read(event.target.result, { type: "array" });

//       const parsedSheets = workbook.SheetNames.map((name) => ({
//         name: name.trim().toLowerCase(),
//         original: name,
//         data: XLSX.utils.sheet_to_json(workbook.Sheets[name], { defval: "" }),
//       }));

//       const genealogySheets = parsedSheets.filter((s) =>
//         ["genealogy", "tree", "referral", "network", "lineage"].some((k) =>
//           s.name.includes(k)
//         )
//       );

//       const normalSheets = parsedSheets.filter(
//         (s) =>
//           !["genealogy", "tree", "referral", "network", "lineage"].some((k) =>
//             s.name.includes(k)
//           )
//       );

//       const token = JSON.parse(localStorage.getItem("jwt"))?.token;
//       const uploaderObj = uploaders.find((u) => u._id === uploadedBy);

//       const meta = {
//         publisher_id: publisher._id,
//         publisher: publisher.name,
//         advertiser_id: advertiser._id,
//         advertiser: advertiser.name,
//         uploadedBy,
//         uploadedByName: uploaderObj?.name,
//         campaign: finalCampaign,
//         uploadTime: new Date().toISOString(),
//       };

//       try {
//         if (normalSheets.length > 0) {
//           await axios.post(
//             "https://imediareports.onrender.com/api/upload",
//             { sheets: normalSheets, meta },
//             { headers: { Authorization: `Bearer ${token}` } }
//           );
//         }

//         if (genealogySheets.length > 0) {
//           await axios.post(
//             "https://imediareports.onrender.com/api/uploadGenealogy",
//             { sheets: genealogySheets, meta },
//             { headers: { Authorization: `Bearer ${token}` } }
//           );
//         }

//         alert("📤 Upload Successful!");
//       } catch (err) {
//         alert("Upload failed");
//       } finally {
//         setUploading(false);
//       }
//     };

//     reader.readAsArrayBuffer(file);
//   };

//   if (loading) return <SkeletonCard />;

//   return (
//     <div style={styles.card}>
//       <h2 style={styles.title}>📊 AdOps Upload Center</h2>

//       <div style={styles.grid}>
//         <select style={styles.input} onChange={(e) =>
//           setPublisher(publishers.find((p) => p._id === e.target.value))
//         }>
//           <option value="">Select Publisher</option>
//           {publishers.map((p) => (
//             <option key={p._id} value={p._id}>{p.name}</option>
//           ))}
//         </select>

//         <select style={styles.input} onChange={(e) =>
//           setAdvertiser(advertisers.find((a) => a._id === e.target.value))
//         }>
//           <option value="">Select Advertiser</option>
//           {advertisers.map((a) => (
//             <option key={a._id} value={a._id}>{a.name}</option>
//           ))}
//         </select>

//         <select style={styles.input} onChange={(e) => setUploadedBy(e.target.value)}>
//           <option value="">Uploaded By</option>
//           {uploaders.map((u) => (
//             <option key={u._id} value={u._id}>{u.name}</option>
//           ))}
//         </select>

//         <select style={styles.input} value={campaign} onChange={(e) => setCampaign(e.target.value)}>
//           {campaigns.map((c) => <option key={c}>{c}</option>)}
//         </select>

//         {campaign === "Other" && (
//           <input
//             style={styles.input}
//             placeholder="Custom Campaign"
//             onChange={(e) => setCustomCampaign(e.target.value)}
//           />
//         )}

//         <input type="file" onChange={handleFileUpload} />
//       </div>

//       <button style={styles.button} disabled={uploading}>
//         {uploading ? "Uploading..." : "🚀 Upload"}
//       </button>
//     </div>
//   );
// };

// /* ========================= SKELETON ========================= */
// const SkeletonCard = () => (
//   <div style={{ ...styles.card, background: "#f3f4f6" }}>
//     <div className="skeleton" />
//     <style>
//       {`
//         .skeleton {
//           height: 260px;
//           border-radius: 14px;
//           background: linear-gradient(
//             90deg,
//             #e5e7eb 25%,
//             #f3f4f6 37%,
//             #e5e7eb 63%
//           );
//           background-size: 400% 100%;
//           animation: shimmer 1.4s infinite;
//         }
//         @keyframes shimmer {
//           0% { background-position: 100% 0 }
//           100% { background-position: -100% 0 }
//         }
//       `}
//     </style>
//   </div>
// );

// /* ========================= SECTION ========================= */
// const Section = ({ title }) => (
//   <div style={styles.card}>
//     <h2 style={styles.title}>{title}</h2>
//     <p style={{ fontSize: "18px" }}>Content coming soon...</p>
//   </div>
// );

// /* ========================= STYLES ========================= */
// const styles = {
//   page: { background: "#EEF2FF", minHeight: "100vh" },
//   content: { padding: "50px", display: "flex", justifyContent: "center" },
//   card: {
//     background: "#fff",
//     width: 720,
//     padding: 36,
//     borderRadius: 18,
//     boxShadow: "0 8px 28px rgba(0,0,0,0.1)",
//   },
//   title: {
//     textAlign: "center",
//     marginBottom: 24,
//     fontSize: "34px",
//     fontWeight: 800,
//   },
//   grid: {
//     display: "grid",
//     gridTemplateColumns: "1fr 1fr",
//     gap: 18,
//   },
//   input: {
//     padding: 14,
//     fontSize: "18px",
//     borderRadius: 10,
//     border: "1px solid #d0d5dd",
//   },
//   button: {
//     marginTop: 28,
//     padding: 16,
//     fontSize: "20px",
//     borderRadius: 10,
//     border: "none",
//     background: "#6D28D9",
//     color: "#fff",
//     fontWeight: 800,
//     cursor: "pointer",
//   },
// };

// export default AdopsPanel;

// import React, { useEffect, useState } from "react";
// import * as XLSX from "xlsx";
// import axios from "axios";

// /* ========================= MAIN PANEL ========================= */

// const AdopsPanel = () => {
//   const [activeSection, setActiveSection] = useState("Overview");
//   const [showProfileModal, setShowProfileModal] = useState(false);

//   const [user, setUser] = useState({
//     name: "",
//     email: "",
//   });

//   /* 🔐 FETCH USER FROM JWT */
//   useEffect(() => {
//     const jwt = JSON.parse(localStorage.getItem("jwt"));
//     const loggedUser = jwt?.user;

//     if (loggedUser) {
//       setUser({
//         name: loggedUser.name || "AdOps User",
//         email: loggedUser.email || "Not Available",
//       });
//     }
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("jwt");
//     window.location.href = "/login";
//   };

//   const sections = [
//     "Overview",
//     "Upload History",
//     "Sheet Validator",
  
//     "Approvals",
//   ];

//   const renderSection = () => {
//     switch (activeSection) {
//       case "Overview":
//         return <UploadCenter />;
//       default:
//         return <Section title={activeSection} />;
//     }
//   };

//   return (
//     <div style={styles.page}>
//       {/* 🔥 TOP NAVBAR */}
//       <div style={styles.topBar}>
//         <h2 style={styles.logo}>Ad-Operations Panel</h2>

//         <div style={styles.rightSection}>
//           <div style={styles.navLinks}>
//             {sections.map((sec) => (
//               <span
//                 key={sec}
//                 onClick={() => setActiveSection(sec)}
//                 style={{
//                   ...styles.navLink,
//                   ...(activeSection === sec && styles.activeNavLink),
//                 }}
//               >
//                 {sec}
//               </span>
//             ))}
//           </div>

//           <div
//             style={styles.profileCircle}
//             onClick={() => setShowProfileModal(true)}
//           >
//             {user.name?.charAt(0)?.toUpperCase() || "A"}
//           </div>
//         </div>
//       </div>

//       <div style={styles.content}>{renderSection()}</div>

//       {/* 🔐 PROFILE MODAL */}
//       {showProfileModal && (
//         <div
//           style={styles.modalOverlay}
//           onClick={() => setShowProfileModal(false)}
//         >
//           <div
//             style={styles.modal}
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div style={styles.modalAvatar}>
//               {user.name?.charAt(0)?.toUpperCase() || "A"}
//             </div>

//             <h3 style={{ marginBottom: 8 }}>{user.name}</h3>
//             <p style={{ color: "#666", marginBottom: 20 }}>
//               {user.email}
//             </p>

//             <button
//               style={styles.logoutBtn}
//               onClick={handleLogout}
//             >
//               Logout
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// /* ========================= UPLOAD CENTER ========================= */

// const UploadCenter = () => {
//   const [publisher, setPublisher] = useState("");
//   const [advertiser, setAdvertiser] = useState("");
//   const [uploadedBy, setUploadedBy] = useState("");
//   const [campaign, setCampaign] = useState("");
//   const [customCampaign, setCustomCampaign] = useState("");
//   const [uploading, setUploading] = useState(false);
//   const [loading, setLoading] = useState(true);

//   const [publishers, setPublishers] = useState([]);
//   const [advertisers, setAdvertisers] = useState([]);
//   const [uploaders, setUploaders] = useState([]);

//   const campaigns = [
//     "Select Campaign",
//     "BigFest2025",
//     "SummerSale",
//     "Launch_X",
//     "BrandAwareness",
//     "Other",
//   ];

//   /* 🔥 FETCH DROPDOWN DATA */
//   useEffect(() => {
//     const token = JSON.parse(localStorage.getItem("jwt"))?.token;
//     if (!token) return;

//     Promise.all([
//       axios.get("https://imediareports.onrender.com/api/publishers", {
//         headers: { Authorization: `Bearer ${token}` },
//       }),
//       axios.get("https://imediareports.onrender.com/api/advertisers", {
//         headers: { Authorization: `Bearer ${token}` },
//       }),
//       axios.get("https://imediareports.onrender.com/api/executives", {
//         headers: { Authorization: `Bearer ${token}` },
//       }),
//     ])
//       .then(([p, a, u]) => {
//         setPublishers(p.data);
//         setAdvertisers(a.data);
//         setUploaders(u.data);
//       })
//       .finally(() => setLoading(false));
//   }, []);

//   /* 📤 FILE UPLOAD */
//   const handleFileUpload = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     if (!publisher || !advertiser || !uploadedBy)
//       return alert("Please fill all required fields");

//     const finalCampaign =
//       campaign === "Other" ? customCampaign.trim() : campaign;

//     if (!finalCampaign || finalCampaign === "Select Campaign")
//       return alert("Select campaign");

//     setUploading(true);

//     const reader = new FileReader();

//     reader.onload = async (event) => {
//       const workbook = XLSX.read(event.target.result, { type: "array" });

//       const parsedSheets = workbook.SheetNames.map((name) => ({
//         name: name.trim().toLowerCase(),
//         original: name,
//         data: XLSX.utils.sheet_to_json(workbook.Sheets[name], {
//           defval: "",
//         }),
//       }));

//       const genealogySheets = parsedSheets.filter((s) =>
//         ["genealogy", "tree", "referral", "network", "lineage"].some((k) =>
//           s.name.includes(k)
//         )
//       );

//       const normalSheets = parsedSheets.filter(
//         (s) =>
//           !["genealogy", "tree", "referral", "network", "lineage"].some((k) =>
//             s.name.includes(k)
//           )
//       );

//       const token = JSON.parse(localStorage.getItem("jwt"))?.token;
//       const uploaderObj = uploaders.find((u) => u._id === uploadedBy);

//       const meta = {
//         publisher_id: publisher._id,
//         publisher: publisher.name,
//         advertiser_id: advertiser._id,
//         advertiser: advertiser.name,
//         uploadedBy,
//         uploadedByName: uploaderObj?.name,
//         campaign: finalCampaign,
//         uploadTime: new Date().toISOString(),
//       };

//       try {
//         if (normalSheets.length > 0) {
//           await axios.post(
//             "https://imediareports.onrender.com/api/upload",
//             { sheets: normalSheets, meta },
//             { headers: { Authorization: `Bearer ${token}` } }
//           );
//         }

//         if (genealogySheets.length > 0) {
//           await axios.post(
//             "https://imediareports.onrender.com/api/uploadGenealogy",
//             { sheets: genealogySheets, meta },
//             { headers: { Authorization: `Bearer ${token}` } }
//           );
//         }

//         alert("📤 Upload Successful!");
//       } catch (err) {
//         alert("Upload failed");
//       } finally {
//         setUploading(false);
//       }
//     };

//     reader.readAsArrayBuffer(file);
//   };

//   if (loading)
//     return (
//       <div style={styles.card}>
//         <p>Loading dropdown data...</p>
//       </div>
//     );

//   return (
//     <div style={styles.card}>
//       <h2 style={styles.title}>📊 AdOps Upload Center</h2>

//       <div style={styles.grid}>
//         <select
//           style={styles.input}
//           onChange={(e) =>
//             setPublisher(
//               publishers.find((p) => p._id === e.target.value)
//             )
//           }
//         >
//           <option value="">Select Publisher</option>
//           {publishers.map((p) => (
//             <option key={p._id} value={p._id}>
//               {p.name}
//             </option>
//           ))}
//         </select>

//         <select
//           style={styles.input}
//           onChange={(e) =>
//             setAdvertiser(
//               advertisers.find((a) => a._id === e.target.value)
//             )
//           }
//         >
//           <option value="">Select Advertiser</option>
//           {advertisers.map((a) => (
//             <option key={a._id} value={a._id}>
//               {a.name}
//             </option>
//           ))}
//         </select>

//         <select
//           style={styles.input}
//           onChange={(e) => setUploadedBy(e.target.value)}
//         >
//           <option value="">Uploaded By</option>
//           {uploaders.map((u) => (
//             <option key={u._id} value={u._id}>
//               {u.name}
//             </option>
//           ))}
//         </select>

//         <select
//           style={styles.input}
//           value={campaign}
//           onChange={(e) => setCampaign(e.target.value)}
//         >
//           {campaigns.map((c) => (
//             <option key={c}>{c}</option>
//           ))}
//         </select>

//         {campaign === "Other" && (
//           <input
//             style={styles.input}
//             placeholder="Custom Campaign"
//             onChange={(e) =>
//               setCustomCampaign(e.target.value)
//             }
//           />
//         )}

//         <input type="file" onChange={handleFileUpload} />
//       </div>

//       <button
//         style={styles.uploadBtn}
//         disabled={uploading}
//       >
//         {uploading ? "Uploading..." : "🚀 Upload"}
//       </button>
//     </div>
//   );
// };

// /* ========================= GENERIC SECTION ========================= */

// const Section = ({ title }) => (
//   <div style={styles.card}>
//     <h2 style={styles.title}>{title}</h2>
//     <p>Content coming soon...</p>
//   </div>
// );

// /* ========================= STYLES ========================= */

// const styles = {
//   page: { background: "#EEF2FF", minHeight: "100vh" },

//   topBar: {
//     height: "64px",
//     background: "#6D28D9",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     padding: "0 30px",
//     color: "#fff",
//   },

//   logo: { fontSize: "22px", fontWeight: "bold" },

//   rightSection: {
//     display: "flex",
//     alignItems: "center",
//     gap: "30px",
//   },

//   navLinks: { display: "flex", gap: "20px" },

//   navLink: {
//     cursor: "pointer",
//     fontSize: "16px",
//     color: "#fff",
//   },

//   activeNavLink: {
//     color: "#DFFA33",
//     fontWeight: 700,
//   },

//   profileCircle: {
//     width: "40px",
//     height: "40px",
//     borderRadius: "50%",
//     background: "#fff",
//     color: "#6D28D9",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     fontWeight: "bold",
//     cursor: "pointer",
//   },

//   content: {
//     padding: "50px",
//     display: "flex",
//     justifyContent: "center",
//   },

//   card: {
//     background: "#fff",
//     width: 720,
//     padding: 36,
//     borderRadius: 18,
//     boxShadow: "0 8px 28px rgba(0,0,0,0.1)",
//   },

//   title: {
//     textAlign: "center",
//     marginBottom: 24,
//     fontSize: "34px",
//     fontWeight: 800,
//   },

//   grid: {
//     display: "grid",
//     gridTemplateColumns: "1fr 1fr",
//     gap: 18,
//   },

//   input: {
//     padding: 12,
//     borderRadius: 8,
//     border: "1px solid #d0d5dd",
//   },

//   uploadBtn: {
//     marginTop: 20,
//     padding: 14,
//     background: "#6D28D9",
//     color: "#fff",
//     border: "none",
//     borderRadius: 8,
//     cursor: "pointer",
//     fontWeight: 600,
//   },

//   modalOverlay: {
//     position: "fixed",
//     top: 0,
//     left: 0,
//     width: "100%",
//     height: "100%",
//     background: "rgba(0,0,0,0.4)",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     zIndex: 999,
//   },

//   modal: {
//     width: "360px",
//     background: "#fff",
//     borderRadius: "16px",
//     padding: "30px",
//     textAlign: "center",
//   },

//   modalAvatar: {
//     width: "80px",
//     height: "80px",
//     borderRadius: "50%",
//     background: "#6D28D9",
//     color: "#fff",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     margin: "0 auto 15px",
//     fontSize: "28px",
//     fontWeight: "bold",
//   },

//   logoutBtn: {
//     background: "#ef4444",
//     color: "#fff",
//     border: "none",
//     padding: "12px 20px",
//     borderRadius: "8px",
//     cursor: "pointer",
//     fontWeight: 600,
//   },
// };

// export default AdopsPanel;
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";

/* ========================= MAIN PANEL ========================= */

const AdopsPanel = () => {
  const [activeSection, setActiveSection] = useState("Overview");
  const [showProfileModal, setShowProfileModal] = useState(false);

  const [user, setUser] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    const jwt = JSON.parse(localStorage.getItem("jwt"));
    const loggedUser = jwt?.user;

    if (loggedUser) {
      setUser({
        name: loggedUser.name || "AdOps User",
        email: loggedUser.email || "Not Available",
      });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    window.location.href = "/login";
  };

  const sections = [
    "Overview",
    "Upload History",
    "Sheet Validator",
    "Approvals",
  ];

  const renderSection = () => {
    switch (activeSection) {
      case "Overview":
        return <UploadCenter />;
      default:
        return <Section title={activeSection} />;
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.topBar}>
        <h2 style={styles.logo}>Ad-Operations Panel</h2>

        <div style={styles.rightSection}>
          <div style={styles.navLinks}>
            {sections.map((sec) => (
              <span
                key={sec}
                onClick={() => setActiveSection(sec)}
                style={{
                  ...styles.navLink,
                  ...(activeSection === sec && styles.activeNavLink),
                }}
              >
                {sec}
              </span>
            ))}
          </div>

          <div
            style={styles.profileCircle}
            onClick={() => setShowProfileModal(true)}
          >
            {user.name?.charAt(0)?.toUpperCase() || "A"}
          </div>
        </div>
      </div>

      <div style={styles.content}>{renderSection()}</div>

      {showProfileModal && (
        <div
          style={styles.modalOverlay}
          onClick={() => setShowProfileModal(false)}
        >
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalAvatar}>
              {user.name?.charAt(0)?.toUpperCase() || "A"}
            </div>

            <h3 style={{ marginBottom: 8 }}>{user.name}</h3>
            <p style={{ color: "#666", marginBottom: 20 }}>{user.email}</p>

            <button style={styles.logoutBtn} onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ========================= UPLOAD CENTER ========================= */

const UploadCenter = () => {
  const [publisher, setPublisher] = useState("");
  const [advertiser, setAdvertiser] = useState("");
  const [uploadedBy, setUploadedBy] = useState("");
  const [campaign, setCampaign] = useState("");
  const [customCampaign, setCustomCampaign] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const [publishers, setPublishers] = useState([]);
  const [advertisers, setAdvertisers] = useState([]);
  const [uploaders, setUploaders] = useState([]);

  const campaigns = [
    "Select Campaign",
    "BigFest2025",
    "SummerSale",
    "Launch_X",
    "BrandAwareness",
    "Other",
  ];

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("jwt"))?.token;
    if (!token) return;

    Promise.all([
      axios.get("https://imediareports.onrender.com/api/publishers", {
        headers: { Authorization: `Bearer ${token}` },
      }),
      axios.get("https://imediareports.onrender.com/api/advertisers", {
        headers: { Authorization: `Bearer ${token}` },
      }),
      axios.get("https://imediareports.onrender.com/api/executives", {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ])
      .then(([p, a, u]) => {
        setPublishers(p.data);
        setAdvertisers(a.data);
        setUploaders(u.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const processFile = (file) => {
    if (!file) return;
    setSelectedFile(file);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return alert("Please select a file");

    if (!publisher || !advertiser || !uploadedBy)
      return alert("Please fill all required fields");

    const finalCampaign =
      campaign === "Other" ? customCampaign.trim() : campaign;

    if (!finalCampaign || finalCampaign === "Select Campaign")
      return alert("Select campaign");

    setUploading(true);

    const reader = new FileReader();

    reader.onload = async (event) => {
      const workbook = XLSX.read(event.target.result, { type: "array" });

      const parsedSheets = workbook.SheetNames.map((name) => ({
        name: name.trim().toLowerCase(),
        original: name,
        data: XLSX.utils.sheet_to_json(workbook.Sheets[name], {
          defval: "",
        }),
      }));

      const genealogySheets = parsedSheets.filter((s) =>
        ["genealogy", "tree", "referral", "network", "lineage"].some((k) =>
          s.name.includes(k)
        )
      );

      const normalSheets = parsedSheets.filter(
        (s) =>
          !["genealogy", "tree", "referral", "network", "lineage"].some((k) =>
            s.name.includes(k)
          )
      );

      const token = JSON.parse(localStorage.getItem("jwt"))?.token;
      const uploaderObj = uploaders.find((u) => u._id === uploadedBy);

      const meta = {
        publisher_id: publisher._id,
        publisher: publisher.name,
        advertiser_id: advertiser._id,
        advertiser: advertiser.name,
        uploadedBy,
        uploadedByName: uploaderObj?.name,
        campaign: finalCampaign,
        uploadTime: new Date().toISOString(),
      };

      try {
        if (normalSheets.length > 0) {
          await axios.post(
            "https://imediareports.onrender.com/api/upload",
            { sheets: normalSheets, meta },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }

        if (genealogySheets.length > 0) {
          await axios.post(
            "https://imediareports.onrender.com/api/uploadGenealogy",
            { sheets: genealogySheets, meta },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }

        alert("Upload Successful!");
        setSelectedFile(null);
      } catch (err) {
        alert("Upload failed");
      } finally {
        setUploading(false);
      }
    };

    reader.readAsArrayBuffer(selectedFile);
  };

  if (loading)
    return (
      <div style={styles.card}>
        <p>Loading dropdown data...</p>
      </div>
    );

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>AdOps Upload Center</h2>

      <div style={styles.grid}>
        <select
          style={styles.input}
          onChange={(e) =>
            setPublisher(publishers.find((p) => p._id === e.target.value))
          }
        >
          <option value="">Select Publisher</option>
          {publishers.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </select>

        <select
          style={styles.input}
          onChange={(e) =>
            setAdvertiser(advertisers.find((a) => a._id === e.target.value))
          }
        >
          <option value="">Select Advertiser</option>
          {advertisers.map((a) => (
            <option key={a._id} value={a._id}>
              {a.name}
            </option>
          ))}
        </select>

        <select
          style={styles.input}
          onChange={(e) => setUploadedBy(e.target.value)}
        >
          <option value="">Uploaded By</option>
          {uploaders.map((u) => (
            <option key={u._id} value={u._id}>
              {u.name}
            </option>
          ))}
        </select>

        <select
          style={styles.input}
          value={campaign}
          onChange={(e) => setCampaign(e.target.value)}
        >
          {campaigns.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        {campaign === "Other" && (
          <input
            style={styles.input}
            placeholder="Custom Campaign"
            onChange={(e) => setCustomCampaign(e.target.value)}
          />
        )}
      </div>

      <div
        style={{
          marginTop: 30,
          padding: 40,
          borderRadius: 16,
          border: dragActive
            ? "2px solid #6D28D9"
            : "2px dashed #cbd5e1",
          background: dragActive ? "#f5f3ff" : "#fafafa",
          textAlign: "center",
          transition: "all 0.2s ease",
          cursor: "pointer",
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          processFile(e.dataTransfer.files[0]);
        }}
        onClick={() => document.getElementById("hiddenFile").click()}
      >
        <input
          id="hiddenFile"
          type="file"
          style={{ display: "none" }}
          onChange={(e) => processFile(e.target.files[0])}
        />

        <div style={{ fontSize: 40, marginBottom: 12 }}>📁</div>

        <p style={{ fontSize: 18, fontWeight: 600 }}>
          Drag & Drop Excel File Here
        </p>

        <p style={{ color: "#64748b", marginTop: 6 }}>
          or click to browse
        </p>

        {selectedFile && (
          <div
            style={{
              marginTop: 18,
              padding: 10,
              background: "#e0e7ff",
              borderRadius: 8,
              fontSize: 14,
            }}
          >
            Selected: {selectedFile.name}
          </div>
        )}
      </div>

      <button
        style={{
          ...styles.uploadBtn,
          opacity: uploading ? 0.7 : 1,
          marginTop: 30,
        }}
        disabled={uploading}
        onClick={handleFileUpload}
      >
        {uploading ? "Uploading..." : "Upload File"}
      </button>
    </div>
  );
};

/* ========================= GENERIC SECTION ========================= */

const Section = ({ title }) => (
  <div style={styles.card}>
    <h2 style={styles.title}>{title}</h2>
    <p>Content coming soon...</p>
  </div>
);

/* ========================= STYLES ========================= */

const styles = {
  page: { background: "#EEF2FF", minHeight: "100vh" },
  topBar: {
    height: "64px",
    background: "#6D28D9",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 30px",
    color: "#fff",
  },
  logo: { fontSize: "22px", fontWeight: "bold" },
  rightSection: { display: "flex", alignItems: "center", gap: "30px" },
  navLinks: { display: "flex", gap: "20px" },
  navLink: { cursor: "pointer", fontSize: "16px", color: "#fff" },
  activeNavLink: { color: "#DFFA33", fontWeight: 700 },
  profileCircle: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "#fff",
    color: "#6D28D9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    cursor: "pointer",
  },
  content: {
    padding: "50px",
    display: "flex",
    justifyContent: "center",
  },
  card: {
    background: "#fff",
    width: 720,
    padding: 36,
    borderRadius: 18,
    boxShadow: "0 8px 28px rgba(0,0,0,0.1)",
  },
  title: {
    textAlign: "center",
    marginBottom: 24,
    fontSize: "34px",
    fontWeight: 800,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 18,
  },
  input: {
    padding: 12,
    borderRadius: 8,
    border: "1px solid #d0d5dd",
  },
  uploadBtn: {
    padding: 14,
    background: "#6D28D9",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 600,
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  modal: {
    width: "360px",
    background: "#fff",
    borderRadius: "16px",
    padding: "30px",
    textAlign: "center",
  },
  modalAvatar: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    background: "#6D28D9",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 15px",
    fontSize: "28px",
    fontWeight: "bold",
  },
  logoutBtn: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "12px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 600,
  },
};

export default AdopsPanel;
