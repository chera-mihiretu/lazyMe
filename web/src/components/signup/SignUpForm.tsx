'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { COLORS } from '../../utils/color';
import Image from 'next/image';
import type { University } from '@/types/university';
import type { School } from '@/types/schools';
import { Department } from './useDepartments';
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const years = [
  {name : '1st Year', value : 1},
  {name : '2nd Year', value : 2},
  {name : '3rd Year', value : 3},
  {name : '4th Year', value : 4},
  {name : '5th Year', value : 5},
];

const SignUpForm: React.FC = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    university: '',
    school: '',
    department: '',
    year: '',
    password: '',
    agree: false,
  });
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  const [universities, setUniversities] = useState<University[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [departments, setDepartments] = useState<Department[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const { name, value, type } = target;
    const checked = (type === 'checkbox' && 'checked' in target) ? (target as HTMLInputElement).checked : undefined;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (name === 'password') {
      setPasswordStrength(getPasswordStrength(value));
    }
    // Reset school when university changes
    if (name === 'university') {
      setForm(prev => ({ ...prev, school: '' }));
    }
  };
  // Fetch universities on mount
  React.useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${baseUrl}/universities/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setUniversities(data.universities || []))
      .catch(() => setUniversities([]));
  }, []);

  // Fetch schools when university changes
  React.useEffect(() => {
    if (!form.university) return;
    const token = localStorage.getItem("token");
    fetch(`${baseUrl}/schools/?university_id=${form.university}&page=1`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setSchools(data.schools || []))
      .catch(() => setSchools([]));
  }, [form.university]);

  React.useEffect(() => {
      if (!form.school) return;
      const token = localStorage.getItem("token");
      fetch(`${baseUrl}/departments/tree/${form.school}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setDepartments(data.departments || []))
        .catch(() => setDepartments([]));
    }, [form.school]);

  const getPasswordStrength = (pw: string) => {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowError(true);
    setError('');
    setFieldErrors({});
    setLoading(true);
    const errors: { [key: string]: string } = {};
    if (!form.fullName) errors.fullName = 'Full Name is required.';
    if (!form.email) errors.email = 'Email is required.';
    if (!form.university) errors.university = 'University is required.';
    if (!form.year) errors.year = 'Academic Year is required.';
    if (!form.password) errors.password = 'Password is required.';
    if (!form.agree) errors.agree = 'You must agree to the Terms of Service and Privacy Policy.';
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`${baseUrl}/auth/email/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.fullName,
          email: form.email,
          password: form.password,
          university_id: form.university,
          school_id: form.school,
          department_id: form.department,
          acedemic_year: parseInt(form.year),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError('Failed to sign up. ' + JSON.stringify(data));
        setLoading(false);
        return;
      }
      // Success: redirect to verify page
      router.push('/auth/signup-success');
    } catch (err) {
      setError('Network error. Please try again.' + err);
      setLoading(false);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-[410px] mx-auto">
      <div className="mb-4">
        <label htmlFor="fullName" className="font-semibold text-foreground font-poppins mb-1 block">Full Name</label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          placeholder="John Doe"
          value={form.fullName}
          onChange={handleChange}
          className={`w-full px-4 py-3 rounded-lg font-poppins text-base outline-none mb-2 bg-inputBg text-[#171717] shadow-md transition-all duration-200 ${fieldErrors.fullName ? 'border-error border-[1.5px] shadow-[0_0_0_2px_rgba(211,47,47,0.2),0_2px_8px_#e0e0e0]' : 'border-inputBorder border-[1.5px] shadow-[0_2px_8px_#e0e0e0]'}`}
        />
        {fieldErrors.fullName && <div className="text-error text-[0.98rem] mt-1" style={{color: COLORS.error}}>{fieldErrors.fullName}</div>}
      </div>
      <div className="mb-4">
        <label htmlFor="email" className="font-semibold text-foreground font-poppins mb-1 block">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="john.doe@university.edu"
          value={form.email}
          onChange={handleChange}
          className={`w-full px-4 py-3 rounded-lg font-poppins text-base outline-none mb-2 bg-inputBg text-[#171717] shadow-md transition-all duration-200 ${fieldErrors.email ? 'border-error border-[1.5px] shadow-[0_0_0_2px_rgba(211,47,47,0.2),0_2px_8px_#e0e0e0]' : 'border-inputBorder border-[1.5px] shadow-[0_2px_8px_#e0e0e0]'}`}
        />
        {fieldErrors.email && <div className="text-error text-[0.98rem] mt-1" style={{color: COLORS.error}}>{fieldErrors.email}</div>}
      </div>
      <div className="mb-4">
        <label htmlFor="university" className="font-semibold text-foreground font-poppins mb-1 block">University</label>
        <select
          id="university"
          name="university"
          value={form.university}
          onChange={handleChange}
          className={`w-full px-4 py-3 rounded-lg font-poppins text-base outline-none mb-2 bg-inputBg text-[#171717] shadow-md transition-all duration-200 border-inputBorder border-[1.5px] ${fieldErrors.university ? 'border-error' : ''}`}
        >
          <option value="">Select University</option>
          {universities.map(u => (
            <option key={u.id} value={u.id}>{u.name}</option>
          ))}
        </select>
        {fieldErrors.university && <div className="text-error text-[0.98rem] mt-1" style={{color: COLORS.error}}>{fieldErrors.university}</div>}
      </div>
          <div className="mb-4">
            <label htmlFor="school" className="font-semibold text-foreground font-poppins mb-1 block">School</label>
            <select
              id="school"
              name="school"
              value={form.school}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg font-poppins text-base outline-none mb-2 bg-inputBg text-[#171717] shadow-md transition-all duration-200 border-inputBorder border-[1.5px]`}
            // not required
              disabled={!form.university}
            >
              <option value="">Select School</option>
              {schools.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
      <div className="flex gap-3 mb-4">
        <div className="flex-1">
          <label htmlFor="department" className="font-semibold text-foreground font-poppins mb-1 block">Department</label>
          <select
            id="department"
            name="department"
            value={form.department}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-lg font-poppins text-base outline-none mb-2 bg-inputBg text-[#171717] shadow-md transition-all duration-200 border-inputBorder border-[1.5px] appearance-none ${error ? 'border-error shadow-[0_0_0_2px_rgba(211,47,47,0.2),0_2px_8px_#e0e0e0]' : 'shadow-[0_2px_8px_#e0e0e0]'}`}
          >
            <option value="">Select Department</option>
            {departments.map(dep => <option key={dep.id} value={dep.id}>{dep.name}</option>)}
          </select>
        </div>
        <div className="flex-1">
          <label htmlFor="year" className="font-semibold text-foreground font-poppins mb-1 block">Academic Year</label>
          <select
            id="year"
            name="year"
            value={form.year}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-lg font-poppins text-base outline-none mb-2 bg-inputBg text-[#171717] shadow-md transition-all duration-200 border-inputBorder border-[1.5px] appearance-none ${fieldErrors.year ? 'border-error' : ''}`}
          >
            <option value="">Select Year</option>
            {years.map(y => <option key={y.value} value={y.value}>{y.name}</option>)}
          </select>
          {fieldErrors.year && <div className="text-error text-[0.98rem] mt-1" style={{color: COLORS.error}}>{fieldErrors.year}</div>}
        </div>
      </div>
      <div className="mb-2">
        <label htmlFor="password" className="font-semibold text-foreground font-poppins mb-1 block">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Create a strong password"
          value={form.password}
          onChange={handleChange}
          className={`w-full px-4 py-3 rounded-lg font-poppins text-base outline-none bg-inputBg text-[#171717] shadow-md transition-all duration-200 ${fieldErrors.password ? 'border-error border-[1.5px] shadow-[0_0_0_2px_rgba(211,47,47,0.2),0_2px_8px_#e0e0e0]' : 'border-inputBorder border-[1.5px] shadow-[0_2px_8px_#e0e0e0]'}`}
        />
        {fieldErrors.password && <div className="text-error text-[0.98rem] mt-1" style={{color: COLORS.error}}>{fieldErrors.password}</div>}
        {/* Password strength meter */}
        <div className="h-[6px] bg-[#ececec] rounded mt-1 mb-2">
          <div style={{
            width: `${(passwordStrength / 4) * 100}%`,
            height: '100%',
            background: passwordStrength === 4 ? COLORS.primary : passwordStrength >= 2 ? '#FFD600' : COLORS.error,
            borderRadius: 4,
            transition: 'width 0.3s',
          }} />
        </div>
      </div>
      {showError && error && <div className="text-error text-[0.98rem] mb-2 " style={{color: COLORS.error}}>{error}</div>}
      <div className="flex items-start mb-3 gap-2">
        <label className="flex items-start font-poppins text-[0.98rem] text-foreground gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="agree"
            checked={form.agree}
            onChange={handleChange}
            className="mt-1 mr-2"
          />
          <span>
            I agree to the{' '}
            <a href="#" className="text-primary underline mx-1">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-primary underline mx-1">Privacy Policy</a>
          </span>
        </label>
        {fieldErrors.agree && <div className="text-error text-[0.98rem] mt-1" style={{color: COLORS.error}}>{fieldErrors.agree}</div>}
      </div>
      <button
        type="submit"
        disabled={loading || !form.agree}
        style={{ backgroundColor: form.agree ? COLORS.primary : '#ccc', cursor: form.agree ? 'pointer' : 'not-allowed', opacity: loading ? 0.7 : 1 }}
        className="w-full text-white font-poppins font-semibold text-[1.08rem] rounded-lg py-3 border-none mt-2 mb-4 shadow-md cursor-pointer transition-colors flex items-center justify-center"
      >
        {loading ? (
          <span className="loader mr-2 inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
        ) : null}
        {loading ? 'Creating Account...' : 'Create Account'}
      </button>
      <div className="flex items-center my-4">
        <div className="flex-1 h-[1px] bg-inputBorder opacity-50" />
        <span className="mx-3 text-[#171717] font-poppins text-[0.98rem]">Or sign up with</span>
        <div className="flex-1 h-[1px] bg-inputBorder opacity-50" />
      </div>
      <button
        type="button"
        className="w-full bg-white text-foreground font-poppins font-semibold text-[1.08rem] rounded-lg py-3 border-inputBorder border-[1.5px] mb-2 shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
      >
        <Image src="/icons/google.png" alt="Google" width={22} height={22} className="mr-2" />
        Continue with Google
      </button>
      <div className="text-center mt-2">
        <span className="text-[#171717] font-poppins text-[0.98rem]">
          Already have an account?{' '}
          <Link href="/auth/login" prefetch={false} className="text-primary underline font-medium">Sign In</Link>
        </span>
      </div>
    </form>
  );
};

export default SignUpForm;
