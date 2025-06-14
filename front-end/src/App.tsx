import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Mainpage from './pages/Mainpage';
import Aboutpage from './pages/Aboutpage';
import StandsPage from './pages/StandsPage';
import MapPage from "./pages/MapPage";

// components
import NavbarComponents from './components/NavbarComponents';



function App() {
  
  return (
    <main className="App">
      <NavbarComponents/>
      <Routes>
        {/* Define suas rotas aqui */}
        <Route path="/" element={<Mainpage/>} />
        <Route path="/about" element={<Aboutpage/>} />
        <Route path="/stands" element={<StandsPage/>} />
        <Route path="/events" element={<h1>Programações</h1>} />
        <Route path="/map" element={<MapPage />} />
      </Routes>
    </main>

  );
}

export default App;