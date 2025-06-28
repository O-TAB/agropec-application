import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RegisterNewUser, UpdateUser } from "../../functions/persistence/CrudUsers";
import { RegisterUserRequest, UserRole } from "../../data/ObjectStructures";

interface RegisterPageProps {
  mode?: 'create' | 'edit';
  userToEdit?: {
    id: string;
    username: string;
    email: string;
    role: UserRole;
  };
  onSuccess?: () => void;
}

const CadastroUsuarioPage: React.FC<RegisterPageProps> = ({ 
  mode = 'create', 
  userToEdit, 
  onSuccess 
}) => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("USER");
  const roles: UserRole[] = ['SUPER_ADMIN', 'ADMIN', 'USER'];

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Preencher formulário quando estiver em modo de edição
  useEffect(() => {
    if (mode === 'edit' && userToEdit) {
      setUserName(userToEdit.username);
      setEmail(userToEdit.email);
      setRole(userToEdit.role);
      setPassword(""); // Senha vazia para edição
    }
  }, [mode, userToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    const userData: RegisterUserRequest = {
      username: userName,
      email: email,
      password: password,
      role: role,
    };

    try {
      if (mode === 'edit' && userToEdit) {
        // Modo de atualização
        await UpdateUser(userToEdit.id, userData);
        setMessage("SUCESSO: Usuário atualizado com sucesso!");
      } else {
        // Modo de criação
        await RegisterNewUser(userData);
        setMessage("SUCESSO: Usuário cadastrado com sucesso!");
      }

      // Limpar formulário apenas se for criação
      if (mode === 'create') {
        setUserName("");
        setEmail("");
        setPassword("");
        setRole("USER");
      }

      // Chamar callback de sucesso se fornecido
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Erro ao processar solicitação");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1); // Volta para a página anterior
  };

  const getTitle = () => {
    return mode === 'edit' ? 'Editar Usuário' : 'Cadastro de Novo Usuário';
  };

  const getButtonText = () => {
    if (isLoading) {
      return mode === 'edit' ? 'Atualizando...' : 'Cadastrando...';
    }
    return mode === 'edit' ? 'Atualizar Usuário' : 'Enviar Cadastro';
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-lg p-6 rounded-xl">
      {/* Botão Voltar */}
      <button
        onClick={handleGoBack}
        className="mb-4 flex items-center text-gray-600 hover:text-gray-800 transition-colors"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Voltar
      </button>

      <h2 className="text-2xl font-bold text-green-800 mb-4">{getTitle()}</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2 text-gray-700">Nome:</label>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <label className="block mb-2 text-gray-700 mt-4">Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <label className="block mb-2 text-gray-700 mt-4">
          Senha: {mode === 'edit' && <span className="text-sm text-gray-500">(deixe em branco para manter a atual)</span>}
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required={mode === 'create'}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <label className="block mb-2 text-gray-700 mt-4">Tipo de Usuário:</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as UserRole)}
          required
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
        >
          {roles.map((role_i) => (
            <option key={role_i} value={role_i}>
              {role_i.replace('_', ' ')}
            </option>
          ))}
        </select>

        <button
          type="submit"
          disabled={isLoading} 
          className="mt-6 w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400"
        >
          {getButtonText()}
        </button>
      </form>

      {message && (
        <p className="mt-4 text-green-700 font-medium">{message}</p>
      )}
      {error && (
        <p className="mt-4 text-center text-red-600 font-medium">{error}</p>
      )}
    </div>
  );
};

export default CadastroUsuarioPage;
