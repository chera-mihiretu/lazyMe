import React, { useState } from "react";

interface AddDepartmentDialogProps {
  open: boolean;
  onClose: () => void;
}

const AddDepartmentDialog: React.FC<AddDepartmentDialogProps> = ({ open, onClose }) => {
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");
  const [departmentName, setDepartmentName] = useState("");
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
  if (!open) return null;
  const handleSubmit = () => {
    // Here you would handle the actual creation logic
    setDepartmentName("");
    setSelectedUniversity("");
    setSelectedSchool("");
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
        <h2 style={{ margin: 0, fontWeight: 700, fontSize: 22, color: "#4320d1" }}>Add Department</h2>
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
          Department Name
          <input
            type="text"
            value={departmentName}
            onChange={e => setDepartmentName(e.target.value)}
            placeholder="Enter department name"
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
            disabled={!selectedUniversity || !selectedSchool || !departmentName.trim()}
          >Add Department</button>
        </div>
      </div>
    </div>
  );
};

export default AddDepartmentDialog;
