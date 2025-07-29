import React, { useState } from "react";
import type { Post } from "@/types/post";
import { formatTimeAgo } from "@/app/helpers/time_formatter";
import { getUserID } from "@/utils/auth"; // Assuming you have a utility to get the current user ID
import Image from "next/image";
const PostCard: React.FC<{ post: Post }> = ({ post }) => {
  const [openImg, setOpenImg] = useState<string | null>(null);
  const [likes, setLikes] = useState(post.likes || 0);
  const [liked, setLiked] = useState(post.liked || false);
  const [likeLoading, setLikeLoading] = useState(false);

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

  // Menu handlers (extensible)
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

  return (
    <div className="bg-white rounded-2xl shadow-[0_2px_16px_#4320d10a] p-8 relative mb-8 font-poppins">
      {/* Header: Avatar, Name, Academic Year, Time, Menu */}
      <div className="flex items-center mb-4 relative">
        <Image
          src={post.user?.profile_image_url || "/icons/avatar.png"}
          alt={post.user?.name || "User"}
          width={48}
          height={48}
          className="rounded-full object-cover mr-3 bg-[#ececff] border-2 border-[#ececff]"
        />
        <div className="flex flex-col">
          <span className="font-semibold text-[17px] text-[#222]">
            {post.user?.name || "Unknown"}
          </span>
          <span className="text-[14px] text-[#888]">
            {post.user?.acedemic_year ? `Year ${post.user.acedemic_year}` : ""}
          </span>
        </div>
        <span className="text-[#aaa] text-[14px] ml-auto">
          {formatTimeAgo(post.created_at)}
        </span>
        {/* Menu Icon */}
        <div className="relative ml-2">
          <button
            ref={menuButtonRef}
            className="p-2 rounded-full hover:bg-gray-100 focus:outline-none"
            onClick={e => {
              e.stopPropagation();
              setShowMenu((v) => !v);
            }}
          >
            <Image src="/icons/menu.png" alt="menu" width={22} height={22} />
          </button>
          {showMenu && (
            <div
              ref={menuRef}
              className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
            >
              {isCurrentUser ? (
                <>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100" onClick={handleEdit}>Edit</button>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600" onClick={handleDelete}>Delete</button>
                </>
              ) : (
                <>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100" onClick={handleReport}>Report</button>
                </>
              )}
              {/* Room for more options here */}
            </div>
          )}
          {/* Report Dialog */}
          {showReportDialog && (
            <div className="fixed top-0 left-0 w-screen h-screen bg-black/20 flex items-center justify-center z-[1100]">
              <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-auto">
                <h3 className="font-bold text-lg mb-3 text-[#4320d1]">Report Post</h3>
                <label className="block mb-2 font-medium">Reason for report</label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg p-2 mb-3 resize-vertical"
                  rows={3}
                  value={reportReason}
                  onChange={e => setReportReason(e.target.value)}
                  placeholder="Describe the reason..."
                  disabled={reportLoading}
                />
                <div className="flex gap-3 mt-2">
                  <button
                    className={`border-none rounded-lg py-2 font-semibold w-full text-[18px] text-white px-4 block ${reportLoading || !reportReason.trim() ? 'bg-[#aaa] cursor-not-allowed' : 'bg-[#4320d1] cursor-pointer'}`}
                    disabled={reportLoading || !reportReason.trim()}
                    onClick={submitReport}
                  >
                    {reportLoading ? "Reporting..." : "Report"}
                  </button>
                  <button
                    className="bg-[#eee] text-[#4320d1] border-none rounded-lg py-2 font-semibold px-4 w-full block"
                    onClick={() => { setShowReportDialog(false); setReportReason(""); }}
                    disabled={reportLoading}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Title */}
      <div className="text-[#222] mb-2 leading-tight">
        {post.content}
      </div>
      {/* Attachments */}
      {post.post_attachments && post.post_attachments.length > 0 && (
        <div
          className={`flex flex-wrap gap-4 my-4 ${post.post_attachments.length === 1 ? 'justify-start' : post.post_attachments.length === 2 ? 'justify-between' : 'justify-center'}`}
        >
          {post.post_attachments.map((url, idx) => (
            <Image
              key={idx}
              src={url}
              alt="attachment"
              onClick={() => setOpenImg(url)}
              className={`cursor-pointer rounded-xl object-cover bg-[#f0f0f0] flex-1 transition-shadow shadow-[0_2px_8px_#4320d120]`}
              style={{
                width:
                  post.post_attachments.length === 1
                    ? "100%"
                    : post.post_attachments.length === 2
                    ? "48%"
                    : "32%",
                maxWidth: 400,
                minWidth: 120,
                maxHeight: 320,
              }}
            />
          ))}
        </div>
      )}
      {/* Image Modal */}
      {openImg && (
        <div
          onClick={() => setOpenImg(null)}
          className="fixed z-[1000] left-0 top-0 w-screen h-screen bg-[rgba(30,30,40,0.85)] flex items-center justify-center cursor-zoom-out"
        >
          <Image
            src={openImg}
            alt="full"
            className="max-w-[90vw] max-h-[90vh] rounded-2xl shadow-[0_8px_32px_#0008] bg-white"
          />
        </div>
      )}
      <hr/>
      {/* Like & Comment */}
      <div className="flex items-center gap-10 mt-4">
        <button
          className={`flex items-center gap-2 cursor-pointer focus:outline-none ${likeLoading ? 'opacity-60' : ''}`}
          disabled={likeLoading}
          onClick={async () => {
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
          }}
        >
          <Image src={liked ? "/icons/liked.png" : "/icons/like.png"} alt="like" width={30} height={30} />
          <span className="text-[20px] text-[#4320d1] font-semibold">{likes}</span>
        </button>
        <span
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => {
            if (typeof window !== 'undefined') {
              window.location.href = `/home/posts/${post.id}`;
            }
          }}
        >
          <Image src="/icons/comment.png" alt="comment" width={30} height={30} />
          <span className="text-[20px] text-[#4320d1] font-semibold">{post.comments}</span>
        </span>
      </div>
    </div>
  );
};

export default PostCard;