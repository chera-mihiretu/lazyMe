import React, { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const AddSchoolDialog: React.FC<Props> = ({ open, onClose }) => {
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [description, setDescription] = useState("");
  const [universities, setUniversities] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  React.useEffect(() => {
    if (!open) return;
    fetch(baseUrl + "/universities/")
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch universities");
        return res.json();
      })
      .then(data => {
        if (data && Array.isArray(data.universities)) {
          setUniversities(data.universities);
        }
      })
      .catch(() => {
        setUniversities([]);
      });
  }, [open]);

  if (!open) return null;

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(baseUrl + "/schools/", {
        method: "POST",
        headers: { "Content-Type": "application/json" , "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ name: schoolName, description, university_id: selectedUniversity })
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to add school");
      }
      setSchoolName("");
      setSelectedUniversity("");
      setDescription("");
      onClose();
    } catch (err: any) {
      setError(err.message || "Error adding school");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(30,30,40,0.25)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: 12, padding: 32, minWidth: 320, boxShadow: '0 2px 8px #4320d120' }}>
        <h2 style={{ fontWeight: 700, fontSize: 22, color: '#4320d1', marginBottom: 18 }}>Add School</h2>
        <select
          value={selectedUniversity}
          onChange={e => setSelectedUniversity(e.target.value)}
          style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #eee', marginBottom: 18, fontSize: 16 }}
        >
          <option value="">Select University</option>
          {universities.map(u => (
            <option key={u.id} value={u.id}>{u.name}</option>
          ))}
        </select>
        <input
          type="text"
          value={schoolName}
          onChange={e => setSchoolName(e.target.value)}
          placeholder="School Name"
          style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #eee', marginBottom: 18, fontSize: 16 }}
        />
        <input
          type="text"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Description (optional)"
          style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #eee', marginBottom: 18, fontSize: 16 }}
        />
        {error && <div style={{ color: '#e53e3e', fontWeight: 500, marginBottom: 8 }}>{error}</div>}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', flexDirection: 'column' }}>
          <button onClick={onClose} style={{
                      background: "#eee",
                      color: "#4320d1",
                      border: "none",
                      borderRadius: 8,
                      padding: "8px 0",
                      fontWeight: 600,
                      cursor: loading ? "not-allowed" : "pointer",
                      width: "100%",
                      fontSize: 18,
                  }} disabled={loading}>Cancel</button>

          <button
            onClick={handleSubmit}
            style={{
              background: loading ? "#aaa" : "#4320d1",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "8px 0",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              width: "100%",
              fontSize: 18,
            }}
            disabled={!selectedUniversity || !schoolName.trim() || loading}
          >
            {loading ? "Adding..." : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSchoolDialog;