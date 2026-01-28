

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const containerStyle = {
  padding: "30px",
  // fontFamily: "Arial, sans-serif",
  marginLeft: "-15%",
  display: "flex",
  justifyContent: "center",
};

const cardStyle = {
  width: "70%",
  background: "#fff",
  padding: "25px",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
};

const titleStyle = {
  fontSize: "22px",
  fontWeight: "bold",
  marginBottom: "20px",
  color: "#2c3e50",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "15px",
};

const thStyle = {
  padding: "12px",
  background: "#f1f1f1",
  fontWeight: "600",
  border: "1px solid #ccc",
  textAlign: "center",
};

const tdStyle = {
  padding: "12px",
  border: "1px solid #ddd",
  textAlign: "center",
  fontSize: "15px",
};

const buttonStyle = {
  padding: "6px 14px",
  background: "#2ecc71",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontWeight: "bold",
};

const DownloadSheets = () => {
  const location = useLocation();
  const sheetIds = location.state?.sheetIds || [];

  const [sheets, setSheets] = useState([]);

  useEffect(() => {
    if (!sheetIds.length) return;

    const fetchSheets = async () => {
      try {
        const res = await axios.post("https://imediareports.onrender.com/getsheetsbyids", { sheetIds });
        setSheets(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSheets();
  }, [sheetIds]);

  const downloadSheet = (sheet) => {
    if (!sheet || !sheet.data) return;

    const cleanedData = sheet.data.map(row => {
      const cleanedRow = {};
      Object.keys(row).forEach(k => cleanedRow[k.trim()] = row[k]);
      return cleanedRow;
    });

    const ws = XLSX.utils.json_to_sheet(cleanedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheet.name || "Sheet");

    const fileName = `${sheet.name || "Sheet"}_${Date.now()}.xlsx`;
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([excelBuffer], { type: "application/octet-stream" }), fileName);
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>⬇️ Download Campaign Sheets</h2>

        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Sheet Name</th>
              <th style={thStyle}>Download</th>
            </tr>
          </thead>
          <tbody>
            {sheets.map((sheet, i) => (
              <tr key={i}>
                <td style={tdStyle}>📄 {sheet.name || `Sheet ${i + 1}`}</td>
                <td style={tdStyle}>
                  <button style={buttonStyle} onClick={() => downloadSheet(sheet)}>
                    Download Excel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {sheets.length === 0 && <p>No sheet data found!</p>}
      </div>
    </div>
  );
};

export default DownloadSheets;
