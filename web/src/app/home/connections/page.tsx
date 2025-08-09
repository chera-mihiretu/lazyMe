"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Loading from "@/components/general/Loading";
import { User } from "../../../types/post";
import HomeNavBar from "../../../components/home/HomeNavBar";
import ProtectedRoute from "@/app/ProtectedRoute";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const ConnectionsPage: React.FC = () => {
  const [requests, setRequests] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [accepting, setAccepting] = useState<string | null>(null);
 


  useEffect(() => {
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
      } catch (err) {
        setError("Network error. Please try again." + err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
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
    } catch (err) {
      setError("Network error. Please try again." + err);
    } finally {
      setAccepting(null);
    }
  };

  return (
    <>
      <ProtectedRoute role="student">
        <HomeNavBar />
        <div
          className="user-suggestions-responsive"
          style={{ minWidth: 240, maxWidth: 520, margin: '32px auto 0 auto' }}
        >
          
          <h3 style={{ fontWeight: 600, fontSize: 18, marginBottom: 16, color: '#4320d1' }}>Connection Requests</h3>
          {loading ? (
            <Loading />
          ) : error ? (
            <div className="text-error text-base mb-3 text-center">{error}</div>
          ) : requests.length === 0 ? (
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
              <Image src="/icons/empty_state.png" alt="No connection requests" width={80} height={80} style={{ marginBottom: 18, opacity: 0.8 }} />
              <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 6 }}>No Connection Requests</div>
              <div style={{ color: '#888', fontSize: 15, marginBottom: 0 }}>You&apos;re all caught up! Check back later for new requests.</div>
            </div>
          ) : (
            <>
              {requests.map((user) => (
                <div
                  key={user.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: '#fff',
                    borderRadius: 14,
                    boxShadow: '0 2px 12px #e0e0e0',
                    padding: '1.1rem 1.2rem',
                    marginBottom: 14,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <Image
                      src={user.profile_image_url || "/icons/avatar.png"}
                      alt={user.name}
                      width={44}
                      height={44}
                      style={{ borderRadius: '50%', objectFit: 'cover', background: '#f3f3f3', marginRight: 8 }}
                    />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 16 }}>{user.name}</div>
                      <div style={{ color: '#888', fontSize: 14 }}>{user.email}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAccept(user.id)}
                    disabled={accepting === user.id}
                    style={{
                      padding: '8px 28px',
                      borderRadius: 8,
                      border: 'none',
                      background: accepting === user.id ? '#bdbdbd' : '#2563eb',
                      color: '#fff',
                      fontWeight: 600,
                      fontSize: 16,
                      cursor: accepting === user.id ? 'not-allowed' : 'pointer',
                      opacity: accepting === user.id ? 0.7 : 1,
                      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                      transition: 'background 0.2s',
                    }}
                  >
                    {accepting === user.id ? "Accepting..." : "Accept"}
                  </button>
                </div>
              ))}
            </>
          )}
        </div>
      </ProtectedRoute>
    </>
  );
};

export default ConnectionsPage;
