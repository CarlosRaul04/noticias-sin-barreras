import { useState } from 'react';
import type { HelpTarget } from '../../data/help/types';
import { FAQS } from '../../data/help/faqs';
import { ChevronDownIcon } from '../ui/Icons';

/** Preguntas frecuentes por tema. Se abre una respuesta a la vez, para no llenar la pantalla. */
export function FaqList({ id, go }: { id?: string; go: (t: HelpTarget) => void }) {
  const [open, setOpen] = useState<string | null>(id ?? null);
  const categories = [...new Set(FAQS.map((f) => f.category))];
  return (
    <div className="hc-stack">
      <h3 className="hc-h3" tabIndex={-1} data-hc-focus>Preguntas frecuentes</h3>
      {categories.map((c) => (
        <section key={c} aria-label={c}>
          <h4 className="hc-h4">{c}</h4>
          <ul className="hc-faq">
            {FAQS.filter((f) => f.category === c).map((f) => {
              const isOpen = open === f.id;
              return (
                <li key={f.id}>
                  <button type="button" className="hc-faq-q" aria-expanded={isOpen} aria-controls={`faq-${f.id}`} onClick={() => setOpen(isOpen ? null : f.id)}>
                    <span>{f.q}</span><ChevronDownIcon />
                  </button>
                  {isOpen && (
                    <div id={`faq-${f.id}`} className="hc-faq-a hc-read">
                      <p>{f.a}</p>
                      {f.link && <button type="button" className="hc-link" onClick={() => go(f.link!.target)}>{f.link.label}</button>}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      ))}
      <p className="hc-muted">¿No encontraste tu pregunta? <button type="button" className="hc-link" onClick={() => go({ section: 'contacto', id: 'ticket' })}>Escríbenos</button></p>
    </div>
  );
}
