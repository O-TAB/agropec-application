import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Note que BrowserRouter não é mais importado aqui
import Mainpage from './pages/Mainpage';
import Aboutpage from './pages/Aboutpage';
import StandsPage from './pages/StandsPage';
import MapPage from "./pages/MapPage";
import NavbarComponents from './components/NavbarComponents';

function App() {
  return (
    <main className="App">
      <NavbarComponents/>
      <Routes>
        <Route path="/" element={<Mainpage/>} />
        <Route path="/about" element={<Aboutpage/>} />
        <Route path="/stands" element={<StandsPage/>} />
        <Route path="/events" element={<h1>Programações</h1>} />
        <Route path="/mapa" element={<MapPage />} />
      </Routes>
    </main>
  );
}

export default App;