import React from 'react';
import { COLORS, FONT_FAMILY } from '../../utils/color';
import Image from 'next/image';
const HeroRight: React.FC = () => (
  <div
    style={{
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      minWidth: 0,
      maxWidth: 540,
      width: '100%',
      height: 'auto',
    }}
  >
    <div style={{ width: '100%', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Image
        src="/logos/hero-image.png"
        alt="Students on campus"
        width={540}
        height={400}
        style={{
          width: '100%',
          height: 'auto',
          maxHeight: 260,
          objectFit: 'cover',
          borderRadius: '1.2rem',
          boxShadow: '0 4px 24px rgba(67,24,209,0.10)',
        }}
        className="md:max-h-[400px] max-h-[220px]"
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          bottom: '-10px',
          background: '#fff',
          color: COLORS.primary,
          borderRadius: '0.5rem',
          boxShadow: '0 8px 32px rgba(67,24,209,0.18)',
          padding: '0.5rem 0.8rem',
          fontWeight: 700,
          fontSize: '0.85rem',
          fontFamily: FONT_FAMILY.poppins,
          display: 'flex',
          alignItems: 'center',
          gap: '0.3rem',
          minWidth: 100,
        }}
        className="md:text-[1.15rem] text-[0.85rem] md:left-[-12px] md:translate-x-0"
      >
        <span style={{ fontSize: '1rem', fontWeight: 700 }}>ASTU</span>
        Join the community
      </div>
    </div>
  </div>
);

export default HeroRight;
