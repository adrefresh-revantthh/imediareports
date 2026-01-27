
// // // // // import mongoose from "mongoose";

// // // // // // ===== 👤 USER SCHEMA =====
// // // // // const userSchema = new mongoose.Schema(
// // // // //   {
// // // // //     name: { type: String, required: true, trim: true },
// // // // //     email: { type: String, required: true, unique: true, lowercase: true, trim: true },
// // // // //     password: { type: String, required: true, minlength: 6 },
// // // // //     role: {
// // // // //       type: String,
// // // // //       enum: ["admin", "publisher", "advertiser"],
// // // // //       default: "advertiser",
// // // // //       required: true,
// // // // //     },
// // // // //   },
// // // // //   { timestamps: true }
// // // // // );

// // // // // // ===== 📊 MAIN SHEET SCHEMA =====
// // // // // const sheetSchema = new mongoose.Schema(
// // // // //   {
// // // // //     name: { type: String, required: true, trim: true },
// // // // //     data: { type: [mongoose.Schema.Types.Mixed], default: [] }, // ✅ safer default
// // // // //     uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
// // // // //   },
// // // // //   { timestamps: true }
// // // // // );

// // // // // // ===== 🧬 GENEALOGY SHEET SCHEMA =====
// // // // // const genealogySheetSchema = new mongoose.Schema(
// // // // //   {
// // // // //     name: { type: String, required: true, trim: true },
// // // // //     data: { type: [mongoose.Schema.Types.Mixed], default: [] }, // ✅ use default instead of required
// // // // //     uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
// // // // //   },
// // // // //   { timestamps: true }
// // // // // );

// // // // // // ✅ Export Models
// // // // // const User = mongoose.models.User || mongoose.model("User", userSchema);
// // // // // const Sheet = mongoose.models.Sheet || mongoose.model("Sheet", sheetSchema);
// // // // // const GenealogySheet =
// // // // //   mongoose.models.GenealogySheet ||
// // // // //   mongoose.model("GenealogySheet", genealogySheetSchema);

// // // // // export { User, Sheet, GenealogySheet };

// // // // import mongoose from "mongoose";

// // // // // ===== 👤 USER SCHEMA =====
// // // // const userSchema = new mongoose.Schema(
// // // //   {
// // // //     name: { type: String, required: true, trim: true },
// // // //     email: { type: String, required: true, unique: true, lowercase: true, trim: true },
// // // //     password: { type: String, required: true, minlength: 6 },
// // // //     role: {
// // // //       type: String,
// // // //       enum: ["admin", "publisher", "advertiser"],
// // // //       default: "advertiser",
// // // //       required: true,
// // // //     },
// // // //   },
// // // //   { timestamps: true }
// // // // );

// // // // // ===== 📊 MAIN SHEET SCHEMA =====
// // // // const sheetSchema = new mongoose.Schema(
// // // //   {
// // // //     name: { type: String, required: true, trim: true },
// // // //     data: { type: [mongoose.Schema.Types.Mixed], default: [] },
// // // //     publisher: { type: String, required: true },
// // // //     advertiser: { type: String, required: true },
// // // //     campaign: { type: String, required: true },
// // // //     uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
// // // //   },
// // // //   { timestamps: true }
// // // // );

// // // // // ===== 🧬 GENEALOGY SHEET SCHEMA =====
// // // // const genealogySheetSchema = new mongoose.Schema(
// // // //   {
// // // //     name: { type: String, required: true, trim: true },
// // // //     data: { type: [mongoose.Schema.Types.Mixed], default: [] },
// // // //     publisher: { type: String, required: true },
// // // //     advertiser: { type: String, required: true },
// // // //     campaign: { type: String, required: true },
// // // //     uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
// // // //   },
// // // //   { timestamps: true }
// // // // );

// // // // // ✅ Export Models
// // // // const User = mongoose.models.User || mongoose.model("User", userSchema);
// // // // const Sheet = mongoose.models.Sheet || mongoose.model("Sheet", sheetSchema);
// // // // const GenealogySheet =
// // // //   mongoose.models.GenealogySheet ||
// // // //   mongoose.model("GenealogySheet", genealogySheetSchema);

// // // // export { User, Sheet, GenealogySheet };

// // // import mongoose from "mongoose";

// // // // ===== 👤 USER SCHEMA =====
// // // const userSchema = new mongoose.Schema(
// // //   {
// // //     name: { type: String, required: true, trim: true },
// // //     email: { type: String, required: true, unique: true, lowercase: true, trim: true },
// // //     password: { type: String, required: true, minlength: 6 },
// // //     role: {
// // //       type: String,
// // //       enum: ["admin", "publisher", "advertiser"],
// // //       default: "advertiser",
// // //       required: true,
// // //     },
// // //   },
// // //   { timestamps: true }
// // // );

// // // // ===== 📊 MAIN SHEET SCHEMA =====
// // // const sheetSchema = new mongoose.Schema(
// // //   {
// // //     name: { type: String, required: true, trim: true },
// // //     data: { type: [mongoose.Schema.Types.Mixed], default: [] },
// // //     publisher: { type: String, required: true },
// // //     advertiser: { type: String, required: true },
// // //     campaign: { type: String, required: true },
// // //     uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
// // //     uploadedByName: { type: String, required: true, trim: true }, // ✅ store uploader name also
// // //   },
// // //   { timestamps: true }
// // // );

// // // // ===== 🧬 GENEALOGY SHEET SCHEMA =====
// // // const genealogySheetSchema = new mongoose.Schema(
// // //   {
// // //     name: { type: String, required: true, trim: true },
// // //     data: { type: [mongoose.Schema.Types.Mixed], default: [] },
// // //     publisher: { type: String, required: true },
// // //     advertiser: { type: String, required: true },
// // //     campaign: { type: String, required: true },
// // //     uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
// // //     uploadedByName: { type: String, required: true, trim: true }, // ✅ same here
// // //   },
// // //   { timestamps: true }
// // // );

// // // // ✅ Export Models
// // // const User = mongoose.models.User || mongoose.model("User", userSchema);
// // // const Sheet = mongoose.models.Sheet || mongoose.model("Sheet", sheetSchema);
// // // const GenealogySheet =
// // //   mongoose.models.GenealogySheet ||
// // //   mongoose.model("GenealogySheet", genealogySheetSchema);

// // // export { User, Sheet, GenealogySheet };


// // import mongoose from "mongoose";

// // // ===== 👤 USER SCHEMA =====
// // const userSchema = new mongoose.Schema(
// //   {
// //     name: { type: String, required: true, trim: true },
// //     email: { type: String, required: true, unique: true, lowercase: true, trim: true },
// //     password: { type: String, required: true, minlength: 6 },
// //     role: {
// //       type: String,
// //       enum: ["admin", "publisher", "advertiser"],
// //       default: "advertiser",
// //       required: true,
// //     },
// //   },
// //   { timestamps: true }
// // );

// // // ===== 📊 MAIN SHEET SCHEMA =====
// // const sheetSchema = new mongoose.Schema(
// //   {
// //     name: { type: String, required: true, trim: true },
// //     data: { type: [mongoose.Schema.Types.Mixed], default: [] },
// //     publisher: { type: String, required: true },
// //     advertiser: { type: String, required: true },
// //     campaign: { type: String, required: true },
// //     uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
// //     uploadedByName: { type: String, required: true, trim: true },
// //   },
// //   { timestamps: true }
// // );

// // // ===== 🧬 GENEALOGY SHEET SCHEMA =====
// // const genealogySheetSchema = new mongoose.Schema(
// //   {
// //     name: { type: String, required: true, trim: true },
// //     data: { type: [mongoose.Schema.Types.Mixed], default: [] },
// //     publisher: { type: String, required: true },
// //     advertiser: { type: String, required: true },
// //     campaign: { type: String, required: true },
// //     uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
// //     uploadedByName: { type: String, required: true, trim: true },
// //   },
// //   { timestamps: true }
// // );

// // // ===== 🆕 LOGIN ACTIVITY SCHEMA =====
// // const loginActivitySchema = new mongoose.Schema(
// //   {
// //     userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
// //     username: { type: String, required: true },
// //     action: { type: String, enum: ["login_success", "login_failed"], required: true },
// //     ipAddress: { type: String },
// //     browser: { type: String },
// //     timestamp: { type: Date, default: Date.now },
// //   },
// //   { timestamps: true }
// // );

// // const LoginActivity =
// //   mongoose.models.LoginActivity ||
// //   mongoose.model("LoginActivity", loginActivitySchema);

// // // ✅ Export Models
// // const User = mongoose.models.User || mongoose.model("User", userSchema);
// // const Sheet = mongoose.models.Sheet || mongoose.model("Sheet", sheetSchema);
// // const GenealogySheet =
// //   mongoose.models.GenealogySheet ||
// //   mongoose.model("GenealogySheet", genealogySheetSchema);

// // export { User, Sheet, GenealogySheet, LoginActivity };

// import mongoose from "mongoose";

// /* ======================================================
//     ✅ USER SCHEMA (NO CHANGES)
// ====================================================== */
// const userSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true, trim: true },
//     email: { type: String, required: true, unique: true, lowercase: true, trim: true },
//     password: { type: String, required: true, minlength: 6 },
//     role: {
//       type: String,
//       enum: ["admin", "publisher", "advertiser"],
//       default: "advertiser",
//       required: true,
//     },
//   },
//   { timestamps: true }
// );

// /* ======================================================
//     ✅ MAIN SHEET SCHEMA (NO CHANGES)
// ====================================================== */
// const sheetSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true, trim: true },
//     data: { type: [mongoose.Schema.Types.Mixed], default: [] },
//     publisher: { type: String, required: true },
//     advertiser: { type: String, required: true },
//     campaign: { type: String, required: true },
//     uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     uploadedByName: { type: String, required: true, trim: true },
//   },
//   { timestamps: true }
// );

// /* ======================================================
//     ✅ GENEALOGY SHEET SCHEMA (NO CHANGES)
// ====================================================== */
// const genealogySheetSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true, trim: true },
//     data: { type: [mongoose.Schema.Types.Mixed], default: [] },
//     publisher: { type: String, required: true },
//     advertiser: { type: String, required: true },
//     campaign: { type: String, required: true },
//     uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     uploadedByName: { type: String, required: true, trim: true },
//   },
//   { timestamps: true }
// );

// /* ======================================================
//     ✅ LOGIN ACTIVITY SCHEMA (SUCCESS + FAILED LOGINS)
// ====================================================== */
// const loginActivitySchema = new mongoose.Schema(
//   {
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//     username: { type: String, required: true },  // display name
//     action: { type: String, enum: ["login_success", "login_failed"], required: true },
//     ipAddress: { type: String },
//     browser: { type: String },
//     timestamp: { type: Date, default: Date.now },
//   },
//   { timestamps: true }
// );

// /* ======================================================
//     ✅ FAILED ATTEMPT SCHEMA (BLOCKING / COUNTER)
// ====================================================== */
// const failedAttemptSchema = new mongoose.Schema(
//   {
//     username: { type: String, required: true },   // username = user.name
//     attempts: { type: Number, default: 0 },        // failed attempts count
//     blocked: { type: Boolean, default: false },    // block status
//     lastAttempt: { type: Date, default: Date.now },
//   },
//   { timestamps: true }
// );

// /* ======================================================
//     ✅ EXPORT MODELS
// ====================================================== */
// const User = mongoose.models.User || mongoose.model("User", userSchema);
// const Sheet = mongoose.models.Sheet || mongoose.model("Sheet", sheetSchema);
// const GenealogySheet =
//   mongoose.models.GenealogySheet || mongoose.model("GenealogySheet", genealogySheetSchema);

// const LoginActivity =
//   mongoose.models.LoginActivity || mongoose.model("LoginActivity", loginActivitySchema);

// const FailedAttempt =
//   mongoose.models.FailedAttempt || mongoose.model("FailedAttempt", failedAttemptSchema);

// export { User, Sheet, GenealogySheet, LoginActivity, FailedAttempt };

// import mongoose from "mongoose";

// /* ======================================================
//     ✅ USER SCHEMA (UPDATED without touching existing logic)
// ====================================================== */
// const userSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true, trim: true },
//     email: { type: String, required: true, unique: true, lowercase: true, trim: true },
//     password: { type: String, required: true, minlength: 6 },
//     role: {
//       type: String,
//       enum: ["admin", "publisher", "advertiser"],
//       default: "advertiser",
//       required: true,
//     },

//     /* ✅ NEW FIELDS FOR ONLINE STATUS TRACKING */
//     isOnline: { type: Boolean, default: false },  // whether the user is currently active
//     lastActive: { type: Date, default: null },    // last time user was active
//   },
//   { timestamps: true }
// );

// /* ======================================================
//     ✅ MAIN SHEET SCHEMA (NO CHANGES)
// ====================================================== */
// const sheetSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true, trim: true },
//     data: { type: [mongoose.Schema.Types.Mixed], default: [] },
//     publisher: { type: String, required: true },
//     advertiser: { type: String, required: true },
//     campaign: { type: String, required: true },
//     uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     uploadedByName: { type: String, required: true, trim: true },
//   },
//   { timestamps: true }
// );

// /* ======================================================
//     ✅ GENEALOGY SHEET SCHEMA (NO CHANGES)
// ====================================================== */
// const genealogySheetSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true, trim: true },
//     data: { type: [mongoose.Schema.Types.Mixed], default: [] },
//     publisher: { type: String, required: true },
//     advertiser: { type: String, required: true },
//     campaign: { type: String, required: true },
//     uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     uploadedByName: { type: String, required: true, trim: true },
//   },
//   { timestamps: true }
// );

// /* ======================================================
//     ✅ LOGIN ACTIVITY SCHEMA (NO CHANGES)
// ====================================================== */
// const loginActivitySchema = new mongoose.Schema(
//   {
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//     username: { type: String, required: true },
//     action: { type: String, enum: ["login_success", "login_failed"], required: true },
//     ipAddress: { type: String },
//     browser: { type: String },
//     timestamp: { type: Date, default: Date.now },
//   },
//   { timestamps: true }
// );

// /* ======================================================
//     ✅ FAILED ATTEMPT SCHEMA (NO CHANGES)
// ====================================================== */
// const failedAttemptSchema = new mongoose.Schema(
//   {
//     username: { type: String, required: true },
//     attempts: { type: Number, default: 0 },
//     blocked: { type: Boolean, default: false },
//     lastAttempt: { type: Date, default: Date.now },
//   },
//   { timestamps: true }
// );

// /* ======================================================
//     ✅ EXPORT MODELS
// ====================================================== */
// const User = mongoose.models.User || mongoose.model("User", userSchema);
// const Sheet = mongoose.models.Sheet || mongoose.model("Sheet", sheetSchema);
// const GenealogySheet =
//   mongoose.models.GenealogySheet || mongoose.model("GenealogySheet", genealogySheetSchema);

// const LoginActivity =
//   mongoose.models.LoginActivity || mongoose.model("LoginActivity", loginActivitySchema);

// const FailedAttempt =
//   mongoose.models.FailedAttempt || mongoose.model("FailedAttempt", failedAttemptSchema);

// export { User, Sheet, GenealogySheet, LoginActivity, FailedAttempt };

import mongoose from "mongoose";

/* ======================================================
    ✅ USER SCHEMA (UNCHANGED)
====================================================== */
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: {
      type: String,
      enum: ["admin", "publisher", "advertiser","executive"],
      default: "advertiser",
      required: true,
    },

    /* ✅ ONLINE STATUS TRACKING */
    isOnline: { type: Boolean, default: false },
    lastActive: { type: Date, default: null },
    rowStatus:{type:Boolean,default:true}
  },
  { timestamps: true }
);

/* ======================================================
    ✅ MAIN SHEET SCHEMA (UPDATED FOR PERFORMANCE)
====================================================== */
const sheetSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    data: { type: [mongoose.Schema.Types.Mixed], default: [] },
    publisher: { type: String, required: true },
    advertiser: { type: String, required: true },

     publisher_id: { type: String, required: true },
    advertiser_id: { type: String, required: true },
    campaign: { type: String, required: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    uploadedByName: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

/* ⚡ Added compound index for faster lookups */
sheetSchema.index({ name: 1, publisher: 1, advertiser: 1, campaign: 1 });

/* ======================================================
    ✅ GENEALOGY SHEET SCHEMA (UNCHANGED)
====================================================== */
const genealogySheetSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    data: { type: [mongoose.Schema.Types.Mixed], default: [] },
    publisher: { type: String, required: true },
    advertiser: { type: String, required: true },
     publisher_id: { type: String, required: true },
    advertiser_id: { type: String, required: true },
    campaign: { type: String, required: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    uploadedByName: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

/* ======================================================
    ✅ LOGIN ACTIVITY SCHEMA (UNCHANGED)
====================================================== */
const loginActivitySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    username: { type: String, required: true },
    action: { type: String, enum: ["login_success", "login_failed"], required: true },
    ipAddress: { type: String },
    browser: { type: String },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

/* ======================================================
    ✅ FAILED ATTEMPT SCHEMA (UNCHANGED)
====================================================== */
const failedAttemptSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    attempts: { type: Number, default: 0 },
    blocked: { type: Boolean, default: false },
    lastAttempt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

/* ======================================================
    ✅ EXPORT MODELS
====================================================== */
const User = mongoose.models.User || mongoose.model("User", userSchema);
const Sheet = mongoose.models.Sheet || mongoose.model("Sheet", sheetSchema);
const GenealogySheet =
  mongoose.models.GenealogySheet || mongoose.model("GenealogySheet", genealogySheetSchema);

const LoginActivity =
  mongoose.models.LoginActivity || mongoose.model("LoginActivity", loginActivitySchema);

const FailedAttempt =
  mongoose.models.FailedAttempt || mongoose.model("FailedAttempt", failedAttemptSchema);

export { User, Sheet, GenealogySheet, LoginActivity, FailedAttempt };
