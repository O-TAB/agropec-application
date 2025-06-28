import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {MousePointer, Save, PlusCircle } from 'lucide-react';

import ListToStandsAndEvents from '../../components/admin_pages_components/ListToStandsAndEvents';
import { debugdata, getMyObjectsStands, getMyObjectsEvent } from '../../functions/persistence/api';
import { StandEventResponse, emptyStandEvent, StandEventPost } from '../../data/ObjectStructures';
import SelectPointOnMap from '../../components/admin_pages_components/SelectPointOnMap';
import ImageUploadBlock from '../../components/admin_pages_components/ImageUploadBlock';
import { RegisterNewpin, UpdatePin } from '../../functions/persistence/CrudPins';

export default function AdminManagerPage() {
  const { logout } = useAuth();

  const [newItem, setNewItem] = useState<StandEventPost | StandEventResponse>(emptyStandEvent);
  const [itemSelected, setItemSelected] = useState<StandEventResponse | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [allstands, setStands] = useState<StandEventResponse[]>([]);
  const [allevents, setEvents] = useState<StandEventResponse[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentType, setCurrentType] = useState<'stands' | 'events'>('stands');
  
  // Função para buscar/atualizar os dados, evitando repetição de código
  const fetchAllData = () => {
    getMyObjectsStands().then((data) => setStands(data));
    getMyObjectsEvent().then((data) => setEvents(data));
  }

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    if (itemSelected) {
      setNewItem(itemSelected);
      setIsEditing(true);
    } else {
      setNewItem(emptyStandEvent);
      setIsEditing(false);
    }
  }, [itemSelected]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "x" || name === "y" || name === "typePoint") {
      setNewItem({
        ...newItem,
        point: { ...newItem.point, [name]: name === "x" || name === "y" ? Number(value) : value },
      });
    } else {
      setNewItem({ ...newItem, [name]: value });
    }
  };

  // nova função para receber a imagem 
  const handleImageChangeFromChild = (base64: string | null) => {
    setNewItem({ ...newItem, img: base64 || "" });
  };
  
  const handleCancelEdit = () => {
    setItemSelected(null);
  };

  const handleSubmit = async () => {
    if (!newItem.name || !newItem.description || !newItem.img) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing && itemSelected?.id !== undefined) {
        const success = await UpdatePin(newItem, itemSelected.id, currentType);
        if (success) {
          alert(`${currentType === 'stands' ? 'Stand' : 'Evento'} atualizado com sucesso!`);
          setItemSelected(null);
          fetchAllData();
        } else {
          alert(`Erro ao atualizar o ${currentType === 'stands' ? 'stand' : 'evento'}. Tente novamente.`);
        }
      } else {
        const success = await RegisterNewpin(newItem, '', currentType);
        if (success) {
          alert(`${currentType === 'stands' ? 'Stand' : 'Evento'} registrado com sucesso!`);
          setNewItem(emptyStandEvent);
          fetchAllData();
        } else {
          alert(`Erro ao registrar o ${currentType === 'stands' ? 'stand' : 'evento'}. Tente novamente.`);
        }
      }
    } catch (err) {
      alert("Erro inesperado. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  debugdata();

  return (
    <div className="container mx-auto p-4 md:p-8">

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-green-800">Gerenciador de Itens</h1>
        <button onClick={logout} className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors">
          Sair (Logout)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">

          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h2 className="text-2xl font-semibold">{isEditing ? 'Editar Item' : 'Adicionar Novo Item'}</h2>
            {isEditing && (
              <button onClick={handleCancelEdit} className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition-colors">
                Cancelar
              </button>
            )}
          </div>
          
          {isEditing && itemSelected && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700"><strong>Editando:</strong> {itemSelected.name} (ID: {itemSelected.id})</p>
            </div>
          )}

          <div className="space-y-4">
            <input type="text" name="name" placeholder="Título do Stand/Evento" value={newItem.name} onChange={handleInputChange} className="w-full p-2 border rounded"/>
            <select name="typePoint" value={newItem.point.typePoint} onChange={handleInputChange} className="w-full p-2 border rounded bg-white">
              <option value="EXPOSITORES">Empresa</option>
            </select>
            <textarea name="description" placeholder="Descrição" value={newItem.description} onChange={handleInputChange} className="w-full p-2 border rounded" rows={3}></textarea>
            
            {/* componente qi eu coloque*/}
            <ImageUploadBlock 
              Value={newItem.img}
              onImageChange={handleImageChangeFromChild}
            />

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
                <button onClick={() => setShowMapModal(true)} className="flex-shrink-0 p-2.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition flex items-center gap-2">
                  <MousePointer size={16} />
                  <span className="text-sm">Escolher Posição</span>
                </button>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`w-full p-3 font-bold rounded-lg flex items-center justify-center gap-2 transition-colors ${
                isEditing 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-green-600 text-white hover:bg-green-700'
              } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  {isEditing ? 'Salvando...' : 'Registrando...'}
                </>
              ) : isEditing ? (
                <>
                  <Save size={20} />
                  Salvar Alterações
                </>
              ) : (
                <>
                  <PlusCircle size={20} />
                  Registrar
                </>
              )}
            </button>
          </div>
        </div>
        
        <div className="space-y-6">
          <ListToStandsAndEvents 
            allItems={allstands} 
            idmapa="" 
            setSelectedPin={(item) => {
              setItemSelected(item);
              setCurrentType('stands');
            }} 
            onRefresh={fetchAllData}
            type="stands"
          />
          
          <ListToStandsAndEvents 
            allItems={allevents} 
            idmapa="" 
            setSelectedPin={(item) => {
              setItemSelected(item);
              setCurrentType('events');
            }} 
            onRefresh={fetchAllData}
            type="events"
          />
        </div>
      </div>
      
      {showMapModal && (
        <SelectPointOnMap 
          setShowMapModal={setShowMapModal} 
          setNewPoint={(point) => setNewItem(prev => ({...prev, point}))} 
          currentpoint={newItem.point} 
          allpoints={allstands.map(stand => stand.point)} 
        />
      )}
    </div>
  );
}