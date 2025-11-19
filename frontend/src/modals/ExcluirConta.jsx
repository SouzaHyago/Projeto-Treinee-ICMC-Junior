// Modal de confirmação de exclusão da conta

import Modal from "../components/Modal"

function ExcluirConta({ isOpen, onClose, onConfirm }) {
  return (
    <Modal
      title="Tem certeza?"
      message="Você perderá o cadastro e seus dados não poderão ser recuperados."
      isOpen={isOpen}
      onRightButton={onClose}
      onLeftButton={onConfirm}
      rButtonText="Cancelar"
      rButtonStyle="bg-[#ADADAD] hover:bg-[#8E8E8E]"
      lButtonText="Excluir conta"
      lButtonStyle="bg-[#AE3232] hover:bg-[#7B2121]"
    />
  );
}

export default ExcluirConta;