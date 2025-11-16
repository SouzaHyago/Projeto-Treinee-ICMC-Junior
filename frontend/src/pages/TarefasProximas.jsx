import React, { useState, useEffect, useMemo } from "react";
import { CirclePlus, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import MainContainer from "../components/MainContainer";
import EmptyStatePage from "../components/EmptyStatePage.jsx";
import api from "@/api";

const ICON_STROKE_COLOR = "#949798";
const ICON_STROKE_STYLE = { color: ICON_STROKE_COLOR };
const CUSTOM_BG_COLOR = "bg-[#F7FCFE]";
const COR_LINHA_DIVISORIA = "#949798";

// --- Definições de Data ---
const AGORA = new Date();
// Zera a hora para comparações de "dia"
const HOJE = new Date(AGORA.getFullYear(), AGORA.getMonth(), AGORA.getDate());
const AMANHA = new Date(HOJE.getTime() + 86400000);
// Início do dia depois de amanhã
const DEPOIS_DE_AMANHA = new Date(AMANHA.getTime() + 86400000);
// Fim do 7º dia a partir de hoje (ex: se hoje é dia 1, pega até o fim do dia 7)
const UMA_SEMANA_DEPOIS = new Date(HOJE.getTime() + 7 * 86400000);

// --- Funções Auxiliares (compatíveis com Backend) ---

const parsePrazoToDate = (prazo) => {
  if (!prazo) return null;
  return new Date(prazo); // ISO string to Date
};

const isAtrasada = (tarefa) => {
  if (tarefa.status === 'CONCLUIDA') return false;
  const dataPrazo = parsePrazoToDate(tarefa.prazo);
  return dataPrazo && dataPrazo < AGORA;
};

// Filtros de data
const isHoje = (tarefa) => {
  const dataPrazo = parsePrazoToDate(tarefa.prazo);
  if (!dataPrazo) return false;
  const dataPrazoDia = new Date(dataPrazo.getFullYear(), dataPrazo.getMonth(), dataPrazo.getDate());
  return dataPrazoDia.getTime() === HOJE.getTime();
};

const isAmanha = (tarefa) => {
  const dataPrazo = parsePrazoToDate(tarefa.prazo);
  if (!dataPrazo) return false;
  const dataPrazoDia = new Date(dataPrazo.getFullYear(), dataPrazo.getMonth(), dataPrazo.getDate());
  return dataPrazoDia.getTime() === AMANHA.getTime();
};

const isEstaSemana = (tarefa) => {
  const dataPrazo = parsePrazoToDate(tarefa.prazo);
  if (!dataPrazo) return false;
  // É depois de amanhã E antes ou igual a 7 dias a partir de hoje
  return dataPrazo >= DEPOIS_DE_AMANHA && dataPrazo <= UMA_SEMANA_DEPOIS;
};

// Formatar Hora (HH:MM)
const formatarPrazoISO_Hora = (isoString) => {
  if (!isoString) return "Sem hora";
  const data = new Date(isoString);
  return data.toLocaleString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatarPrazoISO_Dia = (isoString) => {
  if (!isoString) return "Sem dia";
  const data = new Date(isoString);
  return data.toLocaleString("pt-BR", {
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};

function corPrazo(prazo) {
  const dataPrazo = parsePrazoToDate(prazo);
  if (!dataPrazo) return "bg-gray-100 text-gray-500 border border-gray-200";

  const dataPrazoDia = new Date(dataPrazo.getFullYear(), dataPrazo.getMonth(), dataPrazo.getDate());
  
  if (dataPrazo < AGORA)
    return "bg-[#EFE999] text-[#726A4C] border border-[#DED581]";

  if (dataPrazoDia.toDateString() === HOJE.toDateString())
    return "bg-[#B5D1DB] text-[#4C6A72] border border-[#9CBAC3]";

  if (dataPrazoDia.toDateString() === AMANHA.toDateString())
    return "bg-[#D7B8D2] text-[#724C6A] border border-[#BFA0B9]";

  return "bg-[#C1E0C5] text-[#517255] border border-[#A8C7AD]";
}

const compararPorPrazo = (a, b) => {
  if (a.status === 'CONCLUIDA' && b.status !== 'CONCLUIDA') return 1;
  if (a.status !== 'CONCLUIDA' && b.status === 'CONCLUIDA') return -1;
  
  const dataA = parsePrazoToDate(a.prazo);
  const dataB = parsePrazoToDate(b.prazo);

  if (!dataA) return 1;
  if (!dataB) return -1;

  return dataA.getTime() - dataB.getTime();
};


// --- Componentes Internos ---

const PrazoLabel = ({ prazo, type="Time" }) => (
  <span
    className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap shadow-sm ${corPrazo(
      prazo
    )}`}
  >
    {type === "Time" ? formatarPrazoISO_Hora(prazo) : formatarPrazoISO_Dia(prazo)} {/* Mostra o formato do prazo */}
  </span>
);

const handleSalvarNovaTarefa = (tarefa) => {
  setTarefas((prev) => [...prev, tarefa].sort(compararPorPrazo));
  setView("lista");
};
const handleSalvarEdicao = (tarefaAtualizada) => {
  setTarefas((prev) => prev.map((t) => (t._id === tarefaAtualizada._id ? tarefaAtualizada : t)).sort(compararPorPrazo));
  setView("lista");
  setTarefaAtual(null);
};
const handleEditar = (tarefaId) => {
  const tarefa = tarefas.find((t) => t._id === tarefaId);
  if (tarefa) {
    setTarefaAtual(tarefa);
    setView("editar");
  }
  setMenuAberto(null);
};
const handleEditarVisualizacao = () => {
  if (tarefaVisualizar) handleEditar(tarefaVisualizar._id);
  setTarefaVisualizar(null);
}; 

const TaskItem = ({ tarefa, onToggleConcluida, type="Time" }) => {
  const atrasada = isAtrasada(tarefa);

  return (
    <div
      className="flex items-center justify-between border-b last:border-b-0 py-3 px-1 hover:bg-gray-50 transition"
      style={{ borderBottomColor: COR_LINHA_DIVISORIA }}
    >
      <div className="flex items-start gap-3 w-full min-w-0">
        {atrasada && ( // Ícone de atraso
          <div className="flex-shrink-0 mt-1" title="Tarefa Atrasada">
            <AlertTriangle size={16} style={{ color: "#CABD72" }} />
          </div>
        )}
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
            className={`text-sm font-semibold text-gray-700 truncate ${
              tarefa.status === 'CONCLUIDA' ? "line-through text-gray-400" : ""
            }`}
            title={tarefa.titulo}
          >
            {tarefa.titulo}
          </p>
           <p
            className={`text-xs text-gray-500 truncate ${
              tarefa.status === 'CONCLUIDA' ? "line-through text-gray-300" : ""
            }`}
            title={tarefa.descricao}
          >
            {tarefa.descricao}
          </p>
        </div>
      </div>
      <div className="flex-shrink-0 ml-4">
        <PrazoLabel prazo={tarefa.prazo} type={type} />
      </div>
    </div>
  );
};

// TaskCard simplificado para receber props (sem estado interno)
const TaskCard = ({ title, tasks, onToggleConcluida, cardType="Time" }) => {
  
  // Ordena as tarefas recebidas
  const tarefasOrdenadas = [...tasks].sort(compararPorPrazo);

  return (
    <div
      className={`
        ${CUSTOM_BG_COLOR} rounded-[25px] p-6 shadow-xl backdrop-blur-sm bg-opacity-90 
        flex flex-col border max-h-[380px] border-gray-300
      `}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-3 flex-shrink-0">{title}</h2>
      
      <div className="pb-3 mb-2 flex-shrink-0">
        <Link to="/criar-tarefa">
          <button
            className={`
              flex items-center w-full px-4 py-2 
              text-[#949798] bg-transparent border border-2 border-gray-200 
              rounded-xl shadow-sm hover:bg-gray-200 hover:border-gray-300 transition
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

      <div className="flex-1 overflow-y-auto pr-2 min-h-0">
        {tarefasOrdenadas.length === 0 ? (
          <p className="text-sm text-gray-500 text-center mt-4">Nenhuma tarefa.</p>
        ) : (
          tarefasOrdenadas.map((tarefa) => (
            <TaskItem
              key={tarefa._id}
              tarefa={tarefa}
              onToggleConcluida={onToggleConcluida} // Passa o handler do pai
              type={cardType}
            />
          ))
        )}
      </div>
    </div>
  );
};


// --- Componente Principal ---

export default function TarefasProximas() {
  useEffect(() => {
    document.title = "Próximas Tarefas";
  }, []);

  const [tarefas, setTarefas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Busca todas as tarefas
  useEffect(() => {
    async function getTasks() {
      try {
        setLoading(true);
        const res = await api.get("/tasks");
        setTarefas(res.data);
      } catch (error) {
        console.error("Erro ao buscar tarefas:", error);
      } finally {
        setLoading(false);
      }
    }
    getTasks();
  }, []);

  // Filtra as tarefas pendentes (que não estão concluídas)
  const tarefasPendentes = useMemo(() => 
    tarefas.filter(t => t.status !== 'CONCLUIDA'),
    [tarefas]
  );

  // Filtra por data usando a lista de pendentes
  const tarefasHoje = useMemo(() => 
    tarefasPendentes.filter(isHoje),
    [tarefasPendentes]
  );
  
  const tarefasAmanha = useMemo(() => 
    tarefasPendentes.filter(isAmanha),
    [tarefasPendentes]
  );
  
  const tarefasEstaSemana = useMemo(() => 
    tarefasPendentes.filter(isEstaSemana),
    [tarefasPendentes]
  );

  // Handler centralizado que atualiza o estado principal
  const handleToggleConcluida = async (id) => {
    const tarefa = tarefas.find(t => t._id === id);
    if (!tarefa) return;

    const novoStatus = tarefa.status === 'CONCLUIDA' ? 'PENDENTE' : 'CONCLUIDA';
    const atualizada = { ...tarefa, status: novoStatus };

    // Atualização otimista: atualiza o estado local primeiro
    setTarefas((prev) => 
      prev.map((t) => (t._id === id ? atualizada : t))
    );

    try {
      // Envia a mudança para a API
      await api.put(`/tasks/${id}`, { status: novoStatus });
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      // Reverte em caso de erro
      setTarefas((prev) => 
        prev.map((t) => (t._id === id ? tarefa : t))
      );
    }
  };

  const totalTarefas = tarefasHoje.length + tarefasAmanha.length + tarefasEstaSemana.length;

  if (loading) {
      return (
      <MainContainer title="Próximas Tarefas" bordered={false}>
          <div className="flex-1 flex justify-center items-center">
          <p className="text-gray-500">Carregando tarefas...</p>
        </div>
      </MainContainer>
    );
  }

  // Se não houver tarefas, mostra EmptyState centralizado
  if (totalTarefas === 0 && !loading) {
    return (
      <MainContainer
        title="Próximas Tarefas"
        count={0}
        bordered={false}
      >
        <div className="flex-1 flex justify-center items-center -mt-16">
          <EmptyStatePage 
            text="Nenhuma tarefa pendente para os próximos 7 dias. Clique abaixo para adicionar uma."
            addButton={true}
          />
        </div>
      </MainContainer>
    );
  }

  return (
    <MainContainer
      title="Próximas Tarefas"
      count={totalTarefas}
      bordered={false}
    >
      
      {/* <div className="flex-1 overflow-y-auto pr-2"> */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 flex-shrink-0">
          <TaskCard 
            title="Hoje" 
            tasks={tarefasHoje} 
            onToggleConcluida={handleToggleConcluida} 
          />
          <TaskCard 
            title="Amanhã" 
            tasks={tarefasAmanha}
            onToggleConcluida={handleToggleConcluida} 
          />
        </div>

        <div className="flex-1 min-h-0">
          <TaskCard 
            title="Esta semana" 
            tasks={tarefasEstaSemana} 
            onToggleConcluida={handleToggleConcluida} 
            cardType="Day"
          />
        </div>
      {/* </div> */}
      
    </MainContainer>
  );
}