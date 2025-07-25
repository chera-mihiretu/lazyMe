'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { COLORS, FONT_FAMILY } from '../../utils/color';
import Image from 'next/image';
import SearchBar from './SearchBar';
import UserAvatar from './UserAvatar';
import { useEffect, useState } from 'react';
import NotificationBell from './NotificationBell';

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
  const [user, setUser] = useState<any>(null);

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
      <div className="flex items-center gap-4.5">
        <SearchBar value={''} onChange={function (e: React.ChangeEvent<HTMLInputElement>): void {
          throw new Error('Function not implemented.');
        } } />
        <NotificationBell />
        <UserAvatar />
      </div>
    </nav>
  );
};

export default HomeNavBar;
