'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { COLORS, FONT_FAMILY } from '../../utils/color';

const departments = [
  'Computer Science',
  'Engineering',
  'Business',
  'Medicine',
  'Law',
  'Education',
  'Other',
];
const years = [
  '1st Year',
  '2nd Year',
  '3rd Year',
  '4th Year',
  '5th Year',
];

const SignUpForm: React.FC = () => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: '',
    year: '',
    password: '',
    agree: false,
  });
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const { name, value, type } = target;
    const checked = (type === 'checkbox' && 'checked' in target) ? (target as HTMLInputElement).checked : undefined;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (name === 'password') {
      setPasswordStrength(getPasswordStrength(value));
    }
  };

  const getPasswordStrength = (pw: string) => {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowError(true);
    // Simple validation
    if (!form.firstName || !form.lastName || !form.email || !form.department || !form.year || !form.password) {
      setError('Please fill in all fields.');
      return;
    }
    if (!form.agree) {
      setError('You must agree to the Terms of Service and Privacy Policy.');
      return;
    }
    setError('');
    // TODO: handle registration
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 410, margin: '0 auto' }}>
      <div style={{ marginBottom: 16 }}>
        <label htmlFor="firstName" style={{ fontWeight: 600, color: COLORS.foreground, fontFamily: FONT_FAMILY.poppins, marginBottom: 4, display: 'block' }}>First Name</label>
        <input
          id="firstName"
          name="firstName"
          type="text"
          placeholder="John"
          value={form.firstName}
          onChange={handleChange}
          style={{
            width: '100%',
            padding: '0.85rem 1rem',
            border: `1.5px solid ${error ? COLORS.error : COLORS.inputBorder}`,
            borderRadius: 8,
            fontFamily: FONT_FAMILY.poppins,
            fontSize: '1rem',
            outline: 'none',
            marginBottom: 8,
            background: COLORS.inputBg,
            color: '#171717',
            boxShadow: error ? `0 0 0 2px ${COLORS.error}33, 0 2px 8px #e0e0e0` : '0 2px 8px #e0e0e0',
            transition: 'border 0.2s, box-shadow 0.2s',
          }}
        />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label htmlFor="lastName" style={{ fontWeight: 600, color: COLORS.foreground, fontFamily: FONT_FAMILY.poppins, marginBottom: 4, display: 'block' }}>Last Name</label>
        <input
          id="lastName"
          name="lastName"
          type="text"
          placeholder="Doe"
          value={form.lastName}
          onChange={handleChange}
          style={{
            width: '100%',
            padding: '0.85rem 1rem',
            border: `1.5px solid ${error ? COLORS.error : COLORS.inputBorder}`,
            borderRadius: 8,
            fontFamily: FONT_FAMILY.poppins,
            fontSize: '1rem',
            outline: 'none',
            marginBottom: 8,
            background: COLORS.inputBg,
            color: '#171717',
            boxShadow: error ? `0 0 0 2px ${COLORS.error}33, 0 2px 8px #e0e0e0` : '0 2px 8px #e0e0e0',
            transition: 'border 0.2s, box-shadow 0.2s',
          }}
        />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label htmlFor="email" style={{ fontWeight: 600, color: COLORS.foreground, fontFamily: FONT_FAMILY.poppins, marginBottom: 4, display: 'block' }}>Email</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="john.doe@university.edu"
          value={form.email}
          onChange={handleChange}
          style={{
            width: '100%',
            padding: '0.85rem 1rem',
            border: `1.5px solid ${error ? COLORS.error : COLORS.inputBorder}`,
            borderRadius: 8,
            fontFamily: FONT_FAMILY.poppins,
            fontSize: '1rem',
            outline: 'none',
            marginBottom: 8,
            background: COLORS.inputBg,
            color: '#171717',
            boxShadow: error ? `0 0 0 2px ${COLORS.error}33, 0 2px 8px #e0e0e0` : '0 2px 8px #e0e0e0',
            transition: 'border 0.2s, box-shadow 0.2s',
          }}
        />
      </div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <div style={{ flex: 1 }}>
          <label htmlFor="department" style={{ fontWeight: 600, color: COLORS.foreground, fontFamily: FONT_FAMILY.poppins, marginBottom: 4, display: 'block' }}>Department</label>
          <select
            id="department"
            name="department"
            value={form.department}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '0.85rem 1rem',
              border: `1.5px solid ${error ? COLORS.error : COLORS.inputBorder}`,
              borderRadius: 8,
              fontFamily: FONT_FAMILY.poppins,
              fontSize: '1rem',
              outline: 'none',
              marginBottom: 8,
              background: COLORS.inputBg,
              color: '#171717',
              boxShadow: error ? `0 0 0 2px ${COLORS.error}33, 0 2px 8px #e0e0e0` : '0 2px 8px #e0e0e0',
              transition: 'border 0.2s, box-shadow 0.2s',
              appearance: 'none',
            }}
          >
            <option value="">Select Department</option>
            {departments.map(dep => <option key={dep} value={dep}>{dep}</option>)}
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <label htmlFor="year" style={{ fontWeight: 600, color: COLORS.foreground, fontFamily: FONT_FAMILY.poppins, marginBottom: 4, display: 'block' }}>Academic Year</label>
          <select
            id="year"
            name="year"
            value={form.year}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '0.85rem 1rem',
              border: `1.5px solid ${error ? COLORS.error : COLORS.inputBorder}`,
              borderRadius: 8,
              fontFamily: FONT_FAMILY.poppins,
              fontSize: '1rem',
              outline: 'none',
              marginBottom: 8,
              background: COLORS.inputBg,
              color: '#171717',
              boxShadow: error ? `0 0 0 2px ${COLORS.error}33, 0 2px 8px #e0e0e0` : '0 2px 8px #e0e0e0',
              transition: 'border 0.2s, box-shadow 0.2s',
              appearance: 'none',
            }}
          >
            <option value="">Select Year</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>
      <div style={{ marginBottom: 8 }}>
        <label htmlFor="password" style={{ fontWeight: 600, color: COLORS.foreground, fontFamily: FONT_FAMILY.poppins, marginBottom: 4, display: 'block' }}>Password</label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Create a strong password"
          value={form.password}
          onChange={handleChange}
          style={{
            width: '100%',
            padding: '0.85rem 1rem',
            border: `1.5px solid ${error ? COLORS.error : COLORS.inputBorder}`,
            borderRadius: 8,
            fontFamily: FONT_FAMILY.poppins,
            fontSize: '1rem',
            outline: 'none',
            background: COLORS.inputBg,
            color: '#171717',
            boxShadow: error ? `0 0 0 2px ${COLORS.error}33, 0 2px 8px #e0e0e0` : '0 2px 8px #e0e0e0',
            transition: 'border 0.2s, box-shadow 0.2s',
          }}
        />
        <div style={{ fontSize: '0.95rem', color: COLORS.muted, marginTop: 2, marginBottom: 4, fontFamily: FONT_FAMILY.poppins }}>
          Password must be at least 8 characters, include a number, an uppercase letter, and a symbol.
        </div>
        {/* Password strength meter */}
        <div style={{ height: 6, background: '#ececec', borderRadius: 4, marginTop: 2, marginBottom: 8 }}>
          <div style={{
            width: `${(passwordStrength / 4) * 100}%`,
            height: '100%',
            background: passwordStrength === 4 ? COLORS.primary : passwordStrength >= 2 ? '#FFD600' : COLORS.error,
            borderRadius: 4,
            transition: 'width 0.3s',
          }} />
        </div>
      </div>
      {showError && error && <div style={{ color: COLORS.error, fontSize: '0.98rem', marginBottom: 10 }}>{error}</div>}
      <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 14, gap: 8 }}>
        <label style={{ display: 'flex', alignItems: 'flex-start', fontFamily: FONT_FAMILY.poppins, fontSize: '0.98rem', color: COLORS.foreground, gap: 8, cursor: 'pointer' }}>
          <input
            type="checkbox"
            name="agree"
            checked={form.agree}
            onChange={handleChange}
            style={{ marginTop: 3, marginRight: 7 }}
          />
          <span>
            I agree to the{' '}
            <a href="#" style={{ color: COLORS.primary, textDecoration: 'underline', margin: '0 4px' }}>Terms of Service</a>
            {' '}and{' '}
            <a href="#" style={{ color: COLORS.primary, textDecoration: 'underline', margin: '0 4px' }}>Privacy Policy</a>
          </span>
        </label>
      </div>
      <button
        type="submit"
        style={{
          width: '100%',
          background: COLORS.primary,
          color: '#fff',
          fontFamily: FONT_FAMILY.poppins,
          fontWeight: 600,
          fontSize: '1.08rem',
          borderRadius: 8,
          padding: '0.85rem 0',
          border: 'none',
          marginTop: 8,
          marginBottom: 18,
          boxShadow: '0 2px 8px rgba(67,24,209,0.07)',
          cursor: 'pointer',
          transition: 'background 0.2s',
        }}
      >
        Create Account
      </button>
      <div style={{ display: 'flex', alignItems: 'center', margin: '18px 0' }}>
        <div style={{ flex: 1, height: 1, background: COLORS.inputBorder, opacity: 0.5 }} />
        <span style={{ margin: '0 12px', color: '#171717', fontFamily: FONT_FAMILY.poppins, fontSize: '0.98rem' }}>Or sign up with</span>
        <div style={{ flex: 1, height: 1, background: COLORS.inputBorder, opacity: 0.5 }} />
      </div>
      <button
        type="button"
        style={{
          width: '100%',
          background: '#fff',
          color: COLORS.foreground,
          fontFamily: FONT_FAMILY.poppins,
          fontWeight: 600,
          fontSize: '1.08rem',
          borderRadius: 8,
          padding: '0.85rem 0',
          border: `1.5px solid ${COLORS.inputBorder}`,
          marginBottom: 10,
          boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          cursor: 'pointer',
          transition: 'border 0.2s',
        }}
      >
        <img src="/icons/google.png" alt="Google" width={22} height={22} style={{ marginRight: 8 }} />
        Continue with Google
      </button>
      <div style={{ textAlign: 'center', marginTop: 10 }}>
        <span style={{ color: '#171717', fontFamily: FONT_FAMILY.poppins, fontSize: '0.98rem' }}>
          Already have an account?{' '}
          <Link href="/auth/login" prefetch={false} style={{ color: COLORS.primary, textDecoration: 'underline', fontWeight: 500 }}>Sign In</Link>
        </span>
      </div>
    </form>
  );
};

export default SignUpForm;
