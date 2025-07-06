import React from 'react';
import Image from 'next/image';
import { COLORS, FONT_FAMILY } from '../../utils/color';

const LoginHeader: React.FC = () => (
  <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 18 }}>
      <Image src="/logos/logo-real.png" alt="IKnow Logo" width={80} height={80} style={{ marginBottom: 8 }} />
      <span style={{
        fontFamily: FONT_FAMILY.poppins,
        fontWeight: 700,
        fontSize: '2rem',
        color: COLORS.primary,
        letterSpacing: 1.5,
      }}>lazyME</span>
    </div>
    <h2 style={{
      fontFamily: FONT_FAMILY.poppins,
      fontWeight: 700,
      fontSize: '1.6rem',
      color: COLORS.foreground,
      margin: 0,
    }}>Welcome Back</h2>
    <p style={{
      fontFamily: FONT_FAMILY.poppins,
      color: COLORS.text,
      fontSize: '1.05rem',
      marginTop: 8,
      marginBottom: 0,
    }}>
      Sign in to continue your campus journey
    </p>
  </div>
);

export default LoginHeader;
