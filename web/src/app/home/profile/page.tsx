"use client";

import HomeNavBar from "../../../components/home/HomeNavBar";
import ProtectedRoute from "@/app/ProtectedRoute";
import ProfileHero from "@/components/profile/ProfileHero";
import PostCard from "@/components/home/PostCard";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useUserPosts } from "@/hooks/useUserPosts";
import Image from "next/image";

const ProfilePage: React.FC = () => {
  const { user, loading: userLoading, error: userError } = useUserProfile();
  const { posts, loading: postsLoading, error: postsError } = useUserPosts(1);

  // Helper for animated stats
  const StatCard = ({ label, value }: { label: string; value: number | string }) => (
    <div className="bg-white/70 backdrop-blur-md px-5 py-2 rounded-xl shadow-lg flex flex-col items-center animate-fade-in-up">
      <span className="text-[#4320d1] font-bold text-lg">{value}</span>
      <span className="text-xs text-[#888] font-medium">{label}</span>
    </div>
  );

  return (
    <ProtectedRoute role="student">
      <div className="max-w-2xl mx-auto mt-8">
        {/* Hero Section */}
        <div className="relative mb-8">
          {/* Gradient Banner */}
          <div className="h-40 w-full rounded-3xl bg-gradient-to-tr from-[#4320d1] via-[#6a5cff] to-[#ececff] animate-gradient-move shadow-xl"></div>
          {/* Avatar Overlap */}
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-12 z-10">
            <div className="rounded-full border-4 border-white shadow-2xl p-1 bg-white animate-avatar-pop">
              <Image src={user?.profile_image_url || "/icons/avatar.png"} alt={user?.name || "User"} width={120} height={120} className="rounded-full object-cover" />
            </div>
          </div>
        </div>
        {/* User Info & Stats */}
        <div className="flex flex-col items-center mt-[-3rem] mb-6 animate-fade-in">
          <div className="flex items-center gap-2 mb-2 mt-16 z-10">
            <span className="text-3xl font-bold text-[#4320d1] drop-shadow-lg">{user?.name}</span>
            {user?.blue_badge && <span className="ml-2 text-[#2563eb] text-xl">✔️</span>}
          </div>
          <div className="text-[#888] text-lg mb-2 z-10">{user?.email}</div>
          <div className="flex flex-wrap gap-3 justify-center mb-2">
            {user?.school && <span className="bg-[#ececff] px-3 py-1 rounded-lg text-[#4320d1] font-semibold">{user.school}</span>}
            {user?.department && <span className="bg-[#ececff] px-3 py-1 rounded-lg text-[#4320d1] font-semibold">{user.department}</span>}
            {user?.acedemic_year !== undefined && user?.acedemic_year > 0 && (
              <span className="bg-[#ececff] px-3 py-1 rounded-lg text-[#4320d1] font-semibold">Year {user.acedemic_year}</span>
            )}
          </div>
          {/* Stats */}
          <div className="flex gap-6 mt-2">
            <div className="flex flex-row gap-2 w-full max-w-xl animate-fade-in-up justify-center">
              {/* Role Card */}
              <div className="flex flex-col items-center justify-center h-20 md:h-24 bg-white/70 backdrop-blur-md px-3 md:px-5 py-1.5 md:py-2 rounded-xl shadow-lg min-w-[80px] md:min-w-[120px]">
                {user?.is_teacher ? (
                  <div>
                    <span className="inline-flex items-center gap-2 text-[#4320d1] font-bold text-lg">
                      <Image src="/icons/teacher.png" alt="Teacher" width={24} height={24} />
                    </span>

                  </div>
                ) : (
                  <div>
                    <span className="inline-flex items-center gap-2 text-[#4320d1] font-bold text-lg">
                      <Image src="/icons/student.png" alt="Student" width={24} height={24} />
                    </span>

                  </div>
                )}
                <span className="text-xs text-[#888] font-medium mt-1">{user?.is_teacher ? 'Teacher' : 'Student'}</span>
              </div>
              {/* Followers Card */}
              <div className="flex flex-col items-center justify-center h-20 md:h-24 bg-white/70 backdrop-blur-md px-3 md:px-5 py-1.5 md:py-2 rounded-xl shadow-lg min-w-[80px] md:min-w-[120px]">
                <span className="text-[#4320d1] font-bold text-base md:text-lg">{user?.follow_count ?? 0}</span>
                <span className="text-xs text-[#888] font-medium mt-1">Followers</span>
              </div>
              {/* Academic Year Card */}
              <div className="flex flex-col items-center justify-center h-20 md:h-24 bg-white/70 backdrop-blur-md px-3 md:px-5 py-1.5 md:py-2 rounded-xl shadow-lg min-w-[80px] md:min-w-[120px]">
                <span className="text-[#4320d1] font-bold text-base md:text-lg">{user?.acedemic_year ?? '-'}</span>
                <span className="text-xs text-[#888] font-medium mt-1">Academic Year</span>
              </div>
            </div>
          </div>
          {/* Edit Profile Button */}
          <button className="mt-6 px-6 py-2 rounded-xl bg-gradient-to-r from-[#4320d1] to-[#6a5cff] text-white font-bold shadow-lg hover:scale-105 transition-transform animate-fade-in-up">Edit Profile</button>
        </div>
        {/* Posts Section */}
        <h3 className="font-bold text-2xl mb-4 text-[#4320d1] animate-fade-in">Posts</h3>
        {postsLoading ? (
          <div className="flex justify-center items-center py-12">
            <Image src="/icons/loading_spinner.svg" alt="Loading" width={40} height={40} className="animate-spin opacity-80" />
          </div>
        ) : postsError ? (
          <div className="text-error text-base mb-3 text-center">{postsError}</div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 animate-fade-in-up">
            <Image src="/icons/empty_state.png" alt="No posts" width={100} height={100} className="mb-6 opacity-80" />
            <div className="font-bold text-xl mb-2 text-[#4320d1]">No Posts Found</div>
            <div className="text-[#888] text-base mb-4">You haven't posted anything yet.</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up">
            {posts.map(post => <PostCard key={post.id} post={post} />)}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default ProfilePage;
