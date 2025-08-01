"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { User } from "../../../types/post";
import HomeNavBar from "../../../components/home/HomeNavBar";
import UserSuggestionsList from "@/components/home/UserSuggestionsList";
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
      <div className="max-w-xl mx-auto p-8 pb-6">
        <h2 className="font-bold text-2xl mb-5 text-primary font-poppins">
          Connection Requests
        </h2>
        {loading ? (
          <div className="text-muted text-lg">Loading...</div>
        ) : error ? (
          <div className="text-error text-base mb-3">{error}</div>
        ) : requests.length === 0 ? (
          <div className="text-center text-primary my-10 mb-8 bg-[#f7f7fb] rounded-xl p-10 pt-10 pb-8 shadow-md flex flex-col items-center justify-center">
            <Image src="/icons/empty_state.png" alt="No connection requests" width={80} height={80} className="mb-4 opacity-80" />
            <div className="font-semibold text-lg mb-1">No Connection Requests</div>
            <div className="text-gray-500 text-base">You&apos;re all caught up! Check back later for new requests.</div>
          </div>
        ) : (
          <ul className="list-none p-0">
            {requests.map((user) => (
              <li key={user.id} className="flex items-center justify-between bg-white rounded-lg shadow p-4 mb-3">
                <div className="flex items-center gap-4">
                  <Image
                    src={user.profile_image_url || "/icons/avatar.png"}
                    alt={user.name}
                    width={44}
                    height={44}
                    className="rounded-full object-cover bg-[#f3f3f3]"
                  />
                  <div>
                    <div className="font-semibold font-poppins text-base">{user.name}</div>
                    <div className="text-muted text-sm">{user.email}</div>
                  </div>
                </div>
                <button
                  onClick={() => handleAccept(user.id)}
                  disabled={accepting === user.id}
                  className={`font-poppins font-semibold text-base rounded-md px-4 py-2 border-none transition-colors duration-200 text-white ${accepting === user.id ? 'bg-muted cursor-not-allowed opacity-70' : 'bg-primary cursor-pointer opacity-100'}`}
                >
                  {accepting === user.id ? "Accepting..." : "Accept"}
                </button>
              </li>
            ))}
          </ul>
        )}
    </div>
    </ProtectedRoute>
    </>
  );
};

export default ConnectionsPage;
