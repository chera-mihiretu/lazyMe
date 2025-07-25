import React, { useState } from "react";
import type { Post } from "@/types/Post";
import { formatTimeAgo } from "@/app/helpers/time_formatter";

const PostCard: React.FC<{ post: Post }> = ({ post }) => {
  const [openImg, setOpenImg] = useState<string | null>(null);
  const [likes, setLikes] = useState(post.likes || 0);
  const [liked, setLiked] = useState(post.liked || false);
  const [likeLoading, setLikeLoading] = useState(false);

  return (
    <div
      className="bg-white rounded-2xl shadow-[0_2px_16px_#4320d10a] p-8 relative mb-8 font-poppins"
    >
      {/* Header: Avatar, Name, Academic Year, Time */}
      <div className="flex items-center mb-4">
        <img
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
            <img
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
          <img
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
          <img src={liked ? "/icons/liked.png" : "/icons/like.png"} alt="like" width={30} height={30} />
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
          <img src="/icons/comment.png" alt="comment" width={30} height={30} />
          <span className="text-[20px] text-[#4320d1] font-semibold">{post.comments}</span>
        </span>
      </div>
    </div>
  );
};

export default PostCard;