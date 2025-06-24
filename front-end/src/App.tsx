
import NavbarComponents from './components/NavbarComponents';
import { Routes, Route } from 'react-router-dom';
import Mainpage from './pages/Mainpage';
import StandsPage from './pages/StandsPage';
import MapPage from './pages/MapPage';
import Login from "./pages/Admin_pages/Login";
import AdminManagerPage from './pages/AdminManagerPage';
import ProtectedRoute from './components/ProtectedRoute';
import CadastroUsuarioPage from './pages/Admin_pages/RegisterPage';
import ManagerUsers from './pages/Admin_pages/ManagerUsers';


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
        <Route path="/login" element={<Login destination="/gerenciar" />} />
        <Route path="/loginSuperadmin" element={<Login destination="/Users" />} />
      
        
        <Route path="/gerenciar" element={
          <ProtectedRoute>
            <AdminManagerPage />
          </ProtectedRoute>
        }/>
        <Route path="/cadastro" element={
          <ProtectedRoute>
            <CadastroUsuarioPage/>
          </ProtectedRoute>
        }/>
        <Route path="/Users" element={
          <ProtectedRoute>
            <ManagerUsers/>
          </ProtectedRoute>
        }/>
          
      </Routes>
    </>
  );
}
