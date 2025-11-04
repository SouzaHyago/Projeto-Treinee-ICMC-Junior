import { useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import './App.css'
import Sidebar from './components/Sidebar'
import Tarefas from "./pages/Tarefas"
import TarefasHoje from "./pages/TarefasHoje"
import TarefasAtrasadas from "./pages/TarefasAtrasadas"
import TarefasConcluidas from "./pages/TarefasConcluidas"
import Cadastro from "./pages/Cadastro/Cadastro"
import Login from "./pages/Login/Login"
import Configuracoes from "./pages/Configuracoes/Configuracoes"
import Proximas from "./pages/TarefasProximas"
function App() {
  const [userName, setUserName] = useState("Caio");
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  return (
    <BrowserRouter>
      <AppContent userName={userName} isAuthenticated={isAuthenticated} />
    </BrowserRouter>
  );
}

function AppContent({ userName, isAuthenticated }) {
  const location = useLocation();

  // verifica se está nas telas de login ou cadastro
  const isAuthPage = location.pathname === "/cadastro" || location.pathname === "/login";

  if (!isAuthenticated && !isAuthPage) {
    return <div className="auth-page"></div>;
  }

  return (
    <div className={isAuthPage ? "" : "app-container"}>
      {!isAuthPage && <Sidebar userName={userName} />}
      <main className={isAuthPage ? "" : "main-content"}>
        <Routes>
          <Route path="/" element={<Tarefas />} />
          <Route path="/hoje" element={<TarefasHoje />} />
          <Route path="/atrasadas" element={<TarefasAtrasadas />} />
          <Route path="/concluidas" element={<TarefasConcluidas />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/login" element={<Login />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
          <Route path="/proximas" element={<Proximas />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
