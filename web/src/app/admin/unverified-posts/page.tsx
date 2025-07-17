"use client";
import React from "react";
import Navbar from "@/components/admin/Navbar";

const UnverifiedPostsPage: React.FC = () => (
  <div style={{ width: "100vw", minHeight: "100vh", background: "#f7f7fa" }}>
    <Navbar />
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1rem" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: "#4320d1", marginBottom: 24 }}>Unverified Posts</h1>
      <p style={{ fontSize: 16, color: "#444" }}>Review and verify posts submitted by users.</p>
    </div>
  </div>
);

export default UnverifiedPostsPage;
