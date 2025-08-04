import { useEffect, useState } from "react";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  google_id?: string;
  school?: string;
  follow_count?: number;
  department?: string;
  acedemic_year?: number;
  profile_image_url?: string;
  is_complete?: boolean;
  is_teacher?: boolean;
  blue_badge?: boolean;
  created_at?: string;
  updated_at?: string;
}

export function useUserProfile() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      setError("");
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/me`, {
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        });
        const data = await res.json();
        if (res.ok && data.me) {
          setUser(data.me);
        } else {
          setError("Failed to load user profile.");
        }
      } catch (err) {
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  return { user, loading, error };
}
