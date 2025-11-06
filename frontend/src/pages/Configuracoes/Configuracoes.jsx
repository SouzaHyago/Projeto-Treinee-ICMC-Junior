
import { useState } from 'react';
import FormEditarPerfil from '@/components/FormEditarPerfil'
import ExcluirConta from '../../modals/ExcluirConta';

export default function Configuracoes({setIsAuthenticated}) {
  const CUSTOM_BG_COLOR = "bg-[#F7FCFE]";

  const [openModal, setOpenModal] = useState(false);

  const handleConfirmExcluir = () => {
    setIsAuthenticated(false);
    setOpenModal(false);
  }

  return (
    <>
      <div className={`${CUSTOM_BG_COLOR} rounded-[50px] container p-8 w-full max-w-6xl shadow-xl backdrop-blur-sm`}>
        <h1 className="text-[36px] font-bold text-gray-800">Configurações</h1>
        <div className="flex justify-center mt-8">
          <FormEditarPerfil onExcluirClick={() => setOpenModal(true)}/>
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
