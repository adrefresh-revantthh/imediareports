// AdWidgetEarningsOnly.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";

const COLORS = ["#00C49F", "#FFBB28", "#0088FE", "#FF8042"];
const API_URL = "https://imediareports.onrender.com/api/getalldata";
const JWT_KEY = "jwt";
const REVENUE_MULT = 1000;

/* ---------- helpers ---------- */
const norm = (s = "") => s.toLowerCase().trim().replace(/\s+/g, "").replace(/_/g, "");
const num = (v) => (v == null || v === "" ? 0 : typeof v === "string" ? Number(v.replace(/,/g, "")) : Number(v));

const convertDate = (serial) => {
  const n = num(serial);
  if (!n) return "";
  const epoch = new Date(1899, 11, 30);
  return new Date(epoch.getTime() + n * 86400000).toISOString().slice(0, 10);
};

// grab a numeric value by fuzzy key match (handles many header variants)
const pick = (row, terms) => {
  const keys = Object.keys(row);
  for (let i = 0; i < keys.length; i++) {
    const k = norm(keys[i]);
    if (terms.some((t) => k.includes(norm(t)))) return num(row[keys[i]]);
  }
  return 0;
};

const extractRow = (r = {}) => {
  const imps = pick(r, ["impressions", "views", "delivery", "delivered", "totalviews", "totalimpressions"]);
  const clicks = pick(r, ["np clicks", "clicks", "clk", "totalclicks"]);
  const d = r.Date ?? r.date ?? r.Day ?? "";
  const date = typeof d === "number" || /^\d+$/.test(String(d)) ? convertDate(d) : String(d).slice(0, 10);
  return { date, imps, clicks };
};

const calc = (sheets = []) => {
  const rows = sheets.flatMap((s) => (s?.data || []).map(extractRow));
  const impressions = rows.reduce((a, r) => a + r.imps, 0);
  const clicks = rows.reduce((a, r) => a + r.clicks, 0);
  const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
  const revenue = clicks * (ctr / 100) * REVENUE_MULT;
  return { rows, impressions, clicks, ctr, revenue };
};
/* ----------------------------- */

export default function AdWidgetEarningsOnly() {
  const [metrics, setMetrics] = useState({ revenue: 0, impressions: 0, clicks: 0, ctr: 0 });
  const [tableData, setTableData] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const user = JSON.parse(localStorage.getItem(JWT_KEY) || "null")?.user;
        const { data } = await axios.get(API_URL);
        const allSheets = data?.sheets || [];

        // 1) publisher filter + drop summary
        const sheets = allSheets
          .filter((s) => norm(s.publisher) === norm(user?.name))
          .filter((s) => norm(s.name) !== "summary");

        // 2) use array[2] as AdWidget source (3rd sheet) – per your instruction
        const adSheets = sheets[2] ? [sheets[2]] : [];

        // 3) compute metrics from just adSheets
        const { rows, impressions, clicks, ctr, revenue } = calc(adSheets);
        setTableData(rows);
        setMetrics({
          impressions,
          clicks,
          ctr: Number(ctr.toFixed(2)),
          revenue: Number(revenue.toFixed(2)),
        });

        // 4) revenue by campaign (use ALL publisher sheets for share)
        const revenueByCampaign = {};
        sheets.forEach((sheet) => {
          const { impressions: i2, clicks: c2 } = calc([sheet]);
          const ctr2 = i2 > 0 ? (c2 / i2) * 100 : 0;
          const rev = c2 * (ctr2 / 100) * REVENUE_MULT;
          revenueByCampaign[sheet.campaign] = (revenueByCampaign[sheet.campaign] || 0) + rev;
        });

        setChartData(
          Object.entries(revenueByCampaign).map(([name, rev]) => ({
            name,
            revenue: Number(rev.toFixed(2)),
          }))
        );
      } catch (err) {
        console.error("AdWidget load error:", err);
      }
    };

    load();
  }, []);

  return (
    <div style={styles.main}>
      <h2 style={styles.title}>AdWidget Earnings Summary</h2>

      {/* Metrics */}
      <div style={styles.metricsRow}>
        <div style={styles.metricBox}>
          <h4>Revenue</h4>
          <p>${metrics.revenue}</p>
        </div>
        <div style={styles.metricBox}>
          <h4>Impressions</h4>
          <p>{metrics.impressions}</p>
        </div>
        <div style={styles.metricBox}>
          <h4>Clicks</h4>
          <p>{metrics.clicks}</p>
        </div>
        <div style={styles.metricBox}>
          <h4>CTR</h4>
          <p>{metrics.ctr}%</p>
        </div>
      </div>

      {/* Table */}
      <div style={styles.card}>
        <h3>AdWidget Daily Data</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Impressions</th>
              <th style={styles.th}>Clicks</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, i) => (
              <tr key={i}>
                <td style={styles.td}>{row.date}</td>
                <td style={styles.td}>{row.imps}</td>
                <td style={styles.td}>{row.clicks}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!tableData.length && (
          <p style={{ marginTop: 10 }}>
            No rows found in <strong>publisherSheets[2]</strong>. Check the ordering from the API.
          </p>
        )}
      </div>

      {/* Charts */}
      <div style={styles.chartRow}>
        <div style={styles.card}>
          <h3>Revenue Share by Campaign</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={chartData} dataKey="revenue" nameKey="name" outerRadius={110} label>
                {chartData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div style={styles.card}>
          <h3>Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#00C49F" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

/* Styles */
const styles = {
  main: { width: "100%", padding: "20px" },
  title: { fontSize: "24px", fontWeight: "bold", marginBottom: "20px" },
  metricsRow: { display: "flex", gap: "15px", flexWrap: "wrap", marginBottom: "30px" },
  metricBox: {
    flex: "1 1 250px",
    background: "#fff",
    padding: "20px",
    borderRadius: "8px",
    textAlign: "center",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  },
  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    marginTop: "20px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  },
  chartRow: { display: "flex", gap: "20px", flexWrap: "wrap" },
  table: { width: "100%", borderCollapse: "collapse", marginTop: "15px" },
  th: { border: "1px solid #000", padding: "10px", background: "#ddd" },
  td: { border: "1px solid #000", padding: "10px" },
};
