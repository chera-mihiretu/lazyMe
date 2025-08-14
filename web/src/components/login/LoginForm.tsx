'use client';
import React, { useState } from 'react';
import { COLORS } from '../../utils/color';
import Link from 'next/link';
import Image from 'next/image';
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
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
                window.location.href = '/admin/dashboard';
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
    <form onSubmit={handleSubmit} className="w-full max-w-[380px] mx-auto">
      <div className="mb-5">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className={`w-full px-4 py-3 rounded-lg font-poppins text-base outline-none mb-2 bg-inputBg text-[#171717] shadow-md transition-all duration-200 border-[1.5px] ${error ? 'border-error shadow-[0_0_0_2px_rgba(211,47,47,0.2),0_2px_8px_#e0e0e0]' : 'border-inputBorder shadow-[0_2px_8px_#e0e0e0]'}`}
          aria-label="University Email"
        />
      </div>
      <div className="mb-2 relative">
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Enter your password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className={`w-full px-4 py-3 rounded-lg font-poppins text-base outline-none bg-inputBg text-[#171717] shadow-md transition-all duration-200 border-[1.5px] ${error ? 'border-error shadow-[0_0_0_2px_rgba(211,47,47,0.2),0_2px_8px_#e0e0e0]' : 'border-inputBorder shadow-[0_2px_8px_#e0e0e0]'}`}
          aria-label="Password"
        />
        <button
          type="button"
          onClick={() => setShowPassword(v => !v)}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer p-0 text-[1.1rem] font-poppins opacity-80"
          style={{ color: COLORS.muted }}
        >
          {showPassword ? 'Hide' : 'Show'}
        </button>
      </div>
      {error && <div className="text-error text-[0.98rem] mb-2" style={{ color: COLORS.error }}>{error}</div>}
      <div className="flex items-center justify-between mb-2.5">
        <label className="flex items-center font-poppins text-[0.98rem] text-foreground">
          <input
            type="checkbox"
            checked={remember}
            onChange={e => setRemember(e.target.checked)}
            className="mr-2"
          />
          Remember me
        </label>
        <Link href="/auth/forgot-password" className="text-primary text-[0.98rem] underline opacity-85">Forgot Password?</Link>
      </div>
      <button
        type="submit"
        disabled={loading}
        className={`w-full text-white font-poppins font-semibold text-[1.08rem] rounded-lg py-3 border-none mt-2 mb-4 shadow-md cursor-pointer transition-colors ${loading ? 'opacity-70 cursor-not-allowed bg-muted' : ''}`}
        style={{ background: loading ? COLORS.muted : COLORS.primary }}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="inline-block w-[18px] h-[18px] border-[2.5px] border-white border-t-[2.5px] border-t-[COLORS.primary] rounded-full animate-spin mr-2" style={{ borderTopColor: COLORS.primary }} />
            Signing In...
          </span>
        ) : 'Sign In'}
      </button>
      <div className="flex items-center my-4">
        <div className="flex-1 h-[1px] bg-inputBorder opacity-50" />
        <span className="mx-3 text-[#171717] font-poppins text-[0.98rem]">Or continue with</span>
        <div className="flex-1 h-[1px] bg-inputBorder opacity-50" />
      </div>
      <a
        href={baseUrl + "/auth/google/login"}
        className="w-full bg-white text-foreground font-poppins font-semibold text-[1.08rem] rounded-lg py-3 border-inputBorder border-[1.5px] mb-2 shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-colors no-underline"
        style={{ color: COLORS.foreground, borderColor: COLORS.inputBorder }}
      >
        <Image src="/icons/google.png" alt="Google" width={22} height={22} className="mr-2" />
        Continue with Google
      </a>
      <div className="text-center mt-2">
        <span className="text-[#171717] font-poppins text-[0.98rem]">
          New to iKnow?{' '}
          <Link href="/auth/signup" prefetch={false} className="text-primary underline font-medium">Sign Up</Link>
        </span>
      </div>
    </form>
  );
};

export default LoginForm;
