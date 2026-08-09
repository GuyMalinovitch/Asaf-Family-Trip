import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

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
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  const itineraryData = t('itineraryData', { returnObjects: true });

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
    fetch('https://api.open-meteo.com/v1/forecast?latitude=47.4979,49.0833&longitude=19.0402,19.6167&daily=weather_code,temperature_2m_max&timezone=Europe%2FBudapest&forecast_days=16')
      .then(res => res.json())
      .then(data => {
        const combined = tripDays.map(day => {
          const apiLocData = data[day.locIndex];
          const dateIndex = apiLocData.daily.time.indexOf(day.apiDate);
          
          if (dateIndex !== -1) {
            return {
              ...day,
              temp: `${Math.round(apiLocData.daily.temperature_2m_max[dateIndex])}°`,
              icon: getWeatherIcon(apiLocData.daily.weather_code[dateIndex]),
              isLive: true
            };
          } else {
            return {
              ...day,
              temp: day.loc === 'Budapest' ? '25°' : '22°',
              icon: '⛅',
              isLive: false
            };
          }
        });
        setLiveForecast(combined);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch live weather", err);
        setLoading(false);
      });
  }, []);

  const nextEvent = itineraryData && itineraryData[0] ? itineraryData[0].events[0] : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '40px' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '5px', color: 'var(--primary)' }}>{t('home.title')}</h1>
        <p style={{ color: '#666', fontSize: '1.1rem' }}>{t('home.subtitle')} • {t('home.weatherDays.Aug 20')}-{t('home.weatherDays.Aug 29')}</p>
      </div>

      {/* Weather Forecast Widget */}
      <div style={{ background: 'rgba(255,255,255,0.7)', borderRadius: '20px', padding: '20px', marginBottom: '25px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h2 style={{ fontSize: '1.2rem', margin: 0 }}>⛅ {t('home.forecastTitle')}</h2>
          <span style={{ fontSize: '0.8rem', background: 'rgba(0,198,255,0.2)', color: 'var(--secondary)', padding: '4px 10px', borderRadius: '12px', fontWeight: 'bold' }}>
            {t('home.live')}
          </span>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>{t('home.fetching')}</div>
        ) : (
          <div 
            className="hide-scrollbar"
            style={{ 
              display: 'flex', 
              gap: '12px',
              overflowX: 'auto',
              borderTop: '1px solid rgba(0,0,0,0.05)',
              paddingTop: '15px'
            }}
          >
            {liveForecast.map((f, i) => (
              <div key={i} style={{ 
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                background: 'rgba(255,255,255,0.8)', padding: '12px 10px', borderRadius: '14px', 
                flex: '1 0 auto', minWidth: '85px',
                position: 'relative'
              }}>
                {!f.isLive && (
                  <span style={{ position: 'absolute', top: '-8px', right: '-5px', background: '#ff9f43', color: 'white', fontSize: '0.6rem', padding: '2px 5px', borderRadius: '8px', fontWeight: 'bold' }}>
                    {t('home.est')}
                  </span>
                )}
                <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#555' }}>{t(`home.weatherDays.${f.date}`)}</span>
                <span style={{ fontSize: '1.8rem' }}>{f.icon}</span>
                <span style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-dark)' }}>{f.temp}</span>
                <span style={{ fontSize: '0.7rem', color: '#777', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>{t(`home.weatherLocs.${f.loc}`)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Up Next Widget */}
      <h2 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>⏱️ {t('home.upNext')}</h2>
      
      {nextEvent && (
        <div style={{ background: 'white', borderRadius: '16px', padding: '20px', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '2.5rem', background: '#f5f6fa', width: '60px', height: '60px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {nextEvent.icon}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <span style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '0.9rem' }}>{nextEvent.time}</span>
              <span style={{ color: '#999', fontSize: '0.8rem' }}>{nextEvent.date}</span>
            </div>
            <h3 style={{ margin: '0 0 5px 0', fontSize: '1.1rem' }}>{nextEvent.title}</h3>
            <p style={{ margin: 0, color: '#666', fontSize: '0.9rem', lineHeight: '1.4' }}>
              {nextEvent.description}
            </p>
          </div>
        </div>
      )}

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  ); 
}
