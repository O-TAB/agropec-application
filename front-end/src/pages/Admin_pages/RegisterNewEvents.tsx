import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { MousePointer, Save, PlusCircle, Calendar, MapPin, ArrowLeft } from 'lucide-react';

import {
  StandEventPost,
  StandEventResponse,
  emptyStandEvent,
  point,
  ResponsePoint
} from "../../data/ObjectStructures";

import { getFirstMapId, getMyObjectsEvent, getMypoints } from "../../functions/persistence/api";
import { RegisterNewpin, UpdatePin } from "../../functions/persistence/CrudPins";

import NameToPin from "../../components/admin_pages_components/NameToPin";
import SelectPointOnMap from "../../components/admin_pages_components/SelectPointOnMap";
import ImageUploadBlock from "../../components/admin_pages_components/ImageUploadBlock";
import ListToStandsAndEvents from "../../components/admin_pages_components/ListToStandsAndEvents";

const RegisterNewEvents: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [idmap, setidmap] = useState<string>("");
  const [allEvents, setAllEvents] = useState<StandEventResponse[]>([]);
  const [allpoints, setAllpoints] = useState<ResponsePoint[]>([]);
  const [availablePoints, setAvailablePoints] = useState<ResponsePoint[]>([]);

  const [newEvent, setNewEvent] = useState<StandEventPost | StandEventResponse>(emptyStandEvent);
  const [itemSelected, setItemSelected] = useState<StandEventResponse | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [showPointSelector, setShowPointSelector] = useState(false);

  const loadEvents = async () => {
    if (!idmap) return;
    const data = await getMyObjectsEvent();
    setAllEvents(data);
    const dataPoints = await getMypoints(idmap);
    setAllpoints(dataPoints);
    
    // Filtra apenas pontos que podem ser usados para eventos
    const eventPoints = dataPoints.filter(point => 
      point.typePoint === 'ESPACOSHOW' || 
      point.typePoint === 'ESPACORACKATON' || 
      point.typePoint === 'ESPACOPALESTRA'
    );
    setAvailablePoints(eventPoints);
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
    loadEvents();
  }, [idmap]);

  // é necessario ter uma segunda variavel para selecionar item para que não ocorra erros relacionados ao valor 'null'
  useEffect(() => {
    if (itemSelected) {
      setNewEvent(itemSelected);
      setIsEditing(true);
    } else {
      setNewEvent({...emptyStandEvent, point:{...emptyStandEvent.point,typePoint: 'EVENTO'}});
      setIsEditing(false);
    }
  }, [itemSelected]);

  const handleInputChange = ( e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "x" || name === "y" || name === "typePoint") {
      setNewEvent({
        ...newEvent,
        point: { ...newEvent.point, [name]: name === "x" || name === "y" ? Number(value) : value },
      });
    } else if (name === "date") {
      // Converte para formato ISO 8601
      const date = new Date(value);
      const isoDate = date.toISOString();
      setNewEvent({ ...newEvent, Date: isoDate });
    } else {
      setNewEvent({ ...newEvent, [name]: value });
    }
  };

  const handlePointSelection = (point: ResponsePoint) => {
    setNewEvent(prev => ({
      ...prev,
      point: {
        name: point.name,
        typePoint: point.typePoint,
        x: point.x,
        y: point.y
      }
    }));
    setShowPointSelector(false);
  };

  const handleSubmit = async () => {
    if (!newEvent.name || !newEvent.description || !newEvent.descriptionCard || !newEvent.img || !newEvent.Date) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing && itemSelected?.id !== undefined) {
        const success = await UpdatePin(newEvent, itemSelected.id, 'event');
        if (success) {
          alert("Evento atualizado com sucesso!");
          setItemSelected(null);
          await loadEvents();
        } else {
          alert("Erro ao atualizar o evento. Tente novamente.");
        }
      } else {
        const success = await RegisterNewpin(newEvent, idmap, 'event');
        if (success) {
          alert("Evento registrado com sucesso!");
          setNewEvent({...emptyStandEvent, point:{...emptyStandEvent.point,typePoint: 'EVENTO'}});
          await loadEvents();
        } else {
          alert("Erro ao registrar o evento. Tente novamente.");
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

  // Função para atualizar o ponto do evento ao selecionar no mapa
  const setNewPoint = (point: point) => {
    setNewEvent(prev => ({
      ...prev,
      point: { ...point }
    }));
  };

  // Formata a data para exibição no input
  const formatDateForInput = (isoDate: string | undefined) => {
    if (!isoDate) return '';
    try {
      const date = new Date(isoDate);
      return date.toISOString().slice(0, 16); // Formato YYYY-MM-DDTHH:MM
    } catch {
      return '';
    }
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
          <h1 className="text-4xl font-bold text-green-800">Gerenciar Eventos</h1>
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
              {isEditing ? 'Editar Evento' : 'Adicionar Novo Evento'}
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
              title="Nome do Evento"
              value={newEvent.name}
              handleInputChange={handleInputChange}
            />

            <textarea
              name="description"
              placeholder="Descrição Completa"
              value={newEvent.description}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
            
            <textarea
              name="descriptionCard"
              placeholder="Descrição do Cartão"
              value={newEvent.descriptionCard}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
            
            <ImageUploadBlock
              Value={newEvent.img}
              onImageChange={base64 => setNewEvent({ ...newEvent, img: base64 || "" })}
            />

            {/* Campo de Data */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Data e Hora do Evento</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input
                  type="datetime-local"
                  name="date"
                  value={formatDateForInput(newEvent.Date)}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded pl-10"
                  required
                />
              </div>
            </div>

            {/* Seleção de Ponto Existente */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Local do Evento</label>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setShowPointSelector(!showPointSelector)}
                  className="w-full p-2 border rounded flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <MapPin size={16} />
                    {newEvent.point.name || "Selecionar ponto existente"}
                  </span>
                  <span className="text-sm text-gray-500">
                    {newEvent.point.typePoint || "Nenhum ponto selecionado"}
                  </span>
                </button>
                
                {showPointSelector && (
                  <div className="border rounded-lg p-3 bg-gray-50 max-h-40 overflow-y-auto">
                    <p className="text-sm text-gray-600 mb-2">Pontos disponíveis para eventos:</p>
                    {availablePoints.length > 0 ? (
                      availablePoints.map((point) => (
                        <button
                          key={point.id}
                          onClick={() => handlePointSelection(point)}
                          className="w-full text-left p-2 hover:bg-white rounded transition-colors"
                        >
                          <div className="font-medium">{point.name}</div>
                          <div className="text-sm text-gray-500">{point.typePoint}</div>
                        </button>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">Nenhum ponto disponível para eventos</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Coordenadas (apenas para visualização/edição manual) */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Coordenadas do Evento no Mapa</label>
              <div className='flex items-center gap-4'>
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-gray-500">X:</span>
                  <input 
                    type="number" 
                    name="x" 
                    placeholder="Eixo X" 
                    value={newEvent.point.x} 
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
                    value={newEvent.point.y} 
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
                  Registrar Evento
                </>
              )}
            </button>
          </div>
        </div>
        
        <ListToStandsAndEvents 
          allItems={allEvents} 
          setSelectedPin={setItemSelected} 
          onRefresh={loadEvents}
          type="event"
        />
      </div>

      {showMapModal && (
        <SelectPointOnMap
          setShowMapModal={setShowMapModal}
          setNewPoint={setNewPoint}
          currentpoint={newEvent.point}
          allpoints={allpoints}
          idmap={idmap}
        />
      )}
    </div>
  );
};

export default RegisterNewEvents; 