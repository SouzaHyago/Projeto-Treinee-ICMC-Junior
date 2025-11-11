import React, { useState, useEffect } from "react";
import { CirclePlus } from "lucide-react";
import { Link } from "react-router-dom";
import MainContainer from "../components/MainContainer.jsx";
import EmptyStatePage from "../components/EmptyStatePage.jsx";
import api from "@/api";

const ICON_STROKE_COLOR = "#949798";
const ICON_STROKE_STYLE = { color: ICON_STROKE_COLOR };
const CUSTOM_BG_COLOR = "bg-[#F7FCFE]";
const COR_ALERTA_ATRASO = "#CABD72";
const COR_LINHA_DIVISORIA = "#949798";

// Data de referência (hoje) - Agora usa a data real
const AGORA = new Date();

// Função corrigida para 'prazo' (string ISO)
const parsePrazoToDate = (prazo) => {
  if (!prazo) return null;
  return new Date(prazo); // Converte string ISO para objeto Date
};

// Função para verificar se a tarefa está Atrasada
const isAtrasada = (tarefa) => {
  if (tarefa.status === 'CONCLUIDA') return false; // Usa 'status' do backend
  const dataPrazo = parsePrazoToDate(tarefa.prazo);
  return dataPrazo && dataPrazo < AGORA;
};

// Função de formatação de data (copiada de Tarefas.jsx)
const formatarPrazoISO = (isoString) => {
  if (!isoString) return "Sem prazo";
  const data = new Date(isoString);
  return data.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

// Função de cor (baseada em ISO)
function corPrazo(prazo) {
  const dataPrazo = parsePrazoToDate(prazo);
  if (!dataPrazo) return "bg-gray-100 text-gray-500 border border-gray-200";

  const hojeData = new Date(
    AGORA.getFullYear(),
    AGORA.getMonth(),
    AGORA.getDate()
  );
  const dataPrazoDia = new Date(
    dataPrazo.getFullYear(),
    dataPrazo.getMonth(),
    dataPrazo.getDate()
  );

  const amanhaData = new Date(hojeData);
  amanhaData.setDate(hojeData.getDate() + 1);

  if (dataPrazo < AGORA)
    return "bg-[#EFE999] text-[#726A4C] border border-[#DED581]";

  if (dataPrazoDia.toDateString() === hojeData.toDateString())
    return "bg-[#B5D1DB] text-[#4C6A72] border border-[#9CBAC3]";

  if (dataPrazoDia.toDateString() === amanhaData.toDateString())
    return "bg-[#D7B8D2] text-[#724C6A] border border-[#BFA0B9]";

  return "bg-[#C1E0C5] text-[#517255] border border-[#A8C7AD]";
}

// Comparador atualizado para usar 'status' e 'prazo' ISO
const compararPorPrazo = (a, b) => {
  if (a.status === 'CONCLUIDA' && b.status !== 'CONCLUIDA') return 1;
  if (a.status !== 'CONCLUIDA' && b.status === 'CONCLUIDA') return -1;

  const dataA = parsePrazoToDate(a.prazo);
  const dataB = parsePrazoToDate(b.prazo);

  if (!dataA) return 1;
  if (!dataB) return -1;

  return dataA.getTime() - dataB.getTime();
};

// Label atualizada para usar a nova formatação
const PrazoLabel = ({ prazo }) => (
  <span
    className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap shadow-sm ${corPrazo(
      prazo
    )}`}
  >
    {formatarPrazoISO(prazo)}
  </span>
);

const TaskItem = ({ tarefa, onToggleConcluida }) => {
  return (
    <div
      className="flex items-center justify-between border-b last:border-b-0 py-3 px-1 hover:bg-gray-50 transition"
      style={{ borderBottomColor: COR_LINHA_DIVISORIA }}
    >
      <div className="flex items-start gap-3 w-full min-w-0">
        <input
          type="checkbox"
          checked={tarefa.status === 'CONCLUIDA'} // Usa 'status'
          onChange={() => onToggleConcluida(tarefa._id)} // Usa '_id'
          onClick={(e) => e.stopPropagation()} // Impede o clique de abrir o modal
          className={`
            mt-1 h-4 w-4 rounded-sm 
            appearance-none cursor-pointer
            bg-transparent border border-gray-700 
            checked:bg-gray-700 checked:border-gray-700 checked:text-white
            focus:ring-0
            flex-shrink-0
          `}
        />

        <div className="flex flex-col min-w-0 flex-grow">
          <p
            className={`text-sm font-semibold text-gray-700 truncate ${
              tarefa.status === 'CONCLUIDA' ? "line-through text-gray-400" : "" // Usa 'status'
            }`}
            title={tarefa.titulo}
          >
            {tarefa.titulo}
          </p>
          <p
            className={`text-xs text-gray-500 truncate ${
              tarefa.status === 'CONCLUIDA' ? "line-through text-gray-300" : "" // Usa 'status'
            }`}
            title={tarefa.description}
          >
            {tarefa.descricao}
          </p>
        </div>
      </div>

      <div className="flex-shrink-0 ml-4">
        <PrazoLabel prazo={tarefa.prazo} />
      </div>
    </div>
  );
};

const TarefasAtrasadas = () => {
  useEffect(() => {
    document.title = "Tarefas Atrasadas";
  }, []);

  // Inicia o estado de tarefas como um array vazio e adiciona 'loading'
  const [tarefas, setTarefas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEmptyDemo, setIsEmptyDemo] = useState(false); // Mantido para fins de UI

  // Busca as tarefas do backend
  useEffect(() => {
    async function getTasks() {
      try {
        setLoading(true);
        const res = await api.get("/tasks");
        setTarefas([...res.data].sort(compararPorPrazo));
      } catch (error) {
        console.error("Erro ao buscar tarefas:", error);
      } finally {
        setLoading(false);
      }
    }
    getTasks();
  }, []);

  // Filtra as tarefas que estão atrasadas (status PENDENTE e prazo vencido)
  const tarefasAtrasadasPendentes = tarefas.filter(
    (t) => t.status !== 'CONCLUIDA' && isAtrasada(t)
  );

  const displayedTasks = isEmptyDemo ? [] : tarefasAtrasadasPendentes;

  // Atualiza a tarefa (concluir/desconcluir)
  const handleToggleConcluida = async (id) => {
    const tarefa = tarefas.find(t => t._id === id);
    if (!tarefa) return;

    const novoStatus = tarefa.status === 'CONCLUIDA' ? 'PENDENTE' : 'CONCLUIDA';
    const atualizada = { ...tarefa, status: novoStatus };

    // Atualização otimista no state
    setTarefas((prev) => 
      prev.map((t) => (t._id === id ? atualizada : t)).sort(compararPorPrazo)
    );

    try {
      // Chama a API
      await api.put(`/tasks/${id}`, { status: novoStatus });
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      // Reverte em caso de erro
      setTarefas((prev) => 
        prev.map((t) => (t._id === id ? tarefa : t)).sort(compararPorPrazo)
      );
    }
  };

  if (loading) {
    return (
      <MainContainer title="Atrasadas">
        <div className="flex-1 flex justify-center items-center">
          <p className="text-gray-500">Carregando tarefas...</p>
        </div>
      </MainContainer>
    );
  }

  return (
    <MainContainer
      title="Atrasadas"
      count={isEmptyDemo ? 0 : tarefasAtrasadasPendentes.length}
    >
      {displayedTasks.length === 0 ? (
        <EmptyStatePage text="Ainda não há nenhuma tarefa em atraso." addButton={true} />
      ) : (
        // Lista de Tarefas
        <div className="w-full flex flex-col flex-1 min-h-0">
          {/* Botão Nova Tarefa */}
          <div className="border-b border-gray-100 pb-3 mb-2 flex-shrink-0">
            <Link to="/criar-tarefa"> {/* Adiciona Link */}
              <button
                className={`
                  flex items-center w-full px-4 py-2 
                  text-[#949798] bg-transparent border border-[#949798] 
                  rounded-lg shadow-sm hover:bg-gray-200 transition
                `}
              >
                <CirclePlus
                  size={16}
                  style={ICON_STROKE_STYLE}
                  className="mr-2"
                />
                <span className="text-sm font-medium">Nova tarefa</span>
              </button>
            </Link>
          </div>

          {/* Lista de Tarefas com Scroll Vertical */}
          <div
            className="flex-1 overflow-y-auto pr-2 min-h-0"
          >
            {displayedTasks.map((tarefa) => (
              <TaskItem
                key={tarefa._id} // Usa '_id'
                tarefa={tarefa}
                onToggleConcluida={handleToggleConcluida}
              />
            ))}
          </div>
        </div>
      )}
    </MainContainer>
  );
};

export default TarefasAtrasadas;