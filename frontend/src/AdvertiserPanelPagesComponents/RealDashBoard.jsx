import React, { useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import OTTReport from "./OttReport";
import SummaryReport from "./Summary";
import AdWidget from "./Advertise";
import VideoReport from "./NewVideoReport";

const MainDashboard = () => {
  const [sheetMap, setSheetMap] = useState({});
  const [publisher, setPublisher] = useState("");
  const [advertiser, setAdvertiser] = useState("");
  const [uploadedBy, setUploadedBy] = useState("");
  const [campaign, setCampaign] = useState("");
  const [customCampaign, setCustomCampaign] = useState("");
  const [uploading, setUploading] = useState(false);

  const publishers = ["Select Publisher", "john", "josh", "Zee5", "SonyLiv", "Disney+"];
  const advertisers = ["Select Advertiser", "Amazon", "Flipkart", "Swiggy", "Netflix", "Unilever"];
  const uploaders = ["Select Uploader", "user", "arjun", "kiran", "Sandeep Rao"];
  const campaigns = ["Select Campaign", "BigFest2025", "SummerSale", "Launch_X", "BrandAwareness", "Other"];

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const finalCampaign = campaign === "Other" ? customCampaign.trim() : campaign;

    if (!publisher || publisher === "Select Publisher") return alert("Select publisher");
    if (!advertiser || advertiser === "Select Advertiser") return alert("Select advertiser");
    if (!uploadedBy || uploadedBy === "Select Uploader") return alert("Select uploader");
    if (!finalCampaign || finalCampaign === "Select Campaign") return alert("Select campaign");

    setUploading(true);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const parsedSheets = workbook.SheetNames.map((sheetName) => ({
        name: sheetName.trim().toLowerCase().replace(/\s+/g, ""),
        original: sheetName,
        data: XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: "" }),
      }));

      const genealogySheets = parsedSheets.filter((s) =>
        ["genealogy", "tree", "referral", "network", "lineage"].some((k) => s.name.includes(k))
      );
      const otherSheets = parsedSheets.filter(
        (s) =>
          !["genealogy", "tree", "referral", "network", "lineage"].some((k) =>
            s.name.includes(k)
          )
      );

      const findSheet = (keywords) =>
        otherSheets.find((s) => keywords.some((k) => s.name.includes(k)))?.data || [];

      setSheetMap({
        adWidget: findSheet(["adwidget", "advertise"]),
        video: findSheet(["video", "videoreport"]),
        ott: findSheet(["ott", "ottreport"]),
        summary: findSheet(["summary", "summaryreport"]),
      });

      const userData = JSON.parse(localStorage.getItem("jwt"));
      const token = userData?.token;
      if (!token) {
        alert("Unauthorized");
        setUploading(false);
        return;
      }

      const payloadMeta = {
        publisher,
        advertiser,
        uploadedBy,
        campaign: finalCampaign,
        uploadTime: new Date().toISOString(),
      };

      // ✅ FIX: DO NOT ATTACH metadata inside rows
      const prepareSheets = (sheetsArray) =>
        sheetsArray.map((s) => ({
          name: s.name,
          original: s.original,
          data: s.data, // ✅ rows untouched
          publisher,
          advertiser,
          uploadedBy,
          campaign: finalCampaign,
          uploadTime: payloadMeta.uploadTime,
        }));

      const otherSheetsPayload = prepareSheets(otherSheets);
      const genealogySheetsPayload = prepareSheets(genealogySheets);

      try {
        await axios.post(
          "http://localhost:5000/api/upload",
          { sheets: otherSheetsPayload, meta: payloadMeta },
          { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } }
        );

        if (genealogySheetsPayload.length > 0) {
          await axios.post(
            "http://localhost:5000/api/uploadGenealogy",
            { sheets: genealogySheetsPayload, meta: payloadMeta },
            { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } }
          );
        }

        alert("✅ Upload Successful!");
      } catch (err) {
        console.error("Upload error:", err);
        alert(err?.response?.data?.message || "Upload failed");
      } finally {
        setUploading(false);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div style={styles.container}>
      <div style={styles.uploadBox}>
        <h2>📂 Upload Excel File with Metadata</h2>

        <div style={styles.formRow}>
          <select value={publisher} onChange={(e) => setPublisher(e.target.value)} style={styles.select}>
            {publishers.map((p) => <option key={p}>{p}</option>)}
          </select>

          <select value={advertiser} onChange={(e) => setAdvertiser(e.target.value)} style={styles.select}>
            {advertisers.map((a) => <option key={a}>{a}</option>)}
          </select>

          <select value={uploadedBy} onChange={(e) => setUploadedBy(e.target.value)} style={styles.select}>
            {uploaders.map((u) => <option key={u}>{u}</option>)}
          </select>
        </div>

        <div style={styles.formRow}>
          <select value={campaign} onChange={(e) => setCampaign(e.target.value)} style={styles.select}>
            {campaigns.map((c) => <option key={c}>{c}</option>)}
          </select>

          {campaign === "Other" && (
            <input
              type="text"
              placeholder="Enter campaign"
              value={customCampaign}
              onChange={(e) => setCustomCampaign(e.target.value)}
              style={styles.input}
            />
          )}
        </div>

        <input type="file" accept=".xlsx,.xls" onChange={handleFileUpload} style={styles.fileInput} />

        {uploading && <p>Uploading...</p>}
      </div>
    </div>
  );
};

const styles = {
  container: { padding: "25px", background: "#f4f6f9", minHeight: "100vh" },
  uploadBox: {
    textAlign: "center",
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  formRow: { display: "flex", gap: "10px", justifyContent: "center", marginBottom: "15px" },
  select: { padding: "10px", borderRadius: "6px", border: "1px solid #ccc", width: "180px" },
  input: { padding: "10px", borderRadius: "6px", border: "1px solid #ccc", width: "180px" },
  fileInput: { marginTop: "15px" },
};

export default MainDashboard;
