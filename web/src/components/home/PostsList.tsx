"use client";
import React, { useState, useCallback, useRef } from "react";
import PostCard from "@/components/home/PostCard";
import type { Post } from "@/types/post";
import PostSearchBar from "@/components/home/PostSearchBar";
import Loading from "@/components/general/Loading";
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

interface PostsListProps {
  initialSearch?: string;
}

const PostsList: React.FC<PostsListProps> = ({ initialSearch = "" }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [backupPosts, setBackupPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  // Track if component is mounted for cleanup
  const isMounted = useRef(false);

  // Prevent infinite loop by only calling setPage when not loading and hasMore
  const lastElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loading || !hasMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const handleAddPost = () => {
    if (typeof window !== "undefined") {
      window.location.href = "/home/posts/create";
    }
  };

  const fetchAllPosts = async () => {
    setLoading(true);
    setError(null);
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    try {
      const res = await fetch(`${baseUrl}/posts/?page=${page}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      if (!res.ok) {
        let msg = `Error fetching post: ${res.status} ${res.statusText}`;
        try {
          const data = await res.json();
          if (data?.message) msg = data.message;
        } catch {}
        setError(msg);
       
        return;
      }
      const data = await res.json();
      setPosts(prev => {
        return [...prev, ...(data.posts || [])];
      });
      setBackupPosts(prev => [...prev, ...(data.posts || [])]);
      setHasMore(data.next || false);
    } catch (e) {
      setError("Failed to fetch posts." + e);
     
    }
    setLoading(false);
  };

  // Reset posts and pagination when component mounts or remounts
  React.useEffect(() => {
    setPosts([]);
    setBackupPosts([]);
    setPage(1);
    setHasMore(false);
    setError(null);
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Only fetch when page changes, not on every render
  React.useEffect(() => {
    if (!isMounted.current) return;
    fetchAllPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // Debounced search effect: triggers search when user stops typing
  React.useEffect(() => {
    // Debounce search input and update debouncedSearch only once after user stops typing
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  // Only send search request when debouncedSearch changes
  React.useEffect(() => {
    if (!debouncedSearch.trim()) return;
    if (!backupPosts.length && posts.length) {
      setBackupPosts(posts);
    }
    setLoading(true);
    setError(null);
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    fetch(`${baseUrl}/posts/search?q=${encodeURIComponent(debouncedSearch)}&page=1`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    })
      .then(async res => {
        if (!res.ok) {
          let msg = `Error fetching post: ${res.status} ${res.statusText}`;
          try {
            const data = await res.json();
            if (data?.message) msg = data.message;
          } catch {}
          setError(msg);
          setLoading(false);
          return;
        }
        const data = await res.json();
        setPosts(data.posts || []);
        setHasMore(data.next || false);
        setLoading(false);
      })
      .catch(e => {
        setError("Failed to fetch posts." + e);
        setLoading(false);
      });
  }, [debouncedSearch]);

  // Restore backup when search is cleared
  React.useEffect(() => {
    if (search.trim() === "" && backupPosts.length) {
      setLoading(true);
      setPosts(backupPosts);
      setTimeout(() => setLoading(false), 100); // allow posts to render before hiding loading
    } else if (search.trim() === "") {
      // If search is empty and no backup, don't clear posts
      setLoading(false);
    } else {
      setLoading(true);
      setPosts([]);
      setTimeout(() => setLoading(false), 100);
    }
  }, [search, backupPosts]);

  return (
    <>
      <PostSearchBar
        search={search}
        setSearch={setSearch}
        onAddPost={handleAddPost}
        
      />
      {loading && posts.length === 0 ? (
        <Loading />
      ) : error ? (
        <div className="text-center mt-16 text-[#d32f2f] font-semibold text-[18px]">{error}</div>
      ) : posts && posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-16 gap-4">
          <div className="text-[2rem] font-bold text-[#4320d1] mb-2">No posts found</div>
          <div className="text-[#888] text-[1.08rem] mb-2">You haven't added any posts yet.</div>
          <div className="text-[#aaa] text-[0.98rem]">Click the Add Post button above to create your first post!</div>
        </div>
      ) : posts && posts.length > 0 ? (
        <div className="max-w-[900px] mx-auto mt-10 px-6 font-poppins">
          {posts.map((post, index) => {
            const uniqueKey = `${post.id}-${index}`;
            if (index === posts.length - 1) {
              return (
                <div ref={lastElementRef} key={uniqueKey}>
                  <PostCard post={post} />
                </div>
              );
            } else {
              return <PostCard post={post} key={uniqueKey} />;
            }
          })}
          {loading && posts.length > 0 && (
            <div className="text-center mt-6">Loading more...</div>
          )}
        </div>
      ) : null}
    </>
  );
};

export default PostsList;
