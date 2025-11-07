import { createContext, useContext, useState } from "react";
import api from "@/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token") || null);

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
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
