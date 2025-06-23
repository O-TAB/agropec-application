import { useMemo } from 'react';
import { allPins } from '../data/pinsData';


// marcado para concertar
//
//
//


const normalizeText = (text = '') => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export const useFilteredItems = (searchQuery: string, currentFilter: string) => {
  // Filtra os itens com base na categoria e na consulta de pesquisa
 const filteredItems = useMemo(() => {
            let items = allPins.filter(pin => pin.category === 'stand' || pin.category === 'event');
            if (currentFilter !== 'todos') {
                items = items.filter(item => item.category === currentFilter);
            }
            if (searchQuery.trim() !== '') {
                const lowercasedQuery = normalizeText(searchQuery);
                items = items.filter(item =>
                    normalizeText(item.title).includes(lowercasedQuery) ||
                    normalizeText(item.description).includes(lowercasedQuery)
                );
            }
            return items;
  }, [searchQuery, currentFilter]);
    
  return filteredItems;
}
//   const expositoresFiltrados = filteredItems.filter(item => item.category === 'stand');
//   const eventosFiltrados = filteredItems.filter(item => item.category === 'event');