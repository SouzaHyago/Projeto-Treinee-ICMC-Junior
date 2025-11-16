import { useState } from 'react';
import FormEditarPerfil from '@/components/FormEditarPerfil';
import ExcluirConta from '../../modals/ExcluirConta';
import { useAuth } from '@/context/AuthContext';
import api from '@/api';
import { toast } from 'react-toastify';
import MainContainer from '../../components/MainContainer';

export default function Configuracoes() {
  const CUSTOM_BG_COLOR = "bg-[#F7FCFE]";
  const [openModal, setOpenModal] = useState(false);
  
  const { user, logout } = useAuth();

  const handleConfirmExcluir = async () => {
    try {
      await api.patch("/users/profile"); 
      setOpenModal(false);
      toast.success("Conta excluída com sucesso.");
      logout(); 
    } catch (error) {
      console.error("Erro ao excluir conta:", error);
      toast.error("Não foi possível excluir sua conta. Tente novamente.");
    }
  };

  return (
    <>
      <MainContainer
        title="Configurações"
      >
        <div className="flex justify-center mt-8">
          <FormEditarPerfil 
            currentUser={user} 
            onExcluirClick={() => setOpenModal(true)}
          />
        </div>
      </MainContainer>
      <ExcluirConta
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onConfirm={handleConfirmExcluir}
      />
    </>
  );
}