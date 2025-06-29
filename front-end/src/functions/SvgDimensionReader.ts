import { ChangeEvent } from "react";

export interface SvgDimensions {
  width: number;
  height: number;
  minX: number;
  minY: number;
}

export function getSvgDimensions(svgContent: string): SvgDimensions | null {
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svgContent, "image/svg+xml");
  const svgElement = svgDoc.querySelector("svg");

  if (!svgElement) {
    console.error("SVG element not found in the provided content.");
    return null;
  }

  // Priorizar viewBox
  const viewBox = svgElement.getAttribute("viewBox");
  if (viewBox) {
    const parts = viewBox.split(/\s+/);
    if (parts.length === 4) {
      const minX = parseFloat(parts[0]);
      const minY = parseFloat(parts[1]);
      const width = parseFloat(parts[2]);
      const height = parseFloat(parts[3]);
      if (!isNaN(width) && !isNaN(height) && !isNaN(minX) && !isNaN(minY)) {
        return { width, height, minX, minY };
      }
    }
  }

  // Fallback para width/height
  const width = parseFloat(svgElement.getAttribute("width") || "0");
  const height = parseFloat(svgElement.getAttribute("height") || "0");
  if (!isNaN(width) && !isNaN(height)) {
    return { width, height, minX: 0, minY: 0 };
  }

  console.error("Invalid width, height, or viewBox in SVG element.");
  return null;
}

export const handle_SVGFileChange = (event: ChangeEvent<HTMLInputElement>): Promise<SvgDimensions | null> =>{
    return new Promise((resolve) => {
    const file = event.target.files?.[0];
    if (file && file.type === "image/svg+xml") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const svgContent = e.target?.result as string;
        const dimensions = getSvgDimensions(svgContent);
        resolve(dimensions);
      };
      reader.readAsText(file);
    } else {
      resolve(null);
    }
  });
  };