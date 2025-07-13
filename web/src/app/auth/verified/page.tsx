
'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const VerifiedPage: React.FC = () => {
  const router = useRouter();
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/auth/login');
    }, 3500);
    return () => clearTimeout(timer);
  }, [router]);
  return (
    <div style={{
      maxWidth: 480,
      margin: '80px auto',
      background: '#fff',
      borderRadius: 18,
      boxShadow: '0 4px 32px rgba(67,24,209,0.07)',
      padding: '2.5rem 2.2rem 2.2rem 2.2rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
    }}>
      <h2 style={{ color: '#4320d1', fontWeight: 700, marginBottom: 18 }}>Account Verified!</h2>
      <p style={{ fontSize: '1.08rem', color: '#222', marginBottom: 18 }}>
        Your email has been successfully verified.<br />
        You will be redirected to the login page shortly.
      </p>
      <div style={{ fontSize: '0.98rem', color: '#888' }}>
        If you are not redirected, <a href="/auth/login" style={{ color: '#4320d1', textDecoration: 'underline' }}>click here to log in</a>.
      </div>
    </div>
  );
};

export default VerifiedPage;
