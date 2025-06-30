import React, { useEffect, useState, useRef } from 'react';
import { Map, X } from "lucide-react";
import { point, ResponsePoint } from '../../data/ObjectStructures';
import { getMapById } from '../../functions/persistence/api';
import { getSvgDimensions } from '../../functions/SvgDimensionReader';
import { TransformWrapper, TransformComponent, ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';

interface params {
  setShowMapModal: React.Dispatch<React.SetStateAction<boolean>>;
  setNewPoint: (point: point) => void;
  currentpoint: point;
  allpoints: ResponsePoint[];
  idmap: string;
}

const SelectPointOnMap: React.FC<params> = ({ setShowMapModal, setNewPoint, currentpoint, allpoints, idmap }) => {
  const [selectedPosition, setSelectedPosition] = useState<point | null>(null);
  const [mapSvg, setMapSvg] = useState<string | null>(null);
  const [mapDimensions, setMapDimensions] = useState<{ width: number; height: number; minX: number; minY: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const transformWrapperRef = useRef<ReactZoomPanPinchRef | null>(null);

  useEffect(() => {
    if (currentpoint && (currentpoint.x !== 0 || currentpoint.y !== 0)) {
      setSelectedPosition(currentpoint);
    } else {
      setSelectedPosition(null);
    }
  }, [currentpoint]);

  useEffect(() => {
    const fetchMap = async () => {
      setLoading(true);
      setError(null);
      try {
        const map = await getMapById(idmap);
        if (map && map.svg) {
          setMapSvg(map.svg);
          const dimensions = getSvgDimensions(map.svg);
          setMapDimensions(dimensions);
        } else {
          setError('Mapa não encontrado ou sem SVG.');
        }
      } catch (err: any) {
        setError('Erro ao buscar o mapa.');
      }
      setLoading(false);
    };
    if (idmap) fetchMap();
  }, [idmap]);

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapDimensions || !transformWrapperRef.current) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const { scale, positionX, positionY } = transformWrapperRef.current.state;

    const contentX = (e.clientX - rect.left - positionX) / scale;
    const contentY = (e.clientY - rect.top - positionY) / scale;

    const newPointData: point = {
      ...currentpoint, 
      x: Math.round(contentX),
      y: Math.round(contentY)
    };
    
    setSelectedPosition(newPointData);
    setNewPoint(newPointData);
  };

  const confirmPosition = () => {
    if (selectedPosition) {
      setNewPoint(selectedPosition);
    }
    setShowMapModal(false);
  };

  const cancelPositionSelection = () => {
    setNewPoint(currentpoint);
    setShowMapModal(false);
  };

  if (loading) { return ( <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4"><div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden justify-center items-center p-8"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-800 mb-4"></div><p className="text-green-800">Carregando mapa...</p></div></div> ); }
  if (error || !mapSvg || !mapDimensions) { return ( <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4"><div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden justify-center items-center p-8"><p className="text-red-600 font-bold">{error || 'Erro ao carregar o mapa.'}</p></div></div> ); }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2"> <Map size={20} /> Escolher Posição no Mapa </h3>
          <button onClick={cancelPositionSelection} className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"> <X size={20} /> </button>
        </div>
        <div className="p-4 flex-1 overflow-hidden">
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg"> <p className="text-sm text-blue-700"> <strong>Instruções:</strong> Clique no mapa para selecionar a posição do item. Use o zoom e arraste para navegar. </p> </div>
          <div className="relative w-full border border-gray-300 rounded-lg shadow-lg overflow-hidden">
            {mapDimensions && (
              <div className="relative w-full" style={{ aspectRatio: `${mapDimensions.width} / ${mapDimensions.height}` }}>
                <TransformWrapper ref={transformWrapperRef} initialScale={1} minScale={0.5} maxScale={8} wheel={{ step: 0.1 }} doubleClick={{ disabled: false }}>
                  <TransformComponent wrapperClass="!w-full !h-full" contentClass="!w-full !h-full">
                    <div style={{ width: mapDimensions.width, height: mapDimensions.height, position: 'relative' }} className="cursor-crosshair" onClick={handleMapClick} >
                      <div style={{ width: mapDimensions.width, height: mapDimensions.height, }} dangerouslySetInnerHTML={{ __html: mapSvg || '' }} />
                      <div style={{ position: 'absolute', top: 0, left: 0, width: mapDimensions.width, height: mapDimensions.height, pointerEvents: 'none', }} >
                        {selectedPosition && ( <div className="absolute w-4 h-4 bg-red-500 border-2 border-white rounded-full shadow-lg transform -translate-x-1/2 -translate-y-1/2 animate-pulse" style={{ left: `${selectedPosition.x}px`, top: `${selectedPosition.y}px`, pointerEvents: 'auto', }} /> )}
                        {allpoints.map((point) => ( <div key={point.id} className={`absolute w-2 h-2 rounded-full border border-white shadow-sm bg-gray-400 opacity-50`} style={{ left: `${point.x}px`, top: `${point.y}px`, }} title={point.name} /> ))}
                      </div>
                    </div>
                  </TransformComponent>
                </TransformWrapper>
              </div>
            )}
          </div>
          {selectedPosition && ( <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg"> <p className="text-sm text-green-700"> <strong>Posição selecionada:</strong> X: {selectedPosition.x}, Y: {selectedPosition.y} </p> </div> )}
        </div>
        <div className="p-4 bg-gray-50 border-t flex justify-end gap-3">
          <button onClick={cancelPositionSelection} className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"> Cancelar </button>
          <button onClick={confirmPosition} disabled={!selectedPosition} className={`px-4 py-2 rounded-lg transition-colors ${selectedPosition ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}> Confirmar Posição </button>
        </div>
      </div>
    </div>
  );
};
export default SelectPointOnMap;