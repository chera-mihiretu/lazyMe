import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MoreHorizontal, 
  Heart, 
  MessageCircle, 
  Edit3, 
  Trash2, 
  Flag, 
  X, 
  
  User,
  Loader2,
  GraduationCap,
  Clock,
  Eye
} from "lucide-react";
import type { Post } from "@/types/post";
import { formatTimeAgo } from "@/app/helpers/time_formatter";
import { getUserID } from "@/utils/auth";
import Image from "next/image";
import { useRouter } from "next/navigation";

const PostCard: React.FC<{ post: Post }> = ({ post }) => {
  const [openImg, setOpenImg] = useState<string | null>(null);
  const [likes, setLikes] = useState(post.likes || 0);
  const [liked, setLiked] = useState(post.liked || false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();

  // Menu logic
  const [showMenu, setShowMenu] = useState(false);
  const menuButtonRef = React.useRef<HTMLButtonElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!showMenu) return;
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target as Node)
      ) {
        setShowMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const isCurrentUser = getUserID() === post.user?.id;

  // Navigation handler
  const handleUserClick = () => {
    console.log('User clicked for post:', post.id, 'user:', post.user?.id);
    if (post.user?.id) {
      router.push(`/home/profile?id=${post.user.id}`);
    }
  };

  // Menu handlers
  const handleEdit = () => {
    alert('Edit job ' + post.id);
    setShowMenu(false);
  };

  const handleDelete = () => {
    alert('Delete job ' + post.id);
    setShowMenu(false);
  };

  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportLoading, setReportLoading] = useState(false);

  const handleReport = () => {
    setShowMenu(false);
    setShowReportDialog(true);
  };

  const submitReport = async () => {
    if (!reportReason.trim()) return;
    setReportLoading(true);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/reports/post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          reported_post_id: post.id,
          reason: reportReason,
        }),
      });
      setShowReportDialog(false);
      setReportReason("");
    } catch {
      // handle error
    }
    setReportLoading(false);
  };

  const handleLikeToggle = async () => {
    console.log('Like button clicked for post:', post.id);
    if (likeLoading) return;
    setLikeLoading(true);
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    try {
      if (!liked) {
        // Like
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/posts/like`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify({ post_id: post.id }),
        });
        if (res.ok) {
          setLikes(likes + 1);
          setLiked(true);
        }
      } else {
        // Dislike
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/posts/dislike`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify({ post_id: post.id }),
        });
        if (res.ok) {
          setLikes(likes > 0 ? likes - 1 : 0);
          setLiked(false);
        }
      }
    } catch {}
    setLikeLoading(false);
  };

  const handleCommentClick = () => {
    console.log('Comment button clicked for post:', post.id);
    router.push(`/home/posts/${post.id}`);
  };

  return (
    <>
      <motion.div
        className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="relative">
          {/* Header: Avatar, Name, Academic Year, Time, Menu */}
          <motion.div
            className="flex items-start justify-between mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {/* Avatar - Clickable */}
              <motion.button
                className="relative flex-shrink-0"
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.3 }}
                onClick={handleUserClick}
              >
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200 transition-colors duration-300">
                  {post.user?.profile_image_url ? (
                    <Image
                      src={post.user.profile_image_url}
                      alt={post.user?.name || "User"}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                      <User className="w-6 h-6 text-purple-600" />
                    </div>
                  )}
                </div>
              </motion.button>

              {/* User Info - Clickable */}
              <motion.button
                className="flex-1 min-w-0 text-left"
                onClick={handleUserClick}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-gray-900 text-sm truncate transition-colors duration-300 cursor-pointer">
                    {post.user?.name || "Unknown"}
                  </h4>
                  {post.user?.acedemic_year && (
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-full flex-shrink-0">
                      <GraduationCap className="w-3 h-3" />
                      <span>Year {post.user.acedemic_year}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>{formatTimeAgo(post.created_at)}</span>
                </div>
              </motion.button>
            </div>

            {/* Menu Button */}
            <div className="relative flex-shrink-0 ml-2">
              <motion.button
                ref={menuButtonRef}
                className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-colors duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu((v) => !v);
                }}
                whileTap={{ scale: 0.95 }}
              >
                <MoreHorizontal className="w-4 h-4" />
              </motion.button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {showMenu && (
                  <motion.div
                    ref={menuRef}
                    className="absolute right-0 top-full mt-2 w-40 bg-white border border-gray-200 rounded-xl shadow-2xl z-20 overflow-hidden"
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isCurrentUser ? (
                      <>
                        <motion.button
                          className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
                          onClick={handleEdit}
                        >
                          <Edit3 className="w-4 h-4" />
                          <span className="text-sm font-medium">Edit</span>
                        </motion.button>
                        <motion.button
                          className="w-full text-left px-4 py-3 hover:bg-red-50 flex items-center gap-2 text-gray-700 hover:text-red-600 transition-colors duration-200"
                          onClick={handleDelete}
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="text-sm font-medium">Delete</span>
                        </motion.button>
                      </>
                    ) : (
                      <motion.button
                        className="w-full text-left px-4 py-3 hover:bg-red-50 flex items-center gap-2 text-gray-700 hover:text-red-600 transition-colors duration-200"
                        onClick={handleReport}
                      >
                        <Flag className="w-4 h-4" />
                        <span className="text-sm font-medium">Report</span>
                      </motion.button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Content */}
          <motion.button
            className="text-gray-800 leading-relaxed mb-4 text-left w-full hover:bg-gray-50/50 rounded-lg p-2 -ml-2 transition-colors duration-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            onClick={() => setIsExpanded(!isExpanded)}
            whileTap={{ scale: 0.99 }}
          >
            <p className={`whitespace-pre-wrap overflow-hidden transition-all duration-300 ${
              isExpanded ? '' : 'line-clamp-2'
            }`}>
              {post.content}
            </p>
            {!isExpanded && post.content.length > 100 && (
              <div className="text-blue-600 text-sm font-medium mt-2 hover:text-blue-700 transition-colors duration-200">
                Click to read more...
              </div>
            )}
            {isExpanded && (
              <div className="text-blue-600 text-sm font-medium mt-2 hover:text-blue-700 transition-colors duration-200">
                Click to show less
              </div>
            )}
          </motion.button>

          {/* Attachments */}
          {post.post_attachments && post.post_attachments.length > 0 && (
            <motion.div
              className="mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div className={`grid gap-3 ${
                post.post_attachments.length === 1 ? 'grid-cols-1' :
                post.post_attachments.length === 2 ? 'grid-cols-2' :
                'grid-cols-2 lg:grid-cols-3'
              }`}>
                {post.post_attachments.map((url, idx) => (
                  <motion.div
                    key={idx}
                    className="relative cursor-pointer overflow-hidden rounded-xl bg-gray-100 aspect-video border-2 border-gray-200 hover:border-purple-300 transition-colors duration-300"
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setOpenImg(url)}
                  >
                    <Image
                      src={url}
                      alt={`attachment ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                      <motion.div
                        className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300"
                      >
                        <Eye className="w-5 h-5 text-gray-700" />
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Divider */}
          <div className="border-t border-gray-200 my-4"></div>

          {/* Actions: Like & Comment */}
          <motion.div
            className="flex items-center gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {/* Like Button */}
            <motion.button
              className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 ${
                liked 
                  ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              } ${likeLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
              disabled={likeLoading}
              onClick={handleLikeToggle}
              whileTap={{ scale: 0.95 }}
            >
              {likeLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
              )}
              <span className="font-semibold text-sm">{likes}</span>
            </motion.button>

            {/* Comment Button */}
            <motion.button
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 border border-transparent transition-all duration-300 cursor-pointer"
              onClick={handleCommentClick}
              whileTap={{ scale: 0.95 }}
              title="View comments"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="font-semibold text-sm">{post.comments || 0}</span>
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* Image Modal */}
      <AnimatePresence>
        {openImg && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 cursor-zoom-out p-4"
            onClick={() => setOpenImg(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="relative max-w-4xl max-h-full"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={openImg}
                alt="Full size image"
                width={800}
                height={600}
                className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
              />
              <motion.button
                className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors duration-300"
                onClick={() => setOpenImg(null)}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5" />
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Report Dialog */}
      <AnimatePresence>
        {showReportDialog && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-red-100 p-2.5">
                  <Flag className="w-full h-full text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Report Post</h3>
                  <p className="text-sm text-gray-600">Help us understand the issue</p>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for report
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-300 resize-none"
                  rows={3}
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  placeholder="Describe the reason for reporting this post..."
                  disabled={reportLoading}
                />
              </div>

              <div className="flex gap-3">
                <motion.button
                  className={`flex-1 py-3 px-4 rounded-xl font-semibold text-white transition-all duration-300 ${
                    reportLoading || !reportReason.trim()
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-red-600 hover:bg-red-700 shadow-lg hover:shadow-xl'
                  }`}
                  disabled={reportLoading || !reportReason.trim()}
                  onClick={submitReport}
                  whileTap={{ scale: 0.98 }}
                >
                  {reportLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Reporting...</span>
                    </div>
                  ) : (
                    'Report'
                  )}
                </motion.button>
                <motion.button
                  className="flex-1 py-3 px-4 rounded-xl font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-300"
                  onClick={() => {
                    setShowReportDialog(false);
                    setReportReason("");
                  }}
                  disabled={reportLoading}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PostCard;