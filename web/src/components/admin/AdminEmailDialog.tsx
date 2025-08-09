import React, { useState } from 'react';

interface AdminEmailDialogProps {
  open: boolean;
  onClose: () => void;
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const AdminEmailDialog: React.FC<AdminEmailDialogProps> = ({ open, onClose }) => {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [improving, setImproving] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};
  const handleImprove = async () => {
    if (!subject.trim() && !body.trim()) return;
    setImproving(true);
    setError('');
    try {
      const res = await fetch(baseUrl + '/admins/improve-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader },
        body: JSON.stringify({ subject, body })
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        console.log(errData);
        throw new Error(errData.message || 'Failed to improve email');
      }
      const data = await res.json();
      console.log(data);
      if (data.improved_email.subject) setSubject(data.improved_email.subject);
      if (data.improved_email.body) setBody(data.improved_email.body);
    } catch (e:any) {
      setError('Error improving email ' + e.message);
    } finally {
      setImproving(false);
    }
  };

  const handleSend = async () => {
    if (!subject.trim() || !body.trim()) {
      setError('Subject and body are required');
      return;
    }
    setSending(true);
    setError('');
    try {
      const res = await fetch(baseUrl + '/admins/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader },
        body: JSON.stringify({ subject, body })
      });
      if (res.status === 202) {
        onClose();
        setSubject('');
        setBody('');
      } else {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to send email');
      }
    } catch (e:any) {
      setError('Error sending email ' + e.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-black/30 flex items-center justify-center z-[1000]">
      <div className="bg-white rounded-2xl shadow-[0_4px_24px_#4320d125] px-8 py-6 w-full max-w-xl flex flex-col gap-5 font-poppins relative">
        {/* Loading overlay for AI improve */}
        {improving && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center z-10">
            <div className="w-12 h-12 border-4 border-[#4320d1] border-t-transparent rounded-full animate-spin" />
            <span className="mt-4 text-[#4320d1] font-semibold text-sm tracking-wide">Improving with AI...</span>
          </div>
        )}
        <h2 className="m-0 font-bold text-[22px] text-[#4320d1]">Send Users Email</h2>
        <label className="flex flex-col gap-2 text-[14px] font-medium text-[#4320d1]">
          Subject
          <input
            type="text"
            value={subject}
            onChange={e => setSubject(e.target.value)}
            placeholder="Enter email subject"
            className="w-full px-4 py-3 rounded-lg border border-[#ddd] focus:border-[#4320d1] outline-none text-[15px] disabled:opacity-60"
            disabled={improving || sending}
          />
        </label>
        <label className="flex flex-col gap-2 text-[14px] font-medium text-[#4320d1]">
          Body
          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            placeholder="Write the email body here..."
            rows={8}
            className="w-full px-4 py-3 rounded-lg border border-[#ddd] focus:border-[#4320d1] outline-none resize-y text-[15px] leading-relaxed disabled:opacity-60"
            disabled={improving || sending}
          />
        </label>
        {error && <div className="text-[#e53e3e] text-sm font-medium">{error}</div>}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleImprove}
            disabled={improving || sending}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[14px] font-semibold shadow-sm border border-[#ececec] transition ${improving ? 'bg-[#ddd] cursor-not-allowed' : 'bg-[#f5f5fb] hover:bg-[#ececff]'} text-[#4320d1] disabled:opacity-60`}
          >
            <img src="/icons/ai.png" alt="AI" className="w-5 h-5" />
            {improving ? 'Improving...' : 'AI Improve'}
          </button>
          <div className="flex-1" />
          <button
            type="button"
            onClick={handleSend}
            disabled={sending || improving}
            className={`px-6 py-2 rounded-lg font-semibold text-white text-[14px] shadow-sm transition ${sending ? 'bg-[#888] cursor-not-allowed' : 'bg-[#4320d1] hover:bg-[#3416a5]'} disabled:opacity-70`}
          >
            {sending ? 'Sending...' : 'Send Email'}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={sending || improving}
            className="px-4 py-2 rounded-lg font-semibold text-[#4320d1] bg-[#eee] hover:bg-[#e2e2e2] text-[14px] disabled:opacity-60"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminEmailDialog;
