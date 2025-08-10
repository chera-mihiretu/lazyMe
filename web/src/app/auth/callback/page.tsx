'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  CheckCircle, 
  ArrowRight, 
  Shield,
  Clock,
  Zap,
  Loader2,
  UserCheck
} from 'lucide-react';

const CallbackPage = () => {
  const router = useRouter();
  const [status, setStatus] = useState<'processing' | 'success' | 'redirecting'>('processing');
  const [countdown, setCountdown] = useState(3);

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
      
      console.log('OAuth token:', token);
      
      if (token) {
        // Show success state briefly
        setStatus('success');
        
        // If opened in a popup, send token to opener and close
        if (window.opener) {
          window.opener.postMessage({ type: 'OAUTH_TOKEN', token }, window.location.origin);
          window.close();
        } else {
          // Fallback: store in localStorage and redirect
          localStorage.setItem('token', token);
          
          // Show redirecting state
          setTimeout(() => {
            setStatus('redirecting');
          }, 1500);
          
          // Start countdown
          const countdownTimer = setInterval(() => {
            setCountdown((prev) => {
              if (prev <= 1) {
                clearInterval(countdownTimer);
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
          
          // Redirect after countdown
          setTimeout(() => {
            router.replace('/');
          }, 4500);
        }
      }
    }
  }, [router]);

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
          {[...Array(12)].map((_, i) => {
            const left = (i * 31 + 17) % 100;
            const top = (i * 47 + 29) % 100;
            const duration = 4 + (i % 3);
            const delay = (i % 4) * 0.7;
            
            return (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white/20 rounded-full"
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                }}
                animate={{
                  y: [0, -120, 0],
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
        <div className="w-full max-w-2xl mx-auto">
          <div className="relative">
            {/* Callback Container */}
            <motion.div
              className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 md:p-12 shadow-2xl text-center"
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* Logo and Brand */}
              <motion.div
                className="flex flex-col items-center mb-8"
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
              </motion.div>

              {/* Status Icon */}
              <motion.div
                className="flex justify-center mb-6"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.6, type: "spring", bounce: 0.5 }}
              >
                <div className="relative">
                  {status === 'processing' && (
                    <motion.div
                      className="w-28 h-28 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-2xl"
                      animate={{ 
                        boxShadow: [
                          "0 0 0 0 rgba(59, 130, 246, 0.6)",
                          "0 0 0 30px rgba(59, 130, 246, 0)",
                          "0 0 0 0 rgba(59, 130, 246, 0)"
                        ]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <Loader2 className="w-14 h-14 text-white" />
                      </motion.div>
                    </motion.div>
                  )}

                  {status === 'success' && (
                    <motion.div
                      className="w-28 h-28 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl"
                      animate={{ 
                        boxShadow: [
                          "0 0 0 0 rgba(34, 197, 94, 0.6)",
                          "0 0 0 30px rgba(34, 197, 94, 0)",
                          "0 0 0 0 rgba(34, 197, 94, 0)"
                        ]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      >
                        <UserCheck className="w-14 h-14 text-white" />
                      </motion.div>
                    </motion.div>
                  )}

                  {status === 'redirecting' && (
                    <motion.div
                      className="w-28 h-28 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-2xl"
                      animate={{ 
                        boxShadow: [
                          "0 0 0 0 rgba(147, 51, 234, 0.6)",
                          "0 0 0 30px rgba(147, 51, 234, 0)",
                          "0 0 0 0 rgba(147, 51, 234, 0)"
                        ]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      >
                        <Shield className="w-14 h-14 text-white" />
                      </motion.div>
                    </motion.div>
                  )}
                  
                  {/* Floating Elements */}
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute"
                      style={{
                        top: `${15 + i * 10}%`,
                        left: `${10 + i * 12}%`,
                      }}
                      animate={{
                        y: [0, -30, 0],
                        rotate: [0, 360],
                        scale: [0, 1.2, 0],
                      }}
                      transition={{
                        duration: 2.5 + i * 0.3,
                        repeat: Infinity,
                        delay: i * 0.2,
                        ease: "easeInOut"
                      }}
                    >
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Status Message */}
              <motion.div
                className="space-y-4 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                {status === 'processing' && (
                  <motion.div
                    className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 backdrop-blur-sm border border-blue-500/20 text-blue-400 text-sm font-medium mb-4"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                  >
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing Authentication
                  </motion.div>
                )}

                {status === 'success' && (
                  <motion.div
                    className="inline-flex items-center px-4 py-2 rounded-full bg-green-500/10 backdrop-blur-sm border border-green-500/20 text-green-400 text-sm font-medium mb-4"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Successfully Authenticated
                  </motion.div>
                )}

                {status === 'redirecting' && (
                  <motion.div
                    className="inline-flex items-center px-4 py-2 rounded-full bg-purple-500/10 backdrop-blur-sm border border-purple-500/20 text-purple-400 text-sm font-medium mb-4"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Redirecting to Dashboard
                  </motion.div>
                )}

                <motion.h1
                  className="text-3xl md:text-4xl font-bold text-white mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                >
                  {status === 'processing' && (
                    <>Processing<span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">...</span></>
                  )}
                  {status === 'success' && (
                    <>Welcome<span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent"> Back!</span></>
                  )}
                  {status === 'redirecting' && (
                    <>Almost<span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"> There!</span></>
                  )}
                </motion.h1>

                <motion.p
                  className="text-lg text-gray-300 leading-relaxed max-w-lg mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                >
                  {status === 'processing' && (
                    "Please wait while we verify your authentication credentials and set up your session."
                  )}
                  {status === 'success' && (
                    "Great! Your authentication was successful. We're now preparing your personalized dashboard experience."
                  )}
                  {status === 'redirecting' && (
                    "Perfect! You're all set. We're now taking you to your dashboard where you can start exploring."
                  )}
                </motion.p>
              </motion.div>

              {/* Auto-Redirect Section */}
              {status === 'redirecting' && (
                <motion.div
                  className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                >
                  <div className="flex items-center justify-center mb-4">
                    <motion.div
                      className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center"
                      animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, 10, -10, 0]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <Clock className="w-6 h-6 text-purple-400" />
                    </motion.div>
                  </div>

                  <h3 className="text-xl font-semibold text-white mb-3">
                    Redirecting to Dashboard
                  </h3>
                  
                  <motion.div
                    className="text-center mb-4"
                    key={countdown}
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                      {countdown}
                    </div>
                    <p className="text-gray-300 text-sm">
                      seconds remaining
                    </p>
                  </motion.div>

                  <p className="text-gray-400 text-xs">
                    You will be automatically redirected to your dashboard to start your journey.
                  </p>
                </motion.div>
              )}

              {/* Action Button */}
              {status === 'success' && (
                <motion.div
                  className="flex justify-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0, duration: 0.8 }}
                >
                  <motion.button
                    onClick={() => router.replace('/')}
                    className="group relative px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="relative z-10 flex items-center">
                      Go to Dashboard
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-green-500 to-emerald-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </motion.button>
                </motion.div>
              )}

              {/* Status Features */}
              <motion.div
                className="mt-8 pt-8 border-t border-white/10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.8 }}
              >
                <h4 className="text-white font-semibold mb-4">What&apos;s happening:</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <motion.div
                    className="flex items-center text-gray-300"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2, duration: 0.6 }}
                  >
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3 flex-shrink-0">
                      ✓
                    </div>
                    <span>Verifying credentials</span>
                  </motion.div>
                  
                  <motion.div
                    className="flex items-center text-gray-300"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.3, duration: 0.6 }}
                  >
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3 flex-shrink-0">
                      ✓
                    </div>
                    <span>Setting up session</span>
                  </motion.div>
                  
                  <motion.div
                    className="flex items-center text-gray-300"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.4, duration: 0.6 }}
                  >
                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3 flex-shrink-0">
                      ✓
                    </div>
                    <span>Preparing dashboard</span>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>

            {/* Background Decoration */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl blur-3xl transform rotate-3 scale-110 -z-10"></div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <motion.footer
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-center text-white/60 text-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.6 }}
      >
        © 2025 IKnow. Empowering your campus journey.
      </motion.footer>
    </div>
  );
};

export default CallbackPage;
