// Modal de visualizaação de uma tarefa

import Modal from "../components/Modal";

// Define a formatação da data que aparecerá na janela
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

// Recebe as ações ao clicar em fechar, editar ou alterar o status (de 'EM ANDAMENTO' para outro e vice-versa)
function VisualizacaoTarefa({ tarefa, isOpen, onClose, onEdit, onChangeStatus }) {
  return (
    // Mostra o nome da tarefa, o prazo e a descrição e observações, se não forem vazias
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
      // Texto e estilo do botão dependem do status da tarefa
      rButtonText={tarefa.status === "EM ANDAMENTO" ? "Pausar tarefa" : "Iniciar tarefa"}
      rButtonStyle={tarefa.status !== "CONCLUIDA" ? "bg-[#40869E] hover:bg-[#006186]" : "bg-[#8E8E8E] cursor-default"}
      lButtonText="Editar"
      xToClose={true}
    />
  );
}

export default VisualizacaoTarefa;