
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

/* ================= HELPERS ================= */

const toNumber = (v) => {
  const n = parseFloat(v);
  return isNaN(n) ? 0 : n;
};

/* 🔥 UNIVERSAL DATE PARSER */
const parseDate = (value) => {
  if (!value) return null;

  // Excel serial
  if (typeof value === "number") {
    const epoch = new Date(Date.UTC(1899, 11, 30));
    return new Date(epoch.getTime() + value * 86400000);
  }

  if (typeof value === "string") {
    const cleaned = value.trim();

    const iso = new Date(cleaned);
    if (!isNaN(iso.getTime())) return iso;

    const parts = cleaned.split(/[-/]/);
    if (parts.length === 3) {
      const [d, m, y] = parts;
      const parsed = new Date(`${y}-${m}-${d}`);
      if (!isNaN(parsed.getTime())) return parsed;
    }
  }

  return null;
};

const COLORS = ["#007bff", "#ff4d4f", "#28a745"];

/* ================= DASHBOARD ================= */

const Dashboard = () => {
  const [totals, setTotals] = useState({
    impressions: 0,
    clicks: 0,
    ctr: "0.00",
    cpm: "0.00",
    spend: "0.00",
  });

  const [pieData, setPieData] = useState([]);
  const [last7Days, setLast7Days] = useState([]);

  const [datePreset, setDatePreset] = useState("lastweek");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  /* ================= DATE PRESETS ================= */

  const applyPreset = (preset) => {
    const today = new Date();
    let from, to;

    if (preset === "yesterday") {
      from = new Date(today);
      from.setDate(today.getDate() - 1);
      to = new Date(from);
    }

    if (preset === "lastweek") {
      to = new Date(today);
      from = new Date(today);
      from.setDate(today.getDate() - 7);
    }

    if (preset === "lastmonth") {
      to = new Date(today);
      from = new Date(today);
      from.setMonth(today.getMonth() - 1);
    }

    setCustomFrom(from.toISOString().slice(0, 10));
    setCustomTo(to.toISOString().slice(0, 10));
  };

  useEffect(() => {
    if (datePreset !== "custom") applyPreset(datePreset);
  }, [datePreset]);

  /* ================= FETCH ================= */

  useEffect(() => {
    if (!customFrom || !customTo) return;

    const fetchData = async () => {
      try {
        const jwt = JSON.parse(localStorage.getItem("jwt"));
        const token = jwt?.token;
        if (!token) return;

        const res = await axios.get(
          "https://imediareports.onrender.com/api/getallsheets",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        /* ===== SAFE SHEETS ===== */
        const allSheets = res.data
console.log(allSheets,"sheets");

        /* ===== ONLY OTT VIDEO ADWIDGET ===== */
        const sheets = allSheets.filter((s) => {
          const type =
            s.name ||
            s.sheetName ||
            s.category ||
            s.type ||
            "";
          const lower = type.toLowerCase();

          return (
            lower.includes("ott") ||
            lower.includes("video") ||
            lower.includes("adwidget")
          );
        });

        const from = new Date(customFrom);
        const to = new Date(customTo);

        let impressions = 0;
        let clicks = 0;
        let spend = 0;

        const adTypeMap = { ott: 0, video: 0, adwidget: 0 };
        const last7Map = {};

        const today = new Date();
        const last7Start = new Date();
        last7Start.setDate(today.getDate() - 7);

        sheets.forEach((sheet) => {
          const adType = (sheet.name || "").toLowerCase();

          (sheet.data || []).forEach((row) => {
            const e = {};
            Object.keys(row).forEach(
              (k) => (e[k.trim().toLowerCase()] = row[k])
            );

            /* 🔥 ROBUST DATE */
            const d = parseDate(
              e.date ||
                e.day ||
                e.reportdate ||
                e.report_date ||
                e["report date"] ||
                e["date"]
            );

            if (!d) return;

            const rowDate = new Date(d.toDateString());
            const fromDate = new Date(from.toDateString());
            const toDate = new Date(to.toDateString());

            if (rowDate < fromDate || rowDate > toDate) return;

            const imp = toNumber(
              e.impressions ||
                e.impression ||
                e["total impressions"]
            );

            const clk = toNumber(
              e.clicks ||
                e.click ||
                e["total clicks"]
            );

            const cpm = toNumber(e.cpm);
            const cpc = toNumber(e.cpc);

            impressions += imp;
            clicks += clk;

            let rowSpend = 0;
            if (cpc > 0) rowSpend = clk * cpc;
            else if (cpm > 0) rowSpend = (imp / 1000) * cpm;

            spend += rowSpend;

            if (adTypeMap[adType] !== undefined)
              adTypeMap[adType] += imp;

            /* LAST 7 DAYS */
            if (rowDate >= last7Start && rowDate <= today) {
              const key = rowDate.toISOString().slice(0, 10);
              last7Map[key] ??= { impressions: 0, clicks: 0 };
              last7Map[key].impressions += imp;
              last7Map[key].clicks += clk;
            }
          });
        });

        /* PIE */
        const pie = Object.keys(adTypeMap).map((k) => ({
          name: k.toUpperCase(),
          value: adTypeMap[k],
        }));

        /* LAST 7 */
        const last7 = Object.keys(last7Map)
          .sort()
          .map((d) => ({
            date: d,
            impressions: last7Map[d].impressions,
            clicks: last7Map[d].clicks,
          }));

        const ctr =
          impressions > 0
            ? ((clicks / impressions) * 100).toFixed(2)
            : "0.00";

        const cpm =
          impressions > 0
            ? ((spend / impressions) * 1000).toFixed(2)
            : "0.00";

        setTotals({
          impressions,
          clicks,
          ctr,
          cpm,
          spend: spend.toFixed(2),
        });

        setPieData(pie);
        setLast7Days(last7);
      } catch (err) {
        console.error("Advertiser dashboard error:", err);
      }
    };

    fetchData();
  }, [customFrom, customTo]);

  /* ================= UI ================= */

  return (
    <div style={{ padding: 24, background: "#f9fafb" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <h2>📊 Advertiser Dashboard</h2>

        {/* DATE FILTER */}
        <div>
          <select
            value={datePreset}
            onChange={(e) => setDatePreset(e.target.value)}
          >
            <option value="yesterday">Yesterday</option>
            <option value="lastweek">Last 7 Days</option>
            <option value="lastmonth">Last Month</option>
            <option value="custom">Custom</option>
          </select>

          {datePreset === "custom" && (
            <>
              <input
                type="date"
                value={customFrom}
                onChange={(e) => setCustomFrom(e.target.value)}
              />
              <input
                type="date"
                value={customTo}
                onChange={(e) => setCustomTo(e.target.value)}
              />
            </>
          )}
        </div>
      </div>

      {/* SUMMARY */}
      <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
        <Card title="Impressions" value={totals.impressions} />
        <Card title="Clicks" value={totals.clicks} />
        <Card title="CTR %" value={totals.ctr} />
        <Card title="CPM $" value={totals.cpm} />
        <Card title="Spend $" value={totals.spend} />
      </div>

      {/* CHARTS */}
      <div style={{ display: "flex", gap: 20 }}>
        <div style={{ flex: 1, background: "#fff", padding: 20 }}>
          <h3>Impressions by AdType</h3>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie data={pieData} dataKey="value" outerRadius={110}>
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div style={{ flex: 2, background: "#fff", padding: 20 }}>
          <h3>Last 7 Days Performance</h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={last7Days}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="impressions" fill="#007bff" />
              <Line dataKey="clicks" stroke="#ff4d4f" strokeWidth={3} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const Card = ({ title, value }) => (
  <div
    style={{
      background: "#fff",
      padding: 20,
      borderRadius: 10,
      minWidth: 180,
      textAlign: "center",
    }}
  >
    <h4>{title}</h4>
    <p style={{ fontSize: 22, fontWeight: "bold" }}>{value}</p>
  </div>
);

export default Dashboard;
