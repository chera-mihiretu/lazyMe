import React, { useEffect, useState, useCallback } from "react";
import UserCard from "@/components/home/UserCard";
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
  const [hasMore, setHasMore] = useState(false);

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
        setHasMore(data.hasMore || false);
        setLoading(false);
      })
      .catch((e) => {
        setUsers([]);
        setHasMore(false);
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
      <h3 style={{ fontWeight: 600, fontSize: 18, marginBottom: 16 }}>Suggestions</h3>
      {loading ? (
        <div style={{ textAlign: "center", margin: "2rem 0" }}>Loading...</div>
      ) : users.length === 0 ? (
        <div style={{ textAlign: "center", color: "#888", margin: "2rem 0" }}>No suggestions found.</div>
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
              onClick={() => alert('View more suggestions coming soon!')}
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
