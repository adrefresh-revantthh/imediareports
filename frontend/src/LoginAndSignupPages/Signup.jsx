

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, role } = formData;

    if (!name || !email || !password || !role) {
      setMessage("⚠️ Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const res = await axios.post("https://imediareports.onrender.com/api/signup", {
        name,
        email,
        password,
        role,
      });

      if (res.status === 201) {
        setMessage("✅ Signup successful! Redirecting...");
        setFormData({ name: "", email: "", password: "", role: "" });
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data.message) {
        setMessage(`⚠️ ${err.response.data.message}`);
      } else {
        setMessage("❌ Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Create an Account</h2>
        <p style={styles.subtext}>Join as Publisher, Advertiser, or Admin</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={styles.input}
              placeholder="Enter your name"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
              placeholder="Enter your email"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={styles.input}
              placeholder="Enter a strong password"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Select Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              style={styles.select}
            >
              <option value="">-- Choose a Role --</option>
              <option value="publisher">Publisher</option>
              <option value="advertiser">Advertiser</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Signing Up..." : "Sign Up"}
          </button>

          {message && <p style={styles.message}>{message}</p>}
        </form>
      </div>
    </div>
  );
};

// ===== Inline Styling =====
const styles = {
  container: {
    background: "linear-gradient(135deg, #E3F2FD, #F8FBFF)",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Inter, sans-serif",
  },
  card: {
    background: "#fff",
    padding: "40px",
    borderRadius: "16px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "420px",
  },
  heading: {
    textAlign: "center",
    fontSize: "26px",
    fontWeight: "700",
    marginBottom: "10px",
    color: "#1565C0",
  },
  subtext: {
    textAlign: "center",
    color: "#666",
    fontSize: "14px",
    marginBottom: "25px",
  },
  form: { display: "flex", flexDirection: "column", gap: "18px" },
  inputGroup: { display: "flex", flexDirection: "column" },
  label: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#333",
    marginBottom: "5px",
  },
  input: {
    padding: "12px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    fontSize: "15px",
  },
  select: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "15px",
    background: "#fff",
  },
  button: {
    marginTop: "10px",
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    background: "linear-gradient(135deg, #1565C0, #1E88E5)",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  message: {
    marginTop: "10px",
    textAlign: "center",
    fontSize: "14px",
    color: "#333",
  },
};

export default Signup;
