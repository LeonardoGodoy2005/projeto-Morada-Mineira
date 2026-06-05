// =============================================
// CONFIGURAÇÃO DE TAREFAS
// =============================================
// O gerente pode adicionar/remover/editar categorias,
// prioridades e status modificando este arquivo.
// =============================================

/**
 * CATEGORIAS DE TAREFAS
 * Cada categoria representa um setor/tipo de manutenção.
 * - id: identificador único (não alterar após criação)
 * - label: nome exibido no app
 * - icon: emoji representativo
 * - color: cor do badge/tag
 */
export const TASK_CATEGORIES = [
  { id: "limpeza", label: "Limpeza", icon: "🧹", color: "#4FC3F7" },
  { id: "producao", label: "Produção", icon: "🍞", color: "#FFB74D" },
  { id: "estoque", label: "Estoque", icon: "📦", color: "#A1887F" },
  { id: "equipamentos", label: "Equipamentos", icon: "⚙️", color: "#90A4AE" },
  { id: "refrigeracao", label: "Refrigeração", icon: "❄️", color: "#80DEEA" },
  { id: "forno", label: "Fornos", icon: "🔥", color: "#EF5350" },
  { id: "vitrine", label: "Vitrine/Exposição", icon: "🪟", color: "#CE93D8" },
  { id: "higiene", label: "Higiene/Sanitização", icon: "🧴", color: "#66BB6A" },
  { id: "eletrica", label: "Elétrica", icon: "⚡", color: "#FDD835" },
  { id: "hidraulica", label: "Hidráulica", icon: "🔧", color: "#42A5F5" },
  { id: "geral", label: "Manutenção Geral", icon: "🔨", color: "#78909C" },
];

/**
 * PRIORIDADES DE TAREFAS
 * - id: identificador único
 * - label: texto exibido
 * - color: cor visual
 * - order: ordem de exibição (menor = mais urgente)
 */
export const TASK_PRIORITIES = [
  { id: "baixa", label: "Baixa", color: "#4CAF50", order: 4 },
  { id: "media", label: "Média", color: "#FF9800", order: 3 },
  { id: "alta", label: "Alta", color: "#F44336", order: 2 },
  { id: "urgente", label: "Urgente", color: "#9C27B0", order: 1 },
];

/**
 * STATUS DE TAREFAS
 * Fluxo: pendente → em_andamento → aguardando_evidencia → concluida
 *                                                      → rejeitada → em_andamento
 * - id: identificador único
 * - label: texto exibido
 * - color: cor do badge
 * - icon: emoji do status
 */
export const TASK_STATUSES = [
  { id: "pendente", label: "Pendente", color: "#9E9E9E", icon: "⏳" },
  { id: "em_andamento", label: "Em Andamento", color: "#2196F3", icon: "🔄" },
  { id: "aguardando_evidencia", label: "Aguardando Evidência", color: "#FF9800", icon: "📸" },
  { id: "concluida", label: "Concluída", color: "#4CAF50", icon: "✅" },
  { id: "rejeitada", label: "Rejeitada", color: "#F44336", icon: "❌" },
];

/**
 * RECORRÊNCIA DE TAREFAS
 */
export const TASK_RECURRENCE = [
  { id: "unica", label: "Única vez" },
  { id: "diaria", label: "Diária" },
  { id: "semanal", label: "Semanal" },
  { id: "quinzenal", label: "Quinzenal" },
  { id: "mensal", label: "Mensal" },
];

// Helpers
export function getCategoryById(id) {
  return TASK_CATEGORIES.find((c) => c.id === id) || TASK_CATEGORIES[TASK_CATEGORIES.length - 1];
}

export function getPriorityById(id) {
  return TASK_PRIORITIES.find((p) => p.id === id) || TASK_PRIORITIES[0];
}

export function getStatusById(id) {
  return TASK_STATUSES.find((s) => s.id === id) || TASK_STATUSES[0];
}
