import React, { useEffect, useState, useMemo, useCallback } from "react";
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
} from "recharts";
import "./Advertiser.css";

/* ════════════════════════════════════════
   CONSTANTS
════════════════════════════════════════ */

const TABS = ["Overall", "Video", "OTT", "AdWidget"];

// ✅ Dynamic metrics per tab — drives cards, table columns & chart
const METRIC_CONFIG = {
  Overall:  ["impressions", "clicks", "ctr", "ecpm", "spend"],
  Video:    ["impressions", "clicks", "vcr", "ecpm", "spend"],
  OTT:      ["impressions", "clicks", "ctr", "ecpm", "spend"],
  AdWidget: ["impressions", "clicks", "ctr", "spend"],
};

const METRIC_LABELS = {
  impressions: "Impressions",
  clicks:      "Clicks",
  ctr:         "CTR",
  ecpm:        "eCPM",
  spend:       "Spend",
  vcr:         "VCR",
};

const METRIC_FORMAT = {
  impressions: (v) => Number(v).toLocaleString(),
  clicks:      (v) => Number(v).toLocaleString(),
  ctr:         (v) => `${Number(v).toFixed(2)}%`,
  ecpm:        (v) => `$${Number(v).toFixed(2)}`,
  spend:       (v) => `$${Number(v).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
  vcr:         (v) => `${Number(v).toFixed(2)}%`,
};

/* ════════════════════════════════════════
   HELPERS
════════════════════════════════════════ */

const toNum = (v) => {
  if (v === null || v === undefined || v === "") return 0;
  const n = parseFloat(String(v).replace(/[^0-9.-]+/g, ""));
  return isNaN(n) ? 0 : n;
};

// Classify sheet by name — consistent with Publisher/Advertiser dashboards
const classifySheet = (name = "") => {
  const s = name.toLowerCase();
  if (s.includes("ott") || s.includes("ctv") || s.includes("connected tv") || s.includes("streaming")) return "OTT";
  if (s.includes("video") || s.includes("preroll") || s.includes("pre-roll") || s.includes("instream"))  return "Video";
  if (s.includes("adwidget") || s.includes("display") || s.includes("widget") || s.includes("banner"))    return "AdWidget";
  return null;
};

// Flexible row extraction — handles Imps, Revenue (USD), Spend($), etc.
const extractRow = (row) => {
  const imp = toNum(row.impressions ?? row.imps ?? row.imp ?? row["total impressions"]);
  const clk = toNum(row.clicks ?? row.click ?? row["total clicks"]);
  const cpm = toNum(row.cpm);
  const cpc = toNum(row.cpc);
  const vcr = toNum(row.vcr ?? row["view completion rate"] ?? row["completion rate"]);

  // Spend: explicit column first → CPC → CPM
  const spendKey = Object.keys(row).find((k) => {
    const l = k.trim().toLowerCase();
    return l.includes("spend") || l.includes("revenue");
  });
  let spend = spendKey ? toNum(row[spendKey]) : 0;
  if (!spend && cpc > 0) spend = clk * cpc;
  if (!spend && cpm > 0) spend = (imp / 1000) * cpm;

  return { imp, clk, spend, cpm, vcr };
};

/* ════════════════════════════════════════
   COMPONENT
════════════════════════════════════════ */

const AdvertiserDashboard = () => {
  const [activeTab,  setActiveTab]  = useState("Overall");
  const [campaign,   setCampaign]   = useState("All");
  const [rawRows,    setRawRows]    = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [showGraph,  setShowGraph]  = useState(true);
  const [showTable,  setShowTable]  = useState(false);
  const [tableLimit, setTableLimit] = useState(10);

  /* ── FETCH & NORMALIZE ── */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = JSON.parse(localStorage.getItem("jwt"))?.token;
        if (!token) return;

        const { data } = await axios.get(
          "https://imediareports.onrender.com/api/getallsheets",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const normalized = [];

        (data || []).forEach((sheet) => {
          const adType = classifySheet(sheet.name);
          if (!adType) return;

          const campaignName = sheet.campaign || sheet.Campaign || sheet.campaignName || "Unknown";
          const publisher    = sheet.publisher || sheet.Publisher || "—";

          (sheet.data || []).forEach((originalRow) => {
            const row = {};
            Object.keys(originalRow).forEach((k) => {
              row[k.trim().toLowerCase()] = originalRow[k];
            });

            const { imp, clk, spend, cpm, vcr } = extractRow(row);
            normalized.push({ adType, campaign: campaignName, publisher, imp, clk, spend, cpm, vcr });
          });
        });

        setRawRows(normalized);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* ── CAMPAIGNS (resets when tab changes) ── */
  const campaigns = useMemo(() => {
    const src = activeTab === "Overall" ? rawRows : rawRows.filter((r) => r.adType === activeTab);
    return ["All", ...Array.from(new Set(src.map((r) => r.campaign))).sort()];
  }, [rawRows, activeTab]);

  /* ── FILTERED ROWS ── */
  const filtered = useMemo(() => rawRows.filter((r) => {
    if (activeTab !== "Overall" && r.adType !== activeTab) return false;
    if (campaign !== "All" && r.campaign !== campaign) return false;
    return true;
  }), [rawRows, activeTab, campaign]);

  /* ── AGGREGATED METRICS ── */
  const agg = useMemo(() => {
    let imp = 0, clk = 0, spend = 0, weightedCpm = 0, totalVcr = 0;
    filtered.forEach((r) => {
      imp         += r.imp;
      clk         += r.clk;
      spend       += r.spend;
      weightedCpm += (r.imp / 1000) * r.cpm;
      totalVcr    += r.vcr;
    });
    return {
      impressions: imp,
      clicks:      clk,
      ctr:         imp > 0 ? (clk / imp) * 100 : 0,
      ecpm:        imp > 0 ? (weightedCpm / imp) * 1000 : 0,
      spend,
      vcr:         filtered.length > 0 ? totalVcr / filtered.length : 0,
    };
  }, [filtered]);

  /* ── CHART DATA (by campaign) ── */
  const chartData = useMemo(() => {
    const map = {};
    filtered.forEach((r) => {
      if (!map[r.campaign]) map[r.campaign] = { name: r.campaign, impressions: 0, clicks: 0, spend: 0 };
      map[r.campaign].impressions += r.imp;
      map[r.campaign].clicks      += r.clk;
      map[r.campaign].spend       += r.spend;
    });
    return Object.values(map).sort((a, b) => b.impressions - a.impressions);
  }, [filtered]);

  /* ── TAB CHANGE ── */
  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    setCampaign("All");
    setTableLimit(10);
  }, []);

  const visibleMetrics = METRIC_CONFIG[activeTab];

  /* ════════════════════════════════════════
     RENDER
  ════════════════════════════════════════ */
  return (
    <div className="adv-wrap">

      {/* HEADER */}
      <div className="adv-header">
        <h2 className="adv-title">📊 Advertiser Performance</h2>

        <div className="adv-controls">
          <select
            className="adv-select"
            value={campaign}
            onChange={(e) => setCampaign(e.target.value)}
          >
            {campaigns.map((c) => <option key={c}>{c}</option>)}
          </select>

          <label className="adv-toggle-label">
            <input
              type="checkbox"
              checked={showGraph}
              onChange={() => setShowGraph((v) => !v)}
            />
            Graph
          </label>

          <label className="adv-toggle-label">
            <input
              type="checkbox"
              checked={showTable}
              onChange={() => setShowTable((v) => !v)}
            />
            Table
          </label>
        </div>
      </div>

      {/* TABS */}
      <div className="adv-tabs">
        {TABS.map((t) => (
          <button
            key={t}
            className={`adv-tab ${activeTab === t ? "active" : ""}`}
            onClick={() => handleTabChange(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {/* METRIC CARDS — dynamic per tab */}
      <div className="adv-cards">
        {loading
          ? Array.from({ length: visibleMetrics.length }).map((_, i) => (
              <div key={i} className="adv-card skeleton" />
            ))
          : visibleMetrics.map((m) => (
              <div key={m} className="adv-card">
                <div className="adv-card-label">{METRIC_LABELS[m]}</div>
                <div className="adv-card-value">
                  {METRIC_FORMAT[m](agg[m] ?? 0)}
                </div>
              </div>
            ))}
      </div>

      {/* CHART */}
      {showGraph && (
        <div className="adv-panel">
          <div className="adv-panel-header">
            <span className="adv-panel-title">Impressions by Campaign</span>
            {!loading && (
              <span style={{ fontSize: 12, color: "#6b7280" }}>
                {chartData.length} campaigns
              </span>
            )}
          </div>
          <div className="adv-panel-body">
            {loading ? (
              <div className="skeleton-graph" />
            ) : chartData.length === 0 ? (
              <div className="adv-empty">No data for selected filters</div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} barCategoryGap="35%">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}
                  />
                  <Tooltip
                    formatter={(value, name) => [Number(value).toLocaleString(), METRIC_LABELS[name] || name]}
                  />
                  <Legend />
                  <Bar dataKey="impressions" fill="#007bff" radius={[4, 4, 0, 0]} />
                  {visibleMetrics.includes("clicks") && (
                    <Bar dataKey="clicks" fill="#28a745" radius={[4, 4, 0, 0]} />
                  )}
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      )}

      {/* TABLE — dynamic columns per tab */}
      {showTable && (
        <div className="adv-panel">
          <div className="adv-panel-header">
            <span className="adv-panel-title">Detailed Breakdown</span>
            {!loading && (
              <span style={{ fontSize: 12, color: "#6b7280" }}>
                {filtered.length} rows
              </span>
            )}
          </div>

          {loading ? (
            <div className="adv-panel-body">
              <div className="skeleton-graph" style={{ height: 200 }} />
            </div>
          ) : filtered.length === 0 ? (
            <div className="adv-empty">No data for selected filters</div>
          ) : (
            <>
              <div className="adv-table-wrap">
                <table className="adv-table">
                  <thead>
                    <tr>
                      <th>Campaign</th>
                      <th>Publisher</th>
                      <th>Ad Type</th>
                      {/* ✅ Columns change per active tab */}
                      {visibleMetrics.map((m) => (
                        <th key={m}>{METRIC_LABELS[m]}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.slice(0, tableLimit).map((r, i) => {
                      const rowMetrics = {
                        impressions: r.imp,
                        clicks:      r.clk,
                        ctr:         r.imp > 0 ? (r.clk / r.imp) * 100 : 0,
                        ecpm:        r.cpm,
                        spend:       r.spend,
                        vcr:         r.vcr,
                      };
                      return (
                        <tr key={i}>
                          <td>{r.campaign}</td>
                          <td>{r.publisher}</td>
                          <td>{r.adType}</td>
                          {visibleMetrics.map((m) => (
                            <td key={m}>{METRIC_FORMAT[m](rowMetrics[m] ?? 0)}</td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {tableLimit < filtered.length && (
                <button
                  className="adv-load-more"
                  onClick={() => setTableLimit((l) => l + 10)}
                >
                  Load more ({filtered.length - tableLimit} remaining)
                </button>
              )}
            </>
          )}
        </div>
      )}

    </div>
  );
};

export default AdvertiserDashboard;
