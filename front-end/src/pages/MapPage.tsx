import { useState, useRef, useEffect } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import { MapPin, Target } from "lucide-react";
import type { ReactZoomPanPinchRef } from "react-zoom-pan-pinch";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import DetailsPopup from '../components/DetailsPopup';
import { getSvgDimensions } from "../functions/SvgDimensionReader";
import { ResponsePoint, StandEventResponse, Map, FILTER_CONFIG } from "../data/ObjectStructures";
import { getFirstMapId, getMapById, getMypoints, getDetailsById } from "../functions/persistence/api";
import MapOverlay from "../components/admin_pages_components/MapOverlay";
import DetailsOnMap from "../components/DetailsOnMap";

export default function MapPage() {
  const transformWrapperRef = useRef<ReactZoomPanPinchRef | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [visiblePins, setVisiblePins] = useState<ResponsePoint[]>([]);
  const [searchParams] = useSearchParams();
  const [currentMap, setCurrentMap] = useState<Map | null>(null);
  const [allPins, setAllPins] = useState<ResponsePoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapDimensions, setMapDimensions] = useState<{ width: number; height: number; minX: number; minY: number } | null>(null);
  const [selectedPinId, setSelectedPinId] = useState<number | null>(null);
  const [popupData, setPopupData] = useState<StandEventResponse | null>(null);
  const [isPopupLoading, setIsPopupLoading] = useState(false);
  const { mapId } = useParams<{ mapId: string }>();
  const [showFilterBox, setShowFilterBox] = useState(false);

  const loadMap = async (targetMapId: string) => {
    try {
      const map = await getMapById(targetMapId);
      if (map) {
        setCurrentMap(map);
        const dimensions = getSvgDimensions(map.svg);
        setMapDimensions(dimensions);
      } else { setError("Mapa não encontrado"); }
    } catch (err: any) { console.error("Erro ao carregar mapa:", err); setError("Erro ao carregar mapa"); }
  };

  const loadPoints = async (targetMapId: string) => {
    try {
      const points = await getMypoints(targetMapId);
      setAllPins(points);
    } catch (err: any) { console.error("Erro ao carregar pontos:", err); setError("Erro ao carregar pontos"); }
  };

  useEffect(() => {
    const loadMapData = async () => {
      setLoading(true);
      setError(null);
      let targetMapId = mapId;
      try {
        if (!targetMapId) { targetMapId = await getFirstMapId(); }
        if (!targetMapId) {
            setError("Nenhum mapa disponível"); setLoading(false); return;
        }
      } catch (err: any) {
          setError("Erro ao buscar mapas"); setLoading(false); return;
      }
      await Promise.all([ loadMap(targetMapId), loadPoints(targetMapId) ]);
      setLoading(false);
    };
    loadMapData();
  }, [mapId]);

  useEffect(() => {
    if (activeCategory === null) {
      setVisiblePins(allPins);
    } else {
      const filteredPins = allPins.filter(pin => pin.typePoint === activeCategory);
      setVisiblePins(filteredPins);
    }
  }, [activeCategory, allPins]);

  const handleClosePopup = () => {
    setSelectedPinId(null);
    setPopupData(null);
    setIsPopupLoading(false);
  };

  const handleShowPins = (category: string | null) => {
    setActiveCategory(category);
    handleClosePopup(); 
    if (category === null && transformWrapperRef.current) {
      transformWrapperRef.current.resetTransform(600, "easeOut");
    }
  };

  const handlePinClick = async (pinId: number) => {
    if (pinId === selectedPinId) return;
    const pin = allPins.find(p => p.id === pinId);
    if (!pin) return;

    setSelectedPinId(pinId);
    setIsPopupLoading(true);
    setPopupData(null); 

    console.log(pin.typePoint);
    const details = await getDetailsById(pinId, pin.typePoint);

    setPopupData(details);
    setIsPopupLoading(false);
    
  };
  
  useEffect(() => { 
    if (allPins.length === 0) return;
    const pinIdFromUrlParam = searchParams.get('pinId');
    if (!pinIdFromUrlParam) return;

    const pinIdFromUrl = Number(pinIdFromUrlParam);
    const pinToFocus = allPins.find(p => p.id === pinIdFromUrl);
    
    if (pinToFocus) {
      setActiveCategory(pinToFocus.typePoint);
      handlePinClick(pinToFocus.id);
      setTimeout(() => {
        if (transformWrapperRef.current) {
          transformWrapperRef.current.zoomToElement(`pin-${pinToFocus.id}`, 2.5, 800, "easeOut"); 
        }
      }, 300);
    }
  }, [searchParams, allPins]); 
  
  if (loading) { return <div className="text-center p-10">Carregando...</div>; }
  if (error) { return <div className="text-center p-10 text-red-600">{error}</div>; }
  if (!currentMap || !mapDimensions) { return <div className="text-center p-10">Nenhum mapa disponível</div>; }

  return (
    <>
      <div className="flex justify-center mt-4 md:mt-10 px-4">
        <div className="bg-yellow-50 rounded-2xl shadow-lg p-4 md:p-6 w-full h-full">
          
          <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
            <MapPin className="w-7 h-7 md:w-8 md:h-8 text-green-800" />
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-green-800">
              {currentMap.name}
            </h1>
          </div>
          <p className="text-sm text-green-700 italic mb-4">
            Selecione um filtro para explorar ou dê um zoom para melhor visualização.
          </p>
          <div className="relative mb-6 flex justify-center">
  <button
    onClick={() => setShowFilterBox(!showFilterBox)}
    className="flex items-center gap-2 px-5 py-2 bg-green-600 text-white rounded-full shadow-md hover:bg-green-700 transition-all"
  >
    <MapPin className="w-5 h-5" />
    {activeCategory ? FILTER_CONFIG[activeCategory as keyof typeof FILTER_CONFIG]?.label : "Filtrar por categoria"}
    <svg
      className={`w-4 h-4 transform transition-transform duration-200 ${showFilterBox ? 'rotate-180' : ''}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none" viewBox="0 0 24 24" stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  </button>

  {showFilterBox && (
    <div className="absolute z-10 mt-14 w-full max-w-2xl bg-white rounded-xl shadow-xl border border-gray-200 p-4 grid grid-cols-2 md:grid-cols-3 gap-3">
      {Object.entries(FILTER_CONFIG).map(([type, config]) => {
        const isActive = activeCategory === type;
        return (
          <button
            key={type}
            onClick={() => {
              handleShowPins(isActive ? null : type);
              setShowFilterBox(false);
            }}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
              ${isActive
                ? `${config.color} text-white`
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"}
            `}
          >
            <span>{config.icon}</span>
            <span>{config.label}</span>
          </button>
        );
      })}
      <button
        onClick={() => {
          handleShowPins(null);
          setShowFilterBox(false);
        }}
        className="col-span-full mt-2 px-3 py-2 rounded-lg bg-gray-300 text-gray-800 hover:bg-gray-400 text-sm font-medium transition"
      >
        ❌ Limpar Filtro
      </button>
    </div>
  )}
</div>

          <div className="w-full h-full border border-gray-300 rounded-lg shadow-lg overflow-hidden relative">
            {mapDimensions && (
              <div
                className="relative w-full"
                style={{ aspectRatio: `${mapDimensions.width} / ${mapDimensions.height}` }}
              >
                <TransformWrapper ref={transformWrapperRef} initialScale={1} minScale={0.5} maxScale={8} limitToBounds={false}>
                  <TransformComponent wrapperClass="!w-full !h-full" contentClass="!w-full !h-full">
                    <MapOverlay
                      svg={currentMap.svg}
                      pins={allPins}
                      visiblePins={visiblePins}
                      mapDimensions={mapDimensions}
                      onPinClick={handlePinClick}
                    />
                  </TransformComponent>
                </TransformWrapper>
                <button
                  aria-label="Centralizar Mapa"
                  className="absolute bottom-4 right-4 z-20 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                  onClick={() => {
                    if (transformWrapperRef.current) {
                      transformWrapperRef.current.resetTransform();
                    }
                  }}
                >
                  <Target className="w-5 h-5" />
                  <span className="hidden md:inline">Centralizar Mapa</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {selectedPinId && (
        <DetailsOnMap
          isLoading={isPopupLoading}
          itemData={popupData}
          onClose={handleClosePopup}
        />
      )}
    </>
  );
}