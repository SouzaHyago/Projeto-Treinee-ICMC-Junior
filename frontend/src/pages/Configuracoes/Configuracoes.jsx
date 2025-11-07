import { useState } from 'react';
import FormEditarPerfil from '@/components/FormEditarPerfil';
import ExcluirConta from '../../modals/ExcluirConta';
import { useAuth } from '@/context/AuthContext';
import api from '@/api';

export default function Configuracoes() {
  const CUSTOM_BG_COLOR = "bg-[#F7FCFE]";
  const [openModal, setOpenModal] = useState(false);
  
  const { user, logout } = useAuth();

  const handleConfirmExcluir = async () => {
    try {
      await api.patch("/users/profile"); 
      setOpenModal(false);
      alert("Conta excluída com sucesso.");
      logout(); 
    } catch (error) {
      console.error("Erro ao excluir conta:", error);
      alert("Não foi possível excluir sua conta. Tente novamente.");
    }
  };

  return (
    <>
      <div className={`${CUSTOM_BG_COLOR} rounded-[50px] container p-8 w-full max-w-6xl shadow-xl backdrop-blur-sm`}>
        <h1 className="text-[36px] font-bold text-gray-800">Configurações</h1>
        <div className="flex justify-center mt-8">
          <FormEditarPerfil 
            currentUser={user} 
            onExcluirClick={() => setOpenModal(true)}
          />
        </div>
      </div>
      <ExcluirConta
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onConfirm={handleConfirmExcluir}
      />
    </>
  );
}