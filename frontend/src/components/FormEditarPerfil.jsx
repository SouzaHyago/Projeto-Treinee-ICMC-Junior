import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/api";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
const formatarDataParaInput = (isoDate) => {
  if (!isoDate) return "";
  try {
    return new Date(isoDate).toISOString().split('T')[0];
  } catch (error) {
    return "";
  }
};

export default function FormEditarPerfil({ currentUser, onExcluirClick }) {
  const { updateUserContext, logout } = useAuth();
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [email, setEmail] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  useEffect(() => {
    if (currentUser) {
      setNome(currentUser.nome || "");
      setCpf(currentUser.cpf || "");
      setEmail(currentUser.email || "");
      setDataNascimento(formatarDataParaInput(currentUser.dataNascimento));
    }
  }, [currentUser]);

  const handleCancel = () => {
    if (currentUser) {
      setNome(currentUser.nome || "");
      setCpf(currentUser.cpf || "");
      setEmail(currentUser.email || "");
      setDataNascimento(formatarDataParaInput(currentUser.dataNascimento));
      setNovaSenha("");
      setConfirmarSenha("");
    }
    
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updates = {};

    if (nome !== currentUser.nome) updates.nome = nome;
    if (email !== currentUser.email) updates.email = email;
    if (cpf !== currentUser.cpf) updates.cpf = cpf;
    if (dataNascimento !== formatarDataParaInput(currentUser.dataNascimento)) {
      updates.dataNascimento = dataNascimento;
    }

    let senhaFoiAlterada = false;
    if (novaSenha) {
      if (!novaSenha) {
        
        return;
      }
      if (novaSenha !== confirmarSenha) {
        toast.warn("As novas senhas não coincidem."); 
        return;
      }
      
      
      updates.senha = novaSenha;
      senhaFoiAlterada = true;
    }

    if (Object.keys(updates).length === 0) {
      toast.info("Nenhuma mudança detectada."); 
      return;
    }

    try {
      const res = await api.put("/users/profile", updates);
      
      updateUserContext(res.data);
      
      toast.success("Perfil atualizado com sucesso!"); 

      if (senhaFoiAlterada) {
        toast.info("Sua senha foi alterada. Por favor, faça login novamente."); 
        logout();
        navigate("/login");
      } else {
        setNovaSenha("");
        setConfirmarSenha("");
      }
      navigate("/");

    } catch (err) {
      console.error("Erro ao atualizar perfil:", err);
       toast.error("Erro ao atualizar perfil: " + (err.response?.data?.error || "Erro desconhecido"));
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="w-3/4 -mt-6"
    >
      <h2 className="text-3xl font-semibold text-gray-800 mb-6 flex justify-center">Editar Perfil</h2>

      <div className="mb-4">
        <label className="block text-gray-700 mb-1">Nome</label>
        <input
          type="text"
          placeholder="Digite seu nome"
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
      </div>

      <div className="flex gap-3 mb-4">
        <div className="flex-1">
          <label className="block text-gray-700 mb-1">CPF</label>
          <input
            type="text"
            placeholder="123.456.789-10"
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
          />
        </div>
        <div className="flex-1">
          <label className="block text-gray-700 mb-1">Data de nascimento</label>
          <input
            type="date"
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={dataNascimento}
            onChange={(e) => setDataNascimento(e.target.value)}
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-1">E-mail</label>
        <input
          type="email"
          placeholder="ana@email.com"
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-1">Nova senha</label>
        <input
          type="password"
          placeholder="Digite a nova senha"
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
          value={novaSenha}
          onChange={(e) => setNovaSenha(e.target.value)}
        />
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 mb-1">Confirmar senha</label>
        <input
          type="password"
          placeholder="Repita a nova senha"
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
          value={confirmarSenha}
          onChange={(e) => setConfirmarSenha(e.target.value)}
        />
      </div>

      <div className="flex gap-10 justify-center mt-10 mb-8">
        <button
          type="button"
          onClick={handleCancel}
          className="px-4 py-2 min-w-[200px]
              text-white bg-[#A0A3A4] 
              rounded-full border-gray-700 shadow-sm 
              hover:bg-[#767676] transition-all"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 min-w-[200px]
              text-white bg-[#40869E]
              rounded-full border-gray-700 shadow-sm 
              hover:bg-[#006186] transition-all"
        >
          Salvar mudanças
        </button>
      </div>

      <p 
        onClick={onExcluirClick}
        className="text-center text-sm text-gray-500 hover:text-red-600 cursor-pointer w-fit mx-auto">
        Excluir minha conta
      </p>
    </form>
  );
}