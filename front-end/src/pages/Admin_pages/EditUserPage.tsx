import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { GetAllUsers } from "../../functions/persistence/CrudUsers";
import CadastroUsuarioPage from "./RegisterPage";
import { UserRole } from "../../data/ObjectStructures";

interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
}

const EditUserPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { token, logout } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token || !userId) {
        setError("Token de autenticação ou ID do usuário não encontrado.");
        setLoading(false);
        logout();
        return;
      }

      try {
        const users = await GetAllUsers();
        const foundUser = (users as User[]).find(u => u.id === userId);
        
        if (!foundUser) {
          throw new Error("Usuário não encontrado");
        }

        setUser(foundUser);
        setError(null);

      } catch (err: any) {
        console.error(err);
        setError(err.message || "Erro ao buscar usuário");
        if (err.message?.includes('401') || err.message?.includes('403')) {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token, userId, logout]);

  const handleSuccess = () => {
    navigate("/Users");
  };

  if (loading) {
    return <div className="text-center mt-10">Carregando dados do usuário...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-600">Erro: {error}</div>;
  }

  if (!user) {
    return <div className="text-center mt-10 text-red-600">Usuário não encontrado</div>;
  }

  return (
    <CadastroUsuarioPage
      mode="edit"
      userToEdit={user}
      onSuccess={handleSuccess}
    />
  );
};

export default EditUserPage; 