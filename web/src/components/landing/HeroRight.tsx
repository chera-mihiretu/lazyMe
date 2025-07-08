import React from 'react';
import { COLORS, FONT_FAMILY } from '../../utils/color';

const HeroRight: React.FC = () => (
  <div style={{
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    minWidth: 320,
    maxWidth: 540,
    height: 400,
  }}>
    <img
      src="/logos/hero-image.png"
      alt="Students on campus"
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        borderRadius: '1.5rem',
        boxShadow: '0 4px 24px rgba(67,24,209,0.10)',
      }}
    />
    <div style={{
      position: 'absolute',
      bottom: -32, // Move card outside the image
      left: -32,   // Move card outside the image
      background: '#fff',
      color: COLORS.primary,
      borderRadius: '1rem',
      boxShadow: '0 8px 32px rgba(67,24,209,0.18)',
      padding: '1rem 1.5rem',
      fontWeight: 700,
      fontSize: '1.15rem',
      fontFamily: FONT_FAMILY.poppins,
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      minWidth: 220,
      // Removed border
    }}>
      <span style={{ fontSize: '2rem', fontWeight: 700 }}>ASTU</span>
      Join the community
    </div>
  </div>
);

export default HeroRight;
