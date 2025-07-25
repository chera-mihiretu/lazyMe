
import HomeNavBar from "@/components/landing/home_nav_bar";
import HeroSection from "@/components/landing/HeroSection";
import WhatWeOffer from "@/components/landing/WhatWeOffer";
import WhyChooseIKnow from "@/components/landing/WhyChooseIKnow";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import AboutSection from "@/components/landing/AboutSection";
import RedirectIfLoggedIn from "./RedirectIfLoggedIn";

export default function Home() {
  return (
    <RedirectIfLoggedIn>
      <div>
        <HomeNavBar/>
        <HeroSection/>
        <WhatWeOffer/>
        <WhyChooseIKnow/>
        <TestimonialsSection/>
        <AboutSection/>
      </div>
   </RedirectIfLoggedIn>
  );
}
