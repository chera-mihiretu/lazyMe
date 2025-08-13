"use client";

import React from "react";
import Navbar from "@/components/admin/Navbar";
import ProtectedRoute from "@/app/ProtectedRoute";
import { motion } from "framer-motion";
import { Sparkles, CheckCircle2, Trash2, Loader2 } from "lucide-react";
import Image from "next/image";
import { formatTimeAgo } from "@/app/helpers/time_formatter";
import type { Post } from "@/types/post";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

type TabType = "post" | "job";

type UnverifiedPostsResponse = {
  next: boolean;
  posts: Post[];
};

function useUnverifiedPosts() {
  const [items, setItems] = React.useState<Post[]>([]);
  const [page, setPage] = React.useState<number>(1);
  const [hasNext, setHasNext] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");

  const fetchPage = React.useCallback(async (reset: boolean = false) => {
    if (!baseUrl) return;
    setLoading(true);
    setError("");
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const currentPage = reset ? 1 : page;
      const res = await fetch(`${baseUrl}/posts/unverified?page=${currentPage}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      const data: UnverifiedPostsResponse = await res.json();
      if (!res.ok) {
        const msg = (data as unknown as { message?: string })?.message || "Failed to fetch unverified posts";
        throw new Error(msg);
      }
      setItems(prev => (reset ? (data.posts || []) : [...prev, ...(data.posts || [])]));
      setHasNext(Boolean(data.next));
      setPage(currentPage + 1);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch unverified posts");
    } finally {
      setLoading(false);
    }
  }, [page]);

  const removeItem = React.useCallback((id: string) => {
    setItems(prev => prev.filter(p => p.id !== id));
  }, []);

  const resetAndRefetch = React.useCallback(() => {
    setItems([]);
    setPage(1);
    setHasNext(false);
    fetchPage(true);
  }, [fetchPage]);

  React.useEffect(() => {
    resetAndRefetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { items, loading, error, hasNext, fetchPage, removeItem, resetAndRefetch };
}

async function verifyPost(id: string) {
  if (!baseUrl) throw new Error("Base URL not configured");
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const res = await fetch(`${baseUrl}/posts/verify?id=${encodeURIComponent(id)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: token ? `Bearer ${token}` : "" },
  });
  if (!res.ok) {
    let msg = "Failed to verify post";
    try { const data = await res.json(); msg = data?.message || msg; } catch {}
    throw new Error(msg);
  }
}

async function deleteUnverified(id: string) {
  if (!baseUrl) throw new Error("Base URL not configured");
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const res = await fetch(`${baseUrl}/posts/remove-unverified?id=${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json", Authorization: token ? `Bearer ${token}` : "" },
  });
  if (!res.ok) {
    let msg = "Failed to delete unverified post";
    try { const data = await res.json(); msg = data?.message || msg; } catch {}
    throw new Error(msg);
  }
}

function PostRow({ post, onVerify, onDelete }: { post: Post; onVerify: (id: string) => Promise<void>; onDelete: (id: string) => Promise<void>; }) {
  const [loadingAction, setLoadingAction] = React.useState<string>("");
  const [err, setErr] = React.useState<string>("");

  const handleVerify = async () => {
    setErr(""); setLoadingAction("verify");
    try { await onVerify(post.id); } catch (e) { setErr(e instanceof Error ? e.message : "Action failed"); }
    setLoadingAction("");
  };

  const handleDelete = async () => {
    setErr(""); setLoadingAction("delete");
    try { await onDelete(post.id); } catch (e) { setErr(e instanceof Error ? e.message : "Action failed"); }
    setLoadingAction("");
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-200 flex-shrink-0">
            {post.user?.profile_image_url ? (
              <Image src={post.user.profile_image_url} alt={post.user?.name || "User"} width={40} height={40} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-100 to-blue-100" />
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div className="font-semibold text-gray-900 truncate">{post.user?.name || "Unknown"}</div>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">Post</span>
            </div>
            <div className="text-xs text-gray-500">{formatTimeAgo(post.created_at)}</div>
            <div className="mt-2 text-gray-800 line-clamp-2 whitespace-pre-wrap">{post.content}</div>
          </div>
        </div>
        <div className="flex flex-col gap-2 items-end">
          <button onClick={handleVerify} disabled={loadingAction === "verify"} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-green-200 text-green-700 bg-green-50 hover:bg-green-100 hover:border-green-300 transition disabled:opacity-50">
            {loadingAction === "verify" ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            Verify
          </button>
          <button onClick={handleDelete} disabled={loadingAction === "delete"} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-red-200 text-red-700 bg-red-50 hover:bg-red-100 hover:border-red-300 transition disabled:opacity-50">
            {loadingAction === "delete" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            Delete
          </button>
          {err ? <div className="text-xs text-red-600 mt-1 max-w-[220px] text-right">{err}</div> : null}
        </div>
      </div>
    </div>
  );
}

const UnverifiedPostsPage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<TabType>("post");
  const posts = useUnverifiedPosts();

  const handleVerify = React.useCallback(async (id: string) => {
    await verifyPost(id);
    posts.removeItem(id);
  }, [posts]);

  const handleDelete = React.useCallback(async (id: string) => {
    await deleteUnverified(id);
    posts.removeItem(id);
  }, [posts]);

  return (
    <ProtectedRoute role="admin">
      <div className="min-h-screen bg-white relative">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50"></div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,.02)_1px,transparent_1px)] bg-[size:100px_100px]"></div>
        </div>

        <Navbar />

        <div className="relative z-10 max-w-7xl mx-auto p-6 pt-8">
          <motion.div className="text-center mb-8" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <motion.div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-100 border border-purple-200 text-purple-700 text-sm font-medium mb-4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.6 }}>
              <Sparkles className="w-4 h-4 mr-2" />
              Unverified Center
            </motion.div>
            <motion.h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}>
              Validate
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"> Content</span>
            </motion.h1>
            <motion.p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }}>
              Review and verify content awaiting approval.
            </motion.p>
          </motion.div>

          {/* Tabs */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <button onClick={() => setActiveTab("post")} className={`px-5 py-2 text-sm font-semibold transition ${activeTab === "post" ? "bg-indigo-600 text-white" : "text-gray-800 hover:bg-gray-50"}`}>Post</button>
              <button onClick={() => setActiveTab("job")} className={`px-5 py-2 text-sm font-semibold transition border-l border-gray-200 ${activeTab === "job" ? "bg-indigo-600 text-white" : "text-gray-800 hover:bg-gray-50"}`}>Job</button>
            </div>
          </div>

          {/* Content */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-4xl mx-auto">
            {activeTab === "post" ? (
              <div className="grid gap-3">
                {posts.items.map(p => (
                  <PostRow key={p.id} post={p} onVerify={handleVerify} onDelete={handleDelete} />
                ))}
                {posts.loading && posts.items.length === 0 ? (
                  <div className="mt-6 flex items-center gap-2 text-gray-600"><Loader2 className="w-4 h-4 animate-spin" /><span>Loading unverified posts...</span></div>
                ) : null}
                <div className="mt-2">
                  {posts.hasNext ? (
                    <button onClick={() => posts.fetchPage()} disabled={posts.loading} className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 hover:bg-gray-50 disabled:opacity-50">
                      {posts.loading ? "Loading..." : "Load more"}
                    </button>
                  ) : (
                    !posts.loading && posts.items.length > 0 ? <p className="text-sm text-gray-500">No more posts</p> : null
                  )}
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-500 text-center py-10">Job tab coming soon.</div>
            )}
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default UnverifiedPostsPage;
