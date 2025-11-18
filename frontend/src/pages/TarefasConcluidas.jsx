import { useState, useEffect, useMemo } from "react";
import { CirclePlus } from "lucide-react";
import { useLocation } from "react-router-dom";
import MainContainer from "../components/MainContainer.jsx";
import EmptyStatePage from "../components/EmptyStatePage.jsx";
import VisualizacaoTarefa from "../modals/VisualizacaoTarefa.jsx";
import CriarTarefa from "./CriarTarefa.jsx";
import EditarTarefa from "./EditarTarefa.jsx";
import api from "@/api";
import { toast } from "react-toastify";

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

const TaskItem = ({ tarefa, onToggleConcluida, onAbrirVisualizacao }) => {
  return (
    <div
      className="flex items-center justify-between border-b last:border-b-0 py-3 px-1 hover:bg-gray-50 transition cursor-pointer"
      style={{ borderBottomColor: COR_LINHA_DIVISORIA }}
      onClick={() => onAbrirVisualizacao(tarefa)} // Abre o modal
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
            className={`text-sm font-semibold text-gray-700 truncate line-through`}
            title={tarefa.titulo}
          >
            {tarefa.titulo}
          </p>
          <p
            className={`text-xs text-gray-500 truncate line-through`}
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
  const location = useLocation();

  useEffect(() => {
    document.title = "Tarefas Concluídas";
  }, []);

  const [tarefas, setTarefas] = useState([]);
  const [loading, setLoading] = useState(true);

  const [tarefaAtual, setTarefaAtual] = useState(null); // Para Edição
  const [tarefaVisualizar, setTarefaVisualizar] = useState(null); // Para Visualização
  const [view, setView] = useState("board"); // 'board', 'criar', 'editar'

  // Busca as tarefas do backend
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

  // FILTRAGEM E ORDENAÇÃO
  const tarefasConcluidas = useMemo(() => {
    const filtered = tarefas.filter((t) => t.status === 'CONCLUIDA');
    return filtered.sort(compararPorPrazoDecrescente);
  }, [tarefas]);

  // HANDLERS DE AÇÃO

  const handleSalvarEdicao = (tarefaAtualizada) => {
    setTarefas((prev) =>
      prev.map((t) => (t._id === tarefaAtualizada._id ? tarefaAtualizada : t))
    );
    setView("board");
    setTarefaAtual(null);
  };

  const handleSalvarNovaTarefa = (tarefa) => {
    setTarefas((prev) => [...prev, tarefa]);
    setView("board");
  };

  const handleClickNovaTarefa = () => {
    setView("criar");
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
    if (tarefaOriginal.status === "CONCLUIDA") {
      toast.warn("Marque a tarefa como não concluída para iniciá-la.");
      return;
    }
    const tarefaId = tarefaOriginal._id;
    // Como estamos na página de concluídas, se tentarmos Iniciar, ela deve ser reaberta como PENDENTE e depois EM ANDAMENTO
    const novoStatus = tarefaOriginal.status === 'CONCLUIDA' ? 'PENDENTE' : 'EM ANDAMENTO';
    const statusFinal = novoStatus === 'PENDENTE' ? 'EM ANDAMENTO' : novoStatus; // Garante que o status final será EM ANDAMENTO

    const tarefaAtualizada = { ...tarefaOriginal, status: statusFinal };

    // Atualiza o estado localmente para refletir o novo status (se ela mudar de status, sumirá da lista)
    setTarefas((prev) =>
      prev.map((t) => (t._id === tarefaId ? tarefaAtualizada : t))
    );
    setTarefaVisualizar(null);

    // Faz a chamada API
    api.put(`/tasks/${tarefaId}`, { status: statusFinal })
      .then(() => toast.success("Tarefa iniciada!"))
      .catch(err => {
        console.error("Erro ao iniciar tarefa:", err);
        toast.error("Erro ao iniciar tarefa.");
        // Reverte o estado local em caso de erro
        setTarefas((prev) =>
          prev.map((t) => (t._id === tarefaId ? tarefaOriginal : t))
        );
      });
  }

  // Pausar Tarefa (Muda de EM ANDAMENTO para PENDENTE)
  const handlePausarTarefa = (tarefaOriginal) => {
    const tarefaId = tarefaOriginal._id;
    const update = { status: "PENDENTE" };
    const tarefaAtualizada = { ...tarefaOriginal, status: "PENDENTE" };

    handleSalvarEdicao(tarefaAtualizada); // Usando handleSalvarEdicao para atualizar o estado local
    setTarefaVisualizar(null);

    api.put(`/tasks/${tarefaId}`, update)
      .then(() => toast.success("Tarefa pausada"))
      .catch(err => {
        console.error("Erro ao suspender tarefa:", err);
        toast.error("Erro ao suspender tarefa.");
        handleSalvarEdicao(tarefaOriginal); // Reverte
      });
  }

  // Toggle Concluída (Reabrir)
  const handleToggleConcluida = async (id) => {
    const tarefa = tarefas.find(t => t._id === id);
    if (!tarefa) return;

    // Se está aqui, ela está 'CONCLUIDA', então reabrimos como 'PENDENTE'
    const novoStatus = 'PENDENTE';
    const atualizada = { ...tarefa, status: novoStatus };

    setTarefas((prev) =>
      prev.map((t) => (t._id === id ? atualizada : t))
    );
    setTarefaVisualizar(null); // Fecha o modal se estiver aberto

    try {
      await api.put(`/tasks/${id}`, { status: novoStatus });
      toast.success("Tarefa reaberta!");
    } catch (error) {
      console.error("Erro ao reabrir tarefa:", error);
      toast.error("Erro ao reabrir tarefa.");
      setTarefas((prev) =>
        prev.map((t) => (t._id === id ? tarefa : t))
      );
    }
  };


  // --- 5. RENDERIZAÇÃO CONDICIONAL ---

  if (loading) {
    return (
      <MainContainer title="Concluídas">
        <div className="flex-1 flex justify-center items-center">
          <p className="text-gray-500">Carregando tarefas...</p>
        </div>
      </MainContainer>
    );
  }

  if (view === "criar") return <CriarTarefa onSave={handleSalvarNovaTarefa} onCancel={handleCancelar} presetDate={null} prevLocation={location.pathname} />;
  if (view === "editar" && tarefaAtual) return <EditarTarefa tarefa={tarefaAtual} onSave={handleSalvarEdicao} onCancel={handleCancelar} />;

  // Renderização da lista principal (view === "board")
  return (
    <>
      <MainContainer
        title="Concluídas"
        count={tarefasConcluidas.length}
      >
        {tarefasConcluidas.length === 0 ? (
          <EmptyStatePage
            text="Ainda não há nenhuma tarefa concluída. Para adicionar uma nova tarefa, clique no botão abaixo."
            addButton={true}
            onAddButtonClick={handleClickNovaTarefa}
          />
        ) : (
          // Lista de Tarefas
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
              {tarefasConcluidas.map((tarefa) => (
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

      {/* Modal de Visualização */}
      {tarefaVisualizar && <VisualizacaoTarefa
        tarefa={tarefaVisualizar}
        isOpen={tarefaVisualizar !== null}
        onClose={handleFecharVisualizacao}
        onEdit={handleEditarVisualizacao}
        // Quando a tarefa está CONCLUIDA, o botão de status DEVE REABRIR (mudar para PENDENTE)
        // No entanto, para manter a lógica de iniciar/pausar, usamos o padrão, 
        // mas note que se estiver CONCLUIDA, handleIniciarTarefa irá reabri-la como PENDENTE ou EM ANDAMENTO.
        onChangeStatus={tarefaVisualizar.status === "EM ANDAMENTO" ?
          () => handlePausarTarefa(tarefaVisualizar) :
          () => handleIniciarTarefa(tarefaVisualizar)
        }
      // O texto do botão no modal VisualizacaoTarefa deve ser ajustado para Reabrir/Iniciar/Pausar
      // Já que VisualizacaoTarefa é um componente externo, assumimos que ele tem a lógica
      // de usar tarefa.status === "EM ANDAMENTO" para mostrar "Pausar tarefa".
      // Se a tarefa estiver "CONCLUIDA", ele mostrará "Iniciar tarefa" (e nossa função inicia a reabertura).
      />}
    </>
  );
};

export default TarefasConcluidas;