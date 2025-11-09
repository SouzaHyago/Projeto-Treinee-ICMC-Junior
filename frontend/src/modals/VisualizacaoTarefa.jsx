import Modal from "../components/Modal";

function VisualizacaoTarefa({ tarefa, isOpen, onClose, onEdit, onStart }) {
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
      onClose={onClose}
      onConfirm={onStart}
      onExtraButton={onEdit}
      rButtonText="Iniciar tarefa"
      rButtonStyle="bg-[#40869E] hover:bg-[#006186]"
      lButtonText="Editar"
    />
  );
}

export default VisualizacaoTarefa;
