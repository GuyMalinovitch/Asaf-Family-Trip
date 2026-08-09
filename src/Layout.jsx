import { Link, Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
        <Outlet />
      </div>
      <div style={{ height: '60px', background: '#fff', borderTop: '1px solid #ccc', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
        <Link to="/">Home</Link>
        <Link to="/itinerary">Itinerary</Link>
        <Link to="/vault">Vault</Link>
        <Link to="/guidebook">Guidebook</Link>
      </div>
    </div>
  );
}
