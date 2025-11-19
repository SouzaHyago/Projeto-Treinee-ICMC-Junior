// Modal de confirmação ao sair da conta

import Modal from "../components/Modal"

function Logout({ isOpen, onClose, onConfirm }) {
  return (
    <Modal
      title="Sair"
      message="Tem certeza que deseja sair da sua conta?"
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      rButtonText="Sair"
      rButtonStyle="bg-[#40869E] hover:bg-[#006186]"
    />
  );
}

export default Logout;