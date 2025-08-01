'use client';

import React from 'react';
import Button from './Button';
import { COLORS, FONT_FAMILY } from '../../utils/color';

const HeroLeft: React.FC = () => (
  <div
    style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-start',
      padding: '2rem 0',
      minWidth: 0,
      maxWidth: 540,
      width: '100%',
    }}
  >
    <h1
      style={{
        fontSize: '2.1rem',
        fontWeight: 700,
        color: COLORS.white,
        fontFamily: FONT_FAMILY.poppins,
        marginBottom: '1rem',
        lineHeight: 1.15,
      }}
      className="md:text-[2.5rem] text-[1.6rem]"
    >
      Campus Journey with IKnow
    </h1>
    <p
      style={{
        fontSize: '1rem',
        color: COLORS.white,
        marginBottom: '1.2rem',
        fontWeight: 400,
        lineHeight: 1.6,
        fontFamily: FONT_FAMILY.poppins,
      }}
      className="md:text-[1.15rem] text-[0.95rem]"
    >
      Connect with resources, opportunities, and peers in one comprehensive platform designed specifically for university students. Transform your academic experience today.
    </p>

    <div style={{ display: 'flex', gap: '0.7rem' }}>
      <Button
        as="a"
        href="auth/login"
        style={{
          fontSize: '1rem',
          padding: '0.7rem 1.2rem',
          borderRadius: '0.7rem',
        }}
        className="md:text-base text-sm md:px-6 md:py-3 px-4 py-2"
      >
        Get Started Free
      </Button>
      <Button
        as="a"
        href="#what-we-offer"
        style={{
          background: '#fff',
          color: COLORS.primary,
          border: `2px solid ${COLORS.primary}`,
          fontWeight: 600,
          fontSize: '1rem',
          padding: '0.7rem 1.2rem',
          borderRadius: '0.7rem',
        }}
        className="md:text-base text-sm md:px-6 md:py-3 px-4 py-2"
      >
        Learn More
      </Button>
    </div>
  </div>
);

export default HeroLeft;
