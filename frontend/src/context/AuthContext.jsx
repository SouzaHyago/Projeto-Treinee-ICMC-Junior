import { createContext, useContext, useState, useEffect } from "react";
import api from "@/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      if (token) {
        try {
          const res = await api.get("/users/profile");
          setUser(res.data);
        } catch (error) {
          console.error("Falha ao carregar usuário, fazendo logout.", error);
          logout();
        }
      }
      setLoading(false);
    }

    setLoading(true);
    loadUser();
  }, [token]);

  async function login(emailCpf, senha, active = false) {
    const response = await api.post("/users/login", {
      emailCpf,
      senha,
      activate: active,
    });

    const token = response.data.token;
    localStorage.setItem("token", token);
    setToken(token);
  }

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const updateUserContext = (newUserData) => {
    setUser(newUserData);
  };
  // -----------------------------

  return (
    <AuthContext.Provider 
      value={{ 
        token, 
        user, 
        login, 
        logout, 
        isAuthenticated: !!token, 
        loading,
        updateUserContext
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}