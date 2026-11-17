import { forwardRef, type ReactNode } from 'react';

/**
 * Hoja (móvil) / hoja flotante (tablet) / panel (escritorio) donde se abre cada herramienta.
 * Detrás, la noticia se difumina para que la atención quede solo en la hoja.
 */
export const ToolSheet = forwardRef<HTMLElement, { onClose: () => void; children: ReactNode }>(
  function ToolSheet({ onClose, children }, ref) {
    return (
      <>
        <div className="scrim" aria-hidden="true" onClick={onClose} />
        <section className="sheet" id="sheet" role="dialog" aria-label="Herramientas de lectura" ref={ref}>
          <div className="grab" aria-hidden="true" />
          {children}
        </section>
      </>
    );
  },
);
