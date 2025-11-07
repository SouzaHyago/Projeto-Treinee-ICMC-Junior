import React, { useState, useEffect, useRef } from "react";
import EmptyStatePage from "../components/EmptyStatePage.jsx";
import CriarTarefa from "./CriarTarefa.jsx";
import EditarTarefa from "./EditarTarefa.jsx";
import ExcluirTarefa from "../modals/ExcluirTarefa.jsx";
import VisualizacaoTarefa from "../modals/VisualizacaoTarefa.jsx";
import api from "@/api.js";
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

// Função auxiliar para converter o prazo (string) em um objeto Date
const compararPorPrazo = (a, b) => {
  if (a.concluida && !b.concluida) return 1;
  if (!a.concluida && b.concluida) return -1;
  const dataA = new Date(a.prazo);
  const dataB = new Date(b.prazo);
  if (isNaN(dataA)) return 1;
  if (isNaN(dataB)) return -1;
  return dataA.getTime() - dataB.getTime();
};

// Função para formatar a data ISO
const formatarPrazoISO = (isoString) => {
  if (!isoString) return "Sem prazo";
  const data = new Date(isoString);
  return data.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function Tarefas() {
  const [tarefas, setTarefas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("lista");
  const [tarefaAtual, setTarefaAtual] = useState(null);
  const [tarefaExcluir, setTarefaExcluir] = useState(null);
  const [tarefaVisualizar, setTarefaVisualizar] = useState(null);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [itensPorPagina, setItensPorPagina] = useState(5); // Valor inicial
  const [menuAberto, setMenuAberto] = useState(null);
  const [menuPosicao, setMenuPosicao] = useState({ top: 0, left: 0 });

  const tabelaRef = useRef(null);
  const menuRefs = useRef({});
  const menuFlutuanteRef = useRef(null); // Ref para o menu flutuante

  // Busca tarefas no backend
  useEffect(() => {
    async function getTasks() {
      try {
        const res = await api.get("/tasks");
        const ordenadas = [...res.data].sort(compararPorPrazo);
        setTarefas(ordenadas);
      } catch (error) {
        console.error("Erro ao buscar tarefas:", error);
      } finally {
        setLoading(false);
      }
    }
    getTasks();
  }, []);

  useEffect(() => {
    document.title = "Tarefas";
  }, []);

  // MELHORIA: Fecha o menu flutuante se clicar fora dele
  useEffect(() => {
    function handleClickFora(event) {
      if (menuFlutuanteRef.current && !menuFlutuanteRef.current.contains(event.target)) {
        // Verifica se o clique não foi no próprio botão que abre o menu
        const menuButton = menuRefs.current[menuAberto];
        if (menuButton && !menuButton.contains(event.target)) {
          setMenuAberto(null);
        }
      }
    }
    document.addEventListener("mousedown", handleClickFora);
    return () => {
      document.removeEventListener("mousedown", handleClickFora);
    };
  }, [menuAberto]);

  // CORREÇÃO: Calcula dinamicamente quantas tarefas cabem no espaço disponível
  useEffect(() => {
    function calcularItensPorPagina() {
      const tabelaContainer = tabelaRef.current;
      if (!tabelaContainer) return;

      const alturaCabecalho = 50; // Altura aproximada do <thead> em pixels
      const alturaLinha = 68;     // Altura aproximada de um <tr> em pixels (py-4 = 16+16=32, mais altura do texto)

      const alturaDisponivelParaLinhas = tabelaContainer.clientHeight - alturaCabecalho;

      if (alturaDisponivelParaLinhas > 0) {
        const calculado = Math.max(1, Math.floor(alturaDisponivelParaLinhas / alturaLinha));
        setItensPorPagina(calculado);
      } else {
        setItensPorPagina(5); // Fallback caso o container não tenha altura
      }
    }

    const timer = setTimeout(calcularItensPorPagina, 50);
    window.addEventListener("resize", calcularItensPorPagina);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", calcularItensPorPagina);
    };
  }, [tarefas]);

  // Resetar para a primeira página se o número de páginas diminuir
  const totalPaginas = Math.max(1, Math.ceil(tarefas.length / itensPorPagina));
  useEffect(() => {
    if (paginaAtual > totalPaginas) {
      setPaginaAtual(totalPaginas);
    }
  }, [totalPaginas, paginaAtual]);


  const tarefasVisiveis = tarefas.slice(
    (paginaAtual - 1) * itensPorPagina,
    paginaAtual * itensPorPagina
  );

  function corPrazo(isoPrazo) {
    if (!isoPrazo) return { cor: "bg-gray-100 text-gray-500 border border-gray-200", label: "Sem prazo" };
    const dataPrazo = new Date(isoPrazo);
    const agora = new Date();
    const hoje = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
    const amanha = new Date(hoje);
    amanha.setDate(hoje.getDate() + 1);
    const prazoDia = new Date(dataPrazo.getFullYear(), dataPrazo.getMonth(), dataPrazo.getDate());

    if (dataPrazo < agora) return { cor: "bg-[#EFE999] text-[#726A4C] border border-[#DED581]", label: "Em atraso" };
    if (prazoDia.getTime() === hoje.getTime()) return { cor: "bg-[#B5D1DB] text-[#4C6A72] border border-[#9CBAC3]", label: "Para hoje" };
    if (prazoDia.getTime() === amanha.getTime()) return { cor: "bg-[#D7B8D2] text-[#724C6A] border border-[#BFA0B9]", label: "Para amanhã" };
    return { cor: "bg-[#C1E0C5] text-[#517255] border border-[#A8C7AD]", label: "No prazo" };
  }
  
  const toggleMenu = (tarefaId) => {
    const buttonRef = menuRefs.current[tarefaId];
    if (buttonRef) {
      const rect = buttonRef.getBoundingClientRect();
      setMenuPosicao({
        top: rect.bottom + window.scrollY + 5,
        left: rect.left + window.scrollX - 144 + rect.width,
      });
    }
    setMenuAberto((prev) => (prev === tarefaId ? null : tarefaId));
  };

  const handleSalvarNovaTarefa = (tarefa) => { setTarefas((prev) => [...prev, tarefa].sort(compararPorPrazo)); setView("lista"); };
  const handleSalvarEdicao = (tarefaAtualizada) => { setTarefas((prev) => prev.map((t) => (t.id === tarefaAtualizada.id ? tarefaAtualizada : t)).sort(compararPorPrazo)); setView("lista"); setTarefaAtual(null); };
  const handleEditar = (tarefaId) => { const tarefa = tarefas.find((t) => t.id === tarefaId); if (tarefa) { setTarefaAtual(tarefa); setView("editar"); } setMenuAberto(null); };
  const handleEditarVisualizacao = () => { if (tarefaVisualizar) handleEditar(tarefaVisualizar.id); setTarefaVisualizar(null); };
  const handleExcluir = (tarefaId) => { setTarefaExcluir(tarefaId); setMenuAberto(null); };
  const confirmarExclusao = () => { if (tarefaExcluir) { api.delete(`/tasks/${tarefaExcluir}`).then(() => { setTarefas((prev) => prev.filter((t) => t.id !== tarefaExcluir)); setTarefaExcluir(null); }).catch(err => console.error(err)); } };
  const cancelarExclusao = () => setTarefaExcluir(null);
  const handleCancelar = () => { setView("lista"); setTarefaAtual(null); };
  const handleNovaTarefa = () => setView("criar");
  const handleAbrirVisualizacao = (tarefa) => setTarefaVisualizar(tarefa);
  const handleFecharVisualizacao = () => setTarefaVisualizar(null);
  const handleVisualizar = (tarefaId) => { const tarefa = tarefas.find((t) => t.id === tarefaId); if (tarefa) handleAbrirVisualizacao(tarefa); setMenuAberto(null); };
  const alternarConclusao = (tarefaId) => { const tarefa = tarefas.find(t => t.id === tarefaId); if(tarefa) { const atualizada = {...tarefa, concluida: !tarefa.concluida}; api.put(`/tasks/${tarefaId}`, atualizada).then(() => { handleSalvarEdicao(atualizada); }).catch(err => console.error(err)); }};


  if (loading) {
    return <div className="flex justify-center items-center h-full">Carregando tarefas...</div>;
  }
  if (view === "criar") return <CriarTarefa onSave={handleSalvarNovaTarefa} onCancel={handleCancelar} />;
  if (view === "editar" && tarefaAtual) return <EditarTarefa tarefa={tarefaAtual} onSave={handleSalvarEdicao} onCancel={handleCancelar} />;

  return (
    <div className="font-poppins text-[#6B7280] flex flex-col h-full">
      <div className={`${CUSTOM_BG_COLOR} rounded-[50px] p-8 flex-1 flex flex-col h-full shadow-xl`}>
        <div className="mt-2 ml-4 mb-6">
          <h1 className="text-[36px] font-bold text-gray-800">Tarefas</h1>
          <p className="text-[15px] font-normal text-gray-500">Gerencie suas tarefas de forma simples e rápida.</p>
        </div>
        <div className={`border border-gray-400 rounded-[50px] ${CUSTOM_BG_COLOR} p-8 flex flex-col flex-1 min-h-0`}>
          <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <button className={`border border-gray-300 ${CUSTOM_BG_COLOR} text-gray-500 rounded-lg px-4 py-2 text-[14px] font-medium shadow-sm hover:bg-gray-200 transition flex items-center gap-2`} onClick={handleNovaTarefa}>
              <CirclePlus size={16} style={ICON_STROKE_STYLE} /> Nova Tarefa
            </button>
            <div className="flex gap-2 flex-wrap">
              <button className={`border border-gray-300 ${CUSTOM_BG_COLOR} text-gray-500 rounded-lg px-4 py-2 text-[14px] font-medium hover:bg-gray-200 transition flex items-center gap-2`}><Clock size={16} style={ICON_STROKE_STYLE} /> Em andamento</button>
              <button className={`border border-gray-300 ${CUSTOM_BG_COLOR} text-gray-500 rounded-lg px-4 py-2 text-[14px] font-medium hover:bg-gray-200 transition flex items-center gap-2`}><AlertTriangle size={16} style={ICON_STROKE_STYLE} /> Atrasadas</button>
              <button className={`border border-gray-300 ${CUSTOM_BG_COLOR} text-gray-500 rounded-lg px-4 py-2 text-[14px] font-medium hover:bg-gray-200 transition flex items-center gap-2`}><Check size={16} style={ICON_STROKE_STYLE} /> Concluídas</button>
            </div>
          </div>
          
          <div className="flex-1 min-h-0 overflow-auto border border-gray-300 rounded-[50px]" ref={tabelaRef}>
            {tarefas.length > 0 ? (
            
            <table className="w-full border-collapse table-fixed">
              <thead>
                <tr className="text-left text-gray-600 border-b border-gray-300 bg-white">
                  
                  
                  <th className="py-3 px-6 text-center text-[13px] font-medium border-r border-gray-300">Descrição da Tarefa</th>
                  
                  
                  <th className="py-3 px-6 text-center text-[13px] font-medium w-40 border-r border-gray-300">Prazo</th>
                  
                  
                  <th className="py-3 px-6 text-center text-[13px] font-medium w-20">Ações</th>
                
                </tr>
              </thead>
              <tbody>
                {tarefasVisiveis.map((tarefa) => (
                  <tr key={tarefa.id} className={`border-b border-gray-300 last:border-b-0 hover:bg-gray-100 transition ${CUSTOM_BG_COLOR} cursor-pointer`} onClick={() => handleAbrirVisualizacao(tarefa)}>
                    <td className="py-4 px-6 border-r border-gray-300">
                      <div className="flex items-start gap-3">
                        <input type="checkbox" checked={tarefa.concluida} onClick={(e) => e.stopPropagation()} onChange={() => alternarConclusao(tarefa.id)} className="mt-1 h-4 w-4 rounded-sm appearance-none cursor-pointer bg-transparent border border-gray-700 checked:bg-gray-700 checked:border-gray-700 focus:ring-0"/>
                        
                        <div className="text-left min-w-0">
                          <p className={`text-[14px] font-normal text-gray-800 truncate ${tarefa.concluida ? "line-through text-gray-500" : ""}`} title={tarefa.titulo}>{tarefa.titulo}</p>
                          <p className={`text-[14px] font-normal text-gray-500 truncate ${tarefa.concluida ? "line-through" : ""}`} title={tarefa.descricao}>{tarefa.descricao}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center border-r border-gray-300">
                      {(() => { const { cor, label } = corPrazo(tarefa.prazo); return (<span title={label} className={`inline-block px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shadow-sm ${cor}`}>{formatarPrazoISO(tarefa.prazo)}</span>);})()}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button ref={(el) => (menuRefs.current[tarefa.id] = el)} onClick={(e) => { e.stopPropagation(); toggleMenu(tarefa.id);}} className="p-1 rounded-full text-gray-500 hover:bg-gray-200 transition">
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            ) : (
                <EmptyStatePage
                    title="Nenhuma tarefa encontrada"
                    message="Crie uma nova tarefa para começar a se organizar."
                    onAction={handleNovaTarefa}
                    actionText="Criar primeira tarefa"
                />
            )}
          </div>
        </div>

        {menuAberto !== null && (
          <div ref={menuFlutuanteRef} id={`menu-flutuante-${menuAberto}`} className={`absolute border border-gray-200 rounded-lg shadow-2xl w-36 text-sm text-gray-700 z-50 overflow-hidden ${CUSTOM_BG_COLOR}`} style={{ top: menuPosicao.top, left: menuPosicao.left }}>
            {tarefas.find((t) => t.id === menuAberto) && (
              <>
                <button onClick={() => handleEditar(menuAberto)} className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 w-full text-left font-normal transition border-b border-gray-300"><Pencil size={18} className="text-gray-600" /> Editar</button>
                <button onClick={() => handleVisualizar(menuAberto)} className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 w-full text-left font-normal transition border-b border-gray-300"><ExternalLink size={18} className="text-gray-600" /> Visualizar</button>
                <button onClick={() => handleExcluir(menuAberto)} className="flex items-center gap-3 px-3 py-2 hover:bg-red-50 w-full text-left font-normal text-gray-600 transition"><Trash2 size={18} className="text-gray-600" /> Excluir</button>
              </>
            )}
          </div>
        )}

        {tarefas.length > 0 && (
          <div className="flex justify-center items-center gap-2 mt-6 text-gray-600 text-sm">
            <button disabled={paginaAtual === 1} onClick={() => setPaginaAtual((p) => p - 1)} className={`px-3 py-1 rounded-lg text-gray-700 ${paginaAtual === 1 ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-100 transition"}`}>← Anterior</button>
            <div className="flex gap-1">
              {Array.from({ length: totalPaginas }, (_, i) => (<button key={i} onClick={() => setPaginaAtual(i + 1)} className={`w-8 h-8 rounded-lg font-medium ${paginaAtual === i + 1 ? "bg-gray-200 text-gray-800 shadow-inner" : "hover:bg-gray-100 transition"}`}>{i + 1}</button>))}
            </div>
            <button disabled={paginaAtual === totalPaginas} onClick={() => setPaginaAtual((p) => p + 1)} className={`px-3 py-1 rounded-lg text-gray-700 ${paginaAtual === totalPaginas ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-100 transition"}`}>Próximo →</button>
          </div>
        )}
      </div>
      <ExcluirTarefa isOpen={tarefaExcluir !== null} onClose={cancelarExclusao} onConfirm={confirmarExclusao} />
      {tarefaVisualizar && <VisualizacaoTarefa tarefa={tarefaVisualizar} isOpen={tarefaVisualizar !== null} onClose={handleFecharVisualizacao} onEdit={handleEditarVisualizacao} />}
    </div>
  );
}