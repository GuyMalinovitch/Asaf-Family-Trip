import { Link, Outlet, useLocation } from 'react-router-dom';

export default function Layout() {
  const location = useLocation();
  
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
      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', paddingBottom: '80px' }}>
        <div className="glass-panel animate-fade-in" style={{ padding: '20px', minHeight: '80vh' }}>
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
          Home
        </Link>
        <Link to="/itinerary" style={getLinkStyle('/itinerary')}>
          <span style={{ fontSize: '1.2rem', marginBottom: '2px' }}>📅</span>
          Itinerary
        </Link>
        <Link to="/docs" style={getLinkStyle('/docs')}>
          <span style={{ fontSize: '1.2rem', marginBottom: '2px' }}>🗄️</span>
          Docs
        </Link>
        <Link to="/guidebook" style={getLinkStyle('/guidebook')}>
          <span style={{ fontSize: '1.2rem', marginBottom: '2px' }}>🗺️</span>
          Guidebook
        </Link>
      </div>
    </div>
  );
}
