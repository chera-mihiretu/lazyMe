'use client';
import React, { useState } from 'react';
import { COLORS, FONT_FAMILY } from '../../utils/color';

const departments = [
  { label: 'Engineering' },
  { label: 'Business' },
  { label: 'Arts' },
  { label: 'Science' },
  { label: 'Other' },
];
const years = [
  { label: 'Freshman/1st Year' },
  { label: 'Sophomore/2nd Year' },
  { label: 'Junior/3rd Year' },
  { label: 'Senior/4th Year+' },
  { label: 'Graduate Student' },
];

const CompleteProfileForm: React.FC = () => {
  const [step, setStep] = useState(2);
  const [department, setDepartment] = useState('');
  const [otherDept, setOtherDept] = useState('');
  const [year, setYear] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(true);
    setTimeout(() => {
      // TODO: redirect to dashboard
    }, 1800);
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: 480,
      margin: '0 auto',
      background: '#fff',
      borderRadius: 18,
      boxShadow: '0 4px 32px rgba(67,24,209,0.07)',
      padding: '2.2rem 1.5rem 2rem 1.5rem',
      position: 'relative',
      zIndex: 2,
    }}>
      {/* Progress Bar */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ color: COLORS.primary, fontWeight: 600, fontFamily: FONT_FAMILY.poppins, fontSize: '1.08rem' }}>Step 2 of 2</span>
          <span style={{ color: COLORS.muted, fontFamily: FONT_FAMILY.poppins, fontSize: '1.01rem' }}>Account Created → Profile Setup</span>
        </div>
        <div style={{ width: '100%', height: 7, background: '#ececec', borderRadius: 6, overflow: 'hidden' }}>
          <div style={{ width: '100%', height: '100%', background: COLORS.primary, borderRadius: 6, transition: 'width 0.4s' }} />
        </div>
      </div>
      {/* Title & Subtitle */}
      <h2 style={{ fontFamily: FONT_FAMILY.poppins, fontWeight: 700, fontSize: '1.45rem', color: COLORS.primary, margin: 0, marginBottom: 6 }}>Complete Your Profile</h2>
      <p style={{ fontFamily: FONT_FAMILY.poppins, color: COLORS.muted, fontSize: '1.08rem', marginTop: 0, marginBottom: 18 }}>Help us personalize your IKnow experience</p>
      <form onSubmit={handleSubmit}>
        {/* Department Selection */}
        <div style={{ marginBottom: 18 }}>
          <label style={{ fontWeight: 600, color: COLORS.foreground, fontFamily: FONT_FAMILY.poppins, marginBottom: 4, display: 'block' }}>Primary Department/Faculty</label>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {departments.map(dep => (
              <button
                type="button"
                key={dep.label}
                onClick={() => setDepartment(dep.label)}
                style={{
                  flex: '1 1 120px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '0.7rem 1rem',
                  borderRadius: 8,
                  border: department === dep.label ? `2px solid ${COLORS.primary}` : `1.5px solid #E0E0E0`,
                  background: department === dep.label ? COLORS.primary + '11' : COLORS.inputBg,
                  color: department === dep.label ? COLORS.primary : COLORS.foreground,
                  fontFamily: FONT_FAMILY.poppins,
                  fontWeight: 500,
                  fontSize: '1rem',
                  cursor: 'pointer',
                  boxShadow: '0 1px 4px #e0e0e0',
                  transition: 'border 0.2s, background 0.2s',
                }}
              >
                {dep.label}
              </button>
            ))}
          </div>
          {department === 'Other' && (
            <input
              type="text"
              placeholder="Enter your department"
              value={otherDept}
              onChange={e => setOtherDept(e.target.value)}
              style={{
                width: '100%',
                marginTop: 8,
                padding: '0.85rem 1rem',
                border: '1.5px solid #E0E0E0',
                borderRadius: 8,
                fontFamily: FONT_FAMILY.poppins,
                fontSize: '1rem',
                outline: 'none',
                background: COLORS.inputBg,
                color: '#171717',
                boxShadow: '0 2px 8px #e0e0e0',
              }}
            />
          )}
        </div>
        {/* Academic Year */}
        <div style={{ marginBottom: 18 }}>
          <label style={{ fontWeight: 600, color: COLORS.foreground, fontFamily: FONT_FAMILY.poppins, marginBottom: 4, display: 'block' }}>Current Academic Level</label>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {years.map(y => (
              <button
                type="button"
                key={y.label}
                onClick={() => setYear(y.label)}
                style={{
                  flex: '1 1 160px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '0.7rem 1rem',
                  borderRadius: 8,
                  border: year === y.label ? `2px solid ${COLORS.primary}` : `1.5px solid #E0E0E0`,
                  background: year === y.label ? COLORS.primary + '11' : COLORS.inputBg,
                  color: year === y.label ? COLORS.primary : COLORS.foreground,
                  fontFamily: FONT_FAMILY.poppins,
                  fontWeight: 500,
                  fontSize: '1rem',
                  cursor: 'pointer',
                  boxShadow: '0 1px 4px #e0e0e0',
                  transition: 'border 0.2s, background 0.2s',
                }}
              >
                {y.label}
              </button>
            ))}
          </div>
        </div>
        <div style={{ color: COLORS.muted, fontSize: '0.97rem', fontFamily: FONT_FAMILY.poppins, marginBottom: 18 }}>
          This helps us show relevant opportunities and resources
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 24 }}>
          <button type="button" style={{ background: 'none', border: 'none', color: COLORS.primary, fontFamily: FONT_FAMILY.poppins, fontWeight: 500, fontSize: '1.05rem', cursor: 'pointer', padding: 0 }}>Back</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <button type="button" style={{ background: 'none', border: 'none', color: COLORS.muted, fontFamily: FONT_FAMILY.poppins, fontSize: '1.01rem', cursor: 'pointer', padding: 0 }}>Skip for now</button>
            <button type="submit" style={{ background: COLORS.primary, color: '#fff', fontFamily: FONT_FAMILY.poppins, fontWeight: 600, fontSize: '1.08rem', borderRadius: 8, padding: '0.85rem 2.2rem', border: 'none', boxShadow: '0 2px 8px rgba(67,24,209,0.07)', cursor: 'pointer', transition: 'background 0.2s' }}>Finish Setup</button>
          </div>
        </div>
        {showSuccess && (
          <div style={{ marginTop: 32, textAlign: 'center', color: COLORS.primary, fontFamily: FONT_FAMILY.poppins, fontWeight: 600, fontSize: '1.15rem' }}>
            🎉 Ready to explore! Taking you to your dashboard...
          </div>
        )}
      </form>
    </div>
  );
};

export default CompleteProfileForm;
