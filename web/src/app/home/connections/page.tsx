"use client";

import React, { useEffect, useState } from "react";
import { COLORS, FONT_FAMILY } from "../../../utils/color";
import { User } from "../../../types/Post";
import HomeNavBar from "../../../components/home/HomeNavBar";
import UserSuggestionsList from "@/components/home/UserSuggestionsList";
import ProtectedRoute from "@/app/ProtectedRoute";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const ConnectionsPage: React.FC = () => {
  const [requests, setRequests] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [accepting, setAccepting] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<User[]>([]);
  const [suggestionLoading, setSuggestionLoading] = useState(false);
  const [suggestionError, setSuggestionError] = useState("");

  const fetchRequests = async () => {
    setLoading(true);
    setError("");
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const res = await fetch(`${baseUrl}/connections/requests/?page=1`, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data.connections)) {
        setRequests(data.connections);
      } else {
        setError("Failed to load connection requests.");
      }
    } catch (err: any) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    // Fetch suggestions after requests load
    const fetchSuggestions = async () => {
      setSuggestionLoading(true);
      setSuggestionError("");
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const res = await fetch(`${baseUrl}/connections/suggestions?page=1`, {
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        });
        const data = await res.json();
        if (res.ok && Array.isArray(data.connections)) {
          setSuggestions(data.connections);
        } else {
          setSuggestionError("Failed to load suggestions.");
        }
      } catch (err: any) {
        setSuggestionError("Network error. Please try again.");
      } finally {
        setSuggestionLoading(false);
      }
    };
    fetchSuggestions();
    // eslint-disable-next-line
  }, []);

  const handleAccept = async (userId: string) => {
    setAccepting(userId);
    setError("");
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const res = await fetch(`${baseUrl}/connections/accept`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ connector_id: userId }),
      });
      if (res.ok) {
        setRequests((prev) => prev.filter((u) => u.id !== userId));
      } else {
        setError("Failed to accept connection request.");
      }
    } catch (err: any) {
      setError("Network error. Please try again.");
    } finally {
      setAccepting(null);
    }
  };

  return (
    <>
      <ProtectedRoute role="student">
      <HomeNavBar />
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "2rem 1rem" }}>
        <h2 style={{ fontFamily: FONT_FAMILY.poppins, fontWeight: 700, fontSize: 26, marginBottom: 18, color: COLORS.primary }}>
          Connection Requests
        </h2>
        {loading ? (
          <div style={{ color: COLORS.muted, fontSize: "1.1rem" }}>Loading...</div>
        ) : error ? (
          <div style={{ color: COLORS.error, fontSize: "1.05rem", marginBottom: 12 }}>{error}</div>
        ) : requests.length === 0 ? (
          <div style={{
            textAlign: "center",
            color: COLORS.primary,
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
            <img src="/icons/empty_state.png" alt="No connection requests" style={{ width: 80, height: 80, marginBottom: 18, opacity: 0.8 }} />
            <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 6 }}>No Connection Requests</div>
            <div style={{ color: '#888', fontSize: 15, marginBottom: 0 }}>You're all caught up! Check back later for new requests.</div>
          </div>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {requests.map((user) => (
              <li key={user.id} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                background: "#fff", borderRadius: 10, boxShadow: "0 2px 8px #e0e0e0",
                padding: "1rem 1.2rem", marginBottom: 14
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <img src={user.profile_image_url || "/icons/avatar.png"} alt={user.name} width={44} height={44} style={{ borderRadius: "50%", objectFit: "cover", background: "#f3f3f3" }} />
                  <div>
                    <div style={{ fontWeight: 600, fontFamily: FONT_FAMILY.poppins, fontSize: 17 }}>{user.name}</div>
                    <div style={{ color: COLORS.muted, fontSize: 14 }}>{user.email}</div>
                  </div>
                </div>
                <button
                  onClick={() => handleAccept(user.id)}
                  disabled={accepting === user.id}
                  style={{
                    background: accepting === user.id ? COLORS.muted : COLORS.primary,
                    color: "#fff",
                    fontFamily: FONT_FAMILY.poppins,
                    fontWeight: 600,
                    fontSize: "1rem",
                    borderRadius: 8,
                    padding: "0.6rem 1.2rem",
                    border: "none",
                    cursor: accepting === user.id ? "not-allowed" : "pointer",
                    opacity: accepting === user.id ? 0.7 : 1,
                    transition: "background 0.2s",
                  }}
                >
                  {accepting === user.id ? "Accepting..." : "Accept"}
                </button>
              </li>
            ))}
          </ul>
        )}
      {/* Suggestions Section */}
      <UserSuggestionsList/>
    </div>
    </ProtectedRoute>
    </>
  );
};

export default ConnectionsPage;
