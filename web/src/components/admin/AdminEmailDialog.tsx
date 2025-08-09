import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Mail, X, AlertTriangle, Loader2, Send, Sparkles } from 'lucide-react';

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

  const handleImprove = async () => {
    if (!subject.trim() && !body.trim()) return;
    setImproving(true);
    setError('');
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      };
      
      const res = await fetch(baseUrl + '/admins/improve-email', {
        method: 'POST',
        headers,
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
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      };
      
      const res = await fetch(baseUrl + '/admins/send-email', {
        method: 'POST',
        headers,
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
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-xl relative"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Loading overlay for AI improve */}
            <AnimatePresence>
              {improving && (
                <motion.div
                  className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Loader2 className="w-12 h-12 text-cyan-600 animate-spin mb-4" />
                  <span className="text-cyan-700 font-semibold text-sm">Improving with AI...</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center mr-3">
                  <Mail className="w-5 h-5 text-cyan-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Send Users Email</h3>
                  <p className="text-sm text-gray-500">Broadcast to all users</p>
                </div>
              </div>
              <motion.button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                disabled={sending || improving}
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="Enter email subject"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-300"
                  disabled={improving || sending}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Body *
                </label>
                <textarea
                  value={body}
                  onChange={e => setBody(e.target.value)}
                  placeholder="Write the email body here..."
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-300 resize-y"
                  disabled={improving || sending}
                />
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <AlertTriangle className="w-4 h-4 text-red-500 mr-2" />
                  <span className="text-red-700 text-sm">{error}</span>
                </motion.div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 mt-6">
              <motion.button
                onClick={handleImprove}
                disabled={improving || sending || (!subject.trim() && !body.trim())}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 border border-purple-200 text-purple-700 font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: (!improving && !sending && (subject.trim() || body.trim())) ? 1.02 : 1 }}
                whileTap={{ scale: (!improving && !sending && (subject.trim() || body.trim())) ? 0.98 : 1 }}
              >
                <Sparkles className="w-4 h-4" />
                {improving ? 'Improving...' : 'AI Improve'}
              </motion.button>

              <div className="flex-1" />

              <motion.button
                onClick={onClose}
                disabled={sending || improving}
                className="px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>

              <motion.button
                onClick={handleSend}
                disabled={sending || improving || !subject.trim() || !body.trim()}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-cyan-600 to-cyan-700 text-white font-semibold rounded-xl hover:from-cyan-700 hover:to-cyan-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: (!sending && !improving && subject.trim() && body.trim()) ? 1.02 : 1 }}
                whileTap={{ scale: (!sending && !improving && subject.trim() && body.trim()) ? 0.98 : 1 }}
              >
                {sending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Email
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AdminEmailDialog;
