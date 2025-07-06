import React from 'react';
import Image from 'next/image';
import { COLORS, FONT_FAMILY } from '../../utils/color';

const SignUpHeader: React.FC = () => (
  <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 18 }}>
      <Image src="/logos/logo-real.png" alt="IKnow Logo" width={48} height={48} style={{ marginBottom: 8 }} />
      <span style={{
        fontFamily: FONT_FAMILY.poppins,
        fontWeight: 700,
        fontSize: '2rem',
        color: COLORS.primary,
        letterSpacing: 1.5,
      }}>I Know</span>
    </div>
    <h2 style={{
      fontFamily: FONT_FAMILY.poppins,
      fontWeight: 700,
      fontSize: '1.6rem',
      color: COLORS.foreground,
      margin: 0,
    }}>Create Your Account</h2>
    <p style={{
      fontFamily: FONT_FAMILY.poppins,
      color: COLORS.muted,
      fontSize: '1.05rem',
      marginTop: 8,
      marginBottom: 0,
    }}>
      Join thousands of students on their campus journey
    </p>
  </div>
);

export default SignUpHeader;
