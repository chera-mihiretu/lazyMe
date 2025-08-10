"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Send, 
  Loader2, 
  MessageCircle, 
  AlertCircle,
  Users,
  Clock,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import PostCard from "@/components/home/PostCard";
import Comment from "@/components/home/Comment";
import ProtectedRoute from "@/app/ProtectedRoute";

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

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const PostDetailPage = () => {
  const { post_id } = useParams();
  const router = useRouter();
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

  // Loading Component
  const LoadingComponent = () => (
    <motion.div
      className="flex flex-col items-center justify-center py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 p-3 mb-4 shadow-lg"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <Loader2 className="w-full h-full text-white animate-spin" />
      </motion.div>
      <p className="text-gray-600 font-medium">Loading post...</p>
    </motion.div>
  );

  // Error Component
  const ErrorComponent = () => (
    <motion.div
      className="flex flex-col items-center justify-center py-12"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="w-12 h-12 rounded-xl bg-red-100 p-3 mb-4 shadow-lg"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <AlertCircle className="w-full h-full text-red-500" />
      </motion.div>
      <p className="text-red-600 font-medium text-center">{error}</p>
      <motion.button
        onClick={() => window.location.reload()}
        className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-colors duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Try Again
      </motion.button>
    </motion.div>
  );

  return (
    <ProtectedRoute role="student">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-100/20 via-blue-50/10 to-transparent"></div>
          
          {/* Floating Orbs */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl"
            animate={{
              x: [0, -80, 0],
              y: [0, 60, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,.02)_1px,transparent_1px)] bg-[size:100px_100px]"></div>
        </div>

        {/* Header */}
        <motion.div
          className="relative z-10 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-lg"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <motion.button
                  onClick={() => router.back()}
                  className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowLeft className="w-5 h-5" />
                </motion.button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Post Discussion</h1>
                  <p className="text-gray-600 text-sm mt-1">Join the conversation</p>
                </div>
              </div>
              <motion.div
                className="inline-flex items-center px-3 py-1.5 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-sm font-medium"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Discussion
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                className="bg-white rounded-2xl border border-gray-200 shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
              >
                <LoadingComponent />
              </motion.div>
            ) : error ? (
              <motion.div
                key="error"
                className="bg-white rounded-2xl border border-gray-200 shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
              >
                <ErrorComponent />
              </motion.div>
            ) : !post ? null : (
              <motion.div
                key="content"
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
              >
                {/* Post Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.6 }}
                >
                  <PostCard post={post} />
                </motion.div>

                {/* Comment Input */}
                <motion.div
                  className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-600 p-2.5 shadow-lg">
                      <MessageCircle className="w-full h-full text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Add Comment</h3>
                      <p className="text-sm text-gray-600">Share your thoughts</p>
                    </div>
                  </div>

                  <form onSubmit={handleCommentSubmit} className="flex gap-3">
                    <motion.input
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Write a comment..."
                      className="flex-1 px-4 py-3 rounded-xl border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300"
                      whileFocus={{ scale: 1.01 }}
                      transition={{ duration: 0.2 }}
                    />
                    <motion.button
                      type="submit"
                      disabled={!commentText.trim()}
                      className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                        commentText.trim()
                          ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg hover:shadow-xl'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                      whileHover={commentText.trim() ? { scale: 1.05 } : {}}
                      whileTap={commentText.trim() ? { scale: 0.95 } : {}}
                    >
                      <Send className="w-4 h-4" />
                      <span>Comment</span>
                    </motion.button>
                  </form>
                </motion.div>

                {/* Comments Section */}
                <motion.div
                  className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  {/* Comments Header */}
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-2.5 shadow-lg">
                        <Users className="w-full h-full text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Comments</h3>
                        <p className="text-sm text-gray-600">
                          {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Comments Content */}
                  <div className="p-6">
                    <AnimatePresence>
                      {commentLoading && comments.length === 0 ? (
                        <motion.div
                          className="flex items-center justify-center py-8"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="flex items-center gap-3">
                            <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                            <span className="text-gray-600 font-medium">Loading comments...</span>
                          </div>
                        </motion.div>
                      ) : comments.length === 0 ? (
                        <motion.div
                          className="flex flex-col items-center justify-center py-12"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.6 }}
                        >
                          <motion.div
                            className="w-16 h-16 rounded-2xl bg-gray-100 p-4 mb-4"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, duration: 0.4 }}
                          >
                            <MessageCircle className="w-full h-full text-gray-400" />
                          </motion.div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">No comments yet</h4>
                          <p className="text-gray-500 text-center">Be the first to share your thoughts!</p>
                        </motion.div>
                      ) : (
                        <motion.div
                          className="space-y-4"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.6 }}
                        >
                          {comments.map((comment: CommentType, index) => (
                            <motion.div
                              key={comment.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1, duration: 0.4 }}
                            >
                              <Comment comment={comment} post_id={post_id as string} />
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Load More Button */}
                    {hasMore && (
                      <motion.div
                        className="flex justify-center mt-6 pt-6 border-t border-gray-200"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                      >
                        <motion.button
                          onClick={() => fetchComments(page + 1)}
                          disabled={commentLoading}
                          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                            commentLoading
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700'
                          }`}
                          whileHover={commentLoading ? {} : { scale: 1.05 }}
                          whileTap={commentLoading ? {} : { scale: 0.95 }}
                        >
                          {commentLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Loading...</span>
                            </>
                          ) : (
                            <>
                              <Clock className="w-4 h-4" />
                              <span>Load more comments</span>
                            </>
                          )}
                        </motion.button>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default PostDetailPage;
