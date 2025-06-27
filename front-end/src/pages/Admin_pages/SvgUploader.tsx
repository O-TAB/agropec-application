import React, { useCallback, useEffect, useState } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { getFirstMapId } from '../../functions/persistence/api';
import { useNavigate } from 'react-router-dom';
import { uploadMap } from '../../functions/persistence/api';

export default function SvgUploader() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(()=>{
   getFirstMapId().then((idmap) => {
      if (idmap) {
        console.log(idmap);
        navigate(`/gerenciar/${idmap}`); // troque para a rota que quiser, ex: '/admin/mapas'
      }
    });
  }, [navigate]);

  const handleFile = useCallback((file: File) => {
    setError(null);
    setIsLoading(true);

    if (file.type !== 'image/svg+xml') {
      setError('Por favor, selecione apenas arquivos SVG.');
      setIsLoading(false);
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError('O SVG deve ter no máximo 2MB.');
      setIsLoading(false);
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      if (e.target?.result) {
        try {
          await uploadMap(e.target.result as string, "Agropec Mapa");
          setError(null);
          alert('Mapa cadastrado com sucesso!');          
          navigate('/uploadmap');
        } catch (err: any) {
          setError('Erro ao registrar o mapa: ' + (err?.response?.data?.message || err.message));
        }
      }
      setIsLoading(false);
    };
    reader.onerror = () => {
      setError('Erro ao carregar o SVG. Tente novamente.');
      setIsLoading(false);
    };
    reader.readAsText(file);
  }, [navigate]);


  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Mapeador Interativo (SVG)
          </h1>
          <p className="text-lg text-gray-600">
            Faça upload do seu mapa em SVG para adicionar pontos interativos
          </p>
        </div>

        <div
          className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
            isDragOver
              ? 'border-blue-400 bg-blue-50 scale-105'
              : 'border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50'
          } ${isLoading ? 'pointer-events-none opacity-50' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {isLoading ? (
            <div className="space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600">Carregando SVG...</p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Faça upload do seu arquivo SVG
                </h3>
                <p className="text-gray-600 mb-4">
                  Arraste e solte um arquivo SVG aqui ou clique para selecionar
                </p>
                <p className="text-sm text-gray-500">
                  Formato suportado: SVG (max. 2MB)
                </p>
              </div>

              <input
                type="file"
                accept="image/svg+xml"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 cursor-pointer"
              >
                <Upload className="w-5 h-5 mr-2" />
                Selecionar SVG
              </label>
            </>
          )}
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Adicione pontos clicando no SVG</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Personalize o mapa interativo</span>
          </div>
        </div>
      </div>
    </div>
  );
}