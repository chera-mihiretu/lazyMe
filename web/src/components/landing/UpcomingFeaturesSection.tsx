'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Brain, Calendar, TrendingUp, Search, Sparkles, Clock, ArrowRight, Zap } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Validation',
    description: 'Our advanced AI will automatically review and validate posts and job listings, ensuring quality and relevance for all users.',
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-50',
    status: 'Coming Q2 2024',
    delay: 0.1,
    progress: 89,
  },
  {
    icon: Calendar,
    title: 'Smart Schedule Management',
    description: 'Easily access and manage organized schedules for every course, helping you stay on top of your academic journey.',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50',
    status: 'Coming Q3 2024',
    delay: 0.2,
    progress: 50,
  },
  {
    icon: TrendingUp,
    title: 'Exam Prediction',
    description: 'Get smart predictions for upcoming exams based on your course progress and study patterns, so you can prepare more effectively.',
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-50',
    status: 'Coming Q4 2024',
    delay: 0.3,
    progress: 10,
  },
  {
    icon: Search,
    title: 'Advanced Search Engine',
    description: 'Quickly find users, posts, and study materials with our powerful and organized search engine designed for speed and accuracy.',
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-50',
    status: 'Coming Q1 2025',
    delay: 0.4,
    progress: 70,
  },
];

const FeatureCard = ({ feature, index }: { feature: typeof features[0], index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const Icon = feature.icon;

  return (
    <motion.div
      ref={ref}
      className="group relative"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ 
        duration: 0.6, 
        delay: feature.delay,
        ease: "easeOut"
      }}
    >
      <div className="relative h-full bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 group-hover:border-gray-200 overflow-hidden">
        {/* Background Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
        
        {/* Status Badge */}
        <motion.div
          className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 text-xs font-medium rounded-full border border-gray-200"
          whileHover={{ scale: 1.05 }}
        >
          <Clock className="w-3 h-3 mr-1 inline" />
          {feature.status}
        </motion.div>
        
        {/* Icon Container */}
        <motion.div
          className={`relative w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} p-4 mb-6 shadow-lg`}
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ duration: 0.3 }}
        >
          <Icon className="w-full h-full text-white" />
          
          {/* Sparkle Effect */}
          <motion.div
            className="absolute -top-1 -right-1"
            animate={{ 
              scale: [0, 1, 0],
              rotate: [0, 180, 360]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatDelay: 4
            }}
          >
            <Sparkles className="w-4 h-4 text-yellow-400" />
          </motion.div>
        </motion.div>

        {/* Content */}
        <div className="relative z-10">
          <motion.h3 
            className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-800 transition-colors duration-300"
            whileHover={{ x: 5 }}
            transition={{ duration: 0.2 }}
          >
            {feature.title}
          </motion.h3>
          
          <p className="text-gray-600 leading-relaxed mb-6 group-hover:text-gray-700 transition-colors duration-300">
            {feature.description}
          </p>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium text-gray-500">Development Progress</span>
              <span className="text-xs font-medium text-gray-700">
                {feature.progress}%
                
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className={`h-2 rounded-full bg-gradient-to-r ${feature.color}`}
                initial={{ width: 0 }}
                animate={isInView ? { 
                  width: `${feature.progress}%`
                } : { width: 0 }}
                transition={{ delay: feature.delay + 0.5, duration: 1.5, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Learn More Link */}
          <motion.div
            className="flex items-center text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            whileHover={{ x: 5 }}
          >
            <span className={`bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`}>
              Get notified
            </span>
            <ArrowRight className="ml-2 w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors duration-300" />
          </motion.div>
        </div>

        {/* Hover Effect Border */}
        <div className={`absolute inset-0 rounded-2xl border-2 opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
             style={{ borderImage: `linear-gradient(135deg, ${feature.color}) 1` }}></div>
      </div>
    </motion.div>
  );
};

const UpcomingFeaturesSection: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section
      id="upcoming-features"
      ref={ref}
      className="relative py-20 lg:py-32 bg-gradient-to-br from-slate-50 to-gray-100 overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-purple-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-200/10 rounded-full blur-3xl"></div>
        
        {/* Animated Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,.02)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 text-sm font-medium mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Zap className="w-4 h-4 mr-2" />
            Coming Soon
          </motion.div>

          <motion.h2
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Revolutionary Features
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"> On The Horizon</span>
          </motion.h2>

          <motion.p
            className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            We're constantly innovating to bring you cutting-edge features that will transform your academic experience. Here's what's coming next.
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>

        {/* Bottom Section */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          {/* Newsletter Signup */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 shadow-lg max-w-2xl mx-auto mb-8">
            <motion.h3
              className="text-2xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              Be the First to Know
            </motion.h3>
            <motion.p
              className="text-gray-600 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              Get notified when these exciting features become available and be among the first to experience the future of campus life.
            </motion.p>
            
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.9, duration: 0.6 }}
            >
             
              <Link href="/auth/login">
                <motion.button
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started
                </motion.button>
              </Link>
            </motion.div>
          </div>

          {/* CTA Button */}
          <motion.button
            className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth' })}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 1.0, duration: 0.6 }}
          >
            <span className="relative z-10 flex items-center">
              See What Students Say
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-purple-500 to-blue-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default UpcomingFeaturesSection;
