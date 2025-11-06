import Modal from "../components/Modal";

function VisualizacaoTarefa({ tarefa, isOpen, onClose, onConfirm }) {
  return (
    <Modal
      title={tarefa.titulo}
      message={
        <div className="space-y-2 text-left">
          {tarefa.descricao && (
            <p>
              <strong>Descrição:</strong> {tarefa.descricao}
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
      onClose={onConfirm}
      onConfirm={onClose}
      rButtonText="Fechar"
      lButtonText="Editar"
      rButtonStyle="bg-[#40869E] hover:bg-[#006186]"
    />
  );
}

export default VisualizacaoTarefa;
