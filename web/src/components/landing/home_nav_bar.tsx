'use client';
import React from 'react'
import { COLORS } from '../../utils/color'
import Image from 'next/image'
import Button from './Button';

function HomeNavBar() {
  return (
    <nav style={{
      width: '100%',
      padding: '0 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '72px',
      position: 'relative',
      zIndex: 10,
    }}>
      {/* Logo on the left */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Image src="/logos/logo-real.png" alt="Logo" width={60} height={60} />
        <span style={{
          fontWeight: 700,
          fontSize: '1.5rem',
          marginLeft: '0.75rem',
          color: COLORS.primary,
          letterSpacing: '0.02em',
        }}>
          lazyME
        </span>
      </div>
      {/* Get Started Button on the right */}
      <Button as="a" href="/auth/login">
        Get Started
      </Button>
    </nav>
  )
}

export default HomeNavBar
