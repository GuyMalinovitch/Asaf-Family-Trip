import { useTranslation } from 'react-i18next';

export default function Guidebook() {
  const { t } = useTranslation();
  const pins = t('guideData', { returnObjects: true });

  return (
    <div style={{ paddingBottom: '40px' }}>
      <h1 style={{ marginBottom: '5px', fontSize: '1.8rem', color: 'var(--text-dark)' }}>{t('guidebook.title')}</h1>
      
      <p style={{ marginBottom: '20px', color: '#555', fontSize: '1.1rem', lineHeight: '1.5' }}>
        {t('guidebook.subtitle')}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {pins.map((pin, i) => (
          <div key={i} style={{
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
              href={`https://www.google.com/maps/search/?api=1&query=${pin.query}`}
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
    </div>
  );
}
