"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useTasks } from "@/contexts/TaskContext";
import { useToast } from "@/contexts/ToastContext";
import { TASK_CATEGORIES, TASK_STATUSES } from "@/config/tasks.config";
import TaskCard from "@/components/tasks/TaskCard";
import TaskForm from "@/components/tasks/TaskForm";

export default function TarefasPage() {
  const { user, isGerente, users } = useAuth();
  const { tasks, createTask, loading } = useTasks();
  const toast = useToast();
  const router = useRouter();

  const [showForm, setShowForm] = useState(false);
  const [filterCategory, setFilterCategory] = useState("todos");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [search, setSearch] = useState("");

  // Filtrar tarefas
  let filtered = [...tasks];

  // Funcionário vê apenas suas tarefas ou tarefas não atribuídas
  if (!isGerente) {
    filtered = filtered.filter((t) => t.assigned_to === user?.id || !t.assigned_to);
  }

  if (filterCategory !== "todos") {
    filtered = filtered.filter((t) => t.category === filterCategory);
  }
  if (filterStatus !== "todos") {
    filtered = filtered.filter((t) => t.status === filterStatus);
  }
  if (search.trim()) {
    const s = search.toLowerCase();
    filtered = filtered.filter((t) =>
      t.title?.toLowerCase().includes(s) || t.description?.toLowerCase().includes(s)
    );
  }

  async function handleCreateTask(data) {
    const result = await createTask(data);
    if (result) {
      toast.success("Tarefa criada com sucesso!");
    } else {
      toast.error("Erro ao criar tarefa");
    }
  }

  function handleTaskClick(task) {
    router.push(`/tarefas/${task.id}`);
  }

  return (
    <div className="animate-fade">
      <div className="header">
        <div className="header-title">
          <h1>{isGerente ? "Todas as Tarefas" : "Minhas Tarefas"}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
            <span className="badge" style={{ background: 'rgba(139,69,19,0.1)', color: 'var(--color-primary)', fontWeight: 700 }}>
              {filtered.length} {filtered.length === 1 ? 'tarefa' : 'tarefas'}
            </span>
          </div>
        </div>
        {isGerente && (
          <div className="header-actions">
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>
              ＋ Nova Tarefa
            </button>
          </div>
        )}
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 16 }}>
        <span style={{
          position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
          fontSize: '1rem', pointerEvents: 'none', opacity: 0.5, zIndex: 1
        }}>🔍</span>
        <input
          className="input"
          placeholder="Buscar tarefas..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ paddingLeft: 40 }}
        />
      </div>

      {/* Filters — unified single scrollable row */}
      <div className="task-filters">
        <button
          className={`filter-chip ${filterStatus === "todos" ? "active" : ""}`}
          onClick={() => setFilterStatus("todos")}
        >
          Todos
        </button>
        {TASK_STATUSES.map((s) => (
          <button
            key={s.id}
            className={`filter-chip ${filterStatus === s.id ? "active" : ""}`}
            onClick={() => setFilterStatus(s.id)}
          >
            {s.icon} {s.label}
          </button>
        ))}

        {/* Separador visual */}
        <span style={{ width: 1, background: "var(--border-color)", alignSelf: "stretch", flexShrink: 0, margin: "0 4px" }} />

        <button
          className={`filter-chip ${filterCategory === "todos" ? "active" : ""}`}
          onClick={() => setFilterCategory("todos")}
        >
          Todas categorias
        </button>
        {TASK_CATEGORIES.map((c) => (
          <button
            key={c.id}
            className={`filter-chip ${filterCategory === c.id ? "active" : ""}`}
            onClick={() => setFilterCategory(c.id)}
          >
            {c.icon} {c.label}
          </button>
        ))}
      </div>

      {/* Task List */}
      {loading ? (
        <div className="task-list" style={{ marginTop: 16 }}>
          {[1, 2, 3].map((i) => (<div key={i} className="skeleton" style={{ height: 120, borderRadius: 12 }} />))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="task-list" style={{ marginTop: 16 }}>
          {filtered.map((task) => (
            <TaskCard key={task.id} task={task} onClick={handleTaskClick} />
          ))}
        </div>
      ) : (
        <div className="empty-state" style={{ marginTop: 32 }}>
          <div className="empty-state-icon">📋</div>
          <div className="empty-state-text">Nenhuma tarefa encontrada</div>
          <div className="empty-state-sub">
            {isGerente ? "Crie uma nova tarefa usando o botão acima" : "Nenhuma tarefa atribuída a você"}
          </div>
        </div>
      )}

      {/* FAB mobile */}
      {isGerente && (
        <button className="fab mobile-only" onClick={() => setShowForm(true)}>＋</button>
      )}

      {/* Task Form Modal */}
      <TaskForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleCreateTask}
        users={users}
      />
    </div>
  );
}
