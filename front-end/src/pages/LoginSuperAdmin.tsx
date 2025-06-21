import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


const LoginSuperAdmin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { LoginSuperAdmin } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const success = await LoginSuperAdmin(email, password);
      if (success) {
        navigate('/superadmin');
      } else {
        setError('Usuário ou senha inválidos.');
      }
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro ao tentar fazer login. Verifique sua conexão.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-green-800 mb-6">
          Login Super Admin
        </h2>
        <form onSubmit={handleLogin}>
          <label className="block mb-2 text-gray-700">Usuário:</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <label className="block mt-4 mb-2 text-gray-700">Senha:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          {error && <p className="text-red-600 mt-2">{error}</p>}

          <button
            type="submit"
            className="mt-6 w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginSuperAdmin;
