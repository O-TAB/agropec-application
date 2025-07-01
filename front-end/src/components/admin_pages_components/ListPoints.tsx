import { Edit, Trash2 } from "lucide-react";
import { ResponsePoint} from "../../data/ObjectStructures";
import { DeletePoint } from "../../functions/persistence/CrudPins";
import { useState } from "react";

interface ListItemsProps{
    allItems: ResponsePoint[];
    idmapa: string;
    setSelectedPin: (item: ResponsePoint) => void;
    onRefresh: () => void; // Função para recarregar a lista
}

const ListPoints: React.FC<ListItemsProps> = ({allItems, idmapa, setSelectedPin, onRefresh}) =>{
    const [isDeleting, setIsDeleting] = useState<number | null>(null);

    const handleDelete = async (pointId: number) => {
        if (window.confirm('Tem certeza que deseja deletar este ponto?')) {
            setIsDeleting(pointId);
            try {
                const success = await DeletePoint(pointId, idmapa);
                if (success) {
                    onRefresh(); // Recarrega a lista após deletar
                } else {
                    alert('Erro ao deletar o ponto. Tente novamente.');
                }
            } catch (error) {
                alert('Erro ao deletar o ponto. Tente novamente.');
            } finally {
                setIsDeleting(null);
            }
        }
    };

    return(
    <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="max-h-[600px] overflow-y-auto pr-2">
            <h3 className="text-xl font-bold text-green-600 my-2">Points</h3>
            {allItems.map((point: ResponsePoint)=> (
                <div key={point.id} className="flex justify-between items-center p-2 border-b group">
                    <p className="font-semibold">{point.name}</p>
                    <p className="text-xs text-gray-500">ID: {point.id}</p>
                <button onClick={() => setSelectedPin(point)} title="editar Item" className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-100 rounded-full transition-colors">
                    <Edit size={18} />
                </button>
                <button 
                    onClick={() => handleDelete(point.id)} 
                    disabled={isDeleting === point.id}
                    title="Apagar Item" 
                    className={`p-2 text-gray-400 hover:text-red-500 hover:bg-red-100 rounded-full transition-colors ${
                        isDeleting === point.id ? 'opacity-50 cursor-not-allowed' : ''
                    }`}>
                    <Trash2 size={18} />
                </button>
                </div>
            ))
            
            }
        </div>
    </div>);
}

export default ListPoints;