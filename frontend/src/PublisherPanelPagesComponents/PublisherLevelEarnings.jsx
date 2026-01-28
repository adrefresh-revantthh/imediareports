import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const tabs = ["Overall", "OTT", "Video", "Ad Widget"];
const COLORS = ["#06c19c", "#0088FE", "#FF8042", "#A020F0"];

const PublisherEarnings = () => {
  const { state } = useLocation();
  const publisherId = state?.publisherId;

  const [activeTab, setActiveTab] = useState("Overall");
  const [stats, setStats] = useState({});
  const [chartData, setChartData] = useState([]);
  const [donutData, setDonutData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);

  const platformMap = { 0: "OTT", 1: "Video", 2: "Ad Widget" };

  useEffect(() => {
    const fetchData = async () => {
      console.log("[fetchData] start", { publisherId, activeTab });
      setLoading(true);

      try {
        // support both token keys ('token' and jwt JSON)
        const rawJwt = localStorage.getItem("jwt");
        const tokenFromJwt = rawJwt ? (JSON.parse(rawJwt)?.token) : null;
        const token = localStorage.getItem("token") || tokenFromJwt;
        console.log("[fetchData] token found:", !!token);

        if (!token) {
          console.error("[fetchData] Missing token. Aborting fetch.");
          setLoading(false);
          return;
        }

        const res = await axios.get("https://imediareports.onrender.com/api/getalldata", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("[fetchData] raw response:", res);
        const raw = res?.data;
        console.log("[fetchData] res.data type:", typeof raw, Array.isArray(raw), raw && raw.length);

        // Normalize incoming structure
        const allSheets = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.data)
          ? raw.data
          : [];
        console.log("[fetchData] resolved allSheets length:", allSheets.length);

        // Filter sheets by publisherId
        const sheets = publisherId
          ? allSheets.filter((s) => {
              const up = s?.uploadedBy;
              const upId = up?._id || up || null;
              const match = upId === publisherId;
              if (!match) {
                // log mismatch for first few
                // console.log(`[filter] sheet ${s._id} uploadedBy ${upId} !== ${publisherId}`);
              }
              return match;
            })
          : allSheets;
        console.log("[fetchData] filtered sheets length for publisher:", sheets.length);

        // initialize accumulators
        let metrics = { revenue: 0, imps: 0, clicks: 0 };
        const dateMap = {};
        const platformTotals = { OTT: 0, Video: 0, "Ad Widget": 0 };
        const rows = [];

        // iterate sheets
        sheets.forEach((sheet, idx) => {
          console.log(`[sheet] index:${idx} id:${sheet._id} name:${sheet.name} uploadedBy:${JSON.stringify(sheet.uploadedBy)}`);
          const platform = platformMap[idx] || "Other";
          if (idx > 2) {
            console.log(`[sheet] skipping index > 2 (idx=${idx})`);
            return;
          }
          if (activeTab !== "Overall" && activeTab !== platform) {
            console.log(`[sheet] skipping due to activeTab filter (platform=${platform})`);
            return;
          }

          const createdDate = sheet?.createdAt ? new Date(sheet.createdAt).toLocaleDateString() : "unknown-date";
          const sheetData = Array.isArray(sheet.data) ? sheet.data : [];
          console.log(`[sheet] ${sheet._id} rows:${sheetData.length}`);

          // process rows
          sheetData.forEach((row, rIndex) => {
            if (!row || typeof row !== "object") {
              if (rIndex < 5) console.warn("[row] invalid row:", row);
              return;
            }

            // clean headers: trim keys (keep original values)
            const clean = {};
            Object.keys(row).forEach((k) => {
              const key = typeof k === "string" ? k.trim() : k;
              clean[key] = row[k];
            });

            // try multiple header variations
            const imps =
              Number(clean.Impressions ?? clean[" Impressions "] ?? clean["Impression"] ?? clean["impressions"] ?? 0) || 0;
            const clicks =
              Number(clean.Clicks ?? clean[" Clicks "] ?? clean["clicks"] ?? clean["Clicks "] ?? 0) || 0;
            const cpm =
              Number(clean.CPM ?? clean[" CPM "] ?? clean.cpm ?? clean["Cost Per Mille"] ?? 0) || 0;
            const cpc =
              Number(clean.CPC ?? clean[" CPC "] ?? clean.cpc ?? 0) || 0;
            const rawRevenue =
              Number(clean.Revenue ?? clean["Revenue"] ?? clean[" Spend "] ?? 0) || 0;

            // compute revenue fallback
            let rev = rawRevenue || 0;
            if (!rev) {
              if (cpc > 0 && clicks > 0) rev = clicks * cpc;
              else if (cpm > 0 && imps > 0) rev = (imps / 1000) * cpm;
              else if (imps > 0) rev = (imps / 1000) * 1.5; // fallback baseline
            }

            // log first few rows to inspect shapes
            if (rIndex < 3) {
              console.log(`[row-sample] sheet:${sheet._id} rowIndex:${rIndex}`, { imps, clicks, cpm, cpc, rawRevenue, rev });
            }

            metrics.revenue += rev;
            metrics.imps += imps;
            metrics.clicks += clicks;

            // accumulate per-date
            if (!dateMap[createdDate]) dateMap[createdDate] = { date: createdDate, revenue: 0, clicks: 0 };
            dateMap[createdDate].revenue += rev;
            dateMap[createdDate].clicks += clicks;

            // platform totals
            const platKey = platform in platformTotals ? platform : "Other";
            if (!(platKey in platformTotals)) platformTotals[platKey] = 0;
            platformTotals[platKey] += rev;

            // push table row
            rows.push({
              platform,
              impressions: imps,
              clicks,
              revenue: rev,
            });
          }); // end sheetData.forEach
        }); // end sheets.forEach

        // finalize metrics
        metrics.ctr = metrics.imps ? ((metrics.clicks / metrics.imps) * 100).toFixed(2) : 0;
        metrics.ecpm = metrics.imps ? ((metrics.revenue / metrics.imps) * 1000).toFixed(2) : 0;

        console.log("[fetchData] metrics final:", metrics);
        console.log("[fetchData] dateMap keys:", Object.keys(dateMap).length);
        console.log("[fetchData] platformTotals:", platformTotals);
        console.log("[fetchData] sample table rows:", rows.slice(0, 6));

        // prepare UI data
        setStats(metrics);
        setChartData(Object.values(dateMap).map((d) => ({ ...d, revenue: Number(d.revenue.toFixed(2)) })));
        setTableData(rows.map((r) => ({ ...r, revenue: `$${Number(r.revenue).toFixed(2)}`, impressions: r.impressions.toLocaleString() })));
        setDonutData(
          Object.keys(platformTotals).map((k) => ({ name: k, value: Number((platformTotals[k] || 0).toFixed(2)) }))
        );

        console.log("[fetchData] chartData:", chartData);
        console.log("[fetchData] donutData:", donutData);
      } catch (err) {
        console.error("[fetchData] fetch error:", err);
      } finally {
        setLoading(false);
        console.log("[fetchData] finished");
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publisherId, activeTab]);

  return (
    <div style={{ display: "flex", height: "100vh",  marginLeft: "-26%" }}>
     hwllo
    </div>
  );
};

const thStyle = { padding: "10px", border: "1px solid #ddd" };
const tdStyle = { padding: "8px", border: "1px solid #ddd" };

const Card = ({ label, value }) => (
  <div style={{ background: "#fff", padding: "22px", borderRadius: "12px", textAlign: "center", boxShadow: "0 4px 10px rgba(0,0,0,0.08)" }}>
    <div style={{ fontSize: "15px", fontWeight: 600, color: "#6d7a88" }}>{label}</div>
    <div style={{ fontSize: "22px", fontWeight: 800, marginTop: "6px" }}>{value}</div>
  </div>
);

export default PublisherEarnings;
