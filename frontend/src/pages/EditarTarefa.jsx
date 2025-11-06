import { useState, useEffect } from "react";
import MainContainer from "../components/MainContainer";
import FormEntry from "../components/FormEntry";
import CancelarEdicao from "../modals/CancelarEdicao";

function EditarTarefa({ tarefa, onSave, onCancel }) {
  useEffect(() => {
    document.title = "Editar Tarefa";
  }, []);

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [data, setData] = useState("");
  const [horario, setHorario] = useState("");
  const [obs, setObs] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (tarefa) {
      setTitulo(tarefa.titulo);
      setDescricao(tarefa.descricao);
      setObs(tarefa.obs || "");

      // Converte o prazo em data e horário
      if (tarefa.prazo) {
        const [horaStr, dataStr] = tarefa.prazo.split(" - ");
        setHorario(horaStr || "");
        setData(dataStr || "");
      } else {
        setHorario("");
        setData("");
      }
    }
  }, [tarefa]);

  function labelOpcional(label) {
    return (
      <>
        {label} <span className="text-gray-400">(opcional)</span>
      </>
    );
  }

  function handleSave() {
    const prazo = data && horario ? `${horario} - ${data}` : "";

    const tarefaAtualizada = {
      ...tarefa,
      titulo,
      descricao,
      prazo,
      obs,
    };

    onSave(tarefaAtualizada);
  }

  function handleCancel() {
    // Abre o modal se algum compo foi preenchido
    if (titulo || descricao || data || horario || obs) {
      setIsModalOpen(true);
    } else
      onCancel();
  }

  function handleConfirmCancel() {
    console.log("Confirming cancel - should go back to list");
    onCancel();
    setIsModalOpen(false);
  }

  return (
    <>
    <MainContainer
      title="Editar tarefa"
      subtitle={"Atualize a informação da tarefa."}
      bordered={false}
    >
      {/* Container do formulário */}
      <div className="flex flex-col justify-between gap-6 -mt-4">
        {/* Inputs de texto */}
        <div className="flex flex-col flex-1 gap-3">
          <FormEntry
            label="Nome da tarefa"
            placeholder="Insira o nome da tarefa"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
          <FormEntry
            label={labelOpcional("Descrição")}
            mandatory={false}
            multiline={true}
            placeholder="Insira a descrição da tarefa"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            inputClass="h-32"
          />
          {/* Inputs de data e horário */}
          <div className="flex gap-4">
            <div className="flex-1">
              <FormEntry
                label="Data"
                placeholder="DD/MM/AAAA"
                value={data}
                onChange={(e) => setData(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <FormEntry
                label="Horário"
                placeholder="HH:MM"
                value={horario}
                onChange={(e) => setHorario(e.target.value)}
              />
            </div>
          </div>
          <FormEntry
            label={labelOpcional("Observações")}
            mandatory={false}
            multiline={true}
            placeholder="Adicione detalhes sobre a sua tarefa"
            value={obs}
            onChange={(e) => setObs(e.target.value)}
            inputClass="h-32"
          />
        </div>

        {/* Botões de ação */}
        <div className="flex justify-center gap-20">
          {/* Cancelar */}
          <button
            className={`
              px-4 py-2 min-w-[200px]
              text-white bg-[#A0A3A4] 
              rounded-lg border-gray-700 shadow-sm 
              hover:bg-[#767676] transition
            `}
            onClick={handleCancel}
          >
            Cancelar
          </button>

          {/* Salvar */}
          <button
            className={`
              px-4 py-2 min-w-[200px]
              text-white bg-[#40869E]
              rounded-lg border-gray-700 shadow-sm 
              hover:bg-[#006186] transition
            `}
            onClick={handleSave}
          >
            Salvar alterações
          </button>
        </div>
      </div>
    </MainContainer>
    <CancelarEdicao
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      onConfirm={handleConfirmCancel}
    />
  </>
  );
}

export default EditarTarefa;