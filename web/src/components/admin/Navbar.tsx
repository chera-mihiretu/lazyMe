import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import UserAvatar from "@/components/home/UserAvatar";
import Image from "next/image";
import { Shield, Settings } from 'lucide-react';

const Navbar: React.FC = () => {
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

          {/* User Avatar */}
          <motion.div
            className="relative"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-1 bg-gradient-to-r from-purple-100 to-blue-100 border border-gray-200 rounded-full">
              <UserAvatar />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
