import { ChangeEvent } from "react";

export interface SvgDimensions {
  width: number;
  height: number;
}


export function getSvgDimensions(svgContent: string): SvgDimensions | null {
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svgContent, "image/svg+xml");
  const svgElement = svgDoc.querySelector("svg");

  if (!svgElement) {
    console.error("SVG element not found in the provided content.");
    return null;
  }

  const width = parseFloat(svgElement.getAttribute("width") || "0");
  const height = parseFloat(svgElement.getAttribute("height") || "0");

  if (isNaN(width) || isNaN(height)) {
    console.error("Invalid width or height in SVG element.");
    return null;
  }

  return {width, height  };
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