import { useState, useEffect } from 'react';
import { itineraryData } from './data/itinerary';

// WMO Weather Code to Emoji map
const getWeatherIcon = (code) => {
  if (code === 0) return '☀️';
  if (code === 1 || code === 2) return '🌤️';
  if (code === 3) return '☁️';
  if (code >= 45 && code <= 48) return '🌫️';
  if (code >= 51 && code <= 55) return '🌦️';
  if (code >= 61 && code <= 65) return '🌧️';
  if (code >= 80 && code <= 82) return '🌧️';
  if (code >= 95) return '⛈️';
  return '⛅'; // fallback
};

export default function Home() { 
  const [liveForecast, setLiveForecast] = useState(null);

  // The base itinerary to map against
  const tripDays = [
    { date: 'Aug 20', loc: 'Budapest', locIndex: 0, apiDate: '2026-08-20' },
    { date: 'Aug 21', loc: 'Budapest', locIndex: 0, apiDate: '2026-08-21' },
    { date: 'Aug 22', loc: 'Budapest', locIndex: 0, apiDate: '2026-08-22' },
    { date: 'Aug 23', loc: 'Slovakia', locIndex: 1, apiDate: '2026-08-23' },
    { date: 'Aug 24', loc: 'Slovakia', locIndex: 1, apiDate: '2026-08-24' },
    { date: 'Aug 25', loc: 'Slovakia', locIndex: 1, apiDate: '2026-08-25' },
    { date: 'Aug 26', loc: 'Slovakia', locIndex: 1, apiDate: '2026-08-26' },
    { date: 'Aug 27', loc: 'Slovakia', locIndex: 1, apiDate: '2026-08-27' },
    { date: 'Aug 28', loc: 'Slovakia', locIndex: 1, apiDate: '2026-08-28' },
    { date: 'Aug 29', loc: 'Budapest', locIndex: 0, apiDate: '2026-08-29' }
  ];

  useEffect(() => {
    // Fetch 16-day forecast for Budapest (0) and Tatralandia (1)
    fetch('https://api.open-meteo.com/v1/forecast?latitude=47.4979,49.0833&longitude=19.0402,19.6167&daily=weather_code,temperature_2m_max&timezone=Europe%2FBudapest&forecast_days=16')
      .then(res => res.json())
      .then(data => {
        // Construct the combined trip forecast mapping
        const combined = tripDays.map(day => {
          const apiLocData = data[day.locIndex];
          const dateIndex = apiLocData.daily.time.indexOf(day.apiDate);
          
          if (dateIndex !== -1) {
            // We have live data for this date!
            return {
              ...day,
              temp: `${Math.round(apiLocData.daily.temperature_2m_max[dateIndex])}°`,
              icon: getWeatherIcon(apiLocData.daily.weather_code[dateIndex]),
              isLive: true
            };
          } else {
            // Date is outside the 16-day forecast window, use fallback historical estimates
            return {
              ...day,
              temp: day.loc === 'Budapest' ? '25°' : '22°',
              icon: '⛅',
              isLive: false
            };
          }
        });
        setLiveForecast(combined);
      })
      .catch(err => {
        console.error("Failed to fetch live weather", err);
      });
  }, []);

  // Determine the "Up Next" event by grabbing the first event from the itinerary
  // In a real app with real time, we would filter events where date/time > Date.now()
  const upNextDay = itineraryData[0];
  const upNextEvent = upNextDay.events[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '40px' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
        <h1 style={{ color: 'var(--text-dark)', fontSize: '2rem', marginBottom: '5px' }}>Asaf Family Trip</h1>
        <p style={{ color: '#555', fontSize: '1.1rem', fontWeight: '600' }}>Budapest & Slovakia</p>
      </div>

      {/* Weather Panel */}
      <div style={{
        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        borderRadius: '16px',
        padding: '20px',
        color: 'white',
        boxShadow: '0 8px 20px rgba(79, 172, 254, 0.4)'
      }}>
        {/* Current Weather */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Trip Forecast
              {liveForecast && <span style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.3)', padding: '2px 6px', borderRadius: '8px', textTransform: 'uppercase' }}>Live</span>}
            </div>
            <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Aug 20 - Aug 29</div>
          </div>
          <div style={{ fontSize: '2.5rem' }}>🌤️</div>
        </div>
        
        {/* Weekly Forecast Scrollable */}
        <div 
          className="hide-scrollbar"
          style={{ 
            display: 'flex', 
            gap: '12px',
            overflowX: 'auto',
            borderTop: '1px solid rgba(255,255,255,0.3)',
            paddingTop: '15px',
            paddingBottom: '5px'
          }}
        >
          {liveForecast ? liveForecast.map((f, i) => (
            <div key={i} style={{ 
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
              background: 'rgba(255,255,255,0.25)', padding: '12px 10px', borderRadius: '14px', 
              flex: '1 0 auto', minWidth: '85px', // Make boxes physically wider and let them grow
              position: 'relative'
            }}>
              {!f.isLive && (
                <div style={{ position: 'absolute', top: '-6px', right: '-4px', background: '#ff9f43', color: 'white', fontSize: '0.6rem', padding: '1px 5px', borderRadius: '6px', fontWeight: 'bold' }}>Est</div>
              )}
              <div style={{ fontSize: '0.85rem', fontWeight: 'bold', whiteSpace: 'nowrap' }}>{f.date}</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.9, marginBottom: '2px' }}>{f.loc}</div>
              <div style={{ fontSize: '1.8rem' }}>{f.icon}</div>
              <div style={{ fontSize: '1rem', fontWeight: 'bold' }}>{f.temp}</div>
            </div>
          )) : (
            <div style={{ width: '100%', textAlign: 'center', padding: '20px', opacity: 0.8 }}>Fetching live forecast...</div>
          )}
        </div>
      </div>

      {/* Up Next Panel */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '16px',
        padding: '20px',
        borderLeft: '5px solid var(--primary)',
        boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
      }}>
        <div style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 'bold', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Up Next • {upNextDay.date}
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
          <div style={{ fontSize: '2rem' }}>{upNextEvent.icon}</div>
          <div>
            <h3 style={{ margin: '0 0 5px 0', fontSize: '1.3rem', color: '#222' }}>{upNextEvent.title}</h3>
            <div style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 'bold', marginBottom: '4px' }}>
              {upNextEvent.time}
            </div>
            <p style={{ margin: '0', color: '#666', fontSize: '0.95rem', lineHeight: '1.4' }}>
              {upNextEvent.description}
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  ); 
}
