
import { useEffect, useState} from 'react';
import { Search, Filter} from 'lucide-react';

import { useFilteredItems } from '../functions/FilterData';
import ItemCard from '../components/ItemCard';
import DetailsPopup from '../components/DetailsPopup';
import { StandEventResponse } from '../data/ObjectStructures';
import { getMyObjectsStands, getMyObjectsEvent } from '../functions/persistence/api';

export default function StandsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentFilter, setCurrentFilter] = useState('todos');
  const [selectedItem, setSelectedItem] = useState<StandEventResponse | null>(null);
  const [allstands, setStands]= useState<StandEventResponse[]>([]);
  const [allevents, setEvents]= useState<StandEventResponse[]>([]);

  useEffect(() => {

    getMyObjectsStands().then((data) => setStands(data));
    getMyObjectsEvent().then((data) => setEvents(data));
  }, []);

  const StandsFiltrados = useFilteredItems(allstands, searchQuery);
  const EventosFiltrados = useFilteredItems(allevents, searchQuery);

  return (
    <>
      <div className="container mx-auto px-4 py-8 md:py-12 bg-gray-50">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-green-800">Expositores e Eventos</h1>
          <p className="mt-4 text-lg text-gray-700 max-w-2xl mx-auto">
            Conheça quem tá trazendo inovação, tecnologia e oportunidade pro agro.
          </p>
        </div>

        {/* Barra de busca e filtro */}
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
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md appearance-none focus:ring-2 focus:ring-green-500 bg-white"
              value={currentFilter}
              onChange={(e) => setCurrentFilter(e.target.value)}
            >
              <option value="todos">Todos</option>
              <option value="stand">Apenas Stands</option>
              <option value="event">Apenas Eventos</option>
            </select>
          </div>
        </div>

        {/* Seção de Expositores */}
        {(currentFilter === 'todos' || currentFilter === 'stand') && (
          <section id="expositores" className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 border-l-4 border-green-600 pl-4">Expositores</h2>
            {StandsFiltrados.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {StandsFiltrados.map((stand) => 
                    <ItemCard key={stand.id} item={stand} setSelectedPin={setSelectedItem} />
                )}
              </div>
            ) : (
              <p className="text-gray-500 pl-4">Nenhum expositor encontrado para sua busca.</p>
            )}
          </section>
        )}

        {/* Seção de Eventos */}
        {(currentFilter === 'todos' || currentFilter === 'event') && (
          <section id="eventos">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 border-l-4 border-purple-600 pl-4">Eventos</h2>
            {EventosFiltrados.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {EventosFiltrados.map((item) => <ItemCard key={item.id} item={item} setSelectedPin={setSelectedItem} />)}
              </div>
            ) : (
              <p className="text-gray-500 pl-4">Nenhum evento encontrado para sua busca.</p>
            )}
          </section>
        )}
      </div>

      {selectedItem && (
        <DetailsPopup 
          itemData={selectedItem} 
          onClose={() => setSelectedItem(null)} 
          isLoading={false}
        />
      )}
    </>
  );
}