import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  MoreHorizontal, 
  Edit3, 
  Trash2, 
  Flag, 
  AlertTriangle, 
  User, 
  Loader2, 
  ExternalLink,
  Clock,
  Building,
  GraduationCap,
  Globe,
  Briefcase,
  Send
} from 'lucide-react';
import { formatTimeAgo } from '@/app/helpers/time_formatter';
import Image from "next/image";
import type { User as UserType } from '../../../types/post';
import { useRouter } from 'next/navigation';

export interface JobPost {
  id: string;
  department_ids: string[];
  title: string;
  description: string;
  like: number;
  link: string;
  type: string;
  user: UserType;
  created_at: string;
  liked: boolean;
}

const JobCard: React.FC<{ job: JobPost }> = ({ job }) => {
  const avatar = job.user?.profile_image_url || '/icons/avatar.png';
  const [likes, setLikes] = useState(job.like || 0);
  const [liked, setLiked] = useState(job.liked || false);
  const [error, setError] = useState<string | null>(null);
  const [likeLoading, setLikeLoading] = useState(false);
  const router = useRouter();

  // Navigation handler for user profiles
  const handleUserClick = () => {
    if (job.user?.id) {
      router.push(`/home/profile?id=${job.user.id}`);
    }
  };

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

  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportLoading, setReportLoading] = useState(false);
  
  const getUserID = () => (typeof window !== 'undefined' ? localStorage.getItem('user_id') : null);
  const isCurrentUser = getUserID() === job.user?.id;

  const handleEdit = () => {
    alert('Edit job ' + job.id);
    setShowMenu(false);
  };
  
  const handleDelete = () => {
    alert('Delete job ' + job.id);
    setShowMenu(false);
  };
  
  const handleReport = () => {
    setShowMenu(false);
    setShowReportDialog(true);
  };
  
  const submitReport = async () => {
    if (!reportReason.trim()) return;
    setReportLoading(true);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/reports/joba`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          reported_post_id: job.id,
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

  // Microlink.io Link Preview
  interface MicrolinkData {
    url?: string;
    title?: string;
    description?: string;
    image?: { url: string };
  }
  const [microlink, setMicrolink] = React.useState<MicrolinkData | null>(null);
  const [microlinkLoading, setMicrolinkLoading] = React.useState(false);
  const [microlinkError, setMicrolinkError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!job.link) return;
    setMicrolink(null);
    setMicrolinkError(null);
    setMicrolinkLoading(true);
    fetch(`https://api.microlink.io/?url=${encodeURIComponent(job.link)}`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setMicrolink(data.data);
        } else {
          setMicrolinkError('Preview not available.');
        }
      })
      .catch(() => setMicrolinkError('Preview not available.'))
      .finally(() => setMicrolinkLoading(false));
  }, [job.link]);

  const renderLinkPreview = () => {
    if (!job.link) {
      return (
        <motion.div 
          className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl mb-4"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
          <p className="text-amber-700 text-sm">No link provided for this job post.</p>
        </motion.div>
      );
    }
    
    if (job.link.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i)) {
      return (
        <motion.div 
          className="mb-4 rounded-xl overflow-hidden border border-gray-200"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Image 
            src={job.link} 
            alt="Job Attachment" 
            width={600} 
            height={260} 
            className="w-full max-h-64 object-contain"
          />
        </motion.div>
      );
    }
    
    if (microlinkLoading) {
      return (
        <motion.div 
          className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
          <p className="text-blue-700 text-sm">Loading preview...</p>
        </motion.div>
      );
    }
    
    if (microlinkError) {
      return (
        <motion.div 
          className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-red-700 text-sm">{microlinkError}</p>
        </motion.div>
      );
    }
    
    if (microlink) {
      return (
        <motion.a 
          href={job.link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="block mb-4 group"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50/30 transition-all duration-300">
            {microlink.image && (
              <div className="flex-shrink-0">
                <Image 
                  src={microlink.image.url} 
                  alt="preview" 
                  width={60} 
                  height={60} 
                  className="object-cover rounded-lg border border-gray-200"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors duration-300 truncate">
                {microlink.title || microlink.url}
              </h4>
              <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                {microlink.description}
              </p>
              <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                <Globe className="w-3 h-3" />
                <span>{microlink.url ? new URL(microlink.url).hostname : ''}</span>
              </div>
            </div>
            <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors duration-300" />
          </div>
        </motion.a>
      );
    }
    return null;
  };

  const handleLike = async () => {
    if (likeLoading) return;
    
    setLikeLoading(true);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const url = liked ? `${baseUrl}/jobs/dislike` : `${baseUrl}/jobs/like`;
    const body = JSON.stringify({ post_id: job.id });
    
    try {
      // Optimistic update
      if (liked) {
        setLikes(likes - 1);
        setLiked(false);
      } else {
        setLikes(likes + 1);
        setLiked(true);
      }
      
      await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body,
      });
    } catch (e) {
      console.error(e);
      // Revert on error
      if (liked) {
        setLikes(likes + 1);
        setLiked(true);
      } else {
        setLikes(likes - 1);
        setLiked(false);
      }
      setError('Failed to update like. Please try again.');
    }
    setLikeLoading(false);
  };

  return (
    <motion.div
      className="group bg-white rounded-2xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300 relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -2 }}
    >
      {/* Background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 via-purple-50/0 to-blue-50/0 group-hover:from-blue-50/30 group-hover:via-purple-50/20 group-hover:to-blue-50/30 rounded-2xl transition-all duration-500" />
      
      <div className="relative">
        {/* Header: Avatar, Name, Date, Menu */}
        <motion.div 
          className="flex items-center justify-between mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <motion.button
              className="relative flex-shrink-0"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              onClick={handleUserClick}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200 group-hover:border-blue-300 transition-colors duration-300">
                {job.user?.profile_image_url ? (
                  <Image
                    src={avatar}
                    alt={job.user?.name || 'User'}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                )}
              </div>
            </motion.button>

            {/* User Info */}
            <motion.button
              className="text-left"
              onClick={handleUserClick}
              whileHover={{ x: 2 }}
              transition={{ duration: 0.2 }}
            >
              <h4 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors duration-300 hover:text-blue-700 cursor-pointer">
                {job.user?.name || 'Unknown User'}
              </h4>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                {job.user?.department && (
                  <span className="flex items-center gap-1">
                    <GraduationCap className="w-3 h-3" />
                    {job.user.department}
                  </span>
                )}
                {job.user?.school && (
                  <span className="flex items-center gap-1">
                    <Building className="w-3 h-3" />
                    {job.user.school}
                  </span>
                )}
              </div>
            </motion.button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>{formatTimeAgo(job.created_at)}</span>
            </div>
            
            {/* Menu Button */}
            <motion.button
              ref={menuButtonRef}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-300 opacity-0 group-hover:opacity-100"
              onClick={e => {
                e.stopPropagation();
                setShowMenu(v => !v);
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <MoreHorizontal className="w-5 h-5 text-gray-600" />
            </motion.button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {showMenu && (
                <motion.div
                  ref={menuRef}
                  className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden"
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {isCurrentUser ? (
                    <>
                      <motion.button
                        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200"
                        onClick={handleEdit}
                        whileHover={{ x: 4 }}
                      >
                        <Edit3 className="w-4 h-4 text-blue-600" />
                        <span className="text-gray-900">Edit</span>
                      </motion.button>
                      <motion.button
                        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-red-50 transition-colors duration-200"
                        onClick={handleDelete}
                        whileHover={{ x: 4 }}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                        <span className="text-red-600">Delete</span>
                      </motion.button>
                    </>
                  ) : (
                    <motion.button
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-red-50 transition-colors duration-200"
                      onClick={handleReport}
                      whileHover={{ x: 4 }}
                    >
                      <Flag className="w-4 h-4 text-red-500" />
                      <span className="text-red-600">Report</span>
                    </motion.button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Job Type Badge */}
        {job.type && (
          <motion.div
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-3"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <Briefcase className="w-3 h-3" />
            {job.type}
          </motion.div>
        )}

        {/* Title */}
        <motion.h3 
          className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors duration-300"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          {job.title}
        </motion.h3>

        {/* Description */}
        <motion.div 
          className="text-gray-700 mb-4 leading-relaxed"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <p className="whitespace-pre-wrap">{job.description}</p>
        </motion.div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl mb-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Link Preview */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          {renderLinkPreview()}
        </motion.div>

        {/* Actions */}
        <motion.div 
          className="flex items-center justify-between pt-4 border-t border-gray-200"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          {/* Like Button */}
          <motion.button
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 ${
              liked 
                ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
            onClick={handleLike}
            disabled={likeLoading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {likeLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
            )}
            <span className="font-semibold">{likes}</span>
          </motion.button>

          {/* Apply Button */}
          <motion.a
            href={job.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Send className="w-4 h-4" />
            Apply Now
          </motion.a>
        </motion.div>
      </div>

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
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-red-100 p-2.5">
                  <Flag className="w-full h-full text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Report Job</h3>
                  <p className="text-sm text-gray-600">Help us keep the community safe</p>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for report
                </label>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-300 resize-none"
                  rows={3}
                  value={reportReason}
                  onChange={e => setReportReason(e.target.value)}
                  placeholder="Describe the reason for reporting this job..."
                  disabled={reportLoading}
                />
              </div>
              
              <div className="flex gap-3">
                <motion.button
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors duration-300"
                  onClick={() => { setShowReportDialog(false); setReportReason(''); }}
                  disabled={reportLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    reportLoading || !reportReason.trim()
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-red-600 text-white hover:bg-red-700 shadow-lg hover:shadow-xl'
                  }`}
                  disabled={reportLoading || !reportReason.trim()}
                  onClick={submitReport}
                  whileHover={reportLoading || !reportReason.trim() ? {} : { scale: 1.02 }}
                  whileTap={reportLoading || !reportReason.trim() ? {} : { scale: 0.98 }}
                >
                  {reportLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Reporting...
                    </>
                  ) : (
                    <>
                      <Flag className="w-4 h-4" />
                      Report
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default JobCard;
