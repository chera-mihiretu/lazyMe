import { useEffect, useState } from "react";
import type { Post } from "@/types/post";

export function useUserPosts(page: number = 1) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      setError("");
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/posts/me?page=${page}`, {
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        });
        const data = await res.json();
        if (res.ok && Array.isArray(data.posts)) {
          setPosts(data.posts);
        } else {
          setError("Failed to load posts.");
        }
      } catch (err) {
        setError("Network error. Please try again." + err);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, [page]);

  return { posts, loading, error };
}
