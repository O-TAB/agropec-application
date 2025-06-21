import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { allPins, ItemType, imageMap } from '../data/pinsData';
import { useAuth } from '../context/AuthContext';
import { Trash2, Map, PlusCircle, AlertCircle, Upload, Edit, Save, X, MousePointer } from 'lucide-react';
import Itemstoedit from '../components/admin_pages_components/IntensToEdit';
import imgMapa from '../assets/MAPA-A1.svg';

//tamanho do mapa original em pixels
const ORIGINAL_MAP_WIDTH = 3508;
const ORIGINAL_MAP_HEIGHT = 2481;

export default function AdminManagerPage() {
  const { logout } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newItem, setNewItem] = useState({
    category: 'stand',
    x: 0,
    y: 0,
    title: '',
    image: '',
    description: '',
    operatingHours: '09:00 - 22:00',
  });
  const [message, setMessage] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [itemSelected, setItemSelected] = useState<ItemType | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<{x: number, y: number} | null>(null);

  // Lista de imagens disponíveis para o dropdown
  const availableImages = [
    { value: '', label: 'Sem imagem' },
    { value: 'imagem_drone.jpg', label: 'Tecnologia no Campo' },
    { value: 'imagem_card_sustentavel.jpeg', label: 'Pecuária Sustentável' },
    { value: 'imagem_card_familia.jpg', label: 'Agroindústria Familiar' },
    { value: 'imagem_irrigacao.avif', label: 'Soluções em Irrigação' },
    { value: 'imagem_card_maquina.jpeg', label: 'Máquinas e Equipamentos' },
  ];

  // Auto-preenchimento dos inputs quando um item é selecionado
  useEffect(() => {
    if (itemSelected) {
      setNewItem({
        category: itemSelected.category || 'stand',
        x: itemSelected.x || 0,
        y: itemSelected.y || 0,
        title: itemSelected.title || '',
        image: itemSelected.image || '',
        description: itemSelected.description || '',
        operatingHours: itemSelected.operatingHours || '09:00 - 22:00',
      });
      setIsEditing(true);
      
      // Atualizar preview da imagem
      if (itemSelected.image && imageMap[itemSelected.image as keyof typeof imageMap]) {
        setImagePreview(imageMap[itemSelected.image as keyof typeof imageMap]);
      } else {
        setImagePreview(null);
      }
    } else {
      // Reset form when no item is selected
      setNewItem({
        category: 'stand',
        x: 0,
        y: 0,
        title: '',
        image: '',
        description: '',
        operatingHours: '09:00 - 22:00',
      });
      setIsEditing(false);
      setImagePreview(null);
    }
  }, [itemSelected]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const finalValue = (name === 'x' || name === 'y') ? Number(value) : value;
    setNewItem({ ...newItem, [name]: finalValue });
    
    // Atualizar preview da imagem quando selecionada no dropdown
    if (name === 'image') {
      if (value && imageMap[value as keyof typeof imageMap]) {
        setImagePreview(imageMap[value as keyof typeof imageMap]);
      } else {
        setImagePreview(null);
      }
    }
  };

  const handleFutureFeatureClick = (action: string) => {
    setMessage(`Funcionalidade de "${action}" em breve (será implementada pelo back-end).`);
    setTimeout(() => setMessage(''), 4000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setNewItem({ ...newItem, image: file.name });
    }
  };

  const handleSubmit = () => {
    if (isEditing && itemSelected) {
      handleFutureFeatureClick(`Editar Item '${itemSelected.title}'`);
    } else {
      handleFutureFeatureClick('Adicionar Item');
    }
  };

  const handleCancelEdit = () => {
    setItemSelected(null);
    setIsEditing(false);
    setNewItem({
      category: 'stand',
      x: 0,
      y: 0,
      title: '',
      image: '',
      description: '',
      operatingHours: '09:00 - 22:00',
    });
    setImagePreview(null);
  };

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Converter coordenadas relativas para coordenadas absolutas do mapa
    const absoluteX = Math.round((x / rect.width) * ORIGINAL_MAP_WIDTH);
    const absoluteY = Math.round((y / rect.height) * ORIGINAL_MAP_HEIGHT);
    
    setSelectedPosition({ x: absoluteX, y: absoluteY });
  };

  const confirmPosition = () => {
    if (selectedPosition) {
      setNewItem({
        ...newItem,
        x: selectedPosition.x,
        y: selectedPosition.y
      });
      setShowMapModal(false);
      setSelectedPosition(null);
    }
  };

  const cancelPositionSelection = () => {
    setShowMapModal(false);
    setSelectedPosition(null);
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-green-800">Gerenciador de Itens</h1>
        <button 
          onClick={logout}
          className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
        >
          Sair (Logout)
        </button>
      </div>

      {message && (
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-6 flex items-center gap-3" role="alert">
          <AlertCircle size={20} />
          <p>{message}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h2 className="text-2xl font-semibold">
              {isEditing ? 'Editar Item' : 'Adicionar Novo Item'}
            </h2>
            {isEditing && (
              <button 
                onClick={handleCancelEdit}
                className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
            )}
          </div>
          
          {isEditing && itemSelected && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Editando:</strong> {itemSelected.title} (ID: {itemSelected.id})
              </p>
            </div>
          )}

          <div className="space-y-4">
            <input type="text" name="title" placeholder="Título do Stand/Evento" value={newItem.title} onChange={handleInputChange} className="w-full p-2 border rounded"/>
            <select name="category" value={newItem.category} onChange={handleInputChange} className="w-full p-2 border rounded bg-white">
              <option value="stand">Stand</option>
              <option value="event">Evento</option>
            </select>
            <textarea name="description" placeholder="Descrição" value={newItem.description} onChange={handleInputChange} className="w-full p-2 border rounded" rows={3}></textarea>
            
            <div className="p-4 border rounded-lg bg-gray-50 space-y-3">
              <label className="block text-sm font-medium text-gray-600">Imagem do Item</label>
              <div className="space-y-3">
                <select 
                  name="image" 
                  value={newItem.image} 
                  onChange={handleInputChange} 
                  className="w-full p-2 border rounded bg-white"
                >
                  {availableImages.map((img) => (
                    <option key={img.value} value={img.value}>
                      {img.label}
                    </option>
                  ))}
                </select>
                
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
                  <span className="text-xs text-gray-500">ou selecione uma imagem existente acima</span>
                </div>
              </div>
              
              {imagePreview && (
                <div className='mt-4'>
                  <p className='text-xs text-gray-500 mb-2'>Pré-visualização:</p>
                  <img src={imagePreview} alt="Preview" className="w-full h-32 object-cover rounded-md border" />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Coordenadas do Pino no Mapa</label>
              <div className='flex items-center gap-4'>
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-gray-500">X:</span>
                  <input type="number" name="x" placeholder="Eixo X" value={newItem.x} onChange={handleInputChange} className="w-full p-2 border rounded pl-8"/>
                </div>
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-gray-500">Y:</span>
                  <input type="number" name="y" placeholder="Eixo Y" value={newItem.y} onChange={handleInputChange} className="w-full p-2 border rounded pl-8"/>
                </div>
                
                <button 
                  onClick={() => setShowMapModal(true)}
                  className="flex-shrink-0 p-2.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition flex items-center gap-2"
                  title="Escolher posição no mapa"
                >
                  <MousePointer size={16} />
                  <span className="text-sm">Escolher Posição</span>
                </button>
              </div>
            </div>

            <button 
              onClick={handleSubmit}
              className={`w-full p-3 font-bold rounded-lg flex items-center justify-center gap-2 transition-colors ${
                isEditing 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {isEditing ? (
                <>
                  <Save size={20} />
                  Salvar Alterações
                </>
              ) : (
                <>
                  <PlusCircle size={20} />
                  Adicionar ao Mapa
                </>
              )}
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
           <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Itens Atuais</h2>
           <div className="max-h-[600px] overflow-y-auto pr-2">
             <h3 className="text-xl font-bold text-green-600 my-2">Stands</h3>
             {allPins.filter(p => p.category === 'stand').map(pin => (
               <Itemstoedit key={pin.id} item={pin} setSelectedPin={setItemSelected} handleFutureFeatureClick={handleFutureFeatureClick} />
             ))}
             <h3 className="text-xl font-bold text-green-600 my-2 mt-6">Eventos</h3>
             {allPins.filter(p => p.category === 'event').map(pin => (
                <Itemstoedit key={pin.id} item={pin} setSelectedPin={setItemSelected} handleFutureFeatureClick={handleFutureFeatureClick} />
             ))}
           </div>
        </div>
      </div>

      {/* Modal de Seleção de Posição no Mapa */}
      {showMapModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Map size={20} />
                Escolher Posição no Mapa
              </h3>
              <button 
                onClick={cancelPositionSelection}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4 flex-1 overflow-hidden">
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>Instruções:</strong> Clique no mapa para selecionar a posição do item. 
                  As coordenadas serão automaticamente calculadas.
                </p>
              </div>
              
              <div className="relative w-full border border-gray-300 rounded-lg shadow-lg overflow-hidden">
                <div 
                  className="relative w-full aspect-[3508/2481] cursor-crosshair"
                  onClick={handleMapClick}
                >
                  <img src={imgMapa} alt="Mapa do Evento" className="w-full h-full" />
                  
                  {/* Mostrar posição selecionada */}
                  {selectedPosition && (
                    <div 
                      className="absolute w-4 h-4 bg-red-500 border-2 border-white rounded-full shadow-lg transform -translate-x-1/2 -translate-y-1/2 animate-pulse"
                      style={{ 
                        left: `${(selectedPosition.x / ORIGINAL_MAP_WIDTH) * 100}%`, 
                        top: `${(selectedPosition.y / ORIGINAL_MAP_HEIGHT) * 100}%` 
                      }}
                    />
                  )}
                  
                  {/* Mostrar todos os pins existentes para referência */}
                  {allPins.map((pin) => (
                    <div 
                      key={pin.id}
                      className={`absolute w-2 h-2 rounded-full border border-white shadow-sm ${
                        pin.category === 'stand' ? 'bg-red-400' : 
                        pin.category === 'event' ? 'bg-purple-400' : 'bg-green-400'
                      }`}
                      style={{ 
                        left: `${(pin.x / ORIGINAL_MAP_WIDTH) * 100}%`, 
                        top: `${(pin.y / ORIGINAL_MAP_HEIGHT) * 100}%` 
                      }}
                      title={pin.title}
                    />
                  ))}
                </div>
              </div>
              
              {selectedPosition && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-700">
                    <strong>Posição selecionada:</strong> X: {selectedPosition.x}, Y: {selectedPosition.y}
                  </p>
                </div>
              )}
            </div>
            
            <div className="p-4 bg-gray-50 border-t flex justify-end gap-3">
              <button 
                onClick={cancelPositionSelection}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmPosition}
                disabled={!selectedPosition}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedPosition 
                    ? 'bg-green-600 text-white hover:bg-green-700' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Confirmar Posição
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}