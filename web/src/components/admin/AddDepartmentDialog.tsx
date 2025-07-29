import React, { useState, useEffect } from "react";
import { University } from "../signup/useUniversities";
import { School } from "../signup/useSchools";

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
  const [year, setYear] = useState("");
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState("");
  const [universities, setUniversities] = useState<{ id: string; name: string }[]>([]);
  const [schools, setSchools] = useState<{ id: string; name: string }[]>([]);
  const [loadingUniversities, setLoadingUniversities] = useState(false);
  const [loadingSchools, setLoadingSchools] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoadingUniversities(true);
    fetch(baseUrl + "/universities/")
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.universities)) {
          setUniversities(data.universities.map((u: University) => ({ id: u.id, name: u.name })));
        } else {
        }
        setLoadingUniversities(false);
      })
      .catch(() => {
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
          setSchools(data.schools.map((s: School) => ({ id: s.id, name: s.name })));
        } else {
        }
        setLoadingSchools(false);
      })
      .catch(() => {
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
          years: year ? Number(year) : undefined,
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
      setYear("");
      onClose();
    } catch (err) {
      setAddError("Error adding department" + err);
    } finally {
      setAddLoading(false);
    }
  };
  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-black/20 flex items-center justify-center z-[1000]">
      <div className="bg-white rounded-2xl shadow-[0_2px_16px_#4320d120] px-8 py-6 min-w-[320px] w-full max-w-md flex flex-col gap-[22px]">
        <h2 className="m-0 font-bold text-[22px] text-[#4320d1]">Add Department</h2>
        <label className="font-medium text-[16px] text-[#333]">
          University
          <select
            value={selectedUniversity}
            onChange={e => setSelectedUniversity(e.target.value)}
            className="mt-2 w-full px-3 py-2 rounded-lg border border-[#ccc] text-[16px]"
          >
            <option value="">{loadingUniversities ? "Loading..." : "Select University"}</option>
            {universities.map(u => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </label>
        <label className="font-medium text-[16px] text-[#333]">
          School
          <select
            value={selectedSchool}
            onChange={e => setSelectedSchool(e.target.value)}
            className="mt-2 w-full px-3 py-2 rounded-lg border border-[#ccc] text-[16px]"
          >
            <option value="">{loadingSchools ? "Loading..." : "Select School"}</option>
            {schools.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </label>
        <label className="font-medium text-[16px] text-[#333]">
          Department Name
          <input
            type="text"
            value={departmentName}
            onChange={e => setDepartmentName(e.target.value)}
            placeholder="Enter department name"
            className="mt-2 w-full px-3 py-2 rounded-lg border border-[#ccc] text-[16px]"
          />
        </label>
        <label className="font-medium text-[16px] text-[#333]">
          Description (optional)
          <input
            type="text"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Enter department description"
            className="mt-2 w-full px-3 py-2 rounded-lg border border-[#ccc] text-[16px]"
          />
        </label>
        <label className="font-medium text-[16px] text-[#333]">
          Department Year
          <input
            type="number"
            value={year}
            onChange={e => setYear(e.target.value)}
            placeholder="Enter department year"
            className="mt-2 w-full px-3 py-2 rounded-lg border border-[#ccc] text-[16px]"
          />
        </label>
        <div className="flex flex-col gap-4 mt-3 w-full">
          {addError && <div className="text-[#e53e3e] font-medium mb-2">{addError}</div>}
          <button
            onClick={onClose}
            className="bg-[#eee] text-[#4320d1] border-none rounded-lg py-2 font-semibold w-full text-[18px] disabled:cursor-not-allowed"
            style={{ cursor: addLoading ? "not-allowed" : "pointer" }}
            disabled={addLoading}
          >Cancel</button>
          <button
            onClick={handleSubmit}
            className={`border-none rounded-lg py-2 font-semibold w-full text-[18px] text-white ${addLoading ? 'bg-[#aaa] cursor-not-allowed' : 'bg-[#4320d1] cursor-pointer'}`}
            disabled={!selectedUniversity || !selectedSchool || !departmentName.trim() || addLoading}
          >{addLoading ? "Adding..." : "Add Department"}</button>
        </div>
      </div>
    </div>
  );
};

export default AddDepartmentDialog;
