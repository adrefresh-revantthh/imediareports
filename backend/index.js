

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import router from "./routers/SheetRoute.js"; // adjust path as needed
import { User } from "./models/SheetModel.js";

const app = express();
// import cors from "cors";

// import cors from "cors";


app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://imediareports-zi3j.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// handle preflight
app.options("*", cors());


// app.use(
//   cors({
//     origin: "http://localhost:5173",  // your Vite frontend
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: true,
//   })
// );
// app.options("/api/*", cors());
// app.options("*", cors());
app.use(express.json());

// MongoDB Connection
const MONGO_URI ="mongodb+srv://imediaAdmin:admin123@cluster0.rqzwk8k.mongodb.net/imediareports";
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ Connection error:", err));

// Router Middleware
app.use("/api", router);

// Root Route
app.get("/", (req, res) => res.send("✅ Express + MongoDB connected successfully"));

// app.post("/api/signup",)

app.use("/api/heartbeat", express.raw({ type: "application/json" }));
// app.use("/api/offline", express.raw({ type: "application/json" }));



setInterval(async () => {
  try {
    const cutoff = new Date(Date.now() - 20000); // 20 sec threshold

    const result = await User.updateMany(
      { isOnline: true, lastActive: { $lt: cutoff } },
      { $set: { isOnline: false } }
    );

    if (result.modifiedCount > 0) {
      console.log("🔴 Auto offline users updated:", result.modifiedCount);
    }
  } catch (err) {
    console.error("Auto-offline cleanup failed:", err);
  }
}, 5000);
// Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
