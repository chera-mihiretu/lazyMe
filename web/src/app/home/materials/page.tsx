"use client";
import React from 'react';
import { motion } from "framer-motion";
import { BookOpen, TrendingUp } from 'lucide-react';
import HomeNavBar from '@/components/home/HomeNavBar';
import MaterialsTree from './MaterialsTree';
import dynamic from 'next/dynamic';
const ProtectedRoute = dynamic(() => import('../../ProtectedRoute'), { ssr: false });

function MaterialsPage() {
  return (
    <ProtectedRoute role="student">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-100/20 via-blue-50/10 to-transparent"></div>
          
          {/* Floating Orbs */}
          <motion.div
            className="absolute top-1/3 left-1/5 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl"
            animate={{
              x: [0, 80, 0],
              y: [0, -60, 0],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div
            className="absolute bottom-1/3 right-1/5 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl"
            animate={{
              x: [0, -70, 0],
              y: [0, 50, 0],
            }}
            transition={{
              duration: 22,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,.02)_1px,transparent_1px)] bg-[size:100px_100px]"></div>
          
          {/* Animated Particles */}
          <div className="absolute inset-0">
            {[...Array(10)].map((_, i) => {
              const left = (i * 19 + 15) % 100;
              const top = (i * 31 + 25) % 100;
              const duration = 3.5 + (i % 3);
              const delay = (i % 4) * 0.7;
              
              return (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-purple-300/40 rounded-full"
                  style={{
                    left: `${left}%`,
                    top: `${top}%`,
                  }}
                  animate={{
                    y: [0, -100, 0],
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

        {/* Navigation */}
        <HomeNavBar />

        {/* Main Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          {/* Header Section - Similar to Opportunity Page */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Page Title */}
            <div className="flex items-center gap-4 mb-6">
              <motion.div
                className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 p-3 shadow-lg"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                <BookOpen className="w-full h-full text-white" />
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Study Materials</h1>
                <p className="text-gray-600 mt-1">Access comprehensive study resources and course materials</p>
              </div>
              <motion.div
                className="ml-auto inline-flex items-center px-3 py-1.5 rounded-full bg-purple-100 border border-purple-200 text-purple-700 text-sm font-medium"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Resources Available
              </motion.div>
            </div>
          </motion.div>

          {/* Materials Tree */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
          >
          <MaterialsTree />
          </motion.div>

          {/* Suggest Material Button */}
          <motion.div
            className="text-center mt-12 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <motion.button
              className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white font-semibold text-base px-6 py-3 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => alert('Suggest Material feature coming soon!')}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <span className="relative z-10 flex items-center gap-3">
                <motion.span
                  animate={{ rotate: [0, 180, 360] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="text-xl"
                >
                  +
                </motion.span>
                Suggest Material
              </span>
            </motion.button>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.footer
          className="relative z-10 text-center text-gray-500 text-sm py-6 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          © 2025 IKnow. Empowering students with knowledge.
        </motion.footer>
      </div>
    </ProtectedRoute>
  );
}

export default MaterialsPage;
