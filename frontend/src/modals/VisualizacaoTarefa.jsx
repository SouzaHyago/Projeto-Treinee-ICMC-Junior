import Modal from "../components/Modal";

const formatarPrazoISO_local = (isoString) => {
  if (!isoString) return "Sem prazo";
  const data = new Date(isoString);
  return data.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

function VisualizacaoTarefa({ tarefa, isOpen, onClose, onEdit, onChangeStatus }) {
  return (
    <Modal
      title={tarefa.titulo}
      message={

        <div className="space-y-2 text-left break-words">
          {tarefa.descricao && (
            <p>
              <strong>Descrição:</strong> {tarefa.descricao}
            </p>
          )}
          {tarefa.prazo && (
            <p>
              <strong>Prazo:</strong> {formatarPrazoISO_local(tarefa.prazo)}
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
      onRightButton={onChangeStatus}
      onLeftButton={onEdit}
      rButtonText={tarefa.status === "EM ANDAMENTO" ? "Pausar tarefa" : "Iniciar tarefa"}
      rButtonStyle="bg-[#40869E] hover:bg-[#006186]"
      lButtonText="Editar"
      xToClose={true}
    />
  );
}

export default VisualizacaoTarefa;