"use client";
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
const ProtectedRoute = dynamic(() => import('../ProtectedRoute'), { ssr: false });
import HomeNavBar from '@/components/home/HomeNavBar';

const HomePage = () => {
  const router = useRouter();
  useEffect(() => {
    router.replace("/home/posts");
  }, [router]);

  return (
    <ProtectedRoute>
      <div style={{ minHeight: '100vh', background: '#f7f7fb' }}>
        <HomeNavBar />
        {/* Main content area placeholder */}
        <div style={{ maxWidth: 1100, margin: '2.5rem auto 0 auto', padding: '0 1.5rem' }}>
          <h2 style={{ fontFamily: 'Poppins, sans-serif', color: '#4320d1', fontWeight: 700, fontSize: '2rem', marginBottom: 18 }}>
            Welcome to IKnow Home
          </h2>
          <p style={{ color: '#222', fontSize: '1.13rem', marginBottom: 32, fontFamily: 'Poppins, sans-serif' }}>
            Explore posts, opportunities, study materials, and exams all in one place. Use the navigation bar above to get started.
          </p>
          {/* You can add more dashboard widgets or sections here in the next steps */}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default HomePage;
