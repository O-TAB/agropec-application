// src/pages/MapPage.tsx

import React, { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { allPins } from "../data/pinsData";
import imgMapa from "../assets/MAPA-A1.svg";
import { MapPin } from "lucide-react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import EventPopup from '../components/EventPopup';

const ORIGINAL_MAP_WIDTH = 3508;
const ORIGINAL_MAP_HEIGHT = 2481;

export default function MapPage() {
  const transformWrapperRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchParams] = useSearchParams();

  const visiblePins = activeCategory
    ? allPins.filter(pin => pin.category === activeCategory)
    : [];

  const handleShowPins = (category) => {
    setSelectedEvent(null);
    setActiveCategory(category);
  };
  
  useEffect(() => {
    const pinIdFromUrl = searchParams.get('pinId');
    if (pinIdFromUrl && transformWrapperRef.current) {
      const pinToFocus = allPins.find(p => p.id === Number(pinIdFromUrl));
      if (pinToFocus) {
        setActiveCategory(pinToFocus.category);
        setTimeout(() => {
          if (transformWrapperRef.current) {
            const { zoomToElement } = transformWrapperRef.current;
            const elementId = `pin-${pinToFocus.id}`;
            zoomToElement(elementId, 2.5, 800, "easeOut"); 
          }
        }, 200);
      }
    }
  }, []);

  useEffect(() => {
    if (!transformWrapperRef.current) return;
    const { zoomToElement, setTransform, resetTransform } = transformWrapperRef.current;
    const pinIdFromUrl = searchParams.get('pinId');

    if(pinIdFromUrl && visiblePins.length === 1 && visiblePins[0].id === Number(pinIdFromUrl)){
        return;
    }
    const categoriesToIgnore = ['stand', 'event', 'banheiros'];
    if (categoriesToIgnore.includes(activeCategory)) {
      return;
    }
    if (visiblePins.length === 0) {
      resetTransform(600, "easeOut");
      return;
    }
    if (visiblePins.length === 1) {
      const elementId = `pin-${visiblePins[0].id}`;
      setTimeout(() => {
        zoomToElement(elementId, 1.8, 600, "easeOut");
      }, 100);
      return;
    }
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    visiblePins.forEach(pin => {
      minX = Math.min(minX, pin.x);
      minY = Math.min(minY, pin.y);
      maxX = Math.max(maxX, pin.x);
      maxY = Math.max(maxY, pin.y);
    });
    const padding = 200;
    minX -= padding;
    minY -= padding;
    maxX += padding;
    maxY += padding;
    const boxWidth = maxX - minX;
    const boxHeight = maxY - minY;
    if (boxWidth <= 0 || boxHeight <= 0) return;
    const scaleX = ORIGINAL_MAP_WIDTH / boxWidth;
    const scaleY = ORIGINAL_MAP_HEIGHT / boxHeight;
    const newScale = Math.min(scaleX, scaleY);
    const boxCenterX = minX + boxWidth / 2;
    const boxCenterY = minY + boxHeight / 2;
    const newPositionX = (ORIGINAL_MAP_WIDTH / 2) - (boxCenterX * newScale);
    const newPositionY = (ORIGINAL_MAP_HEIGHT / 2) - (boxCenterY * newScale);
    setTransform(newPositionX, newPositionY, newScale, 600, "easeOut");
  }, [activeCategory]);
  
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
            <button className="px-3 py-1.5 text-xs md:text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700" onClick={() => handleShowPins("pracaalimentacao")}>Praça de Alimentação</button>
            <button className="px-3 py-1.5 text-xs md:text-sm bg-gray-400 text-white rounded hover:bg-gray-500" onClick={() => handleShowPins(null)}>Limpar Filtro</button>
          </div>
          <div className="w-full border border-gray-300 rounded-lg shadow-lg overflow-hidden">
            <div className="relative w-full aspect-[3508/2481]">
              <TransformWrapper ref={transformWrapperRef} initialScale={1} minScale={0.5} maxScale={8}>
                <TransformComponent wrapperClass="!w-full !h-full" contentClass="!w-full !h-full">
                  <img src={imgMapa} alt="Mapa do Evento" className="w-full h-full" />
                  {allPins.map((pin) => {
                    const isVisible = visiblePins.some(visiblePin => visiblePin.id === pin.id);
                    const baseClasses = "transition-opacity duration-500";
                    const visibilityClass = isVisible ? "opacity-100" : "opacity-0 pointer-events-none";
                    if (pin.type === 'main') {
                      return (
                        <div key={pin.id} id={`pin-${pin.id}`} className={`absolute text-green-800 animate-bounce ${baseClasses} ${visibilityClass}`} style={{ left: `${(pin.x / ORIGINAL_MAP_WIDTH) * 100}%`, top: `${(pin.y / ORIGINAL_MAP_HEIGHT) * 100}%` }}>
                          <MapPin className="w-8 h-8 transform -translate-x-1/2 -translate-y-full" />
                        </div>
                      );
                    }
                    if (pin.type === 'event') {
                      const pinColor = pin.category === 'stand' ? 'bg-red-500' : 'bg-purple-500';
                      return (
                        <button key={pin.id} id={`pin-${pin.id}`} onClick={() => setSelectedEvent(pin)} className={`absolute w-3 h-3 ${pinColor} rounded-full border-2 border-white shadow-md transform -translate-x-1/2 -translate-y-1/2 hover:scale-125 transition-transform ${baseClasses} ${visibilityClass}`} style={{ left: `${(pin.x / ORIGINAL_MAP_WIDTH) * 100}%`, top: `${(pin.y / ORIGINAL_MAP_HEIGHT) * 100}%` }} title={pin.title} />
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
}