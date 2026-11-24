import { useStoredState } from '../../hooks/useStoredState';
import type { HelpTarget } from '../../data/help/types';
import type { ToolId } from '../../types';
import { ARTICLES } from '../../data/help/articles';
import { TOOLS } from '../../data/tools';
import { ArrowLeftIcon, ThumbDownIcon, ThumbUpIcon } from '../ui/Icons';

/** Base de conocimientos: lista de guías por tema y vista de cada guía con pasos numerados */
export function KnowledgeBase({ id, go }: { id?: string; go: (t: HelpTarget) => void }) {
  const article = ARTICLES.find((a) => a.id === id);
  if (article) return <ArticleView key={article.id} id={article.id} go={go} />;

  const categories = [...new Set(ARTICLES.map((a) => a.category))];
  return (
    <div className="hc-stack">
      <h3 className="hc-h3" tabIndex={-1} data-hc-focus>Guías</h3>
      <p className="hc-muted">Cada guía se lee en 1 minuto.</p>
      {categories.map((c) => (
        <section key={c} aria-label={c}>
          <h4 className="hc-h4">{c}</h4>
          <ul className="hc-list">
            {ARTICLES.filter((a) => a.category === c).map((a) => (
              <li key={a.id}>
                <button type="button" className="hc-row" onClick={() => go({ section: 'guias', id: a.id })}>
                  <span><b>{a.title}</b><small>{a.summary}</small></span>
                  <span className="hc-badge">{a.minutes} min</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

const toolName = (t: ToolId) => TOOLS.find((x) => x.id === t)?.tab ?? '';

function ArticleView({ id, go }: { id: string; go: (t: HelpTarget) => void }) {
  const a = ARTICLES.find((x) => x.id === id)!;
  // Se recuerda por guía; tocar el mismo pulgar otra vez quita el voto
  const [vote, setVote] = useStoredState<'si' | 'no' | null>(`voto-guia-${a.id}`, null);
  const choose = (v: 'si' | 'no') => setVote(vote === v ? null : v);
  return (
    <article className="hc-stack">
      <button type="button" className="hc-back" onClick={() => go({ section: 'guias' })}><ArrowLeftIcon /> Todas las guías</button>
      <p className="hc-eyebrow">{a.category} · {a.minutes} min</p>
      <h3 className="hc-h3" tabIndex={-1} data-hc-focus>{a.title}</h3>
      {a.image && <img className="hc-img" src={a.image.src} alt={a.image.alt} />}
      <ol className="hc-steps hc-read">
        {a.steps.map((s) => <li key={s}>{s}</li>)}
      </ol>
      {a.tip && <p className="hc-tip"><b>Consejo:</b> {a.tip}</p>}
      <div className="hc-actions">
        {a.tool && <button type="button" className="btn primary" onClick={() => go({ tool: a.tool! })}>Abrir {toolName(a.tool)}</button>}
        {a.videoId && <button type="button" className="btn" onClick={() => go({ section: 'videos', id: a.videoId })}>Ver el video</button>}
      </div>
      <div className="hc-feedback">
        <span id={`voto-${a.id}`}>¿Te sirvió esta guía?</span>
        <div className="hc-thumbs" role="group" aria-labelledby={`voto-${a.id}`}>
          <button type="button" className="hc-thumb hc-thumb--up" aria-pressed={vote === 'si'} aria-label="Sí, me sirvió" title="Me sirvió" onClick={() => choose('si')}>
            <ThumbUpIcon />
          </button>
          <button type="button" className="hc-thumb hc-thumb--down" aria-pressed={vote === 'no'} aria-label="No me sirvió" title="No me sirvió" onClick={() => choose('no')}>
            <ThumbDownIcon />
          </button>
        </div>
        <p className="hc-vote-msg" aria-live="polite">
          {vote === 'si' && '¡Gracias! Nos alegra que te sirva.'}
          {vote === 'no' && <>Gracias por avisar. <button type="button" className="hc-link" onClick={() => go({ section: 'contacto', id: 'ticket' })}>Cuéntanos qué faltó</button></>}
        </p>
      </div>
    </article>
  );
}
