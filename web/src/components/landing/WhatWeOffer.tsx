'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { COLORS, FONT_FAMILY } from '../../utils/color';

const features = [
	{
		icon: 'Campus Announcements',
		title: 'Campus Announcements',
		description:
			'Stay updated with real-time campus news, events, and important announcements tailored for you.',
	},
	{
		icon: 'Study Resources',
		title: 'Study Resources',
		description:
			'Access curated study materials, notes, and guides to boost your academic performance.',
	},
	{
		icon: 'Peer Networking',
		title: 'Peer Networking',
		description:
			'Connect with fellow students, join study groups, and expand your university network.',
	},
	{
		icon: 'Opportunities',
		title: 'Opportunities',
		description:
			'Discover internships, scholarships, and extracurricular activities to enrich your journey.',
	},
];

const WhatWeOffer: React.FC = () => {
	useEffect(() => {
		if (typeof window !== 'undefined') {
			// Enable smooth scroll globally for anchor links
			document.documentElement.style.scrollBehavior = 'smooth';
			// Optionally, handle hashchange for browsers that don't animate by default
			const onHashChange = () => {
				if (window.location.hash === '#what-we-offer') {
					const el = document.getElementById('what-we-offer');
					if (el) {
						el.scrollIntoView({ behavior: 'smooth', block: 'start' });
					}
				}
			};
			window.addEventListener('hashchange', onHashChange);
			return () => window.removeEventListener('hashchange', onHashChange);
		}
	}, []);

	return (
		<section
			id="what-we-offer"
			className="w-full flex flex-col items-center box-border py-16"
			style={{ background: COLORS.sectionBg }}
		>
			<h2 className="text-[2.2rem] font-bold text-center mb-4 font-poppins" style={{ color: COLORS.primary }}>
				What We Offer
			</h2>
			<p className="text-[1.15rem] mb-10 max-w-[600px] text-center font-poppins" style={{ color: COLORS.foreground }}>
				Comprehensive tools and resources designed to enhance your university experience and accelerate your academic success.
			</p>
	  		<div className="grid w-[95%] max-w-[1400px] gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
				{features.map((feature, idx) => (
					<div
						key={feature.title}
						className="bg-white rounded-xl shadow-none p-8 flex flex-col items-center text-center cursor-pointer transition-transform hover:-translate-y-2 hover:scale-[1.04] hover:shadow-lg hover:bg-white"
					>
						<div className="w-14 h-14 mb-4 rounded-full overflow-hidden bg-[#f0f0f7] flex items-center justify-center">
							<Image
								src={`/what_we_offer/${feature.icon.replace(/\s+/g, '_').toLowerCase()}.png`}
								alt={feature.title}
								width={40}
								height={40}
								style={{ objectFit: 'contain' }}
							/>
						</div>
						<h3 className="text-[1.25rem] font-semibold text-[#171717] mb-2 font-poppins">
							{feature.title}
						</h3>
						<p className="text-[1rem] opacity-85 font-poppins" style={{ color: COLORS.foreground }}>
							{feature.description}
						</p>
					</div>
				))}
			</div>
		</section>
	);
};

export default WhatWeOffer;
