import React from 'react';
import HeroLeft from './HeroLeft';
import HeroRight from './HeroRight';
import { COLORS } from '../../utils/color';

const HeroSection: React.FC = () => (
  <section
    className="w-full min-h-screen h-screen flex flex-row items-center justify-center p-0 box-border relative overflow-hidden max-w-[100vw]"
    style={{ background: COLORS.sectionBg }}
  >
    <div className="relative z-[1] flex flex-1 h-full items-center justify-center gap-[5rem]">
      <HeroLeft />
      <HeroRight />
    </div>
  </section>
);

export default HeroSection;
