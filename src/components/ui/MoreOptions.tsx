import type { ReactNode } from 'react';

/** Sección plegable «Más opciones»: lo avanzado queda escondido hasta que se pide */
export function MoreOptions({ summary, children }: { summary: string; children: ReactNode }) {
  return (
    <details
      className="more"
      onToggle={(e) => {
        const d = e.currentTarget;
        if (d.open) window.setTimeout(() => d.scrollIntoView({ block: 'nearest', behavior: 'smooth' }), 60);
      }}
    >
      <summary>{summary}</summary>
      {children}
    </details>
  );
}
