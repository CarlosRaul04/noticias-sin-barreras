import { useState } from 'react';
import type { CommunityPost, HelpTarget } from '../../data/help/types';
import { COMMUNITY_CATEGORIES, COMMUNITY_POSTS, COMMUNITY_RULES } from '../../data/help/community';
import { useStoredState } from '../../hooks/useStoredState';
import { ArrowLeftIcon, FlagIcon } from '../ui/Icons';
import { Checkbox, DraftNote, ErrorSummary, RadioCards, TextArea, TextField } from '../ui/FormFields';

/**
 * Comunidad (foro). En el prototipo muestra el diseño con conversaciones de ejemplo,
 * marcadas como tales. Lo que publica el usuario queda «en revisión» y solo lo ve él.
 */
export function Community({ id, go }: { id?: string; go: (t: HelpTarget) => void }) {
  const [mine, setMine] = useStoredState<CommunityPost[]>('foro-mios', []);
  const [filter, setFilter] = useState<string>('Todo');
  const all = [...mine, ...COMMUNITY_POSTS];

  if (id === 'nueva') return <NewPost go={go} onPublish={(p) => setMine([p, ...mine])} />;
  const post = all.find((p) => p.id === id);
  if (post) return <PostView post={post} go={go} />;

  const list = all
    .filter((p) => filter === 'Todo' || p.category === filter)
    .sort((a, b) => Number(!!b.pinned) - Number(!!a.pinned));

  return (
    <div className="hc-stack">
      <h3 className="hc-h3" tabIndex={-1} data-hc-focus>Comunidad</h3>
      <Rules />
      <button type="button" className="btn primary" onClick={() => go({ section: 'comunidad', id: 'nueva' })}>Escribir una publicación</button>
      <div className="hc-chips" role="group" aria-label="Filtrar por tema">
        {['Todo', ...COMMUNITY_CATEGORIES].map((c) => (
          <button key={c} type="button" className="hc-chip" aria-pressed={filter === c} onClick={() => setFilter(c)}>{c}</button>
        ))}
      </div>
      <ul className="hc-list">
        {list.map((p) => (
          <li key={p.id}>
            <button type="button" className="hc-row" onClick={() => go({ section: 'comunidad', id: p.id })}>
              <span>
                <span className="hc-tags">
                  {p.pinned && <span className="hc-badge hc-badge--team">Fijado</span>}
                  {p.pending && <span className="hc-badge hc-badge--warn">En revisión · solo tú lo ves</span>}
                  {p.example && <span className="hc-badge">Ejemplo del prototipo</span>}
                  <span className="hc-badge hc-badge--soft">{p.category}</span>
                </span>
                <b>{p.title}</b>
                <small>{p.alias} · {p.replies.length} {p.replies.length === 1 ? 'respuesta' : 'respuestas'}</small>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Rules() {
  return (
    <section className="hc-rules" aria-labelledby="hc-rules-t">
      <h4 id="hc-rules-t" className="hc-h4">Reglas de la comunidad</h4>
      <ul>{COMMUNITY_RULES.map((r) => <li key={r}>{r}</li>)}</ul>
    </section>
  );
}

function ReportButton() {
  const [done, setDone] = useState(false);
  return done
    ? <span className="hc-muted" role="status">Gracias. Lo revisaremos.</span>
    : <button type="button" className="hc-link hc-report" onClick={() => setDone(true)}><FlagIcon size={16} /> Reportar</button>;
}

function PostView({ post, go }: { post: CommunityPost; go: (t: HelpTarget) => void }) {
  return (
    <article className="hc-stack">
      <button type="button" className="hc-back" onClick={() => go({ section: 'comunidad' })}><ArrowLeftIcon /> Volver a la comunidad</button>
      <span className="hc-tags">
        {post.example && <span className="hc-badge">Ejemplo del prototipo</span>}
        {post.pending && <span className="hc-badge hc-badge--warn">En revisión · solo tú lo ves</span>}
        <span className="hc-badge hc-badge--soft">{post.category}</span>
      </span>
      <h3 className="hc-h3" tabIndex={-1} data-hc-focus>{post.title}</h3>
      <div className="hc-post">
        <p className="hc-post-by">{post.alias}</p>
        <p className="hc-read">{post.body}</p>
        {!post.pinned && !post.pending && <ReportButton />}
      </div>
      <h4 className="hc-h4">{post.replies.length ? 'Respuestas' : 'Todavía no hay respuestas'}</h4>
      {post.replies.map((r, i) => (
        <div key={i} className={`hc-post hc-reply${r.team ? ' hc-reply--team' : ''}`}>
          <p className="hc-post-by">{r.alias}{r.team && <span className="hc-badge hc-badge--team">Equipo</span>}</p>
          <p className="hc-read">{r.body}</p>
          {!r.team && <ReportButton />}
        </div>
      ))}
      <p className="hc-muted">Las respuestas también se revisan antes de publicarse.</p>
    </article>
  );
}

const EMPTY = { alias: '', category: '', title: '', body: '', ok: false };

function NewPost({ go, onPublish }: { go: (t: HelpTarget) => void; onPublish: (p: CommunityPost) => void }) {
  const [f, setF, reset] = useStoredState('borrador-foro', EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const set = (k: keyof typeof EMPTY) => (v: string | boolean) => setF({ ...f, [k]: v });

  const submit = () => {
    const e: Record<string, string> = {};
    if (!f.alias.trim()) e['np-alias'] = 'Escribe un seudónimo (no uses tu nombre real).';
    if (!f.category) e['np-cat'] = 'Elige un tema.';
    if (f.title.trim().length < 5) e['np-title'] = 'Escribe un título de al menos 5 letras.';
    if (f.body.trim().length < 10) e['np-body'] = 'Escribe tu mensaje (al menos 10 letras).';
    if (!f.ok) e['np-ok'] = 'Confirma que no compartes tu diagnóstico ni datos personales.';
    setErrors(e);
    if (Object.keys(e).length) return;
    const id = `mio-${Date.now()}`;
    onPublish({ id, alias: f.alias.trim(), category: f.category, title: f.title.trim(), body: f.body.trim(), replies: [], pending: true });
    reset();
    go({ section: 'comunidad', id });
  };

  return (
    <form className="hc-stack" noValidate onSubmit={(ev) => { ev.preventDefault(); submit(); }}>
      <button type="button" className="hc-back" onClick={() => go({ section: 'comunidad' })}><ArrowLeftIcon /> Volver a la comunidad</button>
      <h3 className="hc-h3" tabIndex={-1} data-hc-focus>Escribir una publicación</h3>
      <p className="hc-tip">Tu publicación será revisada antes de que otras personas la vean.</p>
      <ErrorSummary errors={errors} />
      <TextField id="np-alias" label="Seudónimo" hint="Un nombre inventado, por ejemplo «lector_azul»." required value={f.alias} onChange={set('alias')} error={errors['np-alias']} />
      <RadioCards id="np-cat" label="Tema" required value={f.category} onChange={set('category')} error={errors['np-cat']}
        options={[{ value: 'Trucos', label: 'Trucos', desc: 'Algo que te ayuda a leer mejor' }, { value: 'Dudas', label: 'Dudas', desc: 'Algo que no sabes cómo hacer' }, { value: 'Sugerencias', label: 'Sugerencias', desc: 'Una idea para mejorar el plugin' }]} />
      <TextField id="np-title" label="Título" required value={f.title} onChange={set('title')} error={errors['np-title']} />
      <TextArea id="np-body" label="Mensaje" required value={f.body} onChange={set('body')} error={errors['np-body']} />
      <Checkbox id="np-ok" checked={f.ok} onChange={set('ok')} error={errors['np-ok']} label="Confirmo que no comparto mi diagnóstico, mi nombre completo ni otros datos personales." />
      <DraftNote />
      <button type="submit" className="btn primary">Enviar a revisión</button>
    </form>
  );
}
