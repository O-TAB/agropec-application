import { Edit, Trash2 } from "lucide-react";
import { StandEventResponse } from "../../data/ObjectStructures";
import { DeletePin } from "../../functions/persistence/CrudPins";
import { useState } from "react";

interface ListToStandsAndEventsProps {
    allItems: StandEventResponse[];
    setSelectedPin: (item: StandEventResponse) => void;
    onRefresh: () => void; // Função para recarregar a lista
    type: string; // 'stands' ou 'events'
}

const ListToStandsAndEvents: React.FC<ListToStandsAndEventsProps> = ({allItems, setSelectedPin, onRefresh, type}) => {
    const [isDeleting, setIsDeleting] = useState<number | null>(null);

    const handleDelete = async (itemId: number) => {
        if (window.confirm(`Tem certeza que deseja deletar este ${type === 'stands' ? 'stand' : 'evento'}?`)) {
            setIsDeleting(itemId);
            try {
                const success = await DeletePin(itemId, type);
                if (success) {
                    onRefresh(); // Recarrega a lista após deletar
                } else {
                    alert(`Erro ao deletar o ${type === 'stands' ? 'stand' : 'evento'}. Tente novamente.`);
                }
            } catch (error) {
                alert(`Erro ao deletar o ${type === 'stands' ? 'stand' : 'evento'}. Tente novamente.`);
            } finally {
                setIsDeleting(null);
            }
        }
    };

    return(
    <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="max-h-[600px] overflow-y-auto pr-2">
            <h3 className="text-xl font-bold text-green-600 my-2">{type === 'stands' ? 'Stands' : 'Eventos'}</h3>
            {allItems.map((item: StandEventResponse) => (
                <div key={item.id} className="flex justify-between items-center p-2 border-b group">
                    <div className="flex items-center gap-3 flex-1">
                        <div className="w-12 h-12 overflow-hidden rounded-lg flex-shrink-0">
                            <img
                                src={item.img}
                                alt={item.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold truncate">{item.name}</p>
                            <p className="text-xs text-gray-500">ID: {item.id}</p>
                        </div>
                    </div>
                    <div className="flex gap-1">
                        <button 
                            onClick={() => setSelectedPin(item)} 
                            title="editar Item" 
                            className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-100 rounded-full transition-colors"
                        >
                            <Edit size={18} />
                        </button>
                        <button 
                            onClick={() => handleDelete(item.id)} 
                            disabled={isDeleting === item.id}
                            title="Apagar Item" 
                            className={`p-2 text-gray-400 hover:text-red-500 hover:bg-red-100 rounded-full transition-colors ${
                                isDeleting === item.id ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    </div>);
}

export default ListToStandsAndEvents;
