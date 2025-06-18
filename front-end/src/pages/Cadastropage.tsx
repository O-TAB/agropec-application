import React, { useState } from "react";

const CadastroUsuarioPage = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Aqui a gnt envia os dados pro backend ou salvar localmente
    console.log("Dados enviados:", { nome, email, senha });

    setMensagem("Cadastro enviado para aprovação do Super Admin!");
    
    // Limpar formulário
    setNome("");
    setEmail("");
    setSenha("");
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-lg p-6 rounded-xl">
      <h2 className="text-2xl font-bold text-green-800 mb-4">Cadastro de Novo Usuário</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2 text-gray-700">Nome:</label>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
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
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <button
          type="submit"
          className="mt-4 w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors"
        >
          Enviar Cadastro
        </button>
      </form>

      {mensagem && (
        <p className="mt-4 text-green-700 font-medium">{mensagem}</p>
      )}
    </div>
  );
};

export default CadastroUsuarioPage;
