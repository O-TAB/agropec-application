
import { UpdatePin, RegisterNewpin } from "../../functions/persistence/CrudPins";
import { StandEventPost, StandEventResponse } from "../../data/ObjectStructures";

import React from "react";
import { PlusCircle, Save } from "lucide-react";

interface valuesProps{
    isEditing: boolean;
    item: StandEventResponse;
    idmap: string | undefined;
}

const tipo = 'stands';

const RegisterAndEditBT: React.FC<valuesProps> =({isEditing, item, idmap}) => {
    
    const handleSubmit = () => {
    if (isEditing) {

      UpdatePin(item, item.id, tipo);
    } else if(idmap){
      const pinToSend = {
        ...item,
        descriptionCard: item.descriptionCard,
        point: {
          ...item.point,
          id: 0
        }
      };
      RegisterNewpin(pinToSend, idmap, tipo);
    }else{
      console.log("Erro ")
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
            registrar
        </>
        )}
        </button>)
}

export default RegisterAndEditBT;