import React, { useState, useEffect } from "react";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const MaterialsSection: React.FC = () => {
  const [materials, setMaterials] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState<string | null>(null);
  const [deleteInput, setDeleteInput] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    const token = localStorage.getItem("token");
    
    fetch(`${baseUrl}/materials/?page=${page}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`Failed to load materials: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        if (data && Array.isArray(data.materials)) {
          setMaterials(prev => page === 1 ? data.materials : [...prev, ...data.materials]);
          setHasMore(data.materials.length > 0);
        } else {
          setHasMore(false);
        }
      })
      .catch(err => {
        setError(err.message || "Failed to load materials");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [page]);

  const handleMore = () => {
    if (!loading && hasMore) setPage(p => p + 1);
  };

  const handleDelete = async (id: string) => {
    setDeleteError("");
    setDeleteLoading(true);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${baseUrl}/materials/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to delete material");
      }
      setMaterials(prev => prev.filter(m => m.id !== id));
      setShowDeleteDialog(null);
      setDeleteInput("");
    } catch (err: any) {
      setDeleteError(err.message || "Error deleting material");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <section className="bg-white rounded-[14px] shadow-[0_2px_8px_#4320d120] px-6 pt-6 pb-4 flex flex-col min-h-[180px]">
      <h3 className="font-bold text-[20px] text-[#4320d1] mb-3">Materials</h3>
      <div className="flex flex-col gap-2 flex-1">
        {materials.length > 0 ? (
          materials.map(m => (
            <div key={m.id} className="flex items-center justify-between bg-[#f7f7fa] rounded-lg px-3 py-2 mb-0.5">
              <span className="text-[#333] font-medium">{m.title || m.name || m.file_name || 'Material'}</span>
              <div className="flex gap-2">
                <button className="bg-[#eee] text-[#4320d1] border-none rounded-md px-2.5 py-1 font-medium cursor-pointer text-[14px]">Edit</button>
                <button
                  className="bg-[#f44336] text-white border-none rounded-md px-2.5 py-1 font-medium cursor-pointer text-[14px]"
                  onClick={() => { setShowDeleteDialog(m.id); setDeleteInput(""); setDeleteError(""); }}
                  disabled={deleteLoading}
                >Delete</button>
              </div>
            </div>
          ))
        ) : loading ? (
          <div className="text-[#aaa] font-normal py-2">Loading...</div>
        ) : (
          <div className="text-[#aaa] font-normal py-2">No materials yet</div>
        )}
        {error && <div className="text-[#e53e3e] font-medium">{error}</div>}
      </div>
      <button
        className={`mt-3 ${hasMore ? 'bg-[#4320d1]' : 'bg-[#aaa]'} text-white border-none rounded-lg py-2 font-semibold w-full text-[16px] ${hasMore && !loading ? 'cursor-pointer' : 'cursor-not-allowed'}`}
        onClick={handleMore}
        disabled={!hasMore || loading}
      >{loading ? 'Loading...' : hasMore ? 'More' : 'No more'}</button>

      {/* Delete Warning Dialog */}
      {showDeleteDialog && (
        <div className="fixed top-0 left-0 w-screen h-screen bg-black/20 flex items-center justify-center z-[1000]">
          <div className="bg-white rounded-2xl shadow-[0_4px_32px_#4320d120] px-8 py-6 min-w-[320px] w-full max-w-md flex flex-col gap-4">
            <h3 className="font-bold text-[20px] text-[#e53e3e] mb-2">Delete Material</h3>
            <div className="text-[#333] font-medium mb-2">Type <span className="text-[#e53e3e] font-bold">'delete material'</span> to confirm deletion.</div>
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
                if (deleteInput.trim().toLowerCase() === "delete material") {
                  handleDelete(showDeleteDialog);
                } else {
                  setDeleteError("You must type 'delete material' to confirm.");
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
    </section>
  );
};

export default MaterialsSection;
