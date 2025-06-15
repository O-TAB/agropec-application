import React from "react";
import { useState } from "react";
import { handleFileChange} from "../functions/Covertion";

export default function TestConversion() {
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