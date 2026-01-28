

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  User,
  Sheet,
  GenealogySheet,
  LoginActivity,
  FailedAttempt, // ✅ Added new model
} from "../models/SheetModel.js";

const SECRET_KEY = "mySecretKey";

/* ---------------------- HELPERS ---------------------- */

const STRIP_KEYS = new Set([
  "publisher",
  "advertiser",
  "campaign",
  "uploadedBy",
  "uploadedByName",
  "uploadTime",
  "metadata",
  "__sheetOriginalName",
  "__rowIndex",
]);

const stripRowMeta = (row) => {
  if (!row || typeof row !== "object") return {};
  const clean = {};
  for (const k of Object.keys(row)) {
    if (!STRIP_KEYS.has(k)) clean[k] = row[k];
  }
  return clean;
};

const normalizeRows = (data) => {
  if (!Array.isArray(data)) return [];
  return data.map((r) =>
    r && typeof r === "object" && !Array.isArray(r) ? stripRowMeta(r) : r
  );
};

/* ---------------------- LOGIN ACTIVITY HELPERS ---------------------- */

const recordSuccessLogin = async (user, req) => {
  try {
    await LoginActivity.create({
      userId: user._id,
      username: user.name,
      action: "login_success",
      ipAddress: req.ip,
      browser: req.headers["user-agent"],
    });
  } catch (err) {
    console.log("⚠️ Couldn't save login success log:", err.message);
  }
};

const recordFailedLogin = async (username, req) => {
  try {
    await LoginActivity.create({
      username: username || "unknown",
      action: "login_failed",
      ipAddress: req.ip,
      browser: req.headers["user-agent"],
    });
  } catch (err) {
    console.log("⚠️ Couldn't save failed login log:", err.message);
  }
};

/* ---------------------- AUTH ---------------------- */

// ✅ SIGNUP (UNCHANGED)
export const signupUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role)
      return res.status(400).json({ message: "All fields are required" });

    const validRoles = ["admin", "publisher", "advertiser", "executive"];
    if (!validRoles.includes(role.toLowerCase()))
      return res.status(400).json({ message: "Invalid role" });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role.toLowerCase(),
    });

    await newUser.save();

    res.status(201).json({
      message: "Signup successful",
      user: newUser,
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/* ---------------------- LOGIN WITH BLOCK LOGIC ---------------------- */

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email,password);
    

    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email:email ,rowStatus:true});

    /* ✅ USER NOT FOUND */
    if (!user) {
      
      await recordFailedLogin(email, req);
      return res.status(404).json({ message: "User not found" });
    }

    /* ✅ CHECK IF USER ALREADY BLOCKED */
    let attemptDoc = await FailedAttempt.findOne({ username: user.name });

    if (attemptDoc?.blocked) {
      return res.status(403).json({
        message:
          "Account blocked due to multiple failed attempts. Contact admin.",
      });
    }

    /* ✅ CHECK PASSWORD */
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      await recordFailedLogin(user.name, req);

      if (!attemptDoc) {
        attemptDoc = await FailedAttempt.create({
          username: user.name,
          attempts: 1,
          blocked: false,
        });
      } else {
        attemptDoc.attempts += 1;
      }

      if (attemptDoc.attempts >= 3) {
        attemptDoc.blocked = true;
      }

      attemptDoc.lastAttempt = new Date();
      await attemptDoc.save();

      return res.status(401).json({
        message: attemptDoc.blocked
          ? "Account blocked after 3 failed attempts!"
          : "Invalid credentials",
      });
    }

    /* ✅ SUCCESSFUL LOGIN — RESET FAILED ATTEMPTS */
    if (attemptDoc) {
      attemptDoc.attempts = 0;
      attemptDoc.blocked = false;
      await attemptDoc.save();
    }

    /* ✅ RECORD SUCCESS */
    await recordSuccessLogin(user, req);

    /* ✅ UPDATE ONLINE STATUS */
    user.isOnline = true;
    user.lastActive = new Date();
    await user.save();

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      SECRET_KEY,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isOnline: true,
        lastActive: user.lastActive,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/* ---------------------- SHEETS UPLOAD (UNCHANGED) ---------------------- */

// export const uploadSheets = async (req, res) => {
//   try {
//     const { sheets, meta } = req.body;

//     const publisher = req.body.publisher || meta?.publisher;
//     const advertiser = req.body.advertiser || meta?.advertiser;
//     const campaign = req.body.campaign || meta?.campaign;
//     const uploadedBy = req.body.uploadedBy || meta?.uploadedBy;

//     if (!sheets?.length)
//       return res.status(400).json({ message: "No sheet data provided" });

//     if (!publisher || !advertiser || !campaign || !uploadedBy)
//       return res.status(400).json({ message: "Missing required metadata fields" });

//     const uploader = await User.findOne({ name: uploadedBy });
//     if (!uploader)
//       return res.status(404).json({ message: `Uploader '${uploadedBy}' not found` });

//     const formattedSheets = sheets.map((sheet) => ({
//       name: sheet.name || sheet.original || "Unknown",
//       data: normalizeRows(sheet.data),
//       publisher,
//       advertiser,
//       campaign,
//       uploadedBy: uploader._id,
//       uploadedByName: uploader.name,
//     }));

//     const savedSheets = await Sheet.insertMany(formattedSheets);

//     res.status(201).json({
//       message: "Sheets uploaded successfully",
//       savedSheets,
//     });
//   } catch (err) {
//     console.error("Error saving sheets:", err);
//     res.status(500).json({
//       message: "Internal Server Error",
//       error: err.message,
//     });
//   }
// };


export const uploadSheets = async (req, res) => {
  try {
    console.log(req.body,"bodyyy");
    
    const { sheets, meta } = req.body;
    console.log(meta,"metadata");
    

    const publisher = req.body.publisher || meta?.publisher;
    const advertiser = req.body.advertiser || meta?.advertiser;
    const campaign = req.body.campaign || meta?.campaign;
    const uploadedBy = req.body.uploadedBy || meta?.uploadedBy;
    const publisher_id=req.body.publisher_id || meta?.publisher_id
        const advertiser_id=req.body.advertiser_id || meta?.advertiser_id
          const uploadedByName = req.body.uploadedByName || meta?.uploadedByName;




    if (!sheets?.length)
      return res.status(400).json({ message: "No sheet data provided" });

    if (!publisher_id || !advertiser_id || !campaign || !uploadedBy)
      return res.status(400).json({ message: "Missing required metadata fields" });

    const uploader = await User.findOne({ name: uploadedByName });
    if (!uploader)
      return res.status(404).json({ message: `Uploader '${uploadedBy}' not found` });

    const results = [];

    // Process each sheet
    for (const sheet of sheets) {
      const name = sheet.name || sheet.original || "Unknown";
      const normalizedData = normalizeRows(sheet.data);

      // 🔍 Check if a sheet with same identifiers already exists
      const existingSheet = await Sheet.findOne({
        name,
        publisher_id,
        advertiser_id,
        campaign,
      });

      if (existingSheet) {
        // ✅ Append new rows
        existingSheet.data = [...existingSheet.data, ...normalizedData];
        await existingSheet.save();

        results.push({
          name,
          action: "updated",
          count: normalizedData.length,
        });
      } else {
        // ✅ Create a new sheet
        const newSheet = await Sheet.create({
          name,
          data: normalizedData,
          publisher,
          advertiser,
          campaign,
          uploadedBy: uploader._id,
          uploadedByName: uploader.name,
          publisher_id:publisher_id,
          advertiser_id:advertiser_id

        });

        results.push({
          name,
          action: "created",
          count: normalizedData.length,
        });
      }
    }

    res.status(201).json({
      message: "Sheets processed successfully",
      summary: results,
    });
  } catch (err) {
    console.error("Error saving sheets:", err);
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

/* ---------------------- GENEALOGY UPLOAD (UNCHANGED) ---------------------- */

// export const uploadGenealogySheets = async (req, res) => {
//   try {
//     const { sheets, meta } = req.body;

//     const publisher = req.body.publisher || meta?.publisher;
//     const advertiser = req.body.advertiser || meta?.advertiser;
//     const campaign = req.body.campaign || meta?.campaign;
//     const uploadedBy = req.body.uploadedBy || meta?.uploadedBy;
//         const publisher_id=req.body.publisher_id || meta?.publisher_id
//         const advertiser_id=req.body.advertiser_id || meta?.advertiser_id

//     if (!sheets?.length)
//       return res.status(400).json({ message: "No genealogy sheet data" });

//     if (!publisher_id || !advertiser_id || !campaign || !uploadedBy)
//       return res.status(400).json({ message: "Missing metadata" });

//     const uploader = await User.findOne({ name: uploadedBy });
//     if (!uploader)
//       return res.status(404).json({ message: `Uploader '${uploadedBy}' not found` });

//     const formattedSheets = sheets.map((sheet) => ({
//       name: sheet.name || sheet.original || "Unknown",
//       data: normalizeRows(sheet.data),
//       publisher,
//       advertiser,
//       campaign,
//       uploadedBy: uploader._id,
//       uploadedByName: uploader.name,
      
//     }));

//     const savedGenealogySheets = await GenealogySheet.insertMany(formattedSheets);

//     res.status(201).json({
//       message: "Genealogy sheets uploaded successfully",
//       savedGenealogySheets,
//     });
//   } catch (err) {
//     console.error("❌ Error saving genealogy sheets:", err);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };


export const uploadGenealogySheets = async (req, res) => {
  try {
    const { sheets, meta } = req.body;

    const publisher = req.body.publisher || meta?.publisher;
    const advertiser = req.body.advertiser || meta?.advertiser;
    const campaign = req.body.campaign || meta?.campaign;
    const uploadedBy = req.body.uploadedBy || meta?.uploadedBy;
    const uploadedByName=req.body.uploadedByName || meta?.uploadedByName
    const publisher_id = req.body.publisher_id || meta?.publisher_id;
    const advertiser_id = req.body.advertiser_id || meta?.advertiser_id;

    if (!sheets?.length)
      return res.status(400).json({ message: "No genealogy sheet data provided" });

    if (!publisher_id || !advertiser_id || !campaign || !uploadedBy)
      return res.status(400).json({ message: "Missing required metadata fields" });

    // 🔍 Validate uploader
    const uploader = await User.findOne( {name:uploadedByName} );
    if (!uploader)
      return res.status(404).json({ message: `Uploader '${uploadedBy}' not found` });

    const results = [];

    // 🧠 Loop through each genealogy sheet
    for (const sheet of sheets) {
      const name = sheet.name || sheet.original || "Unknown";
      const normalizedData = normalizeRows(sheet.data);

      // 🔍 Check if genealogy sheet already exists → append rows instead of creating duplicate
      const existingSheet = await GenealogySheet.findOne({
        name,
        publisher_id,
        advertiser_id,
        campaign,
      });

      if (existingSheet) {
        existingSheet.data = [...existingSheet.data, ...normalizedData];
        await existingSheet.save();

        results.push({
          name,
          action: "updated",
          count: normalizedData.length,
        });
      } else {
        await GenealogySheet.create({
          name,
          data: normalizedData,
          publisher,
          advertiser,
          campaign,
          uploadedBy: uploader._id,
          uploadedByName: uploader.name,
          publisher_id,
          advertiser_id,
        });

        results.push({
          name,
          action: "created",
          count: normalizedData.length,
        });
      }
    }

    res.status(201).json({
      message: "Genealogy sheets uploaded successfully",
      summary: results,
    });
  } catch (err) {
    console.error("❌ Error saving genealogy sheets:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};


/* ---------------------- GET SHEETS (UNCHANGED) ---------------------- */

export const getAllSheets = async (req, res) => {
  try {
    const { role, userId } = req.user;

    await User.findByIdAndUpdate(userId, {
      isOnline: true,
      lastActive: new Date(),
    });


    
    if (role === "admin") {
      const allSheets = await Sheet.find().populate("uploadedBy", "name email role");
      return res.status(200).json(allSheets);
    }

    if (role === "advertiser") {
      const advertiserSheets = await Sheet.find({ advertiser_id: userId });
      return res.status(200).json(advertiserSheets);
    }

    if (role === "publisher") {
      const publisherSheets = await Sheet.find({ publisher_id: userId });
      return res.status(200).json(publisherSheets);
    }
  } catch (error) {
    console.log(error);
  }
};

/* ---------------------- GENEALOGY FETCH (UNCHANGED) ---------------------- */

// export const getAllGenealogySheets = async (req, res) => {
//   try {
//     const userId = req.user?.userId || req.user?._id;

//     const userSheets = await GenealogySheet.find({
//       $or: [
//         { advertiser_id: userId },
//         { publisher_id: userId },
//       ],
//     }).populate("uploadedBy", "name email role");
// console.log(userSheets);

//     res.status(200).json({
//       genealogySheets: userSheets,
//     });
//   } catch (err) {
//     console.error("❌ Error fetching genealogy:", err);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };
export const getAllGenealogySheets = async (req, res) => {
  try {
    const data = await GenealogySheet.find({});
    return res.status(200).json({ genealogySheets: data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};
;

/* ---------------------- USER CRUD (UNCHANGED) ---------------------- */

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({rowStatus:true}, "-password");
    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).select("-password");

    if (!updated) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User updated successfully", user: updated });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    // const deleted = await User.findByIdAndupdate(req.params.id);

      const deleted = await User.findByIdAndUpdate(
      req.params.id,
      { rowStatus: false },
      { new: true }
    );
    if (!deleted) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/* ---------------------- FETCH ALL DATA (UNCHANGED) ---------------------- */

export const getAlldata = async (req, res) => {
  try {
    const allSheets = await Sheet.find().populate("uploadedBy", "name email role");
    const allGenealogy = await GenealogySheet.find().populate(
      "uploadedBy",
      "name email role"
    );

    res.status(200).json({
      message: "Fetched all uploaded data",
      totalSheets: allSheets.length,
      totalGenealogy: allGenealogy.length,
      sheets: allSheets,
      genealogySheets: allGenealogy,
    });
  } catch (err) {
    console.error("Error fetching all data:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/* ---------------------- LOGIN HISTORY (UNCHANGED) ---------------------- */

export const getLoginHistory = async (req, res) => {
  try {
    const logs = await LoginActivity.find().sort({ timestamp: -1 }).lean();
    res.status(200).json({ logs });
  } catch (err) {
    console.error("❌ Error fetching login history:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/* ---------------------- ONLINE USERS (UNCHANGED) ---------------------- */

export const getOnlineUsers = async (req, res) => {
  try {
    const users = await User.find({}, "name email role isOnline lastActive");

    res.status(200).json({
      message: "Online status fetched successfully",
      users,
    });
  } catch (error) {
    console.error("❌ Error fetching online users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



/* ---------------------- BLOCKED USERS LIST ---------------------- */

export const getBlockedUsers = async (req, res) => {
  try {
    const blockedUsers = await FailedAttempt.find({ blocked: true }).sort({ updatedAt: -1 });

    return res.status(200).json({
      message: "Blocked users fetched successfully",
      blockedUsers,
    });
  } catch (err) {
    console.error("❌ Error fetching blocked users:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


// ✅ UNBLOCK USER MANUALLY
export const unblockUser = async (req, res) => {
  try {
    const username = req.params.username;

    if (!username) {
      return res.status(400).json({ message: "Username required" });
    }

    let doc = await FailedAttempt.findOne({ username });

    if (!doc) {
      return res.status(404).json({
        message: "User has no failed attempts record",
      });
    }

    doc.blocked = false;
    doc.attempts = 0;
    await doc.save();

    return res.status(200).json({
      message: `${username} unblocked successfully`,
      blocked: false,
    });
  } catch (error) {
    console.error("❌ Error unblocking user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// ✅ BLOCK USER MANUALLY
export const blockUser = async (req, res) => {
  try {
    const username = req.params.username;

    if (!username) {
      return res.status(400).json({ message: "Username required" });
    }

    let doc = await FailedAttempt.findOne({ username });

    if (!doc) {
      doc = await FailedAttempt.create({
        username,
        attempts: 3,
        blocked: true,
      });
    } else {
      doc.blocked = true;
      doc.attempts = 3;
      await doc.save();
    }

    return res.status(200).json({
      message: `${username} blocked successfully`,
      blocked: true,
    });
  } catch (error) {
    console.error("❌ Error blocking user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// 📌 Get all Advertisers
export const getAdvertisers = async (req, res) => {
  try {
    const advertisers = await User.find(
      { role: "advertiser" },
      { password: 0 } // hide password
    ).sort({ createdAt: -1 });

    res.status(200).json(advertisers);
  } catch (error) {
    console.error("❌ Error fetching advertisers:", error);
    res.status(500).json({ message: "Error fetching advertisers" });
  }
};

// 📌 Get all Publishers
export const getPublishers = async (req, res) => {
  try {
    const publishers = await User.find(
      { role: "publisher" },
      { password: 0 }
    ).sort({ createdAt: -1 });

    res.status(200).json(publishers);
  } catch (error) {
    console.error("❌ Error fetching publishers:", error);
    res.status(500).json({ message: "Error fetching publishers" });
  }
};

export const getExecutives = async (req, res) => {
  try {
    const executives = await User.find(
      { role: "executive" },
      { password: 0 }
    ).sort({ createdAt: -1 });

    res.status(200).json(executives);
  } catch (error) {
    console.error("❌ Error fetching executives:", error);
    res.status(500).json({ message: "Error fetching executives" });
  }
};


export const heartbeat = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Token missing" });
    }

    // verify token
    const decoded = jwt.verify(token, SECRET_KEY);

    const user = await User.findById(decoded.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 🔵 Update online state
    user.isOnline = true;
    user.lastActive = new Date();
    await user.save();

    return res.status(200).json({ message: "Heartbeat received" });
  } catch (err) {
    console.error("Heartbeat error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};
const AUTO_OFFLINE_MS = 5000; // 20 seconds

export const autoOfflineScan = async () => {
  try {
    const users = await User.find();

    const now = Date.now();

    for (let user of users) {
      if (user.isOnline && user.lastActive) {
        const diff = now - new Date(user.lastActive).getTime();

        if (diff > AUTO_OFFLINE_MS) {
          user.isOnline = false;
          await user.save();
        }
      }
    }
  } catch (err) {
    console.log("Auto-offline error:", err.message);
  }
};
