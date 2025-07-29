import React from "react";

const features = [
  {
    icon: "/icons/validation.png",
    title: "Post & Job Validation through AI",
    description:
      "Our advanced AI will automatically review and validate posts and job listings, ensuring quality and relevance for all users.",
  },
  {
    icon: "/icons/schedule.png",
    title: "Well Arranged Schedules for All Courses",
    description:
      "Easily access and manage organized schedules for every course, helping you stay on top of your academic journey.",
  },
  {
    icon: "/icons/forecasting.png",
    title: "Exam Prediction",
    description:
      "Get smart predictions for upcoming exams based on your course progress and study patterns, so you can prepare more effectively.",
  },
  {
    icon: "/icons/search.png",
    title: "Well Arranged Search Engine for User and Post Material Search",
    description:
      "Quickly find users, posts, and study materials with our powerful and organized search engine designed for speed and accuracy.",
  },
];

const UpcomingFeaturesSection: React.FC = () => (
  <section className="bg-[#f7f8ff] py-16 px-4 sm:px-8">
    <div className="max-w-7xl mx-auto text-center">
      <h2 className="text-3xl sm:text-4xl font-bold text-[#4320d1] mb-6">Upcoming Features</h2>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 mt-8">
        {features.map((feature, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center">
            <img src={feature.icon} alt={feature.title} className="w-14 h-14 mb-4" />
            <h3 className="text-xl font-semibold text-[#4320d1] mb-2">{feature.title}</h3>
            <p className="text-gray-700 text-base">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default UpcomingFeaturesSection;
