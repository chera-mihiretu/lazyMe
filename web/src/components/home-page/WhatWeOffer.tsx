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
			style={{
				width: '100%',
				background: COLORS.sectionBg,
				padding: '4rem 0',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				boxSizing: 'border-box',
			}}
		>
			<h2
				style={{
					fontSize: '2.2rem',
					fontWeight: 700,
					color: COLORS.primary,
					fontFamily: FONT_FAMILY.poppins,
					marginBottom: '1rem',
					textAlign: 'center',
				}}
			>
				What We Offer
			</h2>
			<p
				style={{
					fontSize: '1.15rem',
					color: COLORS.foreground,
					fontFamily: FONT_FAMILY.poppins,
					marginBottom: '2.5rem',
					maxWidth: 600,
					textAlign: 'center',
				}}
			>
				Comprehensive tools and resources designed to enhance your university
				experience and accelerate your academic success.
			</p>
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
					gap: '2rem',
					width: '90%',
					maxWidth: 1000,
				}}
			>
				{features.map((feature, idx) => (
					<div
						key={feature.title}
						style={{
							background: COLORS.cardBg,
							borderRadius: '1.25rem',
							boxShadow: 'none',
							padding: '2rem 1.5rem',
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							textAlign: 'center',
							borderTop: 'none', // Remove divider/shadow
							cursor: 'pointer',
							transition:
								'transform 0.2s, box-shadow 0.2s, background 0.2s',
						}}
						onMouseOver={e => {
							e.currentTarget.style.transform =
								'translateY(-8px) scale(1.04)';
							e.currentTarget.style.boxShadow =
								'0 4px 24px rgba(67,24,209,0.10)';
							e.currentTarget.style.background = '#fff';
						}}
						onMouseOut={e => {
							e.currentTarget.style.transform = 'none';
							e.currentTarget.style.boxShadow = 'none';
							e.currentTarget.style.background = COLORS.cardBg;
						}}
					>
						<div
							style={{
								width: 56,
								height: 56,
								marginBottom: '1rem',
								borderRadius: '50%',
								overflow: 'hidden',
								background: '#f0f0f7',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<Image
								src={`/what_we_offer/${feature.icon.replace(
									/\s+/g,
									'_'
								).toLowerCase()}.png`}
								alt={feature.title}
								width={40}
								height={40}
								style={{ objectFit: 'contain' }}
							/>
						</div>
						<h3
							style={{
								fontSize: '1.25rem',
								fontWeight: 600,
								color: '#171717',
								marginBottom: '0.5rem',
								fontFamily: FONT_FAMILY.poppins,
							}}
						>
							{feature.title}
						</h3>
						<p
							style={{
								fontSize: '1rem',
								color: COLORS.foreground,
								fontFamily: FONT_FAMILY.poppins,
								opacity: 0.85,
							}}
						>
							{feature.description}
						</p>
					</div>
				))}
			</div>
		</section>
	);
};

export default WhatWeOffer;
