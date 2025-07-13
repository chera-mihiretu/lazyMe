"use client";
import React, { useState } from 'react';
import { COLORS, FONT_FAMILY } from '../../../../utils/color';
import { useRouter } from 'next/navigation';

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
    <div style={{ maxWidth: 540, margin: '2.5rem auto', background: '#fff', borderRadius: 16, boxShadow: '0 4px 32px rgba(67,24,209,0.07)', padding: '2.5rem 2.2rem' }}>
      <h2 style={{ fontFamily: FONT_FAMILY.poppins, color: COLORS.primary, fontWeight: 700, fontSize: '1.5rem', marginBottom: 18 }}>Post a Job</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontWeight: 600, color: COLORS.foreground, fontFamily: FONT_FAMILY.poppins, marginBottom: 4, display: 'block' }}>Title</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            style={{ width: '100%', padding: '0.85rem 1rem', border: `1.5px solid ${COLORS.inputBorder}`, borderRadius: 8, fontFamily: FONT_FAMILY.poppins, fontSize: '1rem', outline: 'none', marginBottom: 8, background: COLORS.inputBg, color: '#171717', boxShadow: '0 2px 8px #e0e0e0', transition: 'border 0.2s, box-shadow 0.2s' }}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontWeight: 600, color: COLORS.foreground, fontFamily: FONT_FAMILY.poppins, marginBottom: 4, display: 'block' }}>Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={4}
            style={{ width: '100%', padding: '0.85rem 1rem', border: `1.5px solid ${COLORS.inputBorder}`, borderRadius: 8, fontFamily: FONT_FAMILY.poppins, fontSize: '1rem', outline: 'none', marginBottom: 8, background: COLORS.inputBg, color: '#171717', boxShadow: '0 2px 8px #e0e0e0', transition: 'border 0.2s, box-shadow 0.2s', resize: 'vertical' }}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontWeight: 600, color: COLORS.foreground, fontFamily: FONT_FAMILY.poppins, marginBottom: 4, display: 'block' }}>Link</label>
          <input
            type="url"
            value={link}
            onChange={e => setLink(e.target.value)}
            placeholder="https://example.com/job"
            style={{ width: '100%', padding: '0.85rem 1rem', border: `1.5px solid ${COLORS.inputBorder}`, borderRadius: 8, fontFamily: FONT_FAMILY.poppins, fontSize: '1rem', outline: 'none', marginBottom: 8, background: COLORS.inputBg, color: '#171717', boxShadow: '0 2px 8px #e0e0e0', transition: 'border 0.2s, box-shadow 0.2s' }}
          />
        </div>
        {/* Department Multi-Select */}
        <div style={{ marginBottom: 18 }}>
          <label style={{ fontWeight: 600, fontSize: 16 }}>Your Department Concern With</label>
          <div style={{
            borderRadius: 10,
            border: selectedDepartments.length === 0 ? '2px solid #d32f2f' : '2px solid #6366f1',
            background: 'linear-gradient(90deg, #f7f7fb 60%, #e0e7ff 100%)',
            boxShadow: selectedDepartments.length === 0 ? '0 2px 8px #d32f2f22' : '0 2px 8px #6366f122',
            padding: 8,
            marginTop: 6,
            transition: 'border 0.2s, box-shadow 0.2s',
          }}>
            <select
              multiple
              value={selectedDepartments}
              onChange={e => {
                const options = Array.from(e.target.selectedOptions).map(opt => opt.value);
                setSelectedDepartments(options);
              }}
              style={{
                width: "100%",
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontSize: 15,
                minHeight: 80,
                color: '#222',
                fontWeight: 500,
                fontFamily: 'inherit',
                cursor: 'pointer',
                padding: 0,
                boxShadow: 'none',
                appearance: 'none',
                WebkitAppearance: 'none',
                MozAppearance: 'none',
              }}
              required
            >
              {departments.map((dep) => (
                <option key={dep.id} value={dep.id} title={dep.description} style={{
                  background: selectedDepartments.includes(dep.id) ? 'linear-gradient(90deg, #6366f1 60%, #7c3aed 100%)' : '#fff',
                  color: selectedDepartments.includes(dep.id) ? '#fff' : '#222',
                  borderRadius: 6,
                  margin: 2,
                  padding: 6,
                  fontWeight: selectedDepartments.includes(dep.id) ? 700 : 500,
                  fontSize: 15,
                  transition: 'background 0.2s, color 0.2s',
                }}>{dep.name}</option>
              ))}
            </select>
          </div>
          {/* Show selected departments as chips */}
          {selectedDepartments.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
              {selectedDepartments.map(depId => {
                const dep = departments.find(d => d.id === depId);
                if (!dep) return null;
                return (
                  <span key={dep.id} style={{
                    background: 'linear-gradient(90deg, #6366f1 60%, #7c3aed 100%)',
                    color: '#fff',
                    borderRadius: 8,
                    padding: '4px 14px',
                    fontWeight: 600,
                    fontSize: 14,
                    boxShadow: '0 1px 4px #6366f133',
                  }}>
                    {dep.name}
                  </span>
                );
              })}
            </div>
          )}
        </div>
        {error && <div style={{ color: COLORS.error, fontSize: '0.98rem', marginBottom: 10 }}>{error}</div>}
        <button
          type="submit"
          disabled={loading}
          style={{ width: '100%', background: loading ? COLORS.muted : COLORS.primary, color: '#fff', fontFamily: FONT_FAMILY.poppins, fontWeight: 600, fontSize: '1.08rem', borderRadius: 8, padding: '0.85rem 0', border: 'none', marginTop: 8, marginBottom: 18, boxShadow: '0 2px 8px rgba(67,24,209,0.07)', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s', opacity: loading ? 0.7 : 1 }}
        >
          {loading ? 'Posting...' : 'Post Job'}
        </button>
      </form>
    </div>
  );
};

export default CreateJobPage;
