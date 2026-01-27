import React, { useState, useContext } from "react";
import * as XLSX from "xlsx";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  Line,
} from "recharts";
import { ThemeContext } from "./ThemeSettings/ThemeContext";

const DailyReports = () => {
  const { theme } = useContext(ThemeContext);
  const [sections, setSections] = useState([]);
  const [fileName, setFileName] = useState("");

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const workbook = XLSX.read(event.target.result, { type: "array" });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

      const splitSections = [];
      const colCount = data[0].length;
      let startCol = 0;

      while (startCol < colCount) {
        while (
          startCol < colCount &&
          !data.some((row) => row[startCol] && row[startCol].toString().trim() !== "")
        ) {
          startCol++;
        }
        if (startCol >= colCount) break;

        let endCol = startCol;
        while (
          endCol + 1 < colCount &&
          data.some((row) => row[endCol + 1] && row[endCol + 1].toString().trim() !== "")
        ) {
          endCol++;
        }

        const block = data.map((row) => row.slice(startCol, endCol + 1));
        const nonEmptyRows = block.filter((r) => r.some((c) => c && c !== "-"));

        if (nonEmptyRows.length > 3) {
          const [titleRow, headerRow, ...bodyRows] = nonEmptyRows;
          const title = titleRow[0] || `Section ${splitSections.length + 1}`;
          const headers = headerRow || [];

          const records = bodyRows
            .map((r) =>
              Object.fromEntries(headers.map((h, i) => [h || `Col${i + 1}`, r[i]]))
            )
            .filter((row) =>
              Object.values(row).some(
                (v) => v && v !== "-" && v.toString().trim() !== ""
              )
            );

          if (records.length >= 3) {
            splitSections.push({ title, data: records });
          }
        }

        startCol = endCol + 2;
      }

      setSections(splitSections);
    };

    reader.readAsArrayBuffer(file);
  };

  const colors = {
    bg: theme === "dark"
      ? "linear-gradient(135deg,#0f172a,#1e293b)"
      : "linear-gradient(135deg,#f8fafc,#e0f2fe)",
    cardBg: theme === "dark" ? "rgba(30,41,59,0.8)" : "#ffffff",
    text: theme === "dark" ? "#e2e8f0" : "#0f172a",
    border: theme === "dark" ? "#334155" : "#cbd5e1",
  };

  const getNumericKeys = (data) => {
    if (!data || !data.length) return [];
    const keys = Object.keys(data[0]);
    return keys.filter(
      (key) =>
        !isNaN(parseFloat(data[0][key])) &&
        data[0][key] !== "" &&
        key.toLowerCase() !== "date"
    );
  };

  const chartableSections = sections.filter((section) => {
    const numericKeys = getNumericKeys(section.data);
    return numericKeys.length >= 2;
  });

  return (
    <div
      style={{
        background: colors.bg,
        color: colors.text,
        padding: "2rem 3rem",
        fontFamily: "Poppins, sans-serif",
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      <div style={{ maxWidth: "1300px", margin: "0 auto" }}>
        <h2
          style={{
            textAlign: "center",
            fontWeight: 700,
            fontSize: "2rem",
            marginBottom: "2rem",
            background: "linear-gradient(90deg,#06b6d4,#8b5cf6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          📅 Daily Report Sections
        </h2>

        {/* Upload */}
        <div
          style={{
            background: colors.cardBg,
            border: `2px dashed ${colors.border}`,
            padding: "2rem",
            borderRadius: "16px",
            textAlign: "center",
            marginBottom: "3rem",
            boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
          }}
        >
          <input
            type="file"
            accept=".xlsx, .xls"
            id="fileUpload"
            onChange={handleFileUpload}
            style={{ display: "none" }}
          />
          <label
            htmlFor="fileUpload"
            style={{
              display: "inline-block",
              background: "linear-gradient(90deg,#06b6d4,#3b82f6)",
              color: "#fff",
              padding: "12px 28px",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "1rem",
              transition: "0.3s ease",
            }}
          >
            📁 Upload Excel File
          </label>
          {fileName && (
            <p style={{ marginTop: "10px", opacity: 0.8 }}>
              Loaded File: <b>{fileName}</b>
            </p>
          )}
        </div>

        {chartableSections.length === 0 && fileName && (
          <p style={{ textAlign: "center", opacity: 0.7 }}>
            ⚠️ No sections with valid chart data found.
          </p>
        )}

        {/* Section Data */}
        {chartableSections.map((section, index) => {
          const numericKeys = getNumericKeys(section.data);
          return (
            <div
              key={index}
              style={{
                background: colors.cardBg,
                padding: "2rem",
                borderRadius: "16px",
                marginBottom: "3rem",
                boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
                border: `1px solid ${colors.border}`,
              }}
            >
              <h3
                style={{
                  textAlign: "center",
                  marginBottom: "1.5rem",
                  fontSize: "1.4rem",
                  fontWeight: "600",
                  color: theme === "dark" ? "#93c5fd" : "#1e3a8a",
                }}
              >
                📄 {section.title}
              </h3>

              {/* Table */}
              <div style={{ overflowX: "auto", marginBottom: "2rem" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: "14px",
                  }}
                >
                  <thead>
                    <tr>
                      {Object.keys(section.data[0]).map((key, i) => (
                        <th
                          key={i}
                          style={{
                            background: theme === "dark" ? "#1e3a8a" : "#bae6fd",
                            color: theme === "dark" ? "#f8fafc" : "#0c4a6e",
                            padding: "10px",
                            borderBottom: `2px solid ${colors.border}`,
                            textAlign: "left",
                          }}
                        >
                          {key.toUpperCase()}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {section.data.slice(0, 20).map((row, rowIndex) => (
                      <tr
                        key={rowIndex}
                        style={{
                          background:
                            rowIndex % 2 === 0
                              ? theme === "dark"
                                ? "#0f172a"
                                : "#f0f9ff"
                              : "transparent",
                        }}
                      >
                        {Object.values(row).map((val, colIndex) => (
                          <td
                            key={colIndex}
                            style={{
                              padding: "8px 10px",
                              borderBottom: `1px solid ${colors.border}`,
                            }}
                          >
                            {val ?? "-"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Chart */}
              <div style={{ height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={section.data.slice(0, 15)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#64748b" />
                    <XAxis dataKey={Object.keys(section.data[0])[0]} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey={numericKeys[0]}
                      fill="#14b8a6"
                      name={numericKeys[0]}
                    />
                    <Line
                      type="monotone"
                      dataKey={numericKeys[1]}
                      stroke="#3b82f6"
                      strokeWidth={2}
                      name={numericKeys[1]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DailyReports;
