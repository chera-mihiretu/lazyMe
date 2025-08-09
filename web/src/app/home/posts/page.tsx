"use client";
import React from "react";
import { motion } from "framer-motion";
import HomeNavBar from "@/components/home/HomeNavBar";
import PostsList from "@/components/home/PostsList";
import UserSuggestionsList from "@/components/home/UserSuggestionsList";
import ProtectedRoute from "@/app/ProtectedRoute";

const PostsPage = () => {
  return (
    <ProtectedRoute role="student">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-100/20 via-blue-50/10 to-transparent"></div>
          
          {/* Floating Orbs */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl"
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
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl"
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
            {[...Array(12)].map((_, i) => {
              const left = (i * 23 + 13) % 100;
              const top = (i * 37 + 27) % 100;
              const duration = 4 + (i % 3);
              const delay = (i % 5) * 0.6;
              
              return (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-purple-300/30 rounded-full"
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

        {/* Navigation */}
        <HomeNavBar />

        {/* Main Content */}
        <div className="relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col xl:flex-row gap-8 items-start">
              {/* Main Content Area */}
              <motion.div
                className="flex-1 w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <PostsList />
              </motion.div>

              {/* Sidebar */}
              <motion.div
                className="hidden xl:block w-80 flex-shrink-0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <div className="sticky top-24">
                  <UserSuggestionsList />
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <motion.footer
          className="relative z-10 text-center text-gray-500 text-sm py-8 mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
        >
          © 2025 IKnow. Connecting campus communities.
        </motion.footer>
      </div>
    </ProtectedRoute>
  );
};

export default PostsPage;