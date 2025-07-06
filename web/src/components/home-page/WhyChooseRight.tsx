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
  <div
    style={{
      flex: 6,
      minWidth: 320,
      maxWidth: 600,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'center',
      padding: '0 1rem',
    }}
  >
    <h2
      style={{
        fontSize: '2rem',
        fontWeight: 700,
        color: COLORS.primary,
        fontFamily: FONT_FAMILY.poppins,
        marginBottom: '1rem',
      }}
    >
      Why Choose IKnow?
    </h2>
    <p
      style={{
        fontSize: '1.1rem',
        color: COLORS.foreground,
        fontFamily: FONT_FAMILY.poppins,
        marginBottom: '2rem',
      }}
    >
      IKnow is more than just a platform—it's your partner in academic and campus success. Discover a smarter, more connected way to thrive at university.
    </p>
    <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', margin: 0, width: '100%' }}>
      {benefits.map((b, i) => (
        <li key={b.title} style={{ marginBottom: '1.5rem', display: 'list-item', alignItems: 'flex-start' }}>
          <span style={{ fontWeight: 700, color: '#171717', fontSize: '1.1rem', fontFamily: FONT_FAMILY.poppins }}>{b.title}</span>
          <br />
          <span style={{ color: COLORS.foreground, fontSize: '1rem', fontFamily: FONT_FAMILY.poppins, marginTop: 4 }}>{b.description}</span>
        </li>
      ))}
    </ul>
    <a
      href="#about"
      style={{
        marginTop: '2rem',
        color: '#fff',
        background: COLORS.primary,
        borderRadius: '8px',
        padding: '0.75rem 2rem',
        fontWeight: 600,
        fontSize: '1rem',
        textDecoration: 'none',
        fontFamily: FONT_FAMILY.poppins,
        boxShadow: '0 2px 8px rgba(67,24,209,0.08)',
        transition: 'background 0.2s',
        display: 'inline-block',
      }}
      onMouseOver={e => (e.currentTarget.style.background = '#3413a6')}
      onMouseOut={e => (e.currentTarget.style.background = COLORS.primary)}
    >
      Learn More About Us
    </a>
  </div>
);

export default WhyChooseLeft;
