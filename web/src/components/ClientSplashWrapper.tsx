"use client";
import React from 'react';
import SplashScreen from './SplashScreen';

const ClientSplashWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showSplash, setShowSplash] = React.useState(true);
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1200); // Simulate loading, replace with real check
    return () => clearTimeout(timer);
  }, []);
  return showSplash ? <SplashScreen /> : <>{children}</>;
};

export default ClientSplashWrapper;
