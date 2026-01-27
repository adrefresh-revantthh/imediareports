

// import React, { useState } from "react";
// import Dashboard from "./PublisherDashboard";
// import Uploads from "./PublisherUploads";
// import Earnings from "./Earnings";
// import Settings from "./PublisherSettings";
// import { useNavigate } from "react-router-dom";

// const PublisherPanel = () => {
//   const [activeTab, setActiveTab] = useState("dashboard");
// const navigate=useNavigate()
//   return (
//     <div style={styles.wrapper}>
      
         

//       {/* Sidebar SHOULD ALWAYS stay on left – don't remove margin-left */}
//       <aside style={styles.sidebar}>
//         <div style={{justifyContent:"center",alignItems:"center"}}>
//       <button
//   onClick={() => navigate(-1)}
//   style={{
//     display: "flex",
//     alignItems: "center",
//     justifyContent:"center",
//     gap: "8px",
//     background: "#ffffffff",
//     color: "black",
//     padding: "10px 16px",
//     border: "none",
//     borderRadius: "8px",
//     cursor: "pointer",
//     fontSize: "16px",
//     fontWeight: 600,
//     marginBottom: "20px",
//     boxShadow: "0 3px 8px rgba(0,0,0,0.2)",
//     transition: "0.2s",
//     width:"15vw",
//     textAlign:"center"
//   }}

// >
//   <span style={{ fontSize: "30px", textAlign:"center" }}></span> Back
// </button>
// </div>
//         <h2 style={styles.logo}>Publisher Panel</h2>

//         {["dashboard", "uploads", "earnings", "settings"].map((tab) => (
//           <button
//             key={tab}
//             style={{
//               ...styles.navBtn,
//               background: activeTab === tab ? "#00C49F" : "transparent",
//             }}
//             onClick={() => setActiveTab(tab)}
//           >
//             {tab.charAt(0).toUpperCase() + tab.slice(1)}
//           </button>
//         ))}
//       </aside>

//       <main style={styles.main}>
//         {activeTab === "dashboard" && <Dashboard />}
//         {activeTab === "uploads" && <Uploads />}
//         {activeTab === "earnings" && <Earnings />}
//         {activeTab === "settings" && <Settings />}
//       </main>
//     </div>
//   );
// };
// const styles = {
//   wrapper: {
//     display: "flex",
//     height: "100vh",
//     width: "100vw",
//     background: "#f4f6f8",
//     margin: 0,
//     overflow: "hidden",
//   textAlign:"center"
//   },

//   sidebar: {
//     width: "250px",
//     background: "#01303f",
//     color: "#fff",
//     display: "flex",
//     flexDirection: "column",
//     padding: "20px",
//     position: "fixed",
//     top: 0,
//     left: 0,
//     bottom: 0,
//     height: "100vh",
//     boxShadow: "2px 0 8px rgba(0,0,0,0.2)",

//     /** 👉 APPLY CABINET GROTESK HERE **/
//     fontFamily: "Cabinet Grotesk, sans-serif",
//   },

//   main: {
//     fontFamily: "Cabinet Grotesk, sans-serif",
//     marginLeft: "240px",
//     flex: 1,
//     padding: "30px",
//     background: "#f4f6f8",
//     overflowY: "auto",
//     minHeight: "100vh",
//   },

//   logo: {
//     fontSize: "20px",
//     marginBottom: "25px",

//     /** 👉 Make header bold like Muffins UI **/
//     fontWeight: 700,
//     letterSpacing: "-0.3px",
//   },

//   navBtn: {
//     color: "#fff",
//     border: "none",
//     background: "transparent",
//     padding: "10px 15px",
//     borderRadius: "6px",
//     width: "100%",
//     fontSize: "15px",
//     cursor: "pointer",
//     marginBottom: "8px",
//     transition: "0.3s",

//     /** 👉 Sidebar button font style **/
//     fontFamily: "Cabinet Grotesk, sans-serif",
//     fontWeight: 500,
//     letterSpacing: "0.2px",
//   },
// };


// export default PublisherPanel;
import React, { useState } from "react";
import Dashboard from "./PublisherDashboard";
import Uploads from "./PublisherUploads";
import Earnings from "./Earnings";
import Settings from "./PublisherSettings";
import { useNavigate } from "react-router-dom";
import PublisherProfileCard from "./PublisherDetails";

const PublisherPanel = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();

  return (
    <div style={styles.wrapper}>
      {/* TOP NAVBAR */}
      <nav style={styles.navbar}>
        <div style={styles.navLeft}>
       

          <span style={styles.logo} onClick={() => navigate(-1)}>Publisher Panel</span>

          {["Overview", "Reports", "earnings", "settings"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                ...styles.navItem,
                ...(activeTab === tab && styles.activeNavItem),
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main style={styles.main}>
         <PublisherProfileCard/>
        {activeTab === "Overview" && <Dashboard />}
       
        {activeTab === "Reports" && <Uploads />}
        {activeTab === "earnings" && <Earnings />}
        {activeTab === "settings" && <Settings />}
      </main>
    </div>
  );
};

export default PublisherPanel;
const styles = {
  wrapper: {
    minHeight: "100vh",
    background: "#f4f6f8",
    fontFamily: "Cabinet Grotesk, sans-serif",
  },

  navbar: {
    height: "64px",
    background: "#813Dff",
    display: "flex",
    alignItems: "center",
    padding: "0 20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
  },

  navLeft: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },

  backBtn: {
    background: "#fff",
    color: "#01303f",
    border: "none",
    borderRadius: "6px",
    padding: "6px 12px",
    fontWeight: 600,
    cursor: "pointer",
  },

  logo: {
    color: "#fff",
    fontSize: "18px",
    fontWeight: 700,
    marginRight: "10px",
  },

  navItem: {
    background: "transparent",
    border: "none",
    color: "#fff",
    padding: "6px 12px",
    fontSize: "15px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: 500,
    transition: "0.3s",
  },

  activeNavItem: {
    background: "#dffa33",
    color: "black",
    fontWeight: 600,
  },

  main: {
    padding: "24px",
  },
};
