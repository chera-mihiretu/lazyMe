'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ArrowRight, 
  Mail, 
  Phone, 
  MapPin, 
  Twitter, 
  Facebook, 
  Linkedin, 
  Instagram,
  Heart,
  Sparkles,
  Users,
  BookOpen,
  Target,
  Award
} from 'lucide-react';

const stats = [
  { icon: Users, number: '10,000+', label: 'Students Empowered' },
  { icon: BookOpen, number: '500+', label: 'Universities Connected' },
  { icon: Target, number: '99.9%', label: 'Platform Uptime' },
  { icon: Award, number: '4.9/5', label: 'User Satisfaction' },
];

const socialLinks = [
  { icon: Twitter, href: 'https://twitter.com/iknow', label: 'Twitter', color: 'hover:text-blue-400' },
  { icon: Facebook, href: 'https://facebook.com/iknow', label: 'Facebook', color: 'hover:text-blue-600' },
  { icon: Linkedin, href: 'https://linkedin.com/company/iknow', label: 'LinkedIn', color: 'hover:text-blue-700' },
  { icon: Instagram, href: 'https://instagram.com/iknow', label: 'Instagram', color: 'hover:text-pink-600' },
];

const footerLinks = [
  {
    title: 'Product',
    links: [
      { name: 'Features', href: '#what-we-offer' },
      { name: 'Updates', href: '#upcoming-features' },
    ]
  },
  {
    title: 'Company',
    links: [
      { name: 'About Us', href: '#about' },
      { name: 'Careers', href: '#careers' },
      { name: 'Contact', href: '#contact' },
    ]
  },
  {
    title: 'Support',
    links: [
      { name: 'Help Center', href: '#help' },
      { name: 'Community', href: '#community' },
      { name: 'Documentation', href: '#docs' },
    ]
  },
  {
    title: 'Legal',
    links: [
      { name: 'Privacy Policy', href: '#privacy' },
      { name: 'Terms of Service', href: '#terms' },
    ]
  },
];

const AboutSection: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
  <section
      id="about"
      ref={ref}
      className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/30 via-slate-900/50 to-slate-900"></div>
        
        {/* Animated Particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => {
            // Use deterministic positions based on index to avoid hydration mismatch
            const left = (i * 17 + 23) % 100; // Pseudo-random but deterministic
            const top = (i * 31 + 47) % 100;  // Pseudo-random but deterministic
            const duration = 3 + (i % 3); // Deterministic duration variation
            const delay = (i % 4) * 0.5; // Deterministic delay variation
            
            return (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white/20 rounded-full"
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                }}
                animate={{
                  y: [0, -100, 0],
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
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:100px_100px]"></div>
      </div>

      <div className="relative z-10">
        {/* Main About Content */}
        <div className="container mx-auto px-6 py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            {/* Logo and Badge */}
            <motion.div
              className="flex flex-col items-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.div
                className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-medium mb-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <Sparkles className="w-4 h-4 mr-2 text-yellow-400" />
                About IKnow
              </motion.div>

              {/* Logo */}
              <motion.div
                className="relative mb-8"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl">
                  <BookOpen className="w-10 h-10 text-white" />
    </div>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-blue-500/30 rounded-2xl blur-xl transform rotate-6 scale-110"></div>
              </motion.div>
            </motion.div>

    {/* Mission Statement */}
            <motion.div
              className="mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <motion.h2
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                Empowering Students to
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"> Succeed</span>
              </motion.h2>

              <motion.p
                className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                At IKnow, we believe every student deserves access to the tools and connections they need to thrive in their academic journey and beyond. We're building the future of campus life, one connection at a time.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 0.7, duration: 0.8 }}
              >
                <Link href="/auth/login">
                  <motion.button
                    className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="relative z-10 flex items-center">
                      Start Your Journey
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-purple-500 to-blue-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </motion.button>
      </Link>

                <motion.button
                  className="group flex items-center px-8 py-4 text-white border border-white/30 rounded-xl backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Mail className="mr-2 w-5 h-5" />
                  Contact Us
                </motion.button>
              </motion.div>
            </motion.div>

          </div>
    </div>

        {/* Footer */}
        <footer className="border-t border-white/10 bg-black/20 backdrop-blur-sm">
          <div className="container mx-auto px-6 py-16">
            {/* Footer Links Grid */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              {footerLinks.map((section, index) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ delay: 1.3 + index * 0.1, duration: 0.6 }}
                >
                  <h3 className="text-white font-semibold mb-4">{section.title}</h3>
                  <ul className="space-y-2">
                    {section.links.map((link) => (
                      <li key={link.name}>
                        <a
                          href={link.href}
                          className="text-gray-400 hover:text-white transition-colors duration-300 text-sm"
                        >
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </motion.div>

            {/* Social Links */}
            <motion.div
              className="flex justify-center space-x-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 1.4, duration: 0.6 }}
            >
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
        target="_blank"
        rel="noopener noreferrer"
                    className={`w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 ${social.color} transition-all duration-300 border border-white/20`}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                );
              })}
            </motion.div>

            {/* Contact Info */}
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 1.5, duration: 0.6 }}
            >
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8 text-gray-400 text-sm">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  lazymesup@gmail.com
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  +251 96 859 0369
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Ethiopia, Adama
                </div>
              </div>
            </motion.div>

            {/* Bottom Bar */}
            <motion.div
              className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center text-gray-400 text-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 1.6, duration: 0.6 }}
            >
              <div className="flex items-center mb-4 sm:mb-0">
                <span>© 2024 IKnow. All rights reserved.</span>
    </div>
              <div className="flex items-center">
                <span>Made with</span>
                <motion.div
                  className="mx-1"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <Heart className="w-4 h-4 text-red-500" />
                </motion.div>
                <span>for students worldwide</span>
              </div>
            </motion.div>
          </div>
    </footer>
      </div>
  </section>
);
};

export default AboutSection;
