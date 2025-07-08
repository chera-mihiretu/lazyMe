'use client';

import React from 'react';
import Button from './Button';
import { COLORS, FONT_FAMILY } from '../../utils/color';

const HeroLeft: React.FC = () => (
  <div style={{
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: '2rem 0',
    minWidth: 320,
    maxWidth: 540,
  }}>
    <h1 style={{
      fontSize: '2.5rem',
      fontWeight: 700,
      color: COLORS.primary,
      fontFamily: FONT_FAMILY.poppins,
      marginBottom: '1rem',
      lineHeight: 1.15,
    }}>
      Campus Journey with IKnow
    </h1>
    <p style={{
      fontSize: '1.15rem',
      color: COLORS.foreground,
      marginBottom: '1.5rem',
      fontWeight: 400,
      lineHeight: 1.6,
      fontFamily: FONT_FAMILY.poppins,
    }}>
      Connect with resources, opportunities, and peers in one comprehensive platform designed specifically for university students. Transform your academic experience today.
    </p>

    <div style={{ display: 'flex', gap: '1rem' }}>
      <Button as="a" href="auth/login">
        Get Started Free
      </Button>
      <Button as="a" href="#what-we-offer" style={{
        background: '#fff',
        color: COLORS.primary,
        border: `2px solid ${COLORS.primary}`,
        fontWeight: 600,
      }}>
        Learn More
      </Button>
    </div>
  </div>
);

export default HeroLeft;
