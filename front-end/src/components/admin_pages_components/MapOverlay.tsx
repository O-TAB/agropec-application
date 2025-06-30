import { ResponsePoint } from "../../data/ObjectStructures";
import { SvgDimensions } from "../../functions/SvgDimensionReader";

interface MapOverlayProps {
  svg: string;
  pins: ResponsePoint[];
  visiblePins: ResponsePoint[];
  mapDimensions: SvgDimensions;
  onPinClick: (pinId: number) => void;
}

const MapOverlay: React.FC<MapOverlayProps> = ({ svg, pins, visiblePins, mapDimensions, onPinClick }) => {
  const svgWidth = mapDimensions.width;
  const svgHeight = mapDimensions.height;
  const minX = mapDimensions.minX;
  const minY = mapDimensions.minY;

  const getPinColor = (type: string) => {
    switch (type) {
      case "EXPOSITORES": return 'bg-red-500';
      case "ESPACOSHOW": return 'bg-purple-500';
      case "ESPACOPALESTRA": return 'bg-blue-500';
      case "BANHEIROS": return 'bg-orange-500';
      case "ESPACORACKATON": return 'bg-blue-400';
      case "EMERGENCIA": return 'bg-red-600';
      case "RESTAURANTE": return 'bg-green-500';
      case "PARQUEDIVERSAO": return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div
      style={{ width: svgWidth, height: svgHeight, position: 'relative' }}
    >
      {/* SVG */}
      <div
        style={{ width: svgWidth, height: svgHeight }}
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      {/* Overlay dos pontos */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: svgWidth,
          height: svgHeight,
          pointerEvents: 'none',
        }}
      >
        {pins.map((pin) => {
          const isVisible = visiblePins.some((visiblePin) => visiblePin.id === pin.id);
          const baseClasses = "transition-opacity duration-500";
          const visibilityClass = isVisible ? "opacity-100" : "opacity-0 pointer-events-none";
          return (
            <button
              key={pin.id}
              id={`pin-${pin.id}`}
              className={`absolute w-3 h-3 ${getPinColor(pin.typePoint)} rounded-full border-2 border-white shadow-md transform -translate-x-1/2 -translate-y-1/2 hover:scale-125 transition-transform ${baseClasses} ${visibilityClass}`}
              style={{
                left: pin.x - minX,
                top: pin.y - minY,
                pointerEvents: 'auto',
              }}
              title={pin.name}
              onClick={() => onPinClick(pin.id)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default MapOverlay;
