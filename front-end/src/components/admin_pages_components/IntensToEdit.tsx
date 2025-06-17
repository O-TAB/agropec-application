import { Edit, Trash2 } from "lucide-react";
import { imageMap, ItemType } from '../../data/pinsData';

const Itemstoedit: React.FC<{ item: ItemType; setSelectedPin: (item: ItemType) => void; handleFutureFeatureClick: (arg: string) => void }>
= ({ item, setSelectedPin, handleFutureFeatureClick }) => (
    <div key={item.id} className="flex justify-between items-center p-2 border-b group">
        <div className="w-3/4">
            <div className="w-full h-20 overflow-hidden rounded-t-2xl">
                <img
                    src={item.image && imageMap[item.image as keyof typeof imageMap] 
                        ? imageMap[item.image as keyof typeof imageMap] 
                        : 'https://via.placeholder.com/400x200?text=Sem+Imagem'}
                    alt={item.title}
                    className="w-full rounded-t-xl"
                />
            </div>
            <p className="font-semibold">{item.title}</p>
            <p className="text-xs text-gray-500">ID: {item.id}</p>
        </div>
        <button onClick={() => setSelectedPin(item)} title="editar Item" className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-100 rounded-full transition-colors">
            <Edit size={18} />
        </button>
        <button onClick={() => handleFutureFeatureClick(`Apagar '${item.title}'`)} title="Apagar Item" className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-100 rounded-full transition-colors">
            <Trash2 size={18} />
        </button>
    </div>
);

export default Itemstoedit;