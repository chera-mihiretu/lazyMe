import React from "react";

interface PostSearchBarProps {
  search: string;
  setSearch: (value: string) => void;
  onAddPost: () => void;
  onSearchSubmit?: () => void;
}


const PostSearchBar: React.FC<PostSearchBarProps> = ({ search, setSearch, onAddPost, onSearchSubmit }) => (
  <div
    className="max-w-[650px] mx-auto mt-10 mb-7 px-4 py-2 bg-[#f7f7fb] rounded-[14px] shadow-[0_4px_24px_#4320d10a] border border-[#ececff] flex flex-col gap-2 font-poppins"
  >
    <div className="relative flex-1">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8080a0] text-[20px] pointer-events-none">
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
        onKeyDown={e => {
          if (e.key === "Enter" && onSearchSubmit) onSearchSubmit();
        }}
        className="w-full pl-11 pr-5 py-3 rounded-[10px] text-[1.08rem] font-poppins bg-[#e0e0f0] text-[#222] outline-none transition-colors"
      />
    </div>
    <button
      title="Create Post"
      className="bg-gradient-to-r from-[#4320d1] to-[#6a4cff] text-white border-none rounded-full w-full h-12 text-[16px] font-bold flex items-center justify-center cursor-pointer shadow-[0_4px_16px_#4320d13a] transition-all mt-2 gap-2"
      onClick={onAddPost}
    >
      Add Post
    </button>
  </div>
);

export default PostSearchBar;