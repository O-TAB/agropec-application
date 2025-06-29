//bibliotecas externas
import { useState, useRef, useEffect } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import { MapPin } from "lucide-react";
import type { ReactZoomPanPinchRef } from "react-zoom-pan-pinch";
import { TransformWrapper, TransformComponent, useTransformContext } from "react-zoom-pan-pinch";
//Utilitarios
import EventPopup from '../components/EventPopup';
import { getSvgDimensions } from "../functions/SvgDimensionReader";

//estruturas
import { ResponsePoint, 
         Map, 
         FILTER_CONFIG
        } from "../data/ObjectStructures";
import { clearPointsCache, getFirstMapId, getMapById, getMypoints } from "../functions/persistence/api";
import { SvgDimensions } from '../functions/SvgDimensionReader';
import { FC } from 'react';
import MapOverlay from "../components/admin_pages_components/MapOverlay";


export default function MapPage() {
  const transformWrapperRef = useRef<ReactZoomPanPinchRef | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [visiblePins, setvisiblepins] = useState<ResponsePoint[]>([]);
  const [searchParams] = useSearchParams();

  //new 
  // Estados para dados da API
  const [currentMap, setCurrentMap] = useState<Map | null>(null);
  const [allPins, setAllPins] = useState<ResponsePoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapDimensions, setMapDimensions] = useState<{ width: number; height: number; minX: number; minY: number } | null>(null);

  //[PARQUEDIVERSAO, ESPACORACKATON, BANHEIROS, ESPACOPALESTRA, ESPACOSHOW, EMERGENCIA, RESTAURANTE]
  // preparação para o futuro: lógica para obter o id do mapa dinamicamente da url
  const { mapId } = useParams<{ mapId: string }>();
  
  const loadMap = async (targetMapId: string) => {
    try {
      const map = await getMapById(targetMapId);
      if (map) {
        setCurrentMap(map);
        // Calcular dimensões do SVG
        const dimensions = getSvgDimensions(map.svg);
        setMapDimensions(dimensions);
      } else {
        setError("Mapa não encontrado");
      }
    } catch (err: any) {
      console.error("Erro ao carregar mapa:", err);
      setError("Erro ao carregar mapa");
    }
  };

  // Função para carregar os pontos
  const loadPoints = async (targetMapId: string) => {
    try {
      // Limpa o cache para forçar recarregamento
      clearPointsCache();
      const points = await getMypoints(targetMapId);
      console.log('Pontos carregados:', points);
      console.log('Tipo dos pontos:', points.map(p => ({ id: p.id, name: p.name, typePoint: p.typePoint })));
      setAllPins(points);
      setvisiblepins(points);
    } catch (err: any) {
      console.error("Erro ao carregar pontos:", err);
      setError("Erro ao carregar pontos");
    }
  };

  // Efeito para carregar dados quando o componente monta ou mapId muda
  useEffect(() => {
    const loadMapData = async () => {
      setLoading(true);
      setError(null);

      let targetMapId = mapId;
      // Se não há mapId na URL, busca o primeiro mapa disponível
      try{
        if (!targetMapId){
          targetMapId =  await getFirstMapId();
        } else {
          setError("Nenhum mapa disponível");
          setLoading(false);
          return;
        }
      } catch (err: any) {
          console.error("Erro ao buscar mapas:", err);
          setError("Erro ao buscar mapas");
          setLoading(false);
          return;
      }
      // Carrega mapa e pontos em paralelo
      await Promise.all([
        loadMap(targetMapId),
        loadPoints(targetMapId)
      ]);

      setLoading(false);
    };

    loadMapData();
  }, [mapId]);

  /*
   efeito para buscar os pins da api assim que o componente é montado
   atualmente, usa um id de mapa fixo para desenvolvimento
   no futuro, quando o id for dinâmico (via useparams), a requisição se tornará
   dependente da variável 'mapid', e o array de dependências deverá ser [mapid]
   */


  // função para atualizar a categoria ativa e limpar qualquer evento selecionado
  const handleShowPins = (category:string | null) => {
    setActiveCategory(category);
  };
  
  // efeito para focar em um pin específico quando o id é passado via url 
  useEffect(() => {
    // garante que o código só execute após os pins serem carregados da api
    if (allPins.length === 0) return; 

    const pinIdFromUrl = searchParams.get('pinId');// para pegar id do pin caso exita
    if (pinIdFromUrl && transformWrapperRef.current) {
      const pinToFocus = allPins.find(p => p.id === Number(pinIdFromUrl));
      if (pinToFocus) {
        setActiveCategory(pinToFocus.typePoint);
        setTimeout(() => {
          if (transformWrapperRef.current) {
            const { zoomToElement } = transformWrapperRef.current;
            const elementId = `pin-${pinToFocus.id}`;
            zoomToElement(elementId, 2.5, 800, "easeOut"); 
          }
        }, 200);
      }
    }
  }, [searchParams]);

  // efeito para controlar o zoom automático do mapa ao selecionar certas categorias
  useEffect(() => {
    if (!transformWrapperRef.current) return;
    const { zoomToElement, resetTransform } = transformWrapperRef.current;
    
    // categorias que acionam o zoom automático ao serem selecionadas
    const categoriesToZoom = ['ambulancia', 'pracaalimentacao'];

    if (activeCategory && categoriesToZoom.includes(activeCategory)) {
      const pinToZoom = visiblePins[0];
      if (pinToZoom) {
        const elementId = `pin-${pinToZoom.id}`;
        setTimeout(() => {
          if (typeof zoomToElement === "function") zoomToElement(elementId, 1.8, 600, "easeOut");
        }, 100);
      }
    } else {
      // reseta o zoom se nenhuma categoria especial estiver ativa
      if (typeof resetTransform === "function") resetTransform(600, "easeOut");
    }
  }, [activeCategory, visiblePins]);
  


  // Estados de loading e erro
  if (loading) {
    return (
      <div className="flex justify-center items-center mt-10">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-800 mx-auto mb-4"></div>
          <p className="text-green-800">Carregando mapa...</p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex justify-center mt-10">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">Erro ao carregar mapa</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }
  if (!currentMap || !mapDimensions) {
    return (
      <div className="flex justify-center mt-10">
        <div className="text-center text-gray-600">
          <p>Nenhum mapa disponível</p>
        </div>
      </div>
    );
  }

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
          <div className="flex flex-wrap gap-2 md:gap-3 mb-4">
            {Object.entries(FILTER_CONFIG).map(([type, config]) => (
              <button
                key={type}
                className={`px-3 py-1.5 text-xs md:text-sm text-white rounded transition-colors ${config.color} ${activeCategory === type ? 'ring-2 ring-offset-2 ring-white' : ''}`}
                onClick={() => handleShowPins(activeCategory === type ? null : type)}
              >
                <span className="mr-1">{config.icon}</span>
                {config.label}
              </button>
            ))}
            <button 
              className="px-3 py-1.5 text-xs md:text-sm bg-gray-400 text-white rounded hover:bg-gray-500 transition-colors" 
              onClick={() => handleShowPins(null)}
            >
              Limpar Filtro
            </button>
          </div>
          <div className="w-full h-full border border-gray-300 rounded-lg shadow-lg overflow-hidden">
            {mapDimensions && (
              <div
                className="relative w-full"
                style={{ aspectRatio: `${mapDimensions.width} / ${mapDimensions.height}` }}
              >
                <TransformWrapper ref={transformWrapperRef} initialScale={1} minScale={0.5} maxScale={8}>
                  <TransformComponent wrapperClass="!w-full !h-full" contentClass="!w-full !h-full">
                    <MapOverlay
                      svg={currentMap.svg}
                      pins={allPins}
                      visiblePins={visiblePins}
                      mapDimensions={mapDimensions}
                    />
                  </TransformComponent>
                </TransformWrapper>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* <EventPopup 
        eventData={selectedEvent} 
        onClose={() => setSelectedEvent(null)}
        imageMap={imgMapa} 
      /> */}
    </>
  );
}


