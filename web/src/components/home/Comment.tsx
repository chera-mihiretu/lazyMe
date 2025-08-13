import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Heart, 
  MessageCircle, 
  Reply, 
  Send, 
  Loader2, 
  User,
  Clock,
  ChevronDown,
  ChevronUp,
  
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

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
const Comment: React.FC<{
  comment: CommentType;
  depth?: number;
  post_id?: string;
}> = ({ comment, depth = 0, post_id }) => {
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState<CommentType[]>([]);
  const [replyText, setReplyText] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);
  const [repliesLoading, setRepliesLoading] = useState(false);
  const [repliesPage, setRepliesPage] = useState(1);
  const [repliesHasMore, setRepliesHasMore] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(comment.likes || 0);
  const [replyCount, setReplyCount] = useState(comment.reply_count || 0);
  const router = useRouter();

  const handleUserClick = () => {
    if (comment.user?.id) {
      router.push(`/home/profile?id=${comment.user.id}`);
    }
  };

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

  const handleReplySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
        if (data.reply) {
          setReplies((prev: CommentType[]) => [data.reply, ...prev]);
          setReplyCount((prev: number) => prev + 1);
          if (!showReplies) {
            setShowReplies(true);
          }
        } else {
          fetchReplies(1);
          setReplyCount((prev: number) => prev + 1);
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

  const handleToggleReplies = () => {
    if (replyCount > 0) {
      if (!showReplies) {
        setShowReplies(true);
        fetchReplies(1);
      } else {
        setShowReplies(false);
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  const isNested = depth > 0;
  const maxDepth = 3; // Limit nesting depth for better UX

  return (
    <motion.div
      className={`group ${isNested ? 'ml-2 sm:ml-8 mt-3' : 'mt-0'}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className={`${isNested ? 'bg-gray-50 rounded-xl p-3 sm:p-4' : 'bg-white rounded-xl p-4 border border-gray-200'} transition-all duration-300 hover:shadow-md`}>
        {/* Comment Header */}
        <div className="flex items-start gap-2 sm:gap-3">
          {/* Avatar */}
          <motion.button
            className="relative flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            onClick={handleUserClick}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className={`relative ${isNested ? 'w-7 h-7 sm:w-8 sm:h-8' : 'w-8 h-8 sm:w-10 sm:h-10'} rounded-full overflow-hidden border-2 border-gray-200 group-hover:border-purple-300 transition-colors duration-300`}>
              {comment.user?.profile_image_url ? (
                <Image
                  src={comment.user.profile_image_url}
                  alt={comment.user?.name || "User"}
                  width={isNested ? 32 : 40}
                  height={isNested ? 32 : 40}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                  <User className={`${isNested ? 'w-3 h-3 sm:w-4 sm:h-4' : 'w-4 h-4 sm:w-5 sm:h-5'} text-purple-600`} />
                </div>
              )}
            </div>
          </motion.button>

          {/* Comment Content */}
          <div className="flex-1 min-w-0">
            {/* User Info and Time */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1 sm:gap-2">
                <button onClick={handleUserClick} className={`font-semibold text-gray-900 ${isNested ? 'text-xs sm:text-sm' : 'text-sm sm:text-base'} group-hover:text-purple-700 transition-colors duration-300 truncate hover:underline text-left`}>
                  {comment.user?.name || "Unknown"}
                </button>
                {comment.user?.acedemic_year && (
                  <span className="px-1.5 sm:px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-full flex-shrink-0">
                    Year {comment.user.acedemic_year}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500 flex-shrink-0">
                <Clock className="w-3 h-3" />
                <span className="hidden xs:inline">{formatDate(comment.created_at)}</span>
                <span className="xs:hidden">{formatDate(comment.created_at).replace(' ago', '')}</span>
              </div>
            </div>

            {/* Comment Text */}
            <motion.div
              className={`text-gray-800 leading-relaxed mb-3 ${isNested ? 'text-xs sm:text-sm' : 'text-sm sm:text-base'}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              <p className="whitespace-pre-wrap break-words">{comment.content}</p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              className="flex items-center gap-2 sm:gap-4 flex-wrap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              {/* Like Button */}
              <motion.button
                className={`flex items-center gap-1 sm:gap-1.5 px-2 py-1 rounded-lg transition-all duration-300 ${
                  liked 
                    ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
                onClick={handleLike}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Heart className={`w-3 h-3 sm:w-4 sm:h-4 ${liked ? 'fill-current' : ''}`} />
                <span className="font-semibold text-xs">{likes}</span>
              </motion.button>

              {/* Reply Count Button */}
              {replyCount > 0 && (
                <motion.button
                  className="flex items-center gap-1 sm:gap-1.5 px-2 py-1 rounded-lg bg-gray-50 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300"
                  onClick={handleToggleReplies}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="font-semibold text-xs">{replyCount}</span>
                  {showReplies ? (
                    <ChevronUp className="w-3 h-3" />
                  ) : (
                    <ChevronDown className="w-3 h-3" />
                  )}
                </motion.button>
              )}

              {/* Reply Button */}
              {depth < maxDepth && (
                <motion.button
                  className="flex items-center gap-1 sm:gap-1.5 px-2 py-1 rounded-lg bg-gray-50 text-gray-600 hover:bg-green-50 hover:text-green-600 transition-all duration-300"
                  onClick={() => setShowReplyInput((v) => !v)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Reply className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="font-medium text-xs hidden xs:inline">Reply</span>
                  <span className="font-medium text-xs xs:hidden">R</span>
                </motion.button>
              )}

              {/* View Replies Button (when replies exist but aren't shown) */}
              {replyCount > 0 && !showReplies && (
                <motion.button
                  className="flex items-center gap-1 sm:gap-1.5 px-2 py-1 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all duration-300"
                  onClick={handleToggleReplies}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="font-medium text-xs hidden sm:inline">View {replyCount} {replyCount === 1 ? 'reply' : 'replies'}</span>
                  <span className="font-medium text-xs sm:hidden">{replyCount} replies</span>
                  <ChevronDown className="w-3 h-3" />
                </motion.button>
              )}
            </motion.div>

            {/* Reply Input */}
            <AnimatePresence>
              {showReplyInput && (
                <motion.div
                  className="mt-4 p-3 bg-green-50 rounded-xl border border-green-200"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <form onSubmit={handleReplySubmit} className="flex gap-2">
                    <motion.input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write a reply..."
                      className="flex-1 px-3 py-2 rounded-lg border border-green-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 text-sm"
                      whileFocus={{ scale: 1.01 }}
                      transition={{ duration: 0.2 }}
                    />
                    <motion.button
                      type="submit"
                      disabled={replyLoading || !replyText.trim()}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center gap-1.5 text-sm ${
                        replyLoading || !replyText.trim()
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-md hover:shadow-lg'
                      }`}
                      whileHover={replyLoading || !replyText.trim() ? {} : { scale: 1.05 }}
                      whileTap={replyLoading || !replyText.trim() ? {} : { scale: 0.95 }}
                    >
                      {replyLoading ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Send className="w-3 h-3" />
                      )}
                      <span>Reply</span>
                    </motion.button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Replies Section */}
            <AnimatePresence>
              {showReplies && (
                <motion.div
                  className="mt-4"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {/* Replies Loading */}
                  {repliesLoading && replies.length === 0 ? (
                    <motion.div
                      className="flex items-center justify-center py-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                        <span className="text-gray-600 text-sm font-medium">Loading replies...</span>
                      </div>
                    </motion.div>
                  ) : replies.length === 0 ? (
                    <motion.div
                      className="flex flex-col items-center justify-center py-6"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4 }}
                    >
                      <motion.div
                        className="w-12 h-12 rounded-xl bg-gray-100 p-3 mb-2"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.3 }}
                      >
                        <MessageCircle className="w-full h-full text-gray-400" />
                      </motion.div>
                      <p className="text-gray-500 text-sm text-center">No replies yet</p>
                    </motion.div>
                  ) : (
                    <motion.div
                      className="space-y-3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4 }}
                    >
                      {replies.map((reply: CommentType, index) => (
                        <motion.div
                          key={reply.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1, duration: 0.3 }}
                        >
                          <Comment 
                            comment={reply} 
                            depth={Math.min(depth + 1, maxDepth)} 
                            post_id={post_id} 
                          />
                        </motion.div>
                      ))}
                    </motion.div>
                  )}

                  {/* Load More Replies */}
                  {repliesHasMore && (
                    <motion.div
                      className="flex justify-center mt-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.4 }}
                    >
                      <motion.button
                        onClick={() => fetchReplies(repliesPage + 1)}
                        disabled={repliesLoading}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm ${
                          repliesLoading
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700'
                        }`}
                        whileHover={repliesLoading ? {} : { scale: 1.05 }}
                        whileTap={repliesLoading ? {} : { scale: 0.95 }}
                      >
                        {repliesLoading ? (
                          <>
                            <Loader2 className="w-3 h-3 animate-spin" />
                            <span>Loading...</span>
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-3 h-3" />
                            <span>Load more replies</span>
                          </>
                        )}
                      </motion.button>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Comment;
