import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { db, storage } from './firebase';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

export default function Docs() {
  const { t } = useTranslation();
  const [docs, setDocs] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newDoc, setNewDoc] = useState({ title: '', uploader: '', category: 'General' });
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  // Fetch docs from Firestore in real-time
  useEffect(() => {
    const q = query(collection(db, 'docs'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docsArr = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDocs(docsArr);
    });
    return () => unsubscribe();
  }, []);

  const handleAddDoc = async (e) => {
    e.preventDefault();
    if (!editingId && !selectedFile) {
      alert(t('docs.pleaseSelectFile') || 'Please select a file first!');
      return;
    }
    
    setIsUploading(true);
    
    // Assign a basic icon based on category
    let icon = '📄';
    if (newDoc.category === 'Flights') icon = '✈️';
    if (newDoc.category === 'Hotels') icon = '🏨';
    if (newDoc.category === 'Cars') icon = '🚗';
    if (newDoc.category === 'Insurance') icon = '🛡️';

    try {
      let fileUrl = newDoc.fileUrl; // keep old if not changing
      
      if (selectedFile) {
        // Upload new to Firebase Storage
        const fileRef = ref(storage, `docs/${Date.now()}_${selectedFile.name}`);
        await uploadBytes(fileRef, selectedFile);
        fileUrl = await getDownloadURL(fileRef);
      }

      if (editingId) {
        // Update existing metadata
        await updateDoc(doc(db, 'docs', editingId), {
          ...newDoc,
          icon,
          ...(selectedFile && { fileUrl }) // Update fileUrl only if a new file is uploaded
        });
      } else {
        // Save new metadata to Firestore
        await addDoc(collection(db, 'docs'), {
          ...newDoc,
          icon,
          fileUrl,
          timestamp: serverTimestamp()
        });
      }

      setIsAdding(false);
      setEditingId(null);
      setNewDoc({ title: '', uploader: '', category: 'General' });
      setSelectedFile(null);
    } catch (error) {
      console.error("Error saving document:", error);
      alert('Error: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleEditDoc = (docItem) => {
    setNewDoc({
      title: docItem.title || '',
      uploader: docItem.uploader || '',
      category: docItem.category || 'General',
      fileUrl: docItem.fileUrl || '' // Preserve existing file URL
    });
    setEditingId(docItem.id);
    setSelectedFile(null);
    setIsAdding(true);
  };

  const handleDeleteDoc = async (id, fileUrl) => {
    if (!window.confirm(t('docs.confirmDelete') || "Delete this document?")) return;
    
    try {
      // 1. Delete from Firestore
      await deleteDoc(doc(db, 'docs', id));
      
      // 2. Try to delete from Storage if it's a firebase storage URL
      if (fileUrl && fileUrl.includes('firebasestorage.googleapis.com')) {
        const decodedUrl = decodeURIComponent(fileUrl);
        const pathStart = decodedUrl.indexOf('/o/') + 3;
        const pathEnd = decodedUrl.indexOf('?alt=media');
        if (pathStart > 2 && pathEnd > pathStart) {
          const filePath = decodedUrl.substring(pathStart, pathEnd);
          const fileRef = ref(storage, filePath);
          await deleteObject(fileRef);
        }
      }
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  return (
    <div style={{ paddingBottom: '80px', position: 'relative', minHeight: '80vh' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
        <h1 style={{ margin: 0, fontSize: '1.8rem', color: 'var(--text-dark)' }}>{t('docs.title')}</h1>
        <button 
          onClick={() => {
            setEditingId(null);
            setNewDoc({ title: '', uploader: '', category: 'General' });
            setSelectedFile(null);
            setIsAdding(true);
          }}
          style={{ background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', fontSize: '1.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0, 198, 255, 0.3)' }}
        >
          +
        </button>
      </div>
      <p style={{ color: '#555', fontSize: '1.1rem', lineHeight: '1.5', marginBottom: '20px' }}>
        {t('docs.subtitle')}
      </p>

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
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => handleEditDoc(doc)}
                style={{ 
                  background: 'transparent', border: 'none', color: '#333', 
                  fontSize: '1.1rem', cursor: 'pointer', padding: 0
                }}>
                ✏️
              </button>
              <a 
                href={doc.fileUrl || '#'}
                target="_blank"
                rel="noreferrer"
                title={t('docs.download') || 'Download'}
                style={{ 
                  background: 'transparent', border: 'none', color: 'var(--primary)', 
                  fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', textDecoration: 'none', display: 'flex', alignItems: 'center'
                }}>
                ⬇️
              </a>
              <button 
                onClick={() => handleDeleteDoc(doc.id, doc.fileUrl)}
                title={t('docs.delete') || 'Delete'}
                style={{ 
                  background: 'transparent', border: 'none', color: '#ff4757', 
                  fontSize: '1.1rem', cursor: 'pointer', padding: 0
                }}>
                🗑️
              </button>
            </div>
          </div>
        ))}
        {docs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#999' }}>
            {t('docs.noDocs')}
          </div>
        ) : null}
      </div>

      {/* Add/Edit Doc Modal */}
      {isAdding && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '25px', background: 'rgba(255,255,255,0.95)' }}>
            <h3 style={{ margin: '0 0 15px 0' }}>{editingId ? 'Edit Document' : t('docs.uploadTitle')}</h3>
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

              <input 
                type="file" 
                ref={fileInputRef}
                onChange={(e) => setSelectedFile(e.target.files[0])}
                style={{ display: 'none' }}
              />
              <div 
                onClick={() => fileInputRef.current.click()}
                style={{ padding: '20px', border: '2px dashed var(--primary)', borderRadius: '12px', textAlign: 'center', color: 'var(--primary)', cursor: 'pointer', background: 'rgba(0,198,255,0.05)' }}>
                {selectedFile ? selectedFile.name : editingId ? (t('docs.tapFile') + ' (Optional - keep existing)') : t('docs.tapFile')}
              </div>
              
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setIsAdding(false)} style={{ flex: 1, padding: '10px', borderRadius: '12px', border: '1px solid #ccc', background: 'transparent', cursor: 'pointer', fontWeight: 'bold' }}>{t('docs.cancel')}</button>
                <button type="submit" disabled={isUploading} className="btn-primary" style={{ flex: 1, padding: '10px', opacity: isUploading ? 0.7 : 1 }}>
                  {isUploading ? '...' : (editingId ? 'Save' : t('docs.upload'))}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
