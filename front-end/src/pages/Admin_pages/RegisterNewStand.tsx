
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { MousePointer, Save, PlusCircle, ArrowLeft } from 'lucide-react';

import {
  StandEventPost,
  StandEventResponse,
  emptyStandEvent,
  point,
  ResponsePoint
} from "../../data/ObjectStructures";

import { getFirstMapId, getMyObjectsStands, getMypoints } from "../../functions/persistence/api";
import { RegisterNewpin, UpdatePin } from "../../functions/persistence/CrudPins";

import NameToPin from "../../components/admin_pages_components/NameToPin";
import SelectPointOnMap from "../../components/admin_pages_components/SelectPointOnMap";
import ImageUploadBlock from "../../components/admin_pages_components/ImageUploadBlock";
import ListToStandsAndEvents from "../../components/admin_pages_components/ListToStandsAndEvents";

const RegisterNewStand: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [idmap, setidmap] = useState<string>("");
  const [allStands, setAllStands] = useState<StandEventResponse[]>([]);
  const [allpoints, setAllpoints] = useState<ResponsePoint[]>([]);

  const [newStand, setNewStand] = useState<StandEventPost | StandEventResponse>(emptyStandEvent);
  const [itemSelected, setItemSelected] = useState<StandEventResponse | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);

  const loadStands = async () => {
    if (!idmap) return;
    const data = await getMyObjectsStands();
    setAllStands(data);
    const dataPoints = await getMypoints(idmap);
    setAllpoints(dataPoints);
  };

  useEffect(() => {
    getFirstMapId().then((id) => {
      if (id) {
        setidmap(id);
      } else {
        navigate("/uploadmap");
      }
    });
  }, [navigate]);

  useEffect(() => {
    loadStands();
  }, [idmap]);

  //evitar de usuario poder editar e ao apgar o item que esta editando poder continar editando o item.
  useEffect(()=>{setNewStand(emptyStandEvent), setIsEditing(false)},[allStands]);

  useEffect(() => {
    if (itemSelected) {
      setNewStand(itemSelected);
      setIsEditing(true);
    } else {
      setNewStand({...emptyStandEvent, point:{...emptyStandEvent.point,typePoint: 'EXPOSITORES'}});
      setIsEditing(false);
    }
  }, [itemSelected]);

  const handleInputChange = ( e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "x" || name === "y" || name === "typePoint") {
      setNewStand({
        ...newStand,
        point: { ...(newStand.point || emptyStandEvent.point), [name]: name === "x" || name === "y" ? Number(value) : value },
      });
    } else {
      setNewStand({ ...newStand, [name]: value });
    }
  };

  const handleSubmit = async () => {
    if (!newStand.name || !newStand.description || !newStand.descriptionCard || !newStand.img) {
      alert("Preencha todos os campos.");
      return;
    }

    setIsSubmitting(true);
    try {
      const StandtoSend = {...newStand, point:{...newStand.point, name: newStand.name, typepoint: 'EXPOSITORES'}}
      if (isEditing && itemSelected?.id !== undefined) {
        const success = await UpdatePin(StandtoSend, itemSelected.id, 'stands');
        if (success) {
          alert("Stand atualizado com sucesso!");
          setItemSelected(null);
          await loadStands();
        } else {
          alert("Erro ao atualizar o stand. Tente novamente.");
        }
      } else {
        const success = await RegisterNewpin(StandtoSend, idmap, 'stands');
        if (success) {
          alert("Stand registrado com sucesso!");
          setNewStand({...emptyStandEvent, point:{...emptyStandEvent.point,typePoint: 'EXPOSITORES'}});
          await loadStands();
        } else {
          alert("Erro ao registrar o stand. Tente novamente.");
        }
      }
    } catch (err) {
      alert("Erro inesperado. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };



  const handleCancelEdit = () => {
    setItemSelected(null);
  };

  const setNewPoint = (point: point) => {
    setNewStand(prev => ({
      ...prev,
      point: { ...point }
    }));
  };
  
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft size={20} />
            Voltar ao Painel
          </button>
          <h1 className="text-4xl font-bold text-green-800">Gerenciar Stands</h1>
        </div>
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
        >
          Sair (Logout)
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h2 className="text-2xl font-semibold">
              {isEditing ? 'Editar Stand' : 'Adicionar Novo Stand'}
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
            <NameToPin
              title="Nome do Stand"
              value={newStand.name}
              handleInputChange={handleInputChange}
            />
            <textarea
              name="description"
              placeholder="Descrição Completa"
              value={newStand.description}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
            <textarea
              name="descriptionCard"
              placeholder="Descrição do Cartão"
              value={newStand.descriptionCard}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
            <ImageUploadBlock
              Value={newStand.img}
              onImageChange={base64 => setNewStand({ ...newStand, img: base64 || "" })}
            />
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Coordenadas do Stand no Mapa</label>
              <div className='flex items-center gap-4'>
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-gray-500">X:</span>
                  <input 
                    type="number" 
                    name="x" 
                    placeholder="Eixo X" 
                    value={newStand.point?.x || ''} 
                    onChange={handleInputChange} 
                    className="w-full p-2 border rounded pl-8"
                  />
                </div>
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-gray-500">Y:</span>
                  <input 
                    type="number" 
                    name="y" 
                    placeholder="Eixo Y" 
                    value={newStand.point?.y || ''} 
                    onChange={handleInputChange} 
                    className="w-full p-2 border rounded pl-8"
                  />
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
              disabled={isSubmitting}
              className={`w-full p-3 font-bold rounded-lg flex items-center justify-center gap-2 transition-colors ${
                isEditing 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-green-600 text-white hover:bg-green-700'
              } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? (<>...</>) : isEditing ? (<>Editar</>) : (<>Registrar</>)}
            </button>
          </div>
        </div>
        <ListToStandsAndEvents 
          allItems={allStands} 
          setSelectedPin={setItemSelected} 
          onRefresh={loadStands}
          type="stands"
        />
      </div>

      {showMapModal && (
        <SelectPointOnMap
          setShowMapModal={setShowMapModal}
          setNewPoint={setNewPoint}
          currentpoint={newStand.point || emptyStandEvent.point}
          allpoints={allpoints}
          idmap={idmap}
        />
      )}
    </div>
  );
};

export default RegisterNewStand;