import { useState } from 'react';

const initialDocs = [
  { id: 1, title: 'Flight Tickets - outbound', uploader: 'Asaf', category: 'Flights', icon: '✈️' },
  { id: 2, title: 'Tatralandia Booking', uploader: 'Mom', category: 'Hotels', icon: '🏨' },
  { id: 3, title: 'Hertz Rental Agreement', uploader: 'Dad', category: 'Cars', icon: '🚗' },
];

export default function Docs() {
  const [docs, setDocs] = useState(initialDocs);
  const [isAdding, setIsAdding] = useState(false);
  const [newDoc, setNewDoc] = useState({ title: '', uploader: '', category: 'General' });

  const handleAddDoc = (e) => {
    e.preventDefault();
    
    // Assign a basic icon based on category
    let icon = '📄';
    if (newDoc.category === 'Flights') icon = '✈️';
    if (newDoc.category === 'Hotels') icon = '🏨';
    if (newDoc.category === 'Cars') icon = '🚗';
    if (newDoc.category === 'Insurance') icon = '🛡️';

    setDocs([...docs, { ...newDoc, id: Date.now(), icon }]);
    setIsAdding(false);
    setNewDoc({ title: '', uploader: '', category: 'General' });
  };

  return (
    <div style={{ paddingBottom: '80px', position: 'relative', minHeight: '80vh' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ margin: 0, fontSize: '1.8rem', color: 'var(--text-dark)' }}>Docs & Logistics</h1>
        <p style={{ margin: '5px 0 0 0', color: '#555', fontWeight: '600' }}>
          All important family documents
        </p>
      </div>

      {/* Docs Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {docs.map(doc => (
          <div key={doc.id} style={{
            display: 'flex', alignItems: 'center', gap: '15px',
            background: 'rgba(255,255,255,0.9)',
            borderRadius: '16px',
            padding: '15px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
            borderLeft: '4px solid var(--secondary)'
          }}>
            <div style={{ 
              width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(0, 114, 255, 0.1)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' 
            }}>
              {doc.icon}
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', color: '#222' }}>{doc.title}</h3>
              <div style={{ display: 'flex', gap: '10px', fontSize: '0.85rem', color: '#666' }}>
                <span>👤 {doc.uploader}</span>
                <span>•</span>
                <span>{doc.category}</span>
              </div>
            </div>
            <button style={{ 
              background: 'transparent', border: 'none', color: 'var(--primary)', 
              fontWeight: 'bold', fontSize: '1.2rem', cursor: 'pointer' 
            }}>
              ⬇️
            </button>
          </div>
        ))}
        {docs.length === 0 && (
          <p style={{ textAlign: 'center', color: '#777', marginTop: '20px' }}>No documents uploaded yet.</p>
        )}
      </div>

      {/* Add Doc Modal */}
      {isAdding && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '25px', background: 'rgba(255,255,255,0.95)' }}>
            <h3 style={{ margin: '0 0 15px 0' }}>Upload Document</h3>
            <form onSubmit={handleAddDoc} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              
              <input required type="text" placeholder="Document Title (e.g. Flight 410)" className="glass-input" style={{ padding: '10px' }}
                value={newDoc.title} onChange={e => setNewDoc({...newDoc, title: e.target.value})} />
              
              <input required type="text" placeholder="Your Name" className="glass-input" style={{ padding: '10px' }}
                value={newDoc.uploader} onChange={e => setNewDoc({...newDoc, uploader: e.target.value})} />
              
              <select className="glass-input" style={{ padding: '10px', appearance: 'none' }}
                value={newDoc.category} onChange={e => setNewDoc({...newDoc, category: e.target.value})}>
                <option value="General">General</option>
                <option value="Flights">Flights</option>
                <option value="Hotels">Hotels</option>
                <option value="Cars">Rental Cars</option>
                <option value="Insurance">Insurance</option>
              </select>

              {/* Fake file input for UI purposes */}
              <div style={{
                border: '2px dashed #ccc', borderRadius: '12px', padding: '20px', textAlign: 'center',
                color: '#666', cursor: 'pointer', background: 'rgba(0,0,0,0.02)'
              }}>
                📄 Tap to select file...
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setIsAdding(false)} style={{ flex: 1, padding: '10px', borderRadius: '12px', border: '1px solid #ccc', background: 'transparent', cursor: 'pointer', fontWeight: 'bold' }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ flex: 1, padding: '10px' }}>Upload</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button 
        onClick={() => setIsAdding(true)}
        style={{
          position: 'fixed', bottom: '90px', right: '20px', width: '56px', height: '56px',
          borderRadius: '50%', background: 'var(--primary)', color: 'white', border: 'none',
          fontSize: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 15px rgba(0, 198, 255, 0.5)', cursor: 'pointer', zIndex: 50,
          transition: 'transform 0.2s ease'
        }}
        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        +
      </button>

    </div>
  );
}
