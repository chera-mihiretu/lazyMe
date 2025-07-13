"use client";
import React, { useEffect, useState } from "react";
import PostCard from "@/components/home/PostCard";
import type { Post } from "@/types/Post";
import PostSearchBar from "@/components/home/PostSearchBar";
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

interface PostsListProps {
  initialSearch?: string;
}

const PostsList: React.FC<PostsListProps> = ({ initialSearch = "" }) => {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialSearch);
  const [error, setError] = useState<string | null>(null);

  const handleAddPost = () => {
    // Redirect to create post page
    if (typeof window !== "undefined") {
      window.location.href = "/home/posts/create";
    }
  };

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    fetch(`${baseUrl}/posts/?page=1`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    })
      .then(async (res) => {
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
        const found = data.posts;
        setPosts(found || []);
        setLoading(false);
      })
      .catch((e) => {
        console.error("Error fetching posts:", e);
        setError(e?.message || "Failed to fetch posts.");
        setLoading(false);
        setPosts([]);
      });
  }, []);

  // Filter posts by search if needed
  const filteredPosts = posts
    ? posts.filter(
        (post) =>
          post.content?.toLowerCase().includes(search.toLowerCase()) ||
          post.user?.name?.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  return (
    <>
      <PostSearchBar search={search} setSearch={setSearch} onAddPost={handleAddPost} />
      {loading ? (
        <div style={{ textAlign: "center", marginTop: 60 }}>Loading posts...</div>
      ) : error ? (
        <div style={{ textAlign: "center", marginTop: 60, color: "#d32f2f", fontWeight: 600, fontSize: 18 }}>
          {error}
        </div>
      ) : !posts || posts.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: 60, color: "#888" }}>No posts found.</div>
      ) : (
        <div
          style={{
            maxWidth: 900,
            margin: "2.5rem auto 0 auto",
            padding: "0 1.5rem",
            fontFamily: "Poppins, sans-serif",
          }}
        >
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </>
  );
};

export default PostsList;
