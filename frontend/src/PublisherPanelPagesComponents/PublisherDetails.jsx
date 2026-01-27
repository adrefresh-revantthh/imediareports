import React, { useEffect, useState } from "react";

const PublisherProfileCard = () => {
  const [publisher, setPublisher] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    const jwt = JSON.parse(localStorage.getItem("jwt"));
    const user = jwt?.user;

    if (user) {
      setPublisher({
        name: user.name || "Unknown Publisher",
        email: user.email || "Not Available",
      });
    }
  }, []);

  return (
    <div>
        
    <div style={styles.card}>
  <h2>PUBLISHER</h2> 
      <div style={styles.avatar}>
        {publisher.name.charAt(0).toUpperCase()}
      </div>

      <div>
        
        <h3 style={styles.name}>{publisher.name}</h3>
        <p style={styles.email}>{publisher.email}</p>
      </div>
    </div>
    </div>
  );
};

export default PublisherProfileCard;
const styles = {
  card: {
    display: "grid",
    alignItems: "center",
    gap: "16px",
    background: "#ffffff",
    padding: "18px 20px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    marginBottom: "24px",
    maxWidth: "420px",
  },

  avatar: {
    width: "52px",
    height: "52px",
    borderRadius: "50%",
    background: "#01303f",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "22px",
    fontWeight: "700",
  },

  name: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "700",
    color: "#01303f",
  },

  email: {
    margin: 0,
    fontSize: "14px",
    color: "#555",
  },
};
