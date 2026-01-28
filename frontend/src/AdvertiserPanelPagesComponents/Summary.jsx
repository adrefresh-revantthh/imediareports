// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   Legend,
//   PieChart,
//   Pie,
//   Cell,
// } from "recharts";

// const COLORS = ["#0096c7", "#f50808ff", "#000000ff"];
// const ROWS_PER_PAGE = 7;

// const normalize = (s = "") => s.trim().toLowerCase().replace(/\s+/g, "");

// export default function SummaryReport() {
//   const [summaryData, setSummaryData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [expanded, setExpanded] = useState(false);

//   const fetchingData = async () => {
//     try {
//       const userToken = JSON.parse(localStorage.getItem("jwt"))?.token;
//       if (!userToken) return console.error("⚠️ No JWT token found");

//       const res = await axios.get("http://localhost:5000/api/getallsheets", {
//         headers: { Authorization: `Bearer ${userToken}` },
//       });

//       const sheets = Array.isArray(res.data) ? res.data : [];
//       const summarySheet = sheets.find((s) => {
//         const name = normalize(s.name || "");
//         return ["summary", "overall", "budgetsummary", "summaryreport"].some((k) =>
//           name.includes(k)
//         );
//       });

//       if (!summarySheet?.data?.length) {
//         console.warn("⚠️ No Summary sheet found.");
//         return;
//       }

//       // 🧹 Clean and normalize data
//       const cleaned = summarySheet.data
//         .map((item) => {
//           const newItem = {};
//           Object.keys(item).forEach((k) => {
//             if (k && !/^(__empty|unnamed|blank|column)/i.test(k.trim()))
//               newItem[k.trim()] = item[k];
//           });

//           const spendKey = Object.keys(newItem).find((k) =>
//             normalize(k).includes("spend")
//           );
//           const budgetKey = Object.keys(newItem).find((k) =>
//             normalize(k).includes("budget")
//           );
//           const remainingKey = Object.keys(newItem).find((k) =>
//             ["remain", "reamin", "balance", "left"].some((term) =>
//               normalize(k).includes(term)
//             )
//           );

//           // ✅ Auto calculate remaining if missing
//           if (!remainingKey && spendKey && budgetKey) {
//             const spend = Number(newItem[spendKey]) || 0;
//             const total = Number(newItem[budgetKey]) || 0;
//             newItem["Remaining"] = total - spend;
//           } else if (remainingKey) {
//             newItem["Remaining"] = Number(newItem[remainingKey]) || 0;
//           }

//           return newItem;
//         })
//         .filter((row) => Object.keys(row).length > 0);

//       setSummaryData(cleaned);
//       setFilteredData(cleaned);
//     } catch (error) {
//       console.error("🔥 Error fetching summary data:", error);
//     }
//   };

//   useEffect(() => {
//     fetchingData();
//   }, []);

//   const getNumber = (obj, key) => Number(obj[key]) || 0;

//   const totalSpend = filteredData.reduce((a, b) => a + getNumber(b, "Spend"), 0);
//   const totalBudget = filteredData.reduce(
//     (a, b) => a + getNumber(b, "Total Budget"),
//     0
//   );
//   const totalRemaining = filteredData.reduce(
//     (a, b) => a + getNumber(b, "Remaining"),
//     0
//   );

//   const donutData = [
//     { name: "Total Spend", value: totalSpend },
//     { name: "Total Budget", value: totalBudget },
//     { name: "Remaining", value: totalRemaining },
//   ];

//   const formatCurrency = (v) =>
//     typeof v === "number" && !isNaN(v)
//       ? `$${v.toLocaleString(undefined, {
//           minimumFractionDigits: 2,
//           maximumFractionDigits: 2,
//         })}`
//       : v;

//   const visibleRows = expanded
//     ? filteredData
//     : filteredData.slice(0, ROWS_PER_PAGE);

//   return (
//     <div
//       style={{
//         background: "linear-gradient(135deg,#f8fafc,#e0f2fe)",
//         padding: "30px",
//         borderRadius: "16px",
//         // fontFamily: "Poppins, sans-serif",
//         boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
//       }}
//     >
//       <h2
//         style={{
//           textAlign: "center",
//           marginBottom: 20,
//           background: "linear-gradient(90deg,#007bff,#00bfa6)",
//           WebkitBackgroundClip: "text",
//           WebkitTextFillColor: "transparent",
//         }}
//       >
//         💰 Summary Report Dashboard
//       </h2>

//       {/* ✅ KPI Summary */}
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "center",
//           flexWrap: "wrap",
//           gap: "15px",
//           marginBottom: "30px",
//         }}
//       >
//         <KpiCard label="Total Spend" value={formatCurrency(totalSpend)} />
//         <KpiCard label="Total Budget" value={formatCurrency(totalBudget)} />
//         <KpiCard label="Remaining" value={formatCurrency(totalRemaining)} />
//       </div>

//       {/* ✅ Bar Chart */}
//       <div style={{ width: "100%", height: 340, marginBottom: 40 }}>
//         <ResponsiveContainer>
//           <BarChart data={filteredData}>
//             <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
//             <XAxis dataKey="Platform" />
//             <YAxis />
//             <Tooltip formatter={(value) => formatCurrency(value)} />
//             <Legend />
//             <Bar
//               dataKey="Spend"
//               fill="#f50808ff"
//               barSize={35}
//               radius={[6, 6, 0, 0]}
//             />
//             <Bar
//               dataKey="Total Budget"
//               fill="#0096c7"
//               barSize={35}
//               radius={[6, 6, 0, 0]}
//             />
//             <Bar
//               dataKey="Remaining"
//               fill="#000000ff"
//               barSize={35}
//               radius={[6, 6, 0, 0]}
//             />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>

//       {/* ✅ Donut Chart */}
//       <div
//         style={{
//           background: "#fff",
//           padding: "20px",
//           borderRadius: "12px",
//           boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
//           marginBottom: "30px",
//         }}
//       >
//         <h4 style={{ textAlign: "center", marginBottom: "10px" }}>
//           Overall Budget Distribution
//         </h4>
//         <ResponsiveContainer width="100%" height={300}>
//           <PieChart>
//             <Pie
//               data={donutData}
//               dataKey="value"
//               nameKey="name"
//               cx="50%"
//               cy="50%"
//               innerRadius={70}
//               outerRadius={110}
//               paddingAngle={4}
//               label={({ name, percent }) =>
//                 `${name}: ${(percent * 100).toFixed(1)}%`
//               }
//             >
//               {donutData.map((entry, i) => (
//                 <Cell key={i} fill={COLORS[i % COLORS.length]} />
//               ))}
//             </Pie>
//             <Legend />
//             <Tooltip formatter={(value) => formatCurrency(value)} />
//           </PieChart>
//         </ResponsiveContainer>
//       </div>

//       {/* ✅ Data Table */}
//       <div style={{ background: "#fff", borderRadius: 10, padding: 20, overflowX: "auto" }}>
//         <table style={{ width: "100%", borderCollapse: "collapse" }}>
//           <thead>
//             <tr>
//               <th style={th}>Platform</th>
//               <th style={th}>Spend</th>
//               <th style={th}>Total Budget</th>
//               <th style={th}>Remaining</th>
//             </tr>
//           </thead>
//           <tbody>
//             {visibleRows.length ? (
//               visibleRows.map((item, i) => (
//                 <tr key={i}>
//                   <td style={td}>{item.Platform || "-"}</td>
//                   <td style={td}>{formatCurrency(getNumber(item, "Spend"))}</td>
//                   <td style={td}>{formatCurrency(getNumber(item, "Total Budget"))}</td>
//                   <td style={td}>{formatCurrency(getNumber(item, "Remaining"))}</td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan={4} style={{ textAlign: "center", padding: "10px", color: "#888" }}>
//                   ⚠️ No data found.
//                 </td>
//               </tr>
//             )}
//             {filteredData.length > 0 && (
//               <tr style={totalRow}>
//                 <td style={th}>TOTAL</td>
//                 <td style={th}>{formatCurrency(totalSpend)}</td>
//                 <td style={th}>{formatCurrency(totalBudget)}</td>
//                 <td style={th}>{formatCurrency(totalRemaining)}</td>
//               </tr>
//             )}
//           </tbody>
//         </table>

//         {/* View More / Less */}
//         {filteredData.length > ROWS_PER_PAGE && (
//           <div style={{ textAlign: "center", marginTop: 15 }}>
//             <button
//               onClick={() => setExpanded(!expanded)}
//               style={{
//                 background: "linear-gradient(90deg,#007bff,#00bfa6)",
//                 border: "none",
//                 color: "#fff",
//                 padding: "10px 20px",
//                 borderRadius: "6px",
//                 cursor: "pointer",
//                 fontWeight: 600,
//               }}
//             >
//               {expanded ? "View Less ▲" : "View More ▼"}
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// // ✅ KPI Card
// const KpiCard = ({ label, value }) => (
//   <div
//     style={{
//       background: "linear-gradient(90deg,#007bff,#00bfa6)",
//       color: "#fff",
//       padding: "15px 25px",
//       borderRadius: "10px",
//       minWidth: "160px",
//       textAlign: "center",
//       boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
//     }}
//   >
//     <div style={{ fontSize: "0.9rem", opacity: 0.9 }}>{label}</div>
//     <div style={{ fontWeight: 700, fontSize: "1.1rem" }}>{value}</div>
//   </div>
// );

// // ✅ Styles
// const th = {
//   padding: "10px",
//   border: "1px solid #ddd",
//   fontWeight: "600",
//   background: "#f1f5f9",
// };
// const td = {
//   padding: "10px",
//   border: "1px solid #ddd",
//   textAlign: "center",
// };
// const totalRow = {
//   background: "#e2e8f0",
//   fontWeight: "bold",
// };
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// 🎯 Best-representation palette
const COLORS = ["#EA4335", "#4285F4", "#34A853"]; // Spend, Budget, Remaining
const ROWS_PER_PAGE = 7;

const normalize = (s = "") => s.trim().toLowerCase().replace(/\s+/g, "");

export default function SummaryReport() {
  const [summaryData, setSummaryData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [expanded, setExpanded] = useState(false);

  const fetchingData = async () => {
    try {
      const userToken = JSON.parse(localStorage.getItem("jwt"))?.token;
      if (!userToken) return;

      const res = await axios.get("https://imediareports.onrender.com/api/getallsheets", {
        headers: { Authorization: `Bearer ${userToken}` },
      });

      const sheets = Array.isArray(res.data) ? res.data : [];
      const summarySheet = sheets.find((s) =>
        ["summary", "overall", "budgetsummary", "summaryreport"].some((k) =>
          normalize(s.name || "").includes(k)
        )
      );

      if (!summarySheet?.data?.length) return;

      const cleaned = summarySheet.data.map((item) => {
        const newItem = {};
        Object.keys(item).forEach((k) => {
          if (k && !/^(__empty|unnamed|blank|column)/i.test(k.trim()))
            newItem[k.trim()] = item[k];
        });

        if (!newItem.Remaining && newItem["Spend"] && newItem["Total Budget"]) {
          newItem.Remaining =
            Number(newItem["Total Budget"]) - Number(newItem["Spend"]);
        }
        return newItem;
      });

      setSummaryData(cleaned);
      setFilteredData(cleaned);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchingData();
  }, []);

  const getNumber = (obj, key) => Number(obj[key]) || 0;

  const totalSpend = filteredData.reduce((a, b) => a + getNumber(b, "Spend"), 0);
  const totalBudget = filteredData.reduce(
    (a, b) => a + getNumber(b, "Total Budget"),
    0
  );
  const totalRemaining = filteredData.reduce(
    (a, b) => a + getNumber(b, "Remaining"),
    0
  );

  const donutData = [
    { name: "Spend", value: totalSpend },
    { name: "Budget", value: totalBudget },
    { name: "Remaining", value: totalRemaining },
  ];

  const formatCurrency = (v) =>
    `$${Number(v || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const visibleRows = expanded
    ? filteredData
    : filteredData.slice(0, ROWS_PER_PAGE);

  return (
    <div style={container}>
      <h2 style={title}>💰 Summary Report Dashboard</h2>

      {/* KPI */}
      <div style={kpiGrid}>
        <Kpi label="Total Spend" value={formatCurrency(totalSpend)} color="#EA4335" />
        <Kpi label="Total Budget" value={formatCurrency(totalBudget)} color="#4285F4" />
        <Kpi label="Remaining" value={formatCurrency(totalRemaining)} color="#34A853" />
      </div>

      {/* Bar Chart */}
      <div style={{ width: "100%", height: 340 }}>
        <ResponsiveContainer>
          <BarChart data={filteredData}>
            <CartesianGrid stroke="#E0E0E0" strokeDasharray="3 3" />
            <XAxis dataKey="Platform" tick={{ fill: "#5F6368" }} />
            <YAxis tick={{ fill: "#5F6368" }} />
            <Tooltip formatter={formatCurrency} />
            <Legend />
            <Bar dataKey="Spend" fill="#EA4335" radius={[6, 6, 0, 0]} />
            <Bar dataKey="Total Budget" fill="#4285F4" radius={[6, 6, 0, 0]} />
            <Bar dataKey="Remaining" fill="#34A853" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Donut */}
      <div style={card}>
        <h4 style={{ textAlign: "center", color: "#202124" }}>
          Overall Budget Distribution
        </h4>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={donutData}
              dataKey="value"
              innerRadius={70}
              outerRadius={110}
              paddingAngle={4}
            >
              {donutData.map((_, i) => (
                <Cell key={i} fill={COLORS[i]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip formatter={formatCurrency} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Table */}
      <div style={tableCard}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={th}>Platform</th>
              <th style={th}>Spend</th>
              <th style={th}>Budget</th>
              <th style={th}>Remaining</th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((r, i) => (
              <tr key={i}>
                <td style={td}>{r.Platform}</td>
                <td style={td}>{formatCurrency(r.Spend)}</td>
                <td style={td}>{formatCurrency(r["Total Budget"])}</td>
                <td style={td}>{formatCurrency(r.Remaining)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredData.length > ROWS_PER_PAGE && (
          <div style={{ textAlign: "center", marginTop: 15 }}>
            <button style={btn} onClick={() => setExpanded(!expanded)}>
              {expanded ? "View Less ▲" : "View More ▼"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// 🔹 Components & Styles
const Kpi = ({ label, value, color }) => (
  <div style={{ ...kpiCard, borderLeft: `6px solid ${color}` }}>
    <div style={{ color: "#5F6368", fontSize: 13 }}>{label}</div>
    <div style={{ color, fontWeight: 700 }}>{value}</div>
  </div>
);

const container = {
  background: "#FFFFFF",
  padding: 30,
  borderRadius: 16,
};

const title = {
  textAlign: "center",
  color: "#202124",
  marginBottom: 20,
};

const kpiGrid = {
  display: "flex",
  justifyContent: "center",
  gap: 16,
  marginBottom: 30,
};

const kpiCard = {
  background: "#FFFFFF",
  padding: 16,
  borderRadius: 10,
  minWidth: 170,
  boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
};

const card = {
  background: "#FFFFFF",
  padding: 20,
  borderRadius: 12,
  marginBottom: 30,
};

const tableCard = {
  background: "#FFFFFF",
  padding: 20,
  borderRadius: 10,
};

const th = {
  padding: 10,
  border: "1px solid #E0E0E0",
  background: "#F8F9FA",
};

const td = {
  padding: 10,
  border: "1px solid #E0E0E0",
  textAlign: "center",
};

const btn = {
  background: "#4285F4",
  color: "#fff",
  padding: "10px 20px",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};
