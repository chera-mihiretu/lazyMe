"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import dynamic from "next/dynamic";
const ProtectedRoute = dynamic(() => import('../../ProtectedRoute'), { ssr: false });
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const CompleteAccountPage: React.FC = () => {
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [universities, setUniversities] = useState<any[]>([]);
  const [schools, setSchools] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
    const router = useRouter();
  // Fetch universities on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${baseUrl}/universities/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setUniversities(data.universities || []))
      .catch(() => setUniversities([]));
  }, []);

  // Fetch schools when university changes
  useEffect(() => {
    if (!selectedUniversity) return;
    const token = localStorage.getItem("token");
    fetch(`${baseUrl}/schools/?university_id=${selectedUniversity}&page=${1}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setSchools(data.schools || []))
      .catch(() => setSchools([]));
  }, [selectedUniversity]);

  // Fetch departments when school changes
  useEffect(() => {
    if (!selectedSchool) return;
    const token = localStorage.getItem("token");
    fetch(`${baseUrl}/departments/tree/${selectedSchool}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setDepartments(data.departments || []))
      .catch(() => setDepartments([]));
  }, [selectedSchool]);

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setProfileImage(file);
    setProfilePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!selectedUniversity) {
      setError("Please select a university.");
      return;
    }
    if (!selectedSchool) {
      setError("Please select a school.");
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("university_id", selectedUniversity);
      formData.append("school_id", selectedSchool);
      if (selectedDepartment) {
        formData.append("department_id", selectedDepartment);
      }
      if (profileImage) {
        formData.append("file", profileImage);
      }
      const res = await fetch(`${baseUrl}/users/complete-account`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "Failed to complete profile");
      }
      setLoading(false);
      router.push("/home/posts"); // Redirect to home after successful completion
      // Optionally redirect here
    } catch (err: any) {
      setLoading(false);
      setError(err.message || "Failed to complete profile");
    }
  };

  return (
    <ProtectedRoute role="student">
    <div className="max-w-[480px] my-12 mx-auto bg-white rounded-xl shadow-[0_2px_16px_#4320d10a] p-8">
      <h2 className="font-bold text-2xl mb-6">Complete Your Profile</h2>
      <form onSubmit={handleSubmit}>
        {/* Profile Image */}
        <div className="mb-6 flex flex-col items-center">
          <label className="font-semibold text-base mb-2">Profile Image <span className="text-gray-500 font-normal">(optional)</span></label>
          <div style={{ position: 'relative', width: 130, height: 130, marginBottom: 8 }}>
            <input
              id="profile-image-input"
              type="file"
              accept="image/*"
              onChange={handleProfileImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="relative w-[130px] h-[130px] rounded-full overflow-hidden border-[2.5px] border-[#6366f1] shadow-[0_2px_12px_#6366f133] flex items-center justify-center bg-[#f7f7fb] mb-2">
              {profilePreview ? (
                <img src={profilePreview} alt="Profile Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <img src="/icons/avatar.png" alt="Avatar Placeholder" style={{ width: 70, height: 70, opacity: 0.7 }} />
              )}
            </div>
          </div>
          <div className="text-[#6366f1] font-medium text-[15px] cursor-pointer mt-1" onClick={() => document.getElementById('profile-image-input')?.click()}>
            Pick image
          </div>
        </div>
        {/* University Selection */}
        <div className="mb-5">
          <label className="font-semibold text-base">University</label>
          <select
            value={selectedUniversity}
            onChange={e => {
              setSelectedUniversity(e.target.value);
              setSelectedSchool("");
              setSelectedDepartment("");
            }}
            className="w-full rounded-lg border-[1.5px] border-[#e3e6ef] px-3 py-2 text-base mt-2"
            required
          >
            <option value="">Select university</option>
            {universities.map(u => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </div>
        {/* School Selection */}
        <div className="mb-5">
          <label className="font-semibold text-base">School</label>
          <select
            value={selectedSchool}
            onChange={e => {
              setSelectedSchool(e.target.value);
              setSelectedDepartment("");
            }}
            className="w-full rounded-lg border-[1.5px] border-[#e3e6ef] px-3 py-2 text-base mt-2"
            required
            disabled={!selectedUniversity}
          >
            <option value="">Select school</option>
            {schools.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
        {/* Department Selection (Optional) */}
        <div className="mb-5">
          <label className="font-semibold text-base">Department <span className="text-gray-500 font-normal">(optional)</span></label>
          <select
            value={selectedDepartment}
            onChange={e => setSelectedDepartment(e.target.value)}
            className="w-full rounded-lg border-[1.5px] border-[#e3e6ef] px-3 py-2 text-base mt-2"
            disabled={!selectedSchool}
          >
            <option value="">Select department</option>
            {departments.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>
        {error && <div className="text-[#d32f2f] mb-3">{error}</div>}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg font-bold text-base mt-2 text-white transition-colors ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#2563eb] hover:bg-blue-600'}`}
        >
          {loading ? "Completing..." : "Complete Profile"}
        </button>
      </form>
    </div>
    </ProtectedRoute>
  );
};

export default CompleteAccountPage;
