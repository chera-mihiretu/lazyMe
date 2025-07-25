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
    <div className="fixed top-0 left-0 w-screen h-screen bg-black/20 flex items-center justify-center z-[1000]">
      <div className="bg-white rounded-2xl shadow-[0_2px_16px_#4320d120] px-8 py-6 min-w-[320px] w-full max-w-md flex flex-col gap-4">
        <h3 className="font-bold text-[20px] text-[#4320d1] mb-2">Add University</h3>
        <input
          type="text"
          value={universityName}
          onChange={e => setUniversityName(e.target.value)}
          placeholder="University Name"
          className="px-4 py-3 rounded-lg border border-[#ececec] text-[16px] mb-2"
        />
        <input
          type="text"
          value={country}
          onChange={e => setCountry(e.target.value)}
          placeholder="Country (optional)"
          className="px-4 py-3 rounded-lg border border-[#ececec] text-[16px] mb-2"
        />
        {error && <div className="text-[#e53e3e] font-medium mb-2">{error}</div>}
        <button
          onClick={onClose}
          className="bg-[#eee] text-[#4320d1] border-none rounded-lg py-2 font-semibold w-full text-[18px] disabled:cursor-not-allowed"
          style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
          disabled={loading}
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className={`bg-[#4320d1] text-white border-none rounded-lg px-8 py-3 font-semibold text-[16px] ${loading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
          disabled={!universityName.trim() || loading}
        >
          {loading ? "Adding..." : "Add University"}
        </button>
        
      </div>
    </div>
  );
};

export default AddUniversityDialog;
