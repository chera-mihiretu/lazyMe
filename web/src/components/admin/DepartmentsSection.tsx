import React, { useState } from "react";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const DepartmentsSection: React.FC = () => {
  const [departments, setDepartments] = useState<{ id: string; name: string; description?: string; year?: number }[]>([]);
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
      const res = await fetch(baseUrl + `/departments/${id}` , {
        method: "DELETE",
        headers: token ? { "Authorization": `Bearer ${token}` } : {},
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to delete department");
      }
      setDepartments(prev => prev.filter(dep => dep.id !== id));
      setShowDeleteDialog(null);
      setDeleteInput("");
    } catch (err: any) {
      setDeleteError(err.message || "Error deleting department");
    } finally {
      setDeleteLoading(false);
    }
  };

  React.useEffect(() => {
    setLoading(true);
    fetch(baseUrl + "/departments/")
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch departments");
        return res.json();
      })
      .then(data => {
        if (data && Array.isArray(data.departments)) {
          setDepartments(data.departments);
        } else {
          setError("Invalid departments data");
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || "Error fetching departments");
        setLoading(false);
      });
  }, []);

  return (
    <section className="bg-white rounded-[14px] shadow-[0_2px_8px_#4320d120] px-6 pt-6 pb-4 flex flex-col min-h-[180px]">
      <h3 className="font-bold text-[20px] text-[#4320d1] mb-3">Departments</h3>
      {loading ? (
        <div className="text-[#888] font-medium py-3">Loading...</div>
      ) : error ? (
        <div className="text-[#e53e3e] font-medium py-3">{error}</div>
      ) : (
        <div className="flex flex-col gap-2 flex-1">
          {departments.slice(0, 4).map(d => (
            <div key={d.id} className="flex flex-col bg-[#f7f7fa] rounded-lg px-3 py-2 mb-0.5">
              <div className="flex items-center justify-between">
                <span className="text-[#333] font-medium">{d.name}</span>
                <div className="flex gap-2">
                  <button className="bg-[#eee] text-[#4320d1] border-none rounded-md px-2.5 py-1 font-medium cursor-pointer text-[14px]">Edit</button>
                  <button
                    className="bg-[#f44336] text-white border-none rounded-md px-2.5 py-1 font-medium cursor-pointer text-[14px]"
                    onClick={() => { setShowDeleteDialog(d.id); setDeleteInput(""); setDeleteError(""); }}
                  >Delete</button>
                </div>
              </div>
              {d.description && (
                <div className="text-[#aaa] text-[13px] mt-0.5 flex items-center gap-1">
                  <span className="inline-block w-4 h-4">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="8" cy="8" r="8" fill="#aaa" />
                      <text x="8" y="11" textAnchor="middle" fontSize="10" fill="#fff">i</text>
                    </svg>
                  </span>
                  {d.description}
                </div>
              )}
              {d.year !== undefined && (
                <div className="text-[#aaa] text-[13px] mt-0.5 flex items-center gap-1">
                  <span className="inline-block w-4 h-4">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="8" cy="8" r="8" fill="#aaa" />
                      <text x="8" y="11" textAnchor="middle" fontSize="10" fill="#fff">Y</text>
                    </svg>
                  </span>
                  {d.year}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {/* Delete Warning Dialog */}
      {showDeleteDialog && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(30,30,40,0.25)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 32px #4320d120', padding: 32, minWidth: 340, display: 'flex', flexDirection: 'column', gap: 18 }}>
            <h3 style={{ fontWeight: 700, fontSize: 20, color: '#e53e3e', marginBottom: 8 }}>Delete Department</h3>
            <div style={{ color: '#333', fontWeight: 500, marginBottom: 8 }}>Type <span style={{ color: '#e53e3e', fontWeight: 700 }}>'delete department'</span> to confirm deletion.</div>
            <input
              type="text"
              value={deleteInput}
              onChange={e => setDeleteInput(e.target.value)}
              placeholder="Type here..."
              style={{ padding: '0.7rem 1rem', borderRadius: 8, border: '1px solid #ececec', fontSize: 16, marginBottom: 8 }}
              disabled={deleteLoading}
            />
            {deleteError && <div style={{ color: '#e53e3e', fontWeight: 500 }}>{deleteError}</div>}
            <button
              onClick={() => {
                if (deleteInput.trim().toLowerCase() === "delete department") {
                  handleDelete(showDeleteDialog);
                } else {
                  setDeleteError("You must type 'delete department' to confirm.");
                }
              }}
              style={{ background: '#f44336', color: '#fff', border: 'none', borderRadius: 8, padding: '0.7rem 2rem', fontWeight: 600, fontSize: 16, cursor: deleteLoading ? 'not-allowed' : 'pointer', opacity: deleteLoading ? 0.7 : 1 }}
              disabled={deleteLoading}
            >{deleteLoading ? "Deleting..." : "Confirm Delete"}</button>
            <button
              onClick={() => { setShowDeleteDialog(null); setDeleteInput(""); setDeleteError(""); }}
              style={{ background: '#eee', color: '#4320d1', border: 'none', borderRadius: 8, padding: '8px 0', fontWeight: 600, cursor: 'pointer', width: '100%', fontSize: 18 }}
              disabled={deleteLoading}
            >Cancel</button>
          </div>
        </div>
      )}
              
      <button style={{ marginTop: 14, background: '#4320d1', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 0', fontWeight: 600, cursor: 'pointer', width: '100%', fontSize: 16 }}>More</button>
    </section>
  );
};

export default DepartmentsSection;
