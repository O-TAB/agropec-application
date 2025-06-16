import React, { useState } from 'react';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const adminUser = 'admin';
  const adminPass = '123456';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (username === adminUser && password === adminPass) {
      setError('');
      alert('Login realizado com sucesso!');
      // Redirecionamento futuro: navigate('/admin-dashboard');
    } else {
      setError('Usuário ou senha inválidos.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-green-800 mb-6">Login do Administrador</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Usuário:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Digite seu usuário"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Senha:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Digite sua senha"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-green-700 text-white py-2 rounded-md hover:bg-green-800 transition-colors"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
