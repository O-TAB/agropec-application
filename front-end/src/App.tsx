import React from 'react';
import NavbarComponents from './components/NavbarComponents';
import { Routes, Route } from 'react-router-dom';
import Mainpage from './pages/Mainpage';
import StandsPage from './pages/StandsPage';
import MapPage from './pages/MapPage';
import AdminLogin from "./pages/AdminLogin";
import AdminManagerPage from './pages/AdminManagerPage';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <>
      <NavbarComponents />
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/" element={<Mainpage />} />
        <Route path="/stands" element={<StandsPage />} />
        <Route path="/events" element={<h1>Programações</h1>} />
        <Route path="/mapa" element={<MapPage />} />
        <Route path="/login" element={<AdminLogin />} /> 
        
        <Route element={<ProtectedRoute />}>
          <Route path="/admin/gerenciar" element={<AdminManagerPage />} />
        </Route>
      </Routes>
    </>
  );
}
