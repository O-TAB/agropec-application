import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { allPins } from '../data/pinsData';
import { useAuth } from '../context/AuthContext';
import { Trash2, Map, PlusCircle, AlertCircle, Upload } from 'lucide-react';

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const finalValue = (name === 'x' || name === 'y') ? Number(value) : value;
    setNewItem({ ...newItem, [name]: finalValue });
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
          <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Adicionar Novo Item</h2>
          <div className="space-y-4">
            <input type="text" name="title" placeholder="Título do Stand/Evento" value={newItem.title} onChange={handleInputChange} className="w-full p-2 border rounded"/>
            <select name="category" value={newItem.category} onChange={handleInputChange} className="w-full p-2 border rounded bg-white">
              <option value="stand">Stand</option>
              <option value="event">Evento</option>
            </select>
            <textarea name="description" placeholder="Descrição" value={newItem.description} onChange={handleInputChange} className="w-full p-2 border rounded" rows={3}></textarea>
            
            <div className="p-4 border rounded-lg bg-gray-50 space-y-3">
              <label className="block text-sm font-medium text-gray-600">Imagem do Item</label>
              <div className="flex items-center gap-4">
                <input type="text" name="image" placeholder="Nome do Arquivo (ex: imagem_novo.jpg)" value={newItem.image} onChange={handleInputChange} className="w-full p-2 border rounded"/>
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                <button onClick={() => fileInputRef.current?.click()} className="p-2.5 bg-gray-600 text-white rounded hover:bg-gray-700 transition" title="Carregar imagem para preview">
                  <Upload size={20}/>
                </button>
              </div>
              {imagePreview && (
                <div className='mt-4'>
                  <p className='text-xs text-gray-500 mb-2'>Pré-visualização:</p>
                  <img src={imagePreview} alt="Preview" className="w-full h-32 object-cover rounded-md border" />
                </div>
              )}
            </div>

            <input type="text" name="operatingHours" placeholder="Horário (ex: 09:00 - 22:00)" value={newItem.operatingHours} onChange={handleInputChange} className="w-full p-2 border rounded"/>
            
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
                
                <Link to="/mapa" target="_blank" title="Abrir o mapa para consultar a posição" className="flex-shrink-0 p-2.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                  <Map size={20} />
                </Link>
              </div>
            </div>

            <button 
              onClick={() => handleFutureFeatureClick('Adicionar Item')} 
              className="w-full p-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
            >
              <PlusCircle size={20} />
              Adicionar ao Mapa
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
           <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Itens Atuais</h2>
           <div className="max-h-[600px] overflow-y-auto pr-2">
             <h3 className="text-xl font-bold text-green-600 my-2">Stands</h3>
             {allPins.filter(p => p.category === 'stand').map(pin => (
               <div key={pin.id} className="flex justify-between items-center p-2 border-b group">
                 <div>
                   <p className="font-semibold">{pin.title}</p>
                   <p className="text-xs text-gray-500">ID: {pin.id}</p>
                 </div>
                 <button onClick={() => handleFutureFeatureClick(`Apagar '${pin.title}'`)} title="Apagar Item" className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-100 rounded-full">
                   <Trash2 size={18} />
                 </button>
               </div>
             ))}
             <h3 className="text-xl font-bold text-green-600 my-2 mt-6">Eventos</h3>
             {allPins.filter(p => p.category === 'event').map(pin => (
               <div key={pin.id} className="flex justify-between items-center p-2 border-b group">
                 <div>
                   <p className="font-semibold">{pin.title}</p>
                   <p className="text-xs text-gray-500">ID: {pin.id}</p>
                 </div>
                 <button onClick={() => handleFutureFeatureClick(`Apagar '${pin.title}'`)} title="Apagar Item" className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-100 rounded-full">
                   <Trash2 size={18} />
                 </button>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
}
