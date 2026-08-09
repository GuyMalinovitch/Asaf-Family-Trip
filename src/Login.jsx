import { useState } from 'react';

export default function Login({ onLogin }) {
  const [pwd, setPwd] = useState('');
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pwd === '12345678') {
      onLogin(true);
    } else {
      setError('Incorrect password');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      setPwd('');
    }
  };

  return (
    <div 
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        backgroundImage: 'linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.4)), url("/bg-resort.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div 
        className="glass-panel animate-fade-in" 
        style={{
          width: '100%',
          maxWidth: '400px',
          padding: '40px 30px',
          textAlign: 'center',
          transform: isShaking ? 'translateX(5px)' : 'translateX(0)',
          transition: isShaking ? 'transform 0.1s ease-in-out' : 'none'
        }}
      >
        <div style={{ fontSize: '48px', marginBottom: '10px' }}>☀️🏝️</div>
        
        <h1 style={{ 
          color: 'var(--text-light)', 
          fontWeight: '800', 
          fontSize: '2rem',
          marginBottom: '5px',
          textShadow: '0 2px 4px rgba(0,0,0,0.3)'
        }}>
          Asaf Family Trip
        </h1>
        
        <p style={{ 
          color: 'rgba(255,255,255,0.9)', 
          marginBottom: '30px',
          fontSize: '1.1rem'
        }}>
          Enter the family password to unlock the itinerary!
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <input 
              type="password" 
              value={pwd} 
              onChange={(e) => {
                setPwd(e.target.value);
                if (error) setError('');
              }} 
              placeholder="Family Password" 
              className="glass-input"
              style={{ textAlign: 'center', letterSpacing: pwd ? '4px' : 'normal' }}
            />
            {error && (
              <p style={{ 
                color: '#ff6b6b', 
                marginTop: '10px', 
                fontSize: '0.9rem',
                fontWeight: '600',
                background: 'rgba(255,255,255,0.9)',
                padding: '4px 8px',
                borderRadius: '8px',
                display: 'inline-block'
              }}>
                {error}
              </p>
            )}
          </div>
          
          <button type="submit" className="btn-primary" style={{ width: '100%' }}>
            Let's Go! 🚀
          </button>
        </form>
      </div>
    </div>
  );
}
