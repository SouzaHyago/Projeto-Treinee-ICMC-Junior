import { useState } from "react";

export default function FormEditarPerfil({ onExcluirClick }) {
  const [openModal, setOpenModal] = useState(false);

  const handleExcluirConta = () => {
    onExcluirClick();
  };

  return (
    <form className="bg-[#F7FCFE] rounded-2xl p-10 w-full max-w-lg shadow-sm border border-gray-200">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Editar Perfil</h2>


      <div className="mb-4">
        <label className="block text-gray-700 mb-1">Nome</label>
        <input
          type="text"
          placeholder="Digite seu nome"
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </div>

      <div className="flex gap-3 mb-4">
        <div className="flex-1">
          <label className="block text-gray-700 mb-1">CPF</label>
          <input
            type="text"
            placeholder="123.456.789-10"
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
        <div className="flex-1">
          <label className="block text-gray-700 mb-1">Data de nascimento</label>
          <input
            type="date"
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-1">E-mail</label>
        <input
          type="email"
          placeholder="ana@email.com"
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-1">Senha atual</label>
        <input
          type="password"
          placeholder="Digite sua senha atual"
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </div>

      
      <div className="mb-4">
        <label className="block text-gray-700 mb-1">Nova senha</label>
        <input
          type="password"
          placeholder="Digite a nova senha"
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </div>

      
      <div className="mb-6">
        <label className="block text-gray-700 mb-1">Confirmar senha</label>
        <input
          type="password"
          placeholder="Repita a nova senha"
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </div>


      <div className="flex gap-4 justify-center mb-4">
        <button
          type="submit"
          className="bg-[#84A7B8] text-white px-6 py-2 rounded-full hover:bg-[#6b95a5] transition-all"
        >
          Salvar mudanças
        </button>
        <button
          type="button"
          className="bg-gray-300 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-400 transition-all"
        >
          Cancelar
        </button>
      </div>

      
      <p 
        onClick={handleExcluirConta}
        className="text-center text-sm text-gray-500 hover:text-red-600 cursor-pointer">
        Excluir minha conta
      </p>
    </form>
  );
}
