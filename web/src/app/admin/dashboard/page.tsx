"use client";
import React, { useState } from "react";
import Link from "next/link";

import Navbar from "@/components/admin/Navbar";
import AddDepartmentDialog from "@/components/admin/AddDepartmentDialog";
import AnalyticsPanel from "@/components/admin/AnalyticsPanel";
import AddUniversityDialog from "@/components/admin/AddUniversityDialog";
import AddSchoolDialog from "@/components/admin/AddSchoolDialog";
import AddMaterialDialog from "@/components/admin/AddMaterialDialog";
import UniversitiesSection from "@/components/admin/UniversitiesSection";
import SchoolsSection from "@/components/admin/SchoolsSection";
import DepartmentsSection from "@/components/admin/DepartmentsSection";

const AdminDashboard: React.FC = () => {
  // Dialog open/close state only
  const [showMaterialDialog, setShowMaterialDialog] = useState(false);
  const [showDepartmentDialog, setShowDepartmentDialog] = useState(false);
  const [showUniversityDialog, setShowUniversityDialog] = useState(false);
  const [showSchoolDialog, setShowSchoolDialog] = useState(false);

  // Dummy data for sections
  const universities = [
    { id: "1", name: "Harvard" },
    { id: "2", name: "MIT" },
    { id: "3", name: "Stanford" },
    { id: "4", name: "Oxford" },
  ];
  const departmentSchools = [
    { id: "1", name: "Engineering" },
    { id: "2", name: "Business" },
    { id: "3", name: "Arts" },
    { id: "4", name: "Medicine" },
  ];
  const materialDepartments = [
    { id: "1", name: "Computer Science" },
    { id: "2", name: "Marketing" },
    { id: "3", name: "Design" },
    { id: "4", name: "Biology" },
  ];
  const materialName = "Sample Material";
  const materialFile = null;
  // ...existing code...
  return (
    <div style={{ width: "100vw", minHeight: "100vh", background: "#f7f7fa" }}>
      <Navbar />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 1rem" }}>
        <AnalyticsPanel />
        <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', marginTop: 24 }}>
          {/* See Reports */}
          <Link href="/admin/reports" style={{ textDecoration: 'none' }}>
            <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 2px 8px #4320d120', padding: '24px 32px', display: 'flex', alignItems: 'center', minWidth: 220, cursor: 'pointer', transition: 'box-shadow 0.2s', gap: 18 }}>
              <img src="/icons/report.png" alt="See Reports" width={38} height={38} />
              <span style={{ fontWeight: 600, fontSize: 18, color: '#4320d1' }}>See Reports</span>
            </div>
          </Link>
          {/* Unverified Posts */}
          <Link href="/admin/unverified-posts" style={{ textDecoration: 'none' }}>
            <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 2px 8px #4320d120', padding: '24px 32px', display: 'flex', alignItems: 'center', minWidth: 220, cursor: 'pointer', transition: 'box-shadow 0.2s', gap: 18 }}>
              <img src="/icons/verify-posts.png" alt="Unverified Posts" width={38} height={38} />
              <span style={{ fontWeight: 600, fontSize: 18, color: '#4320d1' }}>Unverified Posts</span>
            </div>
          </Link>
          {/* Add University - Dialog */}
          <div style={{ position: 'relative' }}>
            <div
              style={{ background: '#fff', borderRadius: 14, boxShadow: '0 2px 8px #4320d120', padding: '24px 32px', display: 'flex', alignItems: 'center', minWidth: 220, cursor: 'pointer', transition: 'box-shadow 0.2s', gap: 18 }}
              onClick={() => setShowUniversityDialog(true)}
            >
              <img src="/icons/school.png" alt="Add University" width={38} height={38} />
              <span style={{ fontWeight: 600, fontSize: 18, color: '#4320d1' }}>Add University</span>
            </div>
            <AddUniversityDialog
              open={showUniversityDialog}
              onClose={() => setShowUniversityDialog(false)}
            />
          </div>
          {/* Add School - Dialog */}
          <div style={{ position: 'relative' }}>
            <div
              style={{ background: '#fff', borderRadius: 14, boxShadow: '0 2px 8px #4320d120', padding: '24px 32px', display: 'flex', alignItems: 'center', minWidth: 220, cursor: 'pointer', transition: 'box-shadow 0.2s', gap: 18 }}
              onClick={() => setShowSchoolDialog(true)}
            >
              <img src="/icons/school.png" alt="Add School" width={38} height={38} />
              <span style={{ fontWeight: 600, fontSize: 18, color: '#4320d1' }}>Add School</span>
            </div>
            <AddSchoolDialog
              open={showSchoolDialog}
              onClose={() => setShowSchoolDialog(false)}
            />
          </div>
          {/* Add Department - Dialog */}
          <div style={{ position: 'relative' }}>
            <div
              style={{ background: '#fff', borderRadius: 14, boxShadow: '0 2px 8px #4320d120', padding: '24px 32px', display: 'flex', alignItems: 'center', minWidth: 220, cursor: 'pointer', transition: 'box-shadow 0.2s', gap: 18 }}
              onClick={() => setShowDepartmentDialog(true)}
            >
              <img src="/icons/school.png" alt="Add Department" width={38} height={38} />
              <span style={{ fontWeight: 600, fontSize: 18, color: '#4320d1',  }}>Add Department</span>
            </div>
            <AddDepartmentDialog
              open={showDepartmentDialog}
              onClose={() => setShowDepartmentDialog(false)}
            />
          </div>
          {/* Add Material - Dialog */}
          <div style={{ position: 'relative' }}>
            <div
              style={{ background: '#fff', borderRadius: 14, boxShadow: '0 2px 8px #4320d120', padding: '24px 32px', display: 'flex', alignItems: 'center', minWidth: 220, cursor: 'pointer', transition: 'box-shadow 0.2s', gap: 18 }}
              onClick={() => setShowMaterialDialog(true)}
            >
              <img src="/icons/material.png" alt="Add Material" width={38} height={38} />
              <span style={{ fontWeight: 600, fontSize: 18, color: '#4320d1' }}>Add Material</span>
            </div>
            <AddMaterialDialog
              open={showMaterialDialog}
              onClose={() => setShowMaterialDialog(false)}
            />
          </div>
        </div>
        {/* Data Sections */}
        <div style={{ marginTop: 48, display: 'flex', flexDirection: 'column', gap: 32 }}>
          {/* Universities Section */}
          <UniversitiesSection />
          {/* Schools Section */}
          <SchoolsSection />
          {/* Departments Section */}
          <DepartmentsSection />
          {/* Materials Section */}
          <section style={{ background: '#fff', borderRadius: 14, boxShadow: '0 2px 8px #4320d120', padding: '24px 24px 18px 24px', display: 'flex', flexDirection: 'column', minHeight: 180 }}>
            <h3 style={{ fontWeight: 700, fontSize: 20, color: '#4320d1', marginBottom: 12 }}>Materials</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, margin: 0, padding: 0, flex: 1 }}>
              {materialFile ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f7f7fa', borderRadius: 8, padding: '8px 12px', marginBottom: 2 }}>
                  <span style={{ color: '#333', fontWeight: 500 }}>{materialName }</span>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      style={{ background: '#eee', color: '#4320d1', border: 'none', borderRadius: 6, padding: '4px 10px', fontWeight: 500, cursor: 'pointer', fontSize: 14 }}
                      onClick={() => alert('Edit Material')}
                    >Edit</button>
                    <button
                      style={{ background: '#f44336', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 10px', fontWeight: 500, cursor: 'pointer', fontSize: 14 }}
                      onClick={() => alert('Delete Material')}
                    >Delete</button>
                  </div>
                </div>
              ) : (
                <div style={{ color: '#aaa', fontWeight: 400, padding: '8px 0' }}>No materials yet</div>
              )}
            </div>
            <button style={{ marginTop: 14, background: '#4320d1', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 0', fontWeight: 600, cursor: 'pointer', width: '100%', fontSize: 16 }}>More</button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
