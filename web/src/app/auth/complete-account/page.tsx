"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from 'next/navigation';
import dynamic from "next/dynamic";
import Image from "next/image";
import { 
  Camera, 
  Building, 
  GraduationCap, 
  BookOpen, 
  ArrowRight, 
  Sparkles, 
  
  AlertCircle,
  Loader2,
  User,
  Upload
} from 'lucide-react';
import { School } from "@/types/schools";
import { Department } from "@/types/department";
import { University } from "@/types/university";

const ProtectedRoute = dynamic(() => import('../../ProtectedRoute'), { ssr: false });
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const CompleteAccountPage: React.FC = () => {
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [universities, setUniversities] = useState<University[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const router = useRouter();

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
    if (!selectedUniversity) return;
    const token = localStorage.getItem("token");
    fetch(`${baseUrl}/schools/?university_id=${selectedUniversity}&page=${1}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setSchools(data.schools || []))
      .catch(() => setSchools([]));
  }, [selectedUniversity]);

  // Fetch departments when school changes
  useEffect(() => {
    if (!selectedSchool) return;
    const token = localStorage.getItem("token");
    fetch(`${baseUrl}/departments/tree/${selectedSchool}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setDepartments(data.departments || []))
      .catch(() => setDepartments([]));
  }, [selectedSchool]);

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setProfileImage(file);
    setProfilePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    const errors: { [key: string]: string } = {};
    if (!selectedUniversity) errors.university = 'University is required.';
    if (!selectedSchool) errors.school = 'School is required.';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("university_id", selectedUniversity);
      formData.append("school_id", selectedSchool);
      
      if (selectedDepartment) {
        formData.append("department_id", selectedDepartment);
      }
      if (profileImage) {
        formData.append("file", profileImage);
      }
      const res = await fetch(`${baseUrl}/users/complete-account`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "Failed to complete profile");
      }
      setLoading(false);
      router.push("/home/posts");
    } catch (err) {
      setLoading(false);
      setError("Failed to complete profile: " + err);
    }
  };

  return (
    <ProtectedRoute role="student">
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
            {[...Array(8)].map((_, i) => {
              const left = (i * 29 + 31) % 100;
              const top = (i * 43 + 19) % 100;
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
          <div className="w-full max-w-2xl mx-auto">
            <div className="relative">
              {/* Complete Profile Container */}
              <motion.div
                className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 md:p-12 shadow-2xl"
                initial={{ opacity: 0, scale: 0.9, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                {/* Header */}
                <motion.div
                  className="text-center mb-8"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                >
                  <div className="relative mb-6">
                    <motion.div
                      className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl mx-auto"
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

                  <motion.div
                    className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 backdrop-blur-sm border border-blue-500/20 text-blue-400 text-sm font-medium mb-4"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Almost There!
                  </motion.div>

                  <motion.h1
                    className="text-3xl md:text-4xl font-bold text-white mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                  >
                    Complete Your
                    <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"> Profile</span>
                  </motion.h1>

                  <motion.p
                    className="text-lg text-gray-300 leading-relaxed max-w-lg mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  >
                    Help us personalize your experience by completing your academic profile.
                  </motion.p>
                </motion.div>

                {/* Form */}
                <motion.form
                  onSubmit={handleSubmit}
                  className="space-y-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                >
                  {/* Profile Image Section */}
                  <motion.div
                    className="flex flex-col items-center mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                  >
                    <label className="block text-white text-sm font-medium mb-4 text-center">
                      Profile Image <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    
                    <div className="relative group">
                      <input
                        id="profile-image-input"
                        type="file"
                        accept="image/*"
                        onChange={handleProfileImageChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      
                      <motion.div
                        className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-purple-500/50 shadow-2xl flex items-center justify-center bg-white/10 backdrop-blur-sm"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                      >
                        {profilePreview ? (
                          <Image 
                            src={profilePreview} 
                            alt="Profile Preview" 
                            width={128} 
                            height={128} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-12 h-12 text-gray-400" />
                        )}
                        
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <Camera className="w-8 h-8 text-white" />
                        </div>
                      </motion.div>
                      
                      <motion.button
                        type="button"
                        className="mt-3 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white text-sm font-medium hover:bg-white/20 transition-all duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => document.getElementById('profile-image-input')?.click()}
                      >
                        <Upload className="w-4 h-4 inline mr-2" />
                        Choose Photo
                      </motion.button>
                    </div>
                  </motion.div>

                  {/* Academic Information */}
                  <motion.div
                    className="space-y-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                  >
                    {/* University Selection */}
                    <div>
                      <label className="block text-white text-sm font-medium mb-2">
                        University *
                      </label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <select
                          value={selectedUniversity}
                          onChange={e => {
                            setSelectedUniversity(e.target.value);
                            setSelectedSchool("");
                            setSelectedDepartment("");
                          }}
                          className={`w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 appearance-none ${
                            fieldErrors.university ? 'border-red-500/50 ring-2 ring-red-500/20' : 'border-white/20'
                          }`}
                        >
                          <option value="" className="bg-gray-800">Select University</option>
                          {universities.map(u => (
                            <option key={u.id} value={u.id} className="bg-gray-800">{u.name}</option>
                          ))}
                        </select>
                      </div>
                      {fieldErrors.university && (
                        <motion.p
                          className="mt-1 text-sm text-red-400 flex items-center"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {fieldErrors.university}
                        </motion.p>
                      )}
                    </div>

                    {/* School Selection */}
                    <div>
                      <label className="block text-white text-sm font-medium mb-2">
                        School *
                      </label>
                      <div className="relative">
                        <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <select
                          value={selectedSchool}
                          onChange={e => {
                            setSelectedSchool(e.target.value);
                            setSelectedDepartment("");
                          }}
                          disabled={!selectedUniversity}
                          className={`w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 appearance-none disabled:opacity-50 ${
                            fieldErrors.school ? 'border-red-500/50 ring-2 ring-red-500/20' : 'border-white/20'
                          }`}
                        >
                          <option value="" className="bg-gray-800">Select School</option>
                          {schools.map(s => (
                            <option key={s.id} value={s.id} className="bg-gray-800">{s.name}</option>
                          ))}
                        </select>
                      </div>
                      {fieldErrors.school && (
                        <motion.p
                          className="mt-1 text-sm text-red-400 flex items-center"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {fieldErrors.school}
                        </motion.p>
                      )}
                    </div>

                    {/* Department Selection */}
                    <div>
                      <label className="block text-white text-sm font-medium mb-2">
                        Department <span className="text-gray-400 font-normal">(optional)</span>
                      </label>
                      <div className="relative">
                        <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <select
                          value={selectedDepartment}
                          onChange={e => setSelectedDepartment(e.target.value)}
                          disabled={!selectedSchool}
                          className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 appearance-none disabled:opacity-50"
                        >
                          <option value="" className="bg-gray-800">Select Department</option>
                          {departments.map(d => (
                            <option key={d.id} value={d.id} className="bg-gray-800">{d.name}</option>
                          ))}
                        </select>
                      </div>
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

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: loading ? 1 : 1.02, y: loading ? 0 : -2 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0, duration: 0.6 }}
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Completing Profile...
                        </>
                      ) : (
                        <>
                          Complete Profile
                          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                        </>
                      )}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-purple-500 to-blue-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </motion.button>

                  {/* Progress Indicator */}
                  <motion.div
                    className="mt-8 pt-6 border-t border-white/10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1, duration: 0.8 }}
                  >
                    <div className="flex items-center justify-between text-sm text-gray-300 mb-2">
                      <span>Profile Completion</span>
                      <span>Almost Done!</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <motion.div
                        className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
                        initial={{ width: 0 }}
                        animate={{ width: "85%" }}
                        transition={{ delay: 1.2, duration: 1, ease: "easeOut" }}
                      />
                    </div>
                  </motion.div>
                </motion.form>
              </motion.div>

              {/* Background Decoration */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-3xl blur-3xl transform rotate-3 scale-110 -z-10"></div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <motion.footer
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-center text-white/60 text-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.6 }}
        >
          © 2025 IKnow. Empowering your campus journey.
        </motion.footer>
      </div>
    </ProtectedRoute>
  );
};

export default CompleteAccountPage;
