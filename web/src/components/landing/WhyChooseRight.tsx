import React from 'react';
import { COLORS } from '../../utils/color';

const benefits = [
  {
    title: 'All-in-One Platform',
    description: 'Everything you need for campus life—resources, networking, and opportunities—in one place.'
  },
  {
    title: 'Student-Centric Design',
    description: 'Built with real student feedback for a seamless, intuitive experience.'
  },
  {
    title: 'Trusted & Secure',
    description: 'Your data and privacy are protected with industry-leading security.'
  }
];

const WhyChooseLeft: React.FC = () => (
  <div className="flex-[6] min-w-[320px] max-w-[600px] flex flex-col items-center md:items-start justify-center px-4">
    <h2
      className="text-2xl font-bold mb-4 font-poppins text-center md:text-left"
      style={{ color: COLORS.primary }}
    >
      Why Choose IKnow?
    </h2>
    <p
      className="text-[1.1rem] mb-8 font-poppins text-center md:text-left"
      style={{ color: COLORS.foreground }}
    >
      IKnow is more than just a platform—it&apos;s your partner in academic and campus success. Discover a smarter, more connected way to thrive at university.
    </p>
    <ul className="space-y-6 w-full">
      {benefits.map((b) => (
      <li key={b.title} className="flex flex-col items-center md:items-start text-center md:text-left">
        <h3 className="text-lg font-semibold font-poppins text-gray-900">{b.title}</h3>
        <p className="text-base font-poppins mt-2 text-gray-700">{b.description}</p>
      </li>
      ))}
    </ul>
    
  </div>
);

export default WhyChooseLeft;
