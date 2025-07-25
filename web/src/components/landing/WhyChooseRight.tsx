import React from 'react';
import { COLORS, FONT_FAMILY } from '../../utils/color';

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
  <div className="flex-[6] min-w-[320px] max-w-[600px] flex flex-col items-start justify-center px-4">
    <h2
      className="text-2xl font-bold mb-4 font-poppins"
      style={{ color: COLORS.primary }}
    >
      Why Choose IKnow?
    </h2>
    <p
      className="text-[1.1rem] mb-8 font-poppins"
      style={{ color: COLORS.foreground }}
    >
      IKnow is more than just a platform—it's your partner in academic and campus success. Discover a smarter, more connected way to thrive at university.
    </p>
    <ul className="list-disc pl-6 m-0 w-full">
      {benefits.map((b, i) => (
        <li key={b.title} className="mb-6 list-item flex flex-col items-start">
          <span className="font-bold text-[1.1rem] font-poppins text-[#171717]">{b.title}</span>
          <span className="text-[1rem] font-poppins mt-1" style={{ color: COLORS.foreground }}>{b.description}</span>
        </li>
      ))}
    </ul>
    <a
      href="#about"
      className="mt-8 text-white rounded-lg px-8 py-3 font-semibold text-base no-underline font-poppins shadow-md transition-colors inline-block"
      style={{ background: COLORS.primary }}
      onMouseOver={e => (e.currentTarget.style.background = '#3413a6')}
      onMouseOut={e => (e.currentTarget.style.background = COLORS.primary)}
    >
      Learn More About Us
    </a>
  </div>
);

export default WhyChooseLeft;
