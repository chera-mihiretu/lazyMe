'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Quote, Users, ArrowRight, Sparkles } from 'lucide-react';

const testimonials = [
	{
    text: 'IKnow is a thoughtfully designed and efficiently developed system that saves you significant time by eliminating the need to search across various social media platforms for a single resource. Its well-organized structure makes it nearly impossible to lose track of what you need!',
		name: 'Chera Mihiretu',
    affiliation: 'Software Engineering Student, ASTU',
		photo: '/my.png',
    rating: 5,
    course: 'Software Engineering',
    year: '5th Year',
  },
  {
    text: 'I\'ve always wanted to share opportunities with students globally, and now I can do so effortlessly, ensuring the right students receive them. Additionally, connecting and sharing ideas with fellow students is one of the most rewarding experiences.',
    name: 'Tamirat Kebede',
    affiliation: 'Software Engineering Student, ASTU',
    photo: '/testimonials/tamirat.jpg',
    rating: 5,
    course: 'Software Engineering',
    year: '5th Year',
  },
  {
    text: 'Connecting with others who share your life and career interests is always exciting, as it simplifies finding what people in your field are discovering. IKnow makes this seamless by helping you connect with like-minded individuals in your industry.',
    name: 'Abenezer Terefe',
    affiliation: 'Civil Engineering Student, ASTU',
    photo: '/testimonials/abenezer.jpg',
    rating: 5,
    course: 'Civil Engineering',
    year: '4th Year',
  },
];

const TestimonialCard = ({ testimonial, isActive }: { testimonial: typeof testimonials[0], isActive: boolean }) => {
  return (
    <motion.div
      className={`relative bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 xl:p-12 shadow-2xl border border-gray-100 overflow-hidden ${
        isActive ? 'scale-100 opacity-100' : 'scale-95 opacity-70'
      } transition-all duration-500`}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-blue-50/50"></div>
      
      {/* Quote Icon */}
      <motion.div
        className="absolute top-3 sm:top-4 lg:top-6 left-4 sm:left-6 lg:left-8 text-purple-200"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <Quote className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12" />
      </motion.div>

      <div className="relative z-10">
        {/* Rating Stars */}
        <motion.div
          className="flex items-center mb-4 sm:mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {[...Array(testimonial.rating)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.1, duration: 0.3 }}
            >
              <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current" />
            </motion.div>
          ))}
          <span className="ml-2 text-xs sm:text-sm text-gray-600 font-medium">5.0</span>
        </motion.div>

        {/* Testimonial Text */}
        <motion.p
          className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-700 leading-relaxed mb-6 sm:mb-8 font-medium italic"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          &quot;{testimonial.text}&quot;
        </motion.p>

        {/* User Info */}
        <motion.div
          className="flex items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <div className="relative">
            <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full overflow-hidden border-2 sm:border-3 lg:border-4 border-white shadow-lg">
              <div className="w-full h-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center">
                <span className="text-white font-bold text-sm sm:text-base lg:text-lg">
                  {testimonial.name.split(' ').map(n => n[0]).join('')}
		</span>
              </div>
            </div>
            <motion.div
              className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
            </motion.div>
			</div>

          <div className="ml-3 sm:ml-4">
            <h4 className="font-bold text-gray-900 text-sm sm:text-base lg:text-lg">{testimonial.name}</h4>
            <p className="text-purple-600 font-medium text-xs sm:text-sm">{testimonial.affiliation}</p>
            <div className="flex items-center mt-1 gap-1 sm:gap-2">
              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                {testimonial.course}
              </span>
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                {testimonial.year}
              </span>
		</div>
	</div>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-2 sm:top-4 right-2 sm:right-4 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-200/20 to-blue-200/20 rounded-full blur-xl"></div>
      <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-xl"></div>
    </motion.div>
  );
};

const TestimonialsSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
	};

	return (
		<section
      id="testimonials"
      ref={ref}
      className="relative py-12 sm:py-16 lg:py-20 xl:py-32 bg-gradient-to-br from-gray-50 to-white overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-64 sm:h-64 lg:w-96 lg:h-96 bg-purple-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 sm:w-56 sm:h-56 lg:w-80 lg:h-80 bg-blue-200/20 rounded-full blur-3xl"></div>
        
        {/* Floating Testimonial Bubbles - Hidden on mobile */}
        <motion.div
          className="hidden sm:block absolute top-20 right-20 bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-200"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="flex items-center text-sm">
            <Star className="w-4 h-4 text-yellow-400 mr-1" />
            <span className="font-medium text-gray-700">4.9/5 Rating</span>
          </div>
        </motion.div>

        <motion.div
          className="hidden sm:block absolute bottom-20 left-20 bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-200"
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="flex items-center text-sm">
            <Users className="w-4 h-4 text-purple-500 mr-1" />
            <span className="font-medium text-gray-700">10k+ Students</span>
          </div>
        </motion.div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 text-xs sm:text-sm font-medium mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
            Student Success Stories
          </motion.div>

          <motion.h2
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight px-2"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            What Our Students
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"> Are Saying</span>
          </motion.h2>

          <motion.p
            className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-2"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Real feedback from students who have experienced the transformative power of IKnow firsthand.
          </motion.p>
        </motion.div>

        {/* Testimonial Carousel */}
        <motion.div
          className="relative max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          {/* Navigation Buttons */}
				<button
            onClick={prevTestimonial}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:text-purple-600 hover:bg-white transition-all duration-300 group"
					aria-label="Previous testimonial"
				>
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 group-hover:-translate-x-0.5 transition-transform duration-300" />
				</button>

				<button
            onClick={nextTestimonial}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:text-purple-600 hover:bg-white transition-all duration-300 group"
					aria-label="Next testimonial"
				>
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 group-hover:translate-x-0.5 transition-transform duration-300" />
				</button>

          {/* Testimonial Cards */}
          <div className="px-8 sm:px-12 lg:px-16">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <TestimonialCard testimonial={testimonials[currentIndex]} isActive={true} />
              </motion.div>
            </AnimatePresence>
			</div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-6 sm:mt-8 space-x-2 sm:space-x-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToTestimonial(index)}
                className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-purple-600 scale-125'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
					/>
				))}
          </div>

          {/* Auto-play indicator */}
          <div className="flex justify-center mt-3 sm:mt-4">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className={`text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-full transition-all duration-300 ${
                isAutoPlaying
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {isAutoPlaying ? 'Auto-playing' : 'Paused'}
            </button>
          </div>
        </motion.div>

        

        {/* CTA Button */}
        <motion.div
          className="text-center mt-8 sm:mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 1.1, duration: 0.6 }}
        >
          <motion.button
            className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 text-sm sm:text-base"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <span className="relative z-10 flex items-center">
              Join Thousands of Students
              <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-purple-500 to-blue-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </motion.button>
        </motion.div>
			</div>
		</section>
	);
};

export default TestimonialsSection;
