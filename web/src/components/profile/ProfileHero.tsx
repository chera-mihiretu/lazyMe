import React from "react";
import Image from "next/image";

export interface ProfileHeroProps {
  name: string;
  email: string;
  profile_image_url?: string;
  school?: string;
  department?: string;
  acedemic_year?: number;
  follow_count?: number;
  blue_badge?: boolean;
}

const ProfileHero: React.FC<ProfileHeroProps> = ({
  name,
  email,
  profile_image_url,
  school,
  department,
  acedemic_year,
  follow_count,
  blue_badge,
}) => {
  return (
    <div className="bg-gradient-to-br from-[#f7f7fb] to-[#ececff] rounded-2xl shadow-[0_2px_16px_#4320d10a] p-8 flex flex-col items-center mb-8 font-poppins relative">
      <div className="relative mb-4">
        <Image
          src={profile_image_url || "/icons/avatar.png"}
          alt={name}
          width={96}
          height={96}
          className="rounded-full object-cover border-4 border-[#ececff] bg-[#ececff] shadow-lg"
        />
        {blue_badge && (
          <Image
            src="/icons/blue_badge.png"
            alt="Blue Badge"
            width={32}
            height={32}
            className="absolute bottom-0 right-0"
          />
        )}
      </div>
      <div className="text-[2rem] font-bold text-[#4320d1] mb-1 flex items-center gap-2">
        {name}
        {blue_badge && (
          <span className="ml-2 text-[#2563eb] text-lg">✔️</span>
        )}
      </div>
      <div className="text-[#888] text-lg mb-2">{email}</div>
      <div className="flex flex-wrap gap-4 justify-center mb-2">
        {school && <span className="bg-[#ececff] px-3 py-1 rounded-lg text-[#4320d1] font-semibold">{school}</span>}
        {department && <span className="bg-[#ececff] px-3 py-1 rounded-lg text-[#4320d1] font-semibold">{department}</span>}
        {acedemic_year !== undefined && acedemic_year > 0 && (
          <span className="bg-[#ececff] px-3 py-1 rounded-lg text-[#4320d1] font-semibold">Year {acedemic_year}</span>
        )}
      </div>
      <div className="flex gap-6 mt-2">
        <span className="text-[#4320d1] font-semibold text-lg">Followers: {follow_count ?? 0}</span>
      </div>
    </div>
  );
};

export default ProfileHero;
