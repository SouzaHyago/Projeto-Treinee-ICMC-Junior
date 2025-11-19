// Modal de confirmação de exclusão de uma tarefa

import Modal from "../components/Modal"

function ExcluirTarefa({ isOpen, onClose, onConfirm}) {
  return (
    <Modal
      title="Confirmar Exclusão"
      message="Tem certeza que deseja excluir esta tarefa? 
                Essa ação é permanente e não poderá ser desfeita."
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      rButtonText="Excluir"
      rButtonStyle="bg-[#AE3232] hover:bg-[#7B2121]"
    />
  );
}

export default ExcluirTarefa;