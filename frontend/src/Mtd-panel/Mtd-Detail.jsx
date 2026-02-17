// // // import React, { useEffect, useState } from "react";

// // // const SheetTable = () => {
// // //   const [data, setData] = useState([]);
// // //   const [headers, setHeaders] = useState([]);
// // //   const [loading, setLoading] = useState(true);

// // //   // 🔗 Your Apps Script Web App URL
// // //   const API_URL = "https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLh523RHBVvgCUXpDy13TRuezRnM_TCSgRClKE5-tFw8sraua5Vu5XbOoCtRHILBYtF0i19TAKjRMq4eKnQqF-Stj23-b9C3U2ncAH5bIjaWvePJRHOG7USSiRGVgtxhcBciuwiSCaPomrAA3u5F0UmX7C7bmFvrR0lh6FUiluVSPVycztxIZwegmytaORBdh7pzSffUx3CI0dmeZUu8kkuR8uLhFv3yga1mhEj9EBhflO67a1efVd3BGHB-vJDx59NkS8GezIOt334ack-3Sx41WojccQ&lib=MweKKo2ro4GAGSREHHTopB0w9ezPKz0cG";

// // //   useEffect(() => {
// // //     fetch(API_URL)
// // //       .then((res) => res.json())
// // //       .then((rows) => {
// // //         // Remove completely empty rows
// // //         const cleanedRows = rows.filter(
// // //           (row) => row.some((cell) => cell !== "")
// // //         );

// // //         if (cleanedRows.length === 0) {
// // //           setLoading(false);
// // //           return;
// // //         }

// // //         // First non-empty row = headers
// // //         setHeaders(cleanedRows[0]);
// // //         // Remaining rows = data
// // //         setData(cleanedRows.slice(1));
// // //         setLoading(false);
// // //       })
// // //       .catch((err) => {
// // //         console.error("Fetch error:", err);
// // //         setLoading(false);
// // //       });
// // //   }, []);

// // //   if (loading) return <p>Loading…</p>;

// // //   return (
// // //     <div style={{ overflowX: "auto" }}>
// // //       <table style={{ width: "100%", borderCollapse: "collapse" }}>
// // //         <thead>
// // //           <tr>
// // //             {headers.map((head, i) => (
// // //               <th
// // //                 key={i}
// // //                 style={{
// // //                   border: "1px solid #ccc",
// // //                   padding: "8px",
// // //                   background: "#f5f5f5",
// // //                   whiteSpace: "nowrap",
// // //                 }}
// // //               >
// // //                 {head}
// // //               </th>
// // //             ))}
// // //           </tr>
// // //         </thead>

// // //         <tbody>
// // //           {data.map((row, rowIndex) => (
// // //             <tr key={rowIndex}>
// // //               {headers.map((_, colIndex) => (
// // //                 <td
// // //                   key={colIndex}
// // //                   style={{
// // //                     border: "1px solid #eee",
// // //                     padding: "8px",
// // //                     whiteSpace: "nowrap",
// // //                   }}
// // //                 >
// // //                   {row[colIndex] ?? ""}
// // //                 </td>
// // //               ))}
// // //             </tr>
// // //           ))}
// // //         </tbody>
// // //       </table>
// // //     </div>
// // //   );
// // // };

// // // export default SheetTable;


// // // import React, { useEffect, useState } from "react";

// // // const SheetTable = () => {
// // //   const [rowData, setRowData] = useState([]);
// // //   const [headers, setHeaders] = useState([]);
// // //   const [loading, setLoading] = useState(true);

// // //   const API_URL =
// // //     "https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLh523RHBVvgCUXpDy13TRuezRnM_TCSgRClKE5-tFw8sraua5Vu5XbOoCtRHILBYtF0i19TAKjRMq4eKnQqF-Stj23-b9C3U2ncAH5bIjaWvePJRHOG7USSiRGVgtxhcBciuwiSCaPomrAA3u5F0UmX7C7bmFvrR0lh6FUiluVSPVycztxIZwegmytaORBdh7pzSffUx3CI0dmeZUu8kkuR8uLhFv3yga1mhEj9EBhflO67a1efVd3BGHB-vJDx59NkS8GezIOt334ack-3Sx41WojccQ&lib=MweKKo2ro4GAGSREHHTopB0w9ezPKz0cG";

// // //       const jwt = JSON.parse(localStorage.getItem("jwt"));
// // //   const currentUser =jwt.user.name // 🔥 replace with auth user if needed
// // //   // 🔐 get logged-in user name
// // //    // 🔥 change key if needed

// // //   useEffect(() => {
// // //     if (!currentUser) {
// // //       console.warn("No user found in localStorage");
// // //       setLoading(false);
// // //       return;
// // //     }

// // //     fetch(API_URL)
// // //       .then((res) => res.text())
// // //       .then((text) => {
// // //         const rows = JSON.parse(text);

// // //         if (!Array.isArray(rows)) {
// // //           console.error("Invalid sheet data");
// // //           setLoading(false);
// // //           return;
// // //         }

// // //         // remove fully empty rows
// // //         const cleanedRows = rows.filter((row) =>
// // //           row.some((cell) => cell !== "")
// // //         );

// // //         // find header row containing "Sales Rep"
// // //         const headerIndex = cleanedRows.findIndex((row) =>
// // //           row.some(
// // //             (cell) =>
// // //               String(cell).trim().toLowerCase() === "sales rep"
// // //           )
// // //         );

// // //         if (headerIndex === -1) {
// // //           console.error("Sales Rep header not found");
// // //           setLoading(false);
// // //           return;
// // //         }

// // //         const headerRow = cleanedRows[headerIndex];
// // //         const salesRepColIndex = headerRow.findIndex(
// // //           (cell) =>
// // //             String(cell).trim().toLowerCase() === "sales rep"
// // //         );

// // //         if (salesRepColIndex === -1) {
// // //           console.error("Sales Rep column not found");
// // //           setLoading(false);
// // //           return;
// // //         }

// // //         // data rows start after header
// // //         const dataRows = cleanedRows.slice(headerIndex + 1);

// // //         // find logged-in user's row
// // //         const userRow = dataRows.find(
// // //           (row) =>
// // //             String(row[salesRepColIndex])
// // //               .trim()
// // //               .toLowerCase() ===
// // //             currentUser.trim().toLowerCase()
// // //         );

// // //         if (!userRow) {
// // //           console.warn("No matching row for user:", currentUser);
// // //           setLoading(false);
// // //           return;
// // //         }

// // //         setHeaders(headerRow);
// // //         setRowData(userRow);
// // //         setLoading(false);
// // //       })
// // //       .catch((err) => {
// // //         console.error("Fetch error:", err);
// // //         setLoading(false);
// // //       });
// // //   }, [currentUser]);

// // //   if (loading) return <p>Loading…</p>;
// // //   if (!rowData.length) return <p>No data available</p>;

// // //   return (
// // //     <div style={{ overflowX: "auto" }}>
// // //       <table style={{ width: "100%", borderCollapse: "collapse" }}>
// // //         <thead>
// // //           <tr>
// // //             {headers.map((head, i) => (
// // //               <th
// // //                 key={i}
// // //                 style={{
// // //                   border: "1px solid #ccc",
// // //                   padding: "8px",
// // //                   background: "#f5f5f5",
// // //                   whiteSpace: "nowrap",
// // //                 }}
// // //               >
// // //                 {head}
// // //               </th>
// // //             ))}
// // //           </tr>
// // //         </thead>

// // //         <tbody>
// // //           <tr>
// // //             {headers.map((_, colIndex) => (
// // //               <td
// // //                 key={colIndex}
// // //                 style={{
// // //                   border: "1px solid #eee",
// // //                   padding: "8px",
// // //                   whiteSpace: "nowrap",
// // //                 }}
// // //               >
// // //                 {rowData[colIndex] ?? ""}
// // //               </td>
// // //             ))}
// // //           </tr>
// // //         </tbody>
// // //       </table>
// // //     </div>
// // //   );
// // // };

// // // export default SheetTable;
// // import React, { useEffect, useState } from "react";

// // const SheetTable = () => {
// //   const [rowData, setRowData] = useState([]);
// //   const [headers, setHeaders] = useState([]);
// //   const [loading, setLoading] = useState(true);

// //   const API_URL =
// //     "https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLh523RHBVvgCUXpDy13TRuezRnM_TCSgRClKE5-tFw8sraua5Vu5XbOoCtRHILBYtF0i19TAKjRMq4eKnQqF-Stj23-b9C3U2ncAH5bIjaWvePJRHOG7USSiRGVgtxhcBciuwiSCaPomrAA3u5F0UmX7C7bmFvrR0lh6FUiluVSPVycztxIZwegmytaORBdh7pzSffUx3CI0dmeZUu8kkuR8uLhFv3yga1mhEj9EBhflO67a1efVd3BGHB-vJDx59NkS8GezIOt334ack-3Sx41WojccQ&lib=MweKKo2ro4GAGSREHHTopB0w9ezPKz0cG";

// //   // 🔐 get logged-in user
// //   const jwt = JSON.parse(localStorage.getItem("jwt"));
// //   const currentUser = jwt?.user?.name;

// //   useEffect(() => {
// //     if (!currentUser) {
// //       console.warn("No user found");
// //       setLoading(false);
// //       return;
// //     }

// //     fetch(API_URL)
// //       .then((res) => res.text())
// //       .then((text) => {
// //         const rows = JSON.parse(text);

// //         if (!Array.isArray(rows)) {
// //           console.error("Invalid data format");
// //           setLoading(false);
// //           return;
// //         }

// //         // remove empty rows
// //         const cleanedRows = rows.filter((row) =>
// //           row.some((cell) => cell !== "")
// //         );

// //         // find header row with "Sales Rep"
// //         const headerIndex = cleanedRows.findIndex((row) =>
// //           row.some(
// //             (cell) =>
// //               String(cell).trim().toLowerCase() === "sales rep"
// //           )
// //         );

// //         if (headerIndex === -1) {
// //           console.error("Sales Rep header not found");
// //           setLoading(false);
// //           return;
// //         }

// //         const headerRow = cleanedRows[headerIndex];

// //         const salesRepColIndex = headerRow.findIndex(
// //           (cell) =>
// //             String(cell).trim().toLowerCase() === "sales rep"
// //         );

// //         if (salesRepColIndex === -1) {
// //           console.error("Sales Rep column not found");
// //           setLoading(false);
// //           return;
// //         }

// //         // data rows
// //         const dataRows = cleanedRows.slice(headerIndex + 1);

// //         // ✅ FILTER ALL MATCHING ROWS
// //         const userRows = dataRows.filter(
// //           (row) =>
// //             String(row[salesRepColIndex])
// //               .trim()
// //               .toLowerCase() ===
// //             currentUser.trim().toLowerCase()
// //         );

// //         if (!userRows.length) {
// //           console.warn("No data for user:", currentUser);
// //           setLoading(false);
// //           return;
// //         }

// //         setHeaders(headerRow);
// //         setRowData(userRows);
// //         setLoading(false);
// //       })
// //       .catch((err) => {
// //         console.error("Fetch error:", err);
// //         setLoading(false);
// //       });
// //   }, [currentUser]);

// //   if (loading) return <p>Loading…</p>;
// //   if (!rowData.length) return <p>No data available</p>;

// //   return (
// //     <div style={{ overflowX: "auto" }}>
// //       <table style={{ width: "100%", borderCollapse: "collapse" }}>
// //         <thead>
// //           <tr>
// //             {headers.map((head, i) => (
// //               <th
// //                 key={i}
// //                 style={{
// //                   border: "1px solid #ccc",
// //                   padding: "8px",
// //                   background: "#f5f5f5",
// //                   whiteSpace: "nowrap",
// //                 }}
// //               >
// //                 {head}
// //               </th>
// //             ))}
// //           </tr>
// //         </thead>

// //         <tbody>
// //           {rowData.map((row, rowIndex) => (
// //             <tr key={rowIndex}>
// //               {headers.map((_, colIndex) => (
// //                 <td
// //                   key={colIndex}
// //                   style={{
// //                     border: "1px solid #eee",
// //                     padding: "8px",
// //                     whiteSpace: "nowrap",
// //                   }}
// //                 >
// //                   {row[colIndex] ?? ""}
// //                 </td>
// //               ))}
// //             </tr>
// //           ))}
// //         </tbody>
// //       </table>
// //     </div>
// //   );
// // };

// // export default SheetTable;

// // import React, { useEffect, useState } from "react";

// // /* ---------- Skeleton Row ---------- */
// // const SkeletonRow = ({ cols }) => (
// //   <tr>
// //     {Array.from({ length: cols }).map((_, i) => (
// //       <td key={i} style={{ padding: "16px" }}>
// //         <div className="skeleton-box" />
// //       </td>
// //     ))}
// //   </tr>
// // );

// // const SheetTable = () => {
// //   const [rowData, setRowData] = useState([]);
// //   const [headers, setHeaders] = useState([]);
// //   const [loading, setLoading] = useState(true);

// //   const API_URL =
// //     "https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLh523RHBVvgCUXpDy13TRuezRnM_TCSgRClKE5-tFw8sraua5Vu5XbOoCtRHILBYtF0i19TAKjRMq4eKnQqF-Stj23-b9C3U2ncAH5bIjaWvePJRHOG7USSiRGVgtxhcBciuwiSCaPomrAA3u5F0UmX7C7bmFvrR0lh6FUiluVSPVycztxIZwegmytaORBdh7pzSffUx3CI0dmeZUu8kkuR8uLhFv3yga1mhEj9EBhflO67a1efVd3BGHB-vJDx59NkS8GezIOt334ack-3Sx41WojccQ&lib=MweKKo2ro4GAGSREHHTopB0w9ezPKz0cG";

// //   const jwt = JSON.parse(localStorage.getItem("jwt"));
// //   const currentUser = jwt?.user?.name;

// //   useEffect(() => {
// //     if (!currentUser) {
// //       setLoading(false);
// //       return;
// //     }

// //     fetch(API_URL)
// //       .then((res) => res.text())
// //       .then((text) => {
// //         const rows = JSON.parse(text);

// //         const cleanedRows = rows.filter((row) =>
// //           row.some((cell) => cell !== "")
// //         );

// //         const headerIndex = cleanedRows.findIndex((row) =>
// //           row.some(
// //             (cell) =>
// //               String(cell).trim().toLowerCase() === "sales rep"
// //           )
// //         );

// //         const headerRow = cleanedRows[headerIndex];
// //         const salesRepColIndex = headerRow.findIndex(
// //           (cell) =>
// //             String(cell).trim().toLowerCase() === "sales rep"
// //         );

// //         const dataRows = cleanedRows.slice(headerIndex + 1);

// //         const userRows = dataRows.filter(
// //           (row) =>
// //             String(row[salesRepColIndex])
// //               .trim()
// //               .toLowerCase() ===
// //             currentUser.trim().toLowerCase()
// //         );

// //         setHeaders(headerRow);
// //         setRowData(userRows);
// //         setLoading(false);
// //       })
// //       .catch(() => setLoading(false));
// //   }, [currentUser]);

// //   return (
// //     <div style={{ padding: "24px" }}>
// //       {/* Card Container */}
// //       <div
// //         style={{
// //           background: "#ffffff",
// //           borderRadius: "14px",
// //           boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
// //           overflow: "hidden",
// //         }}
// //       >
// //         {/* Title */}
// //         <div
// //           style={{
// //             padding: "18px 24px",
// //             fontSize: "20px",
// //             fontWeight: "600",
// //             borderBottom: "1px solid #eee",
// //             background: "#fafafa",
// //           }}
// //         >
// //           📊 My Sales Sheet Data
// //         </div>

// //         <div style={{ overflowX: "auto" }}>
// //           <table
// //             style={{
// //               width: "100%",
// //               borderCollapse: "separate",
// //               borderSpacing: "0",
// //               fontSize: "15px",
// //             }}
// //           >
// //             <thead>
// //               <tr>
// //                 {(headers.length ? headers : Array.from({ length: 6 })).map(
// //                   (head, i) => (
// //                     <th
// //                       key={i}
// //                       style={{
// //                         position: "sticky",
// //                         top: 0,
// //                         background: "#f1f5f9",
// //                         padding: "16px 20px",
// //                         textAlign: "left",
// //                         fontWeight: "600",
// //                         borderBottom: "2px solid #e5e7eb",
// //                         whiteSpace: "nowrap",
// //                       }}
// //                     >
// //                       {loading ? (
// //                         <div className="skeleton-box" />
// //                       ) : (
// //                         head
// //                       )}
// //                     </th>
// //                   )
// //                 )}
// //               </tr>
// //             </thead>

// //             <tbody>
// //               {loading ? (
// //                 Array.from({ length: 5 }).map((_, i) => (
// //                   <SkeletonRow
// //                     key={i}
// //                     cols={headers.length || 6}
// //                   />
// //                 ))
// //               ) : rowData.length ? (
// //                 rowData.map((row, rowIndex) => (
// //                   <tr
// //                     key={rowIndex}
// //                     style={{
// //                       transition: "background 0.2s",
// //                     }}
// //                     onMouseEnter={(e) =>
// //                       (e.currentTarget.style.background =
// //                         "#f9fafb")
// //                     }
// //                     onMouseLeave={(e) =>
// //                       (e.currentTarget.style.background =
// //                         "transparent")
// //                     }
// //                   >
// //                     {headers.map((_, colIndex) => (
// //                       <td
// //                         key={colIndex}
// //                         style={{
// //                           padding: "16px 20px",
// //                           borderBottom:
// //                             "1px solid #f0f0f0",
// //                           whiteSpace: "nowrap",
// //                           fontWeight: "500",
// //                         }}
// //                       >
// //                         {row[colIndex] ?? "-"}
// //                       </td>
// //                     ))}
// //                   </tr>
// //                 ))
// //               ) : (
// //                 <tr>
// //                   <td
// //                     colSpan={headers.length}
// //                     style={{
// //                       padding: "30px",
// //                       textAlign: "center",
// //                       color: "#999",
// //                     }}
// //                   >
// //                     No data available
// //                   </td>
// //                 </tr>
// //               )}
// //             </tbody>
// //           </table>
// //         </div>
// //       </div>

// //       {/* Skeleton CSS */}
// //       <style>
// //         {`
// //           .skeleton-box {
// //             height: 18px;
// //             width: 100%;
// //             border-radius: 6px;
// //             background: linear-gradient(
// //               90deg,
// //               #e5e7eb 25%,
// //               #f3f4f6 37%,
// //               #e5e7eb 63%
// //             );
// //             background-size: 400% 100%;
// //             animation: shimmer 1.4s ease infinite;
// //           }

// //           @keyframes shimmer {
// //             0% { background-position: 100% 0 }
// //             100% { background-position: -100% 0 }
// //           }
// //         `}
// //       </style>
// //     </div>
// //   );
// // };

// // export default SheetTable;
// import React, { useEffect, useState } from "react";

// /* ---------- Skeleton Row ---------- */
// const SkeletonRow = ({ cols }) => (
//   <tr>
//     {Array.from({ length: cols }).map((_, i) => (
//       <td key={i} style={{ padding: "16px" }}>
//         <div className="skeleton-box" />
//       </td>
//     ))}
//   </tr>
// );

// /* ✅ SELECT ONLY REQUIRED COLUMNS HERE */
// const VISIBLE_COLUMNS = [
//   "campaign name",
//   "commission %",
//   "commission $",
//   "impressions",
//   "clicks",
//   "start date",
//   "end date",
//   "mtd revenue",
//   "booked revenue",
//   "pacing %",
// ];

// const SheetTable = () => {
//   const [rowData, setRowData] = useState([]);
//   const [headers, setHeaders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const API_URL =
//     "https://script.google.com/macros/s/AKfycbyaLs2NmfXZt2Kkk651wXsGBos-j3zB0pdqZsjt6mIDT4AGYcbYxpX6g4toHQ2a4sKgyg/exec";

//   const jwt = JSON.parse(localStorage.getItem("jwt"));
//   const currentUser = jwt?.user?.name;

//   useEffect(() => {
//     if (!currentUser) {
//       setLoading(false);
//       return;
//     }

//     fetch(API_URL)
//       .then((res) => res.text())
//       .then((text) => {
//         const rows = JSON.parse(text);

//         const cleanedRows = rows.filter((row) =>
//           row.some((cell) => cell !== "")
//         );

//         const headerIndex = cleanedRows.findIndex((row) =>
//           row.some(
//             (cell) =>
//               String(cell).trim().toLowerCase() === "sales rep"
//           )
//         );

//         const headerRow = cleanedRows[headerIndex];
//         const salesRepColIndex = headerRow.findIndex(
//           (cell) =>
//             String(cell).trim().toLowerCase() === "sales rep"
//         );

//         const dataRows = cleanedRows.slice(headerIndex + 1);

//         const userRows = dataRows.filter(
//           (row) =>
//             String(row[salesRepColIndex])
//               .trim()
//               .toLowerCase() ===
//             currentUser.trim().toLowerCase()
//         );

//         setHeaders(headerRow);
//         setRowData(userRows);
//         setLoading(false);
//       })
//       .catch(() => setLoading(false));
//   }, [currentUser]);

//   /* ✅ compute visible column indexes (render-only logic) */
//   const visibleIndexes = headers
//     .map((h, i) => ({
//       name: String(h).trim().toLowerCase(),
//       index: i,
//     }))
//     .filter((h) => VISIBLE_COLUMNS.includes(h.name))
//     .map((h) => h.index);

//   return (
//     <div style={{ padding: "24px" }}>
//       <div
//         style={{
//           background: "#ffffff",
//           borderRadius: "14px",
//           boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
//           overflow: "hidden",
//         }}
//       >
//         <div
//           style={{
//             padding: "18px 24px",
//             fontSize: "20px",
//             fontWeight: "600",
//             borderBottom: "1px solid #eee",
//             background: "#fafafa",
//           }}
//         >
//           📊 My Sales Sheet Data
//         </div>

//         <div style={{ overflowX: "auto" }}>
//           <table
//             style={{
//               width: "100%",
//               borderCollapse: "separate",
//               borderSpacing: "0",
//               fontSize: "15px",
//             }}
//           >
//             <thead>
//               <tr>
//                 {(loading
//                   ? Array.from({
//                       length: VISIBLE_COLUMNS.length,
//                     })
//                   : visibleIndexes
//                 ).map((colIndex, i) => (
//                   <th
//                     key={i}
//                     style={{
//                       position: "sticky",
//                       top: 0,
//                       background: "#f1f5f9",
//                       padding: "16px 20px",
//                       textAlign: "left",
//                       fontWeight: "600",
//                       borderBottom: "2px solid #e5e7eb",
//                       whiteSpace: "nowrap",
//                     }}
//                   >
//                     {loading ? (
//                       <div className="skeleton-box" />
//                     ) : (
//                       headers[colIndex]
//                     )}
//                   </th>
//                 ))}
//               </tr>
//             </thead>

//             <tbody>
//               {loading ? (
//                 Array.from({ length: 5 }).map((_, i) => (
//                   <SkeletonRow
//                     key={i}
//                     cols={VISIBLE_COLUMNS.length}
//                   />
//                 ))
//               ) : rowData.length ? (
//                 rowData.map((row, rowIndex) => (
//                   <tr
//                     key={rowIndex}
//                     onMouseEnter={(e) =>
//                       (e.currentTarget.style.background =
//                         "#f9fafb")
//                     }
//                     onMouseLeave={(e) =>
//                       (e.currentTarget.style.background =
//                         "transparent")
//                     }
//                   >
//                     {visibleIndexes.map((colIndex) => (
//                       <td
//                         key={colIndex}
//                         style={{
//                           padding: "16px 20px",
//                           borderBottom:
//                             "1px solid #f0f0f0",
//                           whiteSpace: "nowrap",
//                           fontWeight: "500",
//                         }}
//                       >
//                         {row[colIndex] ?? "-"}
//                       </td>
//                     ))}
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td
//                     colSpan={VISIBLE_COLUMNS.length}
//                     style={{
//                       padding: "30px",
//                       textAlign: "center",
//                       color: "#999",
//                     }}
//                   >
//                     No data available
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       <style>
//         {`
//           .skeleton-box {
//             height: 18px;
//             width: 100%;
//             border-radius: 6px;
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
//             0% { background-position: 100% 0 }
//             100% { background-position: -100% 0 }
//           }
//         `}
//       </style>
//     </div>
//   );
// };

// export default SheetTable;
import React, { useEffect, useState } from "react";

/* ---------- Skeleton Row ---------- */
const SkeletonRow = ({ cols }) => (
  <tr>
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} style={{ padding: "16px" }}>
        <div className="skeleton-box" />
      </td>
    ))}
  </tr>
);

/* ✅ SELECT ONLY REQUIRED COLUMNS HERE */
const VISIBLE_COLUMNS = [
  "campaign name",
  "commission %",
  "commission $",
  "impressions",
  "clicks",
  "start date",
  "end date",
  "mtd revenue",
  "booked revenue",
  "pacing %",
];

const SheetTable = () => {
  const [rowData, setRowData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL =
    "https://script.google.com/macros/s/AKfycbyaLs2NmfXZt2Kkk651wXsGBos-j3zB0pdqZsjt6mIDT4AGYcbYxpX6g4toHQ2a4sKgyg/exec";

  const jwt = JSON.parse(localStorage.getItem("jwt"));
  const currentUser = jwt?.user?.name;

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    fetch(API_URL)
      .then((res) => res.text())
      .then((text) => {
        const rows = JSON.parse(text);

        const cleanedRows = rows.filter((row) =>
          row.some((cell) => cell !== "")
        );

        const headerIndex = cleanedRows.findIndex((row) =>
          row.some(
            (cell) =>
              String(cell).trim().toLowerCase() === "sales rep"
          )
        );

        const headerRow = cleanedRows[headerIndex];
        const salesRepColIndex = headerRow.findIndex(
          (cell) =>
            String(cell).trim().toLowerCase() === "sales rep"
        );

        const dataRows = cleanedRows.slice(headerIndex + 1);

        const userRows = dataRows.filter(
          (row) =>
            String(row[salesRepColIndex])
              .trim()
              .toLowerCase() ===
            currentUser.trim().toLowerCase()
        );

        setHeaders(headerRow);
        setRowData(userRows);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [currentUser]);

  /* ✅ visible column indexes */
  const visibleIndexes = headers
    .map((h, i) => ({
      name: String(h).trim().toLowerCase(),
      index: i,
    }))
    .filter((h) => VISIBLE_COLUMNS.includes(h.name))
    .map((h) => h.index);

  /* ---------- FORMATTERS ---------- */
  const formatNumber = (num) =>
    Number(num).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const formatInteger = (num) =>
    Number(num).toLocaleString("en-US");

  const formatCell = (value, headerName) => {
    if (value === null || value === undefined || value === "") return "-";

    const h = headerName.toLowerCase();

    /* DATE */
    if (h.includes("date")) {
      const d = new Date(value);
      if (!isNaN(d))
        return d.toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        });
    }

    const raw = String(value).replace(/[$,%]/g, "");
    const num = Number(raw);

    if (!isNaN(num)) {
      /* COMMISSION $ / REVENUE */
      if (h.includes("commission $") || h.includes("revenue")) {
        return `$${formatNumber(num)}`;
      }

      /* PERCENT VALUES */
      if (h.includes("commission %") || h.includes("pacing %")) {
        return `${formatNumber(num)}%`;
      }

      /* IMPRESSIONS / CLICKS */
      if (h.includes("impressions") || h.includes("clicks")) {
        return formatInteger(num);
      }

      /* FALLBACK NUMBER */
      return formatNumber(num);
    }

    return value;
  };

  return (
    <div style={{ padding: "24px" }}>
      <div
        style={{
          background: "#ffffff",
          borderRadius: "14px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "18px 24px",
            fontSize: "20px",
            fontWeight: "600",
            borderBottom: "1px solid #eee",
            background: "#fafafa",
          }}
        >
          📊 My Sales Sheet Data
        </div>

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "separate",
              borderSpacing: "0",
              fontSize: "15px",
            }}
          >
            <thead>
              <tr>
                {(loading
                  ? Array.from({ length: VISIBLE_COLUMNS.length })
                  : visibleIndexes
                ).map((colIndex, i) => (
                  <th
                    key={i}
                    style={{
                      position: "sticky",
                      top: 0,
                      background: "#f1f5f9",
                      padding: "16px 20px",
                      textAlign: "left",
                      fontWeight: "600",
                      borderBottom: "2px solid #e5e7eb",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {loading ? (
                      <div className="skeleton-box" />
                    ) : (
                      headers[colIndex]
                    )}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <SkeletonRow
                    key={i}
                    cols={VISIBLE_COLUMNS.length}
                  />
                ))
              ) : rowData.length ? (
                rowData.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {visibleIndexes.map((colIndex) => (
                      <td
                        key={colIndex}
                        style={{
                          padding: "16px 20px",
                          borderBottom: "1px solid #f0f0f0",
                          whiteSpace: "nowrap",
                          fontWeight: "500",
                        }}
                      >
                        {formatCell(
                          row[colIndex],
                          headers[colIndex]
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={VISIBLE_COLUMNS.length}
                    style={{
                      padding: "30px",
                      textAlign: "center",
                      color: "#999",
                    }}
                  >
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style>
        {`
          .skeleton-box {
            height: 18px;
            width: 100%;
            border-radius: 6px;
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
            0% { background-position: 100% 0 }
            100% { background-position: -100% 0 }
          }
        `}
      </style>
    </div>
  );
};

export default SheetTable;
