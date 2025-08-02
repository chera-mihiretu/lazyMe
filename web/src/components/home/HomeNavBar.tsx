'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import SearchBar from './SearchBar';
import UserAvatar from './UserAvatar';
import { useEffect, useState } from 'react';
import NotificationBell from './NotificationBell';
import { User } from '@/types/post';

const navLinks = [
  { label: 'Posts', href: '/home/posts', icon: '/home/announcement.png' },
  { label: 'Opportunities', href: '/home/opportunities', icon: '/home/creative.png' },
  { label: 'Materials', href: '/home/materials', icon: '/home/stack-of-books.png' },
  { label: 'Exams', href: '/home/exams', icon: '/home/exam.png' },
  { label: 'Connectiton', href: '/home/connections', icon: '/home/connection.png' },
];

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const HomeNavBar: React.FC = () => {
  const pathname = usePathname();
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
  // Avatar menu handlers
  const handleProfile = () => {
    if (user && user.id && typeof window !== 'undefined') {
      window.location.href = `/profile`;
    }
    setShowAvatarMenu(false);
  };
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

  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    
    <nav className="w-full bg-white shadow-mx px-[2.2vw] py-3 flex items-center justify-between sticky top-0 z-[100] min-h-[64px]">
      {/* Mobile Menu Button (left) */}
      <div className="lg:hidden flex items-center gap-3">
        <button
          className="p-2 rounded-lg bg-primary/10 text-primary focus:outline-none"
          onClick={() => setShowMobileMenu((v) => !v)}
          aria-label="Open menu"
        >
          <Image src="/icons/nav-menu.png" alt="Menu" width={18} height={18} />
        </button>
      </div>
      {/* Main nav bar order: Logo, Tabs, Notification, Search, Avatar */}
      <div className="flex w-full items-center relative">
        {/* Logo */}
        <div className="flex items-center flex-shrink-0 mr-2">
          <Link href="/home/posts" className="flex items-center no-underline">
            <Image src="/logos/logo-real.png" alt="IKnow Logo" width={50} height={50} />
            <span className="text-primary font-bold font-poppins text-xl tracking-wide ml-2">IKnow</span>
          </Link>
        </div>
        {/* Tabs - Centered on desktop only */}
        <div className="hidden lg:flex flex-1 justify-center items-center gap-7 mx-2">
          {navLinks.map((link, idx) => {
            const isActive = pathname === link.href || (link.href === '/home/posts' && pathname === '/home');
            return (
              <Link
                key={link.href || idx}
                href={link.href}
                className={`flex items-center gap-2 font-poppins text-[1.07rem] px-4 py-1 rounded-none no-underline transition-colors border-b-2 ${isActive ? 'text-primary bg-primary/5 border-primary' : 'text-foreground bg-transparent border-transparent hover:bg-primary/10'} font-medium`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
        {/* Right section: Notification, Search, Avatar */}
        <div className="flex items-center ml-auto gap-2">
          <div className="flex items-center flex-shrink-0 mx-2">
            <NotificationBell />
          </div>
          <div className="hidden xl:flex items-center gap-4.5 relative mx-2">
            <SearchBar value={''} onChange={function (e: React.ChangeEvent<HTMLInputElement>): void {
              throw new Error('Function not implemented.' + e);
            } } />
          </div>
          <div className="flex items-center flex-shrink-0 ml-2 relative">
            <button
              className="focus:outline-none"
              onClick={() => setShowAvatarMenu((v) => !v)}
            >
              <UserAvatar />
            </button>
            {showAvatarMenu && (
              <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                <button className="w-full text-left px-4 py-2 hover:bg-gray-100" onClick={handleProfile}>Profile</button>
                <button className="w-full text-left px-4 py-2 hover:bg-gray-100" onClick={handleProfileUpdate}>Profile Update</button>
                <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600" onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Mobile Menu Drawer (left side) - Simple Underline, No Shadow */}
      {showMobileMenu && (
        <div className="fixed inset-0 bg-black/40 z-[200] flex justify-start">
          <div className="w-[80vw] max-w-[340px] bg-white h-full shadow-xl p-6 flex flex-col gap-6">
            <button
              className="self-end mb-2 p-2 rounded-lg bg-primary/10 text-primary"
              onClick={() => setShowMobileMenu(false)}
              aria-label="Close menu"
            >
              <Image src="/icons/nav-menu-close.png" alt="Close" width={18} height={18} />
            </button>
            <SearchBar value={''} onChange={function (e: React.ChangeEvent<HTMLInputElement>): void {
              throw new Error('Function not implemented.' + e);
            } } />
            <div className="flex flex-col gap-3 mt-2">
              {navLinks.map((link, idx) => {
                const isActive = pathname === link.href || (link.href === '/home/posts' && pathname === '/home');
                return (
                  <Link
                    key={link.href || idx}
                    href={link.href}
                    className={`flex items-center gap-2 font-poppins font-semibold text-[1.07rem] px-4 py-2 rounded-none no-underline transition-colors border-b-2 ${isActive ? 'text-primary bg-primary/5 border-primary' : 'text-foreground bg-transparent border-transparent hover:bg-primary/10'} font-medium`}
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <Image src={link.icon} alt={link.label + ' icon'} width={22} height={22} className="mr-1" />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default HomeNavBar;
