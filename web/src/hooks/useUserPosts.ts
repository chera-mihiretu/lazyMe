import { useEffect, useState } from "react";
import type { Post } from "@/types/post";

export function useUserPosts(page: number = 1) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasNext, setHasNext] = useState(false);

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
        console.log('useUserPosts response:', data, 'page:', page);
        if (res.ok && Array.isArray(data.posts)) {
          if (page === 1) {
          setPosts(data.posts);
          } else {
            setPosts(prev => [...prev, ...data.posts]);
          }
          console.log('Setting hasNext to:', data.next, 'for page:', page);
          setHasNext(data.next || false);
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

  return { posts, loading, error, hasNext };
}

export function useOtherUserPosts(page: number = 1, id: string) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasNext, setHasNext] = useState(false);

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      setError("");
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/posts/user/?id=${id}&page=${page}`, {
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        });
        const data = await res.json();
        console.log('useOtherUserPosts response:', data, 'id:', id, 'page:', page);
        if (res.ok && Array.isArray(data.posts)) {
          if (page === 1) {
          setPosts(data.posts);
          } else {
            setPosts(prev => [...prev, ...data.posts]);
          }
          console.log('Setting hasNext to:', data.next, 'for page:', page);
          setHasNext(data.next || false);
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
  }, [page, id]);
  
  return { posts, loading, error, hasNext };
}
