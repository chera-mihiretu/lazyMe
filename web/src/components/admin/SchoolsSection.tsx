import React, { useState } from "react";
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const SchoolsSection: React.FC = () => {
  const [schools, setSchools] = useState<{ id: string; name: string; description?: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState<string | null>(null);
  const [deleteInput, setDeleteInput] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const handleDelete = async (id: string) => {
    setDeleteError("");
    setDeleteLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(baseUrl + "/schools/" + id, {
        method: "DELETE",
        headers: token ? { "Authorization": `Bearer ${token}` } : {},
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to delete school");
      }
      setSchools(prev => prev.filter(s => s.id !== id));
      setShowDeleteDialog(null);
      setDeleteInput("");
    } catch (err: any) {
      setDeleteError(err.message || "Error deleting school");
    } finally {
      setDeleteLoading(false);
    }
  };

  React.useEffect(() => {
    setLoading(true);
    fetch(baseUrl + "/schools/all?page=1")
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch schools");
        return res.json();
      })
      .then(data => {
        if (data && Array.isArray(data.schools)) {
          setSchools(data.schools);
        } else {
          setError("Invalid schools data");
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || "Error fetching schools");
        setLoading(false);
      });
  }, []);

  return (
    <React.Fragment>
      <section className="bg-white rounded-[14px] shadow-[0_2px_8px_#4320d120] px-6 pt-6 pb-4 flex flex-col min-h-[180px]">
        <h3 className="font-bold text-[20px] text-[#4320d1] mb-3">Schools</h3>
        {loading ? (
          <div className="text-[#888] font-medium py-3">Loading...</div>
        ) : error ? (
          <div className="text-[#e53e3e] font-medium py-3">{error}</div>
        ) : (
          <div className="flex flex-col gap-2 flex-1">
            {schools.slice(0, 4).map(s => (
              <div key={s.id} className="flex flex-col bg-[#f7f7fa] rounded-lg px-3 py-2 mb-0.5">
                <div className="flex items-center justify-between">
                  <span className="text-[#333] font-medium">{s.name}</span>
                  <div className="flex gap-2">
                    <button className="bg-[#eee] text-[#4320d1] border-none rounded-md px-2.5 py-1 font-medium cursor-pointer text-[14px]">Edit</button>
                    <button
                      className="bg-[#f44336] text-white border-none rounded-md px-2.5 py-1 font-medium cursor-pointer text-[14px]"
                      onClick={() => { setShowDeleteDialog(s.id); setDeleteInput(""); setDeleteError(""); }}
                    >Delete</button>
                  </div>
                </div>
                {s.description && (
                  <div className="text-[#aaa] text-[13px] mt-0.5 flex items-center gap-1">
                    <span className="inline-block w-4 h-4">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="8" cy="8" r="8" fill="#aaa" />
                        <text x="8" y="11" textAnchor="middle" fontSize="10" fill="#fff">i</text>
                      </svg>
                    </span>
                    {s.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        <button className="mt-3 bg-[#4320d1] text-white border-none rounded-lg py-2 font-semibold w-full text-[16px] cursor-pointer">More</button>
      </section>
      {/* Delete Warning Dialog */}
      {showDeleteDialog && (
        <div className="fixed top-0 left-0 w-screen h-screen bg-black/20 flex items-center justify-center z-[1000]">
          <div className="bg-white rounded-2xl shadow-[0_4px_32px_#4320d120] px-8 py-6 min-w-[320px] w-full max-w-md flex flex-col gap-4">
            <h3 className="font-bold text-[20px] text-[#e53e3e] mb-2">Delete School</h3>
            <div className="text-[#333] font-medium mb-2">Type <span className="text-[#e53e3e] font-bold">'delete school'</span> to confirm deletion.</div>
            <input
              type="text"
              value={deleteInput}
              onChange={e => setDeleteInput(e.target.value)}
              placeholder="Type here..."
              className="px-4 py-3 rounded-lg border border-[#ececec] text-[16px] mb-2"
              disabled={deleteLoading}
            />
            {deleteError && <div className="text-[#e53e3e] font-medium">{deleteError}</div>}
            <button
              onClick={() => {
                if (deleteInput.trim().toLowerCase() === "delete school") {
                  handleDelete(showDeleteDialog);
                } else {
                  setDeleteError("You must type 'delete school' to confirm.");
                }
              }}
              className={`bg-[#f44336] text-white border-none rounded-lg px-8 py-3 font-semibold text-[16px] ${deleteLoading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
              disabled={deleteLoading}
            >{deleteLoading ? "Deleting..." : "Confirm Delete"}</button>
            <button
              onClick={() => { setShowDeleteDialog(null); setDeleteInput(""); setDeleteError(""); }}
              className="bg-[#eee] text-[#4320d1] border-none rounded-lg py-2 font-semibold w-full text-[18px] disabled:cursor-not-allowed"
              style={{ cursor: deleteLoading ? 'not-allowed' : 'pointer' }}
              disabled={deleteLoading}
            >Cancel</button>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default SchoolsSection;
