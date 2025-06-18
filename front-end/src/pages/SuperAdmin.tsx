import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SuperAdminPage = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([
    { id: 1, name: "João Silva" },
    { id: 2, name: "Maria Souza" },
    { id: 3, name: "Carlos Lima" },
  ]);

  const handleEdit = (id: number) => {
    alert(`Editar usuário com ID: ${id}`);
  };

  const handleDelete = (id: number) => {
    setUsers((prev) => prev.filter((user) => user.id !== id));
  };

  const handleLogout = () => {
    navigate("/login");
  };

  const handleNavigateToRegister = () => {
    navigate("/cadastro");
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-xl">
      <h1 className="text-3xl font-bold text-green-800 mb-6">Painel Super Admin</h1>

      {/* Total de Usuários */}
      <p className="text-lg mb-4">Total de Funcionários Cadastrados: {users.length}</p>

      {/* Botão de Cadastro */}
      <button
        onClick={handleNavigateToRegister}
        className="mb-6 w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
      >
        Cadastrar Novo Funcionário
      </button>

      {/* Lista de Usuários */}
      <div className="space-y-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="border p-4 rounded-md flex items-center justify-between bg-gray-50"
          >
            <div>
              <p className="font-semibold">{user.name}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(user.id)}
                className="bg-yellow-500 text-white px-3 py-1 rounded-md"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(user.id)}
                className="bg-gray-500 text-white px-3 py-1 rounded-md"
              >
                Deletar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="mt-8 w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
};

export default SuperAdminPage;
