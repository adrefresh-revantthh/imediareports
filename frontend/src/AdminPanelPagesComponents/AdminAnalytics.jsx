import React, { useState, useContext } from "react";
import PublisherPerformance from "./PublisherPerformance";
import AdvertiserPerformance from "./AdvertiserPerformance";
import { ThemeContext } from "../ThemeSettings/ThemeContext";

export default function AdminAnalytics() {
  const [activeTab, setActiveTab] = useState("publisher");
  const { theme } = useContext(ThemeContext);

  // ✅ Theme colors
  const isDark = theme === "dark";
  const colors = {
    text: isDark ? "#e2e8f0" : "#111827",
    bg: isDark ? "#0f172a" : "#f3f4f6",
    card: isDark ? "#1e293b" : "#ffffff",
    tabActive: "#10b981",
    tabInactive: isDark ? "#334155" : "#e5e7eb",
    tabInactiveHover: isDark ? "#475569" : "#d1d5db",
  };

  return (
    <div
      style={{
        width: "100%",
        padding: "25px",
        boxSizing: "border-box",
        background: colors.bg,
        color: colors.text,
      }}
    >
      {/* ✅ Title */}
      <h2
        style={{
          fontSize: "26px",
          fontWeight: "bold",
          marginBottom: "25px",
          textAlign: "left",
          color: colors.text,
        }}
      >
        Admin Analytics & Billing Dashboard
      </h2>

      {/* ✅ Tabs */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "25px",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={() => setActiveTab("publisher")}
          style={{
            padding: "10px 18px",
            borderRadius: "6px",
            cursor: "pointer",
            border: "none",
            fontWeight: "600",
            background:
              activeTab === "publisher" ? colors.tabActive : colors.tabInactive,
            color: activeTab === "publisher" ? "#ffffff" : colors.text,
            transition: "0.3s",
          }}
        >
          Publisher Performance
        </button>

        <button
          onClick={() => setActiveTab("advertiser")}
          style={{
            padding: "10px 18px",
            borderRadius: "6px",
            cursor: "pointer",
            border: "none",
            fontWeight: "600",
            background:
              activeTab === "advertiser" ? colors.tabActive : colors.tabInactive,
            color: activeTab === "advertiser" ? "#ffffff" : colors.text,
            transition: "0.3s",
          }}
        >
          Advertiser Billing
        </button>
      </div>

      {/* ✅ Render Section */}
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        {activeTab === "publisher" && (
          <div
            style={{
              width: "100%",
              background: colors.card,
              padding: "15px",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            <PublisherPerformance />
          </div>
        )}

        {activeTab === "advertiser" && (
          <div
            style={{
              width: "100%",
              background: colors.card,
              padding: "15px",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            <AdvertiserPerformance />
          </div>
        )}
      </div>
    </div>
  );
}
