import React from "react";

const SplashScreen: React.FC = () => (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: '#fff',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  }}>
    <img src="/logo.svg" alt="Logo" style={{ width: 90, height: 90, marginBottom: 28 }} />
    <div style={{ fontWeight: 700, fontSize: 24, color: '#4320d1', marginBottom: 18 }}>iKnow</div>
    <div style={{ color: '#6366f1', fontWeight: 500, fontSize: 18, marginBottom: 10 }}>Loading...</div>
    <div style={{ width: 38, height: 38, border: '4px solid #e0e7ff', borderTop: '4px solid #6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
  </div>
);

export default SplashScreen;
