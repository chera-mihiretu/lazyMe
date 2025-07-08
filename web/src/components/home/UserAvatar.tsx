import React from 'react';
import { COLORS, FONT_FAMILY } from '../../utils/color';
import Image from 'next/image';

const UserAvatar: React.FC = () => (
  <div style={{
    width: 38,
    height: 38,
    borderRadius: '50%',
    overflow: 'hidden',
    background: COLORS.inputBg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 1px 4px #e0e0e0',
    cursor: 'pointer',
  }}>
    <Image
      src="/window.svg"
      alt="User Avatar"
      width={34}
      height={34}
      style={{ borderRadius: '50%' }}
    />
  </div>
);

export default UserAvatar;
