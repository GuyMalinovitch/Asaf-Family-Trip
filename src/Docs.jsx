import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function Docs() {
  const { t } = useTranslation();
  const docsData = t('docsData', { returnObjects: true });
  const [docs, setDocs] = useState(docsData);
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
      <div style={{ textAlign: 'center', marginBottom: '25px' }}>
        <h1 style={{ fontSize: '1.8rem', color: 'var(--text-dark)', marginBottom: '5px' }}>{t('docs.title')}</h1>
        <p style={{ color: '#666', margin: 0 }}>{t('docs.subtitle')}</p>
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
        {docs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#999' }}>
            {t('docs.noDocs')}
          </div>
        ) : null}
      </div>

      {/* Add Doc Modal */}
      {isAdding && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '25px', background: 'rgba(255,255,255,0.95)' }}>
            <h3 style={{ margin: '0 0 15px 0' }}>{t('docs.uploadTitle')}</h3>
            <form onSubmit={handleAddDoc} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input required type="text" placeholder={t('docs.docTitle')} className="glass-input" style={{ padding: '10px' }}
                value={newDoc.title} onChange={e => setNewDoc({...newDoc, title: e.target.value})} />
              <input required type="text" placeholder={t('docs.uploader')} className="glass-input" style={{ padding: '10px' }}
                value={newDoc.uploader} onChange={e => setNewDoc({...newDoc, uploader: e.target.value})} />
              
              <select className="glass-input" style={{ padding: '10px', appearance: 'none' }}
                value={newDoc.category} onChange={e => setNewDoc({...newDoc, category: e.target.value})}>
                <option value="General">{t('docs.cats.general')}</option>
                <option value="Flights">{t('docs.cats.flights')}</option>
                <option value="Hotels">{t('docs.cats.hotels')}</option>
                <option value="Cars">{t('docs.cats.cars')}</option>
                <option value="Insurance">{t('docs.cats.insurance')}</option>
              </select>

              {/* Fake file input for UI purposes */}
              <div style={{ padding: '20px', border: '2px dashed var(--primary)', borderRadius: '12px', textAlign: 'center', color: 'var(--primary)', cursor: 'pointer', background: 'rgba(0,198,255,0.05)' }}>
                {t('docs.tapFile')}
              </div>
              
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setIsAdding(false)} style={{ flex: 1, padding: '10px', borderRadius: '12px', border: '1px solid #ccc', background: 'transparent', cursor: 'pointer', fontWeight: 'bold' }}>{t('docs.cancel')}</button>
                <button type="submit" className="btn-primary" style={{ flex: 1, padding: '10px' }}>{t('docs.upload')}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button 
        onClick={() => setIsAdding(true)}
        style={{
          position: 'fixed', bottom: '90px', insetInlineEnd: '20px', width: '56px', height: '56px',
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
