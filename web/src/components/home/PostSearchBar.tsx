import React from "react";

interface PostSearchBarProps {
  search: string;
  setSearch: (value: string) => void;
  onAddPost: () => void;
}

const PostSearchBar: React.FC<PostSearchBarProps> = ({ search, setSearch, onAddPost }) => (
  <div
    style={{
      maxWidth: 650,
      margin: "2.5rem auto 28px auto",
      padding: "0.5rem 1rem",
      background: "#f7f7fb",
      borderRadius: 14,
      boxShadow: "0 4px 24px #4320d10a",
      border: "1.5px solid #ececff",
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: 10,
      alignItems: "stretch",
      fontFamily: "Poppins, sans-serif",
    }}
  >
    <div style={{ position: "relative", flex: 1 }}>
      <span
        style={{
          position: "absolute",
          left: 16,
          top: "50%",
          transform: "translateY(-50%)",
          color: "#8080a0",
          fontSize: 20,
          pointerEvents: "none",
        }}
      >
        <svg width="20" height="20" fill="none" stroke="#8080a0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="9" r="7" />
          <line x1="16" y1="16" x2="13.5" y2="13.5" />
        </svg>
      </span>
      <input
        type="text"
        placeholder="Search campus posts, events, or announcements..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "0.85rem 1.1rem 0.85rem 2.8rem",
          border: "none",
          borderRadius: 10,
          fontSize: "1.08rem",
          fontFamily: "Poppins, sans-serif",
          background: "#e0e0f0",
          color: "#222",
          outline: "none",
          boxShadow: "none",
          transition: "background 0.2s",
        }}
      />
    </div>
    <button
      title="Create Post"
      style={{
        background: "linear-gradient(90deg, #4320d1 60%, #6a4cff 100%)",
        color: "#fff",
        border: "none",
        borderRadius: "50px",
        width: "100%",
        height: 48,
        fontSize: 16,
        fontWeight: 700,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        boxShadow: "0 4px 16px #4320d13a",
        transition: "background 0.2s, box-shadow 0.2s",
        marginTop: 8,
        gap: 10,
      }}
      onClick={onAddPost}
    >
      Add Post
    </button>
  </div>
);

export default PostSearchBar;