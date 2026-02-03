// import React, { useEffect, useState } from "react";
// import "./mtd.css";

// /* 🔗 LIVE GOOGLE SHEET API */
// const SHEET_API_URL =
//   "https://script.google.com/macros/s/AKfycbzDKkMslmU8O2Pu3KbFJ-Y2j-yWXS7Aqki4x0GzkkfS3Lc5XWHbKz9_oONzvUi375MXBQ/exec";

// /* ================= HELPERS ================= */

// const normalize = (v) =>
//   String(v || "")
//     .replace(/\u00A0/g, " ")
//     .replace(/\s+/g, " ")
//     .trim()
   

// const formatMoney = (val) => {
//   if (val === null || val === undefined || val === "") return "$0.00";

//   if (typeof val === "number") {
//     return `$${val.toLocaleString("en-US", {
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2,
//     })}`;
//   }

//   return String(val).trim();
// };

// /* ================= COMPONENT ================= */

// const AdvertiserDashboardHeader = () => {
//   const [metrics, setMetrics] = useState({
//     booked: "$0.00",
//     mtd: "$0.00",
//     forecasted: "$0.00",
//     earned: "$0.00",
//     projected: "$0.00",
//   });

// //   const jwt = JSON.parse(localStorage.getItem("jwt"));
// //   const userName = jwt?.user?.name;

// // console.log(userName);

//   useEffect(() => {
  

//     const fetchSheetData = async () => {
//       try {
//         const res = await fetch(SHEET_API_URL);
//         const rows = await res.json();
// console.log(rows,"rows");

//         if (!Array.isArray(rows)) return;

//         const matchedRow = rows.find(
//           (row) => normalize(row["Sales Rep"]) === normalize("Josh")
//         );

//         if (!matchedRow) {
//           console.warn("No data found for:", "Josh");
//           return;
//         }

//         setMetrics({
//           booked: formatMoney(matchedRow["Booked Revenue"]),
//           mtd: formatMoney(matchedRow["MTD Revenue"]),
//           forecasted: formatMoney(matchedRow["Forecasted Revenue"]),
//           earned: formatMoney(matchedRow["Earned Commission"]),
//           projected: formatMoney(matchedRow["Projected Commission"]),
//         });
//       } catch (err) {
//         console.error("Failed to fetch sheet data", err);
//       }
//     };

//     fetchSheetData();
//   }, ["Josh"]);

//   return (
//     <div className="adv-dashboard">
//       <div className="welcome-card">
//         <p className="welcome-text">
//           Welcome <span>{"Josh"}</span>
//         </p>
//       </div>

//       <div className="metric-row">
//         <MetricCard title="Booked Revenue" value={metrics.booked} color="yellow" />
//         <MetricCard title="MTD Revenue" value={metrics.mtd} color="green" />
//         <MetricCard title="Forecasted Revenue" value={metrics.forecasted} color="red" />
//         <MetricCard title="Earned Commission" value={metrics.earned} color="blue" />
//         <MetricCard title="Projected Commission" value={metrics.projected} color="sky" />
//       </div>
//     </div>
//   );
// };

// export default AdvertiserDashboardHeader;

// /* ================= CARD ================= */

// const MetricCard = ({ title, value, color }) => (
//   <div className={`metric-card ${color}`}>
//     <h2>{value}</h2>
//     <p>{title}</p>
//   </div>
// );

// import React, { useEffect, useState } from "react";
// import "./mtd.css";

// /* ✅ ALWAYS USE /exec URL */
// const SHEET_API_URL =
//   "https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLianWtyNNj4IFA5NkGaF064kDyug4mlck1_hT2qMt0GFhqHjFR6_UjsDaT6DCYqZQCcESHn7D3Wesk-MC6OBipcpktaEB52zF_y1AtB9LoJHTbFLtrp2RYBEHQqmOpBy4Okr03Ymlj3C9Ix-muCU4HtxtKscsPNOREAfRcDR-sw8D0j5YJMcnB_OMOwA6QmF_3c3Jn507Dhd4w138QQTDfEG8cosSCdq1Ji7R3VmdA1C-OsNW6I8QZ5pITYaQWBrHzuYEVzEJ8-BTVKpq-BvD7TtG-W6g&lib=MKVdzPnKNYXM0POvhzS8zIUw9ezPKz0cG";

// /* ================= HELPERS ================= */

// const normalize = (v) =>
//   String(v || "")
//     .replace(/\u00A0/g, " ")
//     .replace(/\s+/g, " ")
//     .trim()
//     .toLowerCase();

// const money = (v) =>
//   v
//     ? `$${Number(v).toLocaleString("en-US", {
//         minimumFractionDigits: 2,
//       })}`
//     : "$0.00";

// /* ================= COMPONENT ================= */

// const AdvertiserDashboardHeader = () => {
//   const [metrics, setMetrics] = useState({
//     booked: "$0.00",
//     mtd: "$0.00",
//     forecasted: "$0.00",
//     earned: "$0.00",
//     projected: "$0.00",
//   });

//   const jwt = JSON.parse(localStorage.getItem("jwt"));
//   const userName = "Josh";

//   useEffect(() => {
//     if (!userName) return;

//     async function fetchSheetData() {
//       try {
//         const res = await fetch(SHEET_API_URL, {
//           method: "GET",
//           redirect: "follow", // 🔥 VERY IMPORTANT
//         });
// console.log(res);

//         const text = await res.text(); // 🔥 MUST
//         const rows = JSON.parse(text); // 🔥 MANUAL PARSE

//         console.log("RAW RESPONSE:", text);
//         console.log("PARSED ROWS:", rows[18]);

//         if (!Array.isArray(rows)) {
//           console.error("Response is not array");
//           return;
//         }

//         const matchedRow = rows.find(
//           (r) => normalize(r["Sales Rep"]) === normalize(userName)
//         );

//         if (!matchedRow) {
//           console.warn("No data found for:", userName);
//           return;
//         }

//         setMetrics({
//           booked: money(matchedRow["Booked Revenue"]),
//           mtd: money(matchedRow["MTD Revenue"]),
//           forecasted: money(matchedRow["Forecasted Revenue"]),
//           earned: money(matchedRow["Earned Commission"]),
//           projected: money(matchedRow["Projected Commission"]),
//         });
//       } catch (err) {
//         console.error("Sheet fetch failed", err);
//       }
//     }

//     fetchSheetData();
//   }, [userName]);

//   return (
//     <div className="adv-dashboard">
//       <div className="welcome-card">
//         <p className="welcome-text">
//           Welcome <span>{userName}</span>
//         </p>
//       </div>

//       <div className="metric-row">
//         <MetricCard title="Booked Revenue" value={metrics.booked} color="yellow" />
//         <MetricCard title="MTD Revenue" value={metrics.mtd} color="green" />
//         <MetricCard
//           title="Forecasted Revenue"
//           value={metrics.forecasted}
//           color="red"
//         />
//         <MetricCard
//           title="Earned Commission"
//           value={metrics.earned}
//           color="blue"
//         />
//         <MetricCard
//           title="Projected Commission"
//           value={metrics.projected}
//           color="sky"
//         />
//       </div>
//     </div>
//   );
// };

// export default AdvertiserDashboardHeader;

// /* ================= CARD ================= */

// const MetricCard = ({ title, value, color }) => (
//   <div className={`metric-card ${color}`}>
//     <h2>{value}</h2>
//     <p>{title}</p>
//   </div>
// );


// import React, { useEffect, useState } from "react";
// import "./mtd.css";
// import { useNavigate } from "react-router-dom";

// /* ✅ ALWAYS USE /exec URL */
// const SHEET_API_URL =
//   "https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLianWtyNNj4IFA5NkGaF064kDyug4mlck1_hT2qMt0GFhqHjFR6_UjsDaT6DCYqZQCcESHn7D3Wesk-MC6OBipcpktaEB52zF_y1AtB9LoJHTbFLtrp2RYBEHQqmOpBy4Okr03Ymlj3C9Ix-muCU4HtxtKscsPNOREAfRcDR-sw8D0j5YJMcnB_OMOwA6QmF_3c3Jn507Dhd4w138QQTDfEG8cosSCdq1Ji7R3VmdA1C-OsNW6I8QZ5pITYaQWBrHzuYEVzEJ8-BTVKpq-BvD7TtG-W6g&lib=MKVdzPnKNYXM0POvhzS8zIUw9ezPKz0cG";

// /* ================= HELPERS ================= */

// const normalize = (v) =>
//   String(v || "")
//     .replace(/\u00A0/g, " ")
//     .replace(/\s+/g, " ")
//     .trim()
//     .toLowerCase();

// const money = (v) =>
//   v
//     ? `$${Number(v).toLocaleString("en-US", {
//         minimumFractionDigits: 2,
//       })}`
//     : "$0.00";

// /* ================= COMPONENT ================= */

// const AdvertiserDashboardHeader = () => {
//     const navigate=useNavigate()
//   const [metrics, setMetrics] = useState({
//     booked: "$0.00",
//     mtd: "$0.00",
//     forecasted: "$0.00",
//     earned: "$0.00",
//     projected: "$0.00",
//   });
//   const jwt = JSON.parse(localStorage.getItem("jwt"));
//   const userName =jwt.user.name // 🔥 replace with auth user if needed

//   useEffect(() => {
//     if (!userName) return;

//     async function fetchSheetData() {
//       try {
//         const res = await fetch(SHEET_API_URL, {
//           method: "GET",
//           redirect: "follow",
//         });

//         const text = await res.text(); // 🔥 IMPORTANT
//         const rows = JSON.parse(text); // 🔥 2D ARRAY

//         console.log("RAW ROWS:", rows);

//         if (!Array.isArray(rows)) {
//           console.error("Sheet response is not an array");
//           return;
//         }

//         /* ================= FIND SALES REP TABLE ================= */

//         const salesHeaderIndex = rows.findIndex((row) =>
//           row.some((cell) => normalize(cell) === "sales rep")
//         );

//         if (salesHeaderIndex === -1) {
//           console.error("Sales Rep header not found");
//           return;
//         }

//         /* ================= FIND USER ROW ================= */

//         const dataRows = rows.slice(salesHeaderIndex + 1);

//         const userRow = dataRows.find(
//           (row) => normalize(row[1]) === normalize(userName)
//         );

//         if (!userRow) {
//           console.warn("No data found for:", userName);
//           return;
//         }

//         console.log("MATCHED USER ROW:", userRow[2]);

//         /* ================= SET METRICS ================= */

//         setMetrics({
//           booked: money(userRow[2]),
//           mtd: money(userRow[3]),
//           forecasted: money(userRow[4]),
//           earned: money(userRow[5]),
//           projected: money(userRow[6]),
//         });
//       } catch (err) {
//         console.error("Sheet fetch failed", err);
//       }
//     }

//     fetchSheetData();
//   }, [userName]);

//   return (
//     <div className="adv-dashboard">
//       <div className="welcome-card">
//         <p className="welcome-text">
//           Welcome <span>{userName}</span>
//         </p>
//       </div>

//       <div className="metric-row">
//   <MetricCard
//     title="Booked Revenue"
//     value={metrics.booked}
//     color="yellow"
//     onClick={() =>
//       navigate("/mtd-details", {
//         state: { metric: "booked" },
//       })
//     }
//   />

//   <MetricCard
//     title="MTD Revenue"
//     value={metrics.mtd}
//     color="green"
//     onClick={() =>
//       navigate("/mtd-details", {
//         state: { metric: "mtd" },
//       })
//     }
//   />

//   <MetricCard
//     title="Forecasted Revenue"
//     value={metrics.forecasted}
//     color="red"
//     onClick={() =>
//       navigate("/mtd-details", {
//         state: { metric: "forecasted" },
//       })
//     }
//   />

//   <MetricCard
//     title="Earned Commission"
//     value={metrics.earned}
//     color="blue"
//     onClick={() =>
//       navigate("/mtd-details", {
//         state: { metric: "earned" },
//       })
//     }
//   />

//   <MetricCard
//     title="Projected Commission"
//     value={metrics.projected}
//     color="sky"
//     onClick={() =>
//       navigate("/mtd-details", {
//         state: { metric: "projected" },
//       })
//     }
//   />
// </div>
//     </div>
//   );
// };

// export default AdvertiserDashboardHeader;

// /* ================= CARD ================= */

// const MetricCard = ({ title, value, color }) => (
//   <div className={`metric-card ${color}`}>
//     <h2>{value}</h2>
//     <p>{title}</p>
//   </div>
// );

// import React, { useEffect, useState } from "react";
// import "./mtd.css";
// import { useNavigate } from "react-router-dom";
// import SheetTable from "./Mtd-Detail";

// /* ✅ ALWAYS USE /exec URL */
// const SHEET_API_URL =
//   "https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLianWtyNNj4IFA5NkGaF064kDyug4mlck1_hT2qMt0GFhqHjFR6_UjsDaT6DCYqZQCcESHn7D3Wesk-MC6OBipcpktaEB52zF_y1AtB9LoJHTbFLtrp2RYBEHQqmOpBy4Okr03Ymlj3C9Ix-muCU4HtxtKscsPNOREAfRcDR-sw8D0j5YJMcnB_OMOwA6QmF_3c3Jn507Dhd4w138QQTDfEG8cosSCdq1Ji7R3VmdA1C-OsNW6I8QZ5pITYaQWBrHzuYEVzEJ8-BTVKpq-BvD7TtG-W6g&lib=MKVdzPnKNYXM0POvhzS8zIUw9ezPKz0cG";

// /* ================= HELPERS ================= */

// const normalize = (v) =>
//   String(v || "")
//     .replace(/\u00A0/g, " ")
//     .replace(/\s+/g, " ")
//     .trim()
//     .toLowerCase();

// const money = (v) =>
//   v
//     ? `$${Number(v).toLocaleString("en-US", {
//         minimumFractionDigits: 2,
//       })}`
//     : "$0.00";

// /* ================= COMPONENT ================= */

// const AdvertiserDashboardHeader = () => {
//   const navigate = useNavigate(); // kept intentionally (no breaking changes)

//   const [metrics, setMetrics] = useState({
//     booked: "$0.00",
//     mtd: "$0.00",
//     forecasted: "$0.00",
//     earned: "$0.00",
//     projected: "$0.00",
//   });

//   const [selectedMetric, setSelectedMetric] = useState(null); // 🔥 NEW

//   const jwt = JSON.parse(localStorage.getItem("jwt"));
//   const userName = jwt.user.name;

//   useEffect(() => {
//     if (!userName) return;

//     async function fetchSheetData() {
//       try {
//         const res = await fetch(SHEET_API_URL, {
//           method: "GET",
//           redirect: "follow",
//         });

//         const text = await res.text();
//         const rows = JSON.parse(text);

//         if (!Array.isArray(rows)) return;

//         const salesHeaderIndex = rows.findIndex((row) =>
//           row.some((cell) => normalize(cell) === "sales rep")
//         );

//         if (salesHeaderIndex === -1) return;

//         const dataRows = rows.slice(salesHeaderIndex + 1);

//         const userRow = dataRows.find(
//           (row) => normalize(row[1]) === normalize(userName)
//         );

//         if (!userRow) return;

//         setMetrics({
//           booked: money(userRow[2]),
//           mtd: money(userRow[3]),
//           forecasted: money(userRow[4]),
//           earned: money(userRow[5]),
//           projected: money(userRow[6]),
//         });
//       } catch (err) {
//         console.error("Sheet fetch failed", err);
//       }
//     }

//     fetchSheetData();
//   }, [userName]);

//   return (
//     <div className="adv-dashboard">
//       <div className="welcome-card">
//         <p className="welcome-text">
//           Welcome <span>{userName}</span>
//         </p>
//       </div>

//       <div className="metric-row">
//         <MetricCard
//           title="Booked Revenue"
//           value={metrics.booked}
//           color="yellow"
//           onClick={() => setSelectedMetric("booked")}
//         />

//         <MetricCard
//           title="MTD Revenue"
//           value={metrics.mtd}
//           color="green"
//           onClick={() => setSelectedMetric("mtd")}
//         />

//         <MetricCard
//           title="Forecasted Revenue"
//           value={metrics.forecasted}
//           color="red"
//           onClick={() => setSelectedMetric("forecasted")}
//         />

//         <MetricCard
//           title="Earned Commission"
//           value={metrics.earned}
//           color="blue"
//           onClick={() => setSelectedMetric("earned")}
//         />

//         <MetricCard
//           title="Projected Commission"
//           value={metrics.projected}
//           color="sky"
//           onClick={() => setSelectedMetric("projected")}
//         />
//       </div>

//       {/* 🔥 OPENS UNDER SAME COMPONENT */}
//       {selectedMetric && (
//         <div style={{ marginTop: "30px" }}>
//           <SheetTable selectedMetric={selectedMetric} />
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdvertiserDashboardHeader;

// /* ================= CARD ================= */

// const MetricCard = ({ title, value, color, onClick }) => (
//   <div
//     className={`metric-card ${color}`}
//     onClick={onClick}
//     style={{ cursor: "pointer" }}
//   >
//     <h2>{value}</h2>
//     <p>{title}</p>
//   </div>
// );
import React, { useEffect, useState } from "react";
import "./mtd.css";
import { useNavigate } from "react-router-dom";
import SheetTable from "./Mtd-Detail";

/* ✅ ALWAYS USE /exec URL */
const SHEET_API_URL =
  "https://script.google.com/macros/s/AKfycbzXkMSTGvDmbK5D3JBT6MbaYPcJqLFlJq1truRqnbD0oPmH6rzqrfkWmukzba_GL3ff8Q/exec";

/* ================= HELPERS ================= */

const normalize = (v) =>
  String(v || "")
    .replace(/\u00A0/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

const money = (v) =>
  v
    ? `$${Number(v).toLocaleString("en-US", {
        minimumFractionDigits: 2,
      })}`
    : "$0.00";

/* ================= COMPONENT ================= */

const AdvertiserDashboardHeader = () => {
  const navigate = useNavigate();

  const [metrics, setMetrics] = useState({
    booked: "$0.00",
    mtd: "$0.00",
    forecasted: "$0.00",
    earned: "$0.00",
    projected: "$0.00",
  });

  const [loading, setLoading] = useState(true); // ✅ NEW
  const [selectedMetric, setSelectedMetric] = useState(null);

  const jwt = JSON.parse(localStorage.getItem("jwt"));
  const userName = jwt.user.name;

  useEffect(() => {
    if (!userName) return;

    async function fetchSheetData() {
      try {
        const res = await fetch(SHEET_API_URL);
        const text = await res.text();
        const rows = JSON.parse(text);

        if (!Array.isArray(rows)) return;

        const salesHeaderIndex = rows.findIndex((row) =>
          row.some((cell) => normalize(cell) === "sales rep")
        );

        if (salesHeaderIndex === -1) return;

        const dataRows = rows.slice(salesHeaderIndex + 1);

        const userRow = dataRows.find(
          (row) => normalize(row[1]) === normalize(userName)
        );

        if (!userRow) return;

        setMetrics({
          booked: money(userRow[2]),
          mtd: money(userRow[3]),
          forecasted: money(userRow[4]),
          earned: money(userRow[5]),
          projected: money(userRow[6]),
        });
      } catch (err) {
        console.error("Sheet fetch failed", err);
      } finally {
        setLoading(false); // ✅ stop skeleton
      }
    }

    fetchSheetData();
  }, [userName]);

  return (
    <div className="adv-dashboard">
      {/* Welcome */}
      <div className="welcome-card">
        {loading ? (
          <div className="skeleton skeleton-text-lg" />
        ) : (
          <p className="welcome-text">
            Welcome <span>{userName}</span>
          </p>
        )}
      </div>

      {/* Metrics */}
      <div className="metric-row">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <SkeletonMetricCard key={i} />
          ))
        ) : (
          <>
            <MetricCard
              title="Booked Revenue"
              value={metrics.booked}
              color="yellow"
              onClick={() => setSelectedMetric("booked")}
            />
            <MetricCard
              title="MTD Revenue"
              value={metrics.mtd}
              color="green"
              onClick={() => setSelectedMetric("mtd")}
            />
            <MetricCard
              title="Forecasted Revenue"
              value={metrics.forecasted}
              color="red"
              onClick={() => setSelectedMetric("forecasted")}
            />
            <MetricCard
              title="Earned Commission"
              value={metrics.earned}
              color="blue"
              onClick={() => setSelectedMetric("earned")}
            />
            <MetricCard
              title="Projected Commission"
              value={metrics.projected}
              color="sky"
              onClick={() => setSelectedMetric("projected")}
            />
          </>
        )}
      </div>

      {/* Details */}
      {selectedMetric && !loading && (
        <div style={{ marginTop: "30px" }}>
          <SheetTable selectedMetric={selectedMetric} />
        </div>
      )}

      {/* Skeleton styles */}
      <style>
        {`
          .skeleton {
            background: linear-gradient(
              90deg,
              #e5e7eb 25%,
              #f3f4f6 37%,
              #e5e7eb 63%
            );
            background-size: 400% 100%;
            animation: shimmer 1.4s ease infinite;
            border-radius: 8px;
          }

          .skeleton-text-lg {
            height: 22px;
            width: 220px;
          }

          .skeleton-metric {
            height: 90px;
            width: 180px;
            border-radius: 14px;
          }

          @keyframes shimmer {
            0% { background-position: 100% 0; }
            100% { background-position: -100% 0; }
          }
        `}
      </style>
    </div>
  );
};

export default AdvertiserDashboardHeader;

/* ================= CARDS ================= */

const MetricCard = ({ title, value, color, onClick }) => (
  <div
    className={`metric-card ${color}`}
    onClick={onClick}
    style={{ cursor: "pointer" }}
  >
    <h2>{value}</h2>
    <p>{title}</p>
  </div>
);

/* ================= SKELETON CARD ================= */

const SkeletonMetricCard = () => (
  <div className="metric-card">
    <div className="skeleton skeleton-metric" />
  </div>
);