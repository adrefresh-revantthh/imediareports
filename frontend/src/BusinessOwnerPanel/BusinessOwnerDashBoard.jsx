import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = JSON.parse(localStorage.getItem("jwt"))?.token;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/getalldata", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(res.data);
      } catch (err) {
        console.error("Error loading dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading || !data) return <h2 style={{ padding: 20 }}>Loading...</h2>;

  // ⭐ GROUP BY FUNCTION
  const groupBy = (arr, key) => {
    const map = {};
    arr.forEach((item) => {
      const k = item[key];
      if (!map[k]) map[k] = 0;
      map[k] += 1;
    });

    return Object.entries(map).map(([name, count]) => ({ name, count }));
  };

  const groupedPublishers = groupBy(data.sheets, "publisher");
  const groupedAdvertisers = groupBy(data.sheets, "advertiser");

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>📊 Business Owner Dashboard</h2>

      {/* TOTAL SUMMARY CARDS */}
      <div style={styles.summaryRow}>
        <div style={styles.card}>
          <h3>Total Sheets</h3>
          <p style={styles.bigNum}>{data.totalSheets}</p>
        </div>

        <div style={styles.card}>
          <h3>Total Genealogy Sheets</h3>
          <p style={styles.bigNum}>{data.totalGenealogy}</p>
        </div>
      </div>

      {/* GROUPED PUBLISHER TABLE */}
      <h3 style={styles.sectionTitle}>📌 Sheets by Publisher</h3>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Publisher</th>
            <th style={styles.th}>Sheet Count</th>
          </tr>
        </thead>
        <tbody>
          {groupedPublishers.map((p, i) => (
            <tr key={i}>
              <td style={styles.td}>{p.name}</td>
              <td style={styles.td}>{p.count}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* GROUPED ADVERTISER TABLE */}
      <h3 style={styles.sectionTitle}>📌 Sheets by Advertiser</h3>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Advertiser</th>
            <th style={styles.th}>Sheet Count</th>
          </tr>
        </thead>
        <tbody>
          {groupedAdvertisers.map((a, i) => (
            <tr key={i}>
              <td style={styles.td}>{a.name}</td>
              <td style={styles.td}>{a.count}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* RAW SHEETS DATA */}
      <h3 style={styles.sectionTitle}>📁 Raw Sheet List</h3>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Sheet Name</th>
            <th style={styles.th}>Publisher</th>
            <th style={styles.th}>Advertiser</th>
            <th style={styles.th}>Campaign</th>
          </tr>
        </thead>
        <tbody>
          {data.sheets.map((s, i) => (
            <tr key={i}>
              <td style={styles.td}>{s.name}</td>
              <td style={styles.td}>{s.publisher}</td>
              <td style={styles.td}>{s.advertiser}</td>
              <td style={styles.td}>{s.campaign}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* RAW GENEALOGY */}
      <h3 style={styles.sectionTitle}>📁 Genealogy Sheets</h3>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Publisher</th>
            <th style={styles.th}>Advertiser</th>
            <th style={styles.th}>Campaign</th>
          </tr>
        </thead>
        <tbody>
          {data.genealogySheets.map((g, i) => (
            <tr key={i}>
              <td style={styles.td}>{g.name}</td>
              <td style={styles.td}>{g.publisher}</td>
              <td style={styles.td}>{g.advertiser}</td>
              <td style={styles.td}>{g.campaign}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
};

const styles = {
  container: { padding: 30 },
  heading: { fontSize: 30, fontWeight: 700, marginBottom: 25 },

  summaryRow: {
    display: "flex",
    gap: 20,
    marginBottom: 40,
  },

  card: {
    flex: 1,
    background: "#fff",
    padding: 20,
    borderRadius: 10,
    boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
    textAlign: "center",
  },

  bigNum: { fontSize: 32, fontWeight: 800, color: "#2b7cff" },

  sectionTitle: { marginTop: 40, marginBottom: 10, fontSize: 22 },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: 40,
    border: "2px solid black",
  },

  th: {
    padding: 12,
    border: "1px solid black",
    background: "#e8e8e8",
    fontWeight: 600,
  },

  td: {
    padding: 10,
    border: "1px solid black",
    fontSize: 14,
  },
};

export default Dashboard;
