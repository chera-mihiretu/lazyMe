
import HomeNavBar from "@/components/landing/home_nav_bar";
import HeroSection from "@/components/landing/HeroSection";
import WhatWeOffer from "@/components/landing/WhatWeOffer";
import WhyChooseIKnow from "@/components/landing/WhyChooseIKnow";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import AboutSection from "@/components/landing/AboutSection";
import RedirectIfLoggedIn from "./RedirectIfLoggedIn";
import UpcomingFeaturesSection from "@/components/landing/UpcomingFeaturesSection";

export default function Home() {
  return (
    <RedirectIfLoggedIn>
      <div>
        <HeroSection/>
        <WhatWeOffer/>
        <WhyChooseIKnow/>
        <UpcomingFeaturesSection/>
        <TestimonialsSection/>
        <AboutSection/>
      </div>
   </RedirectIfLoggedIn>
  );
}
