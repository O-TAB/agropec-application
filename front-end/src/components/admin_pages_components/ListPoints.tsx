import { Edit, Trash2 } from "lucide-react";
import { StandEventResponse, point } from "../../data/ObjectStructures";
import { DeletePoint } from "../../functions/persistence/CrudPins";


interface ListItemsProps{
    allItems: point[];
    idmapa: string;
    setSelectedPin: (item: point) => void;
}

const ListPoints: React.FC<ListItemsProps> = ({allItems, idmapa, setSelectedPin}) =>{
    return(
    <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="max-h-[600px] overflow-y-auto pr-2">
            <h3 className="text-xl font-bold text-green-600 my-2">Points</h3>
            {allItems.map((point: point)=> (
                <div key={point.id} className="flex justify-between items-center p-2 border-b group">
                    <p className="font-semibold">{point.name}</p>
                    <p className="text-xs text-gray-500">ID: {point.id}</p>
                <button onClick={() => setSelectedPin(point)} title="editar Item" className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-100 rounded-full transition-colors">
                    <Edit size={18} />
                </button>
                <button 
                    onClick={() => DeletePoint(point.id, idmapa)} 
                    title="Apagar Item" 
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-100 rounded-full transition-colors">
                    <Trash2 size={18} />
                </button>
                </div>
            ))
            
            }
        </div>
    </div>);
}

export default ListPoints;