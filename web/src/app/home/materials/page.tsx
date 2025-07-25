"use client";
import React from 'react';
import dynamic from 'next/dynamic';
const ProtectedRoute = dynamic(() => import('../../ProtectedRoute'), { ssr: false });
import HomeNavBar from '@/components/home/HomeNavBar';

function MaterialsPage() {
  return (
    <ProtectedRoute role="student">
      <div style={{ minHeight: '100vh', background: '#f7f7fb' }}>
        <HomeNavBar />
        <div style={{ maxWidth: 1100, margin: '2.5rem auto 0 auto', padding: '0 1.5rem' }}>
          <h2 style={{ fontFamily: 'Poppins, sans-serif', color: '#4320d1', fontWeight: 700, fontSize: '2rem', marginBottom: 18 }}>
            Materials
          </h2>
          <p style={{ color: '#222', fontSize: '1.13rem', marginBottom: 32, fontFamily: 'Poppins, sans-serif' }}>
            Access study materials, notes, and guides for your courses.
          </p>
          <MaterialsTree />
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <button
              style={{
                background: 'linear-gradient(90deg, #7c3aed 60%, #6366f1 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: 10,
                padding: '12px 32px',
                fontWeight: 700,
                fontSize: 18,
                cursor: 'pointer',
                boxShadow: '0 2px 8px #7c3aed22',
                transition: 'background 0.2s, box-shadow 0.2s',
                letterSpacing: 0.5,
              }}
              onClick={() => alert('Suggest Material feature coming soon!')}
            >
              + Suggest Material
            </button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

// --- MaterialsTree Implementation ---
const MaterialsTree = dynamic(() => import("./MaterialsTree"), { ssr: false });
export default MaterialsPage;
