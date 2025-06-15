import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Pages
import Mainpage from './pages/Mainpage';
import Aboutpage from './pages/Aboutpage';
import StandsPage from './pages/StandsPage';
import MapPage from "./pages/MapPage";

// Components
import NavbarComponents from './components/NavbarComponents';
import Footer from '../src/components/Footer';

function App() {
  return (
    <main className="App flex flex-col min-h-screen">
      <NavbarComponents />

      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Mainpage />} />
          <Route path="/about" element={<Aboutpage />} />
          <Route path="/stands" element={<StandsPage />} />
          <Route path="/events" element={<h1>Programações</h1>} />
          <Route path="/map" element={<MapPage />} />
        </Routes>
      </div>

      <Footer />
    </main>
  );
}

export default App;
