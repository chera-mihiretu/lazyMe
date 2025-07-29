"use client";
import React, { useEffect, useState } from "react";

interface UserType {
  id: string;
  name: string;
  profile_image_url?: string;
  acedemic_year?: string;
}

interface CommentType {
  id: string;
  user?: UserType;
  content: string;
  created_at: string;
  likes?: number;
  reply_count?: number;
}
import { useParams } from "next/navigation";
import PostCard from "@/components/home/PostCard";
import { COLORS } from "@/utils/color";
import Comment from "@/components/home/Comment";
import ProtectedRoute from "@/app/ProtectedRoute";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const PostDetailPage = () => {
  const { post_id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  // Fetch post details
  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError("");
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const res = await fetch(`${baseUrl}/posts/post?id=${post_id}`, {
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        });
        const data = await res.json();
        if (res.ok) setPost(data.post);
        else setError("Failed to load post.");
      } catch {
        setError("Network error.");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [post_id]);

  // Fetch comments
  const fetchComments = React.useCallback(async (pageNum = 1) => {
    setCommentLoading(true);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const res = await fetch(`${baseUrl}/posts/comments/?post_id=${post_id}&page=${pageNum}`, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      const data = await res.json();
      if (res.ok) {
        setComments(pageNum === 1 ? data.comments : prev => [...prev, ...data.comments]);
        setHasMore(data.hasMore || false);
        setPage(pageNum);
      }
    } catch {}
    setCommentLoading(false);
  }, [post_id]);

  useEffect(() => {
    if (post_id) fetchComments(1);
  }, [post_id, fetchComments]);

  // Submit new comment
  const handleCommentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const res = await fetch(`${baseUrl}/posts/comments/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ post_id, content: commentText }),
      });
      if (res.ok) {
        setCommentText("");
        fetchComments(1);
      }
    } catch {}
  };

  // ...existing code...

  return (
    <ProtectedRoute role="student">
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '2rem 1rem' }}>
      {loading ? (
        <div style={{ color: COLORS.muted, fontSize: '1.1rem' }}>Loading...</div>
      ) : error ? (
        <div style={{ color: COLORS.error, fontSize: '1.05rem', marginBottom: 12 }}>{error}</div>
      ) : !post ? null : (
        <>
          <PostCard post={post} />
          {/* New comment input */}
          <form onSubmit={handleCommentSubmit} style={{ display: 'flex', gap: 10, margin: '1.5rem 0' }}>
            <input
              type="text"
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              style={{ flex: 1, padding: '0.7rem 1.2rem', borderRadius: 8, border: '1px solid #ececec', fontSize: 16 }}
            />
            <button type="submit" style={{ background: COLORS.primary, color: '#fff', border: 'none', borderRadius: 8, padding: '0.7rem 2rem', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>Comment</button>
          </form>
          {/* Comments */}
          <div style={{ marginTop: 18 }}>
            {commentLoading ? (
              <div style={{ color: COLORS.muted, fontSize: 15 }}>Loading comments...</div>
            ) : comments.length === 0 ? (
              <div style={{ color: COLORS.muted, fontSize: 15 }}>No comments yet.</div>
            ) : (
              comments.map((comment: CommentType) => <Comment key={comment.id} comment={comment} post_id={post_id as string} />)
            )}
            {hasMore && !commentLoading && (
              <button onClick={() => fetchComments(page + 1)} style={{ color: COLORS.primary, background: 'none', border: 'none', cursor: 'pointer', fontSize: 15, fontWeight: 500, marginTop: 10 }}>Load more comments</button>
            )}
          </div>
        </>
      )}
    </div>
    </ProtectedRoute>
  );
};

export default PostDetailPage;
