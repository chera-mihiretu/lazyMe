"use client";
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Plus, 
  Briefcase, 
  Loader2, 
  AlertCircle, 
  Users,
  TrendingUp,
  Filter
} from 'lucide-react';
import dynamic from 'next/dynamic';
const ProtectedRoute = dynamic(() => import('../../ProtectedRoute'), { ssr: false });
import HomeNavBar from '@/components/home/HomeNavBar';
import { useRouter } from 'next/navigation';
import JobCard, { JobPost } from './JobCard';

const OpportunitiesPage = () => {
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError('');
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const res = await fetch(`${baseUrl}/jobs/?page=1`, {
          headers: { Authorization: token ? `Bearer ${token}` : '' },
        });

        const data = await res.json();
        if (res.ok && Array.isArray(data.jobs)) {
          setJobs(data.jobs);
        } else {
          setError('Failed to load jobs.');
        }
      } catch (e) {
        setError('Network error.' + e);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(search.toLowerCase()) ||
    job.description.toLowerCase().includes(search.toLowerCase())
  );

  // Loading Component
  const LoadingComponent = () => (
    <motion.div
      className="flex flex-col items-center justify-center py-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-4 mb-4"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <Loader2 className="w-full h-full text-white animate-spin" />
      </motion.div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Opportunities</h3>
      <p className="text-gray-600 text-center">Finding the best opportunities for you...</p>
    </motion.div>
  );

  // Error Component
  const ErrorComponent = () => (
    <motion.div
      className="flex flex-col items-center justify-center py-16"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="w-16 h-16 rounded-2xl bg-red-100 p-4 mb-4"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <AlertCircle className="w-full h-full text-red-500" />
      </motion.div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h3>
      <p className="text-gray-600 text-center mb-4">{error}</p>
      <motion.button
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Try Again
      </motion.button>
    </motion.div>
  );

  // Empty State Component
  const EmptyStateComponent = () => (
    <motion.div
      className="flex flex-col items-center justify-center py-16"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-100 to-blue-100 p-5 mb-6"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <Briefcase className="w-full h-full text-purple-600" />
      </motion.div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">
        {search ? 'No opportunities found' : 'No opportunities yet'}
      </h3>
      <p className="text-gray-600 text-center mb-6 max-w-md">
        {search 
          ? `No opportunities match "${search}". Try adjusting your search terms.`
          : 'Be the first to share an opportunity with your fellow students!'
        }
      </p>
      <motion.button
        onClick={() => router.push('/home/opportunities/create')}
        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Plus className="w-5 h-5" />
        Create Opportunity
      </motion.button>
    </motion.div>
  );

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

        {/* Navigation */}
        <HomeNavBar />

        {/* Main Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          {/* Header Section */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Page Title */}
            <div className="flex items-center gap-4 mb-6">
              <motion.div
                className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-3 shadow-lg"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                <Briefcase className="w-full h-full text-white" />
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Career Opportunities</h1>
                <p className="text-gray-600 mt-1">Discover internships, jobs, and career opportunities</p>
              </div>
              <motion.div
                className="ml-auto inline-flex items-center px-3 py-1.5 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-sm font-medium"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                {jobs.length} Available
              </motion.div>
            </div>

            {/* Search and Actions Bar */}
            <motion.div
              className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                {/* Search Section */}
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <motion.input
                      type="text"
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      placeholder="Search opportunities..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                      whileFocus={{ scale: 1.01 }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                  {search && (
                    <motion.p
                      className="text-sm text-gray-600 mt-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {filteredJobs.length} result{filteredJobs.length !== 1 ? 's' : ''} for &quot;{search}&quot;
                    </motion.p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <motion.button
                    className="inline-flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Filter className="w-5 h-5" />
                    <span className="hidden sm:inline">Filter</span>
                  </motion.button>
                  
                  <motion.button
                    onClick={() => router.push('/home/opportunities/create')}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Plus className="w-5 h-5" />
                    Create Opportunity
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Content Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <AnimatePresence mode="wait">
              {loading ? (
                <LoadingComponent />
              ) : error ? (
                <ErrorComponent />
              ) : filteredJobs.length === 0 ? (
                <EmptyStateComponent />
              ) : (
                <motion.div
                  className="space-y-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  {filteredJobs.map((job, index) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.4 }}
                    >
                      <JobCard job={job} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Footer */}
          <motion.div
            className="mt-16 py-8 border-t border-gray-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-2 text-gray-500">
              <Users className="w-4 h-4" />
              <span className="text-sm">
                Connecting students with career opportunities
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default OpportunitiesPage;
