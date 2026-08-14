import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { db } from './firebase';
import { collection, addDoc, onSnapshot, query, updateDoc, doc, deleteDoc } from 'firebase/firestore';

export default function Recommendations() {
  const { t } = useTranslation();
  const [recs, setRecs] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newRec, setNewRec] = useState({ title: '', recommender: '', desc: '' });

  useEffect(() => {
    const q = query(collection(db, 'recommendations'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ firebaseId: doc.id, ...doc.data() }));
      setRecs(docs);
    });
    return () => unsubscribe();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateDoc(doc(db, 'recommendations', editingId), { ...newRec });
      } else {
        await addDoc(collection(db, 'recommendations'), {
          ...newRec,
          timestamp: new Date().getTime()
        });
      }
      setIsAdding(false);
      setEditingId(null);
      setNewRec({ title: '', recommender: '', desc: '' });
    } catch (error) {
      console.error("Error saving recommendation: ", error);
    }
  };

  const handleEdit = (rec) => {
    setNewRec({ title: rec.title || '', recommender: rec.recommender || '', desc: rec.desc || '' });
    setEditingId(rec.firebaseId);
    setIsAdding(true);
  };

  const handleDelete = async (firebaseId) => {
    if (window.confirm("Delete this recommendation?")) {
      await deleteDoc(doc(db, 'recommendations', firebaseId));
    }
  };

  return (
    <div style={{ paddingBottom: '40px', position: 'relative', minHeight: '80vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
        <h1 style={{ margin: 0, fontSize: '1.8rem', color: 'var(--text-dark)' }}>{t('recommendations.title')}</h1>
        <button 
          onClick={() => {
            setEditingId(null);
            setNewRec({ title: '', recommender: '', desc: '' });
            setIsAdding(true);
          }}
          style={{ background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', fontSize: '1.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0, 198, 255, 0.3)' }}
        >
          +
        </button>
      </div>
      
      <p style={{ marginBottom: '20px', color: '#555', fontSize: '1.1rem', lineHeight: '1.5' }}>
        {t('recommendations.subtitle')}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {recs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#888', fontStyle: 'italic', background: 'rgba(255,255,255,0.5)', borderRadius: '16px' }}>
            {t('recommendations.empty')}
          </div>
        ) : (
          recs.map((rec, i) => (
            <div key={rec.firebaseId || i} style={{
              background: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '16px',
              padding: '20px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
              borderInlineStart: '5px solid #ff4757',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              position: 'relative'
            }}>
              <div style={{ position: 'absolute', top: '15px', insetInlineEnd: '15px', display: 'flex', gap: '10px' }}>
                <button onClick={() => handleEdit(rec)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.1rem' }}>✏️</button>
                <button onClick={() => handleDelete(rec.firebaseId)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.1rem' }}>🗑️</button>
              </div>
              <h3 style={{ margin: '0', fontSize: '1.3rem', color: '#222', paddingRight: '50px' }}>{rec.title}</h3>
              <p style={{ margin: 0, color: '#666', fontSize: '1rem', lineHeight: '1.4' }}>
                {rec.desc}
              </p>
              <div style={{ fontSize: '0.85rem', color: '#999', marginTop: '5px', fontWeight: 'bold' }}>
                👤 {rec.recommender}
              </div>
            </div>
          ))
        )}
      </div>

      {isAdding && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '400px', padding: '25px', background: 'rgba(255,255,255,0.95)', overflowY: 'auto', maxHeight: '90vh' }}>
            <h3 style={{ margin: '0 0 15px 0' }}>{editingId ? t('recommendations.addTitle') + ' (Edit)' : t('recommendations.addTitle')}</h3>
            <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input required type="text" placeholder={t('recommendations.formTitle')} className="glass-input" style={{ padding: '10px' }}
                value={newRec.title} onChange={e => setNewRec({...newRec, title: e.target.value})} />
              <input required type="text" placeholder={t('recommendations.formName')} className="glass-input" style={{ padding: '10px' }}
                value={newRec.recommender} onChange={e => setNewRec({...newRec, recommender: e.target.value})} />
              <textarea required placeholder={t('recommendations.formDesc')} className="glass-input" style={{ padding: '10px', minHeight: '80px', resize: 'vertical' }}
                value={newRec.desc} onChange={e => setNewRec({...newRec, desc: e.target.value})} />
              
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setIsAdding(false)} style={{ flex: 1, padding: '10px', borderRadius: '12px', border: '1px solid #ccc', background: 'transparent', cursor: 'pointer', fontWeight: 'bold' }}>{t('itinerary.cancel')}</button>
                <button type="submit" className="btn-primary" style={{ flex: 1, padding: '10px' }}>{editingId ? 'Save' : t('itinerary.add')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
