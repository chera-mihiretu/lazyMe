import React, { useState, useEffect } from "react";
import { Department } from "../../types/Department";

interface AddMaterialDialogProps {
  open: boolean;
  onClose: () => void;
}
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const AddMaterialDialog: React.FC<AddMaterialDialogProps> = ({ open, onClose }) => {
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [materialName, setMaterialName] = useState("");
  const [materialFile, setMaterialFile] = useState<File | null>(null);
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");
  const [universities, setUniversities] = useState<{ id: string; name: string }[]>([]);
  const [schools, setSchools] = useState<{ id: string; name: string }[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loadingUniversities, setLoadingUniversities] = useState(false);
  const [loadingSchools, setLoadingSchools] = useState(false);
  const [loadingDepartments, setLoadingDepartments] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setLoadingUniversities(true);
    fetch(baseUrl + "/universities/")
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.universities)) {
          setUniversities(data.universities.map((u: any) => ({ id: u.id, name: u.name })));
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
        }
        setLoadingSchools(false);
      })
      .catch(() => {
        setError("Failed to load schools");
        setLoadingSchools(false);
      });
  }, [selectedUniversity]);

  useEffect(() => {
    if (!selectedSchool) {
      setDepartments([]);
      return;
    }
    setLoadingDepartments(true);
    fetch(`${baseUrl}/departments/tree/${selectedSchool}`)
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.departments)) {
          setDepartments(data.departments);
        }
        setLoadingDepartments(false);
      })
      .catch(() => {
        setError("Failed to load departments");
        setLoadingDepartments(false);
      });
  }, [selectedSchool]);
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState("");
  if (!open) return null;
  const handleSubmit = async () => {
    setAddError("");
    setAddLoading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("title", materialName);
      formData.append("department_id", selectedDepartment);
      if (year) formData.append("year", year);
      if (semester) formData.append("semester", semester);
      if (materialFile) formData.append("file", materialFile);

      const res = await fetch(baseUrl + "/materials/", {
        method: "POST",
        headers: token ? { "Authorization": `Bearer ${token}` } : undefined,
        body: formData,
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to add material");
      }
      setMaterialName("");
      setSelectedUniversity("");
      setSelectedSchool("");
      setSelectedDepartment("");
      setMaterialFile(null);
      setYear("");
      setSemester("");
      onClose();
    } catch (err: any) {
      setAddError(err.message || "Error adding material");
    } finally {
      setAddLoading(false);
    }
  };
  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-black/20 flex items-center justify-center z-[1000]">
      <div className="bg-white rounded-2xl shadow-[0_2px_16px_#4320d120] px-8 py-6 min-w-[320px] w-full max-w-md flex flex-col gap-[22px]">
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
            <option value="">{loadingDepartments ? "Loading..." : "Select Department"}</option>
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
          Year
          <input
            type="number"
            value={year}
            onChange={e => setYear(e.target.value)}
            placeholder="Enter year"
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
          Semester
          <input
            type="number"
            value={semester}
            onChange={e => setSemester(e.target.value)}
            placeholder="Enter semester"
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
          {addError && <div style={{ color: '#e53e3e', fontWeight: 500, marginBottom: 8 }}>{addError}</div>}
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
            disabled={!selectedUniversity || !selectedSchool || !selectedDepartment || !materialName.trim() || !materialFile || addLoading}
          >{addLoading ? "Adding..." : "Add Material"}</button>
        </div>
      </div>
    </div>
  );
};

export default AddMaterialDialog;
