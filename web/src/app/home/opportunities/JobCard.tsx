import React, { useState } from 'react';
import { formatTimeAgo } from '@/app/helpers/time_formatter';
import { COLORS, FONT_FAMILY } from '../../../utils/color';
import type { User } from '../../../types/Post';

export interface JobPost {
  id: string;
  department_ids: string[];
  title: string;
  description: string;
  like: number;
  link: string;
  type: string;
  user: User;
  created_at: string;
  liked: boolean;
}

const JobCard: React.FC<{ job: JobPost }> = ({ job }) => {
  console.log(job)
  const avatar = job.user?.profile_image_url || '/icons/avatar.png';
  const [likes, setLikes] = useState(job.like || 0);
  const [liked, setLiked] = useState(job.liked || false);
  const [iframeError, setIframeError] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Menu logic (copied from PostCard)
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
  // You may need to adjust this logic to match your auth/user system
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

  React.useEffect(() => { setIframeError(false); }, [job.link]);

  // Microlink.io Link Preview
  const [microlink, setMicrolink] = React.useState<any>(null);
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
        <div style={{ color: COLORS.error, background: "#fffbe9", borderRadius: 8, padding: 12, marginBottom: 10 }}>
          No link provided for this job post.
        </div>
      );
    }
    if (job.link.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i)) {
      return (
        <img src={job.link} alt="Job Attachment" style={{ width: '100%', maxHeight: 260, objectFit: 'contain', borderRadius: 8, border: '1px solid #ececec', marginBottom: 10 }} />
      );
    }
    if (microlinkLoading) {
      return (
        <div style={{ color: COLORS.primary, background: "#f7f7fb", borderRadius: 8, padding: 12, marginBottom: 10 }}>
          Loading preview...
        </div>
      );
    }
    if (microlinkError) {
      return (
        <div style={{ color: COLORS.error, background: "#fffbe9", borderRadius: 8, padding: 12, marginBottom: 10 }}>
          {microlinkError}
        </div>
      );
    }
    if (microlink) {
      return (
        <a href={job.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: '#f7f7fb', border: '1px solid #ececec', borderRadius: 8, padding: 16, marginBottom: 10 }}>
            {microlink.image && (
              <img src={microlink.image.url} alt="preview" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8, border: '1px solid #ececec' }} />
            )}
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 16, color: COLORS.primary, marginBottom: 4 }}>{microlink.title || microlink.url}</div>
              <div style={{ color: COLORS.muted, fontSize: 14, marginBottom: 2 }}>{microlink.description}</div>
              <div style={{ color: COLORS.muted, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                <img src={`https://www.google.com/s2/favicons?domain=${microlink.url ? new URL(microlink.url).hostname : ''}`} alt="favicon" style={{ width: 16, height: 16 }} />
                {microlink.url ? new URL(microlink.url).hostname : ''}
              </div>
            </div>
          </div>
        </a>
      );
    }
    return null;
  };

  const handleLike = async () => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const url = liked ? `${baseUrl}/jobs/dislike` : `${baseUrl}/jobs/like`;
    const body = JSON.stringify({ post_id: job.id });
    try {
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
      setError('Failed to update like. Please try again.');
    }
  };

  return (
    <div style={{
      background: '#fff',
      borderRadius: 14,
      boxShadow: '0 2px 12px #e0e0e0',
      padding: '1.5rem 1.7rem',
      marginBottom: 28,
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      position: 'relative',
    }}>
      {/* Header: Avatar, Name, Date, Menu */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src={avatar} alt={job.user?.name || 'User'} style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', border: '2px solid #ececec', marginRight: 8 }} />
          <div>
            <div style={{ fontWeight: 600, fontSize: 16, color: COLORS.primary }}>{job.user?.name || 'Unknown User'}</div>
            <div style={{ color: COLORS.muted, fontSize: 13 }}>{job.user?.department || ''} {job.user?.school ? `- ${job.user.school}` : ''}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: COLORS.muted, fontSize: 14 }}>{formatTimeAgo(job.created_at)}</span>
          <button
            ref={menuButtonRef}
            style={{ padding: 8, borderRadius: '50%', background: 'transparent', border: 'none', cursor: 'pointer' }}
            onClick={e => {
              e.stopPropagation();
              setShowMenu(v => !v);
            }}
          >
            <img src="/icons/menu.png" alt="menu" width={22} height={22} />
          </button>
          {showMenu && (
            <div
              ref={menuRef}
              style={{ position: 'absolute', right: 0, marginTop: 32, width: 160, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, boxShadow: '0 2px 12px #e0e0e0', zIndex: 10 }}
            >
              {isCurrentUser ? (
                <>
                  <button style={{ width: '100%', textAlign: 'left', padding: '8px 16px', background: 'none', border: 'none', cursor: 'pointer' }} onClick={handleEdit}>Edit</button>
                  <button style={{ width: '100%', textAlign: 'left', padding: '8px 16px', background: 'none', border: 'none', color: '#e53e3e', cursor: 'pointer' }} onClick={handleDelete}>Delete</button>
                </>
              ) : (
                <>
                  <button style={{ width: '100%', textAlign: 'left', padding: '8px 16px', background: 'none', border: 'none', cursor: 'pointer' }} onClick={handleReport}>Report</button>
                </>
              )}
            </div>
          )}
          {/* Report Dialog */}
          {showReportDialog && (
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }}>
              <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px #4320d10a', padding: 24, width: '100%', maxWidth: 400 }}>
                <h3 style={{ fontWeight: 700, fontSize: 20, marginBottom: 12, color: '#4320d1' }}>Report Job</h3>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Reason for report</label>
                <textarea
                  style={{ width: '100%', border: '1px solid #e5e7eb', borderRadius: 8, padding: 8, marginBottom: 12, resize: 'vertical' }}
                  rows={3}
                  value={reportReason}
                  onChange={e => setReportReason(e.target.value)}
                  placeholder="Describe the reason..."
                  disabled={reportLoading}
                />
                <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                  <button
                    style={{ border: 'none', borderRadius: 8, padding: '8px 0', fontWeight: 600, width: '100%', fontSize: 18, color: '#fff', background: reportLoading || !reportReason.trim() ? '#aaa' : '#4320d1', cursor: reportLoading || !reportReason.trim() ? 'not-allowed' : 'pointer' }}
                    disabled={reportLoading || !reportReason.trim()}
                    onClick={submitReport}
                  >
                    {reportLoading ? 'Reporting...' : 'Report'}
                  </button>
                  <button
                    style={{ background: '#eee', color: '#4320d1', border: 'none', borderRadius: 8, padding: '8px 0', fontWeight: 600, width: '100%', fontSize: 18, cursor: reportLoading ? 'not-allowed' : 'pointer' }}
                    onClick={() => { setShowReportDialog(false); setReportReason(''); }}
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
      <h3 style={{ fontFamily: FONT_FAMILY.poppins, fontWeight: 700, fontSize: 22, color: COLORS.primary, margin: 0 }}>{job.title}</h3>
      {/* Description */}
      <div style={{ color: COLORS.foreground, fontSize: 16, marginBottom: 8 }}>{job.description}</div>
      {/* Error Message */}
      {error && (
        <div style={{ color: COLORS.error, background: "#fffbe9", borderRadius: 8, padding: 10, marginBottom: 10 }}>
          {error}
        </div>
      )}
      {/* Link Preview */}
      {renderLinkPreview()}
      {/* Apply Button with Icon */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
        <a
          href={job.link}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            background: '#2563eb',
            color: '#ffffff', // Changed color to white
            fontFamily: FONT_FAMILY.poppins,
            fontWeight: 600,
            fontSize: '1.08rem',
            borderRadius: 8,
            padding: '0.7rem 2.1rem',
            border: 'none',
            boxShadow: '0 2px 8px rgba(67,24,209,0.07)',
            cursor: 'pointer',
            textDecoration: 'none',
            transition: 'background 0.2s',
          }}
        >
          <img
            src="/icons/open_link.svg"
            alt="open link"
            width={24}
            height={24}
            style={{
              marginRight: 6,
              filter: 'invert(100%)', // Makes the SVG white
            }}
          />
          Apply
        </a>
      </div>
      {/* Like Button (left side) */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginTop: 8 }}>
        <span
          style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
          onClick={handleLike}
        >
          <img
            src={liked ? "/icons/liked.png" : "/icons/like.png"}
            alt="like"
            width={30}
            height={30}
          />
          <span style={{ fontSize: 20, color: "#4320d1", fontWeight: 600 }}>{likes}</span>
        </span>
      </div>
    </div>
  );
};

export default JobCard;
