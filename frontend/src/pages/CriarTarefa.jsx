import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainContainer from "../components/MainContainer";
import FormEntry from "../components/FormEntry";
import CancelarEdicao from "../modals/CancelarEdicao";
import api from "@/api.js";
import { toast } from 'react-toastify';


function CriarTarefa({ onSave, onCancel, presetDate, prevLocation="/" }) {

  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Criar Tarefa";
  }, []);

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [data, setData] = useState(presetDate || "");
  const [horario, setHorario] = useState("");
  const [obs, setObs] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  function labelOpcional(label) {
    return (
      <>
        {label} <span className="text-gray-400">(opcional)</span>
      </>
    );
  }

  async function handleSave() {
    if (!titulo || !data || !horario) {
      toast.warn("Por favor, preencha o nome da tarefa, data e horário."); 
      return;
    }
    const prazoISO = `${data}T${horario}:00`;
    const novaTarefaData = { titulo, descricao, prazo: prazoISO, obs };

    try {
      const res = await api.post("/tasks", novaTarefaData);

      toast.success("Tarefa criada com sucesso!");

      if (typeof onSave === "function")
        onSave(res.data);
      else
        navigate(prevLocation)

    } catch (error) {
      console.error("Erro ao criar tarefa:", error);
      toast.error("Erro ao salvar a tarefa: " + (error.response?.data?.error || "Erro desconhecido"));
    }
  }

  const executeCancel = () => {
    if (typeof onCancel === "function") {
      onCancel();
    } else {
      navigate(prevLocation);
    }
  };

  function handleCancel() {
    if (titulo || descricao || (data && data !== presetDate) || horario || obs)
      setIsModalOpen(true);
    else
      executeCancel();
  }

  function handleConfirmCancel() {
    setIsModalOpen(false);
    executeCancel();
  }

  return (
    <>
    <MainContainer
      title="Criar tarefa"
      subtitle={"Preencha com a informação da sua tarefa."}
      bordered={false}
    >
      {/* Container do formulário */}
      <div className="flex flex-col justify-between p-2 gap-6 -mt-8 flex-1 overflow-y-auto">
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
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <FormEntry
                label="Horário"
                type="time"
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
            Salvar tarefa
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

export default CriarTarefa;