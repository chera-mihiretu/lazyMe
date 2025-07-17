import React, { useState } from "react";

interface AddUniversityDialogProps {
  open: boolean;
  onClose: () => void;
}

const AddUniversityDialog: React.FC<AddUniversityDialogProps> = ({ open, onClose }) => {
  const [universityName, setUniversityName] = useState("");
  if (!open) return null;
  const handleSubmit = () => {
    // Here you would handle the actual creation logic
    setUniversityName("");
    onClose();
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
        <button
          onClick={handleSubmit}
          style={{ background: '#4320d1', color: '#fff', border: 'none', borderRadius: 8, padding: '0.7rem 2rem', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}
          disabled={!universityName.trim()}
        >
          Add University
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
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddUniversityDialog;
