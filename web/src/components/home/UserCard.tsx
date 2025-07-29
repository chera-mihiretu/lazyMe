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
      className="user-card-responsive"
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        background: "#f3f6fb",
        borderRadius: 18,
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        padding: "1.5rem 2.5rem 1.5rem 1.5rem",
        marginBottom: 28,
        minWidth: 420,
        maxWidth: 820,
        width: "100%",
        gap: 36,
        border: "1.5px solid #e3e6ef",
        transition: "box-shadow 0.2s, border 0.2s",
      }}
    >
      <Image
        src={profile_image_url || "/icons/avatar.png"}
        alt={name + " avatar"}
        style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          objectFit: "cover",
          background: "#f2f2f2",
          flexShrink: 0,
          marginRight: 18,
        }}
      />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          <span style={{ fontWeight: 700, fontSize: 21, color: "#222" }}>{name}</span>
          <button
            onClick={handleConnect}
            disabled={sent || loading}
            style={{
              marginLeft: 24,
              padding: "8px 24px",
              borderRadius: 8,
              border: "none",
              background: sent ? "#b3b3b3" : loading ? "#2563eb99" : "#2563eb",
              color: "#fff",
              fontWeight: 600,
              fontSize: 16,
              cursor: sent || loading ? "not-allowed" : "pointer",
              transition: "background 0.2s",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            }}
          >
            {sent ? "Sent" : loading ? "Sending..." : "Connect"}
          </button>
        </div>
        <div style={{ color: "#2563eb", fontSize: 15, fontWeight: 500, margin: "2px 0 0 0" }}>
          {acedemic_year ? `Year ${acedemic_year}` : ""}
        </div>
        <div style={{ color: "#4320d1", fontWeight: 600, fontSize: 16, background: "#e8eafd", borderRadius: 6, padding: "2px 10px", margin: "10px 0 0 0", display: "inline-block", width: "fit-content" }}>
          Follow: {follow_count}
        </div>
        <div style={{ color: "#888", fontSize: 16, marginTop: 14, padding: "7px 0 0 0", borderTop: "1px solid #e3e6ef", wordBreak: "break-all" }}>
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
