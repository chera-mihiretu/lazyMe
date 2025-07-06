import React from 'react';
import Image from 'next/image';

const WhyChooseLeft: React.FC = () => (
  <div
    style={{
      flex: 4,
      minWidth: 240,
      maxWidth: 600, // Increased maxWidth for a bigger image
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      padding: '0 1rem',
    }}
  >
    <div style={{
      width: '100%',
      maxWidth: 500, // Increased maxWidth for the image container
      aspectRatio: '4/3',
      borderRadius: '1.5rem',
      overflow: 'hidden',
      background: '#e9eaf3',
      boxShadow: '0 4px 24px rgba(67,24,209,0.07)',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Image
        src="/whyus/image.jpeg"
        alt="Students using IKnow platform"
        fill
        style={{ objectFit: 'cover' }}
      />
      {/* Optional decorative element */}
      <div style={{
        position: 'absolute',
        bottom: 16,
        right: 16,
        width: 48,
        height: 48,
        borderRadius: '50%',
        background: 'rgba(67,24,209,0.10)',
        zIndex: 2,
      }} />
    </div>
  </div>
);

export default WhyChooseLeft;
