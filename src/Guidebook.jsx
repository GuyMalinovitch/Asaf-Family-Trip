import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { db } from './firebase';
import { collection, addDoc, onSnapshot, query } from 'firebase/firestore';

export default function Guidebook() {
  const { t } = useTranslation();
  const [pins, setPins] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newLoc, setNewLoc] = useState({ title: '', type: 'Point of Interest', desc: '', icon: '📍', query: '' });

  useEffect(() => {
    const q = query(collection(db, 'locations'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const locations = snapshot.docs.map(doc => ({ firebaseId: doc.id, ...doc.data() }));
      setPins(locations);
    });
    return () => unsubscribe();
  }, []);

  const handleAddLocation = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'locations'), newLoc);
      setIsAdding(false);
      setNewLoc({ title: '', type: 'Point of Interest', desc: '', icon: '📍', query: '' });
    } catch (error) {
      console.error("Error adding location: ", error);
    }
  };

  return (
    <div style={{ paddingBottom: '40px', position: 'relative', minHeight: '80vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
        <h1 style={{ margin: 0, fontSize: '1.8rem', color: 'var(--text-dark)' }}>{t('guidebook.title')}</h1>
        <button 
          onClick={() => setIsAdding(true)}
          style={{ background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', fontSize: '1.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0, 198, 255, 0.3)' }}
        >
          +
        </button>
      </div>
      
      <p style={{ marginBottom: '20px', color: '#555', fontSize: '1.1rem', lineHeight: '1.5' }}>
        {t('guidebook.subtitle')}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {pins.map((pin, i) => (
          <div key={pin.firebaseId || i} style={{
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
            borderLeft: '5px solid var(--primary)',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
              <div style={{ fontSize: '2.5rem', background: 'rgba(0, 198, 255, 0.1)', width: '60px', height: '60px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {pin.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--primary)', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '2px' }}>
                  {pin.type}
                </div>
                <h3 style={{ margin: '0 0 5px 0', fontSize: '1.3rem', color: '#222' }}>{pin.title}</h3>
                <p style={{ margin: 0, color: '#666', fontSize: '0.95rem', lineHeight: '1.4' }}>
                  {pin.desc}
                </p>
              </div>
            </div>

            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pin.query || pin.title)}`}
              target="_blank" 
              rel="noreferrer"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                background: '#f1f3f4', color: '#1a73e8', textDecoration: 'none',
                padding: '12px', borderRadius: '12px', fontWeight: 'bold', fontSize: '1rem',
                transition: 'background 0.2s ease'
              }}
            >
              <span>📍</span> {t('guidebook.openMaps')}
            </a>
          </div>
        ))}
      </div>

      {isAdding && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '400px', padding: '25px', background: 'rgba(255,255,255,0.95)', overflowY: 'auto', maxHeight: '90vh' }}>
            <h3 style={{ margin: '0 0 15px 0' }}>Add New Location</h3>
            <form onSubmit={handleAddLocation} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input required type="text" placeholder="Title (e.g. Castle)" className="glass-input" style={{ padding: '10px' }}
                value={newLoc.title} onChange={e => setNewLoc({...newLoc, title: e.target.value})} />
              <input required type="text" placeholder="Type (e.g. Attraction, Hotel)" className="glass-input" style={{ padding: '10px' }}
                value={newLoc.type} onChange={e => setNewLoc({...newLoc, type: e.target.value})} />
              <textarea placeholder="Description" className="glass-input" style={{ padding: '10px', minHeight: '60px', resize: 'vertical' }}
                value={newLoc.desc} onChange={e => setNewLoc({...newLoc, desc: e.target.value})} />
              <input type="text" placeholder="Map Query (e.g. Buda+Castle)" className="glass-input" style={{ padding: '10px' }}
                value={newLoc.query} onChange={e => setNewLoc({...newLoc, query: e.target.value})} />
              <input type="text" placeholder="Emoji Icon (e.g. 🏰)" className="glass-input" style={{ padding: '10px' }}
                value={newLoc.icon} onChange={e => setNewLoc({...newLoc, icon: e.target.value})} />
              
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setIsAdding(false)} style={{ flex: 1, padding: '10px', borderRadius: '12px', border: '1px solid #ccc', background: 'transparent', cursor: 'pointer', fontWeight: 'bold' }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ flex: 1, padding: '10px' }}>Add Location</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
