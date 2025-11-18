import { useState, useEffect, useMemo } from "react";
import { CirclePlus, AlertTriangle } from "lucide-react";
import { useLocation } from "react-router-dom"; // Importado useLocation
import MainContainer from "../components/MainContainer.jsx";
import EmptyStatePage from "../components/EmptyStatePage.jsx";
// Imports de navegação e modais
import VisualizacaoTarefa from "../modals/VisualizacaoTarefa.jsx";
import CriarTarefa from "./CriarTarefa.jsx";
import EditarTarefa from "./EditarTarefa.jsx";
import api from "@/api";
import { toast } from "react-toastify"; // Importado toast

const ICON_STROKE_COLOR = "#949798";
const ICON_STROKE_STYLE = { color: ICON_STROKE_COLOR };
const CUSTOM_BG_COLOR = "bg-[#F7FCFE]";
const COR_ALERTA_ATRASO = "#CABD72";
const COR_LINHA_DIVISORIA = "#949798";

// Data de referência (hoje)
const AGORA = new Date();
const HOJE = new Date(AGORA.getFullYear(), AGORA.getMonth(), AGORA.getDate());

// Funções Auxiliares
const parsePrazoToDate = (prazo) => {
  if (!prazo) return null;
  return new Date(prazo);
};

const isAtrasada = (tarefa) => {
  if (tarefa.status === 'CONCLUIDA') return false;
  const dataPrazo = parsePrazoToDate(tarefa.prazo);
  return dataPrazo && dataPrazo < AGORA;
};

const formatarPrazoISO = (isoString) => {
  if (!isoString) return "Sem prazo";
  const data = new Date(isoString);
  return data.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

function corPrazo(prazo) {
  const dataPrazo = parsePrazoToDate(prazo);
  if (!dataPrazo) return "bg-gray-100 text-gray-500 border border-gray-200";

  const hojeData = new Date(
    AGORA.getFullYear(),
    AGORA.getMonth(),
    AGORA.getDate()
  );

  if (dataPrazo < AGORA)
    return "bg-[#EFE999] text-[#726A4C] border border-[#DED581]"; // Cor de Atraso

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

const PrazoLabel = ({ prazo }) => (
  <span
    className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap shadow-sm ${corPrazo(
      prazo
    )}`}
  >
    {formatarPrazoISO(prazo)}
  </span>
);


const TaskItem = ({ tarefa, onToggleConcluida, onAbrirVisualizacao }) => {
  const atrasada = isAtrasada(tarefa);

  return (
    <div
      className="flex items-center justify-between border-b last:border-b-0 py-3 px-1 hover:bg-gray-50 transition cursor-pointer"
      style={{ borderBottomColor: COR_LINHA_DIVISORIA }}
      onClick={() => onAbrirVisualizacao(tarefa)} // Abre o modal
    >
      <div className="flex items-start gap-3 w-full min-w-0">
        {/* ÍCONE DE ALERTA */}
        {atrasada && (
          <div className="flex-shrink-0 mt-1" title="Tarefa Atrasada">
            <AlertTriangle size={16} style={{ color: COR_ALERTA_ATRASO }} />
          </div>
        )}

        <input
          type="checkbox"
          checked={tarefa.status === 'CONCLUIDA'}
          onChange={() => onToggleConcluida(tarefa._id)}
          onClick={(e) => e.stopPropagation()}
          className={`
            mt-1 h-4 w-4 rounded-sm appearance-none cursor-pointer
            bg-transparent border border-gray-700 
            checked:bg-gray-700 checked:border-gray-700 checked:text-white
            focus:ring-0 flex-shrink-0
          `}
        />

        <div className="flex flex-col min-w-0 flex-grow">
          <p
            className={`text-sm font-semibold text-gray-700 truncate ${tarefa.status === 'CONCLUIDA' ? "line-through text-gray-400" : ""
              }`}
            title={tarefa.titulo}
          >
            {tarefa.titulo}
          </p>
          <p
            className={`text-xs text-gray-500 truncate ${tarefa.status === 'CONCLUIDA' ? "line-through text-gray-300" : ""
              }`}
            title={tarefa.descricao}
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
  const location = useLocation(); // Hook de localização

  useEffect(() => {
    document.title = "Tarefas Atrasadas";
  }, []);

  const [tarefas, setTarefas] = useState([]);
  const [loading, setLoading] = useState(true);

  // ⭐️ Novos estados para Visualização/Edição
  const [tarefaAtual, setTarefaAtual] = useState(null);
  const [tarefaVisualizar, setTarefaVisualizar] = useState(null);
  const [view, setView] = useState("board"); // 'board', 'criar', 'editar'

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
  const tarefasAtrasadas = useMemo(() => {
    return tarefas.filter(isAtrasada).sort(compararPorPrazo);
  }, [tarefas]);

  // Handlers de Ação

  const handleSalvarEdicao = (tarefaAtualizada) => {
    setTarefas((prev) => prev.map((t) => (t._id === tarefaAtualizada._id ? tarefaAtualizada : t)).sort(compararPorPrazo));
    setView("board");
    setTarefaAtual(null);
  };

  const handleSalvarNovaTarefa = (tarefa) => {
    setTarefas((prev) => [...prev, tarefa].sort(compararPorPrazo));
    setView("board");
  };

  const handleClickNovaTarefa = () => {
    setView("criar"); // Sem presetDate
  }

  const handleEditarVisualizacao = () => {
    if (tarefaVisualizar) {
      setTarefaAtual(tarefaVisualizar);
      setView("editar");
      setTarefaVisualizar(null);
    }
  };

  const handleCancelar = () => { setView("board"); setTarefaAtual(null); };
  const handleAbrirVisualizacao = (tarefa) => setTarefaVisualizar(tarefa);
  const handleFecharVisualizacao = () => setTarefaVisualizar(null);

  const handleIniciarTarefa = (tarefaOriginal) => {
    const tarefaId = tarefaOriginal._id;
    const update = { status: "EM ANDAMENTO" };
    const tarefaAtualizada = { ...tarefaOriginal, status: "EM ANDAMENTO" };
    handleSalvarEdicao(tarefaAtualizada);
    setTarefaVisualizar(null);
    api.put(`/tasks/${tarefaId}`, update)
      .then(() => toast.success("Tarefa iniciada!"))
      .catch(err => {
        console.error("Erro ao iniciar tarefa:", err);
        toast.error("Erro ao iniciar tarefa.");
        handleSalvarEdicao(tarefaOriginal);
      });
  }

  const handlePausarTarefa = (tarefaOriginal) => {
    const tarefaId = tarefaOriginal._id;
    const update = { status: "PENDENTE" };
    const tarefaAtualizada = { ...tarefaOriginal, status: "PENDENTE" };
    handleSalvarEdicao(tarefaAtualizada);
    setTarefaVisualizar(null);
    api.put(`/tasks/${tarefaId}`, update)
      .then(() => toast.success("Tarefa pausada"))
      .catch(err => {
        console.error("Erro ao suspender tarefa:", err);
        toast.error("Erro ao suspender tarefa.");
        handleSalvarEdicao(tarefaOriginal);
      });
  }

  const handleToggleConcluida = async (id) => {
    const tarefa = tarefas.find(t => t._id === id);
    if (!tarefa) return;

    const novoStatus = tarefa.status === 'CONCLUIDA' ? 'PENDENTE' : 'CONCLUIDA';
    const atualizada = { ...tarefa, status: novoStatus };

    setTarefas((prev) =>
      prev.map((t) => (t._id === id ? atualizada : t)).sort(compararPorPrazo)
    );

    try {
      await api.put(`/tasks/${id}`, { status: novoStatus });
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
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

  if (view === "criar") return <CriarTarefa onSave={handleSalvarNovaTarefa} onCancel={handleCancelar} presetDate={null} prevLocation={location.pathname} />;
  if (view === "editar" && tarefaAtual) return <EditarTarefa tarefa={tarefaAtual} onSave={handleSalvarEdicao} onCancel={handleCancelar} />;


  // Renderização da lista principal (view "board")
  return (
    <>
      <MainContainer
        title="Atrasadas"
        count={tarefasAtrasadas.length}
      >
        {tarefasAtrasadas.length === 0 ? (
          <EmptyStatePage
            text="Ainda não há nenhuma tarefa em atraso."
            addButton={true}
            onAddButtonClick={handleClickNovaTarefa}
          />
        ) : (
          <div className="w-full flex flex-col flex-1 min-h-0">
            {/* Botão Nova Tarefa */}
            <div className="border-b border-gray-100 pb-3 mb-2 flex-shrink-0">
              <button
                onClick={handleClickNovaTarefa}
                className={`
                  flex items-center w-full px-4 py-2 
                  text-[#949798] bg-transparent border-[2px] border-gray-300 
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
            </div>

            {/* Lista de Tarefas com Scroll Vertical */}
            <div
              className="flex-1 overflow-y-auto pr-2 min-h-0"
            >
              {tarefasAtrasadas.map((tarefa) => (
                <TaskItem
                  key={tarefa._id}
                  tarefa={tarefa}
                  onToggleConcluida={handleToggleConcluida}
                  onAbrirVisualizacao={handleAbrirVisualizacao} // Adicionado handler
                />
              ))}
            </div>
          </div>
        )}
      </MainContainer>

      {tarefaVisualizar && <VisualizacaoTarefa
        tarefa={tarefaVisualizar}
        isOpen={tarefaVisualizar !== null}
        onClose={handleFecharVisualizacao}
        onEdit={handleEditarVisualizacao}
        onChangeStatus={tarefaVisualizar.status === "EM ANDAMENTO" ?
          () => handlePausarTarefa(tarefaVisualizar) :
          () => handleIniciarTarefa(tarefaVisualizar)
        }
      />}
    </>
  );
};

export default TarefasAtrasadas;