import React from 'react';
import { COLORS, FONT_FAMILY } from '../../../utils/color';
import type { User } from '../../../types/Post';

export interface JobPost {
  id: string;
  department_ids: string[];
  title: string;
  like: number;
  description: string;
  link: string;
  type: string;
  user: User;
  created_at: string;
}


const JobCard: React.FC<{ job: JobPost }> = ({ job }) => {
  const avatar = job.user?.profile_image_url || '/icons/avatar.png';
  const [likes, setLikes] = React.useState(job.like || 0);
  const [liked, setLiked] = React.useState(false);

  // Helper: preview if image, else fallback to iframe preview or fallback message
  const [iframeError, setIframeError] = React.useState(false);
  React.useEffect(() => { setIframeError(false); }, [job.link]);
  const renderLinkPreview = () => {
    if (job.link.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i)) {
      return (
        <img src={job.link} alt="Job Attachment" style={{ width: '100%', maxHeight: 260, objectFit: 'contain', borderRadius: 8, border: '1px solid #ececec', marginBottom: 10 }} />
      );
    }
    if (iframeError) {
      // Fallback: cannot display preview
      const url = new URL(job.link);
      return (
        <div style={{ width: '100%', minHeight: 60, marginBottom: 10, borderRadius: 8, border: '1px solid #ececec', background: '#fffbe9', color: '#b45309', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px', fontSize: 15 }}>
          <img src={`https://www.google.com/s2/favicons?domain=${url.hostname}`} alt="favicon" style={{ width: 20, height: 20, marginRight: 8 }} />
          <span style={{ fontWeight: 600 }}>{url.hostname}</span>
          <span style={{ color: '#b45309', fontWeight: 500, marginLeft: 8 }}>Cannot display preview for this website.</span>
        </div>
      );
    }
    return (
      <div style={{ width: '100%', minHeight: 180, marginBottom: 10, borderRadius: 8, overflow: 'hidden', border: '1px solid #ececec', background: '#f7f7fb' }}>
        <iframe
          src={job.link}
          title="Job Link Preview"
          style={{ width: '100%', height: 180, border: 'none', borderRadius: 8 }}
          sandbox="allow-scripts allow-same-origin allow-popups"
          onError={() => setIframeError(true)}
        />
      </div>
    );
  };

  const handleLike = () => {
    if (!liked) {
      setLikes(likes + 1);
      setLiked(true);
      // TODO: Optionally send like to backend
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
    }}>
      {/* Header: Avatar, Name, Date */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src={avatar} alt={job.user?.name || 'User'} style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', border: '2px solid #ececec', marginRight: 8 }} />
          <div>
            <div style={{ fontWeight: 600, fontSize: 16, color: COLORS.primary }}>{job.user?.name || 'Unknown User'}</div>
            <div style={{ color: COLORS.muted, fontSize: 13 }}>{job.user?.department || ''} {job.user?.school ? `- ${job.user.school}` : ''}</div>
          </div>
        </div>
        <span style={{ color: COLORS.muted, fontSize: 14 }}>{new Date(job.created_at).toLocaleDateString()}</span>
      </div>
      {/* Title */}
      <h3 style={{ fontFamily: FONT_FAMILY.poppins, fontWeight: 700, fontSize: 22, color: COLORS.primary, margin: 0 }}>{job.title}</h3>
      {/* Description */}
      <div style={{ color: COLORS.foreground, fontSize: 16, marginBottom: 8 }}>{job.description}</div>
      {/* Link Preview */}
      {renderLinkPreview()}
      {/* Apply Button */}
      <a
        href={job.link}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-block',
          background: '#2563eb',
          color: '#fff',
          fontFamily: FONT_FAMILY.poppins,
          fontWeight: 600,
          fontSize: '1.08rem',
          borderRadius: 8,
          padding: '0.7rem 2.1rem',
          border: 'none',
          margin: '0 0 10px 0',
          boxShadow: '0 2px 8px rgba(67,24,209,0.07)',
          cursor: 'pointer',
          textDecoration: 'none',
          transition: 'background 0.2s',
        }}
      >
        Apply
      </a>
      {/* Like Button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginTop: 8 }}>
        <button
          onClick={handleLike}
          disabled={liked}
          style={{
            background: liked ? '#e0e7ff' : COLORS.primary,
            color: liked ? COLORS.primary : '#fff',
            fontWeight: 700,
            fontFamily: FONT_FAMILY.poppins,
            border: 'none',
            borderRadius: 8,
            padding: '6px 18px',
            fontSize: 16,
            cursor: liked ? 'not-allowed' : 'pointer',
            boxShadow: liked ? '0 1px 4px #6366f133' : '0 2px 8px rgba(67,24,209,0.07)',
            transition: 'background 0.2s, color 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: 7,
          }}
        >
          <span style={{ fontSize: 18, marginRight: 3 }}>❤</span> {likes}
        </button>
      </div>
    </div>
  );
};

export default JobCard;
