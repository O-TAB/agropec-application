 import { Info } from "lucide-react";
 import { imageMap, ItemType } from '../data/pinsData';



const ItemCard: React.FC<{ item: ItemType; setSelectedPin: (item: ItemType) => void}> = ({ item, setSelectedPin }) => (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
        <img
        src={imageMap[item.image as keyof typeof imageMap] || 'https://via.placeholder.com/400x200?text=Sem+Imagem'}
        alt={item.title}
        className="w-full h-48 object-cover rounded-t-xl"
        />
        <div className="p-4 flex flex-col flex-grow">
        <h2 className="text-xl font-semibold text-green-800">{item.title}</h2>
        <p className="text-sm text-gray-600 mb-4 mt-1 flex-grow">{item.description}</p>
        <button
            onClick={() => setSelectedPin(item)} // Abre o pop-up ao clicar
            className="mt-auto w-full py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
            >
            <Info size={18} />
            Saber Mais
        </button>
        </div>
    </div>
);

export default ItemCard;