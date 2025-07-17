import React, { useState } from "react";

interface AddMaterialDialogProps {
  open: boolean;
  onClose: () => void;
}

const AddMaterialDialog: React.FC<AddMaterialDialogProps> = ({ open, onClose }) => {
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [materialName, setMaterialName] = useState("");
  const [materialFile, setMaterialFile] = useState<File | null>(null);
  const universities = [
    { id: "1", name: "Harvard" },
    { id: "2", name: "MIT" },
    { id: "3", name: "Stanford" },
  ];
  const schools = [
    { id: "1", name: "Engineering" },
    { id: "2", name: "Business" },
    { id: "3", name: "Arts" },
  ];
  const departments = [
    { id: "1", name: "Computer Science" },
    { id: "2", name: "Marketing" },
    { id: "3", name: "Design" },
  ];
  if (!open) return null;
  const handleSubmit = () => {
    // Here you would handle the actual creation logic
    setMaterialName("");
    setSelectedUniversity("");
    setSelectedSchool("");
    setSelectedDepartment("");
    setMaterialFile(null);
    onClose();
  };
  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      background: "rgba(0,0,0,0.18)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
    }}>
      <div style={{
        background: "#fff",
        borderRadius: 16,
        boxShadow: "0 2px 16px #4320d120",
        padding: "32px 40px",
        minWidth: 340,
        maxWidth: "90vw",
        display: "flex",
        flexDirection: "column",
        gap: 22,
      }}>
        <h2 style={{ margin: 0, fontWeight: 700, fontSize: 22, color: "#4320d1" }}>Add Material</h2>
        <label style={{ fontWeight: 500, fontSize: 16, color: "#333" }}>
          University
          <select
            value={selectedUniversity}
            onChange={e => setSelectedUniversity(e.target.value)}
            style={{
              marginTop: 8,
              width: "100%",
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid #ccc",
              fontSize: 16,
            }}
          >
            <option value="">Select University</option>
            {universities.map(u => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </label>
        <label style={{ fontWeight: 500, fontSize: 16, color: "#333" }}>
          School
          <select
            value={selectedSchool}
            onChange={e => setSelectedSchool(e.target.value)}
            style={{
              marginTop: 8,
              width: "100%",
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid #ccc",
              fontSize: 16,
            }}
          >
            <option value="">Select School</option>
            {schools.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </label>
        <label style={{ fontWeight: 500, fontSize: 16, color: "#333" }}>
          Department
          <select
            value={selectedDepartment}
            onChange={e => setSelectedDepartment(e.target.value)}
            style={{
              marginTop: 8,
              width: "100%",
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid #ccc",
              fontSize: 16,
            }}
          >
            <option value="">Select Department</option>
            {departments.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </label>
        <label style={{ fontWeight: 500, fontSize: 16, color: "#333" }}>
          Material Name
          <input
            type="text"
            value={materialName}
            onChange={e => setMaterialName(e.target.value)}
            placeholder="Enter material name"
            style={{
              marginTop: 8,
              width: "100%",
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid #ccc",
              fontSize: 16,
            }}
          />
        </label>
        <label style={{ fontWeight: 500, fontSize: 16, color: "#333" }}>
          Material PDF
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
            <label htmlFor="material-pdf-upload" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', background: '#f3f3f7', borderRadius: 8, padding: '8px 16px', border: '1px solid #ccc', fontWeight: 500 }}>
              <img src="/icons/pdf-file.png" alt="PDF" width={24} height={24} style={{ marginRight: 8 }} />
              <span style={{ fontSize: 16, color: '#4320d1' }}>Upload PDF</span>
              <input
                id="material-pdf-upload"
                type="file"
                accept="application/pdf"
                onChange={e => {
                  const file = e.target.files && e.target.files[0];
                  setMaterialFile(file || null);
                }}
                style={{ display: 'none' }}
              />
            </label>
            {materialFile && (
              <span style={{ fontSize: 14, color: '#4320d1' }}>Selected: {materialFile.name}</span>
            )}
          </div>
        </label>
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 12, width: "100%" }}>
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
          >Cancel</button>
          <button
            onClick={handleSubmit}
            style={{
              background: "#4320d1",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "8px 0",
              fontWeight: 600,
              cursor: "pointer",
              width: "100%",
              fontSize: 18,
            }}
            disabled={!selectedUniversity || !selectedSchool || !selectedDepartment || !materialName.trim() || !materialFile}
          >Add Material</button>
        </div>
      </div>
    </div>
  );
};

export default AddMaterialDialog;
