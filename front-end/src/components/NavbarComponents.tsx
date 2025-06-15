import React, { useState } from "react";
import { Menu, X } from 'lucide-react';
import Navbaroptions from "./Navbaroptions";
import LogoComponent from "./LogoComponent";
import { useNavigate, useLocation } from 'react-router-dom';

export default function NavbarComponents() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const goToContato = () => {
    if (location.pathname === "/") {
      const contatoSection = document.getElementById('contato');
      if (contatoSection) {
        contatoSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate("/#contato");
    }
  };

  return (
    <header className="bg-green-600 shadow-lg pb-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">

          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-green-800 rounded-full p-2">
              <LogoComponent />
            </div>
            <div className="text-white">
              <h1 className="text-2xl font-bold">AGROPEC</h1>
              <p className="text-green-100 text-sm">Feira Agropecuária</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <Navbaroptions />

          {/* Botão de dúvidas */}
          <div className="hidden md:block">
            <button
              onClick={goToContato}
              className="bg-white text-green-600 px-6 py-2 rounded-full font-semibold hover:bg-green-50 transition-colors shadow-md"
            >
              Dúvidas?
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white hover:text-green-200 transition-colors"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-green-700 rounded-lg mb-4 p-4">
            <Navbaroptions
              classActive="text-white hover:text-green-200 transition-colors font-medium border-b-2 border-white pb-1"
              classInactive="text-green-100 hover:text-white transition-colors font-medium"
              ClassName="flex flex-col space-y-4"
            />
            <button
              onClick={() => {
                setIsMenuOpen(false);
                goToContato();
              }}
              className="bg-white text-green-600 px-6 py-2 rounded-full font-semibold hover:bg-green-50 transition-colors shadow-md w-full mt-4"
            >
              Dúvidas?
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
