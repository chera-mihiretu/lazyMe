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
    <div className="fixed top-0 left-0 w-screen h-screen bg-black/20 flex items-center justify-center z-[1000]">
      <div className="bg-white rounded-2xl shadow-[0_2px_16px_#4320d120] px-8 py-6 min-w-[320px] w-full max-w-md flex flex-col gap-4">
        <h2 className="font-bold text-[22px] text-[#4320d1] mb-4">Add School</h2>
        <select
          value={selectedUniversity}
          onChange={e => setSelectedUniversity(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-[#eee] mb-4 text-[16px]"
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
          className="w-full px-3 py-2 rounded-lg border border-[#eee] mb-4 text-[16px]"
        />
        <input
          type="text"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Description (optional)"
          className="w-full px-3 py-2 rounded-lg border border-[#eee] mb-4 text-[16px]"
        />
        {error && <div className="text-[#e53e3e] font-medium mb-2">{error}</div>}
        <div className="flex flex-col gap-3 w-full mt-2">
          <button
            onClick={onClose}
            className="bg-[#eee] text-[#4320d1] border-none rounded-lg py-2 font-semibold w-full text-[18px] disabled:cursor-not-allowed"
            style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
            disabled={loading}
          >Cancel</button>
          <button
            onClick={handleSubmit}
            className={`border-none rounded-lg py-2 font-semibold w-full text-[18px] text-white ${loading ? 'bg-[#aaa] cursor-not-allowed' : 'bg-[#4320d1] cursor-pointer'}`}
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