

// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import router from "./routers/SheetRoute.js"; // adjust path as needed
// import { User } from "./models/SheetModel.js";

// const app = express();



// app.use(
//   cors({
//     origin: [
//       "http://localhost:5173",
//       "https://imediareports-zi3j.vercel.app",
//     ],
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     withCrendentials:true
//   })
// );





// // MongoDB Connection
// const MONGO_URI ="mongodb+srv://imediaAdmin:admin123@cluster0.rqzwk8k.mongodb.net/imediareports";
// mongoose
//   .connect(MONGO_URI)
//   .then(() => console.log("✅ MongoDB connected successfully"))
//   .catch((err) => console.error("❌ Connection error:", err));

// // Router Middleware
// app.use("/api", router);

// // Root Route
// app.get("/", (req, res) => res.send("✅ Express + MongoDB connected successfully"));

// // app.post("/api/signup",)

// app.use("/api/heartbeat", express.raw({ type: "application/json" }));
// // app.use("/api/offline", express.raw({ type: "application/json" }));



// setInterval(async () => {
//   try {
//     const cutoff = new Date(Date.now() - 20000); // 20 sec threshold

//     const result = await User.updateMany(
//       { isOnline: true, lastActive: { $lt: cutoff } },
//       { $set: { isOnline: false } }
//     );

//     if (result.modifiedCount > 0) {
//       console.log("🔴 Auto offline users updated:", result.modifiedCount);
//     }
//   } catch (err) {
//     console.error("Auto-offline cleanup failed:", err);
//   }
// }, 5000);
// // Start Server
// const PORT = 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import router from "./routers/SheetRoute.js";
import { User } from "./models/SheetModel.js";
import { createServer } from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";

const app = express();

/* =============================
   MIDDLEWARE
============================= */
app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://imediareports-zi3j.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // ✅ fixed spelling
  })
);

/* =============================
   MONGODB CONNECTION
============================= */
const MONGO_URI =
  "mongodb+srv://imediaAdmin:admin123@cluster0.rqzwk8k.mongodb.net/imediareports";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ Connection error:", err));

/* =============================
   ROUTES
============================= */
app.use("/api", router);

app.get("/", (req, res) =>
  res.send("✅ Express + MongoDB + Socket.IO connected")
);

/* =============================
   SOCKET.IO SETUP
============================= */
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://imediareports-zi3j.vercel.app",
    ],
    credentials: true,
  },
});
const userSockets = new Map();

io.on("connection", async (socket) => {
  const token = socket.handshake.auth?.token;
  const decoded = jwt.verify(token, SECRET_KEY);
  const userId = decoded.userId;

  // Mark online
  await User.findByIdAndUpdate(userId, {
    isOnline: true,
    lastActive: new Date(),
  });

  userSockets.set(userId, socket.id);

  console.log("🟢 Online:", userId);

  socket.on("disconnect", () => {
    console.log("Disconnect detected:", userId);

    // Delay offline
    setTimeout(async () => {
      const currentSocket = userSockets.get(userId);

      // If user didn't reconnect
      if (currentSocket !== socket.id) return;

      userSockets.delete(userId);

      await User.findByIdAndUpdate(userId, {
        isOnline: false,
        lastActive: new Date(),
      });

      console.log("🔴 Offline:", userId);
    }, 5000); // 🔥 5 seconds delay
  });
});
/* =============================
   START SERVER
============================= */
const PORT = 5000;

httpServer.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);