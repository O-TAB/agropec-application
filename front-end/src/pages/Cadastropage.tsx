import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'USER';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole
}

const CadastroUsuarioPage = () => {
  const {token} = useAuth();
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    const userData = {
      username: userName,
      email: email,
      password: password,
      role: role,
    };

    // Aqui a gnt envia os dados pro backend ou salvar localmente
    try {
      const response = await fetch(`http://localhost:8080/auth/login/register`, {
        method: 'POST',
        headers: {
          'Content-Type' : 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData)
      });

      if(!response.ok){
        const errorData = await response.json();
        throw new Error(errorData.message || 'ERRO ${response.status}: Falha ao cadastrar usuário.');
      }

      setMessage("SUCESSO: Usuário cadastrado com sucesso!");

      // Limpar formulário
      setUserName("");
      setEmail("");
      setPassword("");
      setRole("");
    } catch(err: any){
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-lg p-6 rounded-xl">
      <h2 className="text-2xl font-bold text-green-800 mb-4">Cadastro de Novo Usuário</h2>
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

        <label className="block mb-2 text-gray-700 mt-4">Senha:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <label className="block mb-2 text-gray-700 mt-4">Tipo de Usuário:</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
        >
          <option value="USER">Usuário</option>
          <option value="ADMIN">Admin</option>
          <option value="SUPER_ADMIN">Super Admin</option>
        </select>

        <button
          type="submit"
          disabled={isLoading} 
          className="mt-6 w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400"
        >
          {isLoading ? 'Cadastrando...' : 'Enviar Cadastro'}
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
