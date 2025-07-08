'use client';

import React from 'react';
import WhyChooseLeft from './WhyChooseLeft';
import WhyChooseRight from './WhyChooseRight';
import { COLORS } from '../../utils/color';

const WhyChooseIKnow: React.FC = () => (
	<section
		style={{
			width: '100%',
			background: COLORS.sectionBg,
			padding: '4rem 0',
			display: 'flex',
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'center',
			boxSizing: 'border-box',
			gap: '3rem',
		}}
	>
		<WhyChooseLeft />
		<WhyChooseRight />
		<style jsx>{`
			@media (max-width: 900px) {
				section {
					flex-direction: column !important;
				}
				section > div {
					max-width: 100% !important;
					width: 100% !important;
				}
			}
		`}</style>
	</section>
);

export default WhyChooseIKnow;
