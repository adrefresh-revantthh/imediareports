import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainDashboard from "./AdvertiserPanelPagesComponents/RealDashBoard";
import OTTReport from "./AdvertiserPanelPagesComponents/OttReport";
import VideoReport from "./AdvertiserPanelPagesComponents/NewVideoReport";
import AdWidget from "./AdvertiserPanelPagesComponents/Advertise";
import SummaryReport from "./AdvertiserPanelPagesComponents/Summary";

import Signup from "./LoginAndSignupPages/Signup";
import Login from "./LoginAndSignupPages/Login";

import AdminPanel from "./AdminPanelPagesComponents/AdminPanel";
import AdvertiserPanel from "./AdvertiserPanelPagesComponents/AdvertiserPanel";

import PublisherPanel from "./PublisherPanelPagesComponents/PublisherPanel";
import ViewUploads from "./PublisherPanelPagesComponents/ViewUploads";
import DownloadSheets from "./PublisherPanelPagesComponents/DownloadSheets";
import PublisherEarnings from "./PublisherPanelPagesComponents/PublisherLevelEarnings";
import AdopsPanel from "./ExecutivePanel/AdopsPanel"
import "./App.css"
import BusinessOwnerPanel from "./BusinessOwnerPanel/Overview";
// import AdopsPanel from "./ExecutivePanel/AdopsPanel";
// import AdOpsUploadPanel from "./ExecutivePanel/AdopsPanel";

// AdopsPanel
export default function App() {
  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        margin: 0,
        padding: 0,
        background: "#f5f7fa",
        overflowX: "hidden", // ✅ fixes any horizontal scroll
      }}
    >
      <Routes>
        {/* ✅ Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" />} />
        

        {/* ✅ Auth Routes */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/business" element={<BusinessOwnerPanel/>} />
                <Route path="/adops" element={<AdopsPanel />} />

        <Route path="/login" element={<Login />} />

        {/* ✅ Advertiser Panel Routes */}
        <Route path="/advertiserpanel" element={<AdvertiserPanel />} />
        <Route path="/main" element={<MainDashboard />} />
        <Route path="/daily" element={<OTTReport />} />
        <Route path="/video" element={<VideoReport />} />
        <Route path="/adw" element={<AdWidget />} />
        <Route path="/overall" element={<SummaryReport />} />

        {/* ✅ Admin Panel */}
        <Route path="/adminpanel" element={<AdminPanel />} />

        {/* ✅ Publisher Panel */}
        <Route path="/publisherpanel" element={<PublisherPanel />} />
        <Route path="/viewuploads" element={<ViewUploads />} />
        <Route path="/downloadsheets" element={<DownloadSheets />} />
        <Route path="/publisherlevelearnings" element={<PublisherEarnings />} />
      </Routes>
    </div>
  );
}
