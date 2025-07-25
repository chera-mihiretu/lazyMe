"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
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
    <div style={{ maxWidth: 480, margin: "3rem auto", background: "#fff", borderRadius: 16, boxShadow: "0 2px 16px #4320d10a", padding: 32 }}>
      <h2 style={{ fontWeight: 700, fontSize: 24, marginBottom: 24 }}>Complete Your Profile</h2>
      <form onSubmit={handleSubmit}>
        {/* Profile Image */}
        <div style={{ marginBottom: 22, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <label style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>Profile Image <span style={{ color: '#888', fontWeight: 400 }}>(optional)</span></label>
          <div style={{ position: 'relative', width: 130, height: 130, marginBottom: 8 }}>
            <input
              id="profile-image-input"
              type="file"
              accept="image/*"
              onChange={handleProfileImageChange}
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                opacity: 0,
                cursor: 'pointer',
                zIndex: 2,
                left: 0,
                top: 0,
              }}
            />
            <div style={{
              width: 130,
              height: 130,
              borderRadius: '50%',
              overflow: 'hidden',
              border: '2.5px solid #6366f1',
              boxShadow: '0 2px 12px #6366f133',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#f7f7fb',
              position: 'relative',
            }}>
              {profilePreview ? (
                <img src={profilePreview} alt="Profile Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <img src="/icons/avatar.png" alt="Avatar Placeholder" style={{ width: 70, height: 70, opacity: 0.7 }} />
              )}
            </div>
          </div>
          <div style={{ color: '#6366f1', fontWeight: 500, fontSize: 15, cursor: 'pointer', marginTop: 2 }} onClick={() => document.getElementById('profile-image-input')?.click()}>
            Pick image
          </div>
        </div>
        {/* University Selection */}
        <div style={{ marginBottom: 18 }}>
          <label style={{ fontWeight: 600, fontSize: 16 }}>University</label>
          <select
            value={selectedUniversity}
            onChange={e => {
              setSelectedUniversity(e.target.value);
              setSelectedSchool("");
              setSelectedDepartment("");
            }}
            style={{ width: '100%', borderRadius: 8, border: '1.5px solid #e3e6ef', padding: 10, fontSize: 15, marginTop: 6 }}
            required
          >
            <option value="">Select university</option>
            {universities.map(u => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </div>
        {/* School Selection */}
        <div style={{ marginBottom: 18 }}>
          <label style={{ fontWeight: 600, fontSize: 16 }}>School</label>
          <select
            value={selectedSchool}
            onChange={e => {
              setSelectedSchool(e.target.value);
              setSelectedDepartment("");
            }}
            style={{ width: '100%', borderRadius: 8, border: '1.5px solid #e3e6ef', padding: 10, fontSize: 15, marginTop: 6 }}
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
        <div style={{ marginBottom: 18 }}>
          <label style={{ fontWeight: 600, fontSize: 16 }}>Department <span style={{ color: '#888', fontWeight: 400 }}>(optional)</span></label>
          <select
            value={selectedDepartment}
            onChange={e => setSelectedDepartment(e.target.value)}
            style={{ width: '100%', borderRadius: 8, border: '1.5px solid #e3e6ef', padding: 10, fontSize: 15, marginTop: 6 }}
            disabled={!selectedSchool}
          >
            <option value="">Select department</option>
            {departments.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>
        {error && <div style={{ color: "#d32f2f", marginBottom: 12 }}>{error}</div>}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px 0",
            borderRadius: 8,
            border: "none",
            background: loading ? "#b3b3b3" : "#2563eb",
            color: "#fff",
            fontWeight: 700,
            fontSize: 17,
            cursor: loading ? "not-allowed" : "pointer",
            marginTop: 10,
            transition: "background 0.2s",
          }}
        >
          {loading ? "Completing..." : "Complete Profile"}
        </button>
      </form>
    </div>
  );
};

export default CompleteAccountPage;
