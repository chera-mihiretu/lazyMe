"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PostCard from "@/components/home/PostCard";
import { COLORS, FONT_FAMILY } from "@/utils/color";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const PostDetailPage = () => {
  const { post_id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
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
  const fetchComments = async (pageNum = 1) => {
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
  };

  useEffect(() => {
    if (post_id) fetchComments(1);
  }, [post_id]);

  // Submit new comment
  const handleCommentSubmit = async (e) => {
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

  // Render a single comment and its replies
  const Comment = ({ comment, depth = 0 }) => {
    const [showReplies, setShowReplies] = useState(false);
    const [replies, setReplies] = useState([]);
    const [replyText, setReplyText] = useState("");
    const [replyLoading, setReplyLoading] = useState(false);
    const [repliesLoading, setRepliesLoading] = useState(false);
    const [repliesPage, setRepliesPage] = useState(1);
    const [repliesHasMore, setRepliesHasMore] = useState(false);
    const [showReplyInput, setShowReplyInput] = useState(false);
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(comment.likes || 0);
    const [replyCount, setReplyCount] = useState(comment.reply_count || 0);

    const fetchReplies = async (pageNum = 1) => {
      setRepliesLoading(true);
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const res = await fetch(`${baseUrl}/posts/comments/reply?comment_id=${comment.id}&page=${pageNum}`, {
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        });
        const data = await res.json();
        if (res.ok) {
          setReplies(pageNum === 1 ? data.replies : prev => [...prev, ...data.replies]);
          setRepliesHasMore(data.hasMore || false);
          setRepliesPage(pageNum);
        }
      } catch {}
      setRepliesLoading(false);
    };

    const handleReplySubmit = async (e) => {
      e.preventDefault();
      if (!replyText.trim()) return;
      setReplyLoading(true);
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const res = await fetch(`${baseUrl}/posts/comments/reply`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify({
            post_id,
            parent_comment_id: comment.id,
            content: replyText,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          setReplyText("");
          setShowReplyInput(false);
          // Optimistically add the new reply to the UI if returned by backend
          if (data.reply) {
            setReplies(prev => [data.reply, ...prev]);
            setReplyCount(prev => prev + 1);
            // If this is the first reply, show replies immediately
            if (!showReplies) {
              setShowReplies(true);
            }
          } else {
            fetchReplies(1);
            setReplyCount(prev => prev + 1);
            if (!showReplies) {
              setShowReplies(true);
            }
          }
        }
      } catch {}
      setReplyLoading(false);
    };

    const handleLike = () => {
      if (liked) {
        setLikes(likes - 1);
        setLiked(false);
      } else {
        setLikes(likes + 1);
        setLiked(true);
      }
    };

    return (
      <div style={{ marginLeft: depth * 32, marginTop: 18, background: depth ? '#fafaff' : 'transparent', borderRadius: 10, padding: depth ? '1rem' : 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <img src={comment.user?.profile_image_url || '/icons/avatar.png'} alt={comment.user?.name} width={36} height={36} style={{ borderRadius: '50%', objectFit: 'cover', background: '#ececff' }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 15 }}>{comment.user?.name}</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
              <div style={{ fontSize: 15, marginBottom: 6 }}>{comment.content}</div>
              <div style={{ color: COLORS.muted, fontSize: 13, marginLeft: 12, whiteSpace: 'nowrap' }}>{new Date(comment.created_at).toLocaleString()}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 2 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }} onClick={handleLike}>
                <img src={liked ? '/icons/liked.png' : '/icons/like.png'} alt="like" width={22} height={22} />
                <span style={{ color: COLORS.primary, fontSize: 15, fontWeight: 600 }}>{likes}</span>
              </span>
            <span
                style={{ display: 'flex', alignItems: 'center', gap: 6, color: COLORS.muted, fontSize: 15, cursor: replyCount > 0 ? 'pointer' : 'default' }}
                onClick={() => {
                  if (replyCount > 0) {
                    if (!showReplies) {
                      setShowReplies(true);
                      fetchReplies(1);
                    } else {
                      setShowReplies(false);
                    }
                  }
                }}
              >
                <img src="/icons/comment.png" alt="replies" width={20} height={20} style={{ opacity: 0.7 }} />
                {replyCount}
              </span>
              <button
                onClick={() => setShowReplyInput((v) => !v)}
                style={{ color: COLORS.primary, background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 500 }}
              >
                Reply
              </button>
              {replyCount > 0 && !showReplies && (
                <button onClick={() => { setShowReplies(true); fetchReplies(1); }} style={{ color: COLORS.primary, background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 500 }}>View Replies</button>
              )}
            </div>
            {/* Reply input - only visible when Reply is clicked */}
            {showReplyInput && (
              <form onSubmit={handleReplySubmit} style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                <input
                  type="text"
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder="Write a reply..."
                  style={{ flex: 1, padding: '0.5rem 1rem', borderRadius: 8, border: '1px solid #ececec', fontSize: 15 }}
                />
                <button type="submit" disabled={replyLoading} style={{ background: COLORS.primary, color: '#fff', border: 'none', borderRadius: 8, padding: '0.5rem 1.2rem', fontWeight: 600, cursor: replyLoading ? 'not-allowed' : 'pointer', opacity: replyLoading ? 0.7 : 1 }}>Reply</button>
              </form>
            )}
            {/* Replies */}
            {showReplies && (
              <div style={{ marginTop: 10 }}>
                {repliesLoading ? (
                  <div style={{ color: COLORS.muted, fontSize: 14 }}>Loading replies...</div>
                ) : replies.length === 0 ? (
                  <div style={{ color: COLORS.muted, fontSize: 14 }}>No replies yet.</div>
                ) : (
                  replies.map(reply => <Comment key={reply.id} comment={reply} depth={depth + 1} />)
                )}
                {repliesHasMore && (
                  <button onClick={() => fetchReplies(repliesPage + 1)} style={{ color: COLORS.primary, background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 500, marginTop: 6 }}>Load more replies</button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
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
              comments.map(comment => <Comment key={comment.id} comment={comment} />)
            )}
            {hasMore && !commentLoading && (
              <button onClick={() => fetchComments(page + 1)} style={{ color: COLORS.primary, background: 'none', border: 'none', cursor: 'pointer', fontSize: 15, fontWeight: 500, marginTop: 10 }}>Load more comments</button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PostDetailPage;
