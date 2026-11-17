import { CloseIcon } from '../ui/Icons';

/** Aviso inicial que señala la barra (si el usuario no vio la guía) */
export function CoachMark({ onClose }: { onClose: () => void }) {
  return (
    <div className="coach" id="coach" role="note">
      <span>Tus herramientas de lectura están aquí abajo: resumen, sin anuncios, letra y voz.</span>
      <button type="button" onClick={onClose} aria-label="Cerrar aviso"><CloseIcon size={20} strokeWidth={2.4} /></button>
    </div>
  );
}
