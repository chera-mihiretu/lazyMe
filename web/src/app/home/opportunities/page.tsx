"use client";
import React from 'react';
import dynamic from 'next/dynamic';
const ProtectedRoute = dynamic(() => import('../../ProtectedRoute'), { ssr: false });
import HomeNavBar from '@/components/home/HomeNavBar';
import { useRouter } from 'next/navigation';


import { useEffect, useState } from 'react';
import JobCard, { JobPost } from './JobCard';

const OpportunitiesPage = () => {
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError('');
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const res = await fetch(`${baseUrl}/jobs/?page=1`, {
          headers: { Authorization: token ? `Bearer ${token}` : '' },
        });

        const data = await res.json();
        if (res.ok && Array.isArray(data.jobs)) {
          setJobs(data.jobs);
        } else {
          setError('Failed to load jobs.');
        }
      } catch ( e) {
        setError('Network error.' + e);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  return (
    <ProtectedRoute role='student'>
      <div style={{ minHeight: '100vh', background: '#f7f7fb' }}>
        <HomeNavBar />
        <div style={{ maxWidth: 1100, margin: '2.5rem auto 0 auto', padding: '0 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search jobs..."
                style={{
                  width: 220,
                  padding: '0.6rem 1rem',
                  border: `1.5px solid #e0e0e0`,
                  borderRadius: 8,
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '1rem',
                  outline: 'none',
                  background: '#f7f7fb',
                  color: '#171717',
                  boxShadow: '0 1px 4px #e0e0e0',
                  transition: 'border 0.2s, box-shadow 0.2s',
                }}
                aria-label="Search jobs"
              />
            </div>
            <button
              onClick={() => router.push('/home/opportunities/create')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                background: '#4320d1',
                color: '#fff',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 600,
                fontSize: '1rem',
                borderRadius: 8,
                padding: '0.6rem 1.5rem',
                border: 'none',
                boxShadow: '0 1px 4px #e0e0e0',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="9" width="14" height="2" rx="1" fill="#fff"/>
                <rect x="9" y="3" width="2" height="14" rx="1" fill="#fff"/>
              </svg>
              Create a Post
            </button>
          </div>
          <h2 style={{ fontFamily: 'Poppins, sans-serif', color: '#4320d1', fontWeight: 700, fontSize: '2rem', marginBottom: 18 }}>
            Opportunities
          </h2>
          {loading ? (
            <div style={{ color: '#888', fontSize: '1.1rem' }}>Loading...</div>
          ) : error ? (
            <div style={{ color: '#d32f2f', fontSize: '1.05rem', marginBottom: 12 }}>{error}</div>
          ) : jobs.length === 0 ? (
            <div style={{ color: '#888', fontSize: '1.05rem' }}>No opportunities found.</div>
          ) : (
            jobs
              .filter(job =>
                job.title.toLowerCase().includes(search.toLowerCase()) ||
                job.description.toLowerCase().includes(search.toLowerCase())
              )
              .map(job => <JobCard key={job.id} job={job} />)
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default OpportunitiesPage;
