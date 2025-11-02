import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"; // <-- Importações do Router

import Tarefas from "./components/Tarefas";
import TarefasHoje from "./components/TarefasHoje";
import TarefasAtrasadas from "./components/TarefasAtrasadas";
import TarefasConcluidas from "./components/TarefasConcluidas";

function App() {
  return (
    <Router>
      {" "}
      <div className="App">
        <nav>
          <Link to="/">Todas</Link> | <Link to="/hoje">Hoje</Link> |{" "}
          <Link to="/atrasadas">Atrasadas</Link> |{" "}
          <Link to="/concluidas">Concluidas</Link>{" "}
        </nav>

        <hr />

        <Routes>
          <Route path="/" element={<Tarefas />} />
          <Route path="/hoje" element={<TarefasHoje />} />
          <Route path="/atrasadas" element={<TarefasAtrasadas />} />
          <Route path="/concluidas" element={<TarefasConcluidas />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
