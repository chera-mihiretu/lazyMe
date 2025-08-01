import React from "react";
import Image from "next/image";
interface UserCardProps {
  id: string;
  name: string;
  email: string;
  profile_image_url?: string;
  follow_count: number;
  acedemic_year: number;
}

const UserCard: React.FC<UserCardProps> = React.memo(({
  id,
  name,
  email,
  profile_image_url,
  follow_count,
  acedemic_year,
}) => {
  const [sent, setSent] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleConnect = async () => {
    if (sent || loading) return;
    setLoading(true);
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/connections/`, {
      method: "POST",
      headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({ connectee_id: id }),
    })
      .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to send connection request");
      }
      setSent(true);
      })
      .catch((e) => {
      console.log(e)
      })
      .finally(() => {
      setLoading(false);
      });
  };
  return (
    <div
      className="user-card-responsive flex flex-row items-center bg-[#f3f6fb] rounded-[18px] shadow-[0_2px_8px_rgba(0,0,0,0.06)] px-[2.5rem] py-[1.5rem] pr-[2.5rem] mb-[28px] min-w-[420px] max-w-[820px] w-full gap-[36px] border-[1.5px] border-[#e3e6ef] transition-[box-shadow,border] duration-200"
    >
      <Image
        src={profile_image_url || "/icons/avatar.png"}
        alt={name + " avatar"}
        width={64}
        height={64}
        className="rounded-full object-cover bg-[#f2f2f2] flex-shrink-0 mr-[18px]"
      />
      <div className="flex-1 flex flex-col gap-[8px]">
        <div className="flex items-center justify-between w-full">
          <span className="font-bold text-[21px] text-[#222]">{name}</span>
          <button
            onClick={handleConnect}
            disabled={sent || loading}
            className={`ml-[24px] px-[24px] py-[8px] rounded-[8px] border-none font-semibold text-[16px] transition-colors duration-200 shadow-[0_1px_4px_rgba(0,0,0,0.04)] ${sent ? 'bg-[#b3b3b3] cursor-not-allowed' : loading ? 'bg-[#2563eb99] cursor-not-allowed' : 'bg-[#2563eb] cursor-pointer'} text-white`}
          >
            {sent ? "Sent" : loading ? "Sending..." : "Connect"}
          </button>
        </div>
        <div className="text-[#2563eb] text-[15px] font-medium mt-[2px]">
          {acedemic_year ? `Year ${acedemic_year}` : ""}
        </div>
        <div className="text-[#4320d1] font-semibold text-[16px] bg-[#e8eafd] rounded-[6px] px-[10px] py-[2px] mt-[10px] inline-block w-fit">
          Follow: {follow_count}
        </div>
        <div className="text-[#888] text-[16px] mt-[14px] pt-[7px] border-t border-[#e3e6ef] break-all">
          {email}
        </div>
      </div>
    </div>
  );
});

UserCard.displayName = "UserCard";


// Responsive style: hide on mobile
if (typeof window !== "undefined") {
  const style = document.createElement("style");
  style.innerHTML = `
    @media (max-width: 700px) {
      .user-card-responsive {
        display: none !important;
      }
    }
  `;
  document.head.appendChild(style);
}

export default UserCard;
