"use client";
import React from 'react';
import { motion } from "framer-motion";
import { FileText, TrendingUp } from 'lucide-react';
import dynamic from 'next/dynamic';
const ProtectedRoute = dynamic(() => import('../../ProtectedRoute'), { ssr: false });
import HomeNavBar from '@/components/home/HomeNavBar';
import ExamsTree from './ExamsTree';

const ExamsPage = () => {
  return (
  <ProtectedRoute role='student'>
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
          {/* Header Section - Similar to Materials/Opportunity Page */}
          <motion.div
            className="mb-6 sm:mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Page Title */}
            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <motion.div
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 p-2.5 sm:p-3 shadow-lg"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                <FileText className="w-full h-full text-white" />
              </motion.div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Past Exams</h1>
                <p className="text-gray-600 mt-0.5 sm:mt-1 text-sm sm:text-base">Access past exams, practice questions, and exam resources</p>
              </div>
              <motion.div
                className="ml-auto inline-flex items-center px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-700 text-xs sm:text-sm font-medium"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                Exams Available
              </motion.div>
            </div>
          </motion.div>

          {/* Exams Tree */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
          >
        <ExamsTree />
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
};

export default ExamsPage;
