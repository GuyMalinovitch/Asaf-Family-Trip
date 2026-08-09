import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Home from './Home';
import ProtectedRoute from './ProtectedRoute';
import Layout from './Layout';

export default function App() {
  const [auth, setAuth] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={auth ? <Navigate to="/" replace /> : <Login onLogin={setAuth} />}
        />
        <Route
          path="/*"
          element={
            <ProtectedRoute auth={auth}>
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/itinerary" element={<h2>Itinerary Calendar</h2>} />
                  <Route path="/vault" element={<h2>Logistics Vault</h2>} />
                  <Route path="/guidebook" element={<h2>Guidebook & Maps</h2>} />
                </Route>
              </Routes>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

