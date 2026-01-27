
import React, { useState } from "react";
import * as XLSX from "xlsx";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  Tooltip,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const COLORS = {
  impressions: "#007bff",
  clicks: "#28a745",
  ctr: "#ff9800",
  spend: "#9c27b0",
};

// Convert Excel serial to dd-mm-yyyy
const excelDateToJSDate = (serial) => {
  if (typeof serial === "number") {
    const utc_days = Math.floor(serial - 25569);
    const date = new Date(utc_days * 86400 * 1000);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }
  return serial;
};

const cardStyle = {
  background: "white",
  padding: "15px",
  borderRadius: "10px",
  boxShadow: "0 5px 8px rgba(0,0,0,0.1)",
  textAlign: "center",
  minWidth: "140px",
};

const formatCompact = (num) => {
  if (Math.abs(num) >= 1000) {
    return (num / 1000).toFixed(num >= 10000 ? 0 : 1) + "K";
  }
  return num.toString();
};

const ReportCard = ({ title, data }) => {
  // Summary metrics
  const totalImpressions = data.reduce((s, d) => s + (d.Impressions || 0), 0);
  const totalClicks = data.reduce((s, d) => s + (d.Clicks || 0), 0);
  const totalSpend = data.reduce((s, d) => s + (d.Spend || 0), 0);
  const avgCTR = data.length ? data.reduce((s, d) => s + (d.CTR || 0), 0) / data.length : 0;
  const avgImpressions = data.length ? totalImpressions / data.length : 0;
  const avgSpend = data.length ? totalSpend / data.length : 0;
  const peakImpressions = Math.max(...data.map((d) => d.Impressions || 0), 0);
  const peakClicks = Math.max(...data.map((d) => d.Clicks || 0), 0);

  // Keep raw data unchanged — use dual axes for visibility
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        padding: 20,
        flex: "1 1 480px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        marginBottom: 20,
        minWidth: 360,
      }}
    >
      <h2 style={{ textAlign: "center", color: "#222" }}>{title}</h2>

      {/* small KPI cards */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginBottom: 18 }}>
        <div style={cardStyle}>
          <h4 style={{ color: COLORS.impressions }}>Total Impressions</h4>
          <h2>{totalImpressions.toLocaleString()}</h2>
          <div style={{ fontSize: 12, color: "#666" }}>Peak: {peakImpressions.toLocaleString()}</div>
        </div>

        <div style={cardStyle}>
          <h4 style={{ color: COLORS.clicks }}>Total Clicks</h4>
          <h2>{totalClicks.toLocaleString()}</h2>
          <div style={{ fontSize: 12, color: "#666" }}>Peak: {peakClicks.toLocaleString()}</div>
        </div>

        <div style={cardStyle}>
          <h4 style={{ color: COLORS.ctr }}>Avg CTR</h4>
          <h2>{avgCTR.toFixed(2)}%</h2>
          <div style={{ fontSize: 12, color: "#666" }}>Mean per day</div>
        </div>

        <div style={cardStyle}>
          <h4 style={{ color: COLORS.spend }}>Avg Spend</h4>
          <h2>${avgSpend.toFixed(2)}</h2>
          <div style={{ fontSize: 12, color: "#666" }}>Total ${totalSpend.toFixed(2)}</div>
        </div>

        <div style={cardStyle}>
          <h4 style={{ color: "#666" }}>Avg Impr / Day</h4>
          <h2>{Math.round(avgImpressions).toLocaleString()}</h2>
          <div style={{ fontSize: 12, color: "#666" }}>{data.length} days</div>
        </div>
      </div>

      {/* Impressions (left) vs Clicks (right) - dual Y axis */}
      <div style={{ marginBottom: 18 }}>
        <h4>📊 Impressions vs Clicks</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="Date"
              tick={{ fontSize: 12, fill: "#333" }}
              interval={Math.max(0, Math.floor(data.length / 10))}
            />
            <YAxis
              yAxisId="left"
              tickFormatter={formatCompact}
              label={{ value: "Impr", angle: -90, position: "insideLeft", offset: 8 }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickFormatter={formatCompact}
              label={{ value: "Clicks", angle: 90, position: "insideRight", offset: 8 }}
              domain={[0, (dataMax) => Math.max(dataMax, 5)]}
            />
            <Tooltip
              formatter={(value, name) => {
                if (name === "Clicks") return [value.toLocaleString(), name];
                if (name === "Impressions") return [value.toLocaleString(), name];
                return [value, name];
              }}
            />
            <Legend />
            <Bar yAxisId="left" dataKey="Impressions" fill={COLORS.impressions} barSize={18} />
            {/* plot clicks on right axis; set smaller barSize so both visible */}
            <Bar yAxisId="right" dataKey="Clicks" fill={COLORS.clicks} barSize={8} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* CTR trend */}
      <div>
        <h4>📈 CTR Trend (%)</h4>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="Date" tick={{ fontSize: 12 }} interval={Math.max(0, Math.floor(data.length / 10))} />
            <YAxis />
            <Tooltip formatter={(v) => `${v.toFixed(2)}%`} />
            <Legend />
            <Line type="monotone" dataKey="CTR" stroke={COLORS.ctr} strokeWidth={3} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* table */}
      <div style={{ marginTop: 18, background: "#fafafa", borderRadius: 8, padding: 10 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#007bff", color: "#fff" }}>
              <th style={{ padding: 8, border: "1px solid #ddd", textAlign: "left" }}>Date</th>
              <th style={{ padding: 8, border: "1px solid #ddd", textAlign: "right" }}>Impressions</th>
              <th style={{ padding: 8, border: "1px solid #ddd", textAlign: "right" }}>Clicks</th>
              <th style={{ padding: 8, border: "1px solid #ddd", textAlign: "right" }}>CTR (%)</th>
              <th style={{ padding: 8, border: "1px solid #ddd", textAlign: "right" }}>Spend ($)</th>
            </tr>
          </thead>
          <tbody>
            {data.map((r, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#fffaf0" }}>
                <td style={{ padding: 8, border: "1px solid #eee" }}>{r.Date}</td>
                <td style={{ padding: 8, border: "1px solid #eee", textAlign: "right" }}>
                  {r.Impressions.toLocaleString()}
                </td>
                <td style={{ padding: 8, border: "1px solid #eee", textAlign: "right" }}>
                  {r.Clicks.toLocaleString()}
                </td>
                <td style={{ padding: 8, border: "1px solid #eee", textAlign: "right" }}>
                  {Number(r.CTR).toFixed(2)}%
                </td>
                <td style={{ padding: 8, border: "1px solid #eee", textAlign: "right" }}>
                  {r.Spend !== undefined ? `$${Number(r.Spend).toFixed(2)}` : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default function DisplayAndGenealogyReport() {
  const [displayData, setDisplayData] = useState([]);
  const [genealogyData, setGenealogyData] = useState([]);

  const parseExcel = (file, setState) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const wb = XLSX.read(e.target.result, { type: "array" });
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet, { defval: "" });

      const formatted = json.map((row) => ({
        Date: excelDateToJSDate(row.Date),
        Impressions: parseFloat(String(row.Impressions || row.Impr || 0).replace(/,/g, "")) || 0,
        Clicks: parseFloat(String(row.Clicks || 0).replace(/,/g, "")) || 0,
        CTR: parseFloat(String(row.CTR || "").replace("%", "")) || 0,
        Spend:
          row.Spend !== undefined
            ? parseFloat(String(row.Spend).replace(/[^0-9.-]+/g, "")) || 0
            : undefined,
      }));

      setState(formatted);
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div style={{ padding: "20px", backgroundColor: "#f4f6f9", fontFamily: "Segoe UI, sans-serif" }}>
      <h1 style={{ textAlign: "center", marginBottom: 24 }}>📈 Display Retargeting vs Genealogy Segment</h1>

      <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 18, flexWrap: "wrap" }}>
        <div>
          <label style={{ display: "block", marginBottom: 8 }}>📂 Upload Display Retargeting</label>
          <input type="file" accept=".xlsx,.xls,.csv" onChange={(e) => parseExcel(e.target.files[0], setDisplayData)} />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: 8 }}>📂 Upload Genealogy Segment</label>
          <input type="file" accept=".xlsx,.xls,.csv" onChange={(e) => parseExcel(e.target.files[0], setGenealogyData)} />
        </div>
      </div>

      <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center" }}>
        {displayData.length > 0 && <ReportCard title="📊 Display Retargeting" data={displayData} />}
        {genealogyData.length > 0 && <ReportCard title="🧬 Genealogy Segment" data={genealogyData} />}
      </div>
    </div>
  );
}
