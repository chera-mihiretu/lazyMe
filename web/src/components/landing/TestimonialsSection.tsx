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
		className={`relative flex flex-col items-center mx-auto max-w-[800px] min-h-[340px] rounded-3xl border border-[#ececec] px-14 pt-14 pb-10 bg-white shadow-lg transition-all duration-500 ease-[cubic-bezier(.4,0,.2,1)] ${animate === 'in' ? 'translate-x-0 opacity-100' : animate === 'left' ? '-translate-x-20 opacity-0' : 'translate-x-20 opacity-0'}`}
		style={{ background: COLORS.cardBg }}
	>
		<span
			className="absolute top-6 left-8 text-[2.5rem] opacity-20"
			style={{ color: COLORS.primary }}
		>
			&ldquo;
		</span>
		<p className="text-[1.25rem] italic text-center leading-7 mb-8 mt-6 font-poppins" style={{ color: COLORS.foreground }}>
			{testimonial.text}
		</p>
		<div className="flex flex-col items-center">
			<div className="w-[72px] h-[72px] rounded-full overflow-hidden mb-3.5 border-2" style={{ borderColor: COLORS.primary + '22' }}>
				<Image
					src={testimonial.photo}
					alt={testimonial.name}
					width={100}
					height={100}
					className="object-cover"
				/>
			</div>
			<span className="font-bold text-[#171717] text-[1.15rem] font-poppins">{testimonial.name}</span>
			<span className="text-[1.02rem] font-poppins opacity-85" style={{ color: COLORS.primary }}>{testimonial.affiliation}</span>
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
			className="w-full max-w-[100vw] flex flex-col items-center box-border py-16 relative m-0"
			style={{ background: COLORS.sectionBg }}
		>
			<h2 className="text-[2.2rem] font-bold text-center mb-2 font-poppins" style={{ color: COLORS.primary }}>
				What Our Students Say
			</h2>
			<p className="text-[1.1rem] mb-6 max-w-[600px] text-center font-poppins" style={{ color: COLORS.foreground }}>
				Real feedback from students who have experienced the power of IKnow firsthand
			</p>
			<hr className="w-20 border-t-2 border-[#ececec] mb-10" />
			<div className="w-full max-w-[900px] min-h-[340px] relative flex items-center justify-center">
				<button
					aria-label="Previous testimonial"
					onClick={() => goTo(current - 1, 'left')}
					className="absolute left-0 top-1/2 -translate-y-1/2 bg-none border-none text-[2rem] cursor-pointer opacity-70 z-20"
					style={{ color: COLORS.primary }}
				>
					&#8592;
				</button>
				<TestimonialCard testimonial={testimonials[current]} animate={animate} />
				<button
					aria-label="Next testimonial"
					onClick={() => goTo(current + 1, 'right')}
					className="absolute right-0 top-1/2 -translate-y-1/2 bg-none border-none text-[2rem] cursor-pointer opacity-70 z-20"
					style={{ color: COLORS.primary }}
				>
					&#8594;
				</button>
			</div>
			<div className="flex gap-2 mt-6">
				{testimonials.map((_, idx) => (
					<span
						key={idx}
						onClick={() => goTo(idx, idx > current ? 'right' : 'left')}
						className={`w-3 h-3 rounded-full inline-block cursor-pointer transition-colors duration-200 ${idx === current ? 'bg-primary' : 'bg-gray-300'}`}
					/>
				))}
			</div>
		</section>
	);
};

export default TestimonialsSection;
