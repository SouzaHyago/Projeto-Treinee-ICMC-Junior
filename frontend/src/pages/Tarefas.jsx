import React, { useState, useEffect, useRef } from "react";
import EmptyStatePage from "../components/EmptyStatePage.jsx";
import CriarTarefa from "./CriarTarefa.jsx";
import EditarTarefa from "./EditarTarefa.jsx";
import ExcluirTarefa from "../modals/ExcluirTarefa.jsx";
import VisualizacaoTarefa from "../modals/VisualizacaoTarefa.jsx";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  ExternalLink,
  Clock,
  AlertTriangle,
  Check,
  CirclePlus,
} from "lucide-react";

const ICON_STROKE_COLOR = "#ACAFB0";
const ICON_STROKE_STYLE = { color: ICON_STROKE_COLOR };
const CUSTOM_BG_COLOR = "bg-[#F7FCFE]";

// Data de referência fixa para que as cores de prazo funcionem corretamente
// 01/11/2025 12:00:00
const AGORA = new Date("2025-11-01T12:00:00");

// Função auxiliar para converter o prazo (string) em um objeto Date
const parsePrazoToDate = (prazo, anoReferencia = AGORA.getFullYear()) => {
  if (!prazo) return null;
  const [horaStr, dataStr] = prazo.split(" - ");
  const [dia, mes, ano] = dataStr.split("/").map(Number);
  const [hora, minuto] = horaStr.split(":").map(Number);

  // Suporte a anos abreviados (ex: 25)
  const anoCompleto = ano < 1000 ? anoReferencia : ano;
  return new Date(anoCompleto, mes - 1, dia, hora, minuto);
};

// Função de comparação para ordenação:
const compararPorPrazo = (a, b) => {
  if (a.concluida && !b.concluida) return 1;
  if (!a.concluida && b.concluida) return -1;

  const dataA = parsePrazoToDate(a.prazo);
  const dataB = parsePrazoToDate(b.prazo);

  if (!dataA) return 1;
  if (!dataB) return -1;

  return dataA.getTime() - dataB.getTime();
};

export default function Tarefas() {
  const listaInicial = [
    {
      id: 1,
      titulo: "Reunião de Alinhamento do Projeto X",
      descricao:
        "Preparar pauta e slides para a reunião de kickoff do projeto X. Verificar agendas.",
      prazo: "09:00 - 01/11/2025",
      concluida: false,
      obs: "Observar o tempo de apresentação para não ultrapassar 30 minutos.",
    },
    {
      id: 2,
      titulo: "Enviar Relatório Mensal de Vendas",
      descricao:
        "Compilar dados de outubro e gerar o relatório para a diretoria.",
      prazo: "18:00 - 31/10/2025",
      concluida: false,
    },
    {
      id: 3,
      titulo: "Responder e-mails pendentes",
      descricao:
        "Caixa de entrada acumulada. Priorizar os e-mails do cliente Beta.",
      prazo: "12:00 - 01/11/2025",
      concluida: true,
    },
    {
      id: 4,
      titulo: "Desenvolver Feature A",
      descricao:
        "Implementar a nova funcionalidade de carrinho no módulo principal.",
      prazo: "16:45 - 03/11/2025",
      concluida: false,
    },
    {
      id: 5,
      titulo: "Revisar Código do Pull Request #123",
      descricao: "Fazer code review na solicitação de integração de João.",
      prazo: "08:25 - 02/11/2025",
      concluida: false,
    },
    {
      id: 6,
      titulo: "Agendar Call com Fornecedor",
      descricao:
        "Definir horário e pauta para discutir o contrato de manutenção.",
      prazo: "13:50 - 05/11/2025",
      concluida: false,
    },
    {
      id: 7,
      titulo: "Elaborar Proposta Comercial",
      descricao: "Criar o documento final da proposta para o Cliente Alpha.",
      prazo: "23:59 - 01/11/2025",
      concluida: false,
    },
    {
      id: 8,
      titulo: "Backup do Servidor de Testes",
      descricao:
        "Verificar rotina de backup e garantir que foi executada corretamente.",
      prazo: "11:10 - 25/10/2025",
      concluida: true,
    },
    {
      id: 9,
      titulo: "Preparar Apresentação de Resultados",
      descricao: "Coletar KPIs do trimestre para a reunião semanal da equipe.",
      prazo: "09:00 - 04/11/2025",
      concluida: false,
    },
    {
      id: 10,
      titulo: "Configurar Ambiente de QA",
      descricao:
        "Instalar dependências e preparar o ambiente de qualidade para testes.",
      prazo: "14:30 - 03/11/2025",
      concluida: false,
    },
    {
      id: 11,
      titulo: "Treinamento de Novo Membro",
      descricao: "Realizar sessão de integração e explicar processos internos.",
      prazo: "10:00 - 02/11/2025",
      concluida: false,
    },
    {
      id: 12,
      titulo: "Solicitar Férias",
      descricao:
        "Preencher o formulário de solicitação de recesso anual no sistema de RH.",
      prazo: "17:00 - 30/10/2025",
      concluida: false,
    },
    {
      id: 13,
      titulo: "Análise de Mercado - Concorrentes",
      descricao:
        "Estudar as estratégias de preço e marketing dos 3 principais concorrentes.",
      prazo: "10:00 - 06/11/2025",
      concluida: false,
    },
    {
      id: 14,
      titulo: "Debug em Produção",
      descricao: "Investigar e corrigir o erro crítico reportado pelo cliente.",
      prazo: "15:30 - 01/11/2025",
      concluida: true,
    },
    {
      id: 15,
      titulo: "Otimizar Consultas SQL",
      descricao:
        "Revisar as consultas mais lentas do banco de dados para melhorar a performance.",
      prazo: "11:00 - 02/11/2025",
      concluida: false,
    },
    {
      id: 16,
      titulo: "Design do E-mail Marketing",
      descricao:
        "Criar o layout e conteúdo para a newsletter da próxima semana.",
      prazo: "14:00 - 07/11/2025",
      concluida: false,
    },
    {
      id: 17,
      titulo: "Atualizar Documentação Técnica",
      descricao:
        "Garantir que os documentos de arquitetura reflitam o estado atual do sistema.",
      prazo: "16:00 - 01/11/2025",
      concluida: false,
    },
    {
      id: 18,
      titulo: "Pagar Contas",
      descricao:
        "Realizar o pagamento de todos os boletos e faturas pendentes do mês.",
      prazo: "10:30 - 28/10/2025",
      concluida: true,
    },
    {
      id: 19,
      titulo: "Fazer Orçamento de Infraestrutura",
      descricao: "Levantar custos para a migração dos serviços para a nuvem.",
      prazo: "17:00 - 03/11/2025",
      concluida: false,
    },
    {
      id: 20,
      titulo: "Ler Livro Técnico (Capítulo 5)",
      descricao: "Estudar o novo framework de back-end.",
      prazo: "22:00 - 04/11/2025",
      concluida: false,
    },
  ];

  const [tarefas, setTarefas] = useState(
    [...listaInicial].sort(compararPorPrazo)
  );

  const [view, setView] = useState("lista");
  const [tarefaAtual, setTarefaAtual] = useState(null); // Tarefa sendo editada
  const [tarefaExcluir, setTarefaExcluir] = useState(null); // Tarefa sendo excluída
  const [tarefaVisualizar, setTarefaVisualizar] = useState(null); // Tarefa sendo visualizada
  const [paginaAtual, setPaginaAtual] = useState(1);
  const tarefasPorPagina = 7;
  const indiceInicial = (paginaAtual - 1) * tarefasPorPagina;
  const tarefasVisiveis = tarefas.slice(
    indiceInicial,
    indiceInicial + tarefasPorPagina
  );
  const totalPaginas = Math.ceil(tarefas.length / tarefasPorPagina);

  const [menuAberto, setMenuAberto] = useState(null);
  const [menuPosicao, setMenuPosicao] = useState({ top: 0, left: 0 });
  const tabelaRef = useRef(null);
  const menuRefs = useRef({});

  useEffect(() => {
    // Define o novo título da página
    document.title = "Página Inicial";
  }, []);

  const calcularPosicaoMenu = (tarefaId) => {
    const buttonRef = menuRefs.current[tarefaId];

    if (buttonRef) {
      const rect = buttonRef.getBoundingClientRect();

      const container = document.querySelector('.main-content');
      const containerRect = container ? container.getBoundingClientRect() : { left: 0, top: 0 };

      const newTop = rect.bottom - containerRect.top + container.scrollTop - 30;

      const menuWidth = 210;
      const newLeft = rect.right - containerRect.left - menuWidth - 40;

      setMenuPosicao({ top: newTop, left: newLeft });
    }
  };

  const alternarConclusao = (tarefaId) => {
    setTarefas((prevTarefas) => {
      const novaLista = prevTarefas.map((t) =>
        t.id === tarefaId ? { ...t, concluida: !t.concluida } : t
      );
      return novaLista.sort(compararPorPrazo);
    });
  };

  const toggleMenu = (tarefaId) => {
    if (menuAberto === tarefaId) {
      setMenuAberto(null);
    } else {
      setMenuAberto(tarefaId);
      calcularPosicaoMenu(tarefaId);
    }
  };

  useEffect(() => {
    function handleResize() {
      if (menuAberto !== null) {
        calcularPosicaoMenu(menuAberto);
      }
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [menuAberto]);

  // USEEFFECT EXISTENTE: FECHA O MENU AO CLICAR FORA
  useEffect(() => {
    function handleClickOutside(event) {
      let clickedOutsideMenuOrButton = true;

      if (menuAberto !== null) {
        const menuElement = document.getElementById(
          `menu-flutuante-${menuAberto}`
        );
        const buttonElement = menuRefs.current[menuAberto];

        if (
          (menuElement && menuElement.contains(event.target)) ||
          (buttonElement && buttonElement.contains(event.target))
        ) {
          clickedOutsideMenuOrButton = false;
        }
      }

      if (clickedOutsideMenuOrButton && menuAberto !== null) {
        setMenuAberto(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuAberto]);

  function corPrazo(prazo) {
    const dataPrazo = parsePrazoToDate(prazo, AGORA.getFullYear());
    if (!dataPrazo)
      return {
      cor: "bg-gray-100 text-gray-500 border border-gray-200",
      label: "sem prazo"
    };

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
      return {
        cor: "bg-[#EFE999] text-[#726A4C] border border-[#DED581]",
        label: "Em atraso"
      };

    if (dataPrazoDia.toDateString() === hojeData.toDateString())
      return {
        cor: "bg-[#B5D1DB] text-[#4C6A72] border border-[#9CBAC3]",
        label: "Para hoje"
      };

    if (dataPrazoDia.toDateString() === amanhaData.toDateString())
      return {
        cor: "bg-[#D7B8D2] text-[#724C6A] border border-[#BFA0B9]",
        label: "Para amanhã"
      };

    return {
      cor: "bg-[#C1E0C5] text-[#517255] border border-[#A8C7AD]",
      label: "No prazo"
    };
  }

  const handleSalvarNovaTarefa = (tarefa) => {
    setTarefas((prevTarefas) =>
      [...prevTarefas, tarefa].sort(compararPorPrazo)
    );
    setView("lista"); // Volta para a lista
  };

  const handleSalvarEdicao = (tarefaAtualizada) => {
    setTarefas((prevTarefas) =>
      prevTarefas
        .map((t) => (t.id === tarefaAtualizada.id ? tarefaAtualizada : t))
        .sort(compararPorPrazo)
    );
    setView("lista"); // Volta para a lista
    setTarefaAtual(null); // Limpa a tarefa atual
  };

  const handleEditar = (tarefaId) => {
    const tarefa = tarefas.find((t) => t.id === tarefaId);
    if (tarefa) {
      setTarefaAtual(tarefa); // Tarefa que será editada
      setView("editar"); // Muda a view para a de edição
    }
    setMenuAberto(null);
  };

  // Quando clicado 'Editar' na visualização
  const handleEditarVisualizacao = () => {
    if (tarefaVisualizar)
      handleEditar(tarefaVisualizar.id); // Tarefa que será editada
    setTarefaVisualizar(null);
  };

// Gerenciamento de exclusão de uma tarefa
  const handleExcluir = (tarefaId) => {
    setTarefaExcluir(tarefaId);
    setMenuAberto(null);
  };

  const confirmarExclusao = () => {
    if (tarefaExcluir) {
      setTarefas((prevTarefas) =>
        prevTarefas.filter((t) => t.id !== tarefaExcluir)
    );
      setTarefaExcluir(null);
    }
  };

  const cancelarExclusao = () => {
    setTarefaExcluir(null);
  };

  const handleCancelar = () => {
    console.log("handleCancelar called - setting view to lista");
    setView("lista");
    setTarefaAtual(null);
  };

  const handleNovaTarefa = () => {
    setView("criar");
    setTarefaAtual(null);
  };

  const handleAbrirVisualizacao = (tarefa) => {
    setTarefaVisualizar(tarefa);
  };

  const handleFecharVisualizacao = () => {
    setTarefaVisualizar(null);
  };

  const handleVisualizar = (tarefaId) => {
    const tarefa = tarefas.find((t) => t.id === tarefaId);
    if (tarefa) {
      handleAbrirVisualizacao(tarefa);
    }
    setMenuAberto(null);
  };

  if (view === "criar") {
    return (
      <CriarTarefa
        onSave={handleSalvarNovaTarefa}
        onCancel={handleCancelar}
      />
    );
  }

  if (view === "editar" && tarefaAtual) {
    return (
      <EditarTarefa
        tarefa={tarefaAtual}
        onSave={handleSalvarEdicao}
        onCancel={handleCancelar}
      />
    );
  }

  // View "lista" (padrão)
  return (
    <div
      className="font-poppins text-[#6B7280] flex flex-col h-full"
    >
      {/* BLOCO PRINCIPAL: Raio 50px */}
      <div
        className={`${CUSTOM_BG_COLOR} rounded-[50px] p-8 flex-1 flex flex-col h-full shadow-xl backdrop-blur-sm bg-opacity-90`}
      >
        {/* Topo: título */}
        <div className="mt-2 ml-4 mb-6">
          <h1 className="text-[36px] font-bold text-gray-800">Tarefas</h1>
          <p className="text-[15px] font-normal text-gray-500">
            Gerencie suas tarefas de forma simples e rápida.
          </p>
        </div>
        <div
          className={`border border-gray-400 rounded-[50px] ${CUSTOM_BG_COLOR} p-8 flex flex-col flex-1 min-h-0`}
        >
          {/* Ações e filtros */}
          <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            {/* Botão Nova Tarefa (ÍCONE: CirclePlus) */}
            <button
              className={`border border-gray-300 ${CUSTOM_BG_COLOR} text-gray-500 rounded-lg px-4 py-2 text-[14px] font-medium shadow-sm hover:bg-gray-200 transition flex items-center gap-2`}
              onClick={handleNovaTarefa}
            >
              <CirclePlus size={16} style={ICON_STROKE_STYLE} />
              Nova Tarefa
            </button>

            {/* Filtros */}
            <div className="flex gap-2 flex-wrap">
              {/* Filtro Em andamento (ÍCONE: Clock) */}
              <button
                className={`border border-gray-300 ${CUSTOM_BG_COLOR} text-gray-500 rounded-lg px-4 py-2 text-[14px] font-medium hover:bg-gray-200 transition flex items-center gap-2`}
              >
                <Clock size={16} style={ICON_STROKE_STYLE} /> Em andamento
              </button>

              {/* Filtro Atrasadas (ÍCONE: AlertTriangle) */}
              <button
                className={`border border-gray-300 ${CUSTOM_BG_COLOR} text-gray-500 rounded-lg px-4 py-2 text-[14px] font-medium hover:bg-gray-200 transition flex items-center gap-2`}
              >
                <AlertTriangle size={16} style={ICON_STROKE_STYLE} /> Atrasadas
              </button>

              {/* Filtro Concluídas (ÍCONE: Check) */}
              <button
                className={`border border-gray-300 ${CUSTOM_BG_COLOR} text-gray-500 rounded-lg px-4 py-2 text-[14px] font-medium hover:bg-gray-200 transition flex items-center gap-2`}
              >
                <Check size={16} style={ICON_STROKE_STYLE} /> Concluídas
              </button>
            </div>
          </div>

          {/* Tabela Container: Raio 50px */}
          <div
            className="overflow-x-auto border border-gray-300 rounded-[50px] overflow-hidden"
            ref={tabelaRef}
          >
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-left text-gray-600 border-b border-gray-300">
                  <th className="py-3 px-6 text-center text-[14px] font-medium border-r border-gray-300">
                    Descrição da Tarefa
                  </th>
                  <th className="py-3 px-6 text-center text-[14px] font-medium w-40 border-r border-gray-300">
                    Prazo
                  </th>
                  <th className="py-3 px-6 text-center text-[14px] font-medium w-20">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {tarefasVisiveis.map((tarefa) => {
                  return (
                    <tr
                      key={tarefa.id}
                      className={`border-b border-gray-300 last:border-b-0 hover:bg-gray-100 transition ${CUSTOM_BG_COLOR} cursor-pointer`}
                      onClick={() => handleAbrirVisualizacao(tarefa)}
                    >
                      {/* Conteúdo 1: Descrição e Checkbox */}
                      <td className="py-4 px-6 border-r border-gray-300">
                        <div className="flex items-start gap-3">
                          {/* CHECKBOX VAZADO */}
                          <input
                            type="checkbox"
                            checked={tarefa.concluida}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => {e.stopPropagation(); alternarConclusao(tarefa.id)}}
                            className={`
                              mt-1 h-4 w-4 rounded-sm 
                              appearance-none cursor-pointer
                              bg-transparent border border-gray-700 
                              checked:bg-gray-700 checked:border-gray-700 checked:text-white
                              focus:ring-0
                            `}
                          />

                          <div className="truncate text-left">
                            <p
                              className={`text-[14px] font-normal text-gray-800 truncate ${
                                tarefa.concluida
                                  ? "line-through text-gray-500"
                                  : ""
                              }`}
                              title={tarefa.titulo}
                            >
                              {tarefa.titulo}
                            </p>
                            <p
                              className={`text-[14px] font-normal text-gray-500 truncate ${
                                tarefa.concluida ? "line-through" : ""
                              }`}
                              title={tarefa.descricao}
                            >
                              {tarefa.descricao}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Conteúdo 2: Prazo (Cores Customizadas) */}
                      <td className="py-4 px-6 text-center border-r border-gray-300">
                        {(() => {
                          const { cor, label } = corPrazo(tarefa.prazo);
                          return (
                            <span
                              title={label} // Texto ao passar o cursor
                              className={`inline-block px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shadow-sm ${cor}`}
                            >
                              {tarefa.prazo.split(" - ")[1]}
                            </span>
                          );
                        })()}
                      </td>

                      {/* Última Célula (Ações) */}
                      <td className="py-4 px-6 text-center">
                        <button
                          // Armazena a ref no objeto menuRefs com o ID da tarefa
                          ref={(el) => (menuRefs.current[tarefa.id] = el)}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleMenu(tarefa.id)}
                          }
                          className="p-1 rounded-full text-gray-500 hover:bg-gray-200 transition"
                        >
                          <MoreHorizontal size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* MENU SUSPENSO FLUTUANTE */}
        {menuAberto !== null && (
          <div
            id={`menu-flutuante-${menuAberto}`}
            className={`absolute border border-gray-200 rounded-lg shadow-2xl w-36 text-sm text-gray-700 z-50 overflow-hidden ${CUSTOM_BG_COLOR}`}
            style={{
              top: menuPosicao.top,
              left: menuPosicao.left,
            }}
          >
            {tarefas.find((t) => t.id === menuAberto) && (
              <>
                <button
                  onClick={() => handleEditar(menuAberto)}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 w-full text-left font-normal transition border-b border-gray-300 last:border-b-0"
                >
                  <Pencil size={18} className="text-gray-600" />
                  Editar
                </button>

                <button
                  onClick={() => handleVisualizar(menuAberto)}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 w-full text-left font-normal transition border-b border-gray-300 last:border-b-0"
                >
                  <ExternalLink size={18} className="text-gray-600" />
                  Visualizar
                </button>

                <button
                  onClick={() => handleExcluir(menuAberto)}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-red-50 w-full text-left font-normal text-gray-600 transition"
                >
                  <Trash2 size={18} className="text-gray-600" />
                  Excluir
                </button>
              </>
            )}
          </div>
        )}

        {/* Paginação */}
        <div className="flex justify-center items-center gap-2 mt-6 text-gray-600 text-sm">
          <button
            disabled={paginaAtual === 1}
            onClick={() => setPaginaAtual((p) => p - 1)}
            className={`px-3 py-1 rounded-lg text-gray-700 ${
              paginaAtual === 1
                ? "text-gray-400 cursor-not-allowed"
                : "hover:bg-gray-100 transition"
            }`}
          >
            ← Anterior
          </button>

          <div className="flex gap-1">
            {Array.from({ length: totalPaginas }, (_, i) => (
              <button
                key={i}
                onClick={() => setPaginaAtual(i + 1)}
                className={`w-8 h-8 rounded-lg font-medium ${
                  paginaAtual === i + 1
                    ? "bg-gray-200 text-gray-800 shadow-inner"
                    : "hover:bg-gray-100 transition"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            disabled={paginaAtual === totalPaginas}
            onClick={() => setPaginaAtual((p) => p + 1)}
            className={`px-3 py-1 rounded-lg text-gray-700 ${
              paginaAtual === totalPaginas
                ? "text-gray-400 cursor-not-allowed"
                : "hover:bg-gray-100 transition"
            }`}
          >
            Próximo →
          </button>
        </div>
      </div>
      <ExcluirTarefa 
        isOpen={tarefaExcluir !== null}
        onClose={cancelarExclusao}
        onConfirm={confirmarExclusao}
      />
      {tarefaVisualizar && (
        <VisualizacaoTarefa
          tarefa={tarefaVisualizar}
          isOpen={tarefaVisualizar !== null}
          onClose={handleFecharVisualizacao} // Botão 'Fechar'
          onConfirm={handleEditarVisualizacao} // Botão 'Editar'
        />
      )}
    </div>
  );
}
