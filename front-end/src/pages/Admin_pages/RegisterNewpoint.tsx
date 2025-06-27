import React, { useState, useRef, useEffect } from 'react';

import { useAuth } from '../../context/AuthContext';
import { MousePointer, Save, PlusCircle } from 'lucide-react';

import {debugdata, getMypoints, getFirstMapId} from '../../functions/persistence/api';
import { emptypoint, point } from '../../data/ObjectStructures';
import SelectPointOnMap from '../../components/admin_pages_components/SelectPointOnMap';
import { useNavigate} from 'react-router-dom';
import { RegisterNewPoint, UpdatePoint } from '../../functions/persistence/CrudPins';

import NameToPin from '../../components/admin_pages_components/NameToPin';
import ListPoints from '../../components/admin_pages_components/ListPoints';

const navigate = useNavigate();

export default function Registernewpoint() {
  const { logout } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newPoint, setNewPoint] = useState<point>(emptypoint);
  const [itemSelected, setItemSelected] = useState<point | null>(null);

  const [isEditing, setIsEditing] = useState(false);

  const [showMapModal, setShowMapModal] = useState(false);
  const [allpoints, setPoints] = useState< point[]>([]);
  const [idmap, setidmap] = useState<string>('');
  

  useEffect(() => {
    getFirstMapId().then((idmap) => {
          if (idmap) {
            setidmap(idmap);
          }else{
            navigate('/uploadmap');
          }
        });  
    getMypoints(idmap).then((data) => setPoints(data));    
  }, []);

  // Auto-preenchimento dos inputs quando um item é selecionado
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
    if (isEditing) {
      UpdatePoint(newPoint, newPoint.id, idmap);
    } else if(idmap){
      RegisterNewPoint(newPoint, idmap);
      setNewPoint(emptypoint);
    }else{
      console.log("Erro ")
    }
  };

  const handleCancelEdit = () => {
    setItemSelected(null);
    setIsEditing(false);
    setNewPoint(emptypoint);
  };

  debugdata();

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-green-800">Gerenciar pontos</h1>
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
                registrar
            </>
            )}
            </button>
            {/*NAOOOOOOOOO corta*/}
          </div>
        </div>
        <ListPoints allItems={allpoints} idmapa={idmap} setSelectedPin={setItemSelected} />
      </div>
      
      {showMapModal && (<SelectPointOnMap 
        setShowMapModal={setShowMapModal} 
        setNewpoint={setNewPoint} 
        allpoints={allpoints} 
        newpoint={newPoint}  />)}
    </div>
  );
}