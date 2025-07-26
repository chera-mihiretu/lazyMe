"use client";
import React, { useState } from 'react';
import { COLORS, FONT_FAMILY } from '../../../../utils/color';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/app/ProtectedRoute';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const CreateJobPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  // const [universities, setUniversities] = useState<any[]>([]);
  // const [schools, setSchools] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  // const [departmentSearch, setDepartmentSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // Fetch all departments on mount
  React.useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    fetch(`${baseUrl}/departments/`, {
      headers: { Authorization: token ? `Bearer ${token}` : '' },
    })
      .then((res) => res.json())
      .then((data) => setDepartments(data.departments || []))
      .catch(() => setDepartments([]));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!title || !description || !link || selectedDepartments.length === 0) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await fetch(`${baseUrl}/jobs/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({
          title,
          description,
          link,
          department_ids: selectedDepartments,
        }),
      });
      console.log(res.body)
      if (res.ok) {
        router.push('/home/opportunities');
      } else {
        setError('Failed to create job post.');
      }
    } catch {
      setError('Network error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute role='student'>
    <div className="max-w-[540px] mx-auto mt-10 bg-white rounded-2xl shadow-[0_4px_32px_rgba(67,24,209,0.07)] p-[2.5rem] px-[2.2rem]">
      <h2 className="font-poppins text-primary font-bold text-[1.5rem] mb-5">Post a Job</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="font-semibold text-foreground font-poppins mb-1 block">Title</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full py-3 px-4 border border-inputBorder rounded-lg font-poppins text-base outline-none mb-2 bg-inputBg text-[#171717] shadow-[0_2px_8px_#e0e0e0] transition-all"
          />
        </div>
        <div className="mb-4">
          <label className="font-semibold text-foreground font-poppins mb-1 block">Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={4}
            className="w-full py-3 px-4 border border-inputBorder rounded-lg font-poppins text-base outline-none mb-2 bg-inputBg text-[#171717] shadow-[0_2px_8px_#e0e0e0] transition-all resize-vertical"
          />
        </div>
        <div className="mb-4">
          <label className="font-semibold text-foreground font-poppins mb-1 block">Link</label>
          <input
            type="url"
            value={link}
            onChange={e => setLink(e.target.value)}
            placeholder="https://example.com/job"
            className="w-full py-3 px-4 border border-inputBorder rounded-lg font-poppins text-base outline-none mb-2 bg-inputBg text-[#171717] shadow-[0_2px_8px_#e0e0e0] transition-all"
          />
        </div>
        {/* Department Multi-Select */}
        <div className="mb-5">
          <label className="font-semibold text-[16px]">Your Post Concern With</label>
          <div className={`rounded-xl p-2 mt-1 transition-all ${selectedDepartments.length === 0 ? 'border-2 border-[#d32f2f] shadow-[0_2px_8px_#d32f2f22]' : 'border-2 border-[#6366f1] shadow-[0_2px_8px_#6366f122]'} bg-gradient-to-r from-[#f7f7fb] to-[#e0e7ff]`}>
            <select
              multiple
              value={selectedDepartments}
              onChange={e => {
                const options = Array.from(e.target.selectedOptions).map(opt => opt.value);
                setSelectedDepartments(options);
              }}
              className="w-full border-none outline-none bg-transparent text-[15px] min-h-[80px] text-[#222] font-medium font-inherit cursor-pointer p-0 shadow-none appearance-none"
              required
            >
              {departments.map((dep) => (
                <option key={dep.id} value={dep.id} title={dep.description}
                  className={`rounded-lg m-1 p-2 text-[15px] transition-all ${selectedDepartments.includes(dep.id) ? 'bg-gradient-to-r from-[#6366f1] to-[#7c3aed] text-white font-bold' : 'bg-white text-[#222] font-medium'}`}
                >{dep.name}</option>
              ))}
            </select>
          </div>
          {/* Show selected departments as chips */}
          {selectedDepartments.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedDepartments.map(depId => {
                const dep = departments.find(d => d.id === depId);
                if (!dep) return null;
                return (
                  <span key={dep.id} className="bg-gradient-to-r from-[#6366f1] to-[#7c3aed] text-white rounded-lg px-4 py-1 font-semibold text-[14px] shadow-[0_1px_4px_#6366f133]">
                    {dep.name}
                  </span>
                );
              })}
            </div>
          )}
        </div>
        {error && <div className="text-error text-[0.98rem] mb-2">{error}</div>}
        <button
          type="submit"
          disabled={loading}
          style={{ width: '100%', background: loading ? COLORS.muted : COLORS.primary, color: '#fff', fontFamily: FONT_FAMILY.poppins, fontWeight: 600, fontSize: '1.08rem', borderRadius: 8, padding: '0.85rem 0', border: 'none', marginTop: 8, marginBottom: 18, boxShadow: '0 2px 8px rgba(67,24,209,0.07)', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s', opacity: loading ? 0.7 : 1 }}
        >
          {loading ? 'Posting...' : 'Post Job'}
        </button>
      </form>
    </div>
    </ProtectedRoute>
  );
};

export default CreateJobPage;
