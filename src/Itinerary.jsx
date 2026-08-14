import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { db } from './firebase';
import { collection, addDoc, updateDoc, onSnapshot, query, doc, deleteDoc } from 'firebase/firestore';

// Helper to convert "HH:mm" to minutes since 00:00
const timeToMins = (timeStr) => {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + (m || 0);
};

export default function Itinerary() {
  const { t, i18n } = useTranslation();
  const itineraryData = t('itineraryData', { returnObjects: true });
  const isEn = i18n.language === 'en';
  
  const [dbEvents, setDbEvents] = useState([]);
  const [activeDayId, setActiveDayId] = useState(itineraryData[0].id);
  const [viewMode, setViewMode] = useState('daily'); // 'feed' | 'daily' | 'weekly'
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({ 
    time: '12:00', endTime: '13:00', title: '', titleEn: '', 
    description: '', descriptionEn: '', icon: '🌟', mapQuery: '' 
  });

  // Current time for the red line
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000); // update every minute
    return () => clearInterval(interval);
  }, []);

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
      day.events = [...day.events, ...dayDbEvents].map(ev => ({
        ...ev,
        // compute duration if not present
        duration: ev.duration || (timeToMins(ev.endTime) - timeToMins(ev.time))
      }));
      day.events.sort((a, b) => timeToMins(a.time) - timeToMins(b.time));
    });
    return merged;
  }, [itineraryData, dbEvents]);

  const activeDay = data.find(d => d.id === activeDayId);

  const handleAddEvent = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newEvent,
        dayId: activeDayId
      };
      
      if (editingId) {
        await updateDoc(doc(db, 'itinerary_events', editingId), payload);
      } else {
        await addDoc(collection(db, 'itinerary_events'), payload);
      }
      
      setIsAdding(false);
      setEditingId(null);
      setNewEvent({ 
        time: '12:00', endTime: '13:00', title: '', titleEn: '', 
        description: '', descriptionEn: '', icon: '🌟', mapQuery: '' 
      });
    } catch (error) {
      console.error("Error saving event:", error);
    }
  };

  const handleEditEvent = (ev) => {
    setNewEvent({
      time: ev.time || '12:00',
      endTime: ev.endTime || '13:00',
      title: ev.title || '',
      titleEn: ev.titleEn || '',
      description: ev.description || '',
      descriptionEn: ev.descriptionEn || '',
      icon: ev.icon || '🌟',
      mapQuery: ev.mapQuery || ''
    });
    setEditingId(ev.firebaseId);
    setSelectedEvent(null); // close details modal
    setIsAdding(true);
  };

  const handleDeleteEvent = async (firebaseId) => {
    if (window.confirm("Delete this event?")) {
      await deleteDoc(doc(db, 'itinerary_events', firebaseId));
      setSelectedEvent(null);
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
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <h1 style={{ margin: 0, fontSize: '1.8rem', color: 'var(--text-dark)' }}>{t('itinerary.title')}</h1>
            <button 
              onClick={() => setIsAdding(true)}
              style={{ background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '50%', width: '36px', height: '36px', fontSize: '1.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0, 198, 255, 0.3)' }}
            >
              +
            </button>
          </div>
          <p style={{ margin: '5px 0 0 0', color: '#555', fontWeight: '600' }}>
            📍 {activeDay.location}
          </p>
        </div>
        
        {/* View Toggle */}
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.5)', borderRadius: '20px', padding: '4px' }}>
          <button 
            onClick={() => setViewMode('feed')}
            style={{
              padding: '8px 12px', border: 'none', borderRadius: '12px', fontWeight: 'bold',
              background: viewMode === 'feed' ? 'white' : 'transparent',
              boxShadow: viewMode === 'feed' ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
              color: viewMode === 'feed' ? 'var(--primary)' : '#666', cursor: 'pointer'
            }}
          >{t('itinerary.feedBtn')}</button>
          <button 
            onClick={() => setViewMode('daily')}
            style={{
              padding: '8px 12px', border: 'none', borderRadius: '12px', fontWeight: 'bold',
              background: viewMode === 'daily' ? 'white' : 'transparent',
              boxShadow: viewMode === 'daily' ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
              color: viewMode === 'daily' ? 'var(--primary)' : '#666', cursor: 'pointer'
            }}
          >{t('itinerary.dailyBtn')}</button>
          <button 
            onClick={() => setViewMode('weekly')}
            style={{
              padding: '8px 12px', border: 'none', borderRadius: '12px', fontWeight: 'bold',
              background: viewMode === 'weekly' ? 'white' : 'transparent',
              boxShadow: viewMode === 'weekly' ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
              color: viewMode === 'weekly' ? 'var(--primary)' : '#666', cursor: 'pointer'
            }}
          >{t('itinerary.weeklyBtn')}</button>
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
        
        {viewMode === 'feed' && (
          /* FEED VIEW */
          <div>
            {activeDay.events.map((event, index) => {
              const displayTitle = isEn && event.titleEn ? event.titleEn : event.title;
              const displayDesc = isEn && event.descriptionEn ? event.descriptionEn : event.description;
              
              return (
                <div 
                  key={event.id} 
                  style={{ display: 'flex', marginBottom: '20px', cursor: 'pointer' }}
                  onClick={() => setSelectedEvent(event)}
                >
                  <div style={{ width: '55px', fontSize: '0.9rem', color: '#666', fontWeight: 'bold', textAlign: 'right', paddingRight: '15px', paddingTop: '5px' }}>
                    {event.time}
                  </div>
                  <div style={{ 
                    flex: 1, background: 'rgba(255,255,255,0.85)', borderLeft: '4px solid var(--primary)', 
                    padding: '15px', borderRadius: '0 12px 12px 0', boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                      <span style={{ fontSize: '1.3rem' }}>{event.icon}</span>
                      <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#222' }}>{displayTitle}</h4>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.95rem', color: '#555', lineHeight: '1.4' }}>{displayDesc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {viewMode === 'daily' && (
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

              {/* Red Time Line */}
              {(() => {
                const currentHour = now.getHours() + now.getMinutes() / 60;
                if (currentHour >= CAL_START_HOUR && currentHour <= CAL_END_HOUR) {
                  const top = (currentHour - CAL_START_HOUR) * HOUR_HEIGHT;
                  return (
                    <div style={{
                      position: 'absolute', top: `${top}px`, left: '45px', right: 0,
                      height: '2px', background: '#ff4757', zIndex: 10, pointerEvents: 'none'
                    }}>
                      <div style={{
                        position: 'absolute', top: '-4px', left: '-5px', width: '10px', height: '10px',
                        background: '#ff4757', borderRadius: '50%'
                      }} />
                    </div>
                  );
                }
                return null;
              })()}

              {/* Plotted Events */}
              {getCalendarEvents().map((ev) => {
                const startHour = Math.max(ev.startMins / 60, CAL_START_HOUR);
                const top = (startHour - CAL_START_HOUR) * HOUR_HEIGHT;
                const height = (ev.duration / 60) * HOUR_HEIGHT;
                
                if (startHour > CAL_END_HOUR) return null;

                const widthPct = 100 / ev.overlapCount;
                const leftOffset = ev.overlapIndex * widthPct;
                const displayTitle = isEn && ev.titleEn ? ev.titleEn : ev.title;

                return (
                  <div 
                    key={ev.id} 
                    onClick={() => setSelectedEvent(ev)}
                    style={{
                      position: 'absolute',
                      top: `${top}px`,
                      height: `${height}px`,
                      insetInlineStart: `calc(50px + ${leftOffset}%)`,
                      width: `calc(100% - 50px)`,
                      maxWidth: `${widthPct}%`,
                      padding: '2px',
                      cursor: 'pointer'
                    }}
                  >
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
                      <div style={{ fontSize: '0.85rem', fontWeight: 'bold', lineHeight: '1.2' }}>{displayTitle}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {viewMode === 'weekly' && (
          /* WEEKLY CALENDAR VIEW */
          <div style={{ 
            background: 'rgba(255,255,255,0.9)', 
            borderRadius: '16px', 
            border: '1px solid #eee',
            position: 'relative',
            overflowX: 'auto',
            overflowY: 'auto',
            maxHeight: '60vh',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
          }}>
            <div style={{ display: 'flex', minWidth: 'max-content' }}>
              
              {/* Time Axis Column (Sticky) */}
              <div style={{ 
                width: '50px', 
                position: 'sticky', 
                insetInlineStart: 0, 
                background: 'rgba(255,255,255,0.95)', 
                zIndex: 20, 
                borderInlineEnd: '1px solid #eaeaea' 
              }}>
                <div style={{ height: '40px', borderBottom: '1px solid #eaeaea' }} />
                <div style={{ position: 'relative', minHeight: `${(CAL_END_HOUR - CAL_START_HOUR + 1) * HOUR_HEIGHT}px` }}>
                  {hours.map(hour => (
                    <div key={hour} style={{ 
                      height: `${HOUR_HEIGHT}px`, 
                      borderBottom: '1px solid #eaeaea', 
                      textAlign: 'center', 
                      fontSize: '0.75rem', 
                      color: '#888', 
                      paddingTop: '5px' 
                    }}>
                      {hour}:00
                    </div>
                  ))}
                </div>
              </div>

              {/* Day Columns */}
              {data.map(day => {
                // Calculate overlaps for this specific day
                let dayEvents = [...day.events].map(ev => ({
                  ...ev,
                  startMins: timeToMins(ev.time),
                  endMins: timeToMins(ev.time) + ev.duration
                }));
                dayEvents.forEach(ev => {
                  const overlapping = dayEvents.filter(e => (e.startMins < ev.endMins && e.endMins > ev.startMins));
                  ev.overlapCount = overlapping.length;
                  ev.overlapIndex = overlapping.findIndex(e => e.id === ev.id);
                });

                return (
                  <div key={day.id} style={{ width: '130px', borderInlineEnd: '1px solid #eaeaea', position: 'relative' }}>
                    {/* Day Header */}
                    <div style={{ 
                      height: '40px', 
                      borderBottom: '1px solid #eaeaea', 
                      textAlign: 'center', 
                      padding: '5px', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      justifyContent: 'center',
                      background: day.id === activeDayId ? 'rgba(0, 198, 255, 0.1)' : 'transparent'
                    }}>
                      <span style={{ 
                        fontWeight: 'bold', 
                        fontSize: '0.85rem', 
                        color: day.id === activeDayId ? 'var(--primary)' : '#444' 
                      }}>
                        {day.date}
                      </span>
                    </div>
                    
                    {/* Day Timeline */}
                    <div style={{ position: 'relative', minHeight: `${(CAL_END_HOUR - CAL_START_HOUR + 1) * HOUR_HEIGHT}px` }}>
                      {/* Horizontal Grid Lines */}
                      {hours.map((hour, i) => (
                        <div key={hour} style={{ 
                          position: 'absolute', 
                          top: `${i * HOUR_HEIGHT}px`, 
                          left: 0, right: 0, 
                          height: `${HOUR_HEIGHT}px`, 
                          borderBottom: '1px solid #eaeaea' 
                        }} />
                      ))}
                      
                      {/* Plotted Events for this day */}
                      {dayEvents.map(ev => {
                        const startHour = Math.max(ev.startMins / 60, CAL_START_HOUR);
                        if (startHour > CAL_END_HOUR) return null;
                        const top = (startHour - CAL_START_HOUR) * HOUR_HEIGHT;
                        const height = (ev.duration / 60) * HOUR_HEIGHT;
                        const widthPct = 100 / ev.overlapCount;
                        const leftOffset = ev.overlapIndex * widthPct;
                        const displayTitle = isEn && ev.titleEn ? ev.titleEn : ev.title;

                        return (
                          <div 
                            key={ev.id} 
                            onClick={() => setSelectedEvent(ev)} 
                            style={{
                              position: 'absolute', 
                              top: `${top}px`, 
                              height: `${height}px`,
                              insetInlineStart: `${leftOffset}%`, 
                              width: `${widthPct}%`, 
                              padding: '1px', 
                              cursor: 'pointer', 
                              zIndex: 10
                            }}
                          >
                            <div style={{ 
                              background: 'var(--primary)', 
                              color: 'white', 
                              width: '100%', 
                              height: '100%', 
                              borderRadius: '4px', 
                              padding: '4px', 
                              overflow: 'hidden', 
                              fontSize: '0.7rem', 
                              lineHeight: '1.2',
                              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                            }}>
                              <div style={{ fontWeight: 'bold', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {ev.time} {ev.icon}
                              </div>
                              <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                {displayTitle}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Event Form Modal */}
      {isAdding && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '25px', background: 'rgba(255,255,255,0.95)', overflowY: 'auto', maxHeight: '90vh' }}>
            <h3 style={{ margin: '0 0 15px 0' }}>{editingId ? 'Edit Event' : t('itinerary.addEvent') + ' ' + activeDay.date}</h3>
            <form onSubmit={handleAddEvent} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.8rem', color: '#666', fontWeight: 'bold' }}>Start Time</label>
                  <input required type="time" className="glass-input" style={{ padding: '10px' }}
                    value={newEvent.time} onChange={e => setNewEvent({...newEvent, time: e.target.value})} />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.8rem', color: '#666', fontWeight: 'bold' }}>End Time</label>
                  <input required type="time" className="glass-input" style={{ padding: '10px' }}
                    value={newEvent.endTime} onChange={e => setNewEvent({...newEvent, endTime: e.target.value})} />
                </div>
              </div>
              <input required type="text" placeholder={t('itinerary.modalTitle')} className="glass-input" style={{ padding: '10px' }}
                value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} />
              <input type="text" placeholder="Title (English)" className="glass-input" style={{ padding: '10px' }}
                value={newEvent.titleEn} onChange={e => setNewEvent({...newEvent, titleEn: e.target.value})} />
                
              <textarea placeholder={t('itinerary.modalDesc')} className="glass-input" style={{ padding: '10px', minHeight: '60px', resize: 'vertical' }}
                value={newEvent.description} onChange={e => setNewEvent({...newEvent, description: e.target.value})} />
              <textarea placeholder="Description (English)" className="glass-input" style={{ padding: '10px', minHeight: '60px', resize: 'vertical' }}
                value={newEvent.descriptionEn} onChange={e => setNewEvent({...newEvent, descriptionEn: e.target.value})} />
                
              <input type="text" placeholder="Map Location (e.g. Gozsdu Court)" className="glass-input" style={{ padding: '10px' }}
                value={newEvent.mapQuery} onChange={e => setNewEvent({...newEvent, mapQuery: e.target.value})} />
              
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => { setIsAdding(false); setEditingId(null); }} style={{ flex: 1, padding: '10px', borderRadius: '12px', border: '1px solid #ccc', background: 'transparent', cursor: 'pointer', fontWeight: 'bold' }}>{t('itinerary.cancel')}</button>
                <button type="submit" className="btn-primary" style={{ flex: 1, padding: '10px' }}>{editingId ? 'Save' : t('itinerary.add')}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Event Details Popup */}
      {selectedEvent && (() => {
        const displayTitle = isEn && selectedEvent.titleEn ? selectedEvent.titleEn : selectedEvent.title;
        const displayDesc = isEn && selectedEvent.descriptionEn ? selectedEvent.descriptionEn : selectedEvent.description;

        return (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
          }} onClick={() => setSelectedEvent(null)}>
            <div 
              className="glass-panel animate-fade-in" 
              style={{ width: '100%', maxWidth: '400px', padding: '25px', background: 'rgba(255,255,255,0.95)', position: 'relative' }}
              onClick={e => e.stopPropagation()} // prevent closing when clicking inside panel
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px', marginBottom: '15px' }}>
                <div style={{ fontSize: '3rem', background: '#f5f6fa', borderRadius: '15px', width: '70px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {selectedEvent.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '3px' }}>
                    {selectedEvent.time} {selectedEvent.endTime && `- ${selectedEvent.endTime}`}
                  </div>
                  <h3 style={{ margin: '0', fontSize: '1.4rem', color: '#222', lineHeight: '1.2' }}>{displayTitle}</h3>
                </div>
              </div>
              
              {displayDesc && (
                <p style={{ margin: '0 0 20px 0', color: '#555', fontSize: '1rem', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                  {displayDesc}
                </p>
              )}

            {selectedEvent.mapQuery && (
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedEvent.mapQuery)}`}
                target="_blank" rel="noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  padding: '12px', background: 'rgba(0, 198, 255, 0.1)', color: 'var(--primary)',
                  borderRadius: '12px', textDecoration: 'none', fontWeight: 'bold', marginBottom: '20px'
                }}
              >
                📍 {t('guidebook.openMaps') || 'Open in Google Maps'}
              </a>
            )}

            {selectedEvent.firebaseId && (
              <div style={{ display: 'flex', gap: '10px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                <button 
                  onClick={() => handleEditEvent(selectedEvent)}
                  style={{ flex: 1, padding: '10px', borderRadius: '12px', background: '#f1f2f6', border: 'none', color: '#2f3542', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  ✏️ Edit
                </button>
                <button 
                  onClick={() => handleDeleteEvent(selectedEvent.firebaseId)}
                  style={{ flex: 1, padding: '10px', borderRadius: '12px', background: 'rgba(255, 71, 87, 0.1)', border: 'none', color: '#ff4757', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  🗑️ Delete
                </button>
              </div>
            )}
          </div>
        </div>
        );
      })}

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
