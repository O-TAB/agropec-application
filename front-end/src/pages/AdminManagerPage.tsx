// Inside AdminManagerPage.tsx

import React, { useState, useRef, useEffect, useContext } from 'react'; // Make sure useContext is imported
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import { Trash2, Map, PlusCircle, AlertCircle, Upload, Edit, Save, X, MousePointer } from 'lucide-react';
import Itemstoedit from '../components/admin_pages_components/IntensToEdit';
import imgMapa from '../assets/MAPA-A1.svg';
import axios from 'axios';

const BASE_URL = 'http://localhost:8080';
const ORIGINAL_MAP_WIDTH = 3508;
const ORIGINAL_MAP_HEIGHT = 2481;

type BackendTypePoint = 'RESTAURANTE' | 'ESPACOSHOW' | 'ESPACOPALESTRA' | 'BANHEIROS' | 'ESPACORACKATON' | 'EMPRESA' | 'EMERGENCIA' | 'PARQUEDIVERSAO';

interface Point {
  id?: number;
  typePoint: BackendTypePoint;
  x: number;
  y: number;
  mapId?: string;
}

interface MapData {
  id: string;
  name: string;
  svg?: string;
}

interface Stand {
  id?: number;
  name: string;
  description: string;
  descriptionCard: string;
  img: string;
  point: Point;
}

interface Event {
  id?: number;
  name: string;
  description: string;
  descriptionCard: string;
  img: string;
  date: string;
  point: Point;
}

interface FormItem {
  name: string;
  description: string;
  descriptionCard: string;
  img: string;
  pointType: BackendTypePoint;
  x: number;
  y: number;
  date?: string;
  itemType: 'stand' | 'event';
  mapId: string;
}

export default function AdminManagerPage() {
  const { logout, token } = useAuth(); // <--- Get the token here
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newItem, setNewItem] = useState<FormItem>({
    itemType: 'stand',
    name: '',
    description: '',
    descriptionCard: '',
    img: '',
    pointType: 'EMPRESA',
    x: 0,
    y: 0,
    mapId: '',
  });

  const [message, setMessage] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [itemSelected, setItemSelected] = useState<Stand | Event | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<{ x: number; y: number } | null>(null);
  const [stands, setStands] = useState<Stand[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedMapId, setSelectedMapId] = useState<string | null>(null);
  const [availableMaps, setAvailableMaps] = useState<MapData[]>([]);

  const availableImages = [
    { value: '', label: 'Sem imagem' },
    { value: 'imagem_drone.jpg', label: 'Tecnologia no Campo' },
    { value: 'imagem_card_sustentavel.jpeg', label: 'Pecuária Sustentável' },
    { value: 'imagem_card_familia.jpg', label: 'Agroindústria Familiar' },
    { value: 'imagem_irrigacao.avif', label: 'Soluções em Irrigação' },
    { value: 'imagem_card_maquina.jpeg', label: 'Máquinas e Equipamentos' },
  ];
  const availablePointTypes: { value: BackendTypePoint; label: string }[] = [
    { value: 'EMPRESA', label: 'Estande de empresa' },
    { value: 'RESTAURANTE', label: 'Restaurante' },
    { value: 'ESPACOSHOW', label: 'Espaço de Shows' },
    { value: 'ESPACOPALESTRA', label: 'Espaço de Palestras' },
    { value: 'BANHEIROS', label: 'Banheiros' },
    { value: 'ESPACORACKATON', label: 'Espaço dos Rackatons' },
    { value: 'EMERGENCIA', label: 'Posto de atendimento médico' },
    { value: 'PARQUEDIVERSAO', label: 'Parque de diversões' },
  ];

  // Helper function to get headers with token
  const getAuthHeaders = () => {
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Pass headers with token to axios requests
        const standsResponse = await axios.get<Stand[]>(`${BASE_URL}/stands`, getAuthHeaders());
        setStands(standsResponse.data);

        const eventsResponse = await axios.get<Event[]>(`${BASE_URL}/event`, getAuthHeaders());
        setEvents(eventsResponse.data);

        const mapsResponse = await axios.get<MapData[]>(`${BASE_URL}/map`, getAuthHeaders());
        setAvailableMaps(mapsResponse.data);
        if (mapsResponse.data.length > 0) {
          setSelectedMapId(mapsResponse.data[0].id);
          setNewItem(prev => ({ ...prev, mapId: mapsResponse.data[0].id }));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setMessage('Falha ao carregar estandes, eventos ou mapas.');
      }
    };
    fetchAllData();
  }, [token]); // Add token to dependency array so it refetches if token changes (e.g., on login)

  useEffect(() => {
    if (itemSelected) {
      const type = (itemSelected as Event).date !== undefined ? 'event' : 'stand';

      setNewItem({
        itemType: type,
        name: itemSelected.name || '',
        description: itemSelected.description || '',
        descriptionCard: itemSelected.descriptionCard || '',
        img: itemSelected.img || '',
        pointType: itemSelected.point?.typePoint || 'EMPRESA',
        x: itemSelected.point?.x || 0,
        y: itemSelected.point?.y || 0,
        date: (itemSelected as Event).date || undefined,
        mapId: itemSelected.point?.mapId || selectedMapId || '',
      });
      setIsEditing(true);

      setImagePreview(itemSelected.img ? `${BASE_URL}/images/${itemSelected.img}` : null);
    } else {
      setNewItem({
        itemType: 'stand',
        name: '',
        description: '',
        descriptionCard: '',
        img: '',
        pointType: 'EMPRESA',
        x: 0,
        y: 0,
        mapId: selectedMapId || '',
      });
      setIsEditing(false);
      setImagePreview(null);
    }
  }, [itemSelected, selectedMapId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const finalValue = (name === 'x' || name === 'y') ? Number(value) : value;

    setNewItem(prev => ({
      ...prev,
      [name]: finalValue,
    }));

    if (name === 'img') {
      setImagePreview(value ? `${BASE_URL}/images/${value}` : null);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setNewItem(prev => ({ ...prev, img: file.name }));
    }
  };

  const handleSubmit = async () => {
    if (!selectedMapId) {
      setMessage('Por favor, selecione um mapa para associar o item.');
      return;
    }

    const pointPayload: Point = {
      typePoint: newItem.pointType,
      x: newItem.x,
      y: newItem.y,
      mapId: newItem.mapId,
    };

    try {
      if (isEditing && itemSelected) {
        const updateUrl = newItem.itemType === 'stand' ? `${BASE_URL}/stands/${itemSelected.name}` : `${BASE_URL}/event/${itemSelected.name}`;
        const payload = {
          ...newItem,
          point: pointPayload,
        };
        await axios.put(updateUrl, payload, getAuthHeaders()); // <--- Add headers for PUT
        setMessage('Item atualizado com sucesso!');
      } else {
        const createUrl = newItem.itemType === 'stand' ? `${BASE_URL}/stands/${selectedMapId}` : `${BASE_URL}/event/${selectedMapId}`;
        const payload = {
          ...newItem,
          point: pointPayload,
        };
        await axios.post(createUrl, payload, getAuthHeaders()); // <--- Add headers for POST
        setMessage('Item adicionado com sucesso!');
      }
      await fetchAllData();
      handleCancelEdit();
    } catch (error: any) {
      console.error('Erro ao salvar item:', error);
      setMessage(`Falha ao salvar item: ${error.response?.data || error.message}`);
    }
  };

  const handleDelete = async (item: Stand | Event) => {
    try {
      const deleteUrl = (item as any).date !== undefined ? `${BASE_URL}/event/${item.name}` : `${BASE_URL}/stands/${item.name}`;
      await axios.delete(deleteUrl, getAuthHeaders()); // <--- Add headers for DELETE
      setMessage('Item deletado com sucesso!');
      await fetchAllData();
    } catch (error: any) {
      console.error('Erro ao deletar item:', error);
      setMessage(`Falha ao deletar item: ${error.response?.data || error.message}`);
    }
  };

  const fetchAllData = async () => {
    try {
      // Ensure token is available when fetching data
      const config = getAuthHeaders();

      const standsResponse = await axios.get<Stand[]>(`${BASE_URL}/stands`, config);
      setStands(standsResponse.data);

      const eventsResponse = await axios.get<Event[]>(`${BASE_URL}/event`, config);
      setEvents(eventsResponse.data);

      const mapsResponse = await axios.get<MapData[]>(`${BASE_URL}/map`, config);
      setAvailableMaps(mapsResponse.data);
      if (!selectedMapId && mapsResponse.data.length > 0) {
        setSelectedMapId(mapsResponse.data[0].id);
        setNewItem(prev => ({ ...prev, mapId: mapsResponse.data[0].id }));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setMessage('Falha ao recarregar estandes, eventos ou mapas.');
    }
  };

  const handleCancelEdit = () => {
    setItemSelected(null);
    setIsEditing(false);
    setNewItem({
      itemType: 'stand',
      name: '',
      description: '',
      descriptionCard: '',
      img: '',
      pointType: 'EMPRESA',
      x: 0,
      y: 0,
      mapId: selectedMapId || '',
    });
    setImagePreview(null);
  };

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const absoluteX = Math.round((x / rect.width) * ORIGINAL_MAP_WIDTH);
    const absoluteY = Math.round((y / rect.height) * ORIGINAL_MAP_HEIGHT);

    setSelectedPosition({ x: absoluteX, y: absoluteY });
  };

  const confirmPosition = () => {
    if (selectedPosition) {
      setNewItem(prev => ({
        ...prev,
        x: selectedPosition.x,
        y: selectedPosition.y
      }));
      setShowMapModal(false);
      setSelectedPosition(null);
    }
  };

  const cancelPositionSelection = () => {
    setShowMapModal(false);
    setSelectedPosition(null);
  };

  const ItemstoeditComponent = ({ item, setSelectedPin }: { item: Stand | Event; setSelectedPin: (item: Stand | Event) => void }) => {
    return (
      <div className="flex items-center justify-between p-3 border-b border-gray-200">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
          <p className="text-xs text-gray-500 truncate">{item.descriptionCard}</p>
        </div>
        <div className="flex-shrink-0 ml-2 flex items-center gap-2">
          <button
            onClick={() => setSelectedPin(item)}
            className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition"
            title="Editar"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => handleDelete(item)}
            className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition"
            title="Deletar"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    );
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
                <strong>Editando:</strong> {itemSelected.name} (ID: {itemSelected.id})
              </p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Tipo de Item:</label>
              <select
                name="itemType"
                value={newItem.itemType}
                onChange={handleInputChange}
                className="w-full p-2 border rounded bg-white"
                disabled={isEditing}
              >
                <option value="stand">Stand</option>
                <option value="event">Evento</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Associar ao Mapa:</label>
              <select
                name="mapId"
                value={newItem.mapId}
                onChange={handleInputChange}
                className="w-full p-2 border rounded bg-white"
              >
                {availableMaps.length === 0 ? (
                  <option value="">Carregando mapas...</option>
                ) : (
                  availableMaps.map((map) => (
                    <option key={map.id} value={map.id}>
                      {map.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            <input type="text" name="name" placeholder="Nome do Stand/Evento" value={newItem.name} onChange={handleInputChange} className="w-full p-2 border rounded" />
            <textarea name="description" placeholder="Descrição" value={newItem.description} onChange={handleInputChange} className="w-full p-2 border rounded" rows={3}></textarea>
            <input type="text" name="descriptionCard" placeholder="Descrição Curta (para Card)" value={newItem.descriptionCard} onChange={handleInputChange} className="w-full p-2 border rounded" />

            {newItem.itemType === 'event' && (
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Data do Evento:</label>
                <input
                  type="datetime-local"
                  name="date"
                  value={newItem.date || ''}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
            )}

            <div className="p-4 border rounded-lg bg-gray-50 space-y-3">
              <label className="block text-sm font-medium text-gray-600">Imagem do Item</label>
              <div className="space-y-3">
                <select
                  name="img"
                  value={newItem.img}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded bg-white"
                >
                  {availableImages.map((imgOption) => (
                    <option key={imgOption.value} value={imgOption.value}>
                      {imgOption.label}
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
              <label className="block text-sm font-medium text-gray-600 mb-1">Tipo de Pino no Mapa</label>
              <select
                name="pointType"
                value={newItem.pointType}
                onChange={handleInputChange}
                className="w-full p-2 border rounded bg-white"
              >
                {availablePointTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Coordenadas do Pino no Mapa</label>
              <div className='flex items-center gap-4'>
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-gray-500">X:</span>
                  <input type="number" name="x" placeholder="Eixo X" value={newItem.x} onChange={handleInputChange} className="w-full p-2 border rounded pl-8" />
                </div>
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-gray-500">Y:</span>
                  <input type="number" name="y" placeholder="Eixo Y" value={newItem.y} onChange={handleInputChange} className="w-full p-2 border rounded pl-8" />
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
            {stands.map(stand => (
              <ItemstoeditComponent
                key={stand.id}
                item={stand}
                setSelectedPin={setItemSelected}
              />
            ))}
            <h3 className="text-xl font-bold text-green-600 my-2 mt-6">Eventos</h3>
            {events.map(event => (
              <ItemstoeditComponent
                key={event.id}
                item={event}
                setSelectedPin={setItemSelected}
              />
            ))}
          </div>
        </div>
      </div>

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

                  {selectedPosition && (
                    <div
                      className="absolute w-4 h-4 bg-red-500 border-2 border-white rounded-full shadow-lg transform -translate-x-1/2 -translate-y-1/2 animate-pulse"
                      style={{
                        left: `${(selectedPosition.x / ORIGINAL_MAP_WIDTH) * 100}%`,
                        top: `${(selectedPosition.y / ORIGINAL_MAP_HEIGHT) * 100}%`
                      }}
                    />
                  )}

                  {[...stands, ...events].map((item) => (
                    <div
                      key={item.id}
                      className={`absolute w-2 h-2 rounded-full border border-white shadow-sm ${
                        'date' in item ? 'bg-purple-400' : 'bg-red-400'
                      }`}
                      style={{
                        left: `${(item.point.x / ORIGINAL_MAP_WIDTH) * 100}%`,
                        top: `${(item.point.y / ORIGINAL_MAP_HEIGHT) * 100}%`
                      }}
                      title={item.name}
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