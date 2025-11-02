import React, { useState, useEffect } from "react";
import imagemFundo from "../components/imagem.jpg";
import { CirclePlus } from "lucide-react";

const ICON_STROKE_COLOR = "#949798";
const ICON_STROKE_STYLE = { color: ICON_STROKE_COLOR };
const CUSTOM_BG_COLOR = "bg-[#F7FCFE]";
const COR_LINHA_DIVISORIA = "#949798";

const COR_CONCLUIDA = "bg-[#B5D1DB] text-[#4C6A72] border border-[#9CBAC3]";

const APP_BACKGROUND_STYLE = {
  minHeight: "100vh",
  background: `url(${imagemFundo}) no-repeat center center fixed`,
  backgroundSize: "cover",
};

const AGORA = new Date("2025-11-02T17:23:49"); // Atualizado para a data/hora atual (02/11/2025)

const parsePrazoToDate = (prazo, anoReferencia = AGORA.getFullYear()) => {
  if (!prazo) return null;
  const [horaStr, dataStr] = prazo.split(" - ");
  const [dia, mes, ano] = dataStr.split("/").map(Number);
  const [hora, minuto] = horaStr.split(":").map(Number);

  const anoCompleto = ano < 1000 ? anoReferencia : ano;
  return new Date(anoCompleto, mes - 1, dia, hora, minuto);
};

function corPrazo(prazo) {
  return COR_CONCLUIDA;
}

const compararPorPrazoDecrescente = (a, b) => {
  const dataA = parsePrazoToDate(a.prazo);
  const dataB = parsePrazoToDate(b.prazo);

  if (!dataA) return 1;
  if (!dataB) return -1;

  // b.getTime() - a.getTime() garante a ordem decrescente (do mais novo para o mais antigo)
  return dataB.getTime() - dataA.getTime();
};

const listaInicialTarefasConcluidas = [
  {
    id: 17,
    titulo: "Fechamento Mensal",
    description: "Envio do relatório financeiro de Outubro.",
    prazo: "16:00 - 02/11/2025",
    concluida: true,
  },
  {
    id: 18,
    titulo: "Backup do Servidor Principal",
    description: "Verificação e finalização do backup semanal.",
    prazo: "14:30 - 02/11/2025",
    concluida: true,
  },
  {
    id: 19,
    titulo: "Preparação de Slides",
    description: "Slides para a reunião matinal de Segunda.",
    prazo: "11:00 - 02/11/2025",
    concluida: true,
  },

  {
    id: 10,
    titulo: "Alinhamento Interno (Recente)",
    description: "Reunião de follow-up com o departamento de TI.",
    prazo: "13:00 - 01/11/2025",
    concluida: true,
  },
  {
    id: 9,
    titulo: "E-mails Respondidos",
    description: "Caixa de entrada limpa e respondida.",
    prazo: "11:30 - 01/11/2025",
    concluida: true,
  },
  {
    id: 20,
    titulo: "Revisão do Contrato Delta",
    description: "Análise jurídica e assinatura digital.",
    prazo: "09:45 - 01/11/2025",
    concluida: true,
  },
  {
    id: 11,
    titulo: "Protótipo Aprovado",
    description: "Submissão final do wireframe V2.",
    prazo: "18:00 - 31/10/2025",
    concluida: true,
  },
  {
    id: 21,
    titulo: "Criação de Campanha Marketing",
    description: "Lançamento da campanha de Black Friday.",
    prazo: "14:00 - 31/10/2025",
    concluida: true,
  },
  {
    id: 22,
    titulo: "Manutenção do Site Varejo",
    description: "Correção de links quebrados na página inicial.",
    prazo: "09:00 - 31/10/2025",
    concluida: true,
  },

  {
    id: 12,
    titulo: "Organizar Documentação",
    description: "Arquivamento de contratos de Q3.",
    prazo: "10:00 - 28/10/2025",
    concluida: true,
  },
  {
    id: 13,
    titulo: "Treinamento Finalizado",
    description: "Conclusão do curso de segurança online.",
    prazo: "15:00 - 25/10/2025",
    concluida: true,
  },
  {
    id: 14,
    titulo: "Configurar Ambiente Dev",
    description: "Preparar VM para novo projeto.",
    prazo: "09:00 - 24/10/2025",
    concluida: true,
  },
  {
    id: 23,
    titulo: "Reunião de Kick-off",
    description: "Início do Projeto Júpiter.",
    prazo: "14:00 - 22/10/2025",
    concluida: true,
  },
  {
    id: 24,
    titulo: "Pesquisa de Mercado",
    description: "Relatório de competitividade do setor.",
    prazo: "17:00 - 20/10/2025",
    concluida: true,
  },
  {
    id: 25,
    titulo: "Atualização de Software",
    description: "Update de segurança nos terminais.",
    prazo: "10:00 - 18/10/2025",
    concluida: true,
  },
  {
    id: 26,
    titulo: "Pagamento de Aluguel",
    description: "Processar o pagamento do escritório.",
    prazo: "11:00 - 15/10/2025",
    concluida: true,
  },
  {
    id: 27,
    titulo: "Orçamento de Q4",
    description: "Revisão e aprovação do orçamento do trimestre.",
    prazo: "16:00 - 10/10/2025",
    concluida: true,
  },
  {
    id: 28,
    titulo: "Configurar VPN",
    description: "Setup da rede virtual para novos colaboradores.",
    prazo: "09:00 - 05/10/2025",
    concluida: true,
  },

  // Tarefas Pendentes (Não aparecerão)
  {
    id: 15,
    titulo: "Revisão de Código",
    description: "Revisar pull request #101.",
    prazo: "14:00 - 03/11/2025",
    concluida: false,
  },
];

const PrazoLabel = ({ prazo }) => (
  <span
    className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap shadow-sm ${corPrazo(
      prazo
    )}`}
  >
    {prazo ? prazo.split(" - ")[1] : ""}
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
          checked={tarefa.concluida}
          onChange={() => onToggleConcluida(tarefa.id)}
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
            className={`text-sm font-semibold text-gray-700 truncate text-gray-700`}
            title={tarefa.titulo}
          >
            {tarefa.titulo}
          </p>
          <p
            className={`text-xs text-gray-500 truncate text-gray-500`}
            title={tarefa.description}
          >
            {tarefa.description}
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

const EmptyState = ({ onCriarTarefa }) => (
  <div className="flex flex-col items-center text-center w-full">
    {/* Título: "Nenhuma tarefa" */}
    <p className="text-gray-700 font-bold text-[22px] mb-2">Nenhuma tarefa</p>

    {/* Mensagem: Atualizada conforme solicitado */}
    <p className="text-gray-500 text-[15px] font-normal max-w-xs mb-6">
      Ainda não há nenhuma tarefa concluída. Se quiser adicionar uma, clique no
      botão abaixo.
    </p>

    {/* Botão Criar */}
    <button
      onClick={onCriarTarefa}
      className="flex items-center px-6 py-2 text-white bg-[#8E8E8E] rounded-[20px] shadow-md hover:bg-[#787878] transition text-sm font-medium"
    >
      Criar
    </button>
  </div>
);

const TarefasConcluidas = () => {
  useEffect(() => {
    document.title = "Tarefas Concluídas";
  }, []);

  const [tarefas, setTarefas] = useState(listaInicialTarefasConcluidas);
  const [isEmptyDemo, setIsEmptyDemo] = useState(false);

  // FILTRAGEM CHAVE: Apenas tarefas CONCLUÍDAS
  const tarefasConcluidas = tarefas.filter((t) => t.concluida);

  // ORDENAÇÃO: Aplicamos a ordenação decrescente APENAS às concluídas
  const sortedTasks = [...tarefasConcluidas].sort(compararPorPrazoDecrescente);

  const displayedTasks = isEmptyDemo ? [] : sortedTasks;

  const handleToggleConcluida = (id) => {
    // Reverter o estado (reabrir a tarefa)
    setTarefas((prevTarefas) => {
      // Encontra a tarefa e inverte o estado `concluida`
      const novaLista = prevTarefas.map((t) =>
        t.id === id ? { ...t, concluida: !t.concluida } : t
      );
      return novaLista;
    });
  };

  const handleCriarNovaTarefa = () => {
    console.log("Criar nova tarefa clicado!");
  };

  return (
    <div
      style={APP_BACKGROUND_STYLE}
      className="p-8 font-poppins text-[#6B7280] flex justify-center items-center"
    >
      {/* Bloco principal */}
      <div
        className={`
          ${CUSTOM_BG_COLOR} rounded-[50px] p-8 w-full max-w-6xl shadow-xl backdrop-blur-sm bg-opacity-90 
          min-h-[500px] flex flex-col
        `}
      >
        {/* Título e Contador (Pílula) */}
        <div className="flex items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mr-3">Concluídas</h1>
          <span
            className="text-base font-semibold px-3 py-1 rounded-full text-gray-800 border border-gray-300 bg-transparent cursor-pointer hover:bg-gray-100 transition"
            onClick={() => setIsEmptyDemo(!isEmptyDemo)}
            title="Clique para alternar entre preenchido e vazio (Empty State)"
          >
            {isEmptyDemo ? 0 : tarefasConcluidas.length}
          </span>
        </div>

        {/* CONTAINER PARA A BORDA DO CONTEÚDO */}
        <div
          className="border border-[#949798] rounded-[25px] p-10 flex-grow flex flex-col"
          style={{ minHeight: "450px" }}
        >
          {displayedTasks.length === 0 ? (
            // Empty State Centralizado
            <div className="flex-grow flex justify-center items-center">
              <EmptyState onCriarTarefa={handleCriarNovaTarefa} />
            </div>
          ) : (
            // Lista de Tarefas
            <div className="w-full flex flex-col flex-grow">
              {/* Botão Nova Tarefa */}
              <div className="border-b border-gray-100 pb-3 mb-2 flex-shrink-0">
                <button
                  className={`
                    flex items-center w-full px-4 py-2 
                    text-[#949798] bg-transparent border border-[#949798] 
                    rounded-lg shadow-sm hover:bg-gray-200 transition
                  `}
                  onClick={handleCriarNovaTarefa}
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
                className="flex-grow overflow-y-auto pr-2"
                style={{ maxHeight: "420px" }}
              >
                {displayedTasks.map((tarefa) => (
                  <TaskItem
                    key={tarefa.id}
                    tarefa={tarefa}
                    onToggleConcluida={handleToggleConcluida}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TarefasConcluidas;
