"use client";

import { useState } from "react";
import { useTasks } from "@/contexts/TaskContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { formatDateRelative, formatDateFull } from "@/lib/dateUtils";
import { deleteButtonStyle } from "@/lib/uiConstants";
import Lightbox from "@/components/ui/Lightbox";

export default function EvidenciasPage() {
  const { isGerente } = useAuth();
  const { evidences, tasks, deleteEvidence } = useTasks();
  const toast = useToast();
  const [lightboxImg, setLightboxImg] = useState(null);
  const [filterStatus, setFilterStatus] = useState("todos");

  async function handleDeleteEvidence(ev, closeLightbox = false) {
    if (!confirm("Tem certeza que deseja apagar esta evidência?")) return;
    try {
      await deleteEvidence(ev.id, ev.task_id);
      if (closeLightbox) setLightboxImg(null);
      toast.success("Evidência apagada");
    } catch (err) {
      console.error("Erro ao apagar evidência:", err);
      toast.error("Ocorreu um erro ao apagar a evidência.");
    }
  }

  const filtered = filterStatus === "todos"
    ? evidences
    : evidences.filter((e) => (e.status || "pendente") === filterStatus);

  function getTaskTitle(taskId) {
    return tasks.find((t) => t.id === taskId)?.title || "Tarefa removida";
  }

  return (
    <div className="animate-fade">
      <div className="header">
        <div className="header-title">
          <h1>📸 Evidências Fotográficas</h1>
          <p>{filtered.length} evidência(s)</p>
        </div>
      </div>

      {/* Filters */}
      <div className="task-filters" style={{ marginBottom: 16 }}>
        {["todos", "pendente", "aprovada", "rejeitada"].map((s) => (
          <button
            key={s}
            className={`filter-chip ${filterStatus === s ? "active" : ""}`}
            onClick={() => setFilterStatus(s)}
          >
            {s === "todos" ? "Todas" : s === "pendente" ? "⏳ Pendentes" : s === "aprovada" ? "✅ Aprovadas" : "❌ Rejeitadas"}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="evidence-grid">
          {filtered.map((ev) => (
            <div key={ev.id} className="evidence-card" onClick={() => setLightboxImg(ev)}>
              <img src={ev.image_url} alt={ev.description || "Evidência"} />
              
              {isGerente && (
                <button 
                  style={deleteButtonStyle}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteEvidence(ev);
                  }}
                >
                  🗑️
                </button>
              )}

              <span className={`evidence-status ${ev.status || "pendente"}`}>
                {ev.status === "aprovada" ? "✅" : ev.status === "rejeitada" ? "❌" : "⏳"}
              </span>
              <div className="evidence-card-overlay">
                <div style={{ fontWeight: 500 }}>{ev.description || "Sem descrição"}</div>
                <div style={{ fontSize: "0.65rem", opacity: 0.8 }}>
                  {getTaskTitle(ev.task_id)} • {formatDateRelative(ev.captured_at || ev.created_at)}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">📷</div>
          <div className="empty-state-text">Nenhuma evidência encontrada</div>
          <div className="empty-state-sub">As evidências aparecerão aqui quando enviadas</div>
        </div>
      )}

      <Lightbox
        isOpen={!!lightboxImg}
        onClose={() => setLightboxImg(null)}
        src={lightboxImg?.image_url}
        alt={lightboxImg?.description}
        info={
          lightboxImg && (
            <div>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>{lightboxImg.description || "Sem descrição"}</div>
              <div style={{ fontSize: "0.8rem", opacity: 0.8 }}>
                Tarefa: {getTaskTitle(lightboxImg.task_id)}
              </div>
              <div style={{ fontSize: "0.8rem", opacity: 0.8 }}>
                Por: {lightboxImg.captured_by} • {formatDateFull(lightboxImg.captured_at || lightboxImg.created_at)}
              </div>
              {lightboxImg.rejection_reason && (
                <div style={{ marginTop: 8, padding: "8px 12px", background: "rgba(198,40,40,0.2)", borderRadius: 8, fontSize: "0.85rem" }}>
                  ❌ Motivo: {lightboxImg.rejection_reason}
                </div>
              )}
              {isGerente && (
                <button 
                  className="btn btn-danger btn-sm" 
                  style={{ marginTop: 12, width: '100%' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteEvidence(lightboxImg, true);
                  }}
                >
                  🗑️ Apagar Evidência Definitivamente
                </button>
              )}
            </div>
          )
        }
      />
    </div>
  );
}
