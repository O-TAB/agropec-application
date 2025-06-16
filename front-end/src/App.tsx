import React from 'react';
import NavbarComponents from './components/NavbarComponents';
import { Routes, Route } from 'react-router-dom';
import Mainpage from './pages/Mainpage';
import StandsPage from './pages/StandsPage';
import MapPage from './pages/MapPage';
import AdminLogin from "./pages/AdminLogin";


// import AdminLogin from './pages/AdminLogin'; // Só descomente se esse arquivo existir mesmo

export default function App() {
  return (
    <>
      <NavbarComponents />
      <Routes>
        <Route path="/" element={<Mainpage />} />
        <Route path="/stands" element={<StandsPage />} />
        <Route path="/events" element={<h1>Programações</h1>} />
        <Route path="/mapa" element={<MapPage />} />
        <Route path="/login" element={<AdminLogin />} /> 
      </Routes>
    </>
  );
}
