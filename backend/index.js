// // import express from "express";
// // import mongoose from "mongoose";

// // const app = express();
// // app.use(express.json());

// // // MongoDB connection string (local)
// // const MONGO_URI = "mongodb://127.0.0.1:27017/imediareports";

// // // Connect to MongoDB
// // mongoose.connect(MONGO_URI)
// //   .then(() => console.log("MongoDB connected successfully"))
// //   .catch((err) => console.error("Connection error:", err));

// // app.get("/", (req, res) => {
// //   res.send("Express and MongoDB connected without dotenv!");
// // });

// // const PORT = 5000;
// // app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";

// const app = express();
// app.use(cors());
// app.use(express.json());

// // MongoDB connection
// const MONGO_URI = "mongodb://127.0.0.1:27017/imediareports";
// mongoose
//   .connect(MONGO_URI)
//   .then(() => console.log("✅ MongoDB connected successfully"))
//   .catch((err) => console.error("❌ Connection error:", err));

// // =====================
// // 🧩 MODEL
// // =====================
// const sheetSchema = new mongoose.Schema(
//   {
//     name: String,
//     data: [mongoose.Schema.Types.Mixed], // holds Excel JSON
//   },
//   { timestamps: true }
// );

// const Sheet = mongoose.model("Sheet", sheetSchema);

// // =====================
// // ⚙️ CONTROLLERS
// // =====================

// // Upload Excel JSON data
// app.post("/api/upload", async (req, res) => {
//   try {
//     const { sheets } = req.body;
//     if (!sheets || sheets.length === 0)
//       return res.status(400).json({ message: "No sheet data provided" });

//     // Remove old data and insert new
//     await Sheet.deleteMany({});
//     const saved = await Sheet.insertMany(sheets);
//     res.status(201).json({ message: "Data saved successfully", saved });
//   } catch (err) {
//     console.error("Error saving data:", err);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });

// // Fetch all sheets
// app.get("/api/sheets", async (req, res) => {
//   try {
//     const allSheets = await Sheet.find();
//     res.json(allSheets);
//   } catch (err) {
//     console.error("Error fetching sheets:", err);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });

// // =====================
// // 🏠 ROOT
// // =====================
// app.get("/", (req, res) => res.send("✅ Express + Mongo running fine"));

// const PORT = 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


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
      "https://imedireports.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

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
