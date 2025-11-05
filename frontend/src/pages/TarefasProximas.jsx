
import React, { useState, useEffect } from "react";
import { CirclePlus, AlertTriangle } from "lucide-react";

const ICON_STROKE_COLOR = "#949798";
const ICON_STROKE_STYLE = { color: ICON_STROKE_COLOR };
const CUSTOM_BG_COLOR = "bg-[#F7FCFE]";
const COR_LINHA_DIVISORIA = "#949798";

const AGORA = new Date("2025-11-01T12:00:00");

const parsePrazoToDate = (prazo, anoReferencia = AGORA.getFullYear()) => {
  if (!prazo) return null;
  const [horaStr, dataStr] = prazo.split(" - ");
  const [dia, mes, ano] = dataStr.split("/").map(Number);
  const [hora, minuto] = horaStr.split(":").map(Number);

  const anoCompleto = ano < 1000 ? anoReferencia : ano;
  return new Date(anoCompleto, mes - 1, dia, hora, minuto);
};

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


const listaTarefasHoje = [
  { id: 1, titulo: "Tarefa A", prazo: "09:00 - 01/11/2025", concluida: false, description: "Descrição..." },
  { id: 2, titulo: "Tarefa B", prazo: "10:30 - 01/11/2025", concluida: false, description: "Descrição..." },
  { id: 3, titulo: "Tarefa C", prazo: "11:00 - 01/11/2025", concluida: false, description: "Descrição..." },
  { id: 4, titulo: "Tarefa D", prazo: "14:00 - 01/11/2025", concluida: true, description: "Descrição..." },
  { id: 5, titulo: "Tarefa E", prazo: "15:00 - 01/11/2025", concluida: false, description: "Descrição..." },
  { id: 6, titulo: "Tarefa F (Esta não deve aparecer)", prazo: "16:00 - 01/11/2025", concluida: false, description: "Descrição..." },
];
const listaTarefasAmanha = [
  { id: 7, titulo: "Tarefa D", prazo: "09:30 - 02/11/2025", concluida: false, description: "Descrição..." },
  { id: 8, titulo: "Tarefa Z", prazo: "15:45 - 02/11/2025", concluida: false, description: "Descrição..." },
  { id: 9, titulo: "Tarefa V", prazo: "18:30 - 02/11/2025", concluida: false, description: "Descrição..." },
  { id: 10, titulo: "Tarefa P", prazo: "20:00 - 02/11/2025", concluida: false, description: "Descrição..." },
];
const listaTarefasSemana = [
  { id: 11, titulo: "Tarefa L", prazo: "11:00 - 03/11/2025", concluida: false, description: "Descrição..." },
  { id: 12, titulo: "Tarefa F", prazo: "12:00 - 04/11/2025", concluida: false, description: "Descrição..." },
  { id: 13, titulo: "Tarefa T", prazo: "13:00 - 05/11/2025", concluida: false, description: "Descrição..." },
  { id: 14, titulo: "Tarefa AB", prazo: "14:00 - 06/11/2025", concluida: false, description: "Descrição..." },
];


const PrazoLabel = ({ prazo }) => (
  <span
    className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap shadow-sm ${corPrazo(
      prazo
    )}`}
  >
    {prazo ? prazo.split(" - ")[0] : ""}
  </span>
);

const TaskItem = ({ tarefa, onToggleConcluida }) => {
  const atrasada = isAtrasada(tarefa);

  return (
    <div
      className="flex items-center justify-between border-b last:border-b-0 py-3 px-1 hover:bg-gray-50 transition"
      style={{ borderBottomColor: COR_LINHA_DIVISORIA }}
    >
      <div className="flex items-start gap-3 w-full min-w-0">
        {atrasada && (
          <div className="flex-shrink-0 mt-1" title="Tarefa Atrasada">
            <AlertTriangle size={16} style={{ color: "#CABD72" }} />
          </div>
        )}
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
            className={`text-sm font-semibold text-gray-700 truncate ${
              tarefa.concluida ? "line-through text-gray-400" : ""
            }`}
            title={tarefa.titulo}
          >
            {tarefa.titulo}
          </p>
        </div>
      </div>
      <div className="flex-shrink-0 ml-4">
        <PrazoLabel prazo={tarefa.prazo} />
      </div>
    </div>
  );
};

const TaskCard = ({ title, tasks }) => {
  const [tarefas, setTarefas] = useState(
    [...tasks].sort(compararPorPrazo)
  );

  const handleToggleConcluida = (id) => {
    setTarefas((prevTarefas) => {
      const novaLista = prevTarefas.map((t) =>
        t.id === id ? { ...t, concluida: !t.concluida } : t
      );
      return novaLista.sort(compararPorPrazo);
    });
  };

  const handleCriarNovaTarefa = () => {
    console.log(`Criar nova tarefa em ${title}`);
  };

  return (
    <div
      className={`
        ${CUSTOM_BG_COLOR} rounded-[25px] p-6 shadow-xl backdrop-blur-sm bg-opacity-90 
        flex flex-col min-h-[350px] border border-gray-300
      `}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-5">{title}</h2>
      
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

      <div className="flex-1 overflow-y-auto pr-2 min-h-0">
        {tarefas.length === 0 ? (
          <p className="text-sm text-gray-500 text-center mt-4">Nenhuma tarefa.</p>
        ) : (
          tarefas.slice(0, 5).map((tarefa) => (
            <TaskItem
              key={tarefa.id}
              tarefa={tarefa}
              onToggleConcluida={handleToggleConcluida}
            />
          ))
        )}
      </div>
    </div>
  );
};


export default function TarefasProximas() {
  useEffect(() => {
    document.title = "Próximas Tarefas";
  }, []);


  const totalTarefas =
    listaTarefasHoje.filter(t => !t.concluida).length +
    listaTarefasAmanha.filter(t => !t.concluida).length +
    listaTarefasSemana.filter(t => !t.concluida).length;

  return (
    <div className="font-poppins text-[#6B7280] flex flex-col h-full">
      <div
        className={`
          ${CUSTOM_BG_COLOR} rounded-[50px] p-8 shadow-xl backdrop-blur-sm bg-opacity-90 
          flex-1 flex flex-col min-h-0
        `}
      >
        <div className="flex items-center mb-6 flex-shrink-0">
          <h1 className="text-3xl font-bold text-gray-800 mr-3">Próximas tarefas</h1>
          <span
            className="text-base font-semibold px-3 py-1 rounded-full text-gray-800 border border-gray-300 bg-transparent"
          >
            {totalTarefas}
          </span>
        </div>

        
        <div className="flex-1 overflow-y-auto pr-2">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <TaskCard title="Hoje" tasks={listaTarefasHoje} />
            <TaskCard title="Amanhã" tasks={listaTarefasAmanha} />
          </div>

          <div>
            <TaskCard title="Esta semana" tasks={listaTarefasSemana} />
          </div>
        </div>
        
      </div>
    </div>
  );
}