import React, { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
}

const AddSchoolDialog: React.FC<Props> = ({ open, onClose }) => {
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const universities = [
    { id: "1", name: "Harvard" },
    { id: "2", name: "MIT" },
    { id: "3", name: "Stanford" },
    { id: "4", name: "Oxford" },
  ];
  if (!open) return null;
  const handleSubmit = () => {
    // Here you would handle the actual creation logic
    setSchoolName("");
    setSelectedUniversity("");
    onClose();
  };
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#4320d120', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
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
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', flexDirection: 'column' }}>
          <button onClick={onClose} style={{
                      background: "#eee",
                      color: "#4320d1",
                      border: "none",
                      borderRadius: 8,
                      padding: "8px 0",
                      fontWeight: 600,
                      cursor: "pointer",
                      width: "100%",
                      fontSize: 18,
                  }}>Cancel</button>

          <button onClick={handleSubmit} style={{
                        background: "#4320d1",
                        color: "#fff",
                        border: "none",
                        borderRadius: 8,
                        padding: "8px 0",
                        fontWeight: 600,
                        cursor: "pointer",
                        width: "100%",
                        fontSize: 18,
                      }} disabled={!selectedUniversity || !schoolName.trim()}>Add</button>
        </div>
      </div>
    </div>
  );
};

export default AddSchoolDialog;