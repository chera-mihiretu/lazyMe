import React, { useState } from "react";

const MaterialsSection: React.FC = () => {
  const [materials, setMaterials] = useState([
    { id: "1", name: "Lecture 1.pdf" },
    { id: "2", name: "Lecture 2.pdf" },
  ]);
  return (
    <section style={{ background: '#fff', borderRadius: 14, boxShadow: '0 2px 8px #4320d120', padding: '24px 24px 18px 24px', display: 'flex', flexDirection: 'column', minHeight: 180 }}>
      <h3 style={{ fontWeight: 700, fontSize: 20, color: '#4320d1', marginBottom: 12 }}>Materials</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, margin: 0, padding: 0, flex: 1 }}>
        {materials.length > 0 ? (
          materials.slice(0, 4).map(m => (
            <div key={m.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f7f7fa', borderRadius: 8, padding: '8px 12px', marginBottom: 2 }}>
              <span style={{ color: '#333', fontWeight: 500 }}>{m.name}</span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button style={{ background: '#eee', color: '#4320d1', border: 'none', borderRadius: 6, padding: '4px 10px', fontWeight: 500, cursor: 'pointer', fontSize: 14 }}>Edit</button>
                <button style={{ background: '#f44336', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 10px', fontWeight: 500, cursor: 'pointer', fontSize: 14 }}>Delete</button>
              </div>
            </div>
          ))
        ) : (
          <div style={{ color: '#aaa', fontWeight: 400, padding: '8px 0' }}>No materials yet</div>
        )}
      </div>
      <button style={{ marginTop: 14, background: '#4320d1', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 0', fontWeight: 600, cursor: 'pointer', width: '100%', fontSize: 16 }}>More</button>
    </section>
  );
};

export default MaterialsSection;
