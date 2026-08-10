import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { db } from './firebase';
import { collection, addDoc, onSnapshot, query, doc, deleteDoc } from 'firebase/firestore';

// Helper to convert "HH:mm" to minutes since 00:00
const timeToMins = (timeStr) => {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + (m || 0);
};

export default function Itinerary() {
  const { t } = useTranslation();
  const itineraryData = t('itineraryData', { returnObjects: true });
  
  const [dbEvents, setDbEvents] = useState([]);
  const [activeDayId, setActiveDayId] = useState(itineraryData[0].id);
  const [viewMode, setViewMode] = useState('calendar'); // 'feed' | 'calendar'
  const [isAdding, setIsAdding] = useState(false);
  const [newEvent, setNewEvent] = useState({ time: '12:00', duration: 60, title: '', description: '', icon: '🌟' });

  // Fetch custom events from Firestore
  useEffect(() => {
    const q = query(collection(db, 'itinerary_events'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const events = snapshot.docs.map(doc => ({ firebaseId: doc.id, ...doc.data() }));
      setDbEvents(events);
    });
    return () => unsubscribe();
  }, []);

  // Merge hardcoded events with db events
  const data = useMemo(() => {
    const merged = JSON.parse(JSON.stringify(itineraryData)); // Deep copy
    merged.forEach(day => {
      const dayDbEvents = dbEvents.filter(ev => ev.dayId === day.id);
      day.events = [...day.events, ...dayDbEvents];
      day.events.sort((a, b) => timeToMins(a.time) - timeToMins(b.time));
    });
    return merged;
  }, [itineraryData, dbEvents]);

  const activeDay = data.find(d => d.id === activeDayId);

  const handleAddEvent = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'itinerary_events'), {
        ...newEvent,
        id: 'e' + Date.now(),
        duration: Number(newEvent.duration),
        dayId: activeDayId
      });
      setIsAdding(false);
      setNewEvent({ time: '12:00', duration: 60, title: '', description: '', icon: '🌟' });
    } catch (error) {
      console.error("Error adding event:", error);
    }
  };

  const handleDeleteEvent = async (firebaseId) => {
    if (!firebaseId) {
      alert("This is a mock event. You can remove it permanently by editing i18n.js!");
      return;
    }
    if (window.confirm("Delete this event?")) {
      await deleteDoc(doc(db, 'itinerary_events', firebaseId));
    }
  };

  // Calendar View Constants
  const CAL_START_HOUR = 7; // 07:00
  const CAL_END_HOUR = 23; // 23:00
  const HOUR_HEIGHT = 70; // px per hour
  const hours = Array.from({ length: CAL_END_HOUR - CAL_START_HOUR + 1 }, (_, i) => CAL_START_HOUR + i);

  // Overlap calculation for Calendar View
  const getCalendarEvents = () => {
    // Basic overlap logic
    let events = [...activeDay.events].map(ev => ({
      ...ev,
      startMins: timeToMins(ev.time),
      endMins: timeToMins(ev.time) + ev.duration
    }));

    // Group overlapping events to determine width/left offset
    events.forEach(ev => {
      const overlapping = events.filter(e => 
        (e.startMins < ev.endMins && e.endMins > ev.startMins)
      );
      ev.overlapCount = overlapping.length;
      ev.overlapIndex = overlapping.findIndex(e => e.id === ev.id);
    });

    return events;
  };

  return (
    <div style={{ paddingBottom: '80px', position: 'relative', minHeight: '80vh' }}>
      
      {/* Header & Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.8rem', color: 'var(--text-dark)' }}>{t('itinerary.title')}</h1>
          <p style={{ margin: '5px 0 0 0', color: '#555', fontWeight: '600' }}>
            📍 {activeDay.location}
          </p>
        </div>
        
        {/* View Toggle */}
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.5)', borderRadius: '20px', padding: '4px' }}>
          <button 
            onClick={() => setViewMode('feed')}
            style={{
              padding: '8px 16px', border: 'none', borderRadius: '12px', fontWeight: 'bold',
              background: viewMode === 'feed' ? 'white' : 'transparent',
              boxShadow: viewMode === 'feed' ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
              color: viewMode === 'feed' ? 'var(--primary)' : '#666', cursor: 'pointer'
            }}
          >{t('itinerary.feedBtn')}</button>
          <button 
            onClick={() => setViewMode('calendar')}
            style={{
              padding: '8px 16px', border: 'none', borderRadius: '12px', fontWeight: 'bold',
              background: viewMode === 'calendar' ? 'white' : 'transparent',
              boxShadow: viewMode === 'calendar' ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
              color: viewMode === 'calendar' ? 'var(--primary)' : '#666', cursor: 'pointer'
            }}
          >{t('itinerary.calBtn')}</button>
        </div>
      </div>

      {/* Sub-tabs (Pills) */}
      <div 
        style={{ 
          display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '15px',
          scrollbarWidth: 'none', msOverflowStyle: 'none',
        }}
        className="hide-scrollbar"
      >
        {data.map((day) => (
          <button
            key={day.id}
            onClick={() => setActiveDayId(day.id)}
            style={{
              padding: '8px 16px', border: 'none', borderRadius: '20px', fontSize: '0.95rem', fontWeight: '600', whiteSpace: 'nowrap', cursor: 'pointer', transition: 'all 0.2s ease',
              background: activeDayId === day.id ? 'var(--primary)' : 'rgba(255,255,255,0.7)',
              color: activeDayId === day.id ? 'white' : 'var(--text-dark)',
              boxShadow: activeDayId === day.id ? '0 4px 10px rgba(0, 198, 255, 0.4)' : 'none'
            }}
          >
            {day.date}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="animate-fade-in" key={`${activeDay.id}-${viewMode}`}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '1.2rem', color: '#333' }}>
          {activeDay.title}
        </h3>
        
        {viewMode === 'feed' ? (
          /* FEED VIEW */
          <div>
            {activeDay.events.map((event, index) => (
              <div key={event.id} style={{ display: 'flex', marginBottom: '20px' }}>
                <div style={{ width: '55px', fontSize: '0.9rem', color: '#666', fontWeight: 'bold', textAlign: 'right', paddingRight: '15px', paddingTop: '5px' }}>
                  {event.time}
                </div>
                <div style={{ 
                  flex: 1, background: 'rgba(255,255,255,0.85)', borderLeft: '4px solid var(--primary)', 
                  padding: '15px', borderRadius: '0 12px 12px 0', boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '1.3rem' }}>{event.icon}</span>
                      <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#222' }}>{event.title}</h4>
                    </div>
                    {event.firebaseId && (
                      <button 
                        onClick={() => handleDeleteEvent(event.firebaseId)}
                        style={{ background: 'transparent', border: 'none', color: '#ff4757', cursor: 'pointer' }}
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                  <p style={{ margin: 0, fontSize: '0.95rem', color: '#555', lineHeight: '1.4' }}>{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* OUTLOOK/GOOGLE CALENDAR VIEW */
          <div style={{ 
            background: 'rgba(255,255,255,0.9)', 
            borderRadius: '16px', 
            border: '1px solid #eee',
            position: 'relative',
            overflowY: 'auto',
            maxHeight: '60vh',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
          }}>
            <div style={{ position: 'relative', minHeight: `${(CAL_END_HOUR - CAL_START_HOUR + 1) * HOUR_HEIGHT}px` }}>
              
              {/* Grid Lines */}
              {hours.map((hour, i) => (
                <div key={hour} style={{ 
                  position: 'absolute', top: `${i * HOUR_HEIGHT}px`, left: 0, right: 0, height: `${HOUR_HEIGHT}px`, 
                  borderBottom: '1px solid #eaeaea', display: 'flex' 
                }}>
                  <div style={{ width: '50px', padding: '5px', fontSize: '0.75rem', color: '#888', textAlign: 'center', borderInlineEnd: '1px solid #eaeaea' }}>
                    {hour}:00
                  </div>
                </div>
              ))}

              {/* Plotted Events */}
              {getCalendarEvents().map((ev) => {
                // Ensure event is within visible bounds
                const startHour = Math.max(ev.startMins / 60, CAL_START_HOUR);
                const top = (startHour - CAL_START_HOUR) * HOUR_HEIGHT;
                const height = (ev.duration / 60) * HOUR_HEIGHT;
                
                // If the event starts before the calendar view (e.g. 5AM), clamp it for visual safety, though data currently starts >= 07:00
                if (startHour > CAL_END_HOUR) return null;

                const widthPct = 100 / ev.overlapCount;
                const leftOffset = ev.overlapIndex * widthPct;

                return (
                  <div key={ev.id} style={{
                    position: 'absolute',
                    top: `${top}px`,
                    height: `${height}px`,
                    insetInlineStart: `calc(50px + ${leftOffset}%)`, // offset by the time column width (50px)
                    width: `calc(100% - 50px)`,
                    maxWidth: `${widthPct}%`,
                    padding: '2px' // spacing between overlapping events
                  }}>
                    <div style={{
                      background: 'var(--primary)',
                      color: 'white',
                      width: '100%',
                      height: '100%',
                      borderRadius: '6px',
                      padding: '6px 8px',
                      overflow: 'hidden',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                    }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '2px' }}>
                        {ev.time} {ev.icon}
                      </div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 'bold', lineHeight: '1.2' }}>{ev.title}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Add Event Form Modal */}
      {isAdding && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '25px', background: 'rgba(255,255,255,0.95)' }}>
            <h3 style={{ margin: '0 0 15px 0' }}>{t('itinerary.addEvent')} {activeDay.date}</h3>
            <form onSubmit={handleAddEvent} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input required type="time" className="glass-input" style={{ padding: '10px', flex: 1 }}
                  value={newEvent.time} onChange={e => setNewEvent({...newEvent, time: e.target.value})} />
                <input required type="number" placeholder="Min" className="glass-input" style={{ padding: '10px', flex: 1 }}
                  value={newEvent.duration} onChange={e => setNewEvent({...newEvent, duration: e.target.value})} />
              </div>
              <input required type="text" placeholder={t('itinerary.modalTitle')} className="glass-input" style={{ padding: '10px' }}
                value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} />
              <textarea placeholder={t('itinerary.modalDesc')} className="glass-input" style={{ padding: '10px', minHeight: '80px', resize: 'none' }}
                value={newEvent.description} onChange={e => setNewEvent({...newEvent, description: e.target.value})} />
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setIsAdding(false)} style={{ flex: 1, padding: '10px', borderRadius: '12px', border: '1px solid #ccc', background: 'transparent', cursor: 'pointer', fontWeight: 'bold' }}>{t('itinerary.cancel')}</button>
                <button type="submit" className="btn-primary" style={{ flex: 1, padding: '10px' }}>{t('itinerary.add')}</button>
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

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
