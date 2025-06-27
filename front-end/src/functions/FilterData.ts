import { useMemo } from 'react';
import { StandEventResponse } from '../data/ObjectStructures';


const normalizeText = (text = '') => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export const useFilteredItems = (pins: StandEventResponse[],searchQuery: string) => {
 const filteredItems = useMemo(() => {
    if (searchQuery.trim() !== '') {
        const lowercasedQuery = normalizeText(searchQuery);
        return pins.filter(pin =>
            normalizeText(pin.name).includes(lowercasedQuery) ||
            normalizeText(pin.description).includes(lowercasedQuery)
        );
    }
    return pins;
  }, [pins, searchQuery]);
    
  return filteredItems;
}
