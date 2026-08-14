import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { db } from './firebase';
import { collection, addDoc, onSnapshot, query, updateDoc, doc, deleteDoc } from 'firebase/firestore';

export default function Guidebook() {
  const { t } = useTranslation();
  const [pins, setPins] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
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
    
    let icon = '📍';
    if (newLoc.type === 'Hotel') icon = '🏨';
    if (newLoc.type === 'Restaurant') icon = '🍽️';
    if (newLoc.type === 'Attraction') icon = '🎢';
    if (newLoc.type === 'Shopping') icon = '🛍️';
    if (newLoc.type === 'Transport') icon = '🚗';

    try {
      if (editingId) {
        await updateDoc(doc(db, 'locations', editingId), { ...newLoc, icon });
      } else {
        await addDoc(collection(db, 'locations'), { ...newLoc, icon });
      }
      setIsAdding(false);
      setEditingId(null);
      setNewLoc({ title: '', type: 'Point of Interest', desc: '', query: '' });
    } catch (error) {
      console.error("Error saving location: ", error);
    }
  };

  const handleEditLocation = (pin) => {
    setNewLoc({
      title: pin.title || '',
      type: pin.type || 'Point of Interest',
      desc: pin.desc || '',
      query: pin.query || ''
    });
    setEditingId(pin.firebaseId);
    setIsAdding(true);
  };

  const handleDeleteLocation = async (firebaseId) => {
    if (window.confirm("Delete this location?")) {
      await deleteDoc(doc(db, 'locations', firebaseId));
    }
  };

  return (
    <div style={{ paddingBottom: '40px', position: 'relative', minHeight: '80vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
        <h1 style={{ margin: 0, fontSize: '1.8rem', color: 'var(--text-dark)' }}>{t('guidebook.title')}</h1>
        <button 
          onClick={() => {
            setEditingId(null);
            setNewLoc({ title: '', type: 'Point of Interest', desc: '', query: '' });
            setIsAdding(true);
          }}
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
            borderInlineStart: '5px solid var(--primary)',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            position: 'relative'
          }}>
            <div style={{ position: 'absolute', top: '15px', insetInlineEnd: '15px', display: 'flex', gap: '10px' }}>
              <button onClick={() => handleEditLocation(pin)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.1rem' }}>✏️</button>
              <button onClick={() => handleDeleteLocation(pin.firebaseId)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.1rem' }}>🗑️</button>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px', paddingRight: '50px' }}>
              <div style={{ fontSize: '2.5rem', background: 'rgba(0, 198, 255, 0.1)', width: '60px', height: '60px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
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
            <h3 style={{ margin: '0 0 15px 0' }}>{editingId ? 'Edit Location' : 'Add New Location'}</h3>
            <form onSubmit={handleAddLocation} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.8rem', color: '#666', fontWeight: 'bold' }}>Title</label>
                <input required type="text" placeholder="e.g. Buda Castle" className="glass-input" style={{ padding: '10px' }}
                  value={newLoc.title} onChange={e => setNewLoc({...newLoc, title: e.target.value})} />
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.8rem', color: '#666', fontWeight: 'bold' }}>Category</label>
                <select className="glass-input" style={{ padding: '10px', appearance: 'none' }}
                  value={newLoc.type} onChange={e => setNewLoc({...newLoc, type: e.target.value})}>
                  <option value="Point of Interest">📍 Point of Interest</option>
                  <option value="Hotel">🏨 Hotel / Lodging</option>
                  <option value="Restaurant">🍽️ Restaurant / Food</option>
                  <option value="Attraction">🎢 Attraction / Park</option>
                  <option value="Shopping">🛍️ Shopping</option>
                  <option value="Transport">🚗 Transport / Rental</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.8rem', color: '#666', fontWeight: 'bold' }}>Description (Optional)</label>
                <textarea placeholder="Write a short note..." className="glass-input" style={{ padding: '10px', minHeight: '60px', resize: 'vertical' }}
                  value={newLoc.desc} onChange={e => setNewLoc({...newLoc, desc: e.target.value})} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.8rem', color: '#666', fontWeight: 'bold' }}>Google Maps Query</label>
                <input type="text" placeholder="e.g. Buda+Castle+Budapest" className="glass-input" style={{ padding: '10px' }}
                  value={newLoc.query} onChange={e => setNewLoc({...newLoc, query: e.target.value})} />
                <span style={{ fontSize: '0.7rem', color: '#888' }}>*If left empty, the Title will be used for search.</span>
              </div>
              
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setIsAdding(false)} style={{ flex: 1, padding: '10px', borderRadius: '12px', border: '1px solid #ccc', background: 'transparent', cursor: 'pointer', fontWeight: 'bold' }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ flex: 1, padding: '10px' }}>{editingId ? 'Save' : 'Add Location'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
