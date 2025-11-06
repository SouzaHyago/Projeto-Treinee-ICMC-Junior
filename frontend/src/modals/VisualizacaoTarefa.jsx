import Modal from "../components/Modal";

function VisualizacaoTarefa({ tarefa, isOpen, onClose, onConfirm }) {
  return (
    <Modal
      title={tarefa.title}
      message={
        <div className="space-y-2 text-left">
          {tarefa.description && (
            <p>
              <strong>Descrição:</strong> {tarefa.description}
            </p>
          )}
          {tarefa.prazo && (
            <p>
              <strong>Prazo:</strong> {tarefa.prazo}
            </p>
          )}
          {tarefa.obs && (
            <p>
              <strong>Observações:</strong> {tarefa.obs}
            </p>
          )}
        </div>
      }
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      rButtonText="Okay"
      lButtonText="Editar"
      rButtonStyle="bg-[#40869E] hover:bg-[#006186]"
    />
  );
}

export default VisualizacaoTarefa;
