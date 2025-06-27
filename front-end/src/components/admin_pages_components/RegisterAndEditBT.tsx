import React, { useState } from "react";
import { PlusCircle, Save, Loader2 } from "lucide-react";
import { UpdatePin, RegisterNewpin } from "../../functions/persistence/CrudPins";
import { StandEventResponse } from "../../data/ObjectStructures";

// ele tem o 'onsavesuccess' pra avisar o arquivo principal (do admin) quando terminar.
interface ValuesProps {
  isEditing: boolean;
  newItem: StandEventResponse;
  idmap: string | undefined;
  onSaveSuccess: () => void;
}

const tipo = 'stands'; 

const RegisterAndEditBT: React.FC<ValuesProps> = ({ isEditing, newItem, idmap, onSaveSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);

  // virou 'async' pra gente poder "esperar" a api responder 
  // (mas pode mudar pq eu só vi no goglis e achei legal de colocar, nao sei se funciona sla)
  const handleSubmit = async () => {
    if (!isEditing && !idmap) {
      alert("ID do mapa não informado. Não é possível registrar um novo stand.");
      return;
    }

    setIsLoading(true); 

    try {
      if (isEditing) {
        // o 'await' faz esperar a api terminar de salvar a edição muehehhe
        await UpdatePin(newItem, newItem.id, tipo);
        alert("Stand atualizado com sucesso.");
      } else {
        const pinToSend = {
          ...newItem,
          point: { ...newItem.point, id: 0 }
        };
        await RegisterNewpin(pinToSend, idmap!, tipo);
        alert("Novo stand registrado com êxito.");
      }
      
      onSaveSuccess();

    } catch (error) {
      // se der alguma coisa na api, o 'catch' pega o erro pra não quebrar tudo amaro?
      console.error("Erro ao salvar os dados do stand:", error);
      alert("Ocorreu um erro ao salvar o stand. Verifique o console (F12) para mais detalhes.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleSubmit}
      disabled={isLoading} // trava o botão se estiver carregando, pra evitar clique duplo (achei foda e quis fazer isso slk)
      className={`w-full p-3 font-bold rounded-lg flex items-center justify-center gap-2 transition-colors ${
        isEditing
          ? 'bg-blue-600 text-white hover:bg-blue-700'
          : 'bg-green-600 text-white hover:bg-green-700'
      } disabled:bg-gray-400 disabled:cursor-not-allowed`}
    >
      {isLoading ? (
        <>
          <Loader2 size={20} className="animate-spin" />
          {isEditing ? 'Salvando...' : 'Registrando...'}
        </>
      ) : isEditing ? (
        <>
          <Save size={20} />
          Salvar alterações
        </>
      ) : (
        <>
          <PlusCircle size={20} />
          Registrar stand
        </>
      )}
    </button>
  );
}

export default RegisterAndEditBT;
