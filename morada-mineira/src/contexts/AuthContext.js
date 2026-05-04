"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { storage } from "@/lib/storage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carregar usuário salvo e lista de usuários
  useEffect(() => {
    async function init() {
      try {
        const userList = await storage.getUsers();
        setUsers(userList || []);

        let savedUser = null;
        if (typeof window !== "undefined") {
          try {
            const raw = localStorage.getItem("morada_current_user");
            if (raw && raw !== "undefined") {
              savedUser = JSON.parse(raw);
            }
          } catch (e) {
            console.warn("Limpando usuário inválido:", e);
            localStorage.removeItem("morada_current_user");
          }
        }

        if (savedUser) setUser(savedUser);
      } catch (err) {
        console.error("Erro na inicialização:", err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const login = useCallback((selectedUser) => {
    setUser(selectedUser);
    if (typeof window !== "undefined") {
      localStorage.setItem("morada_current_user", JSON.stringify(selectedUser));
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("morada_current_user");
    }
  }, []);

  const updateUser = useCallback(async (id, updates) => {
    const updated = await storage.updateUser(id, updates);
    if (updated) {
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...updated } : u)));
      setUser((prevUser) => (prevUser?.id === id ? { ...prevUser, ...updated } : prevUser));
    }
    return updated;
  }, []);

  const isGerente = user?.role === "gerente";
  const isFuncionario = user?.role === "funcionario";

  return (
    <AuthContext.Provider
      value={{
        user,
        users,
        loading,
        login,
        logout,
        updateUser,
        isGerente,
        isFuncionario,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}
