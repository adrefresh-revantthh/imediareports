

import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MainDashboard = () => {
  const [sheets, setSheets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("jwt");
    if (!stored) {
      console.warn("⚠️ No JWT found in localStorage");
      return;
    }
    const tokenData = JSON.parse(stored);
    console.log("✅ Loaded token:", tokenData.token);
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const stored = localStorage.getItem("jwt");
    if (!stored) {
      alert("User not authenticated. Please login again.");
      navigate("/login");
      return;
    }

    const { token } = JSON.parse(stored);
    if (!token) {
      alert("Invalid token. Please login again.");
      navigate("/login");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      // ✅ Parse up to 10 worksheets only
      const parsedSheets = workbook.SheetNames.slice(0, 10).map((sheetName) => {
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: "" });
        return { name: sheetName, data: jsonData };
      });

      setSheets(parsedSheets);

      try {
        // ✅ Send to backend with Bearer token
        const res = await axios.post(
          "http://localhost:5000/api/upload",
          { sheets: parsedSheets },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("✅ Uploaded successfully:", res.data);
        navigate("/upload");
      } catch (err) {
        console.error("❌ Upload failed:", err.response?.data || err.message);
        alert("Upload failed. Check console for details.");
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleReset = () => setSheets([]);

  return (
    <div style={styles.container}>
      <div style={styles.uploadBox}>
        <h2>📂 Upload Excel File (up to 10 Worksheets)</h2>
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
          style={styles.input}
        />

        {sheets.length > 0 && (
          <>
            <p style={styles.infoText}>
              ✅ Detected {sheets.length} sheet{ sheets.length > 1 ? "s" : "" }:
              {" "}
              {sheets.map((s) => s.name).join(", ")}
            </p>
            <button onClick={handleReset} style={styles.resetButton}>
              Clear Dashboard
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "25px",
    // fontFamily: "Segoe UI, sans-serif",
    backgroundColor: "#f4f6f9",
    minHeight: "100vh",
  },
  uploadBox: {
    textAlign: "center",
    background: "white",
    borderRadius: "10px",
    padding: "25px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    marginBottom: "30px",
  },
  input: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    cursor: "pointer",
    marginRight: "10px",
  },
  resetButton: {
    backgroundColor: "#ff5b5b",
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "6px",
    cursor: "pointer",
    marginTop: "15px",
  },
  infoText: {
    marginTop: "15px",
    color: "#333",
    fontSize: "14px",
  },
};

export default MainDashboard;
