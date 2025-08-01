import React from 'react';

import { COLORS } from '../../utils/color';

const Loading: React.FC = () => (
    <div className="flex justify-center items-center my-16 rounded-xl max-w-[900px] mx-auto px-6 font-poppins" style={{ minHeight: 120 }}>
        <div className="w-[60px] h-[60px] border-[8px] border-white/30 rounded-full animate-spin" style={{ borderTopColor: COLORS.primary }} />
    </div>
);

export default Loading;
