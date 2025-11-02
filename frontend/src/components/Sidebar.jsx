import React from 'react'
import '../styles/sidebar.css'
import { FiMenu, FiSearch, FiSettings, FiLogOut, FiGlobe, FiAlertTriangle, FiList, FiChevronsRight, FiCheckSquare } from 'react-icons/fi'

function Sidebar({ userName }) {
  return (
    <aside className="sidebar">
        <div className="sidebar-contents">
            <div className="sidebar-header">
                <h2>Olá, {userName}</h2>
                <button className="menu-btn"><FiMenu /></button>
                {/*
                    Esse ícone de menu vai ser clicável (pra colapsar a 
                    sidebar) ou dá pra tirar?
                */}
            </div>

            <div className="search-box">
                <FiSearch />
                <input type="text" placeholder="Pesquisar tarefa" />
            </div>

            <nav className="nav-section">
                <h4>Tarefas <span className="plus">+</span></h4>
                <ul>
                <li className="active"> <FiGlobe />Página inicial</li> {/* Só tá active agora pra visualizar como fica */}
                <li><FiChevronsRight />Próximas</li>
                <li><FiList />Hoje</li>
                <li><FiAlertTriangle />Atrasadas</li>
                <li><FiCheckSquare />Concluídas</li>
                </ul>
            </nav>

            <div className="bottom-links">
                <a href="#"><FiSettings /> Configurações</a>
                <a href="#"><FiLogOut /> Sair</a>
            </div>
        </div>
    </aside>
  );
}

export default Sidebar;
