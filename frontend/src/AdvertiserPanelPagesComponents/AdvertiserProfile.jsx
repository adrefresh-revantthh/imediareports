import React, { useEffect, useState } from "react";

const AdvertiserProfileCard = () => {
  const [advertiser, setAdvertiser] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    const jwt = JSON.parse(localStorage.getItem("jwt"));
    const user = jwt?.user;

    if (user) {
      setAdvertiser({
        name: user.name || "Unknown Advertiser",
        email: user.email || "Not Available",
      });
    }
  }, []);

  return (
    <div style={styles.card}>
      <h2 style={styles.role}>ADVERTISER</h2>

      <div style={styles.profileRow}>
        <div style={styles.avatar}>
          {advertiser.name?.charAt(0)?.toUpperCase() || "A"}
        </div>

        <div>
          <h3 style={styles.name}>{advertiser.name}</h3>
          <p style={styles.email}>{advertiser.email}</p>
        </div>
      </div>
    </div>
  );
};

export default AdvertiserProfileCard;

/* ================= STYLES ================= */

const styles = {
  card: {
    background: "#ffffff",
    padding: "18px 20px",
    // borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    marginBottom: "24px",
 
    width:"100vw"
  },

  role: {
    margin: "0 0 12px 0",
    fontSize: "48px",
    letterSpacing: "1px",
    color: "#6b7280",
    fontWeight: "700",
  },

  profileRow: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },

  avatar: {
    width: "102px",
    height: "102px",
    borderRadius: "50%",
    background: "#01303f",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "42px",
    fontWeight: "700",
  },

  name: {
    margin: 0,
    fontSize: "48px",
    fontWeight: "700",
    color: "#01303f",
  },

  email: {
    margin: 0,
    fontSize: "14px",
    color: "#555",
  },
};