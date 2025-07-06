import React from 'react';
import LoginHeader from './LoginHeader';
import LoginForm from './LoginForm';
import LoginFooter from './LoginFooter';

const LoginLayout: React.FC = () => (
  <div
    style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      padding: '2.5rem 1rem',
      background: '#f7f8fa',
      overflow: 'hidden',
    }}
  >
    {/* Background image with reduced opacity */}
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        width: '100vw',
        height: '100vh',
        background: `url('/background.png') center center / cover no-repeat`,
        opacity: 0.55,
      }}
    />
    {/* Weak 4318D1 gradient at the bottom */}
    <div
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        height: '180px',
        zIndex: 1,
        pointerEvents: 'none',
        background: 'linear-gradient(0deg, #4318D122 0%, transparent 100%)',
      }}
    />
    <div style={{
      width: '100%',
      maxWidth: 410,
      background: '#fff',
      borderRadius: 16,
      boxShadow: '0 4px 32px rgba(67,24,209,0.07)',
      padding: '2.5rem 1.5rem 2rem 1.5rem',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      zIndex: 2,
      position: 'relative',
    }}>
      <LoginHeader />
      <LoginForm />
    </div>
    <LoginFooter />
  </div>
);

export default LoginLayout;
