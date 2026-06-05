// =============================================
// UTILITÁRIOS DE DATA
// =============================================
// Formatação de datas em pt-BR
// =============================================

/**
 * Formata data para exibição completa
 * Ex: "27 de abril de 2026 às 13:30"
 */
export function formatDateFull(dateStr) {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  return date.toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Formata data curta
 * Ex: "27/04/2026"
 */
export function formatDateShort(dateStr) {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  return date.toLocaleDateString("pt-BR");
}

/**
 * Formata data relativa
 * Ex: "há 5 minutos", "há 2 horas", "ontem"
 */
export function formatDateRelative(dateStr) {
  if (!dateStr) return "—";

  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return "agora";
  if (diffMin < 60) return `há ${diffMin} min`;
  if (diffHour < 24) return `há ${diffHour}h`;
  if (diffDay === 1) return "ontem";
  if (diffDay < 7) return `há ${diffDay} dias`;
  if (diffDay < 30) return `há ${Math.floor(diffDay / 7)} sem`;
  return formatDateShort(dateStr);
}

/**
 * Formata apenas o horário
 * Ex: "13:30"
 */
export function formatTime(dateStr) {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

/**
 * Retorna a data de hoje no formato ISO (yyyy-mm-dd)
 */
export function todayISO() {
  return new Date().toISOString().split("T")[0];
}
