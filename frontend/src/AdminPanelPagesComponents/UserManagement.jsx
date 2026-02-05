
// // import React, { useState, useEffect, useContext } from "react";
// // import axios from "axios";
// // import { ThemeContext } from "../ThemeSettings/ThemeContext";

// // const UserManagement = () => {
// //   const [users, setUsers] = useState([]);
// //   const [blockedUsers, setBlockedUsers] = useState([]);
// //   const [formData, setFormData] = useState({
// //     name: "",
// //     email: "",
// //     password: "",
// //     role: "publisher",
    
// //   });
// //   const [editUserId, setEditUserId] = useState(null);

// //   const { theme } = useContext(ThemeContext);
// //   const token = JSON.parse(localStorage.getItem("jwt"))?.token;

// //   useEffect(() => {
// //     fetchUsers();
// //     fetchBlockedUsers();
// //   }, []);

// //   /* ✅ Fetch All Users */
// //   const fetchUsers = async () => {
// //     try {
// //       const res = await axios.get("https://imediareports.onrender.com/api/getallusers", {
// //         headers: { Authorization: `Bearer ${token}` },
// //       });
// //       setUsers(res.data);
// //     } catch (err) {
// //       console.error("Error fetching users:", err);
// //     }
// //   };

// //   /* ✅ Fetch Blocked Users */
// //   const fetchBlockedUsers = async () => {
// //     try {
// //       const res = await axios.get("https://imediareports.onrender.com/api/blocked-users", {
// //         headers: { Authorization: `Bearer ${token}` },
// //       });
// //       setBlockedUsers(res.data.blockedUsers || []);
// //     } catch (err) {
// //       console.error("Error fetching blocked users:", err);
// //     }
// //   };

// //   /* ✅ Check If Blocked */
// //   const isUserBlocked = (name) => {
// //     return blockedUsers.some((u) => u.username === name && u.blocked === true);
// //   };

// //   /* ✅ Block User */
// //   const handleBlock = async (name) => {
// //     try {
// //       await axios.post(
// //         `https://imediareports.onrender.com/api/block-user/${name}`,
// //         {},
// //         { headers: { Authorization: `Bearer ${token}` } }
// //       );
// //       fetchBlockedUsers();
// //       alert(`${name} is Blocked`);
// //     } catch (err) {
// //       console.error(err);
// //     }
// //   };

// //   /* ✅ Unblock User */
// //   const handleUnblock = async (name) => {
// //     try {
// //       await axios.post(
// //         `https://imediareports.onrender.com/api/unblock-user/${name}`,
// //         {},
// //         { headers: { Authorization: `Bearer ${token}` } }
// //       );
// //       fetchBlockedUsers();
// //       alert(`${name} is Unblocked`);
// //     } catch (err) {
// //       console.error(err);
// //     }
// //   };

// //   /* ✅ Existing form logic untouched */
// //  const handleSubmit = async (e) => {
// //   e.preventDefault();
// //   try {
// //     const config = {
// //       headers: {
// //         Authorization: `Bearer ${token}`,
// //         "Content-Type": "application/json",
// //       },
// //     };

// //     if (editUserId) {
// //       await axios.put(
// //         `https://imediareports.onrender.com/api/updateusers/${editUserId}`,
// //         formData,
// //         config
// //       );
// //     } else {
// //       await axios.post(
// //         "https://imediareports.onrender.com/api/signup",
// //         formData,
// //         config
// //       );
// //     }

// //     fetchUsers();
// //     setFormData({ name: "", email: "", password: "", role: "publisher" });
// //     setEditUserId(null);
// //   } catch (err) {
// //     console.error("Error saving user:", err.response?.data || err);
// //   }
// // };
// //   const handleDelete = async (id) => {
// //     if (!window.confirm("Are you sure?")) return;
// //     try {
// //       await axios.delete(`https://imediareports.onrender.com/api/deleteuser/${id}`, {
// //         headers: { Authorization: `Bearer ${token}` },
// //       });
// //       fetchUsers();
// //     } catch (err) {
// //       console.error(err);
// //     }
// //   };

// //   const handleEdit = (user) => {
// //     setFormData({
// //       name: user.name,
// //       email: user.email,
// //       password: "",
// //       role: user.role,
// //     });
// //     setEditUserId(user._id);
// //   };

// //   /* ✅ ORIGINAL theme logic untouched */
// //   const isDark = theme === "dark";
// //   const themeColors = {
// //     containerBg: isDark ? "#1e293b" : "#fff",
// //     headingColor: isDark ? "#e2e8f0" : "#082f3d",
// //     borderColor: isDark ? "#334155" : "#ccc",
// //     tableHeaderBg: isDark ? "#0f172a" : "#082f3d",
// //     tableHeaderText: "#fff",
// //     tableRowBg: isDark ? "#1e293b" : "#fff",
// //     textColor: isDark ? "#e2e8f0" : "#000000",
// //   };

// //   return (
// //     <div
// //       style={{
// //         ...styles.container,
// //         background: themeColors.containerBg,
// //         color: themeColors.textColor,
// //       }}
// //     >
// //       <h2 style={{ ...styles.heading, color: themeColors.headingColor }}>
// //         👥 User Management
// //       </h2>

// //       {/* ✅ Add/Edit Form unchanged */}
// //       <form onSubmit={handleSubmit} style={styles.form}>
// //         <input
// //           type="text"
// //           placeholder="Name"
// //           value={formData.name}
// //           onChange={(e) => setFormData({ ...formData, name: e.target.value })}
// //           required
// //           style={{
// //             ...styles.input,
// //             background: isDark ? "#0f172a" : "#fff",
// //             color: themeColors.textColor,
// //             borderColor: themeColors.borderColor,
// //           }}
// //         />

// //         <input
// //           type="email"
// //           placeholder="Email"
// //           value={formData.email}
// //           onChange={(e) => setFormData({ ...formData, email: e.target.value })}
// //           required
// //           style={{
// //             ...styles.input,
// //             background: isDark ? "#0f172a" : "#fff",
// //             color: themeColors.textColor,
// //             borderColor: themeColors.borderColor,
// //           }}
// //         />

// //         <input
// //           type="password"
// //           placeholder="Password"
// //           value={formData.password}
// //           onChange={(e) =>
// //             setFormData({ ...formData, password: e.target.value })
// //           }
// //           required={!editUserId}
// //           style={{
// //             ...styles.input,
// //             background: isDark ? "#0f172a" : "#fff",
// //             color: themeColors.textColor,
// //             borderColor: themeColors.borderColor,
// //           }}
// //         />

// //         <select
// //           value={formData.role}
// //           onChange={(e) => setFormData({ ...formData, role: e.target.value })}
// //           style={{
// //             ...styles.select,
// //             background: isDark ? "#0f172a" : "#fff",
// //             color: themeColors.textColor,
// //             borderColor: themeColors.borderColor,
// //           }}
// //         >
// //           <option value="publisher">Publisher</option>
// //           <option value="advertiser">Advertiser</option>
// //           <option value="admin">Admin</option>
// //                     <option value="executive">Executive</option>
// //                      <option value="salesperson">Sales-person</option>

// //         </select>

// //         <button type="submit" style={styles.addButton}>
// //           {editUserId ? "Update" : "Add"}
// //         </button>
// //       </form>

// //       {/* ✅ TABLE with new Block/Unblock column */}
// //       <div style={styles.tableWrapper}>
// //         <table style={{ ...styles.table, borderColor: themeColors.borderColor }}>
// //           <thead>
// //             <tr>
// //               <th style={styles.th}>Name</th>
// //               <th style={styles.th}>Email</th>
// //               <th style={styles.th}>Role</th>
// //               <th style={styles.th}>Actions</th>
// //               <th style={styles.th}>Block / Unblock</th> {/* ✅ NEW */}
// //             </tr>
// //           </thead>

// //           <tbody>
// //             {users.map((user) => {
// //               const blocked = isUserBlocked(user.name);

// //               return (
// //                 <tr key={user._id}>
// //                   <td style={styles.td}>{user.name}</td>
// //                   <td style={styles.td}>{user.email}</td>
// //                   <td style={styles.td}>
// //       <span
// //   style={{
// //     ...styles.roleBadge,
// //     backgroundColor:
// //       user.role === "admin"
// //         ? "#2563eb"      // blue
// //         : user.role === "advertiser"
// //         ? "#10b981"      // green
// //         : user.role === "executive"
// //         ? "#8b5cf6"      // purple
// //         : user.role === "salesperson"
// //         ? "#11950a"      // 🔴 red
// //         : "#f59e0b",     // default (orange)
// //   }}
// // >
// //   {user.role}
// // </span>

// //                   </td>

// //                   <td style={styles.tdAction}>
// //                     <button
// //                       style={styles.editButton}
// //                       onClick={() => handleEdit(user)}
// //                     >
// //                        Edit
// //                     </button>
// //                     <button
// //                       style={styles.deleteButton}
// //                       onClick={() => handleDelete(user._id)}
// //                     >
// //                       Delete
// //                     </button>
// //                   </td>

// //                   {/* ✅ NEW COLUMN BLOCK/UNBLOCK */}
// //                   <td style={styles.td}>
// //                     {blocked ? (
// //                       <button
// //                         style={{
// //                           ...styles.blockButton,
// //                           background: "#10b981",
// //                         }}
// //                         onClick={() => handleUnblock(user.name)}
// //                       >
// //                          Unblock
// //                       </button>
// //                     ) : (
// //                       <button
// //                         style={{
// //                           ...styles.blockButton,
// //                           background: "#ef4444",
// //                         }}
// //                         onClick={() => handleBlock(user.name)}
// //                       >
// //                         Block
// //                       </button>
// //                     )}
// //                   </td>
// //                 </tr>
// //               );
// //             })}
// //           </tbody>
// //         </table>
// //       </div>
// //     </div>
// //   );
// // };

// // /* ✅ ORIGINAL styles + block button added */
// // const styles = {
// //   container: {
// //     width: "100%",
// //     maxWidth: "100%",
// //     margin: 0,
// //     padding: "30px",
    
// //     boxShadow: "0 6px 14px rgba(0,0,0,0.1)",
// //     // fontFamily: "Inter, sans-serif",
// //   },
// //   heading: {
// //     fontSize: "24px",
// //     fontWeight: "bold",
// //     marginBottom: "20px",
// //   },
// //   form: {
// //     display: "flex",
// //     flexWrap: "wrap",
// //     gap: "10px",
// //     marginBottom: "20px",
// //   },
// //   input: {
// //     flex: 1,
// //     padding: "10px",
// //     border: "1px solid #ccc",
// //     borderRadius: "6px",
// //     fontSize: "21px",
// //   },
// //   select: {
// //     padding: "10px",
// //     border: "1px solid #ccc",
// //     borderRadius: "6px",
// //     fontSize: "14px",
// //   },
// //   addButton: {
// //     background: "#813dff",
// //     color: "white",
// //     border: "2px solid black",
   
// //     padding: "10px 28px",
// //     cursor: "pointer",
// //     fontWeight: "600",
// //   },
// //   tableWrapper: {
// //     overflowX: "auto",
// //   },
// //   table: {
// //     width: "100%",
// //     borderCollapse: "collapse",
// //     border: "2px solid #ddd",
// //     minWidth: "600px",
// //   },
// //   th: {
// //     padding: "12px",
// //     textAlign: "left",
// //     border: "1px solid #ccc",
// //     fontWeight: "900",
// //   },
// //   td: {
// //     padding: "12px",
// //     border: "1px solid #ccc",
// //     textAlign: "center",
// //      fontWeight: "500",
// //      fontSize:"18px"
// //   },
// //   tdAction: {
// //     padding: "12px",
// //     border: "1px solid #ccc",
// //     textAlign: "center",
// //   },
// //   editButton: {
// //     background: "#d8f130",
// //     padding: "6px 29px",
// //     marginRight: "6px",
  
// //     cursor: "pointer",
// //       fontSize:"18px"
// //   },
// //   deleteButton: {
// //     background: "#ef4444",
// //     padding: "6px 20px",
 
// //     color: "#fff",
// //     cursor: "pointer",
// //       fontSize:"18px"
// //   },
// //   blockButton: {
// //     padding: "6px 12px",
  
// //     cursor: "pointer",
// //     color: "#fff",
// //     fontWeight: "600",
// //     textAlign:"center",
// //       fontSize:"18px"
// //   },
// //   roleBadge: {
// //     padding: "4px 10px",
// //     borderRadius: "20px",
// //     color: "#fff",
// //     fontSize: "18px",
// //     fontWeight: "500",
// //     textTransform: "capitalize",
// //   },
// // };

// // export default UserManagement;

// import React, { useState, useEffect, useContext } from "react";
// import axios from "axios";
// import { ThemeContext } from "../ThemeSettings/ThemeContext";

// /* 🔔 TOAST */
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const UserManagement = () => {
//   const [users, setUsers] = useState([]);
//   const [blockedUsers, setBlockedUsers] = useState([]);
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     role: "publisher",
//   });
//   const [editUserId, setEditUserId] = useState(null);

//   const { theme } = useContext(ThemeContext);
//   const token = JSON.parse(localStorage.getItem("jwt"))?.token;

//   useEffect(() => {
//     fetchUsers();
//     fetchBlockedUsers();
//   }, []);

//   /* ✅ Fetch All Users */
//   const fetchUsers = async () => {
//     try {
//       const res = await axios.get(
//         "https://imediareports.onrender.com/api/getallusers",
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setUsers(res.data);
//     } catch (err) {
//       toast.error("Failed to fetch users");
//       console.error("Error fetching users:", err);
//     }
//   };

//   /* ✅ Fetch Blocked Users */
//   const fetchBlockedUsers = async () => {
//     try {
//       const res = await axios.get(
//         "https://imediareports.onrender.com/api/blocked-users",
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setBlockedUsers(res.data.blockedUsers || []);
//     } catch (err) {
//       toast.error("Failed to fetch blocked users");
//       console.error("Error fetching blocked users:", err);
//     }
//   };

//   /* ✅ Check If Blocked */
//   const isUserBlocked = (name) => {
//     return blockedUsers.some(
//       (u) => u.username === name && u.blocked === true
//     );
//   };

//   /* 🚫 Block User */
//   const handleBlock = async (name) => {
//     try {
//       await axios.post(
//         `https://imediareports.onrender.com/api/block-user/${name}`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       fetchBlockedUsers();
//       toast.success(`${name} blocked successfully`);
//     } catch (err) {
//       toast.error("Failed to block user");
//       console.error(err);
//     }
//   };

//   /* ✅ Unblock User */
//   const handleUnblock = async (name) => {
//     try {
//       await axios.post(
//         `https://imediareports.onrender.com/api/unblock-user/${name}`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       fetchBlockedUsers();
//       toast.success(`${name} unblocked successfully`);
//     } catch (err) {
//       toast.error("Failed to unblock user");
//       console.error(err);
//     }
//   };

//   /* ➕ CREATE / ✏️ UPDATE */
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const config = {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       };

//       if (editUserId) {
//         await axios.put(
//           `https://imediareports.onrender.com/api/updateusers/${editUserId}`,
//           formData,
//           config
//         );
//         toast.success("User updated successfully");
//       } else {
//         await axios.post(
//           "https://imediareports.onrender.com/api/signup",
//           formData,
//           config
//         );
//         toast.success("User created successfully");
//       }

//       fetchUsers();
//       setFormData({ name: "", email: "", password: "", role: "publisher" });
//       setEditUserId(null);
//     } catch (err) {
//       toast.error("Failed to save user");
//       console.error("Error saving user:", err);
//     }
//   };

//   /* 🗑 Delete */
//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure?")) return;
//     try {
//       await axios.delete(
//         `https://imediareports.onrender.com/api/deleteuser/${id}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       fetchUsers();
//       toast.success("User deleted successfully");
//     } catch (err) {
//       toast.error("Failed to delete user");
//       console.error(err);
//     }
//   };

//   const handleEdit = (user) => {
//     setFormData({
//       name: user.name,
//       email: user.email,
//       password: "",
//       role: user.role,
//     });
//     setEditUserId(user._id);
//   };

//   const isDark = theme === "dark";
//   const themeColors = {
//     containerBg: isDark ? "#1e293b" : "#fff",
//     headingColor: isDark ? "#e2e8f0" : "#082f3d",
//     borderColor: isDark ? "#334155" : "#ccc",
//     tableHeaderBg: isDark ? "#0f172a" : "#082f3d",
//     tableHeaderText: "#fff",
//     tableRowBg: isDark ? "#1e293b" : "#fff",
//     textColor: isDark ? "#e2e8f0" : "#000000",
//   };

//   return (
//     <div
//       style={{
//         ...styles.container,
//         background: themeColors.containerBg,
//         color: themeColors.textColor,
//       }}
//     >
//       <ToastContainer position="top-right" autoClose={2500} />

//       <h2 style={{ ...styles.heading, color: themeColors.headingColor }}>
//         👥 User Management
//       </h2>

//       <form onSubmit={handleSubmit} style={styles.form}>
//         <input
//           type="text"
//           placeholder="Name"
//           value={formData.name}
//           onChange={(e) =>
//             setFormData({ ...formData, name: e.target.value })
//           }
//           required
//           style={styles.input}
//         />

//         <input
//           type="email"
//           placeholder="Email"
//           value={formData.email}
//           onChange={(e) =>
//             setFormData({ ...formData, email: e.target.value })
//           }
//           required
//           style={styles.input}
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           value={formData.password}
//           onChange={(e) =>
//             setFormData({ ...formData, password: e.target.value })
//           }
//           required={!editUserId}
//           style={styles.input}
//         />

//         <select
//           value={formData.role}
//           onChange={(e) =>
//             setFormData({ ...formData, role: e.target.value })
//           }
//           style={styles.select}
//         >
//           <option value="publisher">Publisher</option>
//           <option value="advertiser">Advertiser</option>
//           <option value="admin">Admin</option>
//           <option value="executive">Executive</option>
//           <option value="salesperson">Sales-person</option>
//         </select>

//         <button type="submit" style={styles.addButton}>
//           {editUserId ? "Update" : "Add"}
//         </button>
//       </form>

//       <div style={styles.tableWrapper}>
//         <table style={styles.table}>
//           <thead>
//             <tr>
//               <th style={styles.th}>Name</th>
//               <th style={styles.th}>Email</th>
//               <th style={styles.th}>Role</th>
//               <th style={styles.th}>Actions</th>
//               <th style={styles.th}>Block / Unblock</th>
//             </tr>
//           </thead>

//           <tbody>
//             {users.map((user) => {
//               const blocked = isUserBlocked(user.name);
//               return (
//                 <tr key={user._id}>
//                   <td style={styles.td}>{user.name}</td>
//                   <td style={styles.td}>{user.email}</td>
//                   <td style={styles.td}>
//                  <span
//   style={{
//     ...styles.roleBadge,
//     backgroundColor:
//       user.role === "admin"
//         ? "#2563eb"      // Blue – authority
//         : user.role === "advertiser"
//         ? "#10b981"      // Green – revenue
//         : user.role === "executive"
//         ? "#8b5cf6"      // Purple – ops
//         : user.role === "salesperson"
//         ? "#00a50b"      // Red – sales pressure 😈
//         : "#f59e0b",     // Orange – publisher / default
//   }}
// >
//   {user.role}
// </span>

//                   </td>
//                   <td style={styles.tdAction}>
//                     <button
//                       style={styles.editButton}
//                       onClick={() => handleEdit(user)}
//                     >
//                       Edit
//                     </button>
//                     <button
//                       style={styles.deleteButton}
//                       onClick={() => handleDelete(user._id)}
//                     >
//                       Delete
//                     </button>
//                   </td>
//                   <td style={styles.td}>
//                     {blocked ? (
//                       <button
//                         style={{ ...styles.blockButton, background: "#10b981" }}
//                         onClick={() => handleUnblock(user.name)}
//                       >
//                         Unblock
//                       </button>
//                     ) : (
//                       <button
//                         style={{ ...styles.blockButton, background: "black" }}
//                         onClick={() => handleBlock(user.name)}
//                       >
//                         Block
//                       </button>
//                     )}
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// /* 🎨 STYLES (UNCHANGED) */
// const styles = {
//   container: {
//     width: "100%",
//     padding: "30px",
//     boxShadow: "0 6px 14px rgba(0,0,0,0.1)",
//   },
//   heading: { fontSize: "24px", fontWeight: "bold", marginBottom: "20px" },
//   form: { display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "20px" },
//   input: { padding: "10px", fontSize: "18px", borderRadius: "6px" },
//   select: { padding: "10px", fontSize: "16px", borderRadius: "6px" },
//   addButton: {
//     background: "#813dff",
//     color: "#fff",
//     padding: "10px 28px",
//     fontWeight: "600",
//     cursor: "pointer",
//   },
//   tableWrapper: { overflowX: "auto" },
//   table: { width: "100%", borderCollapse: "collapse" },
//   th: { padding: "12px", border: "1px solid #ccc", fontWeight: "700" },
//   td: { padding: "12px", border: "1px solid #ccc", textAlign: "center",fontSize:"18px" },
//   tdAction: {textAlign: "center", padding: "12px", border: "1px solid #ccc" },
//   editButton: { background: "#d8f130", padding: "6px 20px", cursor: "pointer", marginRight:"20px",fontSize:"18px"},
//   deleteButton: {
//     background: "#ef4444",
//     color: "#fff",
//     padding: "6px 20px",
//     cursor: "pointer",
//     fontSize:"18px"
//   },
//   blockButton: {
//     padding: "6px 16px",
//     color: "#fff",
//     fontWeight: "600",
//     cursor: "pointer",

//     fontSize:"18px",
//     backgroundColor:"black",
//   },
//   roleBadge: {
//     padding: "4px 12px",
//     borderRadius: "20px",
//     background: "#6366f1",
//     color: "#fff",
//     textTransform: "capitalize",
//   },
// };

// export default UserManagement;

import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { ThemeContext } from "../ThemeSettings/ThemeContext";

/* 🔔 TOAST */
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ skeleton
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "publisher",
  });
  const [editUserId, setEditUserId] = useState(null);

  const { theme } = useContext(ThemeContext);
  const token = JSON.parse(localStorage.getItem("jwt"))?.token;

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchUsers(), fetchBlockedUsers()]);
    } finally {
      setLoading(false);
    }
  };

  /* ✅ Fetch All Users */
  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        "https://imediareports.onrender.com/api/getallusers",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(res.data);
    } catch (err) {
      toast.error("Failed to fetch users");
    }
  };

  /* ✅ Fetch Blocked Users */
  const fetchBlockedUsers = async () => {
    try {
      const res = await axios.get(
        "https://imediareports.onrender.com/api/blocked-users",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBlockedUsers(res.data.blockedUsers || []);
    } catch (err) {
      toast.error("Failed to fetch blocked users");
    }
  };

  const isUserBlocked = (name) =>
    blockedUsers.some((u) => u.username === name && u.blocked === true);

  /* 🚫 Block User */
  const handleBlock = async (name) => {
    try {
      await axios.post(
        `https://imediareports.onrender.com/api/block-user/${name}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchBlockedUsers();
      toast.success(`${name} blocked successfully`);
    } catch {
      toast.error("Failed to block user");
    }
  };

  /* ✅ Unblock User */
  const handleUnblock = async (name) => {
    try {
      await axios.post(
        `https://imediareports.onrender.com/api/unblock-user/${name}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchBlockedUsers();
      toast.success(`${name} unblocked successfully`);
    } catch {
      toast.error("Failed to unblock user");
    }
  };

  /* ➕ CREATE / ✏️ UPDATE */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      if (editUserId) {
        await axios.put(
          `https://imediareports.onrender.com/api/updateusers/${editUserId}`,
          formData,
          config
        );
        toast.success("User updated successfully");
      } else {
        await axios.post(
          "https://imediareports.onrender.com/api/signup",
          formData,
          config
        );
        toast.success("User created successfully");
      }

      loadAll();
      setFormData({ name: "", email: "", password: "", role: "publisher" });
      setEditUserId(null);
    } catch {
      toast.error("Failed to save user");
    }
  };

  /* 🗑 Delete */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(
        `https://imediareports.onrender.com/api/deleteuser/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      loadAll();
      toast.success("User deleted successfully");
    } catch {
      toast.error("Failed to delete user");
    }
  };

  const handleEdit = (user) => {
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
    });
    setEditUserId(user._id);
  };

  const isDark = theme === "dark";
  const themeColors = {
    containerBg: isDark ? "#1e293b" : "#fff",
    headingColor: isDark ? "#e2e8f0" : "#082f3d",
    borderColor: isDark ? "#334155" : "#ccc",
    tableHeaderBg: isDark ? "#0f172a" : "#082f3d",
    tableHeaderText: "#fff",
    textColor: isDark ? "#e2e8f0" : "#000000",
  };

  return (
    <div
      style={{
        ...styles.container,
        background: themeColors.containerBg,
        color: themeColors.textColor,
      }}
    >
      <ToastContainer position="top-right" autoClose={2500} />

      <h2 style={{ ...styles.heading, color: themeColors.headingColor }}>
        👥 User Management
      </h2>

      {/* FORM — unchanged */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input type="text" placeholder="Name" value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })} required style={styles.input} />

        <input type="email" placeholder="Email" value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })} required style={styles.input} />

        <input type="password" placeholder="Password" value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required={!editUserId} style={styles.input} />

        <select value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          style={styles.select}>
          <option value="publisher">Publisher</option>
          <option value="advertiser">Advertiser</option>
          <option value="admin">Admin</option>
          <option value="executive">Executive</option>
          <option value="salesperson">Sales-person</option>
        </select>

        <button type="submit" style={styles.addButton}>
          {editUserId ? "Update" : "Add"}
        </button>
      </form>

      {/* TABLE */}
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              {["Name", "Email", "Role", "Actions", "Block / Unblock"].map((h) => (
                <th key={h} style={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td colSpan="5">
                    <div className="skeleton-row" />
                  </td>
                </tr>
              ))
            ) : (
              users.map((user) => {
                const blocked = isUserBlocked(user.name);
                return (
                  <tr key={user._id}>
                    <td style={styles.td}>{user.name}</td>
                    <td style={styles.td}>{user.email}</td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.roleBadge,
                        backgroundColor:
                          user.role === "admin" ? "#2563eb"
                            : user.role === "advertiser" ? "#10b981"
                            : user.role === "executive" ? "#8b5cf6"
                            : user.role === "salesperson" ? "#00a50b"
                            : "#f59e0b",
                      }}>
                        {user.role}
                      </span>
                    </td>
                    <td style={styles.tdAction}>
                      <button style={styles.editButton} onClick={() => handleEdit(user)}>Edit</button>
                      <button style={styles.deleteButton} onClick={() => handleDelete(user._id)}>Delete</button>
                    </td>
                    <td style={styles.td}>
                      {blocked ? (
                        <button style={{ ...styles.blockButton, background: "#10b981" }}
                          onClick={() => handleUnblock(user.name)}>Unblock</button>
                      ) : (
                        <button style={styles.blockButton}
                          onClick={() => handleBlock(user.name)}>Block</button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* 🔥 Skeleton animation */}
      <style>
        {`
          .skeleton-row {
            height: 42px;
            background: linear-gradient(
              90deg,
              #e5e7eb 25%,
              #f3f4f6 37%,
              #e5e7eb 63%
            );
            background-size: 400% 100%;
            animation: shimmer 1.4s infinite;
            border-radius: 6px;
          }
          @keyframes shimmer {
            0% { background-position: 100% 0 }
            100% { background-position: -100% 0 }
          }
        `}
      </style>
    </div>
  );
};

/* 🎨 STYLES (UNCHANGED) */
const styles = {
  container: { width: "100%", padding: "30px", boxShadow: "0 6px 14px rgba(0,0,0,0.1)" },
  heading: { fontSize: "24px", fontWeight: "bold", marginBottom: "20px" },
  form: { display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "20px" },
  input: { padding: "10px", fontSize: "18px", borderRadius: "6px" },
  select: { padding: "10px", fontSize: "16px", borderRadius: "6px" },
  addButton: { background: "#813dff", color: "#fff", padding: "10px 28px", fontWeight: "600", cursor: "pointer" },
  tableWrapper: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { padding: "12px", border: "1px solid #ccc", fontWeight: "700" },
  td: { padding: "12px", border: "1px solid #ccc", textAlign: "center", fontSize: "18px" },
  tdAction: { textAlign: "center", padding: "12px", border: "1px solid #ccc" },
  editButton: { background: "#d8f130", padding: "6px 20px", cursor: "pointer", marginRight: "20px", fontSize: "18px" },
  deleteButton: { background: "#ef4444", color: "#fff", padding: "6px 20px", cursor: "pointer", fontSize: "18px" },
  blockButton: { padding: "6px 16px", color: "#fff", fontWeight: "600", cursor: "pointer", fontSize: "18px", backgroundColor: "black" },
  roleBadge: { padding: "4px 12px", borderRadius: "20px", color: "#fff", textTransform: "capitalize" },
};

export default UserManagement;
