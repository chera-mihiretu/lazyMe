import React from 'react';
import { FONT_FAMILY, COLORS } from '../../utils/color';

const LoginFooter: React.FC = () => (
  <footer style={{
    marginTop: '2.5rem',
    textAlign: 'center',
    color: COLORS.text,
    fontFamily: FONT_FAMILY.poppins,

    fontSize: '0.98rem',
    letterSpacing: 0.01,
  }}>
    © 2025 lazyME. Empowering your campus journey.
  </footer>
);

export default LoginFooter;
