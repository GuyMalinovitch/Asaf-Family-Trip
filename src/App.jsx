import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Home from './Home';
import ProtectedRoute from './ProtectedRoute';
import Layout from './Layout';
import Itinerary from './Itinerary';
import Guidebook from './Guidebook';
import Docs from './Docs';

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
                  <Route path="/itinerary" element={<Itinerary />} />
                  <Route path="/docs" element={<Docs />} />
                  <Route path="/guidebook" element={<Guidebook />} />
                </Route>
              </Routes>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

