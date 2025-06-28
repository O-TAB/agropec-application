import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { DeleteUser, GetAllUsers } from "../../functions/persistence/CrudUsers";

type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'USER';

interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole
}

const SuperAdminPage = () => {
  const navigate = useNavigate();
  const { token, logout } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    if (!token) {
      setError("Token de autenticação não encontrado.");
      setLoading(false);
      logout();
      return;
    }

    try {
      const data = await GetAllUsers();
      setUsers(data as User[]); 
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Erro ao buscar usuários");
      if (err.message?.includes('401') || err.message?.includes('403')) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token, logout]);

  const handleEdit = (id: string) => {
    navigate(`/edit-user/${id}`);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja deletar este usuário?")) {
      return;
    }

    try {
      await DeleteUser(id);
      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Erro ao deletar usuário");
    }
  };

  const handleLogout = () => {
    logout();
  };

  const handleNavigateToRegister = () => {
    navigate("/cadastro");
  };

  if (loading) {
    return <div className="text-center mt-10">Carregando usuários...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-600">Erro: {error}</div>;
  }

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
              <p className="font-semibold">{user.username}</p>
              <p className="text-sm text-gray-600">{user.email}</p>
              <p className="text-xs text-gray-500">Role: {user.role.replace('_', ' ')}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(user.id)}
                className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(user.id)}
                className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
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
