/** Botón flotante «Lectura fácil» (solo en escritorio; en móvil y tablet la barra siempre está visible) */
export function FloatingButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" className="fab" id="fab" data-tour="fab" aria-label="Abrir herramientas de lectura fácil" onClick={onClick}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8z" />
        <path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z" />
      </svg>
      Lectura fácil
    </button>
  );
}
