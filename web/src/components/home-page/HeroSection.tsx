import React from 'react';
import HeroLeft from './HeroLeft';
import HeroRight from './HeroRight';
import { COLORS } from '../../utils/color';

const HeroSection: React.FC = () => (
  <section style={{
    width: '100%', // Use 100% to fit the viewport, not 100vw
    minHeight: '100vh',
    height: '100vh',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f8f9fb',
    padding: 0,
    boxSizing: 'border-box',
    position: 'relative',
    overflow: 'hidden',
    maxWidth: '100vw', // Prevents overflow
  }}>
    <div style={{
      position: 'relative',
      zIndex: 1,
      display: 'flex',
      flex: 1,
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '5rem', // Add more space between left and right hero sections
    }}>
      <HeroLeft />
      <HeroRight />
    </div>
  </section>
);

export default HeroSection;
