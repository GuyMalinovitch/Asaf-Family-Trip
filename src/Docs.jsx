import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { db, storage } from './firebase';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { renderTextWithLinks } from './utils';

export default function Docs() {
  const { t } = useTranslation();
  const [docs, setDocs] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newDoc, setNewDoc] = useState({ title: '', uploader: '', category: 'General' });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);

  const [selectedDoc, setSelectedDoc] = useState(null);
  const [currentFolderId, setCurrentFolderId] = useState(null);

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
    
    setIsUploading(true);
    
    // Assign a basic icon based on category
    let icon = '📄';
    if (newDoc.isFolder) icon = '📁';
    else if (newDoc.category === 'Flights') icon = '✈️';
    else if (newDoc.category === 'Hotels') icon = '🏨';
    else if (newDoc.category === 'Cars') icon = '🚗';
    else if (newDoc.category === 'Insurance') icon = '🛡️';

    try {
      if (!editingId && selectedFiles.length > 1) {
        // Upload multiple files
        for (const file of selectedFiles) {
          const fileRef = ref(storage, `docs/${Date.now()}_${file.name}`);
          await uploadBytes(fileRef, file);
          const fileUrl = await getDownloadURL(fileRef);

          await addDoc(collection(db, 'docs'), {
            ...newDoc,
            title: newDoc.title ? `${newDoc.title} - ${file.name}` : file.name,
            icon,
            fileUrl,
            folderId: currentFolderId,
            timestamp: serverTimestamp()
          });
        }
      } else {
        // Single file or no file
        let fileUrl = newDoc.fileUrl || '';
        
        if (selectedFiles.length > 0) {
          const file = selectedFiles[0];
          const fileRef = ref(storage, `docs/${Date.now()}_${file.name}`);
          await uploadBytes(fileRef, file);
          fileUrl = await getDownloadURL(fileRef);
        }

        if (editingId) {
          await updateDoc(doc(db, 'docs', editingId), {
            ...newDoc,
            icon,
            ...(selectedFiles.length > 0 && { fileUrl })
          });
        } else {
          await addDoc(collection(db, 'docs'), {
            ...newDoc,
            icon,
            fileUrl,
            folderId: currentFolderId,
            timestamp: serverTimestamp()
          });
        }
      }

      setIsAdding(false);
      setEditingId(null);
      setNewDoc({ title: '', uploader: '', category: 'General', notes: '' });
      setSelectedFiles([]);
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
      notes: docItem.notes || '',
      fileUrl: docItem.fileUrl || '',
      isFolder: docItem.isFolder || false
    });
    setEditingId(docItem.id);
    setSelectedFiles([]);
    setSelectedDoc(null);
    setIsAdding(true);
  };

  const handleDeleteDoc = async (id, fileUrl) => {
    if (!window.confirm(t('docs.confirmDelete') || "Delete this document?")) return;
    
    try {
      // 1. Delete from Firestore
      await deleteDoc(doc(db, 'docs', id));
      setSelectedDoc(null);
      if (id === currentFolderId) {
        setCurrentFolderId(null);
      }
      
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
            setNewDoc({ title: '', uploader: '', category: 'General', notes: '' });
            setSelectedFiles([]);
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
      {currentFolderId && (() => {
        const currentFolder = docs.find(d => d.id === currentFolderId);
        return (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px', background: 'rgba(255,255,255,0.8)', padding: '10px 15px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', color: 'var(--primary)', fontWeight: 'bold' }}
                 onClick={() => setCurrentFolderId(null)}>
              ⬅️ {t('docs.backToMain') || 'Back'}
            </div>
            
            {currentFolder && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontWeight: 'bold', color: '#333' }}>📁 {currentFolder.title}</span>
                <button onClick={() => handleEditDoc(currentFolder)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', padding: '0 5px' }} title="Edit Folder">✏️</button>
                <button onClick={() => handleDeleteDoc(currentFolder.id, currentFolder.fileUrl)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', padding: '0 5px' }} title="Delete Folder">🗑️</button>
              </div>
            )}
          </div>
        );
      })()}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {docs.filter(d => (d.folderId || null) === currentFolderId).map(doc => (
          <div 
            key={doc.id} 
            onClick={() => doc.isFolder ? setCurrentFolderId(doc.id) : setSelectedDoc(doc)}
            style={{
              display: 'flex', alignItems: 'center', gap: '15px',
              background: 'rgba(255,255,255,0.9)',
              borderRadius: '16px',
              padding: '15px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
              borderLeft: '4px solid var(--secondary)',
              cursor: 'pointer'
            }}
          >
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
                {!doc.isFolder && <span>•</span>}
                {!doc.isFolder && <span>{doc.category}</span>}
              </div>
            </div>
          </div>
        ))}
        {docs.filter(d => (d.folderId || null) === currentFolderId).length === 0 ? (
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
          <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '25px', background: 'rgba(255,255,255,0.95)', overflowY: 'auto', maxHeight: '90vh' }}>
            <h3 style={{ margin: '0 0 15px 0' }}>{editingId ? 'Edit Document' : t('docs.uploadTitle')}</h3>
            <form onSubmit={handleAddDoc} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <select 
                className="glass-input" 
                style={{ padding: '10px', appearance: 'none', fontWeight: 'bold', cursor: 'pointer', background: 'rgba(0,198,255,0.05)' }}
                value={newDoc.isFolder ? 'folder' : 'file'} 
                onChange={e => setNewDoc({...newDoc, isFolder: e.target.value === 'folder'})}
              >
                <option value="file">📄 Upload File(s)</option>
                <option value="folder">📁 Create Folder</option>
              </select>

              <input required type="text" placeholder={t('docs.docTitle')} className="glass-input" style={{ padding: '10px' }}
                value={newDoc.title} onChange={e => setNewDoc({...newDoc, title: e.target.value})} />
              <input required type="text" placeholder={t('docs.uploader')} className="glass-input" style={{ padding: '10px' }}
                value={newDoc.uploader} onChange={e => setNewDoc({...newDoc, uploader: e.target.value})} />
              
              {!newDoc.isFolder && (
                <>
                  <select className="glass-input" style={{ padding: '10px', appearance: 'none' }}
                    value={newDoc.category} onChange={e => setNewDoc({...newDoc, category: e.target.value})}>
                    <option value="General">{t('docs.cats.general')}</option>
                    <option value="Flights">{t('docs.cats.flights')}</option>
                    <option value="Hotels">{t('docs.cats.hotels')}</option>
                    <option value="Cars">{t('docs.cats.cars')}</option>
                    <option value="Insurance">{t('docs.cats.insurance')}</option>
                  </select>

                  <textarea placeholder="Notes (Optional)" className="glass-input" style={{ padding: '10px', minHeight: '60px', resize: 'vertical' }}
                    value={newDoc.notes || ''} onChange={e => setNewDoc({...newDoc, notes: e.target.value})} />

                  <input 
                    type="file" 
                    multiple
                    ref={fileInputRef}
                    onChange={(e) => setSelectedFiles(Array.from(e.target.files))}
                    style={{ display: 'none' }}
                  />
                  <div 
                    onClick={() => fileInputRef.current.click()}
                    style={{ padding: '20px', border: '2px dashed var(--primary)', borderRadius: '12px', textAlign: 'center', color: 'var(--primary)', cursor: 'pointer', background: 'rgba(0,198,255,0.05)' }}>
                    {selectedFiles.length > 0 
                      ? selectedFiles.map(f => f.name).join(', ') 
                      : (editingId && newDoc.fileUrl) ? (t('docs.tapFile') + ' (Optional - keep existing)') : t('docs.tapFile') + ' (Optional)'}
                  </div>
                </>
              )}
              
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

      {selectedDoc && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }} onClick={() => setSelectedDoc(null)}>
          <div 
            className="glass-panel animate-fade-in" 
            style={{ width: '100%', maxWidth: '400px', padding: '25px', background: 'rgba(255,255,255,0.95)' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px', marginBottom: '15px' }}>
              <div style={{ fontSize: '3rem', background: 'rgba(0, 114, 255, 0.1)', width: '70px', height: '70px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {selectedDoc.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--secondary)', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '2px' }}>
                  {selectedDoc.category}
                </div>
                <h3 style={{ margin: '0 0 5px 0', fontSize: '1.4rem', color: '#222' }}>{selectedDoc.title}</h3>
                <div style={{ fontSize: '0.9rem', color: '#888', fontWeight: 'bold' }}>
                  👤 {selectedDoc.uploader}
                </div>
              </div>
            </div>
            
            {selectedDoc.notes && (
              <p style={{ margin: '0 0 25px 0', color: '#444', fontSize: '1rem', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                {renderTextWithLinks(selectedDoc.notes)}
              </p>
            )}
            
            {selectedDoc.fileUrl && (
              <a 
                href={selectedDoc.fileUrl}
                target="_blank" 
                rel="noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  background: '#f1f3f4', color: '#1a73e8', textDecoration: 'none',
                  padding: '12px', borderRadius: '12px', fontWeight: 'bold', fontSize: '1rem',
                  marginBottom: '20px'
                }}
              >
                <span>⬇️</span> {t('docs.download') || 'Download File'}
              </a>
            )}
            
            <div style={{ display: 'flex', gap: '10px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
              <button 
                onClick={() => handleEditDoc(selectedDoc)}
                style={{ flex: 1, padding: '10px', borderRadius: '12px', background: '#f1f2f6', border: 'none', color: '#2f3542', fontWeight: 'bold', cursor: 'pointer' }}
              >
                ✏️ Edit
              </button>
              <button 
                onClick={() => handleDeleteDoc(selectedDoc.id, selectedDoc.fileUrl)}
                style={{ flex: 1, padding: '10px', borderRadius: '12px', background: 'rgba(255, 71, 87, 0.1)', border: 'none', color: '#ff4757', fontWeight: 'bold', cursor: 'pointer' }}
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
