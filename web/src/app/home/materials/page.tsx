"use client";
import React from 'react';
import dynamic from 'next/dynamic';
const ProtectedRoute = dynamic(() => import('../../ProtectedRoute'), { ssr: false });
import HomeNavBar from '@/components/home/HomeNavBar';

const MaterialsPage = () => (
  <ProtectedRoute>
    <div style={{ minHeight: '100vh', background: '#f7f7fb' }}>
      <HomeNavBar />
      <div style={{ maxWidth: 1100, margin: '2.5rem auto 0 auto', padding: '0 1.5rem' }}>
        <h2 style={{ fontFamily: 'Poppins, sans-serif', color: '#4320d1', fontWeight: 700, fontSize: '2rem', marginBottom: 18 }}>
          Materials
        </h2>
        <p style={{ color: '#222', fontSize: '1.13rem', marginBottom: 32, fontFamily: 'Poppins, sans-serif' }}>
          Access study materials, notes, and guides for your courses.
        </p>
        {/* Materials content goes here */}
      </div>
    </div>
  </ProtectedRoute>
);

export default MaterialsPage;
