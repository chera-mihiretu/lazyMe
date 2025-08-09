
'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Shield, Layers, Users, CheckCircle, Star, ArrowRight, Sparkles } from 'lucide-react';
import Image from 'next/image';

const benefits = [
  {
    icon: Layers,
    title: 'All-in-One Platform',
    description: 'Everything you need for campus life—resources, networking, and opportunities—seamlessly integrated in one powerful platform.',
    features: ['Unified Dashboard', 'Cross-Platform Sync', 'Smart Notifications'],
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Users,
    title: 'Student-Centric Design',
    description: 'Built with real student feedback and designed for the modern university experience with intuitive, user-friendly interfaces.',
    features: ['User Research Based', 'Mobile-First Design', 'Accessibility Focus'],
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Shield,
    title: 'Trusted & Secure',
    description: 'Your data and privacy are protected with industry-leading security measures and transparent privacy policies.',
    features: ['Secure', 'GDPR Compliant', 'Reliable'],
    color: 'from-green-500 to-emerald-500',
  }
];

const stats = [
  { number: 'Multiple', label: 'Universities', icon: Star },
  { number: '4.9/5', label: 'User Rating', icon: Star },
];

const WhyChooseIKnow: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
   <section
      id="why-choose"
      ref={ref}
      className="relative py-20 lg:py-32 bg-white overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-50/50 to-blue-50/50"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-200/20 to-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/6 w-80 h-80 bg-gradient-to-r from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Header */}
            <div>
              <motion.div
                className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 text-sm font-medium mb-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Why Choose IKnow?
              </motion.div>

              <motion.h2
                className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                Your Partner in
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"> Academic Success</span>
              </motion.h2>

              <motion.p
                className="text-lg text-gray-600 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                IKnow is more than just a platform—it's your comprehensive companion for university life. Discover a smarter, more connected way to thrive in your academic journey.
              </motion.p>
            </div>

            {/* Benefits List */}
            <div className="space-y-8">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <motion.div
                    key={benefit.title}
                    className="group relative"
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
                  >
                    <div className="flex items-start space-x-4">
                      <motion.div
                        className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${benefit.color} p-3 shadow-lg`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Icon className="w-full h-full text-white" />
                      </motion.div>

                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-gray-800 transition-colors duration-300">
                          {benefit.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed mb-3">
                          {benefit.description}
                        </p>
                        
                        {/* Feature Tags */}
                        <div className="flex flex-wrap gap-2">
                          {benefit.features.map((feature, featureIndex) => (
                            <span
                              key={featureIndex}
                              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200"
                            >
                              <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <motion.button
                className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => document.getElementById('upcoming-features')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <span className="relative z-10 flex items-center">
                  Start Your Journey
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-purple-500 to-blue-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Content - Visual */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            {/* Main Visual Container */}
            <div className="relative">
              {/* Central Platform Mockup */}
              <motion.div
                className="relative bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl border border-gray-200 p-8 overflow-hidden"
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg"></div>
                    <span className="font-semibold text-gray-800">IKnow Dashboard</span>
                  </div>
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg mx-auto mb-2"></div>
                    <p className="text-sm font-medium text-blue-800">Announcements</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 text-center">
                    <div className="w-8 h-8 bg-purple-500 rounded-lg mx-auto mb-2"></div>
                    <p className="text-sm font-medium text-purple-800">Study Groups</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center">
                    <div className="w-8 h-8 bg-green-500 rounded-lg mx-auto mb-2"></div>
                    <p className="text-sm font-medium text-green-800">Resources</p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 text-center">
                    <div className="w-8 h-8 bg-orange-500 rounded-lg mx-auto mb-2"></div>
                    <p className="text-sm font-medium text-orange-800">Opportunities</p>
                  </div>
                </div>

                {/* Bottom Bar */}
                <div className="bg-gray-100 rounded-xl p-3 flex justify-between items-center">
                  <span className="text-sm text-gray-600">All-in-one platform</span>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  </div>
                </div>

                {/* Background Decoration */}
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-purple-200/30 to-blue-200/30 rounded-full blur-2xl"></div>
              </motion.div>

              {/* Floating Stats Cards */}
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    className="absolute bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-100"
                    style={{
                      top: `${20 + index * 15}%`,
                      right: index % 2 === 0 ? '-15%' : 'auto',
                      left: index % 2 === 1 ? '-15%' : 'auto',
                    }}
                    animate={{ 
                      y: [0, -10, 0],
                      rotate: [0, 2, 0]
                    }}
                    transition={{ 
                      duration: 3 + index,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-5 h-5 text-purple-500" />
                      <div>
                        <p className="font-bold text-gray-900">{stat.number}</p>
                        <p className="text-xs text-gray-600">{stat.label}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-3xl blur-3xl transform rotate-3 scale-110 -z-10"></div>
            </div>
          </motion.div>
        </div>
      </div>
	</section>
);
};

export default WhyChooseIKnow;
