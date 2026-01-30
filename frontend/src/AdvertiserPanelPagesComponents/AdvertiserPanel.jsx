// import React, { useState, useEffect } from "react";
// import MainDashboard from "./RealDashBoard";
// import Summary from "./Summary";
// import OttReport from "./OttReport";
// import AdWidget from "./Advertise";
// import VideoReport from "./NewVideoReport";
// import AdvertiserDisplayData from "../DisplayData";
// import DailyReports from "../DailyReportsofAll";

// const AdvertiserPanel = () => {
//   const [activeTab, setActiveTab] = useState("overview");

//   const renderTab = () => {
//     switch (activeTab) {
//       case "overview":
//         return <Summary />;

//       case "Daily Report":
//         return <DailyReports />;

//       case "OTT":
//         return <OttReport />;

//       case "uploads":
//         return <MainDashboard />;

//       case "Display Report":
//         return <AdvertiserDisplayData />;

//       case "Video Report":
//         return <VideoReport />;

//       case "Ad Widget":
//         return <AdWidget />;

//       default:
//         return null;
//     }
//   };

//   return (
//     <div style={styles.wrapper}>
//       {/* ✅ FIXED SIDEBAR */}
//       <aside style={styles.sidebar}>
//         <h2 style={styles.logo}>Advertiser Panel</h2>

//         {[
//           "overview",
        
//           "OTT",
         
//           "Display Report",
//           "Video Report",
//           "Ad Widget",
//         ].map((tab) => (
//           <button
//             key={tab}
//             style={{
//               ...styles.navBtn,
//               background: activeTab === tab ? "#003febff" : "transparent",
//             }}
//             onClick={() => setActiveTab(tab)}
//           >
//             {tab}
//           </button>
//         ))}
//       </aside>

//       {/* ✅ MAIN CONTENT WITH FIXED SPACING */}
//       <main style={styles.main}>{renderTab()}</main>
//     </div>
//   );
// };

// const styles = {
//   wrapper: {
//     display: "flex",
//     width: "100vw",   // ✅ FIXED
//     minHeight: "100vh",
//     background: "#f4f6f8",
//     overflowX: "hidden", // ✅ Fix horizontal scroll
//   },

//   sidebar: {
//     width: "240px",
//     background: "#000302ff",
//     color: "#fff",
//     display: "flex",
//     flexDirection: "column",
//     padding: "20px",
//     position: "fixed", // stays fixed
//     left: 0,
//     top: 0,
//     height: "100vh",
//     boxShadow: "2px 0 10px rgba(0,0,0,0.2)",
//   },

//   logo: {
//     marginBottom: 20,
//     color: "#fff",
//     fontSize: "20px",
//     fontWeight: "bold",
//   },

//   main: {
//     marginLeft: "240px", // ✅ MUST be added for fixed sidebar
//     width: "calc(100% - 240px)",
//     padding: "30px",
//     overflowY: "auto",
//     overflowX: "hidden",
//   },

//   navBtn: {
//     color: "#fff",
//     border: "none",
//     padding: "10px 12px",
//     width: "100%",
//     textAlign: "left",
//     cursor: "pointer",
//     borderRadius: "8px",
//     marginBottom: "8px",
//     fontSize: "16px",
//   },
// };

// export default AdvertiserPanel;
import React, { useState } from "react";
import MainDashboard from "./RealDashBoard";
import Summary from "./Summary";
import OttReport from "./OttReport";
import AdWidget from "./Advertise";
import VideoReport from "./NewVideoReport";
import AdvertiserDisplayData from "../DisplayData";
import DailyReports from "../DailyReportsofAll";
import Dashboard from "./Dashboard"
import AdvertiserDashboard from "./Advertiser-Detailed"
const AdvertiserPanel = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const renderTab = () => {
    switch (activeTab) {
      case "summary":
        return <Summary />;
    case "overview":
      return <Dashboard/>

      case "Daily Report":
        return <DailyReports />;

      case "OTT":
        return <OttReport />;

      case "uploads":
        return <MainDashboard />;

      case "Display Report":
        return <AdvertiserDisplayData />;

      case "Video Report":
        return <VideoReport />;

      case "Campaign-Performance":
        return <AdvertiserDashboard/>;

      default:
        return null;
    }
  };

  return (
    <div style={styles.wrapper}>
      {/* ✅ TOP NAVBAR */}
      <nav style={styles.navbar}>
        <h2 style={styles.logo}>Advertiser Panel</h2>

        <div style={styles.navLinks}>
          {[
            "overview",
            "summary",
            "OTT",
            "Display Report",
            "Video Report",
            "Campaign-Performance",
          ].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                ...styles.navBtn,
                ...(activeTab === tab && styles.activeNavBtn),
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </nav>

      {/* ✅ MAIN CONTENT */}
      <main style={styles.main}>{renderTab()}</main>
    </div>
  );
};

export default AdvertiserPanel;
const styles = {
  wrapper: {
    width: "100vw",
    minHeight: "100vh",
    background: "#f4f6f8",
    overflowX: "hidden",
  },

  /* Navbar */
  navbar: {
    height: "64px",
    background: "#813dff",
    display: "flex",
    alignItems: "center",
    padding: "0 20px",
    gap: "20px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
  },

  logo: {
    color: "#fff",
    fontSize: "20px",
    fontWeight: "bold",
    whiteSpace: "nowrap",
  },

  navLinks: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },

  navBtn: {
    color: "white",
    border: "none",
    padding: "8px 14px",
    cursor: "pointer",
    borderRadius: "8px",
    fontSize: "15px",
    background: "transparent",
    transition: "0.2s ease",
  },

  activeNavBtn: {
    background: "#dffa33",
    fontWeight: "600",
    color:"black"
  },

  /* Main Content */
  main: {
    padding: "30px",
    overflowY: "auto",
  },
};
