import { Link, Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

export default function Layout() {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  
  useEffect(() => {
    document.documentElement.dir = i18n.language === 'he' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === 'he' ? 'en' : 'he');
  };
  
  const getLinkStyle = (path) => ({
    textDecoration: 'none',
    color: location.pathname === path ? 'var(--primary)' : 'var(--text-dark)',
    fontWeight: location.pathname === path ? '800' : '600',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontSize: '0.8rem',
    transition: 'color 0.3s ease'
  });

  return (
    <div 
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100vh',
        backgroundImage: 'linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.3)), url("/bg-resort.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Top safe area for mobile + main content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', paddingBottom: '80px', position: 'relative' }}>
        
        {/* Language Toggle */}
        <button 
          onClick={toggleLang}
          style={{
            position: 'absolute',
            top: '20px',
            [i18n.language === 'he' ? 'left' : 'right']: '20px',
            background: 'rgba(255,255,255,0.8)',
            border: 'none',
            borderRadius: '20px',
            padding: '5px 12px',
            fontSize: '0.9rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            zIndex: 10
          }}
        >
          {i18n.language === 'he' ? '🇺🇸 EN' : '🇮🇱 HE'}
        </button>

        <div className="glass-panel animate-fade-in" style={{ padding: '20px', minHeight: '80vh', marginTop: '30px' }}>
          <Outlet />
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <div 
        style={{ 
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '70px', 
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(15px)',
          WebkitBackdropFilter: 'blur(15px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.5)',
          display: 'flex', 
          justifyContent: 'space-around', 
          alignItems: 'center',
          paddingBottom: 'env(safe-area-inset-bottom)',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.1)'
        }}
      >
        <Link to="/" style={getLinkStyle('/')}>
          <span style={{ fontSize: '1.2rem', marginBottom: '2px' }}>🏠</span>
          {t('nav.home')}
        </Link>
        <Link to="/itinerary" style={getLinkStyle('/itinerary')}>
          <span style={{ fontSize: '1.2rem', marginBottom: '2px' }}>📅</span>
          {t('nav.itinerary')}
        </Link>
        <Link to="/docs" style={getLinkStyle('/docs')}>
          <span style={{ fontSize: '1.2rem', marginBottom: '2px' }}>🗄️</span>
          {t('nav.docs')}
        </Link>
        <Link to="/guidebook" style={getLinkStyle('/guidebook')}>
          <span style={{ fontSize: '1.2rem', marginBottom: '2px' }}>🗺️</span>
          {t('nav.guidebook')}
        </Link>
      </div>
    </div>
  );
}
