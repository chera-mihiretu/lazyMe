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
    <nav style={{
      width: '100%',
      background: '#fff',
      boxShadow: '0 2px 12px rgba(67,32,209,0.06)',
      padding: '0.7rem 2.2vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      minHeight: 64,
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <Link href="/home" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <Image src="/logos/logo-real.png" alt="IKnow Logo" width={50} height={50} style={{ marginRight: 8 }} />
          <span style={{ color: COLORS.primary, fontWeight: 700, fontFamily: FONT_FAMILY.poppins, fontSize: '1.25rem', letterSpacing: 0.5 }}>IKnow</span>
        </Link>
      </div>
      {/* Nav Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
        {navLinks.map((link, idx) => {
          const isActive = pathname === link.href || (link.href === '/home/posts' && pathname === '/home');
          return (
            <Link key={link.href || idx} href={link.href} style={{
              color: isActive ? COLORS.primary : COLORS.foreground,
              background: isActive ? COLORS.primary + '07' : 'transparent',
              fontFamily: FONT_FAMILY.poppins,
              fontWeight: 600,
              fontSize: '1.07rem',
              textDecoration: 'none',
              padding: '0.35rem 1.1rem',
              borderRadius: 8,
              transition: 'background 0.18s, color 0.18s',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              borderBottom: isActive ? `3px solid ${COLORS.primary}` : '3px solid transparent',
              boxShadow: 'none',
            }}>
              <Image src={link.icon} alt={link.label + ' icon'} width={22} height={22} style={{ marginRight: 4, filter: isActive ? 'none' : 'none' }} />
              {link.label}
            </Link>
          );
        })}
      </div>
      {/* Search, Notification, and Avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
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
