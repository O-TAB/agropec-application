
import { Clock, X } from 'lucide-react';
import { StandEventResponse } from '../data/ObjectStructures';

interface DetailsPopupProps {
  itemData: StandEventResponse | null;
  isLoading: boolean;
  onClose: () => void;
}

const DetailsOnMap: React.FC<DetailsPopupProps> = ({ itemData, isLoading, onClose }) => {

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-800"></div>
          </div>
        )}

        {!isLoading && !itemData && (
          <div className="p-6 text-center text-gray-500">
            Não foi possível carregar os detalhes.
          </div>
        )}

        {!isLoading && itemData && (
          <>
            <img 
              src={itemData.img || 'https://via.placeholder.com/400x200?text=Sem+Imagem'} 
              alt={itemData.name} 
              className="w-full h-64 object-cover" 
            />
            <div className="p-6 overflow-y-auto">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">{itemData.name}</h2>
              <p className="text-gray-600 text-base leading-relaxed mb-6">{itemData.description}</p>
              {itemData.date && (
                <div className="flex items-center text-gray-700 bg-gray-100 p-3 rounded-lg">
                  <Clock size={20} className="mr-3 text-gray-500"/>
                  <strong>Abertura:</strong>
                  <span className="ml-2">{itemData.date}</span>
                </div>
              )}
            </div>
          </>
        )}

        <div className="p-4 bg-gray-50 border-t flex justify-between items-center">
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

export default DetailsOnMap;