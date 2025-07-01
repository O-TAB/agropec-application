import NavbarComponents from './components/NavbarComponents';
import { Routes, Route } from 'react-router-dom';
import Mainpage from './pages/Mainpage';
import StandsPage from './pages/StandsPage';
import MapPage from './pages/MapPage';
import Login from "./pages/Admin_pages/Login";
import AdminManagerPage from './pages/Admin_pages/AdminManagerPage';
import ProtectedRoute from './components/ProtectedRoute';
import CadastroUsuarioPage from './pages/Admin_pages/RegisterPage';
import EditUserPage from './pages/Admin_pages/EditUserPage';
import ManagerUsers from './pages/Admin_pages/ManagerUsers';
import SvgUploader from './pages/Admin_pages/SvgUploader';
import RegisterNewpoint from './pages/Admin_pages/RegisterNewpoint';
import RegisterNewStand from './pages/Admin_pages/RegisterNewStand';
import RegisterNewEvents from './pages/Admin_pages/RegisterNewEvents';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  return (
    <>
      <NavbarComponents />
      <Routes>
        {/* <Mainpage /> */}

        <Route path="/" element={<Mainpage />} />
        <Route path="/stands" element={<StandsPage />} />
        <Route path="/events" element={<h1>Programações</h1>} />
        <Route path="/mapa" element={<MapPage />} />
        <Route path="/login" element={<Login destination="/admin" />} />
        <Route path="/loginSuperadmin" element={<Login destination="/Users" />} />
      
        {/* Rotas Administrativas */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminManagerPage />
          </ProtectedRoute>
        }/>
        <Route path="/uploadmap" element={
          <ProtectedRoute>
            <SvgUploader/>
          </ProtectedRoute>
        }/>
        <Route path="/registerpoint" element={
          <ProtectedRoute>
            <RegisterNewpoint />
          </ProtectedRoute>
        }/>
        <Route path="/registerstand" element={
          <ProtectedRoute>
            <RegisterNewStand />
          </ProtectedRoute>
        }/>
        <Route path="/registerevents" element={
          <ProtectedRoute>
            <RegisterNewEvents />
          </ProtectedRoute>
        }/>
        <Route path="/cadastro" element={
          <ProtectedRoute>
            <CadastroUsuarioPage/>
          </ProtectedRoute>
        }/>
        <Route path="/edit-user/:userId" element={
          <ProtectedRoute>
            <EditUserPage/>
          </ProtectedRoute>
        }/>
        <Route path="/Users" element={
          <ProtectedRoute>
            <ManagerUsers/>
          </ProtectedRoute>
        }/>
          
      </Routes>

      <ToastContainer 
    position="top-right"
    autoClose={3000}
    hideProgressBar={false}
    newestOnTop
    closeOnClick
    pauseOnFocusLoss
    draggable
    pauseOnHover
    theme="colored"
  />
    </>
  );
}
