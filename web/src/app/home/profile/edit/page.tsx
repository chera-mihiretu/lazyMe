"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from 'next/navigation';
import Image from "next/image";
import { 
  Camera, 
  Building, 
  GraduationCap, 
  BookOpen, 
  ArrowLeft, 
  Sparkles, 
  AlertCircle,
  Loader2,
  User,
  Upload,
  Mail,
  Calendar,
  Award,
  Save
} from 'lucide-react';
import ProtectedRoute from "@/app/ProtectedRoute";
import { useUserProfile } from "@/hooks/useUserProfile";
import { School } from "@/types/schools";
import { Department } from "@/types/department";
import { University } from "@/types/university";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const EditProfilePage: React.FC = () => {
  const router = useRouter();
  const { user: currentUser, loading: profileLoading } = useUserProfile();
  
  // Track initial values for change detection
  const initialNameRef = useRef<string>("");
  const initialYearRef = useRef<number>(1);
  const initialUniversityRef = useRef<string>("");
  const initialSchoolRef = useRef<string>("");
  const initialDepartmentRef = useRef<string>("");
  
  // Form states
  const [form, setForm] = useState({
    name: '',
    email: '',
    academicYear: 1,
    university: '',
    school: '',
    department: '',
  });
  
  // UI states
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [success, setSuccess] = useState(false);
  const [showUniversityFields, setShowUniversityFields] = useState(false);
  
  // Data states
  const [universities, setUniversities] = useState<University[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  
  // Academic years
  const academicYears = [
    { name: '1st Year', value: 1 },
    { name: '2nd Year', value: 2 },
    { name: '3rd Year', value: 3 },
    { name: '4th Year', value: 4 },
    { name: '5th Year', value: 5 },
  ];

  // Helper function to find user's current university and school
  const findUserAcademicData = async () => {
    if (!currentUser?.school) return;
    
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      // First, try to find the school in all universities
      for (const university of universities) {
        const schoolResponse = await fetch(`${baseUrl}/schools/?university_id=${university.id}&page=1`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (schoolResponse.ok) {
          const schoolData = await schoolResponse.json();
          const userSchool = schoolData.schools?.find((s: School) => 
            s.name.toLowerCase().includes(currentUser.school!.toLowerCase()) ||
            currentUser.school!.toLowerCase().includes(s.name.toLowerCase())
          );
          
          if (userSchool) {
            setForm(prev => ({ 
              ...prev, 
              university: university.id,
              school: userSchool.id 
            }));
            // set initial refs for academic ids
            initialUniversityRef.current = String(university.id);
            initialSchoolRef.current = String(userSchool.id);
            
            // Now fetch departments for this school
            const deptResponse = await fetch(`${baseUrl}/departments/tree/${userSchool.id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            
            if (deptResponse.ok) {
              const deptData = await deptResponse.json();
              setDepartments(deptData.departments || []);
              
              // Try to find user's department
              if (currentUser.department) {
                const userDepartment = deptData.departments?.find((d: Department) => 
                  d.name.toLowerCase().includes(currentUser.department!.toLowerCase()) ||
                  currentUser.department!.toLowerCase().includes(d.name.toLowerCase())
                );
                
                if (userDepartment) {
                  setForm(prev => ({ ...prev, department: userDepartment.id }));
                  initialDepartmentRef.current = String(userDepartment.id);
                }
              }
            }
            break; // Found the school, no need to continue
          }
        }
      }
    } catch (error) {
      console.error('Error finding user academic data:', error);
    }
  };

  // Initialize form with current user data
  useEffect(() => {
    if (currentUser) {
      setForm({
        name: currentUser.name || '',
        email: currentUser.email || '',
        academicYear: currentUser.acedemic_year || 1,
        university: '', // set after fetching academic data
        school: '',
        department: '',
      });
      if (currentUser.profile_image_url) {
        setProfilePreview(currentUser.profile_image_url);
      }
      // set initial refs
      initialNameRef.current = currentUser.name || '';
      initialYearRef.current = currentUser.acedemic_year || 1;
    }
  }, [currentUser]);

  // Fetch universities on mount and try to set current user's university
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${baseUrl}/universities/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setUniversities(data.universities || []);
      })
      .catch(() => setUniversities([]));
  }, []);

  // Try to find user's academic data after universities are loaded
  useEffect(() => {
    if (universities.length > 0 && currentUser && showUniversityFields) {
      findUserAcademicData();
    }
  }, [universities, currentUser, showUniversityFields]);

  // Fetch schools when university changes
  useEffect(() => {
    if (!form.university || !showUniversityFields) return;
    const token = localStorage.getItem("token");
    fetch(`${baseUrl}/schools/?university_id=${form.university}&page=1`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setSchools(data.schools || []);
      })
      .catch(() => setSchools([]));
  }, [form.university, showUniversityFields]);

  // Fetch departments when school changes
  useEffect(() => {
    if (!form.school || !showUniversityFields) return;
    const token = localStorage.getItem("token");
    fetch(`${baseUrl}/departments/tree/${form.school}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setDepartments(data.departments || []);
      })
      .catch(() => setDepartments([]));
  }, [form.school, showUniversityFields]);

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setProfileImage(file);
    setProfilePreview(URL.createObjectURL(file));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === 'academicYear' ? Number(value) : value }));
    
    // Reset dependent fields
    if (name === 'university') {
      setForm(prev => ({ ...prev, school: '', department: '' }));
    }
    if (name === 'school') {
      setForm(prev => ({ ...prev, department: '' }));
    }
    
    // Clear field errors
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle checkbox change
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setShowUniversityFields(checked);
    
    // Reset university fields when unchecking
    if (!checked) {
      setForm(prev => ({ ...prev, university: '', school: '', department: '' }));
      setFieldErrors(prev => ({ ...prev, university: '', school: '' }));
    }
  }

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    
    if (!form.name.trim()) errors.name = 'Name is required.';
    // email is read-only; do not validate presence for editing
    
    // Only validate university and school if the checkbox is checked
    if (showUniversityFields) {
      if (!form.university) errors.university = 'University is required.';
      if (!form.school) errors.school = 'School is required.';
    }
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required");
      }

      const formData = new FormData();
      
      // Only append changed fields
      if (form.name.trim() !== initialNameRef.current.trim()) {
        formData.append("name", form.name.trim());
      }
      if (form.academicYear !== initialYearRef.current) {
        formData.append("acedemic_year", String(form.academicYear));
      }
      if (showUniversityFields) {
        if (form.university && String(form.university) !== initialUniversityRef.current) {
          formData.append("university_id", String(form.university));
        }
        if (form.school && String(form.school) !== initialSchoolRef.current) {
          formData.append("school_id", String(form.school));
        }
        if (form.department && String(form.department) !== initialDepartmentRef.current) {
          formData.append("department_id", String(form.department));
        }
      }
      if (profileImage) {
        formData.append("file", profileImage);
      }

      const response = await fetch(`${baseUrl}/users/me`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/home/profile');
      }, 1500);

    } catch (error) {
      console.error('Profile update error:', error);
      setError(error instanceof Error ? error.message : 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (profileLoading) {
    return (
      <ProtectedRoute role="student">
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 flex items-center justify-center">
          <motion.div
            className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-8 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="w-16 h-16 bg-gradient-to-br from-purple-200 to-blue-200 rounded-full mx-auto mb-4 flex items-center justify-center"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <User className="w-8 h-8 text-purple-600" />
            </motion.div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Loading Profile</h3>
            <p className="text-gray-600 text-sm">Please wait while we load your profile...</p>
          </motion.div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute role="student">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-100/20 via-blue-50/10 to-transparent"></div>
          
          {/* Floating Orbs */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl"
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
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl"
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
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,.02)_1px,transparent_1px)] bg-[size:100px_100px]"></div>
        </div>

        {/* Header */}
        <motion.div
          className="relative z-10 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-lg"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <motion.button
                  onClick={() => router.back()}
                  className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowLeft className="w-5 h-5" />
                </motion.button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
                  <p className="text-gray-600 text-sm mt-1">Update your profile information</p>
                </div>
              </div>
              <motion.div
                className="inline-flex items-center px-3 py-1.5 rounded-full bg-purple-100 border border-purple-200 text-purple-700 text-sm font-medium"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Profile Settings
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              {/* Profile Image Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-center"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 p-2.5 shadow-lg">
                    <Camera className="w-full h-full text-white" />
                  </div>
                  <div>
                    <label className="text-lg font-semibold text-gray-900">Profile Picture</label>
                    <p className="text-sm text-gray-600">Update your profile image</p>
                  </div>
                </div>
                
                <div className="relative inline-block">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white shadow-xl">
                    {profilePreview ? (
                      <Image
                        src={profilePreview}
                        alt="Profile Preview"
                        width={128}
                        height={128}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                        <User className="w-12 h-12 sm:w-16 sm:h-16 text-purple-600" />
                      </div>
                    )}
                  </div>
                  
                  <label className="absolute bottom-0 right-0 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300">
                    <Upload className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfileImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </motion.div>

              {/* Personal Information Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-2.5 shadow-lg">
                    <User className="w-full h-full text-white" />
                  </div>
                  <div>
                    <label className="text-lg font-semibold text-gray-900">Personal Information</label>
                    <p className="text-sm text-gray-600">Update your basic details</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleInputChange}
                      className={`w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 ${
                        fieldErrors.name ? 'border-red-500 ring-2 ring-red-500/20' : ''
                      }`}
                      placeholder="Enter your full name"
                      required
                    />
                    {fieldErrors.name && (
                      <motion.p
                        className="mt-1 text-sm text-red-500 flex items-center"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {fieldErrors.name}
                      </motion.p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleInputChange}
                        disabled
                        className={`w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 text-gray-900 placeholder-gray-500 bg-gray-100 cursor-not-allowed focus:ring-0 focus:border-gray-300 ${
                          fieldErrors.email ? 'border-red-500 ring-2 ring-red-500/20' : ''
                        }`}
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                    {fieldErrors.email && (
                      <motion.p
                        className="mt-1 text-sm text-red-500 flex items-center"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {fieldErrors.email}
                      </motion.p>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Academic Information Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-600 p-2.5 shadow-lg">
                    <GraduationCap className="w-full h-full text-white" />
                  </div>
                  <div>
                    <label className="text-lg font-semibold text-gray-900">Academic Information</label>
                    <p className="text-sm text-gray-600">Update your academic details</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Academic Year */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Academic Year *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <select
                        name="academicYear"
                        value={form.academicYear}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 text-gray-900 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 appearance-none"
                      >
                        {academicYears.map(year => (
                          <option key={year.value} value={year.value}>
                            {year.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Change University Info Checkbox */}
                  <div className="flex items-center">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showUniversityFields}
                        onChange={handleCheckboxChange}
                        className="w-5 h-5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                      />
                      <span className="text-sm font-medium text-gray-700">Change university info</span>
                    </label>
                  </div>
                </div>

                {/* University, School, and Department Fields - Only show when checkbox is checked */}
                <AnimatePresence>
                  {showUniversityFields && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 space-y-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* University */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            University *
                          </label>
                          <div className="relative">
                            <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <select
                              name="university"
                              value={form.university}
                              onChange={handleInputChange}
                              className={`w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 text-gray-900 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 appearance-none ${
                                fieldErrors.university ? 'border-red-500 ring-2 ring-red-500/20' : ''
                              }`}
                            >
                              <option value="">Select University</option>
                              {universities.map(u => (
                                <option key={u.id} value={u.id}>{u.name}</option>
                              ))}
                            </select>
                          </div>
                          {fieldErrors.university && (
                            <motion.p
                              className="mt-1 text-sm text-red-500 flex items-center"
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                            >
                              <AlertCircle className="w-4 h-4 mr-1" />
                              {fieldErrors.university}
                            </motion.p>
                          )}
                        </div>

                        {/* School */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            School *
                          </label>
                          <div className="relative">
                            <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <select
                              name="school"
                              value={form.school}
                              onChange={handleInputChange}
                              disabled={!form.university}
                              className={`w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 text-gray-900 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 appearance-none ${
                                !form.university ? 'bg-gray-100 cursor-not-allowed' : ''
                              } ${
                                fieldErrors.school ? 'border-red-500 ring-2 ring-red-500/20' : ''
                              }`}
                            >
                              <option value="">Select School</option>
                              {schools.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                              ))}
                            </select>
                          </div>
                          {fieldErrors.school && (
                            <motion.p
                              className="mt-1 text-sm text-red-500 flex items-center"
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                            >
                              <AlertCircle className="w-4 h-4 mr-1" />
                              {fieldErrors.school}
                            </motion.p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Department */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Department
                          </label>
                          <div className="relative">
                            <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <select
                              name="department"
                              value={form.department}
                              onChange={handleInputChange}
                              disabled={!form.school}
                              className={`w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 text-gray-900 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 appearance-none ${
                                !form.school ? 'bg-gray-100 cursor-not-allowed' : ''
                              }`}
                            >
                              <option value="">Select Department</option>
                              {departments.map(d => (
                                <option key={d.id} value={d.id}>{d.name}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <p className="text-red-700 text-sm">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Success Message */}
              <AnimatePresence>
                {success && (
                  <motion.div
                    className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Award className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <p className="text-green-700 text-sm">Profile updated successfully! Redirecting...</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <motion.div
                className="pt-6 border-t border-gray-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <motion.button
                  type="submit"
                  disabled={loading || success}
                  className={`w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 ${
                    loading || success
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl'
                  }`}
                  whileHover={loading || success ? {} : { scale: 1.02 }}
                  whileTap={loading || success ? {} : { scale: 0.98 }}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Updating Profile...</span>
                    </>
                  ) : success ? (
                    <>
                      <Award className="w-5 h-5" />
                      <span>Profile Updated!</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>Update Profile</span>
                    </>
                  )}
                </motion.button>
              </motion.div>
            </form>
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default EditProfilePage; 