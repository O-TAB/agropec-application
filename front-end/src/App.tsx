import React from 'react';
import NavbarComponents from './components/NavbarComponents';
import { Routes, Route } from 'react-router-dom';
import Mainpage from './pages/Mainpage';
import StandsPage from './pages/StandsPage';
import MapPage from './pages/MapPage';
import AdminLogin from "./pages/AdminLogin";
import AdminManagerPage from './pages/AdminManagerPage';
import ProtectedRoute from './components/ProtectedRoute';
import CadastroUsuarioPage from './pages/Cadastropage';
import SuperAdminPage from './pages/SuperAdmin';
import LoginSuperAdmin from './pages/LoginSuperAdmin';


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
        <Route path="/cadastro" element={<CadastroUsuarioPage/>}/>
        <Route path="superadmin" element={<SuperAdminPage/>} /> 
        <Route path="loginadmin" element={<LoginSuperAdmin/>} />
      
        
        <Route path="/gerenciar" element={
          <ProtectedRoute>
            <AdminManagerPage />
          </ProtectedRoute>
        }/>
          
      </Routes>
    </>
  );
}
