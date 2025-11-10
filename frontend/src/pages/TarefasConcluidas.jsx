import React, { useState, useEffect } from "react";
import { CirclePlus } from "lucide-react";
import { Link } from "react-router-dom";
import MainConatainer from "../components/MainContainer.jsx";
import EmptyStatePage from "../components/EmptyStatePage.jsx";
import api from "@/api";

const ICON_STROKE_COLOR = "#949798";
const ICON_STROKE_STYLE = { color: ICON_STROKE_COLOR };
const CUSTOM_BG_COLOR = "bg-[#F7FCFE]";
const COR_LINHA_DIVISORIA = "#949798";

const COR_CONCLUIDA = "bg-[#B5D1DB] text-[#4C6A72] border border-[#9CBAC3]";

// Converte string ISO para objeto Date
const parsePrazoToDate = (prazo) => {
  if (!prazo) return null;
  return new Date(prazo);
};

function corPrazo(prazo) {
  return COR_CONCLUIDA;
}

// Comparador para ordenar por prazo (mais recente primeiro)
const compararPorPrazoDecrescente = (a, b) => {
  const dataA = parsePrazoToDate(a.prazo);
  const dataB = parsePrazoToDate(b.prazo);

  if (!dataA) return 1;
  if (!dataB) return -1;

  // b.getTime() - a.getTime() garante a ordem decrescente
  return dataB.getTime() - dataA.getTime();
};

// Função de formatação de data (DD/MM/YYYY)
const formatarPrazoISO = (isoString) => {
  if (!isoString) return "Sem prazo";
  const data = new Date(isoString);
  return data.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

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
        {/* CHECKBOX */}
        <input
          type="checkbox"
          checked={tarefa.status === 'CONCLUIDA'}
          onChange={() => onToggleConcluida(tarefa._id)}
          onClick={(e) => e.stopPropagation()}
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
            className={`text-sm font-semibold text-gray-700 truncate`}
            title={tarefa.titulo}
          >
            {tarefa.titulo}
          </p>
          <p
            className={`text-xs text-gray-500 truncate`}
            title={tarefa.descricao}
          >
            {tarefa.descricao}
          </p>
        </div>
      </div>

      {/* Label do Prazo */}
      <div className="flex-shrink-0 ml-4">
        <PrazoLabel prazo={tarefa.prazo} />
      </div>
    </div>
  );
};

const TarefasConcluidas = () => {
  useEffect(() => {
    document.title = "Tarefas Concluídas";
  }, []);

  const [tarefas, setTarefas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEmptyDemo, setIsEmptyDemo] = useState(false);

  // Busca as tarefas do backend
  useEffect(() => {
    async function getTasks() {
      try {
        setLoading(true);
        const res = await api.get("/tasks");
        setTarefas(res.data); // Não precisa ordenar aqui, faremos no filtro
      } catch (error) {
        console.error("Erro ao buscar tarefas:", error);
      } finally {
        setLoading(false);
      }
    }
    getTasks();
  }, []);

  // FILTRAGEM: Apenas tarefas CONCLUÍDAS
  const tarefasConcluidas = tarefas.filter((t) => t.status === 'CONCLUIDA');

  // ORDENAÇÃO: Aplicamos a ordenação decrescente
  const sortedTasks = [...tarefasConcluidas].sort(compararPorPrazoDecrescente);

  const displayedTasks = isEmptyDemo ? [] : sortedTasks;

  // Atualiza a tarefa (reabrir)
  const handleToggleConcluida = async (id) => {
    const tarefa = tarefas.find(t => t._id === id);
    if (!tarefa) return;

    // Se está aqui, ela está 'CONCLUIDA', então reabrimos como 'PENDENTE'
    const novoStatus = 'PENDENTE';
    const atualizada = { ...tarefa, status: novoStatus };

    setTarefas((prev) => 
      prev.map((t) => (t._id === id ? atualizada : t))
      // Não precisamos reordenar aqui, pois ela vai sumir da lista de concluídas
    );

    try {
      await api.put(`/tasks/${id}`, { status: novoStatus });
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      setTarefas((prev) => 
        prev.map((t) => (t._id === id ? tarefa : t))
      );
    }
  };

  if (loading) {
    return (
      <MainConatainer title="Concluídas">
        <div className="flex-1 flex justify-center items-center">
          <p className="text-gray-500">Carregando tarefas...</p>
        </div>
      </MainConatainer>
    );
  }

  return (
    <MainConatainer
      title="Concluídas"
      count={isEmptyDemo ? 0 : tarefasConcluidas.length}
      onCountClick={() => setIsEmptyDemo(!isEmptyDemo)}
    >
      {displayedTasks.length === 0 ? (
        <EmptyStatePage text="Ainda não há nenhuma tarefa concluída. 
          Se quiser adicionar uma, clique no botão abaixo." addButton={true} />
      ) : (
        // Lista de Tarefas
        <div className="w-full flex flex-col flex-1 min-h-0">
          {/* Botão Nova Tarefa */}
          <div className="border-b border-gray-100 pb-3 mb-2 flex-shrink-0">
            <Link to="/criar-tarefa">
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
                key={tarefa._id}
                tarefa={tarefa}
                onToggleConcluida={handleToggleConcluida}
              />
            ))}
          </div>
        </div>
      )}
    </MainConatainer>
  );
};

export default TarefasConcluidas;