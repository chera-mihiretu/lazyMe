
'use client';

import React from 'react';
import WhyChooseLeft from './WhyChooseLeft';
import WhyChooseRight from './WhyChooseRight';
import { COLORS } from '../../utils/color';

const WhyChooseIKnow: React.FC = () => (
   <section
	 className="w-full flex flex-col md:flex-row items-center justify-center gap-12 py-16 box-border"
	 style={{ background: COLORS.sectionBg }}
   >
		<WhyChooseLeft />
		<WhyChooseRight />
		
	</section>
);

export default WhyChooseIKnow;
