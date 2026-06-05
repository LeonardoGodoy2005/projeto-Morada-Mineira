// =============================================
// CONSTANTES COMPARTILHADAS DE UI
// =============================================
// Estilos inline reutilizáveis para componentes
// que precisam de estilos dinâmicos ou pontuais.
// =============================================

/**
 * Estilo do botão de exclusão circular
 * Usado nas grids de evidências (overlay sobre imagem)
 */
export const deleteButtonStyle = {
  position: 'absolute',
  top: '8px',
  left: '8px',
  background: 'var(--color-danger)',
  border: 'none',
  borderRadius: '50%',
  width: '32px',
  height: '32px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  zIndex: 10,
  boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
};
