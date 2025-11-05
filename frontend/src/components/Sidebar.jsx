import React from 'react'
import '../styles/sidebar.css'
import { FiMenu, FiSearch, FiSettings, FiLogOut, FiGlobe, FiAlertTriangle, FiList, FiChevronsRight, FiCheckSquare } from 'react-icons/fi'
import { CirclePlus } from "lucide-react";
import { Link, useLocation } from 'react-router-dom';

function Sidebar({ userName }) {
  const location = useLocation();
  
  return (
    <aside className="sidebar bg-[#F7FCFE] shadow-xl backdrop-blur-sm bg-opacity-90">
      <div className="sidebar-contents">
        <div className="sidebar-header">
          <h2>Olá, {userName}</h2>
          {/* <button className="menu-btn"><FiMenu /></button> */}
        </div>
        <div className="search-box">
          <FiSearch />
          <input type="text" placeholder="Pesquisar tarefa" />
        </div>
        <nav className="nav-section">
          <h4>Tarefas</h4>
          <ul>
            <li className={location.pathname === '/' ? 'active' : ''}>
              <Link to="/"><FiGlobe />Página inicial</Link>
            </li>
            {/* <li className={location.pathname === '/proximas' ? 'active' : ''}>
              <Link to="/proximas"><FiChevronsRight />Próximas</Link>
            </li> */}
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
        <div className="bottom-links">
          <Link to="/configuracoes"><FiSettings /> Configurações</Link>
          <a href="#"><FiLogOut /> Sair</a>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
