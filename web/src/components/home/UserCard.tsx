import React from "react";

interface UserCardProps {
  id: string;
  name: string;
  email: string;
  profile_image_url?: string;
  follow_count: number;
  acedemic_year: number;
}

const UserCard: React.FC<UserCardProps> = React.memo(
  ({ name, email, profile_image_url, follow_count, acedemic_year }) => {
    return (
      <div
        className="user-card-responsive"
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          background: "#f3f6fb",
          borderRadius: 16,
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          padding: "1rem 1.2rem",
          marginBottom: 18,
          minWidth: 320,
          maxWidth: 520,
          width: "100%",
          gap: 24,
          border: "1.5px solid #e3e6ef",
          transition: "box-shadow 0.2s, border 0.2s",
        }}
      >
        <img
          src={profile_image_url || "/icons/avatar.png"}
          alt={name + " avatar"}
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            objectFit: "cover",
            background: "#f2f2f2",
            flexShrink: 0,
          }}
        />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ fontWeight: 600, fontSize: 17 }}>{name}</div>
          <div style={{ color: "#888", fontSize: 14 }}>
            {acedemic_year ? `Year ${acedemic_year}` : ""}
          </div>
          <div style={{ color: "#555", fontSize: 14 }}>
            {follow_count} follower{follow_count === 1 ? "" : "s"}
          </div>
          <div style={{ color: "#888", fontSize: 13, marginTop: 2, wordBreak: "break-all" }}>{email}</div>
        </div>
        <button
          style={{
            marginLeft: 12,
            padding: "7px 18px",
            borderRadius: 8,
            border: "none",
            background: "#2563eb",
            color: "#fff",
            fontWeight: 600,
            fontSize: 15,
            cursor: "pointer",
            transition: "background 0.2s",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          }}
        >
          Connect
        </button>
      </div>
    );
  }
);


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
