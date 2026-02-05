
// import React, { useEffect, useState, useContext } from "react";
// import axios from "axios";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";
// import { useNavigate } from "react-router-dom";
// import { ThemeContext } from "../ThemeSettings/ThemeContext";

// const UploadedReports = () => {
//   const [reports, setReports] = useState([]);
//   const navigate = useNavigate();
//   const { theme } = useContext(ThemeContext);

//   useEffect(() => {
//     const fetchReports = async () => {
//       try {
//         const token = JSON.parse(localStorage.getItem("jwt"))?.token;
//         if (!token) {
//           console.error("Missing authentication token");
//           return;
//         }

//         const res = await axios.get("https://imediareports.onrender.com/api/getalldata", {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         // ✅ Combine main + genealogy sheets
//         const allSheets = [
//           ...(res.data?.sheets || []),
//           ...(res.data?.genealogySheets || []),
//         ];

//         const grouped = {};

//         allSheets.forEach((sheet) => {
//           const uploaderId =
//             sheet.uploadedBy?._id || sheet.uploadedBy || "unknown";
//           const uploaderName =
//             sheet.uploadedByName ||
//             sheet.uploadedBy?.name ||
//             "Unknown Uploader";

//           if (!grouped[uploaderId]) {
//             grouped[uploaderId] = {
//               uploaderId,
//               uploaderName,
//               createdAt: sheet.createdAt || new Date().toISOString(),
//               worksheets: [],
//             };
//           }

//           grouped[uploaderId].worksheets.push({
//             id: sheet._id,
//             name:
//               sheet.name ||
//               `Sheet_${grouped[uploaderId].worksheets.length + 1}`,
//             data: sheet.data || [],
//             publisher: sheet.publisher,
//             advertiser: sheet.advertiser,
//             campaign: sheet.campaign,
//           });
//         });

//         const formatted = Object.values(grouped).sort(
//           (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//         );

//         setReports(formatted);
//       } catch (err) {
//         console.error("Error fetching reports:", err);
//       }
//     };

//     fetchReports();
//   }, []);

//   // ✅ Navigate to View Worksheets
//   const handleView = (report) => {
//     const sheetIds = report.worksheets.map((ws) => ws.id).filter(Boolean);
//     if (!sheetIds.length) {
//       alert("No worksheets found for this uploader.");
//       return;
//     }
//     navigate("/viewuploads", { state: { sheetIds } });
//   };

//   // ✅ Download all worksheets for an uploader
//   const handleDownload = (report) => {
//     if (!report.worksheets?.length) {
//       alert("No worksheets available for download.");
//       return;
//     }

//     const wb = XLSX.utils.book_new();
//     report.worksheets.forEach((sheet) => {
//       const metaAddedData = (sheet.data || []).map((row) => ({
//         ...row,
//         __Publisher: sheet.publisher,
//         __Advertiser: sheet.advertiser,
//         __Campaign: sheet.campaign,
//         __Uploader: report.uploaderName,
//       }));
//       const ws = XLSX.utils.json_to_sheet(metaAddedData);
//       XLSX.utils.book_append_sheet(
//         wb,
//         ws,
//         sheet.name?.substring(0, 30) || "Sheet"
//       );
//     });

//     const fileName = `${report.uploaderName.replace(/\s+/g, "_")}_Reports.xlsx`;
//     const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
//     saveAs(new Blob([buffer], { type: "application/octet-stream" }), fileName);
//   };

//   // ✅ Delete all sheets by uploader
//   const handleDelete = async (uploaderId) => {
//     if (
//       !window.confirm(
//         "Are you sure you want to delete all reports for this uploader?"
//       )
//     )
//       return;

//     try {
//       await axios.delete(
//         `http://localhost:5000/api/deletesheetsbyuploader/${uploaderId}`
//       );
//       setReports(reports.filter((r) => r.uploaderId !== uploaderId));
//       alert("Reports deleted successfully!");
//     } catch (err) {
//       console.error("Error deleting reports:", err);
//       alert("Failed to delete reports.");
//     }
//   };

//   // 🎨 Theme Colors
//   const colors = {
//     background: theme === "dark" ? "#0f172a" : "#f9fafb",
//     card: theme === "dark" ? "#1e293b" : "#ffffff",
//     border: theme === "dark" ? "#334155" : "#e5e7eb",
//     textPrimary: theme === "dark" ? "#f1f5f9" : "#111827",
//     textSecondary: theme === "dark" ? "#cbd5e1" : "#555",
//     headerBg: theme === "dark" ? "#334155" : "#eef3f9",
//   };

//   return (
//     <div
//       style={{
//         ...styles.container,
//         backgroundColor: colors.background,
//         color: colors.textPrimary,
//       }}
//     >
//       <h2 style={{ ...styles.title, color: colors.textPrimary }}>
//         📂 Uploaded Reports Overview
//       </h2>
//       <p style={{ ...styles.subtitle, color: colors.textSecondary }}>
//         Manage and view all uploaded datasets grouped by uploader. You can
//         preview worksheets, download consolidated Excel files, or remove
//         datasets.
//       </p>

//       <div
//         style={{
//           ...styles.tableWrapper,
//           background: colors.card,
//           boxShadow:
//             theme === "dark"
//               ? "0 2px 8px rgba(0,0,0,0.6)"
//               : "0 4px 12px rgba(0,0,0,0.08)",
//         }}
//       >
//         <table style={{ ...styles.table, borderColor: colors.border }}>
//           <thead>
//             <tr>
//               {[
//                 "#",
//                 "Uploader Name",
//                 "Upload Date",
//                 "Total Sheets",
//                 "Status",
//                 "Actions",
//               ].map((header, idx) => (
//                 <th
//                   key={idx}
//                   style={{
//                     ...styles.th,
//                     backgroundColor: colors.headerBg,
//                     color: colors.textPrimary,
//                   }}
//                 >
//                   {header}
//                 </th>
//               ))}
//             </tr>
//           </thead>

//           <tbody>
//             {reports.length > 0 ? (
//               reports.map((r, i) => (
//                 <tr key={r.uploaderId} style={styles.tr}>
//                   <td style={{ ...styles.td, borderColor: colors.border }}>
//                     {i + 1}
//                   </td>
//                   <td style={{ ...styles.td, borderColor: colors.border }}>
//                     {r.uploaderName}
//                   </td>
//                   <td style={{ ...styles.td, borderColor: colors.border }}>
//                     {new Date(r.createdAt).toLocaleString()}
//                   </td>
//                   <td style={{ ...styles.td, borderColor: colors.border }}>
//                     {r.worksheets.length}
//                   </td>
//                   <td style={{ ...styles.td, borderColor: colors.border }}>
//                     <span style={statusBadge("Processed")}>Processed</span>
//                   </td>
//                   <td
//                     style={{
//                       ...styles.td,
//                       ...styles.actions,
//                       borderColor: colors.border,
//                     }}
//                   >
//                     <button style={styles.viewBtn} onClick={() => handleView(r)}>
//                       View
//                     </button>
//                     <button
//                       style={styles.downloadBtn}
//                       onClick={() => handleDownload(r)}
//                     >
//                       Download
//                     </button>
//                     <button
//                       style={styles.deleteBtn}
//                       onClick={() => handleDelete(r.uploaderId)}
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td
//                   colSpan="6"
//                   style={{ ...styles.empty, color: colors.textSecondary }}
//                 >
//                   No reports uploaded yet.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// // ✅ Status Badge
// const statusBadge = (status) => ({
//   background: status === "Processed" ? "#00C49F" : "#FF9800",
//   color: "#fff",
//   padding: "5px 10px",
//   borderRadius: "6px",
//   fontSize: "12px",
//   fontWeight: 600,
// });

// // ✅ Styles
// const styles = {
//   container: { padding: "30px"},
//   title: { fontSize: "24px", fontWeight: 700, marginBottom: "5px" },
//   subtitle: { fontSize: "14px", marginBottom: "20px" },
//   tableWrapper: { overflowX: "auto", padding: "20px", borderRadius: "12px" },
//   table: { width: "100%", borderCollapse: "collapse" },
//   th: {
//     padding: "12px 10px",
//     fontWeight: 600,
//     fontSize: "14px",
//     textAlign: "left",
//     border: "1px solid",
//   },
//   td: { padding: "10px", fontSize: "14px", border: "1px solid" },
//   tr: { transition: "background 0.2s ease-in-out" },
//   empty: { textAlign: "center", padding: "20px", fontStyle: "italic" },
//   actions: { display: "flex", gap: "10px", justifyContent: "center" },
//   viewBtn: {
//     background: "#007bff",
//     color: "#fff",
//     padding: "6px 12px",
//     border: "none",
//     borderRadius: "6px",
//     cursor: "pointer",
//     fontSize: "13px",
//   },
//   downloadBtn: {
//     background: "#6a5acd",
//     color: "#fff",
//     padding: "6px 12px",
//     border: "none",
//     borderRadius: "6px",
//     cursor: "pointer",
//     fontSize: "13px",
//   },
//   deleteBtn: {
//     background: "#ff4d4d",
//     color: "#fff",
//     padding: "6px 12px",
//     border: "none",
//     borderRadius: "6px",
//     cursor: "pointer",
//     fontSize: "13px",
//   },
// };

// export default UploadedReports;
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../ThemeSettings/ThemeContext";

const UploadedReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ skeleton
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const token = JSON.parse(localStorage.getItem("jwt"))?.token;
        if (!token) return;

        const res = await axios.get(
          "https://imediareports.onrender.com/api/getalldata",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const allSheets = [
          ...(res.data?.sheets || []),
          ...(res.data?.genealogySheets || []),
        ];

        const grouped = {};

        allSheets.forEach((sheet) => {
          const uploaderId =
            sheet.uploadedBy?._id || sheet.uploadedBy || "unknown";
          const uploaderName =
            sheet.uploadedByName ||
            sheet.uploadedBy?.name ||
            "Unknown Uploader";

          if (!grouped[uploaderId]) {
            grouped[uploaderId] = {
              uploaderId,
              uploaderName,
              createdAt: sheet.createdAt || new Date().toISOString(),
              worksheets: [],
            };
          }

          grouped[uploaderId].worksheets.push({
            id: sheet._id,
            name: sheet.name,
            data: sheet.data || [],
            publisher: sheet.publisher,
            advertiser: sheet.advertiser,
            campaign: sheet.campaign,
          });
        });

        setReports(
          Object.values(grouped).sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handleView = (report) => {
    const sheetIds = report.worksheets.map((ws) => ws.id).filter(Boolean);
    navigate("/viewuploads", { state: { sheetIds } });
  };

  const handleDownload = (report) => {
    const wb = XLSX.utils.book_new();
    report.worksheets.forEach((sheet) => {
      const ws = XLSX.utils.json_to_sheet(sheet.data || []);
      XLSX.utils.book_append_sheet(wb, ws, sheet.name || "Sheet");
    });
    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([buffer], { type: "application/octet-stream" }),
      `${report.uploaderName}_Reports.xlsx`
    );
  };

  const colors = {
    background: theme === "dark" ? "#0f172a" : "#f9fafb",
    card: theme === "dark" ? "#1e293b" : "#ffffff",
    border: theme === "dark" ? "#334155" : "#e5e7eb",
    textPrimary: theme === "dark" ? "#f1f5f9" : "#111827",
    textSecondary: theme === "dark" ? "#cbd5e1" : "#555",
    headerBg: theme === "dark" ? "#334155" : "#eef3f9",
  };

  return (
    <div
      style={{
        ...styles.container,
        backgroundColor: colors.background,
        color: colors.textPrimary,
      }}
    >
      <h2 style={{ ...styles.title, color: colors.textPrimary }}>
        📂 Uploaded Reports Overview
      </h2>

      <p style={{ ...styles.subtitle, color: colors.textSecondary }}>
        Manage and view all uploaded datasets grouped by uploader.
      </p>

      <div style={{ ...styles.tableWrapper, background: colors.card }}>
        <table style={styles.table}>
          <thead>
            <tr>
              {["#", "Uploader", "Upload Date", "Sheets", "Status", "Actions"].map(
                (h) => (
                  <th key={h} style={{ ...styles.th, background: colors.headerBg }}>
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan="6">
                      <div className="skeleton-row" />
                    </td>
                  </tr>
                ))
              : reports.map((r, i) => (
                  <tr key={r.uploaderId}>
                    <td style={styles.td}>{i + 1}</td>
                    <td style={styles.td}>{r.uploaderName}</td>
                    <td style={styles.td}>
                      {new Date(r.createdAt).toLocaleString()}
                    </td>
                    <td style={styles.td}>{r.worksheets.length}</td>
                    <td style={styles.td}>
                      <span style={statusBadge}>Processed</span>
                    </td>
                    <td style={{ ...styles.td, ...styles.actions }}>
                      <button style={styles.viewBtn} onClick={() => handleView(r)}>
                        View
                      </button>
                      <button
                        style={styles.downloadBtn}
                        onClick={() => handleDownload(r)}
                      >
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {/* Skeleton animation */}
      <style>
        {`
          .skeleton-row {
            height: 48px;
            border-radius: 8px;
            background: linear-gradient(
              90deg,
              #e5e7eb 25%,
              #f3f4f6 37%,
              #e5e7eb 63%
            );
            background-size: 400% 100%;
            animation: shimmer 1.4s infinite;
          }
          @keyframes shimmer {
            0% { background-position: 100% 0 }
            100% { background-position: -100% 0 }
          }
        `}
      </style>
    </div>
  );
};

const statusBadge = {
  background: "#00C49F",
  color: "#fff",
  padding: "8px 16px",
  borderRadius: "8px",
  fontSize: "16px",
  fontWeight: 700,
};

const styles = {
  container: { padding: "40px" },

  title: { fontSize: "36px", fontWeight: 800, marginBottom: "10px" },

  subtitle: { fontSize: "20px", marginBottom: "30px" },

  tableWrapper: {
    padding: "24px",
    borderRadius: "14px",
  },

  table: { width: "100%", borderCollapse: "collapse" },

  th: {
    padding: "18px",
    fontSize: "20px",
    fontWeight: 700,
    border: "1px solid #ccc",
  },

  td: {
    padding: "16px",
    fontSize: "18px",
    border: "1px solid #ccc",
    textAlign: "center",
  },

  actions: {
    display: "flex",
    gap: "12px",
    justifyContent: "center",
  },

  viewBtn: {
    background: "#007bff",
    color: "#fff",
    padding: "10px 18px",
    fontSize: "16px",
    borderRadius: "8px",
    cursor: "pointer",
  },

  downloadBtn: {
    background: "#6a5acd",
    color: "#fff",
    padding: "10px 18px",
    fontSize: "16px",
    borderRadius: "8px",
    cursor: "pointer",
  },
};

export default UploadedReports;
