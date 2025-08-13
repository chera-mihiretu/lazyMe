"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Users, TrendingUp, UserPlus, Check, Loader2 } from 'lucide-react';
import { User } from "../../../types/post";
import HomeNavBar from "../../../components/home/HomeNavBar";
import ProtectedRoute from "@/app/ProtectedRoute";
import { useRouter } from "next/navigation";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const ConnectionsPage: React.FC = () => {
  const [requests, setRequests] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [accepting, setAccepting] = useState<string | null>(null);
  const router = useRouter();
 
  // Navigation handler for user profiles
  const handleUserClick = (userId: string) => {
    router.push(`/home/profile?id=${userId}`);
  };

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      setError("");
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const res = await fetch(`${baseUrl}/connections/requests/?page=1`, {
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        });
        const data = await res.json();
        if (res.ok && Array.isArray(data.connections)) {
          setRequests(data.connections);
        } else {
          setError("Failed to load connection requests.");
        }
      } catch (err) {
        setError("Network error. Please try again." + err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleAccept = async (userId: string) => {
    setAccepting(userId);
    setError("");
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const res = await fetch(`${baseUrl}/connections/accept`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ connector_id: userId }),
      });
      if (res.ok) {
        setRequests((prev) => prev.filter((u) => u.id !== userId));
      } else {
        setError("Failed to accept connection request.");
      }
    } catch (err) {
      setError("Network error. Please try again." + err);
    } finally {
      setAccepting(null);
    }
  };

  // Loading Component
  const LoadingComponent = () => (
    <motion.div
      className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-center space-x-3">
        <motion.div
          className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
          animate={{ scale: [1, 1.3, 1], rotate: [0, -180, -360] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
        />
        <motion.div
          className="w-4 h-4 bg-gradient-to-r from-purple-500 to-emerald-500 rounded-full"
          animate={{ scale: [1, 1.4, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
        />
      </div>
      <motion.p
        className="text-center text-gray-600 mt-4 text-base"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        Loading connection requests...
      </motion.p>
    </motion.div>
  );

  // Error Component
  const ErrorComponent = () => (
    <motion.div
      className="bg-red-50/80 backdrop-blur-sm rounded-2xl border border-red-200/50 p-8 text-center"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-500 rounded-full mx-auto mb-4 flex items-center justify-center"
        animate={{ rotate: [0, -5, 5, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </motion.div>
      <p className="text-red-700 font-semibold text-lg mb-2">Oops! Something went wrong</p>
      <p className="text-red-600 text-base">{error}</p>
    </motion.div>
  );

  // Empty State Component
  const EmptyStateComponent = () => (
    <motion.div
      className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-12 text-center"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="w-20 h-20 bg-gradient-to-br from-emerald-200 to-blue-200 rounded-full mx-auto mb-6 flex items-center justify-center"
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <UserPlus className="w-10 h-10 text-emerald-600" />
      </motion.div>
      <h3 className="text-xl font-bold text-gray-800 mb-3">No Connection Requests</h3>
      <p className="text-gray-600 text-base">You&apos;re all caught up! Check back later for new requests.</p>
    </motion.div>
  );

  return (
      <ProtectedRoute role="student">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-100/20 via-blue-50/10 to-transparent"></div>
          
          {/* Floating Orbs */}
          <motion.div
            className="absolute top-1/3 left-1/5 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl"
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
            {[...Array(8)].map((_, i) => {
              const left = (i * 23 + 12) % 100;
              const top = (i * 29 + 20) % 100;
              const duration = 4 + (i % 3);
              const delay = (i % 4) * 0.8;
              
              return (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-emerald-300/40 rounded-full"
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
        <div className="relative z-10 max-w-4xl mx-auto px-3 sm:px-4 lg:px-8 pt-6 sm:pt-8">
          {/* Header Section */}
          <motion.div
            className="mb-6 sm:mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Page Title */}
            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <motion.div
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-2.5 sm:p-3 shadow-lg"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                <Users className="w-full h-full text-white" />
              </motion.div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Connection Requests</h1>
                <p className="text-gray-600 mt-0.5 sm:mt-1 text-sm sm:text-base">Manage your incoming connection requests</p>
              </div>
              <motion.div
                className="ml-auto inline-flex items-center px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-700 text-xs sm:text-sm font-medium"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                {requests.length} Pending
              </motion.div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
          >
            {loading ? (
              <LoadingComponent />
            ) : error ? (
              <ErrorComponent />
            ) : requests.length === 0 ? (
              <EmptyStateComponent />
            ) : (
              <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-white/20 p-4 sm:p-6">
                {/* Header */}
                <motion.div
                  className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gray-200/50"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <motion.div
                    className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-md"
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </motion.div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                      Pending Requests
                    </h2>
                    <p className="text-gray-500 text-xs sm:text-sm mt-0.5">{requests.length} people want to connect with you</p>
                  </div>
                </motion.div>

                {/* Requests List */}
                <div className="space-y-3 sm:space-y-4">
                  <AnimatePresence>
                    {requests.map((user, index) => (
                      <motion.div
                        key={user.id}
                        className="flex items-center justify-between bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-lg sm:rounded-xl p-3 sm:p-4 hover:bg-white/80 hover:shadow-md transition-all duration-300"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20, scale: 0.95 }}
                        transition={{ delay: index * 0.1, duration: 0.4 }}
                        whileHover={{ scale: 1.01, x: 4 }}
                      >
                        <div className="flex items-center gap-3 sm:gap-4">
                          <motion.button
                            className="relative"
                            whileHover={{ scale: 1.1 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            onClick={() => handleUserClick(user.id)}
                          >
                    <Image
                      src={user.profile_image_url || "/icons/avatar.png"}
                      alt={user.name}
                              width={40}
                              height={40}
                              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-emerald-200/50 shadow-sm"
                            />
                            <motion.div
                              className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full border-2 border-white"
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                          </motion.button>
                          <motion.button
                            className="text-left"
                            onClick={() => handleUserClick(user.id)}
                            whileHover={{ x: 2 }}
                            transition={{ duration: 0.2 }}
                          >
                            <h3 className="font-semibold text-gray-900 text-base sm:text-lg hover:text-emerald-700 transition-colors duration-300">{user.name}</h3>
                            <p className="text-gray-500 text-xs sm:text-sm">{user.email}</p>
                          </motion.button>
                    </div>
                        
                        <motion.button
                    onClick={() => handleAccept(user.id)}
                    disabled={accepting === user.id}
                          className={`inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm transition-all duration-300 shadow-md hover:shadow-lg ${
                            accepting === user.id
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-gradient-to-r from-emerald-500 to-blue-600 text-white hover:from-emerald-600 hover:to-blue-700'
                          }`}
                          whileHover={accepting === user.id ? {} : { scale: 1.05, y: -2 }}
                          whileTap={accepting === user.id ? {} : { scale: 0.95 }}
                  >
                          {accepting === user.id ? (
                            <>
                              <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                              <span className="hidden xs:inline">Accepting...</span>
                              <span className="xs:inline">Accepting</span>
                            </>
                          ) : (
                            <>
                              <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span className="hidden xs:inline">Accept</span>
                              <span className="xs:inline">Accept</span>
                            </>
                          )}
                        </motion.button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Footer */}
        <motion.footer
          className="relative z-10 text-center text-gray-500 text-sm py-4 sm:py-6 mt-6 sm:mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          © 2025 IKnow. Connecting campus communities.
        </motion.footer>
        </div>
      </ProtectedRoute>
  );
};

export default ConnectionsPage;
