// src/pages/StandsPage.tsx

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { allPins } from '../data/pinsData';
import { Search, Filter, Map } from 'lucide-react';

const itemsToShow = allPins.filter(pin => pin.category === 'stand' || pin.category === 'event');

export default function StandsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentFilter, setCurrentFilter] = useState('todos');
  const navigate = useNavigate();

  const filteredItems = useMemo(() => {
    let items = itemsToShow;
    if (currentFilter !== 'todos') {
      items = items.filter(item => item.category === currentFilter);
    }
    if (searchQuery.trim() !== '') {
      const lowercasedQuery = searchQuery.toLowerCase();
      items = items.filter(item =>
        item.title.toLowerCase().includes(lowercasedQuery) ||
        item.description.toLowerCase().includes(lowercasedQuery)
      );
    }
    return items;
  }, [searchQuery, currentFilter]);

  const handleFindOnMap = (pinId) => {
    navigate(`/mapa?pinId=${pinId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-8 md:mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-green-800">Expositores e Eventos</h1>
        <p className="mt-4 text-lg text-gray-700 max-w-2xl mx-auto">
          Conheça quem tá trazendo inovação, tecnologia e oportunidade pro agro.
        </p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md mb-8 flex flex-col md:flex-row gap-4 items-center sticky top-4 z-10">
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por nome ou descrição..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="relative w-full md:w-auto">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <select
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md appearance-none focus:ring-2 focus:ring-green-500"
            value={currentFilter}
            onChange={(e) => setCurrentFilter(e.target.value)}
          >
            <option value="todos">Todos</option>
            <option value="stand">Apenas Stands</option>
            <option value="event">Apenas Eventos</option>
          </select>
        </div>
      </div>

      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col">
              <img
                src={item.image || 'https://via.placeholder.com/400x200?text=Sem+Imagem'}
                alt={item.title}
                className="w-full h-48 object-cover rounded-t-xl"
              />
              <div className="p-4 flex flex-col flex-grow">
                <h2 className="text-xl font-semibold text-green-800">{item.title}</h2>
                <p className="text-sm text-gray-600 mb-4 mt-1 flex-grow">{item.description}</p>
                <button
                  onClick={() => handleFindOnMap(item.id)}
                  className="mt-auto w-full py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
                >
                  <Map size={18} />
                  Achar no Mapa
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-xl text-gray-500">Nenhum item encontrado.</p>
        </div>
      )}
    </div>
  );
}