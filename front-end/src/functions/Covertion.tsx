import React from "react";

function convertImageToBase64(file:File): Promise<string | ArrayBuffer | null> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
}

export const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        var base64 = await convertImageToBase64(file);
        return base64;
      } catch (error) {
        console.error("Erro ao converter a imagem:", error);
      }
    }
};

export function renderBase64Image(base64String:string, altText = "Imagem", style="" ) {
    return <img src={base64String} alt={altText} className={style} />;
}