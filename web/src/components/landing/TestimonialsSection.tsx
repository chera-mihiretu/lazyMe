'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { COLORS, FONT_FAMILY } from '../../utils/color';

const testimonials = [
	{
		text: 'IKnow helped me connect with peers and find resources I never knew existed. My academic life is so much easier now!',
		name: 'Alex Johnson',
		affiliation: 'Computer Science, ASTU',
		photo: '/my.png',
	},
	{
		text: 'The platform is intuitive and the opportunities section helped me land my first internship!',
		name: 'Sara Lee',
		affiliation: 'Business Administration, ASTU',
		photo: '/my.png',
	},
	{
		text: 'I love the campus announcements and networking features. IKnow is a must-have for every student.',
		name: 'Mohammed Ali',
		affiliation: 'Engineering, ASTU',
		photo: '/my.png',
	},
	{
		text: 'IKnow made it easy to find study groups and stay on top of campus events. Highly recommended!',
		name: 'Lina Tesfaye',
		affiliation: 'Medicine, ASTU',
		photo: '/my.png',
	},
	{
		text: 'The resources and peer networking features are a game changer for my studies.',
		name: 'Samuel Getachew',
		affiliation: 'Law, ASTU',
		photo: '/my.png',
	},
];

const TestimonialCard = ({ testimonial, animate }: { testimonial: typeof testimonials[0], animate: string }) => (
	<div
		style={{
			background: COLORS.cardBg,
			borderRadius: '1.5rem',
			boxShadow: '0 2px 16px rgba(67,24,209,0.07)',
			padding: '3.5rem 3.5rem 2.5rem 3.5rem', // More horizontal padding
			maxWidth: 800, // Expanded width
			minHeight: 340,
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			margin: '0 auto',
			position: 'relative',
			border: `1.5px solid #ececec`,
			transition: 'transform 0.5s cubic-bezier(.4,0,.2,1), opacity 0.5s cubic-bezier(.4,0,.2,1)',
			transform: animate === 'in' ? 'translateX(0)' : animate === 'left' ? 'translateX(-80px)' : 'translateX(80px)',
			opacity: animate === 'in' ? 1 : 0,
		}}
	>
		<span
			style={{
				fontSize: '2.5rem',
				color: COLORS.primary,
				position: 'absolute',
				top: 24,
				left: 32,
				opacity: 0.18,
			}}
		>
			&ldquo;
		</span>
		<p
			style={{
				fontSize: '1.25rem',
				fontStyle: 'italic',
				color: COLORS.foreground,
				fontFamily: FONT_FAMILY.poppins,
				marginBottom: '2rem',
				marginTop: '1.5rem',
				textAlign: 'center',
				lineHeight: 1.7,
			}}
		>
			{testimonial.text}
		</p>
		<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
			<div
				style={{
					width: 72,
					height: 72,
					borderRadius: '50%',
					overflow: 'hidden',
					marginBottom: 14,
					border: `2px solid ${COLORS.primary}22`,
				}}
			>
				<Image
					src={testimonial.photo}
					alt={testimonial.name}
					width={100}
					height={100}
					style={{ objectFit: 'cover' }}
				/>
			</div>
			<span
				style={{
					fontWeight: 700,
					color: '#171717',
					fontSize: '1.15rem',
					fontFamily: FONT_FAMILY.poppins,
				}}
			>
				{testimonial.name}
			</span>
			<span
				style={{
					color: COLORS.primary,
					fontSize: '1.02rem',
					fontFamily: FONT_FAMILY.poppins,
					opacity: 0.85,
				}}
			>
				{testimonial.affiliation}
			</span>
		</div>
	</div>
);

const TestimonialsSection: React.FC = () => {
	const [current, setCurrent] = useState(0);
	const [animate, setAnimate] = useState<'in' | 'left' | 'right'>('in');
	const total = testimonials.length;

	const goTo = (idx: number, direction: 'left' | 'right') => {
		setAnimate(direction);
		setTimeout(() => {
			setCurrent((idx + total) % total);
			setAnimate('in');
		}, 350);
	};

	return (
		<section
			style={{
				width: '100%',
				maxWidth: '100vw',
				background: COLORS.sectionBg,
				padding: '4rem 0',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				boxSizing: 'border-box',
				position: 'relative',
				margin: 0,
				left: 'unset',
				right: 'unset',
				marginLeft: 0,
				marginRight: 0,
			}}
		>
			<h2
				style={{
					fontSize: '2.2rem',
					fontWeight: 700,
					color: COLORS.primary,
					fontFamily: FONT_FAMILY.poppins,
					marginBottom: '0.5rem',
					textAlign: 'center',
				}}
			>
				What Our Students Say
			</h2>
			<p
				style={{
					fontSize: '1.1rem',
					color: COLORS.foreground,
					fontFamily: FONT_FAMILY.poppins,
					marginBottom: '1.5rem',
					textAlign: 'center',
					maxWidth: 600,
				}}
			>
				Real feedback from students who have experienced the power of IKnow firsthand
			</p>
			<hr
				style={{
					width: 80,
					border: 'none',
					borderTop: '2px solid #ececec',
					margin: '0 0 2.5rem 0',
				}}
			/>
			<div
				style={{
					width: '100%',
					maxWidth: 900, // expand the card container further
					minHeight: 340,
					position: 'relative',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<button
					aria-label="Previous testimonial"
					onClick={() => goTo(current - 1, 'left')}
					style={{
						position: 'absolute',
						left: 0,
						top: '50%',
						transform: 'translateY(-50%)',
						background: 'none',
						border: 'none',
						fontSize: '2rem',
						color: COLORS.primary,
						cursor: 'pointer',
						opacity: 0.7,
						zIndex: 2,
					}}
				>
					&#8592;
				</button>
				<TestimonialCard testimonial={testimonials[current]} animate={animate} />
				<button
					aria-label="Next testimonial"
					onClick={() => goTo(current + 1, 'right')}
					style={{
						position: 'absolute',
						right: 0,
						top: '50%',
						transform: 'translateY(-50%)',
						background: 'none',
						border: 'none',
						fontSize: '2rem',
						color: COLORS.primary,
						cursor: 'pointer',
						opacity: 0.7,
						zIndex: 2,
					}}
				>
					&#8594;
				</button>
			</div>
			<div style={{ display: 'flex', gap: 8, marginTop: 24 }}>
				{testimonials.map((_, idx) => (
					<span
						key={idx}
						onClick={() => goTo(idx, idx > current ? 'right' : 'left')}
						style={{
							width: 12,
							height: 12,
							borderRadius: '50%',
							background: idx === current ? COLORS.primary : '#d1d5db',
							display: 'inline-block',
							cursor: 'pointer',
							transition: 'background 0.2s',
						}}
					/>
				))}
			</div>
		</section>
	);
};

export default TestimonialsSection;
