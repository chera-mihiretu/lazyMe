"use client";
import React from "react";
import Navbar from "@/components/admin/Navbar";

const ReportsPage: React.FC = () => (
  <div style={{ width: "100vw", minHeight: "100vh", background: "#f7f7fa" }}>
    <Navbar />
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1rem" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: "#4320d1", marginBottom: 24 }}>Reports</h1>
      <p style={{ fontSize: 16, color: "#444" }}>View and manage all user reports here.</p>
    </div>
  </div>
);

export default ReportsPage;
