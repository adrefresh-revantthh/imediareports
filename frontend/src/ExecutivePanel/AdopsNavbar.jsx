// import React from "react";

// const menu = [
//   "Overview",
//   "Upload History",
//   "Sheet Validator",
//   "Error Logs",
//   "Mapping Assistant",
//   "Approvals",
// ];

// const Navbar = ({ active, setActive }) => {
//   return (
//     <div style={styles.navbar}>
//       <div style={styles.brand}>AdOps Executive Tools</div>

//       <div style={styles.menu}>
//         {menu.map((item) => (
//           <button
//             key={item}
//             onClick={() => setActive(item)}
//             style={{
//               ...styles.navItem,
//               ...(active === item ? styles.navItemActive : {}),
//             }}
//           >
//             {item}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// };

// const styles = {
//   navbar: {
//     width: "100%",
//     background: "#6D28D9", // 💜 Violet
//     padding: "14px 30px",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
//   },
//   brand: {
//     color: "#ffffff",
//     fontSize: "18px",
//     fontWeight: "700",
//     letterSpacing: "0.3px",
//   },
//   menu: {
//     display: "flex",
//     gap: "12px",
//     flexWrap: "wrap",
//   },
//   navItem: {
//     background: "transparent",
//     border: "1px solid rgba(255,255,255,0.25)",
//     color: "#ffffff",
//     padding: "8px 14px",
//     borderRadius: "999px",
//     cursor: "pointer",
//     fontSize: "14px",
//     fontWeight: "500",
//     transition: "all 0.25s ease",
//   },
//   navItemActive: {
//     background: "#D9F99D", // 🍋 Lime Yellow
//     color: "#3F6212",
//     border: "1px solid #D9F99D",
//     fontWeight: "700",
//     boxShadow: "0 3px 8px rgba(0,0,0,0.2)",
//   },
// };

// export default Navbar;
import React from "react";

const menu = [
  "Overview",
  "Upload History",
  "Sheet Validator",

 
];

const Navbar = ({ active, setActive }) => {
  return (
    <div style={styles.navbar}>
      {/* LEFT GROUP */}
      <div style={styles.leftGroup}>
        <div style={styles.brand}>AdOps Executive Tools</div>

        <div style={styles.menu}>
          {menu.map((item) => (
            <button
              key={item}
              onClick={() => setActive(item)}
              style={{
                ...styles.navItem,
                ...(active === item ? styles.navItemActive : {}),
              }}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  navbar: {
    width: "100%",
    background: "#813dff", // 💜 Violet
    padding: "14px 30px",
    display: "flex",
    alignItems: "center",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  },

  /* NEW: wrapper to keep everything left-aligned */
  leftGroup: {
    display: "flex",
    alignItems: "center",
    gap: "24px",
    flexWrap: "wrap",
  },

  brand: {
    color: "#ffffff",
    fontSize: "18px",
    fontWeight: "700",
    letterSpacing: "0.3px",
    whiteSpace: "nowrap",
  },

  menu: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },

  navItem: {
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.25)",
    color: "#ffffff",
    padding: "8px 14px",
    borderRadius: "999px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.25s ease",
  },

  navItemActive: {
    background: "#Dffa33", // 🍋 Lime Yellow
    color: "#3F6212",
    border: "1px solid #D9F99D",
    fontWeight: "700",
    boxShadow: "0 3px 8px rgba(0,0,0,0.2)",
  },
};

export default Navbar;
