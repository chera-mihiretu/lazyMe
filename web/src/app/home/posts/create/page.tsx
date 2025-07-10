"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const CreatePostPage: React.FC = () => {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [departments, setDepartments] = useState<{ id: string; name: string }[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${baseUrl}/department/`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.departments)) {
          setDepartments(data.departments.map((d: any) => ({ id: d.id, name: d.name })));
        } else {
          setDepartments([]);
        }
      })
      .catch(() => setDepartments([]));
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setImages((prev) => {
      const newImages = [...prev, ...files];
      return newImages.slice(0, 3); // Only allow up to 3 images
    });
  };

  const handleRemoveImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    // Images are now optional
    if (!content.trim()) {
      setError("Content is required.");
      return;
    }
    if (!selectedDepartment) {
      setError("Please select a department.");
      return;
    }
    setLoading(true);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const formData = new FormData();
      formData.append("content", content);
      formData.append("department_id", selectedDepartment);
      images.forEach((img, idx) => {
        formData.append("images", img);
      });
      const res = await fetch(`${baseUrl}/posts/`, {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to create post");
      }
      setLoading(false);
      router.push("/home/posts");
    } catch (err: any) {
      setLoading(false);
      setError(err?.message || "Failed to create post. Please try again.");
    }
  };

  return (
    <div style={{ maxWidth: 720, margin: "3rem auto", background: "#fff", borderRadius: 16, boxShadow: "0 2px 16px #4320d10a", padding: 40 }}>
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
          <label style={{ fontWeight: 600, fontSize: 16 }}>Department</label>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            style={{ width: "100%", borderRadius: 8, border: "1.5px solid #e3e6ef", padding: 10, fontSize: 15, marginTop: 6 }}
            required
          >
            <option value="">Select department</option>
            {departments.map((dep) => (
              <option key={dep.id} value={dep.id}>{dep.name}</option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: 18 }}>
          <label style={{ fontWeight: 600, fontSize: 16, display: "block", marginBottom: 8 }}>Images (at least 3)</label>
          <label
            htmlFor="image-upload"
            style={{
              display: "inline-block",
              padding: "14px 32px",
              background: images.length >= 3 ? "#e3e6ef" : "#f3f6fb",
              color: images.length >= 3 ? "#888" : "#2563eb",
              borderRadius: 10,
              border: images.length >= 3 ? "2px dashed #e3e6ef" : "2px dashed #2563eb",
              fontWeight: 600,
              fontSize: 17,
              cursor: images.length >= 3 ? "not-allowed" : "pointer",
              marginBottom: 8,
              transition: "background 0.2s, border 0.2s",
              pointerEvents: images.length >= 3 ? "none" : "auto",
            }}
          >
            {images.length > 0 ? (images.length >= 3 ? "Max 3 Images" : "Change Images") : "Pick Images"}
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              style={{ display: "none" }}
              disabled={images.length >= 3}
            />
          </label>
          
          {images.length > 0 && (
            <div style={{ display: "flex", gap: 18, flexWrap: "wrap", marginTop: 10, justifyContent: "center" }}>
              {images.map((img, idx) => {
                const url = URL.createObjectURL(img);
                return (
                  <div key={idx} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <img
                      src={url}
                      alt={`selected-${idx}`}
                      style={{
                        width: 180,
                        height: 180,
                        objectFit: "cover",
                        borderRadius: 12,
                        border: "2px solid #e3e6ef",
                        background: "#f7f8fa",
                      }}
                      onLoad={() => URL.revokeObjectURL(url)}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      style={{
                        marginTop: 8,
                        padding: "4px 18px",
                        borderRadius: 8,
                        border: "none",
                        background: "#e53e3e",
                        color: "#fff",
                        fontWeight: 600,
                        fontSize: 15,
                        cursor: "pointer",
                        transition: "background 0.2s",
                      }}
                    >
                      Remove
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
  );
};

export default CreatePostPage;
