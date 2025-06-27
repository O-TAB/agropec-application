// src/components/DetailsPopup.tsx

import { Link } from 'react-router-dom';
import { Map, Clock, X } from 'lucide-react';
import { StandEventResponse } from '../data/ObjectStructures';
interface DetailsPopupProps {
  itemData: StandEventResponse | null;
  onClose: () => void;
  imageMap: { [key: string]: string };
}

const DetailsPopup: React.FC<DetailsPopupProps> = ({ itemData, onClose, imageMap }) => {
  if (!itemData) return null;

  const imageSrc = imageMap[itemData.img] || 'https://via.placeholder.com/400x200?text=Sem+Imagem';

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <img src={imageSrc} alt={itemData.name} className="w-full h-64 object-cover" />

        <div className="p-6 overflow-y-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">{itemData.name}</h2>
          <p className="text-gray-600 text-base leading-relaxed mb-6">{itemData.description}</p>
          
          {itemData.Date && (<div className="flex items-center text-gray-700 bg-gray-100 p-3 rounded-lg">
            <Clock size={20} className="mr-3 text-gray-500"/>
            <strong>Abertura:</strong>
            <span className="ml-2">{itemData.Date}</span>
          </div>)}
        </div>

        <div className="p-4 bg-gray-50 border-t flex justify-between items-center">
          <Link
            to={`/mapa?pinId=${itemData.id}`}
            className="inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors gap-2"
          >
            <Map size={18} />
            Achar no Mapa
          </Link>
          <button 
            onClick={onClose} 
            className="inline-flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors gap-2"
          >
            <X size={18} />
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailsPopup;