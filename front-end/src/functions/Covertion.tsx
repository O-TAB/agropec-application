import React from "react";

function convertImageToBase64(file:File): Promise<string | null> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
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
        return null;
      }
    }
};
