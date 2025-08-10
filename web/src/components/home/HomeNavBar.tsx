'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { 
  Menu, 
  X, 
  MessageSquare, 
  Briefcase, 
  BookOpen, 
  FileText, 
  Users,
  
  
  User as UserIcon,
  Settings,
  LogOut
} from 'lucide-react';
import SearchBar from './SearchBar';
import UserAvatar from './UserAvatar';
import NotificationBell from './NotificationBell';
import { User } from '@/types/post';

const navLinks = [
  { label: 'Posts', href: '/home/posts', icon: MessageSquare },
  { label: 'Opportunities', href: '/home/opportunities', icon: Briefcase },
  { label: 'Materials', href: '/home/materials', icon: BookOpen },
  { label: 'Exams', href: '/home/exams', icon: FileText },
  { label: 'Connection', href: '/home/connections', icon: Users },
];

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const HomeNavBar: React.FC = () => {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

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
 
  const handleProfileUpdate = () => {
    if (user && user.id && typeof window !== 'undefined') {
      window.location.href = `/profile/edit`;
    }
    setShowAvatarMenu(false);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/auth/login';
    setShowAvatarMenu(false);
  };

  return (
    <>
      <motion.nav 
        className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-lg"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Mobile Menu Button */}
            <motion.button
              className="lg:hidden p-2 rounded-xl bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors duration-300"
              onClick={() => setShowMobileMenu(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Menu className="w-5 h-5" />
            </motion.button>

            {/* Logo */}
            <motion.div
              className="flex items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Link href="/home/posts" className="flex items-center group">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg blur-lg group-hover:blur-xl transition-all duration-300"></div>
                  <Image 
                    src="/logos/logo-real.png" 
                    alt="IKnow Logo" 
                    width={40} 
                    height={40}
                    className="relative rounded-lg"
                  />
                </div>
                <span className="ml-3 text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  IKnow
                </span>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <motion.div
              className="hidden lg:flex items-center space-x-1"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              {navLinks.map((link, index) => {
                const Icon = link.icon;
                const isActive = pathname === link.href || (link.href === '/home/posts' && pathname === '/home');
                
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
                  >
                    <Link
                      href={link.href}
                      className={`relative flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                        isActive 
                          ? 'text-purple-600 bg-purple-100' 
                          : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{link.label}</span>
                      {isActive && (
                        <motion.div
                          className="absolute bottom-0 left-1/2 w-1 h-1 bg-purple-600 rounded-full"
                          layoutId="activeTab"
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Right Section */}
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              {/* Search Bar - Desktop Only */}
              <div className="hidden xl:block">
                <SearchBar value={''} onChange={() => {}} />
              </div>

              {/* Notification Bell */}
              <NotificationBell />

              {/* User Avatar */}
              <div className="relative">
                <motion.button
                  onClick={() => setShowAvatarMenu(!showAvatarMenu)}
                  className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-gray-200 hover:border-purple-300 transition-all duration-300"
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
                          onClick={() => { window.location.href = '/home/profile'; }}
                          whileHover={{ x: 4 }}
                        >
                          <UserIcon className="w-4 h-4" />
                          <span>Profile</span>
                        </motion.button>
                        <motion.button
                          className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-xl transition-all duration-300"
                          onClick={handleProfileUpdate}
                          whileHover={{ x: 4 }}
                        >
                          <Settings className="w-4 h-4" />
                          <span>Settings</span>
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
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            className="fixed inset-0 z-50 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowMobileMenu(false)} />
            <motion.div
              className="absolute left-0 top-0 h-full w-80 bg-white shadow-2xl"
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div className="p-6">
                {/* Mobile Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center">
                    <Image src="/logos/logo-real.png" alt="IKnow Logo" width={32} height={32} className="rounded-lg" />
                    <span className="ml-2 text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      IKnow
                    </span>
                  </div>
                  <motion.button
                    onClick={() => setShowMobileMenu(false)}
                    className="p-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>

                {/* Mobile Search */}
                <div className="mb-6">
                  <SearchBar value={''} onChange={() => {}} />
                </div>

                {/* Mobile Navigation */}
                <div className="space-y-2">
                  {navLinks.map((link, index) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href || (link.href === '/home/posts' && pathname === '/home');
                    
                    return (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.6 }}
                      >
                        <Link
                          href={link.href}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                            isActive 
                              ? 'text-purple-600 bg-purple-100' 
                              : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
                          }`}
                          onClick={() => setShowMobileMenu(false)}
                        >
                          <Icon className="w-5 h-5" />
                          <span>{link.label}</span>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close avatar menu */}
      {showAvatarMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowAvatarMenu(false)}
        />
      )}
    </>
  );
};

export default HomeNavBar;
