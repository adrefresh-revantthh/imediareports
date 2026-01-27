// // import React, { useState } from "react";
// // import * as XLSX from "xlsx";

// // const ExcelDashboard = () => {
// //   const [sheetsData, setSheetsData] = useState([]);

// //   const handleFileUpload = (e) => {
// //     const file = e.target.files[0];
// //     if (!file) return;

// //     const reader = new FileReader();

// //     reader.onload = (evt) => {
// //       const data = new Uint8Array(evt.target.result);
// //       const workbook = XLSX.read(data, { type: "array" });

// //       const allSheets = [];

// //       workbook.SheetNames.forEach((sheetName) => {
// //         const worksheet = workbook.Sheets[sheetName];
// //         const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" }); // auto handles any headings
// //         allSheets.push({ name: sheetName, data: jsonData });
// //       });

// //       setSheetsData(allSheets);
// //     };

// //     reader.readAsArrayBuffer(file);
// //   };

// //   return (
// //     <div style={styles.container}>
// //       <h2 style={styles.heading}>📊 Excel Report Dashboard</h2>
// //       <p style={styles.subText}>Upload your Excel file (with multiple worksheets)</p>

// //       <input
// //         type="file"
// //         accept=".xlsx, .xls"
// //         onChange={handleFileUpload}
// //         style={styles.input}
// //       />

// //       {sheetsData.length === 0 && (
// //         <p style={styles.info}>No file uploaded yet.</p>
// //       )}

// //       {sheetsData.map((sheet, index) => (
// //         <div key={index} style={styles.card}>
// //           <h3 style={styles.sheetTitle}>📘 {sheet.name}</h3>
// //           <div style={styles.tableWrapper}>
// //             <table style={styles.table}>
// //               <thead>
// //                 <tr>
// //                   {sheet.data.length > 0 &&
// //                     Object.keys(sheet.data[0]).map((header, i) => (
// //                       <th key={i} style={styles.th}>
// //                         {header}
// //                       </th>
// //                     ))}
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {sheet.data.map((row, i) => (
// //                   <tr key={i}>
// //                     {Object.keys(row).map((key, j) => (
// //                       <td key={j} style={styles.td}>
// //                         {row[key]}
// //                       </td>
// //                     ))}
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>
// //           </div>
// //         </div>
// //       ))}
// //     </div>
// //   );
// // };

// // // 💅 Internal CSS
// // const styles = {
// //   container: {
// //     fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
// //     padding: "30px",
// //     backgroundColor: "#f8fafc",
// //     minHeight: "100vh",
// //   },
// //   heading: {
// //     textAlign: "center",
// //     color: "#222",
// //     fontSize: "26px",
// //     fontWeight: "600",
// //   },
// //   subText: {
// //     textAlign: "center",
// //     color: "#555",
// //     marginBottom: "15px",
// //   },
// //   input: {
// //     display: "block",
// //     margin: "0 auto 25px",
// //     padding: "10px",
// //     borderRadius: "6px",
// //     border: "1px solid #ccc",
// //   },
// //   info: {
// //     textAlign: "center",
// //     color: "#777",
// //   },
// //   card: {
// //     backgroundColor: "#fff",
// //     borderRadius: "10px",
// //     padding: "20px",
// //     marginBottom: "25px",
// //     boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
// //   },
// //   sheetTitle: {
// //     fontSize: "18px",
// //     fontWeight: "600",
// //     color: "#333",
// //     marginBottom: "10px",
// //     borderBottom: "2px solid #007bff",
// //     display: "inline-block",
// //     paddingBottom: "4px",
// //   },
// //   tableWrapper: {
// //     overflowX: "auto",
// //   },
// //   table: {
// //  table: {
// //   width: "auto",
// //   borderCollapse: "collapse",
// //   margin: "0 auto",
// //   maxWidth: "100%",
// //   tableLayout: "auto",
// // },

// //   },
// //   th: {
// //     backgroundColor: "#007bff",
// //     color: "#fff",
// //     padding: "10px",
// //     textAlign: "left",
// //     borderBottom: "2px solid #ddd",
// //     whiteSpace: "nowrap",
// //   },
// //   td: {
// //     padding: "8px 10px",
// //     borderBottom: "1px solid #eee",
// //     whiteSpace: "nowrap",
// //   },
// // };

// // export default ExcelDashboard;

// // DashboardView.js
// import React from "react";
// import { useLocation, useNavigate } from "react-router-dom";

// export default function DashboardView() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const allSheets = location.state?.allSheets;

//   if (!allSheets) {
//     return (
//       <div style={styles.center}>
//         <h2>No data found. Please upload a file first.</h2>
//         <button onClick={() => navigate("/")} style={styles.button}>
//           Go to Upload
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div style={styles.page}>
//       <h1 style={styles.heading}>📈 Dashboard View (All Worksheets)</h1>

//       {Object.entries(allSheets).map(([sheetName, data]) => (
//         <div key={sheetName} style={styles.card}>
//           <h2>{sheetName}</h2>

//           <div style={{ overflowX: "auto" }}>
//             <table style={styles.table}>
//               <thead>
//                 <tr>
//                   {Object.keys(data[0] || {}).map((key, i) => (
//                     <th key={i}>{key}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {data.map((row, i) => (
//                   <tr key={i}>
//                     {Object.values(row).map((val, j) => (
//                       <td key={j}>{val?.toString()}</td>
//                     ))}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

// const styles = {
//   page: {
//     padding: "40px",
//     background: "#eef2f7",
//     minHeight: "100vh",
//     fontFamily: "Segoe UI, sans-serif",
//   },
//   heading: {
//     textAlign: "center",
//     marginBottom: "30px",
//     color: "#222",
//   },
//   card: {
//     background: "#fff",
//     padding: "20px",
//     borderRadius: "10px",
//     boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
//     marginBottom: "25px",
//   },
//   table: {
//     width: "100%",
//     borderCollapse: "collapse",
//   },
//   button: {
//     background: "#007bff",
//     color: "#fff",
//     padding: "10px 15px",
//     border: "none",
//     borderRadius: "6px",
//     cursor: "pointer",
//   },
//   center: {
//     textAlign: "center",
//     padding: "50px",
//   },
// };
