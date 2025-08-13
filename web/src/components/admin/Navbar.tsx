import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import UserAvatar from "@/components/home/UserAvatar";
import Image from "next/image";
import { Shield, Settings, User as UserIcon, LogOut } from 'lucide-react';
import { User } from "@/types/post";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const Navbar: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    fetch(`${baseUrl}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(() => setUser(null));
  }, []);

  const handleProfileClick = () => {
    if (user && user.id && typeof window !== 'undefined') {
      window.location.href = `/home/profile`;
    }
    setShowAvatarMenu(false);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/auth/login';
    setShowAvatarMenu(false);
  };

  return (
    <motion.nav
      className="w-full h-16 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-lg sticky top-0 z-50"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        {/* Logo on the left */}
        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <Link href="/admin/dashboard" className="flex items-center text-decoration-none">
            <motion.div
              className="relative"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg mr-3">
                <Image 
                  src="/icons/logo-iknow.png" 
                  alt="IKnow Logo" 
                  width={24} 
                  height={24} 
                  className="rounded-md"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl blur-lg transform rotate-3 scale-110 -z-10"></div>
            </motion.div>
            
            <motion.div
              className="flex items-center"
              whileHover={{ x: 2 }}
              transition={{ duration: 0.3 }}
            >
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                IKnow
              </span>
              <motion.div
                className="ml-2 px-2 py-1 bg-purple-100 border border-purple-200 rounded-md"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.4 }}
              >
                <Shield className="w-3 h-3 text-purple-600" />
              </motion.div>
            </motion.div>
          </Link>
        </motion.div>

        {/* Admin Badge and User Avatar on the right */}
        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {/* Admin Badge */}
          <motion.div
            className="hidden sm:flex items-center px-3 py-1.5 bg-gradient-to-r from-purple-100 to-blue-100 border border-gray-200 rounded-full"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <Settings className="w-4 h-4 text-purple-600 mr-2" />
            <span className="text-sm font-medium text-gray-800">Admin Panel</span>
          </motion.div>

          {/* User Avatar with Dropdown */}
          <div className="relative">
            <motion.button
              onClick={() => setShowAvatarMenu(!showAvatarMenu)}
              className="p-1 bg-gradient-to-r from-purple-100 to-blue-100 border border-gray-200 rounded-full hover:from-purple-200 hover:to-blue-200 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
          >
              <UserAvatar />
            </motion.button>

            {/* Avatar Dropdown */}
            <AnimatePresence>
              {showAvatarMenu && (
                <motion.div
                  className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-gray-200 shadow-2xl z-50"
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="p-2">
                    <motion.button
                      className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-xl transition-all duration-300"
                      onClick={handleProfileClick}
                      whileHover={{ x: 4 }}
                    >
                      <UserIcon className="w-4 h-4" />
                      <span>Profile</span>
                    </motion.button>
                    <hr className="my-2 border-gray-100" />
                    <motion.button
                      className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300"
                      onClick={handleLogout}
                      whileHover={{ x: 4 }}
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </motion.button>
            </div>
          </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Click outside to close avatar menu */}
      {showAvatarMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowAvatarMenu(false)}
        />
      )}
    </motion.nav>
  );
};

export default Navbar;
