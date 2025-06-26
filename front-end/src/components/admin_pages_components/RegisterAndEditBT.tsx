
import { UpdatePin, RegisterNewpin } from "../../functions/api";
import { StandEventPost } from "../../data/RequestStructures";

import React from "react";
import { PlusCircle, Save } from "lucide-react";

interface valuesProps{
    isEditing: boolean;
    newItem: StandEventPost;
}


const testidmap = '7fa6db58-91e0-4d58-9408-07050a1604ec';
const tipo = 'stands';

const RegisterAndEditBT: React.FC<valuesProps> =({isEditing, newItem}) => {
    
    const handleSubmit = () => {
    if (isEditing) {
      UpdatePin(newItem, newItem.name, tipo);
    } else {
      const pinToSend = {
        ...newItem,
        descriptionCard: newItem.descriptionCard,
        point: {
          ...newItem.point,
          id: 0
        }
      };
      RegisterNewpin(pinToSend, testidmap, tipo);
    }
  };

    return(
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
            Adicionar ao Mapa
        </>
        )}
        </button>)
}

export default RegisterAndEditBT;