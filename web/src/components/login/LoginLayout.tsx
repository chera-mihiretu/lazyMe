'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  ArrowRight, 
  Sparkles, 
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const LoginLayout: React.FC = () => {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden relative">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-900/40 to-slate-900"></div>
        
        {/* Floating Orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:100px_100px]"></div>
        
        {/* Animated Particles */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => {
            // Use deterministic positions based on index to avoid hydration mismatch
            const left = (i * 19 + 31) % 100; // Pseudo-random but deterministic
            const top = (i * 29 + 41) % 100;  // Pseudo-random but deterministic
            const duration = 3 + (i % 3); // Deterministic duration variation
            const delay = (i % 3) * 0.7; // Deterministic delay variation
            
            return (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white/20 rounded-full"
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                }}
                animate={{
                  y: [0, -100, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: duration,
                  repeat: Infinity,
                  delay: delay,
                  ease: "easeInOut"
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Branding & Welcome */}
          <motion.div
            className="text-center lg:text-left"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Logo and Brand */}
            <motion.div
              className="flex flex-col items-center lg:items-start mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <div className="relative mb-6">
                <motion.div
                  className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src="/icons/logo-iknow.png"
                    alt="IKnow Logo"
                    width={40}
                    height={40}
                    className="rounded-lg"
                    priority
                  />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-blue-500/30 rounded-2xl blur-xl transform rotate-6 scale-110"></div>
              </div>
              
              <motion.h1
                className="text-3xl md:text-4xl font-bold text-white mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                Welcome to
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"> IKnow</span>
              </motion.h1>
            </motion.div>

            {/* Welcome Message */}
            <motion.div
              className="space-y-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Welcome Back!
              </h2>
              <p className="text-lg text-gray-300 leading-relaxed max-w-md mx-auto lg:mx-0">
                Sign in to continue your campus journey and connect with your academic community.
              </p>
            </motion.div>

            {/* Feature Highlights */}
            <motion.div
              className="space-y-3 hidden lg:block"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              {[
                'Access your personalized dashboard',
                'Connect with peers and study groups',
                'Stay updated with campus announcements'
              ].map((feature, index) => (
                <motion.div
                  key={feature}
                  className="flex items-center text-gray-300"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1, duration: 0.6 }}
                >
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  <span>{feature}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Side - Login Form */}
          <motion.div
            className="w-full max-w-md mx-auto"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <div className="relative">
              {/* Form Container */}
              <motion.div
                className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl"
                whileHover={{ y: -2 }}
                transition={{ duration: 0.3 }}
              >
                {/* Form Header */}
                <motion.div
                  className="text-center mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-medium mb-4">
                    <Sparkles className="w-4 h-4 mr-2 text-yellow-400" />
                    Sign In
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Access Your Account
                  </h3>
                  <p className="text-gray-300 text-sm">
                    Enter your credentials to continue
                  </p>
                </motion.div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email Field */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                  >
                    <label htmlFor="email" className="block text-white text-sm font-medium mb-2">
                      University Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        id="email"
                        type="email"
                        placeholder="Enter your university email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 ${
                          error ? 'border-red-500/50 ring-2 ring-red-500/20' : 'border-white/20'
                        }`}
                        aria-label="University Email"
                      />
                    </div>
                  </motion.div>

                  {/* Password Field */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                  >
                    <label htmlFor="password" className="block text-white text-sm font-medium mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`w-full pl-12 pr-12 py-4 bg-white/10 backdrop-blur-sm border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 ${
                          error ? 'border-red-500/50 ring-2 ring-red-500/20' : 'border-white/20'
                        }`}
                        aria-label="Password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-white transition-colors duration-200"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </motion.div>

                  {/* Error Message */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        className="flex items-center p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                      >
                        <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                        {error}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Remember Me & Forgot Password */}
                  <motion.div
                    className="flex items-center justify-between"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                  >
                    <label className="flex items-center text-white text-sm">
                      <input
                        type="checkbox"
                        checked={remember}
                        onChange={(e) => setRemember(e.target.checked)}
                        className="mr-2 rounded border-white/20 bg-white/10 text-purple-500 focus:ring-purple-500/50"
                      />
                      Remember me
                    </label>
                    <Link 
                      href="/auth/forgot-password" 
                      className="text-purple-400 hover:text-purple-300 text-sm transition-colors duration-200"
                    >
                      Forgot Password?
                    </Link>
                  </motion.div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                    whileHover={{ scale: loading ? 1 : 1.02, y: loading ? 0 : -2 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Signing In...
                        </>
                      ) : (
                        <>
                          Sign In
                          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                        </>
                      )}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-purple-500 to-blue-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </motion.button>

                  {/* Divider */}
                  <motion.div
                    className="flex items-center my-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9, duration: 0.6 }}
                  >
                    <div className="flex-1 h-px bg-white/20"></div>
                    <span className="px-4 text-white/60 text-sm">Or continue with</span>
                    <div className="flex-1 h-px bg-white/20"></div>
                  </motion.div>

                  {/* Google Login */}
                  <motion.a
                    href={baseUrl + "/auth/google/login"}
                    className="group w-full flex items-center justify-center px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white font-medium hover:bg-white/20 transition-all duration-300"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0, duration: 0.6 }}
                  >
                    <Image 
                      src="/icons/google.png" 
                      alt="Google" 
                      width={20} 
                      height={20} 
                      className="mr-3" 
                    />
                    Continue with Google
                  </motion.a>

                  {/* Sign Up Link */}
                  <motion.div
                    className="text-center pt-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1, duration: 0.6 }}
                  >
                    <span className="text-white/70">
                      New to IKnow?{' '}
                      <Link 
                        href="/auth/signup" 
                        className="text-purple-400 hover:text-purple-300 font-medium transition-colors duration-200"
                      >
                        Sign Up
                      </Link>
                    </span>
                  </motion.div>
                </form>
              </motion.div>

              {/* Background Decoration */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-3xl blur-3xl transform rotate-3 scale-110 -z-10"></div>
            </div>
          </motion.div>
        </div>
      </div>

      
    </div>
  );
};

export default LoginLayout;
