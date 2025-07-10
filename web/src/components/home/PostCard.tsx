import React, { useState } from "react";
import type { Post } from "@/types/Post";
import { formatTimeAgo } from "@/app/helpers/time_formatter";

const PostCard: React.FC<{ post: Post }> = ({ post }) => {
  const [openImg, setOpenImg] = useState<string | null>(null);

  return (
    <div
      style={{
        background: "#f7f8fa",
        borderRadius: 18,
        boxShadow: "0 2px 16px #4320d10a",
        padding: 32,
        position: "relative",
        marginBottom: 32,
        fontFamily: "Poppins, sans-serif",
        border: "1.5px solid #e3e6ef",
        transition: "box-shadow 0.2s, border 0.2s",
      }}
    >
      {/* Header: Avatar, Name, Academic Year, Time */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: 18 }}>
        <img
          src={post.user?.profile_image_url || "/icons/avatar.png"}
          alt={post.user?.name || "User"}
          width={48}
          height={48}
          style={{
            borderRadius: "50%",
            objectFit: "cover",
            marginRight: 14,
            background: "#ececff",
            border: "2px solid #ececff",
          }}
        />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontWeight: 600, fontSize: 17, color: "#222" }}>
            {post.user?.name || "Unknown"}
          </span>
          <span style={{ fontSize: 14, color: "#888" }}>
            {post.user?.acedemic_year ? `Year ${post.user.acedemic_year}` : ""}
          </span>
        </div>
        <span style={{ color: "#aaa", fontSize: 14, marginLeft: "auto" }}>
          {formatTimeAgo(post.created_at)}
        </span>
      </div>
      {/* Title */}
      <div
        style={{
          color: "#222",
          marginBottom: 10,
          lineHeight: 1.2,
        }}
      >
        {post.content}
      </div>
      {/* Attachments */}
      {post.post_attachments && post.post_attachments.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
            margin: "18px 0",
            justifyContent:
              post.post_attachments.length === 1
                ? "flex-start"
                : post.post_attachments.length === 2
                ? "space-between"
                : "center",
          }}
        >
          {post.post_attachments.map((url, idx) => (
            <img
              key={idx}
              src={url}
              alt="attachment"
              onClick={() => setOpenImg(url)}
              style={{
                cursor: "pointer",
                width:
                  post.post_attachments.length === 1
                    ? "100%"
                    : post.post_attachments.length === 2
                    ? "48%"
                    : "32%",
                maxWidth: 400,
                minWidth: 120,
                maxHeight: 320,
                borderRadius: 12,
                objectFit: "cover",
                background: "#f0f0f0",
                flex: "1 1 0",
                transition: "box-shadow 0.2s",
                boxShadow: "0 2px 8px #4320d120",
              }}
            />
          ))}
        </div>
      )}
      {/* Image Modal */}
      {openImg && (
        <div
          onClick={() => setOpenImg(null)}
          style={{
            position: "fixed",
            zIndex: 1000,
            left: 0,
            top: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(30,30,40,0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "zoom-out",
          }}
        >
          <img
            src={openImg}
            alt="full"
            style={{
              maxWidth: "90vw",
              maxHeight: "90vh",
              borderRadius: 16,
              boxShadow: "0 8px 32px #0008",
              background: "#fff",
            }}
          />
        </div>
      )}
      {/* Like & Comment */}
      <div style={{ display: "flex", alignItems: "center", gap: 40, marginTop: 14 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
          <img src="/icons/like.png" alt="like" width={30} height={30} />
          <span style={{ fontSize: 20, color: "#4320d1", fontWeight: 600 }}>{post.likes}</span>
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
          <img src="/icons/comment.png" alt="comment" width={30} height={30} />
          <span style={{ fontSize: 20, color: "#4320d1", fontWeight: 600 }}>{post.comments}</span>
        </span>
      </div>
    </div>
  );
};

export default PostCard;