import React, { useState } from "react";


interface University {
  id: string;
  name: string;
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const UniversitiesSection: React.FC = () => {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  React.useEffect(() => {
    setLoading(true);
    fetch(baseUrl + "/universities/")
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch universities");
        return res.json();
      })
      .then(data => {
        if (data && Array.isArray(data.universities)) {
          setUniversities(data.universities);
        } else {
          setError("Invalid universities data");
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || "Error fetching universities");
        setLoading(false);
      });
  }, []);

  return (
    <section style={{ background: '#fff', borderRadius: 14, boxShadow: '0 2px 8px #4320d120', padding: '24px 24px 18px 24px', display: 'flex', flexDirection: 'column', minHeight: 180 }}>
      <h3 style={{ fontWeight: 700, fontSize: 20, color: '#4320d1', marginBottom: 12 }}>Universities</h3>
      {loading ? (
        <div style={{ color: '#888', fontWeight: 500, padding: '12px 0' }}>Loading...</div>
      ) : error ? (
        <div style={{ color: '#e53e3e', fontWeight: 500, padding: '12px 0' }}>{error}</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, margin: 0, padding: 0, flex: 1 }}>
          {universities.slice(0, 4).map(u => (
            <div key={u.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f7f7fa', borderRadius: 8, padding: '8px 12px', marginBottom: 2 }}>
              <span style={{ color: '#333', fontWeight: 500 }}>{u.name}</span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button style={{ background: '#eee', color: '#4320d1', border: 'none', borderRadius: 6, padding: '4px 10px', fontWeight: 500, cursor: 'pointer', fontSize: 14 }}>Edit</button>
                <button style={{ background: '#f44336', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 10px', fontWeight: 500, cursor: 'pointer', fontSize: 14 }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
      <button style={{ marginTop: 14, background: '#4320d1', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 0', fontWeight: 600, cursor: 'pointer', width: '100%', fontSize: 16 }}>More</button>
    </section>
  );
};

export default UniversitiesSection;
