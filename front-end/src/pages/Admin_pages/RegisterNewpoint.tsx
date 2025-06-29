import React, { useState, useEffect } from 'react';

import { useAuth } from '../../context/AuthContext';
import { MousePointer, Save, PlusCircle, ArrowLeft } from 'lucide-react';

import {debugdata, getMypoints, getFirstMapId} from '../../functions/persistence/api';
import { emptypoint, point, ResponsePoint } from '../../data/ObjectStructures';
import SelectPointOnMap from '../../components/admin_pages_components/SelectPointOnMap';
import { useNavigate} from 'react-router-dom';
import { RegisterNewPoint, UpdatePoint } from '../../functions/persistence/CrudPins';

import NameToPin from '../../components/admin_pages_components/NameToPin';
import ListPoints from '../../components/admin_pages_components/ListPoints';



export default function Registernewpoint() {
  const { logout } = useAuth();
  const [newPoint, setNewPoint] = useState<point | ResponsePoint>(emptypoint);
  const [itemSelected, setPointSelected] = useState<ResponsePoint | null>(null);
  //nao é possivel que um item selecionado seja um point simples
  const [idmap, setidmap] = useState<string>('');

  const [isEditing, setIsEditing] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [allpoints, setPoints] = useState< ResponsePoint[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const loadPoints = async () => {
    if (idmap) {
      const data = await getMypoints(idmap);
      setPoints(data);
    }
  };

  useEffect(() => {
    getFirstMapId().then((idmap) => {
          if (idmap) {
            setidmap(idmap);
          }else{
            navigate('/uploadmap');
          }
        });  
  }, [navigate]);

  useEffect(() => {
    loadPoints();
  }, [idmap]);

  // é necessario ter uma segunda variavel para selecionar item para que não ocorra erros relacionados ao valor 'null'
  // ex: ao setar como null a função useEffect ativa e set como empty item e logo em seguida ativa como se tivesse editando um elemento.
  useEffect(() => {
    if (itemSelected) {
      setNewPoint(itemSelected);
      setIsEditing(true);
    } else {
      setNewPoint(emptypoint);
      setIsEditing(false);
    }
  }, [itemSelected]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewPoint({ ...newPoint, [name]: value });
    
  };

  const handleSubmit = async() => {
    if (!newPoint.name || !newPoint.typePoint) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing) {
        if ('id' in newPoint && newPoint.id !== undefined) {
          const success = await UpdatePoint(newPoint, newPoint.id, idmap);
          if (success) {
            alert('Ponto atualizado com sucesso!');
            setPointSelected(null);
            await loadPoints(); // Recarrega a lista
          } else {
            alert('Erro ao atualizar o ponto. Tente novamente.');
          }
        } else {
          alert("Não é possível editar: ponto sem ID.");
        }
      } else if(idmap){
        const success = await RegisterNewPoint(newPoint, idmap);
        if (success) {
          alert('Ponto registrado com sucesso!');
          setNewPoint(emptypoint);
          await loadPoints(); // Recarrega a lista
        } else {
          alert('Erro ao registrar o ponto. Tente novamente.');
        }
      }else{
        alert("Erro: ID do mapa não encontrado.");
      }
    } catch (error) {
      alert('Erro inesperado. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setPointSelected(null);
  };

  debugdata();

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
          <h1 className="text-4xl font-bold text-green-800">Gerenciar pontos</h1>
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

            <NameToPin title='nome do ponto' value={newPoint.name} handleInputChange={handleInputChange}/>
            {/*corta*/}
            <select name="typePoint" value={newPoint.typePoint} onChange={handleInputChange} className="w-full p-2 border rounded bg-white">
              <option value="">Selecione o tipo</option>
              <option value="ESPACOSHOW">Espaço de Shows</option>
              <option value="RESTAURANTE">Restaurante</option>
              <option value="ESPACOPALESTRA">Espaço de Palestras</option>
              <option value="BANHEIROS">Banheiros</option>
              <option value="ESPACORACKATON">Espaço dos Rackatons</option>
              <option value="EMERGENCIA">Emergência</option>
              <option value="PARQUEDIVERSAO">Parque de Diversões</option>
            </select>
            {/*corta*/}
            {/*corta*/}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Coordenadas do Pino no Mapa</label>
              <div className='flex items-center gap-4'>
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-gray-500">X:</span>
                  <input type="number" name="x" placeholder="Eixo X" value={newPoint.x} onChange={handleInputChange} className="w-full p-2 border rounded pl-8"/>
                </div>
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-gray-500">Y:</span>
                  <input type="number" name="y" placeholder="Eixo Y" value={newPoint.y} onChange={handleInputChange} className="w-full p-2 border rounded pl-8"/>
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
            {/*corta*/}
            {/*NAOOOOOOOOO corta*/}
            <button 
                onClick={() => handleSubmit()}
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
                registrar
            </>
            )}
            </button>
            {/*NAOOOOOOOOO corta*/}
          </div>
        </div>
        <ListPoints allItems={allpoints} idmapa={idmap} setSelectedPin={setPointSelected} onRefresh={loadPoints} />
      </div>
      
      {showMapModal && (<SelectPointOnMap 
        setShowMapModal={setShowMapModal} 
        setNewPoint={setNewPoint} 
        currentpoint={newPoint}
        allpoints={allpoints} 
        idmap={idmap}
      />)}
    </div>
  );
}