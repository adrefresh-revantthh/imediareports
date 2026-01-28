

// // import React, { useEffect, useState } from "react";
// // import axios from "axios";
// // import { useLocation, useNavigate } from "react-router-dom";

// // const containerStyle = {
// //   padding: "30px",
// //   // fontFamily: "Arial, sans-serif",
// //   backgroundColor: "#9cc9f9ff",
// //   // marginLeft:"-15%"
// //   fontSize: "19px",
  
// // };

// // const sheetTitle = {
// //   fontSize: "18px",
// //   fontWeight: "600",
// //   marginBottom: "10px",
// //   marginTop: "25px",
// //   display: "flex",
// //   alignItems: "center",
// //   gap: "6px"
// // };

// // const tableWrapper = {
// //   overflowX: "auto",
// //   marginBottom: "30px",
// // };

// // const tableStyle = {
// //   width: "100%",
// //   borderCollapse: "separate",
// //   borderSpacing: "0",
// //   background: "#fff",
// //   borderRadius: "12px",
// //   overflow: "hidden",
// //   boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
// //   border: "1px solid #dcdcdc",
// // };

// // const thStyle = {
// //   background: "#eef1f5",
// //   padding: "12px",
// //   fontWeight: "bold",
// //   textAlign: "center",
// //   border: "1px solid #d1d1d1",
// //   fontSize: "14px",
// //   fontSize: "19px",
// // };

// // const tdStyle = {
// //   padding: "10px",
// //   textAlign: "center",
// //   border: "1px solid #e0e0e0",
// //   fontSize: "19px",
// //   background: "#fff",
// //   color:"green",
// //   fontWeight:600
// // };

// // const tdAltStyle = {
// //   ...tdStyle,
// //   background: "#fafafa"
// // };

// // const ViewUploads = () => {
// //   const location = useLocation();
// //   const sheetIds = location.state?.sheetIds || [];
// //   const [sheets, setSheets] = useState([]);

// //   const navigate=useNavigate()
// //   useEffect(() => {
// //     if (!sheetIds.length) return;

// //     const fetchSheets = async () => {
// //       try {
// //         const res = await axios.post("http://localhost:5000/api/getsheetsbyids", { sheetIds });
// //         setSheets(res.data);
// //         console.log(res,"sheets");
        
// //       } catch (err) {
// //         console.error(err);
// //       }
// //     };

// //     fetchSheets();
// //   }, [sheetIds]);

// //   const calcRevenue = (imps, clicks, cpm, cpc) => {
// //     if (cpc > 0 && clicks > 0) return clicks * cpc;
// //     if (cpm > 0 && imps > 0) return (imps / 1000) * cpm;
// //     return (imps / 1000) * 1.5;
// //   };

// //   return (
// //     <div style={containerStyle}>
// //       <button
// //   onClick={() => navigate(-1)}
// //   style={{
// //     display: "flex",
// //     alignItems: "center",
// //     gap: "8px",
// //     background: "#01303f",
// //     color: "white",
// //     padding: "10px 16px",
// //     border: "none",
// //     borderRadius: "8px",
// //     cursor: "pointer",
// //     fontSize: "16px",
// //     fontWeight: 600,
// //     marginBottom: "20px",
// //     boxShadow: "0 3px 8px rgba(0,0,0,0.2)",
// //     transition: "0.2s",
// //   }}
// //   onMouseOver={(e) => (e.target.style.background = "#02475c")}
// //   onMouseOut={(e) => (e.target.style.background = "#01303f")}
// // >
// //   <span style={{ fontSize: "20px" }}></span> Back
// // </button>

// //       <h2 style={{ fontWeight: "700", marginBottom: "10px" }}>📊 Campaign Sheets Data</h2>

// //       {sheets.map((sheet, i) => {
// //         const allColumns = new Set();
// //         sheet.data.forEach(row => {
// //           Object.keys(row).forEach(key => allColumns.add(key.trim()));
// //         });
// //         const columns = [...allColumns];

// //         return (
// //           <div key={i}>
// //             <div style={sheetTitle}>📄 {sheet.name || `Sheet ${i + 1}`}</div>

// //             <div style={tableWrapper}>
// //               <table style={tableStyle}>
// //                 <thead>
// //                   <tr>
// //                     {columns.map((col, idx) => (
// //                       <th key={idx} style={thStyle}>{col}</th>
// //                     ))}
// //                     <th style={thStyle}>Revenue ($)</th>
// //                   </tr>
// //                 </thead>

// //                 <tbody>
// //                   {sheet.data.map((row, idx) => {
// //                     const clean = {};
// //                     Object.keys(row).forEach(k => clean[k.trim()] = row[k]);

// //                     const imps = Number(clean.Impressions || 0);
// //                     const clicks = Number(clean.Clicks || 0);
// //                     const cpm = Number(clean.CPM || 0);
// //                     const cpc = Number(clean.CPC || 0);

// //                     const revenue = calcRevenue(imps, clicks, cpm, cpc);

// //                     const rowStyle = idx % 2 === 0 ? tdStyle : tdAltStyle;

// //                     return (
// //                       <tr key={idx}>
// //                         {columns.map((col, cIdx) => (
// //                           <td key={cIdx} style={rowStyle}>
// //                             {clean[col] !== undefined ? clean[col] : "-"}
// //                           </td>
// //                         ))}
// //                         <td style={rowStyle}>${revenue.toFixed(2)}</td>
// //                       </tr>
// //                     );
// //                   })}
// //                 </tbody>
// //               </table>
// //             </div>
// //           </div>
// //         );
// //       })}

// //       {sheets.length === 0 && (
// //         <p>No sheet data found!</p>
// //       )}
// //     </div>
// //   );
// // };

// // export default ViewUploads;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useLocation, useNavigate } from "react-router-dom";

// const containerStyle = {
//   padding: "30px",
//   backgroundColor: "#9cc9f9ff",
//   fontSize: "19px",
// };

// const sheetTitle = {
//   fontSize: "18px",
//   fontWeight: "600",
//   marginBottom: "10px",
//   marginTop: "25px",
//   display: "flex",
//   alignItems: "center",
//   gap: "6px",
// };

// const tableWrapper = {
//   overflowX: "auto",
//   marginBottom: "30px",
// };

// const tableStyle = {
//   width: "100%",
//   borderCollapse: "separate",
//   borderSpacing: "0",
//   background: "#fff",
//   borderRadius: "12px",
//   overflow: "hidden",
//   boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
//   border: "1px solid #dcdcdc",
// };

// const thStyle = {
//   background: "#eef1f5",
//   padding: "12px",
//   fontWeight: "bold",
//   textAlign: "center",
//   border: "1px solid #d1d1d1",
//   fontSize: "19px",
// };

// const tdStyle = {
//   padding: "10px",
//   textAlign: "center",
//   border: "1px solid #e0e0e0",
//   fontSize: "19px",
//   background: "#fff",
//   color: "green",
//   fontWeight: 600,
// };

// const tdAltStyle = {
//   ...tdStyle,
//   background: "#fafafa",
// };

// const ViewUploads = () => {
//   const location = useLocation();
//   const sheetIds = location.state?.sheetIds || [];
//   const [sheets, setSheets] = useState([]);

//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!sheetIds.length) return;

//     const fetchSheets = async () => {
//       try {
//         const res = await axios.post("http://localhost:5000/api/getsheetsbyids", { sheetIds });
//         setSheets(res.data);
//         console.log(res, "Fetched Sheets");
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     fetchSheets();
//   }, [sheetIds]);

//   const calcRevenue = (imps, clicks, cpm, cpc) => {
//     if (cpc > 0 && clicks > 0) return clicks * cpc;
//     if (cpm > 0 && imps > 0) return (imps / 1000) * cpm;
//     return (imps / 1000) * 1.5;
//   };

//   return (
//     <div style={containerStyle}>
//       <button
//         onClick={() => navigate(-1)}
//         style={{
//           display: "flex",
//           alignItems: "center",
//           gap: "8px",
//           background: "#01303f",
//           color: "white",
//           padding: "10px 16px",
//           border: "none",
//           borderRadius: "8px",
//           cursor: "pointer",
//           fontSize: "16px",
//           fontWeight: 600,
//           marginBottom: "20px",
//           boxShadow: "0 3px 8px rgba(0,0,0,0.2)",
//           transition: "0.2s",
//         }}
//         onMouseOver={(e) => (e.target.style.background = "#02475c")}
//         onMouseOut={(e) => (e.target.style.background = "#01303f")}
//       >
//         Back
//       </button>

//       <h2 style={{ fontWeight: "700", marginBottom: "10px" }}>📊 Campaign Sheets Data</h2>

//       {sheets.map((sheet, i) => {
//         // ⭐ CLEAN COLUMN HEADERS
//         const allColumns = new Set();
//         sheet.data.forEach((row) => {
//           Object.keys(row).forEach((key) => {
//             const trimmed = key?.trim();

//             if (
//               !trimmed ||
//               trimmed === "" ||
//               trimmed.startsWith("__EMPTY") ||
//               trimmed.toLowerCase().includes("empty")
//             ) {
//               return;
//             }

//             allColumns.add(trimmed);
//           });
//         });

//         const columns = [...allColumns];

//         return (
//           <div key={i}>
//             <div style={sheetTitle}>📄 {sheet.name || `Sheet ${i + 1}`}</div>

//             <div style={tableWrapper}>
//               <table style={tableStyle}>
//                 <thead>
//                   <tr>
//                     {columns.map((col, idx) => (
//                       <th key={idx} style={thStyle}>{col}</th>
//                     ))}
//                     <th style={thStyle}>Revenue ($)</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {sheet.data.map((row, idx) => {
//                     const clean = {};

//                     // ⭐ CLEAN ROW VALUES
//                     Object.keys(row).forEach((k) => {
//                       const trimmed = k?.trim();
//                       if (
//                         !trimmed ||
//                         trimmed.startsWith("__EMPTY") ||
//                         trimmed.toLowerCase().includes("empty")
//                       ) {
//                         return;
//                       }
//                       clean[trimmed] = row[k];
//                     });

//                     const imps = Number(clean.Impressions || clean.impressions || 0);
//                     const clicks = Number(clean.Clicks || clean.clicks || 0);
//                     const cpm = Number(clean.CPM || clean.cpm || 0);
//                     const cpc = Number(clean.CPC || clean.cpc || 0);

//                     const revenue = calcRevenue(imps, clicks, cpm, cpc);
//                     const rowStyle = idx % 2 === 0 ? tdStyle : tdAltStyle;

//                     return (
//                       <tr key={idx}>
//                         {columns.map((col, cIdx) => (
//                           <td key={cIdx} style={rowStyle}>
//                             {clean[col] !== undefined ? clean[col] : "-"}
//                           </td>
//                         ))}
//                         <td style={rowStyle}>${revenue.toFixed(2)}</td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         );
//       })}

//       {sheets.length === 0 && <p>No sheet data found!</p>}
//     </div>
//   );
// };

// export default ViewUploads;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const containerStyle = {
  padding: "30px",
  backgroundColor: "#9cc9f9ff",
  fontSize: "19px",
};

const sheetTitle = {
  fontSize: "18px",
  fontWeight: "600",
  marginBottom: "10px",
  marginTop: "25px",
  display: "flex",
  alignItems: "center",
  gap: "6px",
};

const tableWrapper = {
  overflowX: "auto",
  marginBottom: "30px",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "separate",
  borderSpacing: "0",
  background: "#fff",
  borderRadius: "12px",
  overflow: "hidden",
  boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
  border: "1px solid #dcdcdc",
};

const thStyle = {
  background: "#eef1f5",
  padding: "12px",
  fontWeight: "bold",
  textAlign: "center",
  border: "1px solid #d1d1d1",
  fontSize: "19px",
};

const tdStyle = {
  padding: "10px",
  textAlign: "center",
  border: "1px solid #e0e0e0",
  fontSize: "19px",
  background: "#fff",
  color: "green",
  fontWeight: 600,
};

const tdAltStyle = {
  ...tdStyle,
  background: "#fafafa",
};

const ViewUploads = () => {
  const location = useLocation();
  const sheetIds = location.state?.sheetIds || [];
  const [sheets, setSheets] = useState([]);
  const [visibleRows, setVisibleRows] = useState({}); // ⭐ track row count per sheet

  const navigate = useNavigate();

  useEffect(() => {
    if (!sheetIds.length) return;

    const fetchSheets = async () => {
      try {
        const res = await axios.post("https://imediareports.onrender.com/api/getsheetsbyids", { sheetIds });
        setSheets(res.data);

        // Initialize row counts: each sheet → first 6 rows visible
        const counts = {};
        res.data.forEach((_, idx) => {
          counts[idx] = 6;
        });
        setVisibleRows(counts);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSheets();
  }, [sheetIds]);

  const calcRevenue = (imps, clicks, cpm, cpc) => {
    if (cpc > 0 && clicks > 0) return clicks * cpc;
    if (cpm > 0 && imps > 0) return (imps / 1000) * cpm;
    return (imps / 1000) * 1.5;
  };

  // ⭐ View More
  const handleViewMore = (sheetIndex) => {
    setVisibleRows((prev) => ({
      ...prev,
      [sheetIndex]: prev[sheetIndex] + 6,
    }));
  };

  // ⭐ View Less → back to first 6 rows
  const handleViewLess = (sheetIndex) => {
    setVisibleRows((prev) => ({
      ...prev,
      [sheetIndex]: 6,
    }));
  };

  return (
    <div style={containerStyle}>
      <button
        onClick={() => navigate(-1)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          background: "#01303f",
          color: "white",
          padding: "10px 16px",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "16px",
          fontWeight: 600,
          marginBottom: "20px",
          boxShadow: "0 3px 8px rgba(0,0,0,0.2)",
        }}
      >
        Back
      </button>

      <h2 style={{ fontWeight: "700", marginBottom: "10px" }}>📊 Campaign Sheets Data</h2>

      {sheets.map((sheet, i) => {
        // ⭐ CLEAN COLUMN HEADERS
        const allColumns = new Set();
        sheet.data.forEach((row) => {
          Object.keys(row).forEach((key) => {
            const trimmed = key?.trim();
            if (!trimmed || trimmed.startsWith("__EMPTY") || trimmed.toLowerCase().includes("empty")) return;
            allColumns.add(trimmed);
          });
        });

        const columns = [...allColumns];
        const rowsToShow = visibleRows[i] || 6;

        return (
          <div key={i}>
            <div style={sheetTitle}>📄 {sheet.name || `Sheet ${i + 1}`}</div>

            <div style={tableWrapper}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    {columns.map((col, idx) => (
                      <th key={idx} style={thStyle}>{col}</th>
                    ))}
                    <th style={thStyle}>Revenue ($)</th>
                  </tr>
                </thead>

                <tbody>
                  {sheet.data.slice(0, rowsToShow).map((row, idx) => {
                    const clean = {};
                    Object.keys(row).forEach((k) => {
                      const trimmed = k?.trim();
                      if (!trimmed || trimmed.startsWith("__EMPTY") || trimmed.toLowerCase().includes("empty")) return;
                      clean[trimmed] = row[k];
                    });

                    const imps = Number(clean.Impressions || clean.impressions || 0);
                    const clicks = Number(clean.Clicks || clean.clicks || 0);
                    const cpm = Number(clean.CPM || clean.cpm || 0);
                    const cpc = Number(clean.CPC || clean.cpc || 0);

                    const revenue = calcRevenue(imps, clicks, cpm, cpc);
                    const rowStyle = idx % 2 === 0 ? tdStyle : tdAltStyle;

                    return (
                      <tr key={idx}>
                        {columns.map((col, cIdx) => (
                          <td key={cIdx} style={rowStyle}>
                            {clean[col] !== undefined ? clean[col] : "-"}
                          </td>
                        ))}
                        <td style={rowStyle}>${revenue.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* ⭐ View More / View Less */}
              <div style={{ textAlign: "center", marginTop: "10px" }}>
                {rowsToShow < sheet.data.length ? (
                  <button
                    onClick={() => handleViewMore(i)}
                    style={{
                      padding: "10px 18px",
                      background: "#01303f",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "16px",
                      fontWeight: 600,
                    }}
                  >
                    View More
                  </button>
                ) : (
                  <button
                    onClick={() => handleViewLess(i)}
                    style={{
                      padding: "10px 18px",
                      background: "#ff4d4f",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "16px",
                      fontWeight: 600,
                    }}
                  >
                    View Less
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {sheets.length === 0 && <p>No sheet data found!</p>}
    </div>
  );
};

export default ViewUploads;
