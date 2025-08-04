"use client";
import React, { useState } from "react";
import Image from "next/image";
import { COLORS, FONT_FAMILY } from "@/utils/color";
import Link from "next/link";
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/auth/email/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.message || "Failed to send reset email.");
        setLoading(false);
        return;
      }
      setSuccess("If your email exists, a reset link has been sent.");
    } catch (err) {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div
    style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      padding: '2.5rem 1rem',
      background: '#f7f8fa',
      overflow: 'hidden',
    }}
  >
    {/* Background image with reduced opacity */}
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        width: '100vw',
        height: '100vh',
        background: `url('/background.png') center center / cover no-repeat`,
        opacity: 0.55,
      }}
    />
    {/* Weak 4318D1 gradient at the bottom */}
    <div
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        height: '180px',
        zIndex: 1,
        pointerEvents: 'none',
        background: 'linear-gradient(0deg, #4318D122 0%, transparent 100%)',
      }}
    />
    <div style={{
      width: '100%',
      maxWidth: 410,
      background: '#fff',
      borderRadius: 16,
      boxShadow: '0 4px 32px rgba(67,24,209,0.07)',
      padding: '2.5rem 1.5rem 2rem 1.5rem',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      zIndex: 2,
      position: 'relative',
    }}>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 18 }}>
          <Image src="/logos/logo-real.png" alt="IKnow Logo" width={80} height={80} style={{ marginBottom: 8 }} />
          <span style={{
            fontFamily: FONT_FAMILY.poppins,
            fontWeight: 700,
            fontSize: '2rem',
            color: COLORS.primary,
            letterSpacing: 1.5,
          }}>lazyME</span>
        </div>
        <form onSubmit={handleSubmit} className="w-full max-w-[380px] mx-auto mt-16">
        <div className="mb-5">
            <div className="flex items-center my-4">
            <div className="flex-1 h-[1px] bg-inputBorder opacity-50" />
            <span className="mx-3 text-[#171717] font-poppins text-[0.98rem]">Password Reset Process</span>
            <div className="flex-1 h-[1px] bg-inputBorder opacity-50" />
        </div>
        <div className="text-[#888] text-[0.98rem] mb-2 text-center">
            Enter your email above and click <span className="font-semibold text-primary">Send Reset Link</span>.<br />
            If your email exists, you will receive a link to reset your password.<br />
            Click the link in your email to open the password reset page, where you can set a new password.
        </div>
            <input
            type="email"
            placeholder="Enter your university email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className={`w-full px-4 py-3 rounded-lg font-poppins text-base outline-none mb-2 bg-inputBg text-[#171717] shadow-md transition-all duration-200 border-[1.5px] ${error ? 'border-error shadow-[0_0_0_2px_rgba(211,47,47,0.2),0_2px_8px_#e0e0e0]' : 'border-inputBorder shadow-[0_2px_8px_#e0e0e0]'}`}
            aria-label="University Email"
            required
            />
        </div>
        {error && <div className="text-error text-[0.98rem] mb-2" style={{ color: '#d32f2f' }}>{error}</div>}
        {success && <div className="text-green-600 text-[0.98rem] mb-2">{success}</div>}
        <button
            type="submit"
            disabled={loading || !email}
            className={`w-full text-white font-poppins font-semibold text-[1.08rem] rounded-lg py-3 border-none mt-2 mb-4 shadow-md cursor-pointer transition-colors ${loading ? 'opacity-70 cursor-not-allowed bg-muted' : ''}`}
            style={{ background: loading ? '#aaa' : '#4320d1' }}
        >
            {loading ? (
            <span className="flex items-center justify-center gap-2">
                <span className="inline-block w-[18px] h-[18px] border-[2.5px] border-white border-t-[2.5px] border-t-[#4320d1] rounded-full animate-spin mr-2" style={{ borderTopColor: '#4320d1' }} />
                Sending...
            </span>
            ) : 'Send Reset Link'}
        </button>
        
        <div className="text-center mt-2">
            <span className="text-[#171717] font-poppins text-[0.98rem]">
            Remembered your password?{' '}
            <Link href="/auth/login" className="text-primary underline font-medium">Sign In</Link>
            </span>
        </div>
        </form>
        </div>
    </div>
    
  );
};

export default ForgotPassword;
