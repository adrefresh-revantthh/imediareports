// UploadSheet.js
import React from "react";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";

export default function UploadSheet() {
  const navigate = useNavigate();

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const workbook = XLSX.read(event.target.result, { type: "array" });
      const allSheets = {};

      workbook.SheetNames.forEach((sheetName) => {
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        allSheets[sheetName] = jsonData;
      });

      navigate("/dashboard", { state: { allSheets } });
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div style={styles.container}>
      <h1>📊 Upload Excel File (with Multiple Worksheets)</h1>
      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileUpload}
        style={styles.input}
      />
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    background: "#f5f7fa",
    // fontFamily: "Segoe UI, sans-serif",
  },
  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    background: "#fff",
    cursor: "pointer",
    marginTop: "15px",
  },
};
