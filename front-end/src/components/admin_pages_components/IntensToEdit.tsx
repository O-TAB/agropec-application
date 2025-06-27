import { Edit, Trash2 } from "lucide-react";
import { imageMap} from '../../data/pinsData';
import { StandEventResponse } from "../../data/ObjectStructures";
import { DeletePin } from "../../functions/persistence/CrudPins";

interface ItemstoeditProps {
    item: StandEventResponse ;
    setSelectedPin: (item: StandEventResponse) => void;
    type: string;
}

const Itemstoedit: React.FC<ItemstoeditProps>
= ({ item, setSelectedPin, type}) => (
    <div key={item.id} className="flex justify-between items-center p-2 border-b group">
        <div className="w-3/4">
            <div className="w-full h-20 overflow-hidden rounded-t-2xl">
                <img
                    src={imageMap[item.img as keyof typeof imageMap]}
                    alt={item.name}
                    className="w-full rounded-t-xl"
                />
            </div>
            <p className="font-semibold">{item.name}</p>
            <p className="text-xs text-gray-500">ID: {item.id}</p>
        </div>
        <button onClick={() => setSelectedPin(item)} title="editar Item" className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-100 rounded-full transition-colors">
            <Edit size={18} />
        </button>
        <button 
            onClick={() => DeletePin(item.id, type)} 
            title="Apagar Item" 
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-100 rounded-full transition-colors">
            <Trash2 size={18} />
        </button>
    </div>
);

export default Itemstoedit;