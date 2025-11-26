// Barra lateral presente em todas as páginas dentro do app
import { useState } from 'react';
import './sidebar.css'
import { FiSearch, FiSettings, FiLogOut, FiGlobe, FiAlertTriangle, FiList, FiChevronsRight, FiCheckSquare } from 'react-icons/fi'
import { CirclePlus } from "lucide-react";
import { Link, useLocation } from 'react-router-dom';
import LogoutModal from '@/modals/Logout';
import {useAuth} from "@/context/AuthContext"

function Sidebar({ userName, setIsAuthenticated }) {
  const location = useLocation();
  const {logout} =  useAuth();

  const [openModal, setOpenModal] = useState(false);

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: 'short'
  }).replace(/^\w/, (c) => c.toUpperCase()).replace(/\sde\s(\w)/, (match, letter) => ` de ${letter.toUpperCase()}`);

  return (
    <>
      <aside className="sidebar bg-[#F7FCFE] shadow-xl backdrop-blur-sm bg-opacity-90">
        <div className="sidebar-contents">
          {/* Parte superior: cabeçalho com nome e barra de pesquisa */}
          <div className="sidebar-header">
            <h2>Olá, {userName}</h2>
          </div>
          {/* <div className="search-box">
            <FiSearch />
            <input type="text" placeholder="Pesquisar tarefa" />
          </div> */}
          <div className="header-date">
            <h3>{formattedDate}</h3>
          </div>
          {/* Seção de navegação entre páginas */}
          <nav className="nav-section">
            <h4>Tarefas</h4>
            <ul>
              <li className={location.pathname === '/' ? 'active' : ''}>
                <Link to="/"><FiGlobe />Página inicial</Link>
              </li>
              <li className={location.pathname === '/proximas' ? 'active' : ''}>
                <Link to="/proximas"><FiChevronsRight />Próximas</Link>
              </li>
              <li className={location.pathname === '/hoje' ? 'active' : ''}>
                <Link to="/hoje"><FiList />Hoje</Link>
              </li>
              <li className={location.pathname === '/atrasadas' ? 'active' : ''}>
                <Link to="/atrasadas"><FiAlertTriangle />Atrasadas</Link>
              </li>
              <li className={location.pathname === '/concluidas' ? 'active' : ''}>
                <Link to="/concluidas"><FiCheckSquare />Concluídas</Link>
              </li>
              <li className={location.pathname === '/criar-tarefa' ? 'active' : 'NovaTarefa' }>
                <Link to="/criar-tarefa">
                  <CirclePlus size={26} style={{color: "#444444ff"}} />
                  Nova Tarefa
                </Link>
              </li>
            </ul>
          </nav>
          {/* Parte inferior: direcionam para as configurações e sair da conta */}
          <div className="bottom-links">
            <Link to="/configuracoes"><FiSettings /> Configurações</Link>
            <p onClick={() => setOpenModal(true)}><FiLogOut /> Sair</p>
          </div>
        </div>
      </aside>
      {/* Modal de confirmação de Logout */}
      <LogoutModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onConfirm={logout}  
      />
    </>
  );
}

export default Sidebar;
