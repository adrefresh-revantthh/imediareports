

// import React, { useEffect, useState } from "react";
// import { styles } from "../styles";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const Uploads = () => {
//   const [campaigns, setCampaigns] = useState([]);
//   const [totals, setTotals] = useState({ impressions: 0, clicks: 0, revenue: 0 });
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchUploads = async () => {
//       try {
//         const storedPublisher = JSON.parse(localStorage.getItem("jwt")).user.name
//         if (!storedPublisher) {
//           console.warn("⚠️ No publisher name found in localStorage");
//           return;
//         }

//         const res = await axios.get("http://localhost:5000/api/getalldata");
// console.log(res,"results");

//         // ✅ Combine sheets and genealogySheets
//         const allSheets = [
//           ...(res.data?.sheets || []),
//           ...(res.data?.genealogySheets || []),
//         ];

//         // ✅ Filter only this publisher’s data
//         const filtered = allSheets.filter(
//           (sheet) =>
//             sheet.publisher &&
//             sheet.publisher.toLowerCase() === storedPublisher.toLowerCase()
//         );

//         const publisherMap = {};

//         filtered.forEach((sheet) => {
//           const advertiser = sheet.advertiser || "Unknown Advertiser";
//           const key = advertiser;

//           if (!publisherMap[key]) {
//             publisherMap[key] = {
//               Campaign: `${storedPublisher} | ${advertiser}`,
//               Views: 0,
//               Clicks: 0,
//               Revenue: 0,
//               sheetIds: [],
//             };
//           }

//           publisherMap[key].sheetIds.push(sheet._id);

//           (sheet.data || []).forEach((row) => {
//             if (typeof row !== "object" || row === null) return;

//             const normalized = Object.fromEntries(
//               Object.entries(row).map(([key, value]) => [
//                 key.trim().toLowerCase(),
//                 value,
//               ])
//             );

//             const impressions =
//               parseFloat(normalized.impressions) ||
//               parseFloat(normalized["impression"]) ||
//               parseFloat(normalized.views) ||
//               0;
//             const clicks =
//               parseFloat(normalized.clicks) || parseFloat(normalized["click"]) || 0;
//             const cpm =
//               parseFloat(normalized.cpm) ||
//               parseFloat(normalized["cost per mille"]) ||
//               0;
//             const cpc = parseFloat(normalized.cpc) || 0;

//             let revenue = 0;
//             if (cpc > 0 && clicks > 0) revenue = clicks * cpc;
//             else if (cpm > 0 && impressions > 0)
//               revenue = (impressions / 1000) * cpm;
//             else revenue = (impressions / 1000) * 1.5;

//             publisherMap[key].Views += impressions;
//             publisherMap[key].Clicks += clicks;
//             publisherMap[key].Revenue += revenue;
//           });
//         });

//         const finalData = Object.values(publisherMap);

//         // ✅ Totals
//         const totalImpressions = finalData.reduce((sum, d) => sum + d.Views, 0);
//         const totalClicks = finalData.reduce((sum, d) => sum + d.Clicks, 0);
//         const totalRevenue = finalData.reduce((sum, d) => sum + d.Revenue, 0);

//         setTotals({
//           impressions: totalImpressions,
//           clicks: totalClicks,
//           revenue: totalRevenue.toFixed(2),
//         });
//         setCampaigns(finalData);
//       } catch (error) {
//         console.error("❌ Error fetching uploads:", error);
//       }
//     };

//     fetchUploads();
//   }, []);

//   const handleView = (sheetIds) => {
//     navigate("/viewuploads", { state: { sheetIds } });
//   };

//   const handleDownload = (sheetIds) => {
//     navigate("/downloadsheets", { state: { sheetIds } });
//   };

//   return (
//     <div style={{ ...styles.card, padding: "30px" }}>
//       <h3 style={{ marginBottom: "20px" }}>
//         📁 {localStorage.getItem("publisherName") || "Publisher"} Campaigns
//       </h3>

//       {/* ✅ Summary Section */}
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "center",
//           gap: "20px",
//           marginBottom: "25px",
//           flexWrap: "wrap",
//         }}
//       >
//         <div style={summaryCard}>
//           <h4>Total Impressions</h4>
//           <p style={{ color: "#007bff", fontWeight: "bold" }}>
//             {totals.impressions.toLocaleString()}
//           </p>
//         </div>
//         <div style={summaryCard}>
//           <h4>Total Clicks</h4>
//           <p style={{ color: "#ff4d4f", fontWeight: "bold" }}>
//             {totals.clicks.toLocaleString()}
//           </p>
//         </div>
//         <div style={summaryCard}>
//           <h4>Total Revenue</h4>
//           <p style={{ color: "#007bff", fontWeight: "bold" }}>
//             ${totals.revenue}
//           </p>
//         </div>
//       </div>

//       {/* ✅ Table Section */}
//       <div style={styles.tableWrapper}>
//         <table style={styles.table}>
//           <thead>
//             <tr>
//               <th style={styles.th}>Campaign (Publisher | Advertiser)</th>
//               <th style={styles.th}>Impressions</th>
//               <th style={styles.th}>Clicks</th>
//               <th style={{ ...styles.th, textAlign: "center" }}>Revenue ($)</th>
//               <th style={{ ...styles.th, textAlign: "center" }}>Actions</th>
//             </tr>
//           </thead>

//           <tbody>
//             {campaigns.length > 0 ? (
//               campaigns.map((row, i) => (
//                 <tr key={i}>
//                   <td style={styles.td}>{row.Campaign}</td>
//                   <td style={styles.td}>{row.Views.toLocaleString()}</td>
//                   <td style={styles.td}>{row.Clicks.toLocaleString()}</td>
//                   <td style={{ ...styles.td, textAlign: "center" }}>
//                     ${row.Revenue.toFixed(2)}
//                   </td>
//                   <td style={{ ...styles.td, textAlign: "center" }}>
//                     <button
//                       onClick={() => handleView(row.sheetIds)}
//                       style={{
//                         ...btn,
//                         background: "#007bff",
//                       }}
//                     >
//                       View
//                     </button>

//                     <button
//                       onClick={() => handleDownload(row.sheetIds)}
//                       style={{
//                         ...btn,
//                         background: "#ff4d4f",
//                       }}
//                     >
//                       Download
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="5" style={{ textAlign: "center", padding: "15px" }}>
//                   No campaigns found for this publisher.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// // ✅ Reusable Summary Card Style
// const summaryCard = {
//   backgroundColor: "#fff",
//   borderRadius: "12px",
//   padding: "15px 25px",
//   boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
//   textAlign: "center",
//   minWidth: "200px",
// };

// const btn = {
//   padding: "6px 12px",
//   marginRight: "6px",
//   color: "#fff",
//   border: "none",
//   borderRadius: "6px",
//   cursor: "pointer",
//   fontWeight: 500,
//   transition: "all 0.2s ease",
// };

// export default Uploads;
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

/* ===== HELPERS ===== */
const normalize = (s = "") =>
  s.toLowerCase().trim().replace(/\s+/g, "");

const parseDate = (value) => {
  if (!value) return null;
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
};

const getRowDate = (row) => {
  const possibleKeys = ["date", "day", "createddate", "timestamp"];
  for (const key of possibleKeys) {
    if (row[key]) {
      const d = new Date(row[key]);
      if (!isNaN(d.getTime())) return d;
    }
  }
  return null;
};

const Uploads = () => {
  const navigate = useNavigate();

  const publisherName = JSON.parse(localStorage.getItem("jwt"))?.user?.name;

  /* ===== STATE ===== */
  const [advertisers, setAdvertisers] = useState([]);
  const [selectedAdvertiser, setSelectedAdvertiser] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [campaigns, setCampaigns] = useState([]);
  const [totals, setTotals] = useState({
    impressions: 0,
    clicks: 0,
    revenue: 0,
  });

  /* ===== FETCH ADVERTISER LIST ===== */
  useEffect(() => {
    const fetchAdvertisers = async () => {
      try {
        if (!publisherName) return;

        const res = await axios.get(
          "https://imediareports.onrender.com/api/getalldata"
        );

        const allSheets = [
          ...(res.data?.sheets || []),
          ...(res.data?.genealogySheets || []),
        ];

        const publisherSheets = allSheets.filter(
          (s) =>
            normalize(s.publisher) === normalize(publisherName)
        );

        const advertiserList = [
          ...new Set(
            publisherSheets.map(
              (s) => s.advertiser || "Unknown Advertiser"
            )
          ),
        ];

        setAdvertisers(advertiserList);
      } catch (err) {
        console.error("❌ Advertiser fetch error:", err);
      }
    };

    fetchAdvertisers();
  }, [publisherName]);

  /* ===== RUN REPORT ===== */
  const handleViewReport = async () => {
    try {
      if (!selectedAdvertiser || !fromDate || !toDate) {
        alert("Please select advertiser and date range");
        return;
      }

      const from = parseDate(fromDate);
      const to = parseDate(toDate);

      const res = await axios.get(
        "http://localhost:5000/api/getalldata"
      );

      const allSheets = [
        ...(res.data?.sheets || []),
        ...(res.data?.genealogySheets || []),
      ];

      const filteredSheets = allSheets.filter(
        (sheet) =>
          normalize(sheet.publisher) === normalize(publisherName) &&
          normalize(sheet.advertiser) ===
            normalize(selectedAdvertiser)
      );

      const reportMap = {};

      filteredSheets.forEach((sheet) => {
        const key = sheet.advertiser;

        if (!reportMap[key]) {
          reportMap[key] = {
            Campaign: `${publisherName} | ${key}`,
            Views: 0,
            Clicks: 0,
            Revenue: 0,
            sheetIds: [],
          };
        }

        reportMap[key].sheetIds.push(sheet._id);

        (sheet.data || []).forEach((row) => {
          const rowDate = getRowDate(
            Object.fromEntries(
              Object.entries(row).map(([k, v]) => [
                k.toLowerCase(),
                v,
              ])
            )
          );

          if (!rowDate || rowDate < from || rowDate > to)
            return;

          const impressions =
            Number(row.impressions || row.views || 0) || 0;
          const clicks =
            Number(row.clicks || row.click || 0) || 0;
          const cpm = Number(row.cpm || 0);
          const cpc = Number(row.cpc || 0);

          let revenue = 0;
          if (cpc > 0) revenue = clicks * cpc;
          else if (cpm > 0)
            revenue = (impressions / 1000) * cpm;
          else revenue = (impressions / 1000) * 1.5;

          reportMap[key].Views += impressions;
          reportMap[key].Clicks += clicks;
          reportMap[key].Revenue += revenue;
        });
      });

      const finalData = Object.values(reportMap);

      setCampaigns(finalData);

      setTotals({
        impressions: finalData.reduce(
          (a, b) => a + b.Views,
          0
        ),
        clicks: finalData.reduce(
          (a, b) => a + b.Clicks,
          0
        ),
        revenue: finalData
          .reduce((a, b) => a + b.Revenue, 0)
          .toFixed(2),
      });
    } catch (err) {
      console.error("❌ Report error:", err);
    }
  };

  const handleView = (sheetIds) =>
    navigate("/viewuploads", { state: { sheetIds } });

  const handleDownload = (sheetIds) =>
    navigate("/downloadsheets", { state: { sheetIds } });

  return (
    <div style={{ ...styles.card, padding: "30px" }}>
      <h3>📊 Run Advertiser Reports</h3>

      {/* ===== FILTER BAR ===== */}
      <div style={filterBar}>
        <select
          value={selectedAdvertiser}
          onChange={(e) => setSelectedAdvertiser(e.target.value)}
          style={filterInput}
        >
          <option value="">Select Advertiser</option>
          {advertisers.map((a, i) => (
            <option key={i} value={a}>
              {a}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          style={filterInput}
        />

        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          style={filterInput}
        />

        <button style={viewBtn} onClick={handleViewReport}>
          View Report
        </button>
      </div>

      {/* ===== SUMMARY ===== */}
      {campaigns.length > 0 && (
        <div style={summaryRow}>
          <Summary title="Impressions" value={totals.impressions} />
          <Summary title="Clicks" value={totals.clicks} />
          <Summary
            title="Revenue"
            value={`$${totals.revenue}`}
          />
        </div>
      )}

      {/* ===== TABLE ===== */}
      {campaigns.length > 0 && (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Campaign</th>
              <th style={styles.th}>Impressions</th>
              <th style={styles.th}>Clicks</th>
              <th style={styles.th}>Revenue</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((row, i) => (
              <tr key={i}>
                <td style={styles.td}>{row.Campaign}</td>
                <td style={styles.td}>{row.Views}</td>
                <td style={styles.td}>{row.Clicks}</td>
                <td style={styles.td}>
                  ${row.Revenue.toFixed(2)}
                </td>
                <td style={styles.td}>
                  <button
                    style={{ ...btn, background: "#007bff" }}
                    onClick={() => handleView(row.sheetIds)}
                  >
                    View
                  </button>
                  <button
                    style={{ ...btn, background: "#ff4d4f" }}
                    onClick={() =>
                      handleDownload(row.sheetIds)
                    }
                  >
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

/* ===== UI HELPERS ===== */
const Summary = ({ title, value }) => (
  <div style={summaryCard}>
    <h4>{title}</h4>
    <p>{value}</p>
  </div>
);

/* ===== STYLES ===== */
const filterBar = {
  display: "flex",
  gap: "12px",
  marginBottom: "25px",
  flexWrap: "wrap",
};

const filterInput = {
  padding: "8px 12px",
  borderRadius: "6px",
};

const viewBtn = {
  padding: "8px 16px",
  borderRadius: "6px",
  border: "none",
  background: "#01303f",
  color: "#fff",
  cursor: "pointer",
  fontWeight: "600",
};

const summaryRow = {
  display: "flex",
  gap: "20px",
  marginBottom: "25px",
  flexWrap: "wrap",
};

const summaryCard = {
  background: "#fff",
  padding: "15px 25px",
  borderRadius: "12px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  minWidth: "180px",
  textAlign: "center",
};

const btn = {
  padding: "6px 12px",
  marginRight: "6px",
  border: "none",
  borderRadius: "6px",
  color: "#fff",
  cursor: "pointer",
};

export default Uploads;
