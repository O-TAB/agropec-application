gimport React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

import {
  StandEventPost,
  StandEventResponse,
  emptypoint,
  emptyStandEvent,
  point
} from "../../data/ObjectStructures";

import { getFirstMapId, getMyObjectsStands } from "../../functions/persistence/api";
import { RegisterNewStand, UpdateStand } from "../../functions/persistence/CrudStands";

import NameToPin from "../../components/admin_pages_components/NameToPin";
import SelectPointOnMap from "../../components/admin_pages_components/SelectPointOnMap";
import ListStands from "../../components/admin_pages_components/ListStands";

const RegisterNewStand: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [idmap, setidmap] = useState<string>("");
  const [allStands, setAllStands] = useState<StandEventResponse[]>([]);

  const [newStand, setNewStand] = useState<StandEventPost>(emptyStandEvent);
  const [itemSelected, setItemSelected] = useState<StandEventResponse | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);

  const loadStands = async () => {
    if (!idmap) return;
    const data = await getMyObjectsStands(); // aqui deve vir a lista de stands do back-end
    setAllStands(data);
  };

  useEffect(() => {
    getFirstMapId().then((id) => {
      if (id) {
        setidmap(id);
      } else {
        navigate("/uploadmap");
      }
    });
  }, [navigate]);

  useEffect(() => {
    loadStands();
  }, [idmap]);

  useEffect(() => {
    if (itemSelected) {
      setNewStand(itemSelected);
      setIsEditing(true);
    } else {
      setNewStand(emptyStandEvent);
      setIsEditing(false);
    }
  }, [itemSelected]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewStand({ ...newStand, [name]: value });
  };

  const handleSubmit = async () => {
    if (!newStand.name || !newStand.description || !newStand.descriptionCard || !newStand.img) {
      alert("Preencha todos os campos.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing && itemSelected?.id !== undefined) {
        const success = await UpdateStand(newStand, itemSelected.id, idmap);
        if (success) {
          alert("Stand atualizado!");
          setItemSelected(null);
          await loadStands();
        } else {
          alert("Erro ao atualizar.");
        }
      } else {
        const success = await RegisterNewStand(newStand, idmap);
        if (success) {
          alert("Stand registrado!");
          setNewStand(emptyStandEvent);
          await loadStands();
        } else {
          alert("Erro ao registrar.");
        }
      }
    } catch (err) {
      alert("Erro inesperado.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-green-800">Gerenciar Stands</h1>
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Sair
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded shadow space-y-4">
          <h2 className="text-xl font-semibold">
            {isEditing ? "Editar Stand" : "Novo Stand"}
          </h2>

          <NameToPin
            title="Nome do Stand"
            value={newStand.name}
            handleInputChange={handleInputChange}
          />

          <textarea
            name="description"
            placeholder="Descrição Completa"
            value={newStand.description}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
          <textarea
            name="descriptionCard"
            placeholder="Descrição do Cartão"
            value={newStand.descriptionCard}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="img"
            placeholder="URL da Imagem"
            value={newStand.img}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />

          <div className="flex gap-2">
            <input
              type="number"
              name="x"
              placeholder="X"
              value={newStand.point.x}
              onChange={(e) =>
                setNewStand({ ...newStand, point: { ...newStand.point, x: +e.target.value } })
              }
              className="w-full p-2 border rounded"
            />
            <input
              type="number"
              name="y"
              placeholder="Y"
              value={newStand.point.y}
              onChange={(e) =>
                setNewStand({ ...newStand, point: { ...newStand.point, y: +e.target.value } })
              }
              className="w-full p-2 border rounded"
            />
            <button
              onClick={() => setShowMapModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Ponto no Mapa
            </button>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`w-full py-2 font-semibold rounded ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : isEditing
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-green-600 hover:bg-green-700"
            } text-white`}
          >
            {isSubmitting
              ? "Salvando..."
              : isEditing
              ? "Salvar Alterações"
              : "Registrar Stand"}
          </button>
        </div>

        <ListStands
          allItems={allStands}
          idmapa={idmap}
          setSelectedItem={setItemSelected}
          onRefresh={loadStands}
        />
      </div>

      {showMapModal && (
        <SelectPointOnMap
          setShowMapModal={setShowMapModal}
          setNewPoint={(point: point) =>
            setNewStand({ ...newStand, point })
          }
          allpoints={allStands.map((s) => s.point)}
        />
      )}
    </div>
  );
};

export default RegisterNewStand;
