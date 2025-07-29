import React from 'react';
import HeroLeft from './HeroLeft';
import HeroRight from './HeroRight';
import { COLORS } from '../../utils/color';
import HomeNavBar from './home_nav_bar';

const HeroSection: React.FC = () => (
  <div className="inset-0 bg-cover bg-center"
      style={{ backgroundImage: "url('/lazy-slot.png')", opacity: 0.8 }}>
    <section
    className="w-full min-h-screen h-screen flex flex-row items-center justify-center p-0 box-border relative overflow-hidden max-w-[100vw]"
    style={{ background: "transparent" }}>

    {/* Blue darkish overlay to dim background image more */}
    <div className="absolute inset-0 bg-black opacity-50" />
    <div className="relative z-[1] flex flex-col md:flex-row flex-1 h-full items-center justify-center gap-8 md:gap-[5rem]">
      <HeroLeft />
      
      <HeroRight />
    </div>
  </section>
  </div >

);

export default HeroSection;
