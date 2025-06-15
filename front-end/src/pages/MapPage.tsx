import React, { useState, useRef, useEffect } from "react";
import imgMapa from "../assets/MAPA_A1.jpg";
import { MapPin } from "lucide-react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import EventPopup from '../components/EventPopup';

// imagens dos stands (somente os stands pq fique com preguiça de colocar foto nos eventos)
import imgDrone from '../assets/imagem_drone.jpg';
import imgPecuaria from '../assets/imagem_card_sustentavel.jpeg';
import imgAgroindustria from '../assets/imagem_card_familia.jpg';
import imgIrrigacao from '../assets/imagem_irrigacao.avif';
import imgMaquinas from '../assets/imagem_card_maquina.jpeg';

const ORIGINAL_MAP_WIDTH = 3508;
const ORIGINAL_MAP_HEIGHT = 2481;

// coordenadas dos pinos no mapa
const allPins = [
  // banheiros e ambulância
  { id: 1, category: 'banheiros', type: 'main', x: 1192, y: 786, title: "Banheiro 1" },
  { id: 2, category: 'banheiros', type: 'main', x: 2042, y: 1088, title: "Banheiro 2" },
  { id: 3, category: 'banheiros', type: 'main', x: 2575, y: 2200, title: "Banheiro 3" },
  { id: 4, category: 'ambulancia', type: 'main', x: 1004, y: 684, title: "Ambulância" },

  // stands
  { id: 10, category: 'stand', type: 'event', x: 1368, y: 607, title: 'Tecnologia no Campo', image: imgDrone, description: 'Soluções com drones, sensores e automação para produção agrícola.' },
  { id: 11, category: 'stand', type: 'event', x: 1499, y: 685, title: 'Pecuária Sustentável', image: imgPecuaria, description: 'Inovações na pecuária, bem-estar animal e alimentação de qualidade.' },
  { id: 12, category: 'stand', type: 'event', x: 1492, y: 905, title: 'Agroindústria Familiar', image: imgAgroindustria, description: 'Produtos e serviços direto da agroindústria local e familiar.' },
  { id: 13, category: 'stand', type: 'event', x: 1830, y: 1285, title: 'Soluções em Irrigação', image: imgIrrigacao, description: 'Tecnologia eficiente para a irrigação de pequenas e grandes propriedades.' },
  { id: 14, category: 'stand', type: 'event', x: 1473, y: 1570, title: 'Máquinas e Equipamentos', image: imgMaquinas, description: 'Tratores, colheitadeiras e lançamentos do setor de máquinas agrícolas.' },

  // eventos
  { id: 20, category: 'event', type: 'event', x: 2079, y: 868, title: 'Área de Shows', image: '', description: 'Palco principal para os grandes shows e atrações noturnas. Consulte a programação do dia!' },
  { id: 22, category: 'event', type: 'event', x: 2729, y: 1760, title: 'Agropec Banking', image: '', description: 'Ponto de atendimento com soluções financeiras e de crédito para o produtor rural.' },
  { id: 23, category: 'event', type: 'event', x: 986, y: 1521, title: 'Fazendinha', image: '', description: 'Um espaço para toda a família interagir e conhecer de perto os animais da fazenda.' },
  { id: 24, category: 'event', type: 'event', x: 1038, y: 308, title: 'Concha Acústica', image: '', description: 'Espaço reservado para palestras, workshops e apresentações musicais durante o dia.' },
  { id: 25, category: 'event', type: 'event', x: 984, y: 1769, title: 'Baia de Animais', image: '', description: 'Exposição de animais de grande porte. Veja de perto os campeões de diversas raças.' }
];

const MapPage = () => {
  const transformWrapperRef = useRef(null);
  const [visiblePins, setVisiblePins] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleShowPins = (category) => {
    setSelectedEvent(null);
    if (category) {
        const pinsToSet = allPins.filter(pin => pin.category === category);
        setVisiblePins(pinsToSet);
    } else {
        setVisiblePins([]);
    }
  };

  useEffect(() => {
    if (!transformWrapperRef.current) return;
    const { zoomToElement, resetTransform } = transformWrapperRef.current;
    
    const utilityPins = visiblePins.filter(p => p.category === 'banheiros' || p.category === 'ambulancia');
    
    if (utilityPins.length > 0) {
      const firstPin = utilityPins.reduce((prev, curr) => prev.id < curr.id ? prev : curr);
      const elementId = `pin-${firstPin.id}`;
      
      setTimeout(() => {
        zoomToElement(elementId, 1.8, 600, "easeOut");
      }, 100);
    } else {
      resetTransform(600);
    }
  }, [visiblePins]);

  return (
    <>
      <div className="flex justify-center mt-4 md:mt-10 px-4">
        <div className="bg-yellow-50 rounded-2xl shadow-lg p-4 md:p-6 w-full max-w-5xl">
          <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
            <MapPin className="w-7 h-7 md:w-8 md:h-8 text-green-800" />
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-green-800">
              Mapa do Evento
            </h1>
          </div>
          <p className="text-sm text-green-700 italic mb-4">
            Selecione um filtro para explorar ou dê um zoom para melhor visualização.
          </p>
          
          <div className="flex flex-wrap gap-2 md:gap-3 mb-4">
            <button className="px-3 py-1.5 text-xs md:text-sm bg-red-600 text-white rounded hover:bg-red-700" onClick={() => handleShowPins("stand")}>Stands</button>
            <button className="px-3 py-1.5 text-xs md:text-sm bg-purple-600 text-white rounded hover:bg-purple-700" onClick={() => handleShowPins("event")}>Eventos</button>
            <button className="px-3 py-1.5 text-xs md:text-sm bg-blue-600 text-white rounded hover:bg-blue-700" onClick={() => handleShowPins("banheiros")}>Banheiros</button>
            <button className="px-3 py-1.5 text-xs md:text-sm bg-green-600 text-white rounded hover:bg-green-700" onClick={() => handleShowPins("ambulancia")}>Ambulância</button>
            <button className="px-3 py-1.5 text-xs md:text-sm bg-gray-400 text-white rounded hover:bg-gray-500" onClick={() => handleShowPins(null)}>Limpar Filtro</button>
          </div>

          <div className="w-full border border-gray-300 rounded-lg shadow-lg overflow-hidden">
            <div className="relative w-full aspect-[3508/2481]">
              <TransformWrapper ref={transformWrapperRef} initialScale={1}>
                <TransformComponent wrapperClass="!w-full !h-full" contentClass="!w-full !h-full">
                  <img src={imgMapa} alt="Mapa do Evento" className="w-full h-full" />
                  
                  {visiblePins.map((pin) => {
                    if (pin.type === 'main') {
                      return (
                        <div key={pin.id} id={`pin-${pin.id}`} className="absolute text-green-800 animate-bounce" style={{ left: `${(pin.x / ORIGINAL_MAP_WIDTH) * 100}%`, top: `${(pin.y / ORIGINAL_MAP_HEIGHT) * 100}%` }}>
                          <MapPin className="w-8 h-8 transform -translate-x-1/2 -translate-y-full" />
                        </div>
                      );
                    }
                    if (pin.type === 'event') {
                      const pinColor = pin.category === 'stand' ? 'bg-red-500' : 'bg-purple-500';
                      return (
                        <button key={pin.id} onClick={() => setSelectedEvent(pin)} className={`absolute w-3 h-3 ${pinColor} rounded-full border-2 border-white shadow-md transform -translate-x-1/2 -translate-y-1/2 hover:scale-125 transition-transform`} style={{ left: `${(pin.x / ORIGINAL_MAP_WIDTH) * 100}%`, top: `${(pin.y / ORIGINAL_MAP_HEIGHT) * 100}%` }} title={pin.title} />
                      );
                    }
                    return null;
                  })}
                </TransformComponent>
              </TransformWrapper>
            </div>
          </div>
        </div>
      </div>
      <EventPopup eventData={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </>
  );
};

export default MapPage;