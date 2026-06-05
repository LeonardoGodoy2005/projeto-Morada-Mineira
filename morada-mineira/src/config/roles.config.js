// =============================================
// CONFIGURAÇÃO DE PAPÉIS E PERMISSÕES
// =============================================
// Define os papéis disponíveis e suas permissões.
// Adicione novos papéis ou modifique permissões aqui.
// =============================================

export const ROLES = {
  gerente: {
    id: "gerente",
    label: "Gerente",
    icon: "👔",
    permissions: [
      "criar_tarefa",
      "editar_tarefa",
      "deletar_tarefa",
      "atribuir_tarefa",
      "aprovar_evidencia",
      "rejeitar_evidencia",
      "ver_todas_tarefas",
      "ver_relatorios",
      "gerenciar_funcionarios",
      "configuracoes",
    ],
  },
  funcionario: {
    id: "funcionario",
    label: "Funcionário",
    icon: "👷",
    permissions: [
      "ver_tarefas_atribuidas",
      "iniciar_tarefa",
      "concluir_tarefa",
      "enviar_evidencia",
      "ver_proprias_evidencias",
    ],
  },
};

/**
 * Verifica se um papel tem determinada permissão
 */
export function hasPermission(roleId, permission) {
  const role = ROLES[roleId];
  if (!role) return false;
  return role.permissions.includes(permission);
}

/**
 * Lista de navegação por papel
 */
export const NAV_ITEMS = {
  gerente: [
    { id: "painel", label: "Painel", icon: "📊", href: "/painel" },
    { id: "tarefas", label: "Tarefas", icon: "📋", href: "/tarefas" },
    { id: "evidencias", label: "Evidências", icon: "📸", href: "/evidencias" },
    { id: "configuracoes", label: "Configurações", icon: "⚙️", href: "/configuracoes" },
  ],
  funcionario: [
    { id: "painel", label: "Painel", icon: "📊", href: "/painel" },
    { id: "tarefas", label: "Minhas Tarefas", icon: "📋", href: "/tarefas" },
    { id: "evidencias", label: "Evidências", icon: "📸", href: "/evidencias" },
  ],
};
