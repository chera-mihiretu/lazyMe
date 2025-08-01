import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { COLORS } from '../../utils/color';
import Image from 'next/image';
import type { User as UserType } from '../../types/post';
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const UserAvatar: React.FC = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoading(true);
    setError(null);
    fetch(`${baseUrl}/users/me`, {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();
        const userData = data.me || data;
        setUser(userData); // support both {me: user} and user directly
        setLoading(false);
        if (userData && userData.is_complete === false) {
          router.push("/auth/complete-account");
        }
      })
      .catch((err) => {
        setUser(null);
        setError("Could not load user info: " + err.message);
        setLoading(false);
      });
  }, [router]);

  let avatarUrl = "/icons/avatar.png";
  if (user?.profile_image_url && typeof user.profile_image_url === "string" && user.profile_image_url.trim() !== "") {
    // If it's a relative path, ensure it starts with '/'
    if (user.profile_image_url.startsWith("http://") || user.profile_image_url.startsWith("https://")) {
      avatarUrl = user.profile_image_url;
    } else {
      avatarUrl = user.profile_image_url.startsWith("/") ? user.profile_image_url : `/${user.profile_image_url}`;
    }
  }
  const displayName = user?.name || user?.email || "User";

  if (loading) {
    return (
      <div
        className="w-[38px] h-[38px] rounded-full flex items-center justify-center shadow-[0_1px_4px_#e0e0e0]"
        style={{ background: COLORS.inputBg }}
        title="Loading user..."
      >
        <span className="text-[18px]" style={{ color: '#aaa' }}>...</span>
      </div>
    );
  }
  if (error) {
    return (
      <div
        className="w-[38px] h-[38px] rounded-full flex items-center justify-center shadow-[0_1px_4px_#e0e0e0]"
        style={{ background: '#ffeaea' }}
        title={error}
      >
        <span className="text-[18px]" style={{ color: '#e53e3e' }}>!</span>
      </div>
    );
  }
  return (
    
    <div
      title={displayName}
      className="w-[38px] h-[38px] rounded-full overflow-hidden flex items-center justify-center shadow-[0_1px_4px_#e0e0e0] cursor-pointer"
      style={{ background: COLORS.inputBg }}
    >
      <Image
        src={avatarUrl}
        alt={displayName}
        width={34}
        height={34}
        className="rounded-full"
      />
    </div>
  );
};


export default UserAvatar;
