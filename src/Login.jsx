import { useState } from 'react';

export default function Login({ onLogin }) {
  const [pwd, setPwd] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pwd === '12345678') {
      onLogin(true);
    } else {
      setError('Incorrect password');
    }
  };

  return (
    <div className="login-container" style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Asaf Family Trip</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          placeholder="Family Password"
        />
        <button type="submit">Enter</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
