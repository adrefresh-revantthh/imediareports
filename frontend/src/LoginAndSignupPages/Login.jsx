

import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ThemeContext } from "../ThemeSettings/ThemeContext";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "", remember: true });
  const [message, setMessage] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  const isDark = theme === "dark";

  // 🎨 Theme palette (aligned with the rest of your panels)
  const palette = {
    bg: isDark ? "#0b1220" : "#f3f6fb",
    cardBg: isDark ? "rgba(30,41,59,0.95)" : "#ffffff",
    cardBorder: isDark ? "rgba(148,163,184,0.15)" : "rgba(2,6,23,0.06)",
    heading: isDark ? "#e2e8f0" : "#082f3d",
    subtext: isDark ? "#94a3b8" : "#6b7280",
    label: isDark ? "#cbd5e1" : "#374151",
    inputBg: isDark ? "#0f172a" : "#ffffff",
    inputBorder: isDark ? "#334155" : "#cbd5e1",
    inputText: isDark ? "#e2e8f0" : "#111827",
    focusRing: isDark ? "#38bdf8" : "#00C49F",
    btnFrom: isDark ? "#0ea5e9" : "#1565C0",
    btnTo: isDark ? "#22d3ee" : "#1E88E5",
    btnDisabled: isDark ? "#1f2937" : "#9ca3af",
    link: isDark ? "#38bdf8" : "#1565C0",
    success: isDark ? "#34d399" : "#10b981",
    error: isDark ? "#f87171" : "#ef4444",
    glass: isDark ? "rgba(148,163,184,0.08)" : "rgba(2,6,23,0.05)",
  };

  const gradientBg = isDark
    ? "radial-gradient(1200px 600px at 10% -10%, rgba(14,165,233,0.20), transparent), radial-gradient(900px 500px at 110% 10%, rgba(34,211,238,0.18), transparent), #0b1220"
    : "radial-gradient(1200px 600px at 10% -10%, rgba(21,101,192,0.10), transparent), radial-gradient(900px 500px at 110% 10%, rgba(30,136,229,0.12), transparent), linear-gradient(135deg, #F5F9FF, #EAF3FF)";

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email || !password) {
      setMessage("⚠️ Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const res = await axios.post("https://imediareports.onrender.com/api/login", { email, password });
      // Persist JWT
      localStorage.setItem("jwt", JSON.stringify(res.data));

      const { user } = res.data;
      setMessage("✅ Login successful! Redirecting...");

      // optional remember email
      if (formData.remember) {
        localStorage.setItem("rememberEmail", email);
      } else {
        localStorage.removeItem("rememberEmail");
      }

      setTimeout(() => {
        if (user?.role === "admin") navigate("/Adminpanel");
        else if (user?.role === "publisher") navigate("/publisherpanel");
        else if (user?.role === "advertiser") navigate("/advertiserpanel");
         else if (user?.role === "sales-person") navigate("/mtd");
        else navigate("/adops");
      }, 1000);
    } catch (error) {
      const errMsg = error.response?.data?.message || "❌ Invalid email or password!";
      setMessage(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // preload remembered email
  React.useEffect(() => {
    const remembered = localStorage.getItem("rememberEmail");
    if (remembered) setFormData((p) => ({ ...p, email: remembered, remember: true }));
  }, []);

  return (
    <div
      style={{
        ...styles.container,
        background: gradientBg,
      }}
    >
      <div
        style={{
          ...styles.card,
          background: palette.cardBg,
          border: `1px solid ${palette.cardBorder}`,
          boxShadow: `0 20px 50px ${palette.glass}`,
        }}
      >
        {/* Brand / Title */}
        <div style={styles.brandRow}>
          <div style={{ ...styles.brandIcon, background: isDark ? "#0ea5e9" : "#082f3d" }}>
            <span role="img" aria-label="shield">🛡️</span>
          </div>
          <div>
            <h2 style={{ ...styles.heading, color: palette.heading }}>Welcome Back</h2>
            <p style={{ ...styles.subtext, color: palette.subtext }}>Login to continue your dashboard</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={{ ...styles.label, color: palette.label }}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={{
                ...styles.input,
                background: palette.inputBg,
                color: palette.inputText,
                borderColor: palette.inputBorder,
              }}
              placeholder="you@company.com"
              onFocus={(e) => (e.target.style.boxShadow = `0 0 0 3px ${palette.focusRing}33`)}
              onBlur={(e) => (e.target.style.boxShadow = "none")}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={{ ...styles.label, color: palette.label }}>Password</label>
            <div style={styles.pwdWrap}>
              <input
                type={showPwd ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                style={{
                  ...styles.input,
                  background: palette.inputBg,
                  color: palette.inputText,
                  borderColor: palette.inputBorder,
                  paddingRight: "44px",
                }}
                placeholder="••••••••"
                onFocus={(e) => (e.target.style.boxShadow = `0 0 0 3px ${palette.focusRing}33`)}
                onBlur={(e) => (e.target.style.boxShadow = "none")}
              />
              <button
                type="button"
                onClick={() => setShowPwd((s) => !s)}
                style={{
                  ...styles.eyeBtn,
                  color: palette.subtext,
                }}
                title={showPwd ? "Hide password" : "Show password"}
              >
                {showPwd ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <div style={styles.rowBetween}>
            <label style={{ ...styles.checkLabel, color: palette.subtext }}>
              <input
                type="checkbox"
                name="remember"
                checked={formData.remember}
                onChange={handleChange}
                style={styles.checkbox}
              />
              Remember me
            </label>

            <a href="/forgot-password" style={{ ...styles.link, color: palette.link }}>
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              background: `linear-gradient(135deg, ${palette.btnFrom}, ${palette.btnTo})`,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "translateY(0)")}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {message && (
            <p
              style={{
                ...styles.message,
                color: message.startsWith("✅") ? palette.success : message.startsWith("⚠️") ? palette.error : palette.error,
              }}
            >
              {message}
            </p>
          )}
        </form>

        <p style={{ ...styles.signupText, color: palette.subtext }}>
          Don’t have an account?{" "}
          <a href="/signup" style={{ ...styles.link, color: palette.link }}>
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    borderRadius: "20px",
    padding: "32px",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    transition: "transform 0.2s ease",
    
  },
  brandRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "14px",
  },
  brandIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    color: "#fff",
    display: "grid",
    placeItems: "center",
    fontSize: 20,

    boxShadow: "0 6px 14px rgba(0,0,0,0.2)",
  },
  heading: {
    fontSize: "24px",
        // fontFamily:"'Spoof Trial Black', sans-serif",
    fontWeight: 800,
    letterSpacing: "-0.02em",
    margin: 0,
  },
  subtext: {
    margin: 0,
    fontSize: "14px",
            // fontFamily:"'Spoof Trial Black', sans-serif",

  },
  form: { display: "flex", flexDirection: "column", gap: "16px", marginTop: "18px" },
  inputGroup: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "13px", fontWeight: 600 ,       
},
  pwdWrap: { position: "relative" },
  eyeBtn: {
    position: "absolute",
    right: 8,
    top: "50%",
    transform: "translateY(-50%)",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: 18,
            // fontFamily:"'Spoof Trial Black', sans-serif",

  },
  input: {
    padding: "12px 14px",
    border: "1px solid",
    borderRadius: "10px",
    fontSize: "15px",
            // fontFamily:"'Spoof Trial Black', sans-serif",

    outline: "none",
    transition: "box-shadow 0.15s ease, border-color 0.15s ease",
  },
  rowBetween: {
    marginTop: 2,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  checkLabel: { display: "flex", alignItems: "center", gap: 8, fontSize: 13,        
 },
  checkbox: { width: 16, height: 16, cursor: "pointer" },
  button: {
    marginTop: "8px",
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    color: "#fff",
    fontSize: "16px",
    fontWeight: 700,
            // fontFamily:"'Spoof Trial Black', sans-serif",

    letterSpacing: "0.02em",
    transition: "transform 0.15s ease",
  },
  message: {
    marginTop: "10px",
    textAlign: "center",
    fontSize: "14px",
    fontWeight: 600,
  },
  signupText: {
    textAlign: "center",
    fontSize: "14px",
            // fontFamily:"'Spoof Trial Black', sans-serif",

    marginTop: "20px",
  },
  link: {
    textDecoration: "none",
    fontWeight: 700,
            // fontFamily:"'Spoof Trial Black', sans-serif",

  },
};

export default Login;
