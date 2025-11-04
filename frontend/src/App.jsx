import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import './App.css'
import TaskEditing from './pages/TaskEditing'
import Sidebar from './components/Sidebar'
import Tarefas from "./pages/Tarefas";
import TarefasHoje from "./pages/TarefasHoje";
import TarefasAtrasadas from "./pages/TarefasAtrasadas";
import TarefasConcluidas from "./pages/TarefasConcluidas";

function App() {

  const [userName, setUserName] = useState("Caio");
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  if (!isAuthenticated) return <div className="auth-page"></div>;

  return (
    <BrowserRouter>
      <div className="app-container">
        <Sidebar userName={userName} />
        <main className="main-content">
          {/* <nav className="top-nav">
            <Link to="/">Todas</Link> | <Link to="/hoje">Hoje</Link> |{" "}
            <Link to="/atrasadas">Atrasadas</Link> |{" "}
            <Link to="/concluidas">Concluídas</Link>
          </nav>
          <hr /> */}

          <Routes>
            <Route path="/" element={<Tarefas />} />
            <Route path="/hoje" element={<TarefasHoje />} />
            <Route path="/atrasadas" element={<TarefasAtrasadas />} />
            <Route path="/concluidas" element={<TarefasConcluidas />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App
