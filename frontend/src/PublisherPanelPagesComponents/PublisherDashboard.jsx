
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
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
// import "./publisher.css"
/* ================= HELPERS ================= */

const COLORS = ["#007bff", "#ff4d4f", "#28a745"];

const excelDateToJSDate = (serial) => {
  if (!serial || isNaN(serial)) return null;
  const epoch = new Date(Date.UTC(1899, 11, 30));
  return new Date(epoch.getTime() + serial * 86400000);
};

const parseRowDate = (val) => {
  if (!val) return null;
  if (typeof val === "number") return excelDateToJSDate(val);
  const d = new Date(val);
  return isNaN(d.getTime()) ? null : d;
};

const safeNumber = (v) => {
  if (!v) return 0;
  if (typeof v === "string") return Number(v.replace(/[$,%]/g, ""));
  return Number(v);
};

/* ================= DASHBOARD ================= */

const Dashboard = () => {
  const [revenueByType, setRevenueByType] = useState([]);
  const [last7DaysRevenue, setLast7DaysRevenue] = useState([]);
  const [totals, setTotals] = useState({
    views: 0,
    clicks: 0,
    revenue: 0,
  });

  const [loading, setLoading] = useState(true);

  /* ===== DATE FILTER ===== */
  const [datePreset, setDatePreset] = useState("lastweek");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  /* ===== DATE PRESET ===== */
 const applyDatePreset = (preset) => {
  if (preset === "custom") return; // don't auto-set for custom

  const today = new Date();
  let from = new Date();
  let to = new Date();

  if (preset === "yesterday") {
    from.setDate(today.getDate() - 1);
    to = new Date(from);
  }

  if (preset === "lastweek") {
    from.setDate(today.getDate() - 7);
  }

  if (preset === "lastmonth") {
    from.setMonth(today.getMonth() - 1);
  }

  setCustomFrom(from.toISOString().slice(0, 10));
  setCustomTo(to.toISOString().slice(0, 10));
};
  useEffect(() => {
    applyDatePreset(datePreset);
  }, [datePreset]);

  /* ================= FETCH DATA ================= */

  useEffect(() => {
    if (!customFrom || !customTo) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const storedPublisher =
          JSON.parse(localStorage.getItem("jwt"))?.user?.name;

        const res = await axios.get(
          "https://imediareports.onrender.com/api/getalldata"
        );

        const allSheets = [
          ...(res.data?.sheets || []),
          ...(res.data?.genealogySheets || []),
        ];

        const filteredSheets = allSheets.filter(
          (sheet) =>
            sheet.publisher &&
            sheet.publisher.toLowerCase() ===
              storedPublisher?.toLowerCase()
        );

        const from = new Date(customFrom);
        const to = new Date(customTo);

        let views = 0,
          clicks = 0,
          revenue = 0;

        const adTypeMap = {
          ott: 0,
          video: 0,
          adwidget: 0,
        };

        const revenueDays = {};

        filteredSheets.forEach((sheet) => {
          (sheet.data || []).forEach((originalRow) => {
            /* NORMALIZE KEYS */
            const row = {};
            Object.keys(originalRow).forEach((k) => {
              row[k.trim()] = originalRow[k];
            });

            /* DATE */
            const d = parseRowDate(row.Date || row.date);
            if (!d || d < from || d > to) return;

            const impressions = safeNumber(row.Impressions);
            const clk = safeNumber(row.Clicks);
            const cpm = safeNumber(row.CPM);
            const cpc = safeNumber(row.CPC);

            views += impressions;
            clicks += clk;

            let rev = 0;
            if (cpc > 0) rev = clk * cpc;
            else if (cpm > 0) rev = (impressions / 1000) * cpm;
            else rev = (impressions / 1000) * 1.5;

            revenue += rev;

            /* ===== ADTYPE ===== */
            const adType = (sheet.name || "").toLowerCase();
            if (adTypeMap[adType] !== undefined) {
              adTypeMap[adType] += rev;
            }

            /* ===== LAST 7 DAYS ===== */
            const key = d.toISOString().slice(0, 10);
            revenueDays[key] ??= 0;
            revenueDays[key] += rev;
          });
        });

        /* ===== PIE ===== */
        const pie = Object.keys(adTypeMap).map((k) => ({
          name: k.toUpperCase(),
          value: Number(adTypeMap[k].toFixed(2)),
        }));

        setRevenueByType(pie);

        /* ===== BAR ===== */
        const last7 = Object.keys(revenueDays)
          .sort()
          .slice(-7)
          .map((d) => ({
            date: d,
            revenue: Number(revenueDays[d].toFixed(2)),
          }));

        setLast7DaysRevenue(last7);

        setTotals({
          views,
          clicks,
          revenue: revenue.toFixed(2),
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [customFrom, customTo]);

  /* ================= UI ================= */

  return (
    <div style={{ padding: "24px", background: "#f9fafb" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ fontSize: "32px", fontWeight: 700 }}>
          📊 Publisher Dashboard
        </h2>

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
<div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
    gap: 10,
    marginBottom: 25,
  }}
>
  {/* Views */}
  <div
    style={{
      background: "linear-gradient(135deg, #ffffff, #f9f9ff)",
      borderRadius: 5,
      padding: 10,
      boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
      transition: "0.3s ease",
      cursor: "pointer",
      position: "relative",
      overflow: "hidden",
      borderLeft: "6px solid #4facfe",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-6px)";
      e.currentTarget.style.boxShadow =
        "0 15px 35px rgba(0,0,0,0.15)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow =
        "0 10px 25px rgba(0,0,0,0.08)";
    }}
  >
    <h4
      style={{
        fontSize: 15,
        fontWeight: 600,
        color: "#666",
        marginBottom: 8,
      }}
    >
      Total Views
    </h4>
    <p
      style={{
        fontSize: 28,
        fontWeight: "bold",
        color: "#222",
        margin: 0,
      }}
    >
      {totals.views}
    </p>
  </div>

  {/* Clicks */}
  <div
    style={{
      background: "linear-gradient(135deg, #ffffff, #f9f9ff)",
      borderRadius: 5,
      padding: 10,
      boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
      transition: "0.3s ease",
      cursor: "pointer",
      position: "relative",
      overflow: "hidden",
      borderLeft: "6px solid #43e97b",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-6px)";
      e.currentTarget.style.boxShadow =
        "0 15px 35px rgba(0,0,0,0.15)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow =
        "0 10px 25px rgba(0,0,0,0.08)";
    }}
  >
    <h4
      style={{
        fontSize: 15,
        fontWeight: 600,
        color: "#666",
        marginBottom: 8,
      }}
    >
      Total Clicks
    </h4>
    <p
      style={{
        fontSize: 28,
        fontWeight: "bold",
        color: "#222",
        margin: 0,
      }}
    >
      {totals.clicks}
    </p>
  </div>

  {/* Revenue */}
  <div
    style={{
      background: "linear-gradient(135deg, #ffffff, #f9f9ff)",
      borderRadius: 5,
      padding: 10,
      boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
      transition: "0.3s ease",
      cursor: "pointer",
      position: "relative",
      overflow: "hidden",
      borderLeft: "6px solid #ff6a88",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-6px)";
      e.currentTarget.style.boxShadow =
        "0 15px 35px rgba(0,0,0,0.15)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow =
        "0 10px 25px rgba(0,0,0,0.08)";
    }}
  >
    <h4
      style={{
        fontSize: 15,
        fontWeight: 600,
        color: "#666",
        marginBottom: 8,
      }}
    >
      Total Revenue
    </h4>
    <p
      style={{
        fontSize: 28,
        fontWeight: "bold",
        color: "#222",
        margin: 0,
      }}
    >
      ${totals.revenue}
    </p>
  </div>
</div>
      {/* CHARTS */}
      <div style={{ display: "flex", gap: "20px" }}>
        <div style={{ flex: 1, background: "#fff", padding: "20px" }}>
          <h3>Revenue Share</h3>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={revenueByType}
                dataKey="value"
                nameKey="name"
                outerRadius={110}
              >
                {revenueByType.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div style={{ flex: 1, background: "#fff", padding: "20px" }}>
          <h3>Last 7 Days Revenue</h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={last7DaysRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#007bff" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
