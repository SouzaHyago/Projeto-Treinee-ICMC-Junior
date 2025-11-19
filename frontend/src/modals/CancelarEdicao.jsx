// Modal de confirmar o cancelamento dea edição de uma tarefa

import Modal from "../components/Modal"

function CancelarEdicao({ isOpen, onClose, onConfirm }) {
  return (
    <Modal
      title="Deseja realmente voltar?"
      message="As informações ainda não foram salvas. Ao cancelar, todos os dados 
                preenchidos serão perdidos."
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      rButtonText="Sim, voltar"
      lButtonText="Continuar editando"
      rButtonStyle="bg-[#40869E] hover:bg-[#006186]"
    />
  );
}

export default CancelarEdicao;