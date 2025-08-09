"use client";
import React, { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Loader2, FileText, Plus } from "lucide-react";
import PostCard from "@/components/home/PostCard";
import type { Post } from "@/types/post";
import PostSearchBar from "@/components/home/PostSearchBar";

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
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  // Filter posts based on search
  React.useEffect(() => {
    if (!debouncedSearch.trim()) {
      setPosts(backupPosts);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    const filtered = backupPosts.filter(post =>
      post.content?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      post.user?.name?.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
    
    setTimeout(() => {
      setPosts(filtered);
      setLoading(false);
    }, 100);
  }, [debouncedSearch, backupPosts]);

  // Loading Component
  const LoadingComponent = () => (
    <motion.div
      className="flex items-center justify-center py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg">
        <div className="flex flex-col items-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600 mb-4" />
          <span className="text-gray-600 font-medium">Loading posts...</span>
        </div>
      </div>
    </motion.div>
  );

  // Error Component
  const ErrorComponent = ({ message }: { message: string }) => (
    <motion.div
      className="flex items-center justify-center py-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="bg-white rounded-2xl border border-red-200 p-8 shadow-lg max-w-md">
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-6 h-6 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h3>
          <p className="text-red-600 text-sm">{message}</p>
        </div>
      </div>
    </motion.div>
  );

  // Empty State Component
  const EmptyStateComponent = () => (
    <motion.div
      className="flex items-center justify-center py-16"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="bg-white rounded-2xl border border-gray-200 p-12 shadow-lg max-w-lg text-center">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FileText className="w-8 h-8 text-purple-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">No posts found</h3>
        <p className="text-gray-600 mb-6">
          {search ? "No posts match your search criteria." : "You haven't added any posts yet."}
        </p>
        {!search && (
          <motion.button
            onClick={handleAddPost}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 mx-auto"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-5 h-5" />
            Create your first post
          </motion.button>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4">
      <PostSearchBar
        search={search}
        setSearch={setSearch}
        onAddPost={handleAddPost}
      />

      <AnimatePresence mode="wait">
        {loading && posts.length === 0 ? (
          <LoadingComponent key="loading" />
        ) : error ? (
          <ErrorComponent key="error" message={error} />
        ) : posts && posts.length === 0 ? (
          <EmptyStateComponent key="empty" />
        ) : posts && posts.length > 0 ? (
          <motion.div
            key="posts"
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            {posts.map((post, index) => {
              const uniqueKey = `${post.id}-${index}`;
              if (index === posts.length - 1) {
                return (
                  <motion.div
                    ref={lastElementRef}
                    key={uniqueKey}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                  >
                    <PostCard post={post} />
                  </motion.div>
                );
              } else {
                return (
                  <motion.div
                    key={uniqueKey}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                  >
                    <PostCard post={post} />
                  </motion.div>
                );
              }
            })}
            
            {/* Load More Indicator */}
            {loading && posts.length > 0 && (
              <motion.div
                className="flex items-center justify-center py-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-3 bg-white rounded-full border border-gray-200 px-6 py-3 shadow-lg">
                  <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
                  <span className="text-gray-600 font-medium">Loading more posts...</span>
                </div>
              </motion.div>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default PostsList;
