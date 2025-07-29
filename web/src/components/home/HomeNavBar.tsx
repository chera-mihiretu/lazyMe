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

  return (
    <nav className="w-full bg-white shadow-md px-[2.2vw] py-3 flex items-center justify-between sticky top-0 z-[100] min-h-[64px]">
      {/* Logo */}
      <div className="flex items-center gap-3.5">
        <Link href="/home" className="flex items-center no-underline">
          <Image src="/logos/logo-real.png" alt="IKnow Logo" width={50} height={50} className="mr-2" />
          <span className="text-primary font-bold font-poppins text-xl tracking-wide">IKnow</span>
        </Link>
      </div>
      {/* Nav Links */}
      <div className="flex items-center gap-7">
        {navLinks.map((link, idx) => {
          const isActive = pathname === link.href || (link.href === '/home/posts' && pathname === '/home');
          return (
            <Link
              key={link.href || idx}
              href={link.href}
              className={`flex items-center gap-2 font-poppins font-semibold text-[1.07rem] px-4 py-1 rounded-lg no-underline border-b-4 transition-colors ${isActive ? 'text-primary bg-primary/5 border-primary' : 'text-foreground bg-transparent border-transparent'}`}
            >
              <Image src={link.icon} alt={link.label + ' icon'} width={22} height={22} className="mr-1" />
              {link.label}
            </Link>
          );
        })}
      </div>
      {/* Search, Notification, and Avatar */}
      <div className="flex items-center gap-4.5 relative">
        <SearchBar value={''} onChange={function (e: React.ChangeEvent<HTMLInputElement>): void {
          throw new Error('Function not implemented.' + e);
        } } />
        <NotificationBell />
        {/* Avatar with dropdown menu */}
        <div className="relative">
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
    </nav>
  );
};

export default HomeNavBar;
