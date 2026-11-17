import { useMemo, useState } from 'react';
import type { HelpSection, HelpTarget } from '../../data/help/types';
import { ASSISTANT_TOPICS } from '../../data/help/assistant';
import { ARTICLES } from '../../data/help/articles';
import { FAQS } from '../../data/help/faqs';
import { VIDEOS } from '../../data/help/videos';
import { Mascot } from '../tour/Mascot';
import { SearchIcon } from '../ui/Icons';
import { SECTIONS } from './sections';
import { ServiceStatus } from './ServiceStatus';

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

/**
 * Inicio del Centro de ayuda: Notín pregunta qué necesitas (respuestas fijas, sin IA),
 * un buscador para guías, videos y preguntas, y el acceso a la guía paso a paso.
 */
export function HelpHome({ go }: { go: (t: HelpTarget) => void }) {
  const [topic, setTopic] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const chosen = ASSISTANT_TOPICS.find((t) => t.id === topic);

  const results = useMemo(() => {
    const q = norm(query.trim());
    if (q.length < 2) return [];
    const hit = (...t: string[]) => t.some((x) => norm(x).includes(q));
    return [
      ...ARTICLES.filter((a) => hit(a.title, a.summary, ...a.steps)).map((a) => ({ key: `a-${a.id}`, kind: 'Guía', title: a.title, target: { section: 'guias' as HelpSection, id: a.id } })),
      ...VIDEOS.filter((v) => hit(v.title, v.summary, ...v.scenes.map((s) => s.text))).map((v) => ({ key: `v-${v.id}`, kind: 'Video', title: v.title, target: { section: 'videos' as HelpSection, id: v.id } })),
      ...FAQS.filter((f) => hit(f.q, f.a)).map((f) => ({ key: `f-${f.id}`, kind: 'Pregunta', title: f.q, target: { section: 'preguntas' as HelpSection, id: f.id } })),
    ].slice(0, 8);
  }, [query]);

  return (
    <div className="hc-stack">
      <div className="hc-assistant">
        <Mascot className="hc-assistant-notin" />
        <div className="hc-bubble" aria-live="polite">
          {chosen ? (
            <>
              <p className="hc-bubble-ask">«{chosen.ask}»</p>
              <p>{chosen.answer}</p>
              <div className="hc-actions">
                {chosen.actions.map((a, i) => (
                  <button key={a.label} type="button" className={`btn${i === 0 ? ' primary' : ''}`} onClick={() => go(a.target)}>{a.label}</button>
                ))}
              </div>
              <button type="button" className="hc-link" onClick={() => setTopic(null)}>Elegir otra cosa</button>
            </>
          ) : (
            <>
              <h3 className="hc-h3" tabIndex={-1} data-hc-focus>¡Hola! ¿En qué te ayudo?</h3>
              <p className="hc-muted">Elige lo que se parezca a lo que necesitas.</p>
            </>
          )}
        </div>
      </div>

      {!chosen && (
        <div className="hc-chips" role="group" aria-label="¿Qué necesitas?">
          {ASSISTANT_TOPICS.map((t) => (
            <button key={t.id} type="button" className="hc-chip" onClick={() => setTopic(t.id)}>{t.ask}</button>
          ))}
        </div>
      )}

      <div className="hc-search">
        <label htmlFor="hc-search" className="f-label">Buscar en la ayuda</label>
        <div className="hc-search-box">
          <SearchIcon />
          <input id="hc-search" type="search" value={query} placeholder="Por ejemplo: letra, resumen, reclamo" onChange={(e) => setQuery(e.target.value)} />
        </div>
        {query.trim().length >= 2 && (
          <div aria-live="polite">
            {results.length ? (
              <ul className="hc-results">
                {results.map((r) => (
                  <li key={r.key}><button type="button" onClick={() => go(r.target)}><small>{r.kind}</small>{r.title}</button></li>
                ))}
              </ul>
            ) : <p className="hc-muted">No encontramos «{query}». Prueba con otra palabra o escríbenos en Contacto.</p>}
          </div>
        )}
      </div>

      <button type="button" className="btn hc-tour-btn" onClick={() => go({ tour: true })}>Ver la guía paso a paso otra vez</button>

      <nav className="hc-home-sections" aria-label="Secciones de ayuda">
        {SECTIONS.filter((s) => s.id !== 'inicio').map((s) => (
          <button key={s.id} type="button" className="hc-card" onClick={() => go({ section: s.id })}>
            <span className="hc-card-ic" aria-hidden="true">{s.icon}</span>
            <span><b>{s.label}</b><small>{s.desc}</small></span>
          </button>
        ))}
      </nav>

      <ServiceStatus />
    </div>
  );
}
