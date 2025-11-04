import React, { useState, useEffect } from "react";
import imagemFundo from "../assets/imagem.jpg";
import { CirclePlus, AlertTriangle } from "lucide-react";

const ICON_STROKE_COLOR = "#949798";
const ICON_STROKE_STYLE = { color: ICON_STROKE_COLOR };
const CUSTOM_BG_COLOR = "bg-[#F7FCFE]";
const COR_ALERTA_ATRASO = "#CABD72";
const COR_LINHA_DIVISORIA = "#949798";

const APP_BACKGROUND_STYLE = {
  minHeight: "100vh",
  background: `url(${imagemFundo}) no-repeat center center fixed`,
  backgroundSize: "cover",
};

// Data de referência (hoje)
const AGORA = new Date("2025-11-01T12:00:00");

const parsePrazoToDate = (prazo, anoReferencia = AGORA.getFullYear()) => {
  if (!prazo) return null;
  const [horaStr, dataStr] = prazo.split(" - ");
  const [dia, mes, ano] = dataStr.split("/").map(Number);
  const [hora, minuto] = horaStr.split(":").map(Number);

  const anoCompleto = ano < 1000 ? anoReferencia : ano;
  return new Date(anoCompleto, mes - 1, dia, hora, minuto);
};

// Função para verificar se a tarefa está Atrasada
const isAtrasada = (tarefa) => {
  if (tarefa.concluida) return false;
  const dataPrazo = parsePrazoToDate(tarefa.prazo);
  return dataPrazo && dataPrazo < AGORA;
};

function corPrazo(prazo) {
  const dataPrazo = parsePrazoToDate(prazo, AGORA.getFullYear());
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

const compararPorPrazo = (a, b) => {
  if (a.concluida && !b.concluida) return 1;
  if (!a.concluida && b.concluida) return -1;

  const dataA = parsePrazoToDate(a.prazo);
  const dataB = parsePrazoToDate(b.prazo);

  if (!dataA) return 1;
  if (!dataB) return -1;

  return dataA.getTime() - dataB.getTime();
};

const listaInicialTarefasHoje = [
  {
    id: 1,
    titulo: "Ação Urgente - Pendente",
    description: "Revisão e aprovação do documento de estratégia Beta.",
    prazo: "09:00 - 01/11/2025",
    concluida: false,
  },
  {
    id: 2,
    titulo: "Chamada com Cliente Alfa",
    description: "Preparar pauta para reunião de feedback trimestral.",
    prazo: "10:30 - 01/11/2025",
    concluida: false,
  },
  {
    id: 3,
    titulo: "Desenvolvimento de Módulo X",
    description: "Codificar as funcionalidades da nova interface de usuário.",
    prazo: "14:00 - 01/11/2025",
    concluida: false,
  },
  {
    id: 4,
    titulo: "Logística - Material de Escritório",
    description: "Confirmar entrega e verificar estoque de suprimentos.",
    prazo: "15:30 - 01/11/2025",
    concluida: false,
  },
  {
    id: 5,
    titulo: "Relatório de Desempenho",
    description: "Compilar dados de vendas do último mês e formatar.",
    prazo: "16:45 - 01/11/2025",
    concluida: false,
  },
  {
    id: 6,
    titulo: "Treinamento de Equipe",
    description: "Preparar slides para a sessão de treinamento de integração.",
    prazo: "18:00 - 01/11/2025",
    concluida: false,
  },
  {
    id: 7,
    titulo: "Tarefas Administrativas",
    description: "Organizar e arquivar faturas pendentes da semana.",
    prazo: "20:15 - 01/11/2025",
    concluida: false,
  },
  {
    id: 8,
    titulo: "Leitura e Pesquisa",
    description:
      "Revisar artigo sobre tendências do mercado para a próxima semana.",
    prazo: "21:30 - 01/11/2025",
    concluida: false,
  },
  {
    id: 9,
    titulo: "E-mails Respondidos",
    description: "Caixa de entrada limpa e respondida.",
    prazo: "11:30 - 01/11/2025",
    concluida: true,
  },
  {
    id: 10,
    titulo: "Alinhamento Interno",
    description: "Reunião de follow-up com o departamento de TI.",
    prazo: "13:00 - 01/11/2025",
    concluida: true,
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
  const atrasada = isAtrasada(tarefa);

  return (
    <div
      className="flex items-center justify-between border-b last:border-b-0 py-3 px-1 hover:bg-gray-50 transition"
      style={{ borderBottomColor: COR_LINHA_DIVISORIA }}
    >
      {/* Container simples para o conteúdo principal */}
      <div className="flex items-start gap-3 w-full min-w-0">
        {/* ÍCONE DE ALERTA */}
        {atrasada && (
          <div className="flex-shrink-0 mt-1" title="Tarefa Atrasada">
            <AlertTriangle size={16} style={{ color: COR_ALERTA_ATRASO }} />
          </div>
        )}

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
          {/* Título */}
          <p
            className={`text-sm font-semibold text-gray-700 truncate ${
              tarefa.concluida ? "line-through text-gray-400" : ""
            }`}
            title={tarefa.titulo}
          >
            {tarefa.titulo}
          </p>
          {/* Descrição */}
          <p
            className={`text-xs text-gray-500 truncate ${
              tarefa.concluida ? "line-through text-gray-300" : ""
            }`}
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
    <p className="text-gray-700 font-bold text-[22px] mb-2">Nenhuma tarefa</p>

    <p className="text-gray-500 text-[15px] font-normal max-w-xs mb-6">
      Ainda não há nenhuma tarefa criada nesse período. Se quiser adicionar uma,
      clique no botão abaixo.
    </p>

    <button
      onClick={onCriarTarefa}
      className="flex items-center px-6 py-2 text-white bg-[#8E8E8E] rounded-[20px] shadow-md hover:bg-[#787878] transition text-sm font-medium"
    >
      Criar
    </button>
  </div>
);

const TarefasHoje = () => {
  useEffect(() => {
    document.title = "Tarefas de Hoje";
  }, []);

  const [tarefas, setTarefas] = useState(
    [...listaInicialTarefasHoje].sort(compararPorPrazo)
  );
  const [isEmptyDemo, setIsEmptyDemo] = useState(false);

  const tarefasDoDia = tarefas.filter(
    (t) =>
      parsePrazoToDate(t.prazo) &&
      parsePrazoToDate(t.prazo).toDateString() === AGORA.toDateString()
  );

  const tarefasPendentesHoje = tarefasDoDia.filter((t) => !t.concluida);
  const displayedTasks = isEmptyDemo ? [] : tarefasDoDia;

  const handleToggleConcluida = (id) => {
    setTarefas((prevTarefas) => {
      const novaLista = prevTarefas.map((t) =>
        t.id === id ? { ...t, concluida: !t.concluida } : t
      );
      return novaLista.sort(compararPorPrazo);
    });
  };

  const handleCriarNovaTarefa = () => {
    console.log("Criar nova tarefa clicado!");
  };

  return (
    <div
      className="font-poppins text-[#6B7280] flex-1 flex flex-col h-full"
    >
      {/* Bloco principal */}
      <div
        className={`
          ${CUSTOM_BG_COLOR} rounded-[50px] p-8 shadow-xl backdrop-blur-sm bg-opacity-90 flex flex-1 flex-col min-h-0
        `}
      >
        {/* Título e Contador (Contorno - FORMATO CÍRCULO/PÍLULA) */}
        <div className="flex items-center mb-6 flex-shrink-0">
          <h1 className="text-3xl font-bold text-gray-800 mr-3">Hoje</h1>
          <span
            // CLASSE CORRIGIDA: De volta para 'rounded-full'
            className="text-base font-semibold px-3 py-1 rounded-full text-gray-800 border border-gray-300 bg-transparent cursor-pointer hover:bg-gray-100 transition"
            onClick={() => setIsEmptyDemo(!isEmptyDemo)}
            title="Clique para alternar entre preenchido e vazio (Empty State)"
          >
            {isEmptyDemo ? 0 : tarefasPendentesHoje.length}
          </span>
        </div>

        {/* CONTAINER PARA A BORDA DO CONTEÚDO */}
        <div className="border border-[#949798] rounded-[25px] p-10 flex-1 flex flex-col min-h-0">
          {displayedTasks.length === 0 ? (
            <div className="flex-1 flex justify-center items-center">
              <EmptyState onCriarTarefa={handleCriarNovaTarefa} />
            </div>
          ) : (
            // Lista de Tarefas
            <div className="w-full flex flex-col flex-1 min-h-0">
              {/* Botão Nova Tarefa */}
              <div className="border-b border-gray-100 pb-3 mb-2">
                <button
                  className={`
                    flex items-center w-full px-4 py-2 
                    // Borda corrigida para #949798
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
                className="flex-1 overflow-y-auto pr-2 min-h-0"
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

export default TarefasHoje;
