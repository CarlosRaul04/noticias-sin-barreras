import { useCallback, useState } from 'react';

/**
 * La guía aparece apenas se abre la página (en cada visita, para que el primer contacto
 * siempre la muestre durante las pruebas con usuarios). Después se puede volver a abrir
 * con «Ver la guía».
 */
export function useGuidedTour() {
  const [open, setOpen] = useState(true);
  const start = useCallback(() => setOpen(true), []);
  const finish = useCallback(() => setOpen(false), []);
  return { open, start, finish };
}
