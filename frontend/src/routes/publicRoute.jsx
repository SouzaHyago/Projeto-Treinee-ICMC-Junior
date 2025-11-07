import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth(); 

  if (loading) {
    return <div>Carregando...</div>;
  }

  return isAuthenticated ? <Navigate to="/" replace /> : children;
}