import React, { useEffect, useState, useCallback } from "react";
import UserCard from "@/components/home/UserCard";
import Image from "next/image";
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

interface UserSuggestion {
  id: string;
  name: string;
  email: string;
  profile_image_url?: string;
  follow_count: number;
  acedemic_year: number;
}

interface UserSuggestionsListProps {
  page?: number;
}

const UserSuggestionsList: React.FC<UserSuggestionsListProps> = ({ page = 1 }) => {
  const [users, setUsers] = useState<UserSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(page);

  const fetchSuggestions = useCallback(() => {
    setLoading(true);
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    fetch(`${baseUrl}/connections/suggestions?page=${currentPage}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch user suggestions");
        const data = await res.json();
        setUsers(data.suggestions || []);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e)
        setUsers([]);
        setLoading(false);
      });
  }, [currentPage]);

  useEffect(() => {
    fetchSuggestions();
  }, [fetchSuggestions]);

  // Responsive: hide the entire suggestion box on mobile
  return (
    <div
      className="user-suggestions-responsive"
      style={{ minWidth: 240, maxWidth: 520, marginLeft: 24 }}
    >
      {/* Only show title if there are users */}
      {users.length > 0 && (
        <h3 style={{ fontWeight: 600, fontSize: 18, marginBottom: 16 }}>Suggestions</h3>
      )}
      {loading ? (
        <div style={{ textAlign: "center", margin: "2rem 0" }}>Loading...</div>
      ) : users.length === 0 ? (
        <div style={{
          textAlign: "center",
          color: "#4320d1",
          margin: "2.5rem 0 2rem 0",
          background: "#f7f7fb",
          borderRadius: 14,
          padding: "2.5rem 1.5rem 2rem 1.5rem",
          boxShadow: "0 2px 12px #e0e0e0",
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Image src="/icons/empty_state.png" alt="No suggestions" style={{ width: 80, height: 80, marginBottom: 18, opacity: 0.8 }} />
          <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 6 }}>No Connection Requests</div>
          <div style={{ color: '#888', fontSize: 15, marginBottom: 0 }}>You&apos;re all caught up! Check back later for new suggestions.</div>
        </div>
      ) : (
        <>
          {users.map((user) => <UserCard key={user.id} {...user} />)}
          <div style={{ display: "flex", justifyContent: "center", marginTop: 18 }}>
            <button
              style={{
                padding: "8px 28px",
                borderRadius: 8,
                border: "none",
                background: "#2563eb",
                color: "#fff",
                fontWeight: 600,
                fontSize: 16,
                cursor: "pointer",
                transition: "background 0.2s",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              }}
              onClick={() => setCurrentPage(currentPage + 1) }
            >
              View More
            </button>
          </div>
        </>
      )}
    </div>
  );
};


// Responsive style: hide the whole suggestion box on mobile
if (typeof window !== "undefined") {
  const style = document.createElement("style");
  style.innerHTML = `
    @media (max-width: 700px) {
      .user-suggestions-responsive {
        display: none !important;
      }
    }
  `;
  document.head.appendChild(style);
}

export default UserSuggestionsList;
