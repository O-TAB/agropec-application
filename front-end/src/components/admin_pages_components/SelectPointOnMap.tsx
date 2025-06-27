import React, { useState } from 'react';
import { Map, X } from "lucide-react";
import { point, ResponsePoint} from '../../data/ObjectStructures'; 
import Mapa from '../../assets/MAPA-A1.svg';

interface params {
  setShowMapModal: React.Dispatch<React.SetStateAction<boolean>>;
  setNewPoint: React.Dispatch<React.SetStateAction<ResponsePoint | point>>; // <-- nome e tipo corrigidos
  allpoints: ResponsePoint[];
}

const SelectPointOnMap: React.FC<params> = ({ setShowMapModal, setNewPoint, allpoints }) => {
  const [selectedPosition, setSelectedPosition] = useState<{ x: number, y: number } | null>(null);
  //tamanho do mapa original em pixels
  const ORIGINAL_MAP_WIDTH = 3508;
  const ORIGINAL_MAP_HEIGHT = 2481;


  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Converter coordenadas relativas para coordenadas absolutas do mapa
    const absoluteX = Math.round((x / rect.width) * ORIGINAL_MAP_WIDTH);
    const absoluteY = Math.round((y / rect.height) * ORIGINAL_MAP_HEIGHT);

    setSelectedPosition({ x: absoluteX, y: absoluteY });
  };

  const confirmPosition = () => {
    if (selectedPosition) {
      // mexi aqui (sofia)
      setNewPoint(currentItem => ({
          ...currentItem, 
          x: selectedPosition.x, 
          y: selectedPosition.y, 
      }));
      setShowMapModal(false);
      setSelectedPosition(null);
    }
  };

  const cancelPositionSelection = () => {
    setShowMapModal(false);
    setSelectedPosition(null);
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Map size={20} />
            Escolher Posição no Mapa
          </h3>
          <button
            onClick={cancelPositionSelection}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 flex-1 overflow-hidden">
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Instruções:</strong> Clique no mapa para selecionar a posição do item.
              As coordenadas serão automaticamente calculadas.
            </p>
          </div>

          <div className="relative w-full border border-gray-300 rounded-lg shadow-lg overflow-hidden">
            <div
              className="relative w-full aspect-[3508/2481] cursor-crosshair"
              onClick={handleMapClick}
            >
              <img src={Mapa} alt="Mapa do Evento" className="w-full h-full" />

              {/* Mostrar posição selecionada */}
              {selectedPosition && (
                <div
                  className="absolute w-4 h-4 bg-red-500 border-2 border-white rounded-full shadow-lg transform -translate-x-1/2 -translate-y-1/2 animate-pulse"
                  style={{
                    left: `${(selectedPosition.x / ORIGINAL_MAP_WIDTH) * 100}%`,
                    top: `${(selectedPosition.y / ORIGINAL_MAP_HEIGHT) * 100}%`
                  }}
                />
              )}

              {/* Mostrar todos os pins existentes para referência */}
              {allpoints.map((point) => (
                <div
                  key={point.id}
                  className={`absolute w-2 h-2 rounded-full border border-white shadow-sm ${point.typePoint === 'stand' ? 'bg-red-400' :
                      point.typePoint === 'event' ? 'bg-purple-400' : 'bg-green-400'
                    }`}
                  style={{
                    left: `${(point.x / ORIGINAL_MAP_WIDTH) * 100}%`,
                    top: `${(point.y / ORIGINAL_MAP_HEIGHT) * 100}%`
                  }}
                  title={point.name}
                />
              ))}
            </div>
          </div>

          {selectedPosition && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700">
                <strong>Posição selecionada:</strong> X: {selectedPosition.x}, Y: {selectedPosition.y}
              </p>
            </div>
          )}
        </div>

        <div className="p-4 bg-gray-50 border-t flex justify-end gap-3">
          <button
            onClick={cancelPositionSelection}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={confirmPosition}
            disabled={!selectedPosition}
            className={`px-4 py-2 rounded-lg transition-colors ${selectedPosition
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
          >
            Confirmar Posição
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectPointOnMap;