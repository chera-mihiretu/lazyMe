"use client";
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
const ProtectedRoute = dynamic(() => import('../ProtectedRoute'), { ssr: false });

const HomePage = () => {
  return (
    <ProtectedRoute role='student'>
      <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f7f7fb' }}>
        <p style={{ fontFamily: 'Poppins, sans-serif', color: '#4320d1', fontWeight: 500, fontSize: '1.5rem' }}>
          Redirecting, please wait...
        </p>
      </div>
    </ProtectedRoute>
  );
};

export default HomePage;
