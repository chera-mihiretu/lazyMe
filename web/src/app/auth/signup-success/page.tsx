import React from 'react';

const SignupSuccess: React.FC = () => {
  return (
    <div style={{
      maxWidth: 540,
      margin: '60px auto',
      background: '#fff',
      borderRadius: 18,
      boxShadow: '0 4px 32px rgba(67,24,209,0.07)',
      padding: '2.5rem 2.2rem 2.2rem 2.2rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
    }}>
      <h2 style={{ color: '#4320d1', fontWeight: 700, marginBottom: 18 }}>Account Created!</h2>
      <p style={{ fontSize: '1.08rem', color: '#222', marginBottom: 18 }}>
        You have successfully created your account.<br />
        Please verify your email address to activate your account.
      </p>
      <p style={{ fontSize: '1.01rem', color: '#444', marginBottom: 18 }}>
        We have sent a verification email to your inbox.<br />
        <b>If you can&apos;t find it, please check your spam or junk folder.</b>
      </p>
      <div style={{ fontSize: '0.98rem', color: '#888' }}>
        After verifying, you can log in and start using your account.
      </div>
    </div>
  );
};

export default SignupSuccess;
