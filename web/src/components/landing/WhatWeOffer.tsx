'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Megaphone, BookOpen, Users, Briefcase, ArrowRight, Sparkles } from 'lucide-react';

const features = [
  {
    icon: Megaphone,
    title: 'Campus Announcements',
    description: 'Stay updated with real-time campus news, events, and important announcements tailored specifically for you.',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50',
    delay: 0.1,
  },
  {
    icon: BookOpen,
    title: 'Study Resources',
    description: 'Access curated study materials, notes, and guides to boost your academic performance and excel in your courses.',
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-50',
    delay: 0.2,
  },
  {
    icon: Users,
    title: 'Peer Networking',
    description: 'Connect with fellow students, join study groups, and expand your university network for lifelong friendships.',
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-50',
    delay: 0.3,
  },
  {
    icon: Briefcase,
    title: 'Opportunities',
    description: 'Discover internships, scholarships, and extracurricular activities to enrich your academic journey.',
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-50',
    delay: 0.4,
  },
];

const FeatureCard = ({ feature }: { feature: typeof features[0] }) => {
  
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
              repeatDelay: 3
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

          {/* Learn More Link */}
          <motion.div
            className="flex items-center text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            whileHover={{ x: 5 }}
          >
            <span className={`bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`}>
              Learn more
            </span>
            <ArrowRight className="ml-2 w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors duration-300" />
          </motion.div>
        </div>

        {/* Hover Effect Border */}
        <div className={`absolute inset-0 rounded-2xl border-2 border-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>
      </div>
    </motion.div>
  );
};

const WhatWeOffer: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section
      id="what-we-offer"
      ref={ref}
      className="relative py-20 lg:py-32 bg-gradient-to-br from-gray-50 to-white overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl"></div>
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
            <Sparkles className="w-4 h-4 mr-2" />
            What We Offer
          </motion.div>

          <motion.h2
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Comprehensive Tools for
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"> Academic Success</span>
          </motion.h2>

          <motion.p
            className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Everything you need for campus life—resources, networking, and opportunities—designed to enhance your university experience and accelerate your academic journey.
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <motion.button
            className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => document.getElementById('why-choose')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <span className="relative z-10 flex items-center">
              Explore All Features
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-purple-500 to-blue-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default WhatWeOffer;
