// AppContent.jsx
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Tarefas from "./pages/Tarefas";
import TarefasHoje from "./pages/TarefasHoje";
import TarefasAtrasadas from "./pages/TarefasAtrasadas";
import TarefasConcluidas from "./pages/TarefasConcluidas";
import CriarTarefa from "./pages/CriarTarefa";
import EditarTarefa from "./pages/EditarTarefa";
import Cadastro from "./pages/Cadastro/Cadastro";
import Login from "./pages/Login/Login";
import Configuracoes from "./pages/Configuracoes/Configuracoes";
import Proximas from "./pages/TarefasProximas";
import { useAuth } from "./context/AuthContext";
import PrivateRoute from "./routes/privateRoute";
import PublicRoute from "./routes/publicRoute";

import './App.css';

export default function AppContent() {
  const { logout } = useAuth();
  const location = useLocation();

  // Define se estamos em uma página de autenticação para esconder a Sidebar
  const isAuthPage = ["/login", "/cadastro"].includes(location.pathname);

  return (
    <div className={isAuthPage ? "" : "app-container"}>
      {!isAuthPage && <Sidebar logout={logout} />}

      <main className={isAuthPage ? "" : "main-content"}>
        <Routes>
          {/* Páginas públicas */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/cadastro"
            element={
              <PublicRoute>
                <Cadastro />
              </PublicRoute>
            }
          />

          {/* Páginas privadas */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Tarefas />
              </PrivateRoute>
            }
          />
          <Route
            path="/hoje"
            element={
              <PrivateRoute>
                <TarefasHoje />
              </PrivateRoute>
            }
          />
          <Route
            path="/atrasadas"
            element={
              <PrivateRoute>
                <TarefasAtrasadas />
              </PrivateRoute>
            }
          />
          <Route
            path="/concluidas"
            element={
              <PrivateRoute>
                <TarefasConcluidas />
              </PrivateRoute>
            }
          />
          <Route
            path="/configuracoes"
            element={
              <PrivateRoute>
                <Configuracoes />
              </PrivateRoute>
            }
          />
          <Route
            path="/proximas"
            element={
              <PrivateRoute>
                <Proximas />
              </PrivateRoute>
            }
          />
          <Route
            path="/criar-tarefa"
            element={
              <PrivateRoute>
                <CriarTarefa />
              </PrivateRoute>
            }
          />
          <Route
            path="/editar-tarefa"
            element={
              <PrivateRoute>
                <EditarTarefa />
              </PrivateRoute>
            }
          />

          {/* Rota coringa */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
