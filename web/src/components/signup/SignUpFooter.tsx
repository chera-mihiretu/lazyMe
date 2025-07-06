import React from 'react';
import { FONT_FAMILY } from '../../utils/color';

const SignUpFooter: React.FC = () => (
  <footer style={{
    marginTop: '2.5rem',
    textAlign: 'center',
    color: '#b0b0b0',
    fontFamily: FONT_FAMILY.poppins,
    fontSize: '0.98rem',
    letterSpacing: 0.01,
  }}>
    © 2025 iKnow. Empowering your campus journey.
  </footer>
);

export default SignUpFooter;
