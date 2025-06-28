import React, { useState, useRef, useEffect } from 'react';
import { Upload } from 'lucide-react';
import { handleFileChange } from '../../functions/Covertion';

interface ImageUploadBlockProps {
  SetImage: (base64Img: string | null) => void;
}

export default function ImageUploadBlock({ SetImage }: ImageUploadBlockProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [base64Image, setBase64Image] = useState<string | null>(null);
  
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const base64: string | ArrayBuffer | null | undefined  = await handleFileChange(event);
    setBase64Image(base64 ?? null);
    SetImage(base64Image)
  };
 

  return (
    <div className="p-4 border rounded-lg bg-gray-50 space-y-3">
      <label className="block text-sm font-medium text-gray-600">Imagem do Item</label>
      <div className="space-y-3">
        {/* A lógica do <select> de imagens existentes poderia vir aqui no futuro */}
        <div className="flex items-center gap-4">
          <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 bg-gray-600 text-white rounded hover:bg-gray-700 transition flex items-center gap-2"
            title="Carregar nova imagem"
          >
            <Upload size={16} />
            <span className="text-sm">Nova Imagem</span>
          </button>
        </div>
      </div>
      
      {base64Image && (
        <div className='mt-4'>
          <p className='text-xs text-gray-500 mb-2'>Pré-visualização:</p>
          <img src={base64Image} alt="Preview" className="w-full h-32 object-cover rounded-md border" />
        </div>
      )}
    </div>
  );
}