import React, { useState, useRef, useEffect } from 'react';
import { Upload } from 'lucide-react';
import { imageMap } from '../../data/pinsData'; // Supondo que precise para futuras implementações

interface ImageUploadBlockProps {
  currentImageUrl: string;
  onImageChange: (imageName: string, previewUrl: string) => void;
}

export default function ImageUploadBlock({ currentImageUrl, onImageChange }: ImageUploadBlockProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Efeito para sincronizar o preview quando um item existente é selecionado
  useEffect(() => {
    if (currentImageUrl && imageMap[currentImageUrl as keyof typeof imageMap]) {
      setImagePreview(imageMap[currentImageUrl as keyof typeof imageMap]);
    } else if (currentImageUrl) {
      // Se não for uma imagem do map, pode ser uma URL de um upload anterior
      // Para este exemplo, vamos resetar se não for conhecida.
      // Em um caso real, você poderia tentar exibir a URL diretamente.
      setImagePreview(null);
    } else {
      setImagePreview(null);
    }
  }, [currentImageUrl]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      // Avisa o componente pai sobre a nova imagem
      onImageChange(file.name, previewUrl);
    }
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
          <span className="text-xs text-gray-500">ou selecione uma imagem existente</span>
        </div>
      </div>
      
      {imagePreview && (
        <div className='mt-4'>
          <p className='text-xs text-gray-500 mb-2'>Pré-visualização:</p>
          <img src={imagePreview} alt="Preview" className="w-full h-32 object-cover rounded-md border" />
        </div>
      )}
    </div>
  );
}