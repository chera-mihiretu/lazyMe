"use client";
import React, { useState } from "react";
import PostCard from "@/components/home/PostCard";
import type { Post } from "@/types/Post";
import PostSearchBar from "@/components/home/PostSearchBar";
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

interface PostsListProps {
  initialSearch?: string;
}

const PostsList: React.FC<PostsListProps> = ({ initialSearch = "" }) => {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [backupPosts, setBackupPosts] = useState<Post[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(initialSearch);
  const [error, setError] = useState<string | null>(null);

  const handleAddPost = () => {
    // Redirect to create post page
    if (typeof window !== "undefined") {
      window.location.href = "/home/posts/create";
    }
  };

  // Helper: fetch all posts (for initial load and restore)
  const fetchAllPosts = async () => {
    setLoading(true);
    setError(null);
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    try {
      const res = await fetch(`${baseUrl}/posts/?page=1`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      if (!res.ok) {
        let msg = `Error fetching post: ${res.status} ${res.statusText}`;
        try {
          const data = await res.json();
          if (data?.message) msg = data.message;
        } catch {}
        setError(msg);
        setPosts([]);
        setLoading(false);
        return;
      }
      const data = await res.json();
      setPosts(data.posts || []);
      setBackupPosts(data.posts || []);
      setLoading(false);
    } catch (e: any) {
      setError(e?.message || "Failed to fetch posts.");
      setLoading(false);
      setPosts([]);
    }
  };

  // Initial load: fetch all posts
  React.useEffect(() => {
    fetchAllPosts();
  }, []);
  // Only fetch on search submit (Enter)
  const handleSearch = async (page = 1) => {
    if (!search.trim()) return;
    // Backup posts only if not already searching
    if (!backupPosts && posts) {
      setBackupPosts(posts);
    }
    setLoading(true);
    setError(null);
    setPosts(null);
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    try {
      const res = await fetch(`${baseUrl}/posts/search?q=${encodeURIComponent(search)}&page=${page}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      if (!res.ok) {
        let msg = `Error fetching post: ${res.status} ${res.statusText}`;
        try {
          const data = await res.json();
          if (data?.message) msg = data.message;
        } catch {}
        setError(msg);
        setPosts([]);
        setLoading(false);
        return;
      }
      const data = await res.json();
      setPosts(data.posts || []);
      setLoading(false);
    } catch (e: any) {
      setError(e?.message || "Failed to fetch posts.");
      setLoading(false);
      setPosts([]);
    }
  };

  // Restore backup when search is cleared
  React.useEffect(() => {
    if (search.trim() === "" && backupPosts) {
      setPosts(backupPosts);
      setBackupPosts(null);
    }
  }, [search]);
  return (
    <>
      <PostSearchBar
        search={search}
        setSearch={setSearch}
        onAddPost={handleAddPost}
        onSearchSubmit={handleSearch}
      />
      {loading ? (
        <div className="text-center mt-16">Loading posts...</div>
      ) : error ? (
        <div className="text-center mt-16 text-[#d32f2f] font-semibold text-[18px]">{error}</div>
      ) : posts && posts.length === 0 ? (
        <div className="text-center mt-16 text-[#888]">No posts found.</div>
      ) : posts && posts.length > 0 ? (
        <div className="max-w-[900px] mx-auto mt-10 px-6 font-poppins">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : null}
    </>
  );
};

export default PostsList;
