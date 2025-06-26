import React, { useState, useRef, useEffect } from 'react';
import { imageMap } from '../data/pinsData';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, Upload, MousePointer } from 'lucide-react';

import Itemstoedit from '../components/admin_pages_components/IntensToEdit';
import {debugdata, getMyObjectsStands, getMyObjectsEvent} from '../functions/api';
import { StandEventResponse } from '../data/RequestStructures';
import SelectPointOnMap from '../components/admin_pages_components/SelectPointOnMap';
import RegisterAndEdit from '../components/admin_pages_components/RegisterAndEditBT';
import { useParams } from 'react-router-dom';




export default function AdminManagerPage() {
  const { logout } = useAuth();

  //id do mapa
  const { id } = useParams();
  

  const fileInputRef = useRef<HTMLInputElement>(null);
  const emptyStandEvent: StandEventResponse = {
    id: 0,
    name: '',
    description: '',
    descriptionCard: '',
    img: '',
    point: {
        id: 0,
        typePoint: 'EXPOSITORES',
        x: 0,
        y: 0,
    }
    // Date é opcional, pode omitir
  };
  const [newItem, setNewItem] = useState<StandEventResponse>(emptyStandEvent);
  const [message, setMessage] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [itemSelected, setItemSelected] = useState<StandEventResponse | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [allstands, setStands]= useState<StandEventResponse[]>([]);
  const [allevents, setEvents]= useState<StandEventResponse[]>([]);



  useEffect(() => {
    getMyObjectsStands().then((data) => setStands(data));
    getMyObjectsEvent().then((data) => setEvents(data));
  }, []);

  
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
      setNewItem(itemSelected);
      setIsEditing(true);
        // Atualizar preview da imagem
        if (itemSelected.img && imageMap[itemSelected.img as keyof typeof imageMap]) {
          setImagePreview(imageMap[itemSelected.img as keyof typeof imageMap]);
        } else {
          setImagePreview(null);
        }
    } else {
      // Reset form when no item is selected
      setNewItem(emptyStandEvent);
      setIsEditing(false);
      setImagePreview(null);
    }
  }, [itemSelected]);

  const handleInputChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  const { name, value } = e.target;

  // Atualizar campos aninhados em point
  if (name === "x" || name === "y" || name === "typePoint") {
    setNewItem({
      ...newItem,
      point: {
        ...newItem.point,
        [name]: name === "x" || name === "y" ? Number(value) : value,
      },
    });
  } 
  // Atualizar campo de imagem
  else if (name === "img") {
    setNewItem({ ...newItem, img: value });
    if (value && imageMap[value as keyof typeof imageMap]) {
      setImagePreview(imageMap[value as keyof typeof imageMap]);
    } else {
      setImagePreview(null);
    }
  } 
  // Atualizar campos simples
  else {
    setNewItem({ ...newItem, [name]: value });
  }
};

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setNewItem({ ...newItem, img: file.name });
    }
  };

  const handleCancelEdit = () => {
    setItemSelected(null);
    setIsEditing(false);
    setNewItem(emptyStandEvent);
    setImagePreview(null);
  };

  debugdata();

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
                <strong>Editando:</strong> {itemSelected.name} (ID: {itemSelected.id})
              </p>
            </div>
          )}

          <div className="space-y-4">
            <input type="text" name="name" placeholder="Título do Stand/Evento" value={newItem.name} onChange={handleInputChange} className="w-full p-2 border rounded"/>
            <select name="typePoint" value={newItem.point.typePoint} onChange={handleInputChange} className="w-full p-2 border rounded bg-white">
              <option value="EXPOSITORES">Empresa</option>
              <option value="RESTAURANTE">Restaurante</option>
              <option value="ESPACOSHOW">Espaço de Shows</option>
              <option value="ESPACOPALESTRA">Espaço de Palestras</option>
              <option value="BANHEIROS">Banheiros</option>
              <option value="ESPACORACKATON">Espaço dos Rackatons</option>
              <option value="EMERGENCIA">Emergência</option>
              <option value="PARQUEDIVERSAO">Parque de Diversões</option>
            </select>
            <textarea name="description" placeholder="Descrição" value={newItem.description} onChange={handleInputChange} className="w-full p-2 border rounded" rows={3}></textarea>
            
            <div className="p-4 border rounded-lg bg-gray-50 space-y-3">
              <label className="block text-sm font-medium text-gray-600">Imagem do Item</label>
              <div className="space-y-3">
                <select 
                  name="img" 
                  value={newItem.img} 
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
                  <input type="number" name="x" placeholder="Eixo X" value={newItem.point.x} onChange={handleInputChange} className="w-full p-2 border rounded pl-8"/>
                </div>
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-gray-500">Y:</span>
                  <input type="number" name="y" placeholder="Eixo Y" value={newItem.point.y} onChange={handleInputChange} className="w-full p-2 border rounded pl-8"/>
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

            <RegisterAndEdit isEditing={isEditing} newItem={newItem}/>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
           <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Itens Atuais</h2>
           <div className="max-h-[600px] overflow-y-auto pr-2">
             <h3 className="text-xl font-bold text-green-600 my-2">Stands</h3>
             {allstands.map(pin=> (
               <Itemstoedit key={pin.id} item={pin} setSelectedPin={setItemSelected} type={'stands'}/>
             ))}
             <h3 className="text-xl font-bold text-green-600 my-2 mt-6">Eventos</h3>
             {allevents.map(pin => (
               <Itemstoedit key={pin.id} item={pin} setSelectedPin={setItemSelected} type={'event'}/>
             ))}
           </div>
        </div>
      </div>
      {showMapModal && (<SelectPointOnMap 
        setShowMapModal={setShowMapModal} 
        setNewItem={setNewItem} 
        allpoints={allstands} 
        newItem={newItem}  />)}
    </div>
  );
}