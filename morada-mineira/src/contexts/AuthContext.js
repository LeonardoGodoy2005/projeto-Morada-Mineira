"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

const AuthContext = createContext(null);

// Helpers para Local Storage (Fallback)
function getFromLocal(key) {
  if (typeof window === "undefined") return null;
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

function setToLocal(key, value) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);   // profile do banco
  const [session, setSession] = useState(null);   // sessão do Supabase Auth
  const [users, setUsers]     = useState([]);     // lista de profiles (gerente usa)
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  // ── Carrega profile completo do banco ─────────────────────
  const loadProfile = useCallback(async (authUser) => {
    if (!authUser) { setUser(null); return; }
    if (!isSupabaseConfigured) {
      setUser(authUser);
      return;
    }
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authUser.id)
        .single();

      if (error) throw error;
      setUser(data);
    } catch (e) {
      console.error("Erro ao carregar profile:", e);
      setUser(null);
    }
  }, []);

  // ── Carrega lista de usuários (para o gerente atribuir tarefas) ──
  const loadUsers = useCallback(async () => {
    if (!isSupabaseConfigured) {
      const localUsers = getFromLocal("morada_profiles") || [
        { id: "gerente-1", name: "Gerente", role: "gerente", avatar_emoji: "👔", email: "gerente@teste.com", active: true },
        { id: "func-1", name: "João Silva", role: "funcionario", avatar_emoji: "👷", email: "joao@teste.com", active: true },
        { id: "func-2", name: "Maria Santos", role: "funcionario", avatar_emoji: "👷", email: "maria@teste.com", active: true },
      ];
      setUsers(localUsers.filter(u => u.active));
      return;
    }
    try {
      const { data } = await supabase
        .from("profiles")
        .select("id, name, role, avatar_emoji, shift, active")
        .eq("active", true)
        .order("name");
      setUsers(data || []);
    } catch (e) {
      console.error("Erro ao carregar usuários:", e);
    }
  }, []);

  // ── Inicialização: escuta mudanças de sessão ───────────────
  useEffect(() => {
    if (!isSupabaseConfigured) {
      const localSession = getFromLocal("morada_session");
      if (localSession) {
        setSession(localSession);
        setUser(localSession.user);
      }
      setLoading(false);
      return;
    }

    // Pega sessão inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      loadProfile(session?.user ?? null).finally(() => setLoading(false));
    });

    // Escuta eventos de login/logout/token-refresh
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        await loadProfile(session?.user ?? null);
        if (session?.user) await loadUsers();
      }
    );

    return () => subscription.unsubscribe();
  }, [loadProfile, loadUsers]);

  useEffect(() => {
    if (user) loadUsers();
  }, [user, loadUsers]);

  // ── CADASTRO PÚBLICO (Sign Up) ──────────────────────────
  const signUp = useCallback(async (name, email, password) => {
    setError(null);
    setLoading(true);
    if (!isSupabaseConfigured) {
      const localUsers = getFromLocal("morada_profiles") || [
        { id: "gerente-1", name: "Gerente", role: "gerente", avatar_emoji: "👔", email: "gerente@teste.com", active: true },
        { id: "func-1", name: "João Silva", role: "funcionario", avatar_emoji: "👷", email: "joao@teste.com", active: true },
        { id: "func-2", name: "Maria Santos", role: "funcionario", avatar_emoji: "👷", email: "maria@teste.com", active: true },
      ];
      const emailLower = email.trim().toLowerCase();
      if (localUsers.some(u => u.email === emailLower)) {
        setError("Este e-mail já está cadastrado.");
        setLoading(false);
        return { success: false, error: "Este e-mail já está cadastrado." };
      }
      const id = crypto.randomUUID();
      const newProfile = {
        id,
        name,
        role: "funcionario",
        avatar_emoji: "👷",
        email: emailLower,
        active: true
      };
      localUsers.push(newProfile);
      setToLocal("morada_profiles", localUsers);
      
      const newSession = { user: newProfile };
      setSession(newSession);
      setUser(newProfile);
      setToLocal("morada_session", newSession);
      setLoading(false);
      return { success: true, user: newProfile };
    }
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            name,
            role: "funcionario", // Default public signups to 'funcionario'
            avatar_emoji: "👷"
          }
        }
      });
      if (error) throw error;
      return { success: true, user: data.user };
    } catch (e) {
      const msg = mapAuthError(e.message);
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  // ── LOGIN COM GOOGLE (OAuth) ─────────────────────────────
  const loginWithGoogle = useCallback(async () => {
    setError(null);
    setLoading(true);
    if (!isSupabaseConfigured) {
      // Mock login de Gerente para testar facilmente
      const gerente = { id: "gerente-1", name: "Gerente", role: "gerente", avatar_emoji: "👔", email: "gerente@teste.com", active: true };
      const newSession = { user: gerente };
      setSession(newSession);
      setUser(gerente);
      setToLocal("morada_session", newSession);
      setLoading(false);
      return { success: true };
    }
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/painel`,
        }
      });
      if (error) throw error;
    } catch (e) {
      const msg = mapAuthError(e.message);
      setError(msg);
      setLoading(false);
      return { success: false, error: msg };
    }
  }, []);

  // ── LOGIN com email e senha ────────────────────────────────
  const login = useCallback(async (email, password) => {
    setError(null);
    setLoading(true);
    if (!isSupabaseConfigured) {
      const localUsers = getFromLocal("morada_profiles") || [
        { id: "gerente-1", name: "Gerente", role: "gerente", avatar_emoji: "👔", email: "gerente@teste.com", active: true },
        { id: "func-1", name: "João Silva", role: "funcionario", avatar_emoji: "👷", email: "joao@teste.com", active: true },
        { id: "func-2", name: "Maria Santos", role: "funcionario", avatar_emoji: "👷", email: "maria@teste.com", active: true },
      ];
      const emailLower = email.trim().toLowerCase();
      let profile = localUsers.find(u => u.email === emailLower);
      if (!profile) {
        // Fallback rápido para testes para não travar o usuário
        if (emailLower.includes("gerente")) {
          profile = localUsers.find(u => u.role === "gerente");
        } else {
          profile = localUsers.find(u => u.role === "funcionario");
        }
      }
      
      if (!profile) {
        setError("Usuário não cadastrado.");
        setLoading(false);
        return { success: false, error: "Usuário não cadastrado." };
      }

      const newSession = { user: profile };
      setSession(newSession);
      setUser(profile);
      setToLocal("morada_session", newSession);
      setLoading(false);
      return { success: true, user: profile };
    }
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      if (error) throw error;
      return { success: true, user: data.user };
    } catch (e) {
      const msg = mapAuthError(e.message);
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  // ── LOGOUT ────────────────────────────────────────────────
  const logout = useCallback(async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
    setUsers([]);
    setToLocal("morada_session", null);
    
    window.location.href = "/"; 
  }, []);

  // ── CADASTRAR FUNCIONÁRIO (apenas gerente usa) ─────────────
  const registerEmployee = useCallback(async ({ name, email, password, role, shift, avatar_emoji }) => {
    setError(null);
    if (!isSupabaseConfigured) {
      const localUsers = getFromLocal("morada_profiles") || [
        { id: "gerente-1", name: "Gerente", role: "gerente", avatar_emoji: "👔", email: "gerente@teste.com", active: true },
        { id: "func-1", name: "João Silva", role: "funcionario", avatar_emoji: "👷", email: "joao@teste.com", active: true },
        { id: "func-2", name: "Maria Santos", role: "funcionario", avatar_emoji: "👷", email: "maria@teste.com", active: true },
      ];
      const id = crypto.randomUUID();
      const newProfile = {
        id,
        name,
        role,
        shift,
        avatar_emoji,
        email: email.trim().toLowerCase(),
        active: true
      };
      localUsers.push(newProfile);
      setToLocal("morada_profiles", localUsers);
      await loadUsers();
      return { success: true };
    }
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role, shift, avatar_emoji }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Erro ao cadastrar");
      await loadUsers();
      return { success: true };
    } catch (e) {
      setError(e.message);
      return { success: false, error: e.message };
    }
  }, [loadUsers]);

  // ── ALTERAR SENHA (usuário atual) ─────────────────────────
  const changePassword = useCallback(async (newPassword) => {
    if (!isSupabaseConfigured) {
      return { success: true };
    }
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) return { success: false, error: error.message };
    return { success: true };
  }, []);

  // ── RESETAR SENHA POR EMAIL ────────────────────────────────
  const resetPassword = useCallback(async (email) => {
    if (!isSupabaseConfigured) {
      return { success: true };
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/redefinir-senha`,
    });
    if (error) return { success: false, error: error.message };
    return { success: true };
  }, []);

  // ── ATUALIZAR PERFIL ───────────────────────────────────────
  const updateProfile = useCallback(async (updates) => {
    if (!user) return { success: false };
    if (!isSupabaseConfigured) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      const localUsers = getFromLocal("morada_profiles") || [];
      const idx = localUsers.findIndex(u => u.id === user.id);
      if (idx !== -1) {
        localUsers[idx] = { ...localUsers[idx], ...updates };
        setToLocal("morada_profiles", localUsers);
      }
      const currentSession = getFromLocal("morada_session");
      if (currentSession) {
        currentSession.user = updatedUser;
        setToLocal("morada_session", currentSession);
        setSession(currentSession);
      }
      return { success: true };
    }
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user.id)
      .select()
      .single();
    if (error) return { success: false, error: error.message };
    setUser(data);
    return { success: true };
  }, [user]);

  // ── ATUALIZAR QUALQUER USUÁRIO (gerente) ──────────────────
  const updateUser = useCallback(async (userId, updates) => {
    if (!isSupabaseConfigured) {
      const localUsers = getFromLocal("morada_profiles") || [];
      const idx = localUsers.findIndex(u => u.id === userId);
      if (idx !== -1) {
        localUsers[idx] = { ...localUsers[idx], ...updates };
        setToLocal("morada_profiles", localUsers);
      }
      await loadUsers();
      return { success: true };
    }
    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId);
    if (error) return { success: false, error: error.message };
    await loadUsers();
    return { success: true };
  }, [loadUsers]);

  // ── DESATIVAR FUNCIONÁRIO (gerente) ───────────────────────
  const deactivateUser = useCallback(async (userId) => {
    if (!isSupabaseConfigured) {
      const localUsers = getFromLocal("morada_profiles") || [];
      const idx = localUsers.findIndex(u => u.id === userId);
      if (idx !== -1) {
        localUsers[idx] = { ...localUsers[idx], active: false };
        setToLocal("morada_profiles", localUsers);
      }
      await loadUsers();
      return { success: true };
    }
    const { error } = await supabase
      .from("profiles")
      .update({ active: false })
      .eq("id", userId);
    if (error) return { success: false, error: error.message };
    await loadUsers();
    return { success: true };
  }, [loadUsers]);

  // ── Helpers de role ───────────────────────────────────────
  const isGerente    = user?.role === "gerente";
  const isFuncionario = user?.role === "funcionario";

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        users,
        loading,
        error,
        setError,
        login,
        loginWithGoogle,
        signUp,
        logout,
        registerEmployee,
        changePassword,
        resetPassword,
        updateProfile,
        updateUser,
        deactivateUser,
        isGerente,
        isFuncionario,
        isAuthenticated: !!session && !!user,
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

// ── Traduz erros do Supabase Auth para pt-BR ─────────────────
function mapAuthError(msg) {
  if (!msg) return "Erro desconhecido. Tente novamente.";
  if (msg.includes("Invalid login credentials"))
    return "E-mail ou senha incorretos.";
  if (msg.includes("Email not confirmed"))
    return "Confirme seu e-mail antes de entrar.";
  if (msg.includes("User already registered"))
    return "Este e-mail já está cadastrado.";
  if (msg.includes("Password should be at least"))
    return "A senha deve ter pelo menos 6 caracteres.";
  if (msg.includes("Unable to validate email"))
    return "E-mail inválido.";
  if (msg.includes("rate limit"))
    return "Muitas tentativas. Aguarde alguns minutos.";
  return msg;
}
