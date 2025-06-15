import { Wheat } from 'lucide-react';
import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-green-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="bg-white rounded-full p-2">
                <Wheat className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold">AGROPEC</h3>
                <p className="text-green-200 text-sm">Feira Agropecuária</p>
              </div>
            </div>
            <p className="text-green-200">
              A maior feira agropecuária do Norte do Brasil
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Navegação</h4>
            <ul className="space-y-2 text-green-200">
              <li>
                <a href="#home" className="hover:text-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#sobre" className="hover:text-white transition-colors">
                  Sobre
                </a>
              </li>
              <li>
                <a href="#stands" className="hover:text-white transition-colors">
                  Stands
                </a>
              </li>
              <li>
                <a href="#programacoes" className="hover:text-white transition-colors">
                  Programações
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contato</h4>
            <ul className="space-y-2 text-green-200">
              <li>(11) 1234-5678</li>
              <li>contato@agropec.com.br</li>
              <li>São Paulo, Brasil</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Evento</h4>
            <ul className="space-y-2 text-green-200">
              <li>09 a 17 de Agosto</li>
              <li>2025</li>
              <li>Norte do Brasil</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-green-700 mt-8 pt-8 text-center text-green-200">
          <p>&copy; 2025 AGROPEC. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
