'use client';
import React, { useState } from 'react';
import { COLORS, FONT_FAMILY } from '../../utils/color';
import Link from 'next/link';


const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    // Simple validation
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setError('');
    setLoading(true);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl) {
      setError('Server configuration error. Please try again later.');
      setLoading(false);
      return;
    }

    fetch(`${baseUrl}/auth/email/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then(async (response) => {
        const data = await response.json();
        if (response.status === 200 && data.token) {
          if (typeof window !== 'undefined') {
            localStorage.setItem('token', data.token);
            // Extract role from JWT
            try {
              const payload = data.token.split('.')[1];
              const decoded = JSON.parse(atob(payload));
              const role = decoded.role;
              if (role === 'admin') {
                window.location.href = '/admin';
              } else {
                window.location.href = '/home/posts';
              }
            } catch {
              window.location.href = '/home/posts';
            }
          }
        } else {
          setError(data.error || 'An unknown error occurred.');
          setLoading(false);
        }
      })
      .catch((err) => {
        setError('Network error. Please try again later.');
        setLoading(false);
        console.error(err);
      });
  };

  

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 380, margin: '0 auto' }}>
      
      <div style={{ marginBottom: 18 }}>
        <input
          type="email"
          placeholder="Enter your university email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{
            width: '100%',
            padding: '0.85rem 1rem',
            border: `1.5px solid ${error ? COLORS.error : COLORS.inputBorder}`,
            borderRadius: 8,
            fontFamily: FONT_FAMILY.poppins,
            fontSize: '1rem',
            outline: 'none',
            marginBottom: 8,
            background: COLORS.inputBg,
            color: '#171717', // black text
            boxShadow: error ? `0 0 0 2px ${COLORS.error}33, 0 2px 8px #e0e0e0` : '0 2px 8px #e0e0e0',
            transition: 'border 0.2s, box-shadow 0.2s',
          }}
          aria-label="University Email"
        />
      </div>
      <div style={{ marginBottom: 8, position: 'relative' }}>
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Enter your password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{
            width: '100%',
            padding: '0.85rem 1rem',
            border: `1.5px solid ${error ? COLORS.error : COLORS.inputBorder}`,
            borderRadius: 8,
            fontFamily: FONT_FAMILY.poppins,
            fontSize: '1rem',
            outline: 'none',
            background: COLORS.inputBg,
            color: '#171717', // black text
            boxShadow: error ? `0 0 0 2px ${COLORS.error}33, 0 2px 8px #e0e0e0` : '0 2px 8px #e0e0e0',
            transition: 'border 0.2s, box-shadow 0.2s',
          }}
          aria-label="Password"
        />
        <button
          type="button"
          onClick={() => setShowPassword(v => !v)}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          style={{
            position: 'absolute',
            right: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            color: COLORS.muted,
            fontSize: '1.1rem',
            fontFamily: FONT_FAMILY.poppins,
            opacity: 0.8,
          }}
        >
          {showPassword ? 'Hide' : 'Show'}
        </button>
      </div>
      {error && <div style={{ color: COLORS.error, fontSize: '0.98rem', marginBottom: 10 }}>{error}</div>}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <label style={{ display: 'flex', alignItems: 'center', fontFamily: FONT_FAMILY.poppins, fontSize: '0.98rem', color: COLORS.foreground }}>
          <input
            type="checkbox"
            checked={remember}
            onChange={e => setRemember(e.target.checked)}
            style={{ marginRight: 7 }}
          />
          Remember me
        </label>
        <a href="#" style={{ color: COLORS.primary, fontSize: '0.98rem', textDecoration: 'underline', opacity: 0.85 }}>Forgot Password?</a>
      </div>
      <button
        type="submit"
        disabled={loading}
        style={{
          width: '100%',
          background: loading ? COLORS.muted : COLORS.primary,
          color: '#fff',
          fontFamily: FONT_FAMILY.poppins,
          fontWeight: 600,
          fontSize: '1.08rem',
          borderRadius: 8,
          padding: '0.85rem 0',
          border: 'none',
          marginTop: 8,
          marginBottom: 18,
          boxShadow: '0 2px 8px rgba(67,24,209,0.07)',
          cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'background 0.2s',
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? (
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <span className="spinner" style={{
              width: 18, height: 18, border: '2.5px solid #fff', borderTop: `2.5px solid ${COLORS.primary}`,
              borderRadius: '50%', display: 'inline-block', marginRight: 8,
              animation: 'spin 0.8s linear infinite',
            }} />
            Signing In...
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          </span>
        ) : 'Sign In'}
      </button>
      <div style={{ display: 'flex', alignItems: 'center', margin: '18px 0' }}>
        <div style={{ flex: 1, height: 1, background: COLORS.inputBorder, opacity: 0.5 }} />
        <span style={{ margin: '0 12px', color: '#171717', fontFamily: FONT_FAMILY.poppins, fontSize: '0.98rem' }}>Or continue with</span>
        <div style={{ flex: 1, height: 1, background: COLORS.inputBorder, opacity: 0.5 }} />
      </div>
      <a
        href="http://localhost:8080/api/auth/google/login"
        
        style={{
          width: '100%',
          background: '#fff',
          color: COLORS.foreground,
          fontFamily: FONT_FAMILY.poppins,
          fontWeight: 600,
          fontSize: '1.08rem',
          borderRadius: 8,
          padding: '0.85rem 0',
          border: `1.5px solid ${COLORS.inputBorder}`,
          marginBottom: 10,
          boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          cursor: 'pointer',
          transition: 'border 0.2s',
          textDecoration: 'none',
        }}
      >
        <img src="/icons/google.png" alt="Google" width={22} height={22} style={{ marginRight: 8 }} />
        Continue with Google
      </a>
      <div style={{ textAlign: 'center', marginTop: 10 }}>
        <span style={{ color: '#171717', fontFamily: FONT_FAMILY.poppins, fontSize: '0.98rem' }}>
          New to iKnow?{' '}
          <Link href="/auth/signup" prefetch={false} style={{ color: COLORS.primary, textDecoration: 'underline', fontWeight: 500 }}>Sign Up</Link>
        </span>
      </div>
    </form>
  );
};

export default LoginForm;
