import HomeNavBar from "@/components/home-page/home_nav_bar";
import HeroSection from "@/components/home-page/HeroSection";
import WhatWeOffer from "@/components/home-page/WhatWeOffer";
import WhyChooseIKnow from "@/components/home-page/WhyChooseIKnow";
import TestimonialsSection from "@/components/home-page/TestimonialsSection";
import AboutSection from "@/components/home-page/AboutSection";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <HomeNavBar/>
      <HeroSection/>
      <WhatWeOffer/>
      <WhyChooseIKnow/>
      <TestimonialsSection/>
      <AboutSection/>
    </div>
  );
}
