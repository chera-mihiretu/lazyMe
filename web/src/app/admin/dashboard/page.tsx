"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import Navbar from "@/components/admin/Navbar";
import AddDepartmentDialog from "@/components/admin/AddDepartmentDialog";
import AnalyticsPanel from "@/components/admin/AnalyticsPanel";
import AddUniversityDialog from "@/components/admin/AddUniversityDialog";
import AddSchoolDialog from "@/components/admin/AddSchoolDialog";
import AddMaterialDialog from "@/components/admin/AddMaterialDialog";
import UniversitiesSection from "@/components/admin/UniversitiesSection";
import SchoolsSection from "@/components/admin/SchoolsSection";
import DepartmentsSection from "@/components/admin/DepartmentsSection";
import MaterialsSection from "@/components/admin/MaterialsSection";
import ProtectedRoute from "@/app/ProtectedRoute";

const AdminDashboard: React.FC = () => {
  // Dialog open/close state only
  const [showMaterialDialog, setShowMaterialDialog] = useState(false);
  const [showDepartmentDialog, setShowDepartmentDialog] = useState(false);
  const [showUniversityDialog, setShowUniversityDialog] = useState(false);
  const [showSchoolDialog, setShowSchoolDialog] = useState(false);

  
  return (
    <ProtectedRoute role="admin">
    <div className="w-screen min-h-screen bg-[#f7f7fa]">
      <Navbar />
      <div className="max-w-[1200px] mx-auto p-8 pt-8 pb-8">
        <AnalyticsPanel />
        <div className="flex gap-8 flex-wrap mt-6">
          {/* See Reports */}
          <Link href="/admin/reports" className="no-underline">
            <div className="bg-white rounded-[14px] shadow-[0_2px_8px_#4320d120] px-8 py-6 flex items-center min-w-[220px] cursor-pointer transition-shadow duration-200 gap-[18px]">
              <Image src="/icons/report.png" alt="See Reports" width={36} height={36} className="w-9 h-9" />
              <span className="font-semibold text-[18px] text-[#4320d1]">See Reports</span>
            </div>
          </Link>
          {/* Unverified Posts */}
          <Link href="/admin/unverified-posts" className="no-underline">
            <div className="bg-white rounded-[14px] shadow-[0_2px_8px_#4320d120] px-8 py-6 flex items-center min-w-[220px] cursor-pointer transition-shadow duration-200 gap-[18px]">
              <Image src="/icons/verify-posts.png" alt="Unverified Posts" width={36} height={36} className="w-9 h-9" />
              <span className="font-semibold text-[18px] text-[#4320d1]">Unverified Posts</span>
            </div>
          </Link>
          {/* Add University - Dialog */}
          <div className="relative">
            <div
              className="bg-white rounded-[14px] shadow-[0_2px_8px_#4320d120] px-8 py-6 flex items-center min-w-[220px] cursor-pointer transition-shadow duration-200 gap-[18px]"
              onClick={() => setShowUniversityDialog(true)}
            >
              <Image src="/icons/school.png" alt="Add University" width={36} height={36} className="w-9 h-9" />
              <span className="font-semibold text-[18px] text-[#4320d1]">Add University</span>
            </div>
            <AddUniversityDialog
              open={showUniversityDialog}
              onClose={() => setShowUniversityDialog(false)}
            />
          </div>
          {/* Add School - Dialog */}
          <div className="relative">
            <div
              className="bg-white rounded-[14px] shadow-[0_2px_8px_#4320d120] px-8 py-6 flex items-center min-w-[220px] cursor-pointer transition-shadow duration-200 gap-[18px]"
              onClick={() => setShowSchoolDialog(true)}
            >
              <Image src="/icons/school.png" alt="Add School" width={36} height={36} className="w-9 h-9" />
              <span className="font-semibold text-[18px] text-[#4320d1]">Add School</span>
            </div>
            <AddSchoolDialog
              open={showSchoolDialog}
              onClose={() => setShowSchoolDialog(false)}
            />
          </div>
          {/* Add Department - Dialog */}
          <div className="relative">
            <div
              className="bg-white rounded-[14px] shadow-[0_2px_8px_#4320d120] px-8 py-6 flex items-center min-w-[220px] cursor-pointer transition-shadow duration-200 gap-[18px]"
              onClick={() => setShowDepartmentDialog(true)}
            >
              <Image src="/icons/school.png" alt="Add Department" width={36} height={36} className="w-9 h-9" />
              <span className="font-semibold text-[18px] text-[#4320d1]">Add Department</span>
            </div>
            <AddDepartmentDialog
              open={showDepartmentDialog}
              onClose={() => setShowDepartmentDialog(false)}
            />
          </div>
          {/* Add Material - Dialog */}
          <div className="relative">
            <div
              className="bg-white rounded-[14px] shadow-[0_2px_8px_#4320d120] px-8 py-6 flex items-center min-w-[220px] cursor-pointer transition-shadow duration-200 gap-[18px]"
              onClick={() => setShowMaterialDialog(true)}
            >
              <Image src="/icons/material.png" alt="Add Material" width={36} height={36} className="w-9 h-9" />
              <span className="font-semibold text-[18px] text-[#4320d1]">Add Material</span>
            </div>
            <AddMaterialDialog
              open={showMaterialDialog}
              onClose={() => setShowMaterialDialog(false)}
            />
          </div>
        </div>
        {/* Data Sections */}
        <div className="mt-12 flex flex-col gap-8">
          {/* Universities Section */}
          <UniversitiesSection />
          {/* Schools Section */}
          <SchoolsSection />
          {/* Departments Section */}
          <DepartmentsSection />
          {/* Materials Section */}
          <MaterialsSection />
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
};

export default AdminDashboard;
