"use client";
import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import Image from "next/image";
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/auth/email/reset-password?token=${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.message || "Failed to reset password.");
        setLoading(false);
        return;
      }
      setSuccess("Password reset successful! You can now log in.");
      setTimeout(() => router.push("/auth/login"), 1000);
    } catch (err) {
      setError("Network error. Please try again." + err);
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
      {/* ...existing code... */}
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
      {/* ...existing code... */}
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
      {/* ...existing code... */}
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
        {/* ...existing code... */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 18 }}>
          <Image src="/logos/logo-real.png" alt="IKnow Logo" width={80} height={80} style={{ marginBottom: 8 }} />
          <span style={{
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 700,
            fontSize: '2rem',
            color: '#4320d1',
            letterSpacing: 1.5,
          }}>lazyME</span>
        </div>
        {/* ...existing code... */}
        <form onSubmit={handleSubmit} className="w-full max-w-[380px] mx-auto mt-16">
          {/* ...existing code... */}
          <div className="mb-5">
            <div className="flex items-center my-4">
              <div className="flex-1 h-[1px] bg-inputBorder opacity-50" />
              <span className="mx-3 text-[#171717] font-poppins text-[0.98rem]">Set New Password</span>
              <div className="flex-1 h-[1px] bg-inputBorder opacity-50" />
            </div>
            <div className="text-[#888] text-[0.98rem] mb-2 text-center">
              Enter your new password below and click <span className="font-semibold text-primary">Reset Password</span>.<br />
              After resetting, you can log in with your new password.
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 rounded-lg font-poppins text-base outline-none bg-inputBg text-[#171717] shadow-md transition-all duration-200 border-[1.5px] border-inputBorder"
                required
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888] text-[1.1rem] font-medium px-2 py-1 focus:outline-none"
                onClick={() => setShowPassword(v => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          {error && <div className="text-error text-[0.98rem] mb-2" style={{ color: '#d32f2f' }}>{error}</div>}
          {success && <div className="text-green-600 text-[0.98rem] mb-2">{success}</div>}
          <button
            type="submit"
            disabled={loading || !password}
            className={`w-full text-white font-poppins font-semibold text-[1.08rem] rounded-lg py-3 border-none mt-2 mb-4 shadow-md cursor-pointer transition-colors ${loading ? 'opacity-70 cursor-not-allowed bg-muted' : ''}`}
            style={{ background: loading ? '#aaa' : '#4320d1' }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block w-[18px] h-[18px] border-[2.5px] border-white border-t-[2.5px] border-t-[#4320d1] rounded-full animate-spin mr-2" style={{ borderTopColor: '#4320d1' }} />
                Resetting...
              </span>
            ) : 'Reset Password'}
          </button>
          <div className="text-center mt-2">
            <span className="text-[#171717] font-poppins text-[0.98rem]">
              Remembered your password?{' '}
              <a href="/auth/login" className="text-primary underline font-medium">Sign In</a>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}

const ResetPassword: React.FC = () => (
  <Suspense>
    <ResetPasswordContent />
  </Suspense>
);

export default ResetPassword;
