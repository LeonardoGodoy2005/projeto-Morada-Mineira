"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useTasks } from "@/contexts/TaskContext";
import { TASK_CATEGORIES } from "@/config/tasks.config";
import { formatDateRelative } from "@/lib/dateUtils";

export default function PainelPage() {
  const { user, isGerente } = useAuth();
  const { tasks, evidences, stats: globalStats, loading } = useTasks();

  if (loading) {
    return (
      <div className="animate-fade">
        <div className="header"><div className="header-title"><h1>Carregando...</h1></div></div>
        <div className="stats-grid">
          {[1, 2, 3, 4].map((i) => (<div key={i} className="stat-card skeleton" style={{ height: 100 }} />))}
        </div>
      </div>
    );
  }

  // Filtrar tarefas relevantes para o usuário atual
  const relevantTasks = isGerente ? tasks : tasks.filter((t) => t.assigned_to === user?.id || !t.assigned_to);

  // Tarefas por categoria
  const tasksByCategory = TASK_CATEGORIES.map((cat) => ({
    ...cat,
    count: relevantTasks.filter((t) => t.category === cat.id).length,
  })).filter((c) => c.count > 0);

  // Tarefas urgentes
  const urgentTasks = relevantTasks.filter((t) => t.priority === "urgente" && t.status !== "concluida");

  // Estatísticas baseadas nas tarefas relevantes
  const stats = isGerente ? globalStats : {
    total: relevantTasks.length,
    pendentes: relevantTasks.filter((t) => t.status === "pendente").length,
    emAndamento: relevantTasks.filter((t) => t.status === "em_andamento").length,
    aguardando: relevantTasks.filter((t) => t.status === "aguardando_evidencia").length,
    concluidas: relevantTasks.filter((t) => t.status === "concluida").length,
    taxaConclusao: relevantTasks.length > 0
      ? Math.round((relevantTasks.filter((t) => t.status === "concluida").length / relevantTasks.length) * 100)
      : 0,
  };

  // Evidências recentes pendentes
  const pendingEvidences = evidences.filter((e) => e.status === "pendente").slice(0, 5);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";

  return (
    <div className="animate-fade">
      <div className="header">
        <div className="header-title">
          <h1>{greeting}, {user?.name?.split(' ')[0]} 👋</h1>
          <p>{isGerente ? "Visão geral do sistema" : "Suas tarefas de hoje"}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card stat-card--primary">
          <div className="stat-icon">📋</div>
          <div className="stat-number" style={{ color: "var(--text-primary)" }}>{stats.total}</div>
          <div className="stat-label">Total</div>
        </div>
        <div className="stat-card stat-card--warning">
          <div className="stat-icon">⏳</div>
          <div className="stat-number" style={{ color: "var(--color-warning)" }}>{stats.pendentes}</div>
          <div className="stat-label">Pendentes</div>
        </div>
        <div className="stat-card stat-card--info">
          <div className="stat-icon">🔄</div>
          <div className="stat-number" style={{ color: "var(--color-info)" }}>{stats.emAndamento}</div>
          <div className="stat-label">Em Andamento</div>
        </div>
        <div className="stat-card stat-card--warning">
          <div className="stat-icon">📸</div>
          <div className="stat-number" style={{ color: "#FF9800" }}>{stats.aguardando}</div>
          <div className="stat-label">Aguardando</div>
        </div>
        <div className="stat-card stat-card--success">
          <div className="stat-icon">✅</div>
          <div className="stat-number" style={{ color: "var(--color-success)" }}>{stats.concluidas}</div>
          <div className="stat-label">Concluídas</div>
        </div>
        <div className="stat-card stat-card--primary">
          <div className="stat-icon">📊</div>
          <div className="stat-number" style={{ color: "var(--color-primary)" }}>{stats.taxaConclusao}%</div>
          <div style={{ 
            margin: '8px auto 0', 
            width: '80%', 
            height: 4, 
            background: 'rgba(139,69,19,0.15)', 
            borderRadius: 4, 
            overflow: 'hidden' 
          }}>
            <div style={{ 
              height: '100%', 
              width: `${stats.taxaConclusao}%`, 
              background: 'var(--color-primary)', 
              borderRadius: 4,
              transition: 'width 0.6s ease'
            }} />
          </div>
          <div className="stat-label">Taxa de Conclusão</div>
        </div>
      </div>

      {/* Tarefas por categoria */}
      {tasksByCategory.length > 0 && (
        <div className="detail-section">
          <h2 className="detail-section-title">📂 Tarefas por Categoria</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {tasksByCategory.map((cat) => (
              <div key={cat.id} className="card" style={{ padding: "12px 16px", minWidth: 140, flex: "1 1 auto" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: "1.3rem" }}>{cat.icon}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "1.1rem" }}>{cat.count}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{cat.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Urgentes */}
      {urgentTasks.length > 0 && (
        <div className="detail-section">
          <h2 className="detail-section-title">🚨 Tarefas Urgentes</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {urgentTasks.map((task) => (
              <div key={task.id} className="card" style={{ padding: "12px 16px", borderLeft: "4px solid var(--color-danger)" }}>
                <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{task.title}</div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: 4 }}>
                  {task.assigned_to_name || "Não atribuída"} • {formatDateRelative(task.created_at)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Evidências pendentes (gerente) */}
      {isGerente && pendingEvidences.length > 0 && (
        <div className="detail-section">
          <h2 className="detail-section-title">📸 Evidências Aguardando Aprovação</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {pendingEvidences.map((ev) => (
              <div key={ev.id} className="card" style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                <img src={ev.image_url} alt="" style={{ width: 48, height: 48, borderRadius: 8, objectFit: "cover" }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500, fontSize: "0.85rem" }}>{ev.description || "Sem descrição"}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{formatDateRelative(ev.captured_at || ev.created_at)}</div>
                </div>
                <span className="badge badge-sm" style={{ background: "#FF980020", color: "#FF9800" }}>Pendente</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {relevantTasks.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <div className="empty-state-text">Nenhuma tarefa ainda</div>
          <div className="empty-state-sub">
            {isGerente ? "Crie a primeira tarefa na aba Tarefas" : "Aguarde o gerente criar tarefas"}
          </div>
        </div>
      )}
    </div>
  );
}
