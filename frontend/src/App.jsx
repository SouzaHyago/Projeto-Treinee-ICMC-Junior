import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import './App.css'
import Sidebar from './components/Sidebar'
import Tarefas from "./pages/Tarefas";
import TarefasHoje from "./pages/TarefasHoje";
import TarefasAtrasadas from "./pages/TarefasAtrasadas";
import TarefasConcluidas from "./pages/TarefasConcluidas";
import CriarTarefa from "./pages/CriarTarefa";

function App() {

  const [userName, setUserName] = useState("Caio");
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  if (!isAuthenticated) return <div className="auth-page">

  </div>;

  return (
    <BrowserRouter>
      <div className="app-container">
        <Sidebar userName={userName} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Tarefas />} />
            <Route path="/hoje" element={<TarefasHoje />} />
            <Route path="/atrasadas" element={<TarefasAtrasadas />} />
            <Route path="/concluidas" element={<TarefasConcluidas />} />
            <Route path="/criar-tarefa" element={<CriarTarefa />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App
