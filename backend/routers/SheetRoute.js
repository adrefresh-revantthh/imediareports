// import express from "express";
// import cors from "cors"
// import {
//   uploadSheets,
//   getAllSheets,
//   signupUser,
//   loginUser,
//   getAllUsers,
//   updateUser,
//   deleteUser,
//   getAlldata,
//   getAllGenealogySheets,
//   uploadGenealogySheets,
//   getLoginHistory,
//   getOnlineUsers, 
//   getBlockedUsers,blockUser,unblockUser,
//   getAdvertisers,
//   getPublishers,
//   getExecutives,
//   heartbeat,
//   // setOffline
// } from "../controllers/SheetController.js";

// import { verifyToken } from "../authMiddleware/authMiddleware.js";
// import { Sheet } from "../models/SheetModel.js";

// const router = express.Router();

// // ✅ SHEET ROUTES
// router.post("/upload",verifyToken,uploadSheets);
// router.get("/getallsheets", verifyToken, getAllSheets);
// router.get("/getalldata", getAlldata);

// // ✅ AUTH ROUTES
// router.post("/signup", signupUser);
// router.post("/login", loginUser);

// // ✅ USER ROUTES
// router.get("/getallusers", getAllUsers);
// router.put("/updateusers/:id", updateUser);
// router.delete("/deleteuser/:id", deleteUser);

// // ✅ GET SPECIFIC SHEETS
// router.post("/getsheetsbyids", async (req, res) => {
//   try {
//     const { sheetIds } = req.body;
//     const sheets = await Sheet.find({ _id: { $in: sheetIds } });
//     res.json(sheets);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch sheets" });
//   }
// });

// // ✅ GENEALOGY ROUTES
// router.post("/uploadGenealogy", verifyToken, uploadGenealogySheets);
// router.get("/getgenealogyrecords", verifyToken, getAllGenealogySheets);

// // ✅ LOGIN ACTIVITY ROUTE
// router.get("/login-history", verifyToken, getLoginHistory);

// // ✅ ✅ NEW — ONLINE STATUS ROUTE
// router.get("/online-users", verifyToken, getOnlineUsers);
// router.get("/blocked-users",getBlockedUsers)
// router.post("/block-user/:username", verifyToken, blockUser);
// router.post("/unblock-user/:username", verifyToken, unblockUser);

// router.get("/advertisers",getAdvertisers)
// router.get("/publishers",getPublishers)
// router.get("/executives",getExecutives)
// router.post(
//   "/heartbeat",
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//   }),
//   express.text({ type: "*/*" }),
//   heartbeat
// );



// export default router;

import express from "express";
import cors from "cors";
import {
  uploadSheets,
  getAllSheets,
  signupUser,
  loginUser,
  getAllUsers,
  updateUser,
  deleteUser,
  getAlldata,
  getAllGenealogySheets,
  uploadGenealogySheets,
  getLoginHistory,
  getOnlineUsers,
  getBlockedUsers,
  blockUser,
  unblockUser,
  getAdvertisers,
  getPublishers,
  getExecutives,
  heartbeat,
} from "../controllers/sheetController.js";

import { verifyToken } from "../authMiddleware/authMiddleware.js";
import { Sheet,GenealogySheet } from "../models/SheetModel.js";

const router = express.Router();

/* ---------------------------------------------------
   ✔ SHEET ROUTES
--------------------------------------------------- */
router.post("/upload", verifyToken, uploadSheets);
router.get("/getallsheets", verifyToken, getAllSheets);
router.get("/getalldata", getAlldata);

/* ---------------------------------------------------
   ✔ AUTH ROUTES
--------------------------------------------------- */
router.post("/signup", signupUser);
router.post("/login", loginUser);

/* ---------------------------------------------------
   ✔ USER CRUD
--------------------------------------------------- */
router.get("/getallusers", getAllUsers);
router.put("/updateusers/:id", updateUser);
router.delete("/deleteuser/:id", deleteUser);

/* ---------------------------------------------------
   ✔ FETCH SHEETS BY IDS
--------------------------------------------------- */
// router.post("/getsheetsbyids", async (req, res) => {
//   try {
//     const { sheetIds } = req.body;
//     const sheets = await Sheet.find({ _id: { $in: sheetIds } });

//     res.json(sheets);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch sheets" });
//   }
// });
router.post("/getsheetsbyids", async (req, res) => {
  try {
    const { sheetIds } = req.body;

    if (!Array.isArray(sheetIds) || sheetIds.length === 0) {
      return res.status(400).json({ error: "sheetIds array is required" });
    }

    // Fetch from both collections
    const normalSheets = await Sheet.find({ _id: { $in: sheetIds } }).lean();
    const genealogySheets = await GenealogySheet.find({ _id: { $in: sheetIds } }).lean();

    // Combine them
    const allSheets = [...normalSheets, ...genealogySheets];

    // OPTIONAL → Ensure results follow the order of sheetIds coming from frontend
    const sorted = sheetIds
      .map((id) => allSheets.find((s) => s._id.toString() === id))
      .filter(Boolean);

    res.json(sorted);
  } catch (err) {
    console.error("Error fetching sheets by IDs:", err);
    res.status(500).json({ error: "Failed to fetch sheets" });
  }
});


/* ---------------------------------------------------
   ✔ GENEALOGY ROUTES
--------------------------------------------------- */
router.post("/uploadGenealogy", verifyToken, uploadGenealogySheets);
router.get("/getgenealogyrecords", getAllGenealogySheets);

/* ---------------------------------------------------
   ✔ LOGIN HISTORY
--------------------------------------------------- */
router.get("/login-history", verifyToken, getLoginHistory);

/* ---------------------------------------------------
   ✔ ONLINE + BLOCKED USERS
--------------------------------------------------- */
router.get("/online-users", verifyToken, getOnlineUsers);
router.get("/blocked-users", getBlockedUsers);
router.post("/block-user/:username", verifyToken, blockUser);
router.post("/unblock-user/:username", verifyToken, unblockUser);

/* ---------------------------------------------------
   ✔ ROLE BASED LIST
--------------------------------------------------- */
router.get("/advertisers", getAdvertisers);
router.get("/publishers", getPublishers);
router.get("/executives", getExecutives);

/* ---------------------------------------------------
   🔵 FIXED HEARTBEAT ROUTE — JSON BODY + CORS OK
--------------------------------------------------- */
router.post(
  "/heartbeat",
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
  express.json(),      // <-- FIXED (was text parser)
  heartbeat            // <-- Controller
);

export default router;
