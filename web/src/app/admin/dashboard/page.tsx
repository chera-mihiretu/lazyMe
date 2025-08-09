"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { 
  BarChart3, 
  FileText, 
  CheckSquare, 
  Building, 
  GraduationCap, 
  BookOpen, 
  FileImage, 
  Mail,
  Plus,
  TrendingUp,
  Users,
  Activity,
  Sparkles
} from 'lucide-react';

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
import AdminEmailDialog from "@/components/admin/AdminEmailDialog";

const AdminDashboard: React.FC = () => {
  // Dialog open/close state only
  const [showMaterialDialog, setShowMaterialDialog] = useState(false);
  const [showDepartmentDialog, setShowDepartmentDialog] = useState(false);
  const [showUniversityDialog, setShowUniversityDialog] = useState(false);
  const [showSchoolDialog, setShowSchoolDialog] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);

  const quickActions = [
    {
      title: "See Reports",
      icon: BarChart3,
      color: "from-blue-500 to-blue-600",
      href: "/admin/reports",
      description: "View analytics and insights"
    },
    {
      title: "Unverified Posts",
      icon: CheckSquare,
      color: "from-orange-500 to-red-500",
      href: "/admin/unverified-posts",
      description: "Review pending content"
    },
    {
      title: "Add University",
      icon: Building,
      color: "from-purple-500 to-purple-600",
      action: () => setShowUniversityDialog(true),
      description: "Create new university"
    },
    {
      title: "Add School",
      icon: GraduationCap,
      color: "from-green-500 to-green-600",
      action: () => setShowSchoolDialog(true),
      description: "Create new school"
    },
    {
      title: "Add Department",
      icon: BookOpen,
      color: "from-indigo-500 to-indigo-600",
      action: () => setShowDepartmentDialog(true),
      description: "Create new department"
    },
    {
      title: "Add Material",
      icon: FileImage,
      color: "from-pink-500 to-pink-600",
      action: () => setShowMaterialDialog(true),
      description: "Upload new material"
    },
    {
      title: "Send Users Email",
      icon: Mail,
      color: "from-cyan-500 to-cyan-600",
      action: () => setShowEmailDialog(true),
      description: "Broadcast to users"
    }
  ];

  return (
    <ProtectedRoute role="admin">
      <div className="min-h-screen bg-white relative">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50"></div>
          
          {/* Floating Orbs */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-100/30 rounded-full blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-100/30 rounded-full blur-3xl"
            animate={{
              x: [0, -80, 0],
              y: [0, 60, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,.02)_1px,transparent_1px)] bg-[size:100px_100px]"></div>
          
          {/* Animated Particles */}
          <div className="absolute inset-0">
            {[...Array(15)].map((_, i) => {
              const left = (i * 23 + 13) % 100;
              const top = (i * 37 + 27) % 100;
              const duration = 4 + (i % 3);
              const delay = (i % 5) * 0.6;
              
              return (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-purple-300/40 rounded-full"
                  style={{
                    left: `${left}%`,
                    top: `${top}%`,
                  }}
                  animate={{
                    y: [0, -120, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: duration,
                    repeat: Infinity,
                    delay: delay,
                    ease: "easeInOut"
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Navbar */}
        <Navbar />

        {/* Main Content */}
        <div className="relative z-10 max-w-7xl mx-auto p-6 pt-8">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center px-4 py-2 rounded-full bg-purple-100 border border-purple-200 text-purple-700 text-sm font-medium mb-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Admin Dashboard
            </motion.div>

            <motion.h1
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Welcome to
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"> Control Center</span>
            </motion.h1>

            <motion.p
              className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Manage your platform with powerful tools and real-time insights
            </motion.p>
          </motion.div>

          {/* Analytics Panel */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <AnalyticsPanel />
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            className="mt-12 mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <motion.h2
              className="text-2xl font-bold text-gray-900 mb-8 flex items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              <Activity className="w-6 h-6 mr-3 text-purple-600" />
              Quick Actions
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {quickActions.map((action, index) => {
                const Icon = action.icon;

                return (
                  <motion.div
                    key={action.title}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
                  >
                    {action.href ? (
                      <Link href={action.href}>
                        <motion.div
                          className="group relative bg-white rounded-2xl border border-gray-200 p-6 shadow-lg hover:shadow-xl cursor-pointer overflow-hidden"
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ duration: 0.3 }}
                        >
                          {/* Background Gradient */}
                          <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                          
                          {/* Icon */}
                          <motion.div
                            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} p-3 mb-4 shadow-lg`}
                            whileHover={{ rotate: 5, scale: 1.1 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Icon className="w-full h-full text-white" />
                          </motion.div>

                          {/* Content */}
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-purple-700 transition-colors duration-300">
                            {action.title}
                          </h3>
                          <p className="text-gray-600 text-sm group-hover:text-gray-700 transition-colors duration-300">
                            {action.description}
                          </p>

                          {/* Hover Effect */}
                          <motion.div
                            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            whileHover={{ scale: 1.2 }}
                          >
                            <Plus className="w-3 h-3 text-gray-600" />
                          </motion.div>
                        </motion.div>
                      </Link>
                    ) : (
                      <motion.div
                        className="group relative bg-white rounded-2xl border border-gray-200 p-6 shadow-lg hover:shadow-xl cursor-pointer overflow-hidden"
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.3 }}
                        onClick={action.action}
                      >
                        {/* Background Gradient */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                        
                        {/* Icon */}
                        <motion.div
                          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} p-3 mb-4 shadow-lg`}
                          whileHover={{ rotate: 5, scale: 1.1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Icon className="w-full h-full text-white" />
                        </motion.div>

                        {/* Content */}
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-purple-700 transition-colors duration-300">
                          {action.title}
                        </h3>
                        <p className="text-gray-600 text-sm group-hover:text-gray-700 transition-colors duration-300">
                          {action.description}
                        </p>

                        {/* Hover Effect */}
                        <motion.div
                          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          whileHover={{ scale: 1.2 }}
                        >
                          <Plus className="w-3 h-3 text-gray-600" />
                        </motion.div>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Data Sections */}
          <motion.div
            className="space-y-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.8 }}
          >
            <motion.h2
              className="text-2xl font-bold text-gray-900 mb-8 flex items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1, duration: 0.6 }}
            >
              <TrendingUp className="w-6 h-6 mr-3 text-blue-600" />
              Data Management
            </motion.h2>

            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              <UniversitiesSection />
              <SchoolsSection />
              <DepartmentsSection />
              <MaterialsSection />
            </motion.div>
          </motion.div>
        </div>

        {/* Dialogs */}
        <AddUniversityDialog
          open={showUniversityDialog}
          onClose={() => setShowUniversityDialog(false)}
        />
        <AddSchoolDialog
          open={showSchoolDialog}
          onClose={() => setShowSchoolDialog(false)}
        />
        <AddDepartmentDialog
          open={showDepartmentDialog}
          onClose={() => setShowDepartmentDialog(false)}
        />
        <AddMaterialDialog
          open={showMaterialDialog}
          onClose={() => setShowMaterialDialog(false)}
        />
        <AdminEmailDialog
          open={showEmailDialog}
          onClose={() => setShowEmailDialog(false)}
        />

        {/* Footer */}
        <motion.footer
          className="relative z-10 text-center text-gray-500 text-sm py-8 mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.6 }}
        >
          © 2025 IKnow Admin Panel. Managing your platform with precision.
        </motion.footer>
      </div>
    </ProtectedRoute>
  );
};

export default AdminDashboard;
