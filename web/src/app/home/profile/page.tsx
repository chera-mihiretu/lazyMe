"use client";

import React, { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Mail, 
  GraduationCap, 
  Building, 
  Users, 
  Calendar,
  Edit3,
  Award,
  BookOpen,
  
  FileText,
  Sparkles,
  ArrowLeft
} from "lucide-react";
import ProtectedRoute from "@/app/ProtectedRoute";
import PostCard from "@/components/home/PostCard";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useOtherUserPosts, useUserPosts } from "@/hooks/useUserPosts";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { getUserID } from "@/utils/auth";

// Profile Loading Component - moved outside for Suspense fallback
const ProfileLoadingComponent = () => (
  <motion.div
    className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-white/20 p-8 sm:p-12 text-center"
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
  >
    <motion.div
      className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-200 to-blue-200 rounded-full mx-auto mb-4 sm:mb-6 flex items-center justify-center"
      animate={{ rotate: [0, 5, -5, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      <User className="w-8 h-8 sm:w-10 sm:h-10 text-purple-600" />
    </motion.div>
    <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">Loading Profile</h3>
    <p className="text-gray-600 text-sm sm:text-base">Please wait while we load the user profile...</p>
  </motion.div>
);

const ProfilePageContent: React.FC = () => {
  const searchParams = useSearchParams();
  const profileId = searchParams.get('id');
  const currentUserId = getUserID();
  const isOwnProfile = !profileId || profileId === currentUserId;

  const [page, setPage] = useState(1);
  setPage(1)
  const { user: currentUser } = useUserProfile();
  const { posts: ownPosts, loading: ownPostsLoading, error: ownPostsError } = useUserPosts(page);
  const { posts: otherPosts, loading: otherPostsLoading, error: otherPostsError } = useOtherUserPosts(page, profileId || '');
  
  // Determine which posts data to use
  const posts = isOwnProfile ? ownPosts : otherPosts;
  const postsLoading = isOwnProfile ? ownPostsLoading : otherPostsLoading;
  const postsError = isOwnProfile ? ownPostsError : otherPostsError;
  
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [user, setUser] = useState(currentUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  
  // Fix hydration by ensuring client-side rendering for random elements
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load user data based on profileId parameter
  useEffect(() => {
    const loadUserData = async () => {
      if (isOwnProfile) {
        // Use current user data
        setUser(currentUser);
        setError(null);
      } else if (profileId) {
        // Load specific user data
        setLoading(true);
        setError(null);
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/${profileId}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: token ? `Bearer ${token}` : "",
            },
          });
          if (!response.ok) {
            throw new Error('Failed to load user profile');
          }
          const data = await response.json();
          setUser(data.user);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to load user profile');
        } finally {
          setLoading(false);
        }
      }
    };

    loadUserData();
  }, [profileId, currentUser, isOwnProfile, token]);

  // Deterministic particle positions to prevent hydration mismatch
  const particlePositions = [
    { left: 15, top: 25 },
    { left: 35, top: 75 },
    { left: 55, top: 15 },
    { left: 75, top: 85 },
    { left: 25, top: 45 },
    { left: 85, top: 35 },
    { left: 45, top: 65 },
    { left: 65, top: 5 },
    { left: 5, top: 55 },
    { left: 95, top: 95 },
    { left: 40, top: 30 },
    { left: 80, top: 70 },
    { left: 20, top: 90 },
    { left: 90, top: 20 },
    { left: 60, top: 50 }
  ];

  // Loading Component
  const LoadingComponent = () => (
    <motion.div
      className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 sm:p-8"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-center space-x-3">
        <motion.div
          className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
          animate={{ scale: [1, 1.3, 1], rotate: [0, -180, -360] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
        />
        <motion.div
          className="w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
          animate={{ scale: [1, 1.4, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
        />
      </div>
      <motion.p
        className="text-center text-gray-600 mt-4 text-sm sm:text-base"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        Loading posts...
      </motion.p>
    </motion.div>
  );

  // Error Component
  const ErrorComponent = () => (
    <motion.div
      className="bg-red-50/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-red-200/50 p-8 sm:p-12 text-center"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-red-200 to-pink-200 rounded-full mx-auto mb-4 sm:mb-6 flex items-center justify-center"
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <User className="w-8 h-8 sm:w-10 sm:h-10 text-red-600" />
      </motion.div>
      <h3 className="text-lg sm:text-xl font-bold text-red-800 mb-2 sm:mb-3">Profile Not Found</h3>
      <p className="text-red-600 text-sm sm:text-base">{error || 'Failed to load user profile'}</p>
    </motion.div>
  );

  // Empty State Component
  const EmptyStateComponent = () => (
    <motion.div
      className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8 sm:p-12 text-center"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-200 to-blue-200 rounded-full mx-auto mb-4 sm:mb-6 flex items-center justify-center"
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-purple-600" />
      </motion.div>
      <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">No Posts Yet</h3>
      <p className="text-gray-600 text-sm sm:text-base">
        {isOwnProfile ? "You haven't posted anything yet. Start sharing your thoughts!" : "This user hasn't posted anything yet."}
      </p>
    </motion.div>
  );

  // Show loading state while fetching profile data
  if (loading) {
    return (
      <ProtectedRoute role="student">
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
          <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
            <ProfileLoadingComponent />
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  // Show error state if profile loading failed
  if (error) {
    return (
      <ProtectedRoute role="student">
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
          <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
            <ErrorComponent />
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  // Show loading state if user data is not available yet
  if (!user) {
    return (
      <ProtectedRoute role="student">
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
          <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
            <ProfileLoadingComponent />
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute role="student">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-100/20 via-blue-50/10 to-transparent"></div>
          
          {/* Floating Orbs - Responsive sizes */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-purple-200/20 rounded-full blur-3xl"
            animate={{
              x: [0, 60, 0],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-56 h-56 sm:w-64 sm:h-64 lg:w-80 lg:h-80 bg-blue-200/20 rounded-full blur-3xl"
            animate={{
              x: [0, -50, 0],
              y: [0, 40, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,.02)_1px,transparent_1px)] bg-[size:50px_50px] sm:bg-[size:80px_80px] lg:bg-[size:100px_100px]"></div>
        </div>

        {/* Header */}
        <motion.div
          className="relative z-10 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-lg"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 sm:gap-4">
                <motion.button
                  onClick={() => router.back()}
                  className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.button>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                    {isOwnProfile ? 'My Profile' : `${user.name}'s Profile`}
                  </h1>
                  <p className="text-gray-600 text-xs sm:text-sm mt-1">
                    {isOwnProfile ? 'View and manage your profile information' : 'View user profile information'}
                  </p>
                </div>
              </div>
              <motion.div
                className="inline-flex items-center px-3 py-1.5 rounded-full bg-purple-100 border border-purple-200 text-purple-700 text-xs sm:text-sm font-medium"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <User className="w-3 h-3 sm:w-4 sm:w-4 mr-1.5 sm:mr-2" />
                Profile
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
          {/* Profile Header Card */}
          <motion.div
            className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-white/20 overflow-hidden mb-6 sm:mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {/* Hero Banner - Responsive height */}
            <div className="relative h-32 sm:h-40 lg:h-48 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-purple-500/80 via-blue-500/80 to-indigo-500/80"
                animate={{
                  background: [
                    "linear-gradient(45deg, rgba(147, 51, 234, 0.8), rgba(59, 130, 246, 0.8), rgba(99, 102, 241, 0.8))",
                    "linear-gradient(45deg, rgba(99, 102, 241, 0.8), rgba(147, 51, 234, 0.8), rgba(59, 130, 246, 0.8))",
                    "linear-gradient(45deg, rgba(59, 130, 246, 0.8), rgba(99, 102, 241, 0.8), rgba(147, 51, 234, 0.8))"
                  ]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              />
              {/* Fixed particle positions to prevent hydration mismatch */}
              {isClient && (
                <div className="absolute inset-0">
                  {particlePositions.map((pos, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 sm:w-2 sm:h-2 bg-white/20 rounded-full"
                      style={{
                        left: `${pos.left}%`,
                        top: `${pos.top}%`,
                      }}
                      animate={{
                        y: [0, -15, 0],
                        opacity: [0.2, 0.8, 0.2],
                      }}
                      transition={{
                        duration: 3 + (i % 3),
                        repeat: Infinity,
                        delay: (i % 5) * 0.4,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Profile Content */}
            <div className="relative px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8">
              {/* Avatar - Responsive positioning and sizing */}
              <motion.div
                className="absolute -top-10 sm:-top-12 lg:-top-16 left-4 sm:left-6 lg:left-8"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.6, duration: 0.6, type: "spring", stiffness: 200 }}
              >
                <div className="relative">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 rounded-xl sm:rounded-2xl border-3 sm:border-4 border-white shadow-2xl overflow-hidden bg-white p-0.5 sm:p-1">
                    <Image 
                      src={user?.profile_image_url || "/icons/avatar.png"} 
                      alt={user?.name || "User"} 
                      width={120} 
                      height={120} 
                      className="w-full h-full rounded-lg sm:rounded-xl object-cover" 
                    />
                  </div>
                  {user?.blue_badge && (
                    <motion.div
                      className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.9, duration: 0.3 }}
                    >
                      <Award className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {/* User Info - Responsive spacing and layout */}
              <div className="pt-12 sm:pt-14 lg:pt-20">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 sm:mb-6 gap-4">
                  <div className="flex-1">
                    <motion.h1
                      className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7, duration: 0.5 }}
                    >
                      {user?.name || 'Loading...'}
                    </motion.h1>
                    <motion.div
                      className="flex items-center gap-2 text-gray-600 mb-3 sm:mb-4"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8, duration: 0.5 }}
                    >
                      <Mail className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span className="text-sm sm:text-base truncate">{user?.email || 'Loading...'}</span>
                    </motion.div>
                  </div>
                  
                  {/* Edit Button - Only show for own profile */}
                  {isOwnProfile && (
                    <motion.button
                      className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.9, duration: 0.5 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Edit3 className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden xs:inline">Edit Profile</span>
                      <span className="xs:hidden">Edit</span>
                    </motion.button>
                  )}
                </div>

                {/* Info Tags - Responsive layout */}
                <motion.div
                  className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0, duration: 0.5 }}
                >
                  {user?.school && (
                    <motion.span
                      className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-purple-100 text-purple-700 rounded-full text-xs sm:text-sm font-medium"
                      whileHover={{ scale: 1.05 }}
                    >
                      <Building className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span className="truncate max-w-[120px] sm:max-w-none">{user.school}</span>
                    </motion.span>
                  )}
                  {user?.department && (
                    <motion.span
                      className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm font-medium"
                      whileHover={{ scale: 1.05 }}
                    >
                      <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span className="truncate max-w-[120px] sm:max-w-none">{user.department}</span>
                    </motion.span>
                  )}
                  {user?.acedemic_year !== undefined && user?.acedemic_year > 0 && (
                    <motion.span
                      className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-indigo-100 text-indigo-700 rounded-full text-xs sm:text-sm font-medium"
                      whileHover={{ scale: 1.05 }}
                    >
                      <GraduationCap className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      Year {user.acedemic_year}
                    </motion.span>
                  )}
                </motion.div>

                {/* Stats Cards - Responsive grid */}
                <motion.div
                  className="grid grid-cols-3 gap-2 sm:gap-3 lg:gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1, duration: 0.5 }}
                >
                  <motion.div
                    className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg sm:rounded-xl p-3 sm:p-4 text-center border border-purple-200/50"
                    whileHover={{ scale: 1.02, y: -2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-500 rounded-md sm:rounded-lg mx-auto mb-1 sm:mb-2 flex items-center justify-center">
                      {user?.is_teacher ? (
                        <GraduationCap className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      ) : (
                        <User className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-purple-600 font-medium">
                      {user?.is_teacher ? 'Teacher' : 'Student'}
                    </p>
                  </motion.div>

                  <motion.div
                    className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg sm:rounded-xl p-3 sm:p-4 text-center border border-blue-200/50"
                    whileHover={{ scale: 1.02, y: -2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded-md sm:rounded-lg mx-auto mb-1 sm:mb-2 flex items-center justify-center">
                      <Users className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                    <p className="text-sm sm:text-lg font-bold text-blue-700">{user?.follow_count ?? 0}</p>
                    <p className="text-xs sm:text-sm text-blue-600 font-medium">Followers</p>
                  </motion.div>

                  <motion.div
                    className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg sm:rounded-xl p-3 sm:p-4 text-center border border-indigo-200/50"
                    whileHover={{ scale: 1.02, y: -2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-indigo-500 rounded-md sm:rounded-lg mx-auto mb-1 sm:mb-2 flex items-center justify-center">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                    <p className="text-sm sm:text-lg font-bold text-indigo-700">{user?.acedemic_year ?? '-'}</p>
                    <p className="text-xs sm:text-sm text-indigo-600 font-medium">Academic Year</p>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Posts Section - Only show for own profile or if posts are available */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            {/* Posts Header - Responsive layout */}
            <motion.div
              className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.3, duration: 0.5 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 p-2 sm:p-2.5 shadow-lg">
                  <FileText className="w-full h-full text-white" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    {isOwnProfile ? 'My Posts' : `${user.name}'s Posts`}
                  </h2>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    {isOwnProfile ? 'Your recent posts and activities' : 'Recent posts and activities'}
                  </p>
                </div>
              </div>
              <motion.div
                className="inline-flex items-center px-3 py-1.5 rounded-full bg-purple-100 border border-purple-200 text-purple-700 text-xs sm:text-sm font-medium ml-auto"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.4, duration: 0.6 }}
              >
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                {posts.length} Posts
              </motion.div>
            </motion.div>

            {/* Posts Content - Responsive grid */}
            <AnimatePresence mode="wait">
              {postsLoading ? (
                <LoadingComponent />
              ) : postsError ? (
                <motion.div
                  className="bg-red-50/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-red-200/50 p-6 sm:p-8 text-center"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <p className="text-red-700 font-semibold text-base sm:text-lg mb-2">Error Loading Posts</p>
                  <p className="text-red-600 text-sm sm:text-base">{postsError}</p>
                </motion.div>
              ) : posts.length === 0 ? (
                <EmptyStateComponent />
              ) : (
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  {posts.map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                    >
                      <PostCard post={post} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Footer - Responsive spacing */}
        <motion.footer
          className="relative z-10 text-center text-gray-500 text-xs sm:text-sm py-4 sm:py-6 mt-6 sm:mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.7, duration: 0.6 }}
        >
          © 2025 IKnow. Empowering students with knowledge.
        </motion.footer>
      </div>
    </ProtectedRoute>
  );
};

const ProfilePage: React.FC = () => {
  return (
    <Suspense fallback={<ProfileLoadingComponent />}>
      <ProfilePageContent />
    </Suspense>
  );
};

export default ProfilePage;
