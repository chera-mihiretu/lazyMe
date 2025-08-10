"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Briefcase, 
  FileText, 
  Link as LinkIcon, 
  Send, 
  Loader2, 
  AlertCircle, 
  BookOpen,
  Users,
  Sparkles,
  Search,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  ExternalLink,
  Target
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/app/ProtectedRoute';
import { Department } from '@/types/department';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const CreateJobPage: React.FC = () => {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Dropdown states
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDepartments, setFilteredDepartments] = useState<Department[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Fetch all departments on mount
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    fetch(`${baseUrl}/departments/`, {
      headers: { Authorization: token ? `Bearer ${token}` : '' },
    })
      .then((res) => res.json())
      .then((data) => {
        setDepartments(data.departments || []);
        setFilteredDepartments(data.departments || []);
      })
      .catch(() => {
        setDepartments([]);
        setFilteredDepartments([]);
      });
  }, []);

  // Filter departments based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredDepartments(departments);
    } else {
      const filtered = departments.filter(dept =>
        dept.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDepartments(filtered);
    }
  }, [searchTerm, departments]);

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isDropdownOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isDropdownOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }
    if (!description.trim()) {
      setError('Description is required.');
      return;
    }
    if (!link.trim()) {
      setError('Application link is required.');
      return;
    }
    if (selectedDepartments.length === 0) {
      setError('Please select at least one department.');
      return;
    }

    setLoading(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await fetch(`${baseUrl}/jobs/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({
          title,
          description,
          link,
          department_ids: selectedDepartments,
        }),
      });
      
      if (res.ok) {
        router.push('/home/opportunities');
      } else {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || 'Failed to create job post');
      }
    } catch (err) {
      setError('Failed to create job post: ' + err);
    } finally {
      setLoading(false);
    }
  };

  const handleDepartmentToggle = (depId: string) => {
    setSelectedDepartments(prev => 
      prev.includes(depId) 
        ? prev.filter(id => id !== depId)
        : [...prev, depId]
    );
  };

  const removeSelectedDepartment = (depId: string) => {
    setSelectedDepartments(prev => prev.filter(id => id !== depId));
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
    if (!isDropdownOpen) {
      setSearchTerm("");
    }
  };

  return (
    <ProtectedRoute role='student'>
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
                  <h1 className="text-2xl font-bold text-gray-900">Create Job Opportunity</h1>
                  <p className="text-gray-600 text-sm mt-1">Share career opportunities with fellow students</p>
                </div>
              </div>
              <motion.div
                className="inline-flex items-center px-3 py-1.5 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-sm font-medium"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                New Opportunity
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
              {/* Title Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-2.5 shadow-lg">
                    <Briefcase className="w-full h-full text-white" />
                  </div>
                  <div>
                    <label className="text-lg font-semibold text-gray-900">Job Title</label>
                    <p className="text-sm text-gray-600">What&apos;s the position called?</p>
                  </div>
                </div>
                <motion.input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                  placeholder="e.g., Software Engineering Intern, Marketing Assistant..."
                  required
                  whileFocus={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm text-gray-500">Be specific and clear</p>
                  <span className={`text-sm font-medium ${title.length > 100 ? 'text-red-500' : 'text-gray-400'}`}>
                    {title.length}/150
                  </span>
                </div>
              </motion.div>

              {/* Description Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-600 p-2.5 shadow-lg">
                    <FileText className="w-full h-full text-white" />
                  </div>
                  <div>
                    <label className="text-lg font-semibold text-gray-900">Job Description</label>
                    <p className="text-sm text-gray-600">Describe the role and requirements</p>
                  </div>
                </div>
                <motion.textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 resize-none"
                  placeholder="Provide details about the role, responsibilities, requirements, qualifications, and what makes this opportunity special..."
                  required
                  whileFocus={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm text-gray-500">Include key details and requirements</p>
                  <span className={`text-sm font-medium ${description.length > 1000 ? 'text-red-500' : 'text-gray-400'}`}>
                    {description.length}/2000
                  </span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 p-2.5 shadow-lg">
                    <Target className="w-full h-full text-white" />
                  </div>
                  <div>
                    <label className="text-lg font-semibold text-gray-900">Target Departments</label>
                    <p className="text-sm text-gray-600">Which departments should see this opportunity?</p>
                  </div>
                </div>

                {/* Searchable Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <motion.button
                    type="button"
                    onClick={handleDropdownToggle}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                      selectedDepartments.length > 0
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-300 bg-white hover:border-orange-300'
                    }`}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div className="flex items-center gap-3">
                      <Search className="w-5 h-5 text-gray-500" />
                      <span className={`${
                        selectedDepartments.length > 0 ? 'text-orange-700 font-medium' : 'text-gray-500'
                      }`}>
                        {selectedDepartments.length > 0 
                          ? `${selectedDepartments.length} department${selectedDepartments.length > 1 ? 's' : ''} selected`
                          : 'Search and select departments...'
                        }
                      </span>
                    </div>
                    {isDropdownOpen ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </motion.button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden"
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        {/* Search Input */}
                        <div className="p-4 border-b border-gray-200">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              ref={searchInputRef}
                              type="text"
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              placeholder="Search departments..."
                              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300"
                            />
                          </div>
                        </div>

                        {/* Department List */}
                        <div className="max-h-60 overflow-y-auto">
                          {filteredDepartments.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">
                              <BookOpen className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                              <p className="text-sm">
                                {searchTerm ? 'No departments found' : 'No departments available'}
                              </p>
                            </div>
                          ) : (
                            filteredDepartments.map((dept, index) => {
                              const isSelected = selectedDepartments.includes(dept.id);
                              return (
                                <motion.button
                                  key={dept.id}
                                  type="button"
                                  onClick={() => handleDepartmentToggle(dept.id)}
                                  className={`w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors duration-200 ${
                                    isSelected ? 'bg-orange-50 hover:bg-orange-100' : ''
                                  }`}
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: index * 0.02, duration: 0.3 }}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg p-2 ${
                                      isSelected 
                                        ? 'bg-orange-500 text-white' 
                                        : 'bg-gray-100 text-gray-600'
                                    } transition-all duration-300`}>
                                      <BookOpen className="w-full h-full" />
                                    </div>
                                    <div className="text-left">
                                      <h4 className={`font-semibold text-sm ${
                                        isSelected ? 'text-orange-900' : 'text-gray-900'
                                      }`}>
                                        {dept.name}
                                      </h4>
                                      <p className={`text-xs ${
                                        isSelected ? 'text-orange-700' : 'text-gray-500'
                                      }`}>
                                        Year {dept.years || 4}
                                      </p>
                                    </div>
                                  </div>
                                  {isSelected && (
                                    <motion.div
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center"
                                    >
                                      <Check className="w-3 h-3 text-white" />
                                    </motion.div>
                                  )}
                                </motion.button>
                              );
                            })
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Selected Departments Summary */}
                {selectedDepartments.length > 0 && (
                  <motion.div
                    className="mt-4 p-4 bg-orange-50 rounded-xl border border-orange-200"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Users className="w-4 h-4 text-orange-600" />
                      <span className="text-sm font-medium text-orange-900">
                        Selected Departments ({selectedDepartments.length})
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedDepartments.map(depId => {
                        const dep = departments.find(d => d.id === depId);
                        if (!dep) return null;
                        return (
                          <motion.span
                            key={dep.id}
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-100 text-orange-800 text-sm font-medium rounded-full"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                          >
                            <BookOpen className="w-3 h-3" />
                            <span>{dep.name}</span>
                            <motion.button
                              type="button"
                              onClick={() => removeSelectedDepartment(dep.id)}
                              className="hover:bg-orange-200 rounded-full p-0.5 transition-colors duration-200"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <X className="w-3 h-3" />
                            </motion.button>
                          </motion.span>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </motion.div>

              {/* Application Link Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 p-2.5 shadow-lg">
                    <LinkIcon className="w-full h-full text-white" />
                  </div>
                  <div>
                    <label className="text-lg font-semibold text-gray-900">Application Link</label>
                    <p className="text-sm text-gray-600">Where can students apply?</p>
                  </div>
                </div>
                <div className="relative">
                  <ExternalLink className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <motion.input
                    type="url"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300"
                    placeholder="https://company.com/careers/job-posting"
                    required
                    whileFocus={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">This should be a direct link to the application page</p>
              </motion.div>

              {/* Department Selection */}
              

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

              {/* Submit Button */}
              <motion.div
                className="pt-6 border-t border-gray-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <motion.button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 ${
                    loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                  }`}
                  whileHover={loading ? {} : { scale: 1.02 }}
                  whileTap={loading ? {} : { scale: 0.98 }}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Creating Opportunity...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Create Opportunity</span>
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

export default CreateJobPage;
