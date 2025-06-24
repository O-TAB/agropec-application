import React, { ChangeEvent } from "react";
import { useState, useRef } from "react";
import { handleFileChange} from "../functions/Covertion";
import { SvgDimensions, getSvgDimensions, handle_SVGFileChange } from "../functions/SvgDimensionReader";
import { get } from "axios";

export function TestConversion() {
  const [base64Image, setBase64Image] = useState<string | ArrayBuffer | null>(null);

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const base64: string | ArrayBuffer | null | undefined  = await handleFileChange(event);
    setBase64Image(base64 ?? null);
  };

  return (
    <div>
      <h1>Teste de Conversão de Imagem</h1>
      <input type="file" accept="image/*" onChange={handleChange} />
      <p>{typeof base64Image === "string" ? base64Image : ""}</p>
    </div>
  );
}


export function SvgDimensionReader() {
  const [svgDimensions, setSvgDimensions] = useState<SvgDimensions | null>(null);
  const svgContainerRef = useRef(null); // Ref para um contêiner temporário

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const dimensions = await handle_SVGFileChange(event);
    setSvgDimensions(dimensions);
  };
  
  return (
    <div>
      <input type="file" accept="image/svg+xml" onChange={handleFileChange} />
      {svgDimensions && (
        <div>
          <h2>Dimensões do SVG:</h2>
          <p>Largura: {svgDimensions.width}px</p>
          <p>Altura: {svgDimensions.height}px</p>
        </div>
      )}
      {/* Contêiner oculto para renderizar o SVG temporariamente */}
      <div ref={svgContainerRef} style={{ position: 'absolute', left: '-9999px', top: '-9999px', visibility: 'hidden' }} />
    </div>
  );
}

export default SvgDimensionReader;