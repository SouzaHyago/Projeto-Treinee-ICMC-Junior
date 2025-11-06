import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import Sidebar from './components/Sidebar';
import Tarefas from "./pages/Tarefas";
import TarefasHoje from "./pages/TarefasHoje";
import TarefasAtrasadas from "./pages/TarefasAtrasadas";
import TarefasConcluidas from "./pages/TarefasConcluidas";
import CriarTarefa from "./pages/CriarTarefa";
import EditarTarefa from './pages/EditarTarefa';
import Cadastro from "./pages/Cadastro/Cadastro";
import Login from "./pages/Login/Login";
import Configuracoes from "./pages/Configuracoes/Configuracoes";
import Proximas from "./pages/TarefasProximas";

function App() {
  const [userName, setUserName] = useState("Caio");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <BrowserRouter>
      <AppContent
        userName={userName}
        setUserName={setUserName}
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
      />
    </BrowserRouter>
  );
}

function AppContent({ userName, setUserName, isAuthenticated, setIsAuthenticated }) {
  const location = useLocation();
  const isAuthPage = location.pathname === "/cadastro" || location.pathname === "/login";

  return (
    <div className={isAuthPage ? "" : "app-container"}>
      {!isAuthPage && <Sidebar userName={userName} setIsAuthenticated={setIsAuthenticated}/>}
      <main className={isAuthPage ? "" : "main-content"}>
        <Routes>
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/cadastro" element={<Cadastro setIsAuthenticated={setIsAuthenticated}/>} />

          {isAuthenticated ? (
            <>
              <Route path="/" element={<Tarefas />} />
              <Route path="/hoje" element={<TarefasHoje />} />
              <Route path="/atrasadas" element={<TarefasAtrasadas />} />
              <Route path="/concluidas" element={<TarefasConcluidas />} />
              <Route path="/configuracoes" element={<Configuracoes setIsAuthenticated={setIsAuthenticated}/>} />
              <Route path="/proximas" element={<Proximas />} />
              <Route path="/criar-tarefa" element={<CriarTarefa />} />
              <Route path="/editar-tarefa" element={<EditarTarefa />} />
            </>
          ) : (
            <Route path="*" element={<Navigate to="/login" replace />} />
          )}
        </Routes>
      </main>
    </div>
  );
}

export default App;
