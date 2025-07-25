"use client";
import React, { useState, useEffect } from "react";
import type { Department } from "@/types/Department";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/app/ProtectedRoute";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const CreatePostPage: React.FC = () => {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${baseUrl}/departments/`, {
      headers: {
        Authorization:  `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setDepartments(data.departments || [])})
      .catch(() => setDepartments([]));
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setImages(prev => {
      const newImages = [...prev, ...files];
      if (newImages.length > 3) {
        return newImages.slice(0, 3);
      }
      return newImages;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!content.trim()) {
      setError("Content is required.");
      return;
    }
    if (selectedDepartments.length === 0) {
      setError("Please select at least one department.");
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("content", content);
      images.forEach((file) => {
        formData.append("files", file);
      });
      selectedDepartments.forEach((id) => {
        formData.append("department_id", id);
      });

      const res = await fetch(`${baseUrl}/posts/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData,
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "Failed to create post");
      }
      setLoading(false);
      router.push("/home/posts");
    } catch (err: any) {
      setLoading(false);
      setError(err.message || "Failed to create post");
    }
  };

  return (
    <ProtectedRoute role='student'>
    <div style={{ maxWidth: 800, margin: "3rem auto", background: "#fff", borderRadius: 16, boxShadow: "0 2px 16px #4320d10a", padding: 40 }}>
      <h2 style={{ fontWeight: 700, fontSize: 24, marginBottom: 24 }}>Create Post</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 18 }}>
          <label style={{ fontWeight: 600, fontSize: 16 }}>Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            style={{ width: "100%", borderRadius: 8, border: "1.5px solid #e3e6ef", padding: 10, fontSize: 15, marginTop: 6 }}
            placeholder="What's on your mind?"
            required
          />
        </div>
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
        <div style={{ marginBottom: 18 }}>
          <label style={{ fontWeight: 600, fontSize: 16 }}>Images (at least 3)</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 8 }}>
            <button
              type="button"
              onClick={() => document.getElementById('image-input')?.click()}
              style={{
                background: 'linear-gradient(90deg, #6366f1 60%, #7c3aed 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '8px 22px',
                fontWeight: 600,
                fontSize: 15,
                cursor: 'pointer',
                boxShadow: '0 1px 4px #6366f133',
                transition: 'background 0.2s, box-shadow 0.2s',
              }}
            >
              📷 Pick Image
            </button>
            <input
              id="image-input"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
          </div>
          <div style={{ fontSize: 13, color: images.length < 3 ? "#d32f2f" : images.length === 3 ? "#22a06b" : "#888", marginTop: 4, fontWeight: 500 }}>
            {images.length} image(s) selected {images.length === 3 && "(max reached)"}
          </div>
          {images.length > 0 && (
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              gap: 20,
              marginTop: 18,
              justifyContent: 'flex-start',
              overflowX: 'auto',
              paddingBottom: 8,
              scrollbarWidth: 'thin',
              WebkitOverflowScrolling: 'touch',
            }}>
              {images.map((img, idx) => {
                const url = URL.createObjectURL(img);
                return (
                  <div key={idx} style={{ position: 'relative', borderRadius: 14, overflow: 'hidden', boxShadow: '0 2px 12px #4320d122', border: '2px solid #6366f1', background: '#f7f7fb', width: 220, height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                    <img
                      src={url}
                      alt={`Selected ${idx + 1}`}
                      style={{ width: 220, height: 220, objectFit: 'cover', display: 'block' }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImages(prev => prev.filter((_, i) => i !== idx));
                      }}
                      style={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        background: 'rgba(255,255,255,0.85)',
                        border: 'none',
                        borderRadius: '50%',
                        width: 32,
                        height: 32,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 1px 4px #4320d133',
                        fontSize: 18,
                        fontWeight: 700,
                        color: '#d32f2f',
                        zIndex: 2,
                        transition: 'background 0.2s',
                      }}
                      aria-label={`Remove image ${idx + 1}`}
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>
          )}
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
          {loading ? "Posting..." : "Create Post"}
        </button>
      </form>
    </div>
    </ProtectedRoute>
  );
};

export default CreatePostPage;
