import React, { useState, useEffect } from "react";

interface AddDepartmentDialogProps {
  open: boolean;
  onClose: () => void;
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const AddDepartmentDialog: React.FC<AddDepartmentDialogProps> = ({ open, onClose }) => {
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");
  const [departmentName, setDepartmentName] = useState("");
  const [description, setDescription] = useState("");
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState("");
  const [universities, setUniversities] = useState<{ id: string; name: string }[]>([]);
  const [schools, setSchools] = useState<{ id: string; name: string }[]>([]);
  const [loadingUniversities, setLoadingUniversities] = useState(false);
  const [loadingSchools, setLoadingSchools] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setLoadingUniversities(true);
    fetch(baseUrl + "/universities/")
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.universities)) {
          setUniversities(data.universities.map((u: any) => ({ id: u.id, name: u.name })));
        } else {
          setError("Failed to load universities");
        }
        setLoadingUniversities(false);
      })
      .catch(() => {
        setError("Failed to load universities");
        setLoadingUniversities(false);
      });
  }, [open]);

  useEffect(() => {
    if (!selectedUniversity) {
      setSchools([]);
      return;
    }
    setLoadingSchools(true);
    fetch(`${baseUrl}/schools/?university_id=${selectedUniversity}`)
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.schools)) {
          setSchools(data.schools.map((s: any) => ({ id: s.id, name: s.name })));
        } else {
          setError("Failed to load schools");
        }
        setLoadingSchools(false);
      })
      .catch(() => {
        setError("Failed to load schools");
        setLoadingSchools(false);
      });
  }, [selectedUniversity]);
  if (!open) return null;
  const handleSubmit = async () => {
    setAddError("");
    setAddLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(baseUrl + "/departments/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          name: departmentName,
          description,
          school_id: selectedSchool,
        }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to add department");
      }
      setDepartmentName("");
      setSelectedUniversity("");
      setSelectedSchool("");
      setDescription("");
      onClose();
    } catch (err: any) {
      setAddError(err.message || "Error adding department");
    } finally {
      setAddLoading(false);
    }
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
            <option value="">{loadingUniversities ? "Loading..." : "Select University"}</option>
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
            <option value="">{loadingSchools ? "Loading..." : "Select School"}</option>
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
        <label style={{ fontWeight: 500, fontSize: 16, color: "#333" }}>
          Description (optional)
          <input
            type="text"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Enter department description"
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
          {addError && <div style={{ color: '#e53e3e', fontWeight: 500, marginBottom: 8 }}>{addError}</div>}
          <button
            onClick={onClose}
            style={{
              background: "#eee",
              color: "#4320d1",
              border: "none",
              borderRadius: 8,
              padding: "8px 0",
              fontWeight: 600,
              cursor: addLoading ? "not-allowed" : "pointer",
              width: "100%",
              fontSize: 18,
            }}
            disabled={addLoading}
          >Cancel</button>
          <button
            onClick={handleSubmit}
            style={{
              background: addLoading ? "#aaa" : "#4320d1",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "8px 0",
              fontWeight: 600,
              cursor: addLoading ? "not-allowed" : "pointer",
              width: "100%",
              fontSize: 18,
            }}
            disabled={!selectedUniversity || !selectedSchool || !departmentName.trim() || addLoading}
          >{addLoading ? "Adding..." : "Add Department"}</button>
        </div>
      </div>
    </div>
  );
};

export default AddDepartmentDialog;
