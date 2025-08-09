"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  ImagePlus, 
  X, 
  Send, 
  Loader2, 
  AlertCircle, 
  FileText, 
  Building, 
  Check,
  Camera,
  Plus,
  BookOpen,
  Users,
  Sparkles,
  Search,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import type { Department } from "@/types/department";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/app/ProtectedRoute";
import Image from "next/image";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const CreatePostPage: React.FC = () => {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Dropdown states
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDepartments, setFilteredDepartments] = useState<Department[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${baseUrl}/departments/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setImages(prev => {
      const newImages = [...prev, ...files];
      if (newImages.length > 3) {
        return newImages.slice(0, 3);
      }
      return newImages;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!content.trim()) {
      setError("Content is required.");
      return;
    }
    if (selectedDepartments.length === 0) {
      setError("Please select at least one department.");
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("content", content);
      images.forEach((file) => {
        formData.append("files", file);
      });
      selectedDepartments.forEach((id) => {
        formData.append("department_id", id);
      });

      const res = await fetch(`${baseUrl}/posts/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData,
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "Failed to create post");
      }
      setLoading(false);
      router.push("/home/posts");
    } catch (err) {
      setLoading(false);
      setError("Failed to create post: " + err);
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

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
    if (!isDropdownOpen) {
      setSearchTerm("");
    }
  };

  const getSelectedDepartmentNames = () => {
    return selectedDepartments.map(id => {
      const dept = departments.find(d => d.id === id);
      return dept?.name || "";
    }).filter(name => name);
  };

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
                  <h1 className="text-2xl font-bold text-gray-900">Create New Post</h1>
                  <p className="text-gray-600 text-sm mt-1">Share your thoughts with the campus community</p>
                </div>
              </div>
              <motion.div
                className="inline-flex items-center px-3 py-1.5 rounded-full bg-purple-100 border border-purple-200 text-purple-700 text-sm font-medium"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                New Post
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
              {/* Content Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-2.5 shadow-lg">
                    <FileText className="w-full h-full text-white" />
                  </div>
                  <div>
                    <label className="text-lg font-semibold text-gray-900">Post Content</label>
                    <p className="text-sm text-gray-600">What would you like to share?</p>
                  </div>
                </div>
                <motion.textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={6}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 resize-none"
                  placeholder="Share your thoughts, ask questions, or start a discussion..."
                  required
                  whileFocus={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm text-gray-500">Express yourself freely</p>
                  <span className={`text-sm font-medium ${content.length > 500 ? 'text-red-500' : 'text-gray-400'}`}>
                    {content.length}/1000
                  </span>
                </div>
              </motion.div>

              {/* Department Selection */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 p-2.5 shadow-lg">
                    <Building className="w-full h-full text-white" />
                  </div>
                  <div>
                    <label className="text-lg font-semibold text-gray-900">Target Departments</label>
                    <p className="text-sm text-gray-600">Select which departments this post concerns</p>
                  </div>
                </div>

                {/* Searchable Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <motion.button
                    type="button"
                    onClick={handleDropdownToggle}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                      selectedDepartments.length > 0
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-300 bg-white hover:border-purple-300'
                    }`}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div className="flex items-center gap-3">
                      <Search className="w-5 h-5 text-gray-500" />
                      <span className={`${
                        selectedDepartments.length > 0 ? 'text-purple-700 font-medium' : 'text-gray-500'
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
                              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300"
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
                                    isSelected ? 'bg-purple-50 hover:bg-purple-100' : ''
                                  }`}
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: index * 0.02, duration: 0.3 }}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg p-2 ${
                                      isSelected 
                                        ? 'bg-purple-500 text-white' 
                                        : 'bg-gray-100 text-gray-600'
                                    } transition-all duration-300`}>
                                      <BookOpen className="w-full h-full" />
                                    </div>
                                    <div className="text-left">
                                      <h4 className={`font-semibold text-sm ${
                                        isSelected ? 'text-purple-900' : 'text-gray-900'
                                      }`}>
                                        {dept.name}
                                      </h4>
                                      <p className={`text-xs ${
                                        isSelected ? 'text-purple-700' : 'text-gray-500'
                                      }`}>
                                        Year {dept.years || 4}
                                      </p>
                                    </div>
                                  </div>
                                  {isSelected && (
                                    <motion.div
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center"
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
                    className="mt-4 p-4 bg-purple-50 rounded-xl border border-purple-200"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Users className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium text-purple-900">
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
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-100 text-purple-800 text-sm font-medium rounded-full"
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
                              className="hover:bg-purple-200 rounded-full p-0.5 transition-colors duration-200"
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

              {/* Image Upload Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 p-2.5 shadow-lg">
                    <Camera className="w-full h-full text-white" />
                  </div>
                  <div>
                    <label className="text-lg font-semibold text-gray-900">Images</label>
                    <p className="text-sm text-gray-600">Add up to 3 images to your post</p>
                  </div>
                </div>

                {/* Upload Button */}
                <motion.button
                  type="button"
                  onClick={() => document.getElementById('image-input')?.click()}
                  className="w-full border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-pink-400 hover:bg-pink-50/30 transition-all duration-300 group"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-pink-100 group-hover:bg-pink-200 p-3 transition-colors duration-300">
                      <ImagePlus className="w-full h-full text-pink-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 group-hover:text-pink-700 transition-colors duration-300">
                        Click to upload images
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        PNG, JPG up to 10MB each (max 3 images)
                      </p>
                    </div>
                  </div>
                </motion.button>

                <input
                  id="image-input"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />

                {/* Image Count Status */}
                <div className="flex items-center justify-between mt-3">
                  <span className={`text-sm font-medium ${
                    images.length === 0 ? 'text-gray-500' :
                    images.length < 3 ? 'text-blue-600' : 'text-green-600'
                  }`}>
                    {images.length} of 3 images selected
                  </span>
                  {images.length === 3 && (
                    <span className="text-sm text-green-600 font-medium">Maximum reached</span>
                  )}
                </div>

                {/* Image Preview Grid */}
                <AnimatePresence>
                  {images.length > 0 && (
                    <motion.div
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      {images.map((img, idx) => {
                        const url = URL.createObjectURL(img);
                        return (
                          <motion.div
                            key={idx}
                            className="relative group bg-gray-100 rounded-xl overflow-hidden aspect-square border-2 border-gray-200 hover:border-pink-300 transition-colors duration-300"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.3 }}
                            whileHover={{ scale: 1.02 }}
                          >
                            <Image
                              src={url}
                              alt={`Selected ${idx + 1}`}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                            <motion.button
                              type="button"
                              onClick={() => removeImage(idx)}
                              className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <X className="w-4 h-4" />
                            </motion.button>
                            <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              Image {idx + 1}
                            </div>
                          </motion.div>
                        );
                      })}
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

              {/* Submit Button */}
              <motion.div
                className="pt-6 border-t border-gray-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
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
                      <span>Publishing Post...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Publish Post</span>
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

export default CreatePostPage;
