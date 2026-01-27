export const styles = {
  wrapper: {
    display: "flex",
    height: "100vh",
    background: "#f4f6f8",
    fontFamily: "Inter, sans-serif",
  },
  sidebar: {
    width: "240px",
    background: "#01303f",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    padding: "20px",
    position: "fixed",
    top: 0,
    left: 0,
    bottom: 0,
    height: "100vh",
    boxShadow: "2px 0 8px rgba(0,0,0,0.2)",
  },
  main: {
    marginLeft: "240px",
    flex: 1,
    padding: "30px",
  },
  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
    flex: 1,
  },
  tableWrapper: {
    width: "100%",
    overflowX: "auto",
    marginTop: "15px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
  },
  th: {
    border: "1px solid #ccc",
    padding: "10px",
    background: "#e9f5f3",
    fontWeight: "600",
  },
  td: {
    border: "1px solid #ccc",
    padding: "10px",
    background: "#fff",
  },
  dashboardGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  chartRow: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
  },
};

