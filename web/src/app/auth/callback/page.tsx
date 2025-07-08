'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const CallbackPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Parse token from query string or hash
    let token = null;
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      token = url.searchParams.get('token');
      // Some OAuth providers return token in hash
      if (!token && url.hash) {
        const hashParams = new URLSearchParams(url.hash.replace(/^#/, ''));
        token = hashParams.get('token');
      }
      if (token) {
        // If opened in a popup, send token to opener and close
        if (window.opener) {
          window.opener.postMessage({ type: 'OAUTH_TOKEN', token }, window.location.origin);
          window.close();
        } else {
          // Fallback: store in localStorage and redirect
          localStorage.setItem('token', token);
          setTimeout(() => {
            router.replace('/');
          }, 1200);
        }
      }
    }
    // Optionally clear timeout if needed
    // (No need for timeout if using postMessage/popup flow)
  }, [router]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f7f7fb',
      fontFamily: 'Poppins, sans-serif',
    }}>
      <h2 style={{ color: '#4320d1', fontWeight: 700, fontSize: '2rem', marginBottom: 12 }}>Successfully Logged In!</h2>
      <p style={{ color: '#222', fontSize: '1.1rem', marginBottom: 24 }}>You are being redirected to your dashboard...</p>
      <div style={{ width: 48, height: 48, border: '4px solid #e0e0e0', borderTop: '4px solid #4320d1', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default CallbackPage;
