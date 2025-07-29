
import React from 'react';
import SignUpHeader from './SignUpHeader';
import SignUpForm from './SignUpForm';
import SignUpFooter from './SignUpFooter';

const SignUpLayout: React.FC = () => (
  <div className="min-h-screen flex flex-col justify-center items-center relative py-10 px-4 bg-[#f7f8fa] overflow-hidden">
    {/* Background image with reduced opacity */}
    <div
      className="fixed inset-0 z-0 pointer-events-none w-screen h-screen opacity-55"
      style={{ background: `url('/background.png') center center / cover no-repeat` }}
    />
    {/* Weak 4318D1 gradient at the bottom */}
    <div
      className="fixed left-0 right-0 bottom-0 h-[180px] z-10 pointer-events-none"
      style={{ background: 'linear-gradient(0deg, #4318D122 0%, transparent 100%)' }}
    />
    <div className="w-full max-w-[440px] bg-white rounded-2xl shadow-lg px-6 pt-10 pb-8 mx-auto flex flex-col items-center z-20 relative">
      <SignUpHeader />
      <SignUpForm />
    </div>
    <SignUpFooter />
  </div>
);

export default SignUpLayout;
