import React, { useState, useContext, useEffect } from "react";
import * as XLSX from "xlsx";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { ThemeContext } from "./ThemeSettings/ThemeContext";

const COLORS = ["#14b8a6", "#3b82f6", "#f97316", "#ec4899", "#8b5cf6", "#22c55e"];

const normalizeKey = (key = "") =>
  key.toString().trim().toLowerCase().replace(/\s+/g, "_").replace(/[^\w]/g, "");

const findFieldKey = (keys, terms) =>
  keys.find((key) => terms.some((t) => key.includes(t))) || null;

const AdvertisementDisplayData = () => {
  const { theme } = useContext(ThemeContext);
  const [collapsed, setCollapsed] = useState(false);
  const [sheetsData, setSheetsData] = useState([]);
  const [overallStats, setOverallStats] = useState(null);
  const [fileName, setFileName] = useState("");

  const colors = {
    bg: theme === "dark"
      ? "linear-gradient(135deg,#0f172a,#1e293b)"
      : "linear-gradient(135deg,#f0f9ff,#e0f2fe)",
    sidebar: theme === "dark"
      ? "linear-gradient(180deg,#1e293b,#0f172a)"
      : "linear-gradient(180deg,#e0f2fe,#bae6fd)",
    text: theme === "dark" ? "#e2e8f0" : "#0f172a",
    cardBg: theme === "dark" ? "rgba(30,41,59,0.8)" : "#ffffffd9",
    border: theme === "dark" ? "#334155" : "#cbd5e1",
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const workbook = XLSX.read(evt.target.result, { type: "array" });
      const parsedSheets = [];
      let totalViews = 0,
        totalClicks = 0,
        totalSpend = 0,
        totalCTR = 0,
        sheetCount = 0;

      workbook.SheetNames.forEach((sheetName) => {
        const sheet = workbook.Sheets[sheetName];
        const raw = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
        if (!raw || raw.length === 0) return;

        let headerIndex = raw.findIndex(
          (row, i) =>
            row.filter((c) => c && c.toString().trim() !== "").length >= 2 &&
            raw[i + 1] &&
            raw[i + 1].some((c) => !isNaN(c) && c !== "")
        );
        if (headerIndex === -1) headerIndex = 0;

        const headerRow = raw[headerIndex].map(normalizeKey);
        const dataRows = raw.slice(headerIndex + 1);
        const jsonData = dataRows
          .map((row) => {
            const obj = {};
            headerRow.forEach((h, i) => (obj[h] = row[i]));
            return obj;
          })
          .filter((r) => Object.values(r).some((v) => v && v.toString().trim() !== ""));
        if (jsonData.length === 0) return;

        const keys = Object.keys(jsonData[0]);
        const impressionsKey =
          findFieldKey(keys, ["impression", "view", "impr", "delivery"]) || keys[1];
        const clicksKey = findFieldKey(keys, ["click"]) || keys[2];
        const spendKey = findFieldKey(keys, ["spend", "cost", "budget"]) || keys[3];
        const ctrKey = findFieldKey(keys, ["ctr", "click_through"]) || null;
        const dateKey = findFieldKey(keys, ["date", "day", "time"]) || keys[0];

        let sheetViews = 0,
          sheetClicks = 0,
          sheetSpend = 0,
          sheetCtrSum = 0,
          ctrCount = 0;

        const normalizedData = jsonData.map((row) => {
          const impressions = parseFloat(row[impressionsKey]) || 0;
          const clicks = parseFloat(row[clicksKey]) || 0;
          const spend = parseFloat(row[spendKey]) || 0;
          let ctr = row[ctrKey] ? parseFloat(row[ctrKey]) : 0;
          if (!ctr || isNaN(ctr)) ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;

          sheetViews += impressions;
          sheetClicks += clicks;
          sheetSpend += spend;
          if (ctr > 0) {
            sheetCtrSum += ctr;
            ctrCount++;
          }

          return {
            date: row[dateKey],
            impressions,
            clicks,
            spend,
            ctr: parseFloat(ctr.toFixed(2)),
          };
        });

        const avgCTR = ctrCount > 0 ? sheetCtrSum / ctrCount : 0;

        totalViews += sheetViews;
        totalClicks += sheetClicks;
        totalSpend += sheetSpend;
        totalCTR += avgCTR;
        sheetCount++;

        parsedSheets.push({
          name: sheetName,
          data: normalizedData,
          totals: {
            views: sheetViews,
            clicks: sheetClicks,
            avgCTR: avgCTR.toFixed(2),
            spend: sheetSpend,
          },
        });
      });

      setOverallStats({
        totalViews,
        totalClicks,
        totalSpend,
        avgCTR: sheetCount > 0 ? (totalCTR / sheetCount).toFixed(2) : 0,
      });
      setSheetsData(parsedSheets);
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: collapsed ? "70px" : "240px",
          background: colors.sidebar,
          color: colors.text,
          padding: "1.5rem 1rem",
          display: "flex",
          flexDirection: "column",
          transition: "0.3s",
          boxShadow: "4px 0 10px rgba(0,0,0,0.2)",
          position: "sticky",
          top: 0,
          height: "100vh",
        }}
      >
        <h3
          style={{
            textAlign: "center",
            fontSize: collapsed ? "1.2rem" : "1.5rem",
            marginBottom: "1rem",
            background: "linear-gradient(90deg,#06b6d4,#8b5cf6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            transition: "0.3s",
          }}
        >
          {collapsed ? "📊" : "Ad Panel"}
        </h3>

        <nav style={{ flexGrow: 1 }}>
          {["Dashboard", "Reports", "Analytics", "Upload", "Settings"].map(
            (item, index) => (
              <div
                key={index}
                style={{
                  padding: "10px 16px",
                  borderRadius: "8px",
                  margin: "6px 0",
                  cursor: "pointer",
                  background:
                    index === 0
                      ? "linear-gradient(90deg,#06b6d4,#3b82f6)"
                      : "transparent",
                  color: index === 0 ? "#fff" : colors.text,
                  fontWeight: 500,
                  fontSize: "0.95rem",
                  textAlign: collapsed ? "center" : "left",
                  transition: "0.3s",
                }}
              >
                {collapsed ? item[0] : item}
              </div>
            )
          )}
        </nav>

        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            marginTop: "auto",
            background: "none",
            border: "none",
            color: colors.text,
            cursor: "pointer",
            fontSize: "1rem",
          }}
        >
          {collapsed ? "➡️" : "⬅️ Collapse"}
        </button>
      </aside>

      {/* Main content */}
      <main
        style={{
          flexGrow: 1,
          overflowY: "auto",
          padding: "2rem",
          background: colors.bg,
          color: colors.text,
        }}
      >
        <h2
          style={{
            textAlign: "center",
            fontSize: "2rem",
            fontWeight: 700,
            marginBottom: "2rem",
            background: "linear-gradient(90deg,#06b6d4,#8b5cf6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          📈 Advertiser Performance Dashboard
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
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
            backdropFilter: "blur(12px)",
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

        {/* Summary + Sheets */}
        {overallStats && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
              gap: "1.5rem",
              marginBottom: "2rem",
            }}
          >
            <SummaryCard label="👁️ Total Views" value={overallStats.totalViews} />
            <SummaryCard label="🖱️ Total Clicks" value={overallStats.totalClicks} />
            <SummaryCard label="📈 Avg CTR" value={`${overallStats.avgCTR}%`} />
            <SummaryCard
              label="💰 Total Spend"
              value={`$${overallStats.totalSpend.toLocaleString()}`}
            />
          </div>
        )}

        {sheetsData.map((sheet, i) => (
          <div
            key={i}
            style={{
              background: colors.cardBg,
              color: colors.text,
              padding: "2rem",
              borderRadius: "16px",
              marginBottom: "3rem",
              boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
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
              📄 {sheet.name}
            </h3>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "1rem",
                marginBottom: "1.5rem",
              }}
            >
              <MiniCard title="👁️ Views" value={sheet.totals.views} />
              <MiniCard title="🖱️ Clicks" value={sheet.totals.clicks} />
              <MiniCard title="📈 Avg CTR" value={`${sheet.totals.avgCTR}%`} />
              <MiniCard
                title="💰 Spend"
                value={`$${sheet.totals.spend.toLocaleString()}`}
              />
            </div>

            <div style={{ height: 320, marginBottom: "2rem" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sheet.data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#64748b" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="impressions" fill="#14b8a6" name="Views" />
                  <Bar dataKey="spend" fill="#f59e0b" name="Spend" />
                  <Line
                    type="monotone"
                    dataKey="clicks"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="Clicks"
                  />
                  <Line
                    type="monotone"
                    dataKey="ctr"
                    stroke="#ec4899"
                    strokeWidth={2}
                    name="CTR (%)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

// Cards
const SummaryCard = ({ label, value }) => (
  <div
    style={{
      background: "linear-gradient(135deg,#06b6d4,#3b82f6)",
      borderRadius: "16px",
      padding: "1.5rem",
      textAlign: "center",
      color: "#fff",
      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    }}
  >
    <b>{label}</b>
    <div style={{ fontSize: "1.3rem", fontWeight: 600, marginTop: 8 }}>{value}</div>
  </div>
);

const MiniCard = ({ title, value }) => (
  <div
    style={{
      background: "linear-gradient(135deg,#14b8a6,#22c55e)",
      color: "#fff",
      padding: "10px 20px",
      borderRadius: "12px",
      fontWeight: 500,
      boxShadow: "0 3px 6px rgba(0,0,0,0.15)",
    }}
  >
    {title}: <b>{value}</b>
  </div>
);

export default AdvertisementDisplayData;
