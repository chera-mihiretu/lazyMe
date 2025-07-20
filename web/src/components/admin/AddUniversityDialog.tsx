import React, { useState } from "react";

interface AddUniversityDialogProps {
  open: boolean;
  onClose: () => void;
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const AddUniversityDialog: React.FC<AddUniversityDialogProps> = ({ open, onClose }) => {
  const [universityName, setUniversityName] = useState("");
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  if (!open) return null;
  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(baseUrl + "/universities/", {
        method: "POST",
        headers: { "Content-Type": "application/json" , "Authorization": `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify({ name: universityName, city: country })
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to add university");
      }
      setUniversityName("");
      setCountry("");
      onClose();
    } catch (err: any) {
      setError(err.message || "Error adding university");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(30,30,40,0.25)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 32px #4320d120', padding: 32, minWidth: 340, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <h3 style={{ fontWeight: 700, fontSize: 20, color: '#4320d1', marginBottom: 8 }}>Add University</h3>
        <input
          type="text"
          value={universityName}
          onChange={e => setUniversityName(e.target.value)}
          placeholder="University Name"
          style={{ padding: '0.7rem 1rem', borderRadius: 8, border: '1px solid #ececec', fontSize: 16, marginBottom: 8 }}
        />
        <input
          type="text"
          value={country}
          onChange={e => setCountry(e.target.value)}
          placeholder="Country (optional)"
          style={{ padding: '0.7rem 1rem', borderRadius: 8, border: '1px solid #ececec', fontSize: 16, marginBottom: 8 }}
        />
        {error && <div style={{ color: '#e53e3e', fontWeight: 500, marginBottom: 8 }}>{error}</div>}
        <button
          onClick={handleSubmit}
          style={{ background: '#4320d1', color: '#fff', border: 'none', borderRadius: 8, padding: '0.7rem 2rem', fontWeight: 600, fontSize: 16, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
          disabled={!universityName.trim() || loading}
        >
          {loading ? "Adding..." : "Add University"}
        </button>
        <button
          onClick={onClose}
          style={{
            background: "#eee",
            color: "#4320d1",
            border: "none",
            borderRadius: 8,
            padding: "8px 0",
            fontWeight: 600,
            cursor: "pointer",
            width: "100%",
            fontSize: 18,
        }}
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddUniversityDialog;
