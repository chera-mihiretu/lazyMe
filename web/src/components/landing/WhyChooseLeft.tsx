import React from 'react';
import Image from 'next/image';

const WhyChooseLeft: React.FC = () => (
  <div className="flex-[4] min-w-[240px] max-w-[600px] flex items-center justify-center relative px-4">
    <div className="w-full max-w-[500px] aspect-[4/3] rounded-2xl overflow-hidden bg-[#e9eaf3] shadow-lg relative flex items-center justify-center">
      <Image
        src="/whyus/image.jpeg"
        alt="Students using IKnow platform"
        fill
        className="object-cover"
      />
      {/* Optional decorative element */}
      <div className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-primary/10 z-[2]" />
    </div>
  </div>
);

export default WhyChooseLeft;
