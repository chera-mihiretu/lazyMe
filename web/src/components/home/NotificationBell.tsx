import React from 'react';
import { COLORS } from '../../utils/color';
import Image from 'next/image';

const NotificationBell: React.FC = () => (
  <div style={{
    width: 36,
    height: 36,
    borderRadius: '50%',
    background: COLORS.inputBg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 1px 4px #e0e0e0',
    cursor: 'pointer',
    position: 'relative',
  }}>
    <Image src="/home/notification.png" alt="Notifications" width={22} height={22} />
    {/* You can add a red dot for unread notifications here if needed */}
  </div>
);

export default NotificationBell;
