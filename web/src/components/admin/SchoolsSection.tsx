import React, { useState } from "react";
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const SchoolsSection: React.FC = () => {
  const [schools, setSchools] = useState<{ id: string; name: string }[]>([]);
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
    <section style={{ background: '#fff', borderRadius: 14, boxShadow: '0 2px 8px #4320d120', padding: '24px 24px 18px 24px', display: 'flex', flexDirection: 'column', minHeight: 180 }}>
      <h3 style={{ fontWeight: 700, fontSize: 20, color: '#4320d1', marginBottom: 12 }}>Schools</h3>
      {loading ? (
        <div style={{ color: '#888', fontWeight: 500, padding: '12px 0' }}>Loading...</div>
      ) : error ? (
        <div style={{ color: '#e53e3e', fontWeight: 500, padding: '12px 0' }}>{error}</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, margin: 0, padding: 0, flex: 1 }}>
          {schools.slice(0, 4).map(s => (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f7f7fa', borderRadius: 8, padding: '8px 12px', marginBottom: 2 }}>
              <span style={{ color: '#333', fontWeight: 500 }}>{s.name}</span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button style={{ background: '#eee', color: '#4320d1', border: 'none', borderRadius: 6, padding: '4px 10px', fontWeight: 500, cursor: 'pointer', fontSize: 14 }}>Edit</button>
                <button
                  style={{ background: '#f44336', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 10px', fontWeight: 500, cursor: 'pointer', fontSize: 14 }}
                  onClick={() => { setShowDeleteDialog(s.id); setDeleteInput(""); setDeleteError(""); }}
                >Delete</button>
      {/* Delete Warning Dialog */}
      {showDeleteDialog && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(30,30,40,0.25)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 32px #4320d120', padding: 32, minWidth: 340, display: 'flex', flexDirection: 'column', gap: 18 }}>
            <h3 style={{ fontWeight: 700, fontSize: 20, color: '#e53e3e', marginBottom: 8 }}>Delete School</h3>
            <div style={{ color: '#333', fontWeight: 500, marginBottom: 8 }}>Type <span style={{ color: '#e53e3e', fontWeight: 700 }}>'delete school'</span> to confirm deletion.</div>
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
                if (deleteInput.trim().toLowerCase() === "delete school") {
                  handleDelete(showDeleteDialog);
                } else {
                  setDeleteError("You must type 'delete school' to confirm.");
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
              </div>
            </div>
          ))}
        </div>
      )}
      <button style={{ marginTop: 14, background: '#4320d1', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 0', fontWeight: 600, cursor: 'pointer', width: '100%', fontSize: 16 }}>More</button>
    </section>
  );
};

export default SchoolsSection;
