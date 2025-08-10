'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User,
  GraduationCap,
  Building,
  BookOpen,
  Calendar,
  ArrowRight, 
  Sparkles, 
  
  AlertCircle,
  Loader2,
  Shield,
  Users,
  Star
} from 'lucide-react';
import type { University } from '@/types/university';
import type { School } from '@/types/schools';
import { UserRequest } from '@/types/users';
import { Department } from './useDepartments';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const years = [
  {name : '1st Year', value : 1},
  {name : '2nd Year', value : 2},
  {name : '3rd Year', value : 3},
  {name : '4th Year', value : 4},
  {name : '5th Year', value : 5},
];

const SignUpLayout: React.FC = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    university: '',
    school: '',
    department: '',
    year: '',
    password: '',
    agree: false,
  });
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [universities, setUniversities] = useState<University[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const { name, value, type } = target;
    const checked = (type === 'checkbox' && 'checked' in target) ? (target as HTMLInputElement).checked : undefined;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (name === 'password') {
      setPasswordStrength(getPasswordStrength(value));
    }
    if (name === 'university') {
      setForm(prev => ({ ...prev, school: '', department: '' }));
    }
    if (name === 'school') {
      setForm(prev => ({ ...prev, department: '' }));
    }
  };

  // Fetch universities on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${baseUrl}/universities/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setUniversities(data.universities || []))
      .catch(() => setUniversities([]));
  }, []);

  // Fetch schools when university changes
  useEffect(() => {
    if (!form.university) return;
    const token = localStorage.getItem("token");
    fetch(`${baseUrl}/schools/?university_id=${form.university}&page=1`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setSchools(data.schools || []))
      .catch(() => setSchools([]));
  }, [form.university]);

  useEffect(() => {
    if (!form.school) return;
    const token = localStorage.getItem("token");
    fetch(`${baseUrl}/departments/tree/${form.school}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setDepartments(data.departments || []))
      .catch(() => setDepartments([]));
  }, [form.school]);

  const getPasswordStrength = (pw: string) => {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  };

  const getPasswordStrengthText = (strength: number) => {
    switch (strength) {
      case 0: return 'Very Weak';
      case 1: return 'Weak';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Strong';
      default: return '';
    }
  };

  const getPasswordStrengthColor = (strength: number) => {
    switch (strength) {
      case 0: case 1: return 'from-red-500 to-red-600';
      case 2: return 'from-yellow-500 to-orange-500';
      case 3: return 'from-blue-500 to-blue-600';
      case 4: return 'from-green-500 to-green-600';
      default: return 'from-gray-300 to-gray-400';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowError(true);
    setError('');
    setFieldErrors({});
    setLoading(true);

    const errors: { [key: string]: string } = {};
    if (!form.fullName) errors.fullName = 'Full Name is required.';
    if (!form.email) errors.email = 'Email is required.';
    if (!form.year) errors.year = 'Academic Year is required.';
    if (!form.password) errors.password = 'Password is required.';
    if (!form.agree) errors.agree = 'You must agree to the Terms of Service and Privacy Policy.';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    try {
      const payload: UserRequest = {
        name: form.fullName,
        email: form.email,
        password: form.password,
        acedemic_year: parseInt(form.year),
      };
      if (form.university) payload.university_id = form.university;
      if (form.school) payload.school_id = form.school;
      if (form.department) payload.department_id = form.department;

      const res = await fetch(`${baseUrl}/auth/email/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError('Failed to sign up. ' + JSON.stringify(data));
        setLoading(false);
        return;
      }

      router.push('/auth/signup-success');
    } catch (err) {
      setError('Network error. Please try again.' + err);
      setLoading(false);
    }
    setLoading(false);
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
          {[...Array(12)].map((_, i) => {
            const left = (i * 23 + 37) % 100;
            const top = (i * 41 + 19) % 100;
            const duration = 4 + (i % 3);
            const delay = (i % 4) * 0.8;
            
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
        <div className="w-full max-w-7xl grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side - Branding & Benefits */}
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
                Join
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
                Start Your Campus Journey!
              </h2>
              <p className="text-lg text-gray-300 leading-relaxed max-w-md mx-auto lg:mx-0">
                Join thousands of students who are already transforming their university experience with IKnow.
              </p>
            </motion.div>

            {/* Benefits */}
            <motion.div
              className="space-y-4 hidden lg:block"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              {[
                { icon: Shield, text: 'Secure and private platform' },
                { icon: Users, text: 'Connect with peers worldwide' },
                { icon: Star, text: 'Access exclusive opportunities' }
              ].map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <motion.div
                    key={benefit.text}
                    className="flex items-center text-gray-300"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1, duration: 0.6 }}
                  >
                    <Icon className="w-5 h-5 text-green-400 mr-3" />
                    <span>{benefit.text}</span>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>

          {/* Right Side - Sign Up Form */}
          <motion.div
            className="w-full max-w-lg mx-auto"
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
                    Create Account
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Join the Community
                  </h3>
                  <p className="text-gray-300 text-sm">
                    Fill in your details to get started
                  </p>
                </motion.div>

                {/* Sign Up Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                  >
                    {/* Full Name */}
                    <div className="md:col-span-2">
                      <label htmlFor="fullName" className="block text-white text-sm font-medium mb-2">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          id="fullName"
                          name="fullName"
                          type="text"
                          placeholder="John Doe"
                          value={form.fullName}
                          onChange={handleChange}
                          className={`w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 ${
                            fieldErrors.fullName ? 'border-red-500/50 ring-2 ring-red-500/20' : 'border-white/20'
                          }`}
                        />
                      </div>
                      {fieldErrors.fullName && (
                        <motion.p
                          className="mt-1 text-sm text-red-400 flex items-center"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {fieldErrors.fullName}
                        </motion.p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="md:col-span-2">
                      <label htmlFor="email" className="block text-white text-sm font-medium mb-2">
                        University Email *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="john.doe@university.edu"
                          value={form.email}
                          onChange={handleChange}
                          className={`w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 ${
                            fieldErrors.email ? 'border-red-500/50 ring-2 ring-red-500/20' : 'border-white/20'
                          }`}
                        />
                      </div>
                      {fieldErrors.email && (
                        <motion.p
                          className="mt-1 text-sm text-red-400 flex items-center"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {fieldErrors.email}
                        </motion.p>
                      )}
                    </div>
                  </motion.div>

                  {/* Academic Information */}
                  <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                  >
                    {/* University */}
                    <div>
                      <label htmlFor="university" className="block text-white text-sm font-medium mb-2">
                        University (Optional)
                      </label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <select
                          id="university"
                          name="university"
                          value={form.university}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 appearance-none"
                        >
                          <option value="" className="bg-gray-800">Select University</option>
                          {universities.map(u => (
                            <option key={u.id} value={u.id} className="bg-gray-800">{u.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* School and Department Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* School */}
                      <div>
                        <label htmlFor="school" className="block text-white text-sm font-medium mb-2">
                          School (Optional)
                        </label>
                        <div className="relative">
                          <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <select
                            id="school"
                            name="school"
                            value={form.school}
                            onChange={handleChange}
                            disabled={!form.university}
                            className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 appearance-none disabled:opacity-50"
                          >
                            <option value="" className="bg-gray-800">Select School</option>
                            {schools.map(s => (
                              <option key={s.id} value={s.id} className="bg-gray-800">{s.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Department */}
                      <div>
                        <label htmlFor="department" className="block text-white text-sm font-medium mb-2">
                          Department (Optional)
                        </label>
                        <div className="relative">
                          <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <select
                            id="department"
                            name="department"
                            value={form.department}
                            onChange={handleChange}
                            disabled={!form.school}
                            className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 appearance-none disabled:opacity-50"
                          >
                            <option value="" className="bg-gray-800">Select Department</option>
                            {departments.map(dep => (
                              <option key={dep.id} value={dep.id} className="bg-gray-800">{dep.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Academic Year */}
                    <div>
                      <label htmlFor="year" className="block text-white text-sm font-medium mb-2">
                        Academic Year *
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <select
                          id="year"
                          name="year"
                          value={form.year}
                          onChange={handleChange}
                          className={`w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 appearance-none ${
                            fieldErrors.year ? 'border-red-500/50 ring-2 ring-red-500/20' : 'border-white/20'
                          }`}
                        >
                          <option value="" className="bg-gray-800">Select Year</option>
                          {years.map(y => (
                            <option key={y.value} value={y.value} className="bg-gray-800">{y.name}</option>
                          ))}
                        </select>
                      </div>
                      {fieldErrors.year && (
                        <motion.p
                          className="mt-1 text-sm text-red-400 flex items-center"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {fieldErrors.year}
                        </motion.p>
                      )}
                    </div>
                  </motion.div>

                  {/* Password */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                  >
                    <label htmlFor="password" className="block text-white text-sm font-medium mb-2">
                      Password *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a strong password"
                        value={form.password}
                        onChange={handleChange}
                        className={`w-full pl-12 pr-12 py-4 bg-white/10 backdrop-blur-sm border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 ${
                          fieldErrors.password ? 'border-red-500/50 ring-2 ring-red-500/20' : 'border-white/20'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-white transition-colors duration-200"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    
                    {/* Password Strength Indicator */}
                    {form.password && (
                      <motion.div
                        className="mt-2"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex items-center justify-between text-xs text-gray-300 mb-1">
                          <span>Password Strength</span>
                          <span className={`font-medium ${
                            passwordStrength >= 3 ? 'text-green-400' : 
                            passwordStrength >= 2 ? 'text-yellow-400' : 'text-red-400'
                          }`}>
                            {getPasswordStrengthText(passwordStrength)}
                          </span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <motion.div
                            className={`h-2 rounded-full bg-gradient-to-r ${getPasswordStrengthColor(passwordStrength)}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${(passwordStrength / 4) * 100}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                      </motion.div>
                    )}

                    {fieldErrors.password && (
                      <motion.p
                        className="mt-1 text-sm text-red-400 flex items-center"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {fieldErrors.password}
                      </motion.p>
                    )}
                  </motion.div>

                  {/* Error Message */}
                  <AnimatePresence>
                    {showError && error && (
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

                  {/* Terms Agreement */}
                  <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                  >
                    <label className="flex items-start text-white text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        name="agree"
                        checked={form.agree}
                        onChange={handleChange}
                        className="mr-3 mt-0.5 rounded border-white/20 bg-white/10 text-purple-500 focus:ring-purple-500/50"
                      />
                      <span>
                        I agree to the{' '}
                        <Link href="#" className="text-purple-400 hover:text-purple-300 underline">
                          Terms of Service
                        </Link>
                        {' '}and{' '}
                        <Link href="#" className="text-purple-400 hover:text-purple-300 underline">
                          Privacy Policy
                        </Link>
                      </span>
                    </label>
                    {fieldErrors.agree && (
                      <motion.p
                        className="text-sm text-red-400 flex items-center"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {fieldErrors.agree}
                      </motion.p>
                    )}
                  </motion.div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={loading || !form.agree}
                    className="group relative w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: loading || !form.agree ? 1 : 1.02, y: loading || !form.agree ? 0 : -2 }}
                    whileTap={{ scale: loading || !form.agree ? 1 : 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.6 }}
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Creating Account...
                        </>
                      ) : (
                        <>
                          Create Account
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
                    transition={{ delay: 1.0, duration: 0.6 }}
                  >
                    <div className="flex-1 h-px bg-white/20"></div>
                    <span className="px-4 text-white/60 text-sm">Or sign up with</span>
                    <div className="flex-1 h-px bg-white/20"></div>
                  </motion.div>

                  {/* Google Sign Up */}
                  <motion.a
                    href={baseUrl + "/auth/google/login"}
                    className="group w-full flex items-center justify-center px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white font-medium hover:bg-white/20 transition-all duration-300"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1, duration: 0.6 }}
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

                  {/* Sign In Link */}
                  <motion.div
                    className="text-center pt-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 0.6 }}
                  >
                    <span className="text-white/70">
                      Already have an account?{' '}
                      <Link 
                        href="/auth/login" 
                        className="text-purple-400 hover:text-purple-300 font-medium transition-colors duration-200"
                      >
                        Sign In
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

export default SignUpLayout;
