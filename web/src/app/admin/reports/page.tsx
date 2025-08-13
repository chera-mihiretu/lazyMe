"use client";

import React from "react";
import Navbar from "@/components/admin/Navbar";
import ProtectedRoute from "@/app/ProtectedRoute";
import { Loader2, CheckCircle2, EyeOff, Trash2, Sparkles, X, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { formatTimeAgo } from "@/app/helpers/time_formatter";
import { createPortal } from "react-dom";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

type ReportUser = {
  id: string;
  name: string;
  email: string;
  profile_image_url?: string;
};

type ReportedPost = {
  id: string;
  user?: ReportUser;
  content?: string;
  post_attachments?: string[] | null;
  created_at?: string;
};

type ReportedJob = {
  id: string;
  title?: string;
  description?: string;
  link?: string;
  type?: string;
  user?: ReportUser;
  created_at?: string;
};

export type ReportItem = {
  id: string;
  reported_by: ReportUser;
  reported_post?: ReportedPost;
  reported_job?: ReportedJob;
  reason: string;
  reviewed: boolean;
  created_at: string;
};

type ReportsResponse = {
  next: boolean;
  reports: ReportItem[];
};

type ReportType = "post" | "job";

type ActionType = "ignore" | "hide" | "delete";

const ACTION_TYPE_IGNORE: ActionType = "ignore";
const ACTION_TYPE_HIDE: ActionType = "hide";
const ACTION_TYPE_DELETE: ActionType = "delete";

function useReports(reportType: ReportType) {
  const [reports, setReports] = React.useState<ReportItem[]>([]);
  const [page, setPage] = React.useState<number>(1);
  const [hasNext, setHasNext] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");

  const fetchReports = React.useCallback(async (reset: boolean = false) => {
    if (!baseUrl) return;
    setLoading(true);
    setError("");
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const currentPage = reset ? 1 : page;
      const res = await fetch(`${baseUrl}/reports/${reportType}?page=${currentPage}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      const data: ReportsResponse = await res.json();
      if (!res.ok) {
        const msg = (data as unknown as { message?: string })?.message || `Failed to fetch ${reportType} reports`;
        throw new Error(msg);
      }
      setReports(prev => (reset ? (data.reports || []) : [...prev, ...(data.reports || [])]));
      setHasNext(Boolean(data.next));
      setPage(currentPage + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to fetch ${reportType} reports`);
    } finally {
      setLoading(false);
    }
  }, [page, reportType]);

  const removeReport = React.useCallback((id: string) => {
    setReports(prev => prev.filter(r => r.id !== id));
  }, []);

  const resetAndRefetch = React.useCallback(() => {
    setPage(1);
    setHasNext(false);
    setReports([]);
    fetchReports(true);
  }, [fetchReports]);

  React.useEffect(() => {
    // reset and fetch when type changes
    setReports([]);
    setPage(1);
    setHasNext(false);
    setError("");
    // initial fetch
    fetchReports(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportType]);

  return { reports, loading, error, hasNext, fetchReports, removeReport, resetAndRefetch };
}

async function performReportAction(reportType: ReportType, report: ReportItem, action: ActionType, description: string): Promise<void> {
  if (!baseUrl) throw new Error("Base URL not configured");
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const entityId = reportType === "job" ? report.reported_job?.id : report.reported_post?.id;
  const res = await fetch(`${baseUrl}/reports/take-action`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify({ id: entityId, report_id: report.id, action, description }),
  });
  if (!res.ok) {
    let message = `Failed to ${action} report`;
    try {
      const data = await res.json();
      message = data?.message || message;
    } catch {}
    throw new Error(message);
  }
}

function ReportCard({ report, type, onAction }: { report: ReportItem; type: ReportType; onAction: (report: ReportItem, action: ActionType, description: string) => Promise<void>; }) {
  const [submitting, setSubmitting] = React.useState<ActionType | null>(null);
  const [err, setErr] = React.useState<string>("");
  const [open, setOpen] = React.useState<boolean>(false);
  const [mounted, setMounted] = React.useState<boolean>(false);
  const [reasonOpen, setReasonOpen] = React.useState<boolean>(false);
  const [reason, setReason] = React.useState<string>("");
  const [pendingAction, setPendingAction] = React.useState<ActionType | null>(null);
  React.useEffect(() => setMounted(true), []);

  const openReasonPrompt = (action: ActionType) => {
    setPendingAction(action);
    setReason("");
    setReasonOpen(true);
  };
  const submitReason = async () => {
    if (!pendingAction) return;
    setErr("");
    setSubmitting(pendingAction);
    try {
      await onAction(report, pendingAction, reason.trim());
      setReasonOpen(false);
      setOpen(false);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Action failed");
    } finally {
      setSubmitting(null);
    }
  };

  const entity = type === "job" ? report.reported_job : report.reported_post;
  const owner = entity?.user;
  const avatar = owner?.profile_image_url;
  const ownerName = owner?.name || (type === "job" ? "Job Owner" : "Post Owner");
  const createdAtValue = entity?.created_at || report.created_at;
  const createdAtText = createdAtValue ? formatTimeAgo(createdAtValue) : "";
  const reporterName = report.reported_by?.name || "Unknown";
  const content = type === "job" ? (report.reported_job?.description || "") : (report.reported_post?.content || "");
  const jobTitle = type === "job" ? (report.reported_job?.title || "") : "";
  const jobLink = type === "job" ? (report.reported_job?.link || "") : "";
  const jobHost = React.useMemo(() => {
    if (!jobLink) return "";
    try {
      const url = new URL(jobLink);
      return (url.host || "").replace(/^www\./, "");
    } catch {
      return "";
    }
  }, [jobLink]);
  const attachments = type === "post" && Array.isArray(report.reported_post?.post_attachments) ? report.reported_post?.post_attachments : [];

  return (
    <motion.div
      className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative z-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="relative">
        {/* Header: Avatar, Name, Time, Reporter */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200">
              {avatar ? (
                <Image src={avatar} alt={ownerName} width={48} height={48} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-100 to-blue-100" />
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-gray-900 text-sm truncate">{ownerName}</h4>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${type === "post" ? "bg-indigo-100 text-indigo-700" : "bg-blue-100 text-blue-700"}`}>{type === "post" ? "Post" : "Job"}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>{createdAtText}</span>
                <span>•</span>
                <span>Reported by {reporterName}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="text-gray-800 leading-relaxed mb-4">
          {type === "job" && jobTitle ? (
            <div className="mb-2">
              <div className="text-base font-semibold text-gray-900">{jobTitle}</div>
              {/* Job link is hidden on card; available in dialog */}
            </div>
          ) : null}
          {content ? (
            <button onClick={() => setOpen(true)} className="text-left w-full hover:bg-gray-50/50 rounded-lg p-2 -ml-2 transition-colors">
              <p className="whitespace-pre-wrap line-clamp-2">{content}</p>
              <span className="mt-2 inline-block text-blue-600 text-sm font-medium">View details</span>
            </button>
          ) : (
            <button onClick={() => setOpen(true)} className="text-left w-full hover:bg-gray-50/50 rounded-lg p-2 -ml-2 transition-colors">
              <span className="inline-block text-blue-600 text-sm font-medium">View details</span>
            </button>
          )}
        </div>

        {/* Post attachments are hidden on card; available in dialog */}

        {/* Action bar */}
        <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
          <button
            onClick={() => openReasonPrompt(ACTION_TYPE_IGNORE)}
            disabled={!!submitting}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-green-200 text-green-700 bg-green-50 hover:bg-green-100 hover:border-green-300 transition disabled:opacity-50"
          >
            {submitting === ACTION_TYPE_IGNORE ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            Ignore
          </button>
          <button
            onClick={() => openReasonPrompt(ACTION_TYPE_HIDE)}
            disabled={!!submitting}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100 hover:border-amber-300 transition disabled:opacity-50"
          >
            {submitting === ACTION_TYPE_HIDE ? <Loader2 className="w-4 h-4 animate-spin" /> : <EyeOff className="w-4 h-4" />}
            Hide
          </button>
          <button
            onClick={() => openReasonPrompt(ACTION_TYPE_DELETE)}
            disabled={!!submitting}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-red-200 text-red-700 bg-red-50 hover:bg-red-100 hover:border-red-300 transition disabled:opacity-50"
          >
            {submitting === ACTION_TYPE_DELETE ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            Delete
          </button>
        </div>
      </div>

      {/* Details Dialog */}
      {mounted && open ? createPortal(
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4" onClick={() => setOpen(false)}>
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-200">
                  {avatar ? (
                    <Image src={avatar} alt={ownerName} width={32} height={32} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-100 to-blue-100" />
                  )}
                </div>
                <div className="text-sm text-gray-700">
                  <span className="font-medium text-gray-900">{ownerName}</span>
                  <span className="mx-2 text-gray-400">•</span>
                  <span>{createdAtText}</span>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="p-2 rounded-lg hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="px-5 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">Reported by:</span> {reporterName}
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900 mb-1">Reason</div>
                <p className="text-gray-700 whitespace-pre-wrap break-words">{report.reason}</p>
              </div>
              {type === "job" && (jobTitle || jobLink) ? (
                <div className="space-y-1">
                  {jobTitle ? <div className="text-base font-semibold text-gray-900">{jobTitle}</div> : null}
                  {jobLink ? (
                    <div className="mt-2">
                      <a
                        href={jobLink}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
                      >
                        <ExternalLink className="w-4 h-4" />
                        {jobHost ? `Open on ${jobHost}` : "Open job link"}
                      </a>
                    </div>
                  ) : null}
                </div>
              ) : null}
              {content ? (
                <div>
                  <div className="text-sm font-semibold text-gray-900 mb-1">Content</div>
                  <p className="text-gray-800 whitespace-pre-wrap break-words">{content}</p>
                </div>
              ) : null}
              {attachments && attachments.length > 0 ? (
                <div>
                  <div className="text-sm font-semibold text-gray-900 mb-2">Attachments</div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {attachments.map((src, idx) => (
                      <a key={idx} href={src} target="_blank" rel="noreferrer" className="block">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={src} alt={`attachment-${idx}`} className="w-full h-28 object-cover rounded-lg border border-gray-200" />
                      </a>
                    ))}
                  </div>
                </div>
              ) : null}
              {err ? <div className="text-sm text-red-600">{err}</div> : null}
            </div>
            <div className="px-5 py-4 border-t border-gray-200 bg-gray-50 flex flex-wrap gap-2 justify-end">
              <button
                onClick={() => openReasonPrompt(ACTION_TYPE_IGNORE)}
                disabled={!!submitting}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-green-200 text-green-700 bg-green-50 hover:bg-green-100 hover:border-green-300 transition disabled:opacity-50"
              >
                {submitting === ACTION_TYPE_IGNORE ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                Ignore
              </button>
              <button
                onClick={() => openReasonPrompt(ACTION_TYPE_HIDE)}
                disabled={!!submitting}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100 hover:border-amber-300 transition disabled:opacity-50"
              >
                {submitting === ACTION_TYPE_HIDE ? <Loader2 className="w-4 h-4 animate-spin" /> : <EyeOff className="w-4 h-4" />}
                Hide
              </button>
              <button
                onClick={() => openReasonPrompt(ACTION_TYPE_DELETE)}
                disabled={!!submitting}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-red-200 text-red-700 bg-red-50 hover:bg-red-100 hover:border-red-300 transition disabled:opacity-50"
              >
                {submitting === ACTION_TYPE_DELETE ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                Delete
              </button>
            </div>
          </div>
        </div>, document.body) : null}

      {/* Reason Prompt Modal */}
      {mounted && reasonOpen ? createPortal(
        <div className="fixed inset-0 z-[210] flex items-center justify-center bg-black/50 p-4" onClick={() => setReasonOpen(false)}>
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
              <div className="text-sm font-semibold text-gray-900">Add a reason</div>
              <button onClick={() => setReasonOpen(false)} className="p-2 rounded-lg hover:bg-gray-100"><X className="w-5 h-5 text-gray-600" /></button>
            </div>
            <div className="px-5 py-4">
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Describe why you are taking this action..."
                className="w-full h-28 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <div className="mt-3 text-xs text-gray-500">This note will be saved with the action.</div>
              {err && <div className="mt-2 text-sm text-red-600">{err}</div>}
            </div>
            <div className="px-5 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-end gap-2">
              <button onClick={() => setReasonOpen(false)} className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 hover:bg-gray-50">Cancel</button>
              <button onClick={submitReason} disabled={!pendingAction || !!submitting} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Confirm
              </button>
            </div>
          </div>
        </div>, document.body) : null}
    </motion.div>
  );
}

const ReportsTab: React.FC<{ type: ReportType }> = ({ type }) => {
  const { reports, loading, error, hasNext, fetchReports, removeReport, resetAndRefetch } = useReports(type);

  const onAction = React.useCallback(async (report: ReportItem, action: ActionType, description: string) => {
    await performReportAction(type, report, action, description);
    removeReport(report.id);
  }, [removeReport, type]);

  return (
    <div>
      {error ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-sm flex items-start justify-between">
          <span>{error}</span>
          <button onClick={resetAndRefetch} className="underline">Retry</button>
        </div>
      ) : null}

      <div className="grid gap-3">
        {reports.map(r => (
          <ReportCard key={r.id} report={r} type={type} onAction={onAction} />
        ))}
      </div>

      {loading && reports.length === 0 ? (
        <div className="mt-6 flex items-center gap-2 text-gray-600">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Loading {type} reports...</span>
        </div>
      ) : null}

      <div className="mt-4">
        {hasNext ? (
          <button
            onClick={() => fetchReports()}
            disabled={loading}
            className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 hover:bg-gray-50 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Load more"}
          </button>
        ) : (
          !loading && reports.length > 0 ? (
            <p className="text-sm text-gray-500">No more reports</p>
          ) : null
        )}
      </div>
    </div>
  );
};

const ReportsPage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<ReportType>("post");

  return (
    <ProtectedRoute role="admin">
      <div className="min-h-screen bg-white relative">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50"></div>

          {/* Floating Orbs */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-100/30 rounded-full blur-3xl"
            animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-100/30 rounded-full blur-3xl"
            animate={{ x: [0, -80, 0], y: [0, 60, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          />

          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,.02)_1px,transparent_1px)] bg-[size:100px_100px]"></div>

          {/* Animated Particles */}
          <div className="absolute inset-0">
            {[...Array(12)].map((_, i) => {
              const left = (i * 23 + 13) % 100;
              const top = (i * 37 + 27) % 100;
              const duration = 4 + (i % 3);
              const delay = (i % 5) * 0.6;
              return (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-purple-300/40 rounded-full"
                  style={{ left: `${left}%`, top: `${top}%` }}
                  animate={{ y: [0, -120, 0], opacity: [0, 1, 0] }}
                  transition={{ duration, repeat: Infinity, delay, ease: "easeInOut" }}
                />
              );
            })}
          </div>
        </div>

        {/* Navbar */}
    <Navbar />

        {/* Main Content */}
        <div className="relative z-10 max-w-7xl mx-auto p-6 pt-8">
          {/* Header */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center px-4 py-2 rounded-full bg-purple-100 border border-purple-200 text-purple-700 text-sm font-medium mb-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Reports Center
            </motion.div>

            <motion.h1
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Moderate
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"> Content</span>
            </motion.h1>

            <motion.p
              className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Review post and job reports. Approve, hide, or delete flagged content.
            </motion.p>
          </motion.div>

          {/* Tabs */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <button
                onClick={() => setActiveTab("post")}
                className={`px-5 py-2 text-sm font-semibold transition ${
                  activeTab === "post"
                    ? "bg-indigo-600 text-white"
                    : "text-gray-800 hover:bg-gray-50"
                }`}
              >
                Post report
              </button>
              <button
                onClick={() => setActiveTab("job")}
                className={`px-5 py-2 text-sm font-semibold transition border-l border-gray-200 ${
                  activeTab === "job"
                    ? "bg-indigo-600 text-white"
                    : "text-gray-800 hover:bg-gray-50"
                }`}
              >
                Job report
              </button>
            </div>
          </div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            {activeTab === "post" ? (
              <ReportsTab type="post" />
            ) : (
              <ReportsTab type="job" />
            )}
          </motion.div>

          {/* Footer */}
          <motion.footer
            className="relative z-10 text-center text-gray-500 text-sm py-8 mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            © 2025 IKnow Admin Panel. Review responsibly.
          </motion.footer>
    </div>
  </div>
    </ProtectedRoute>
);
};

export default ReportsPage;
