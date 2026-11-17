import { useEffect, useState } from 'react';
import type { HelpTarget } from '../../data/help/types';
import { DEFAULT_SUMMARY_VERSION, getSummaryVersion, type SummaryVersionId } from '../../data/summary';
import { newCaseNumber, todayLabel, useStoredState } from '../../hooks/useStoredState';
import { ArrowLeftIcon, ClockIcon, FlagIcon, MailIcon, OpenBookIcon, SearchIcon } from '../ui/Icons';
import { DraftNote, ErrorSummary, RadioCards, SelectField, TextArea, TextField } from '../ui/FormFields';
import { ClaimBook } from './ClaimBook';
import { ServiceStatus } from './ServiceStatus';

/** Un caso enviado (ticket o reporte de error). En el prototipo se guarda solo en este navegador. */
export interface SupportCase { number: string; kind: string; title: string; date: string; promise: string; }

/** Gravedad en palabras simples, con los tiempos del SLA */
export const SEVERITIES = [
  { value: 'critica', label: 'No puedo leer la noticia', desc: 'Respondemos en 2 horas y lo solucionamos en 24 horas.', promise: 'Te respondemos en 2 horas.' },
  { value: 'alta', label: 'Una herramienta no funciona', desc: 'Respondemos en 8 horas y lo solucionamos en 3 días hábiles.', promise: 'Te respondemos en 8 horas.' },
  { value: 'media', label: 'Algo se ve mal', desc: 'Respondemos en 1 día hábil.', promise: 'Te respondemos en 1 día hábil.' },
  { value: 'baja', label: 'Es una sugerencia', desc: 'Respondemos en 3 días hábiles.', promise: 'Te respondemos en 3 días hábiles.' },
];

export function ContactHub({ id, idea, go }: { id?: string; idea?: number; go: (t: HelpTarget) => void }) {
  const [cases, setCases] = useStoredState<SupportCase[]>('casos', []);
  const addCase = (c: SupportCase) => setCases([c, ...cases]);
  const back = <button type="button" className="hc-back" onClick={() => go({ section: 'contacto' })}><ArrowLeftIcon /> Contacto y reclamos</button>;

  if (id === 'error-resumen') return <ReportError back={back} idea={idea} onSent={addCase} />;
  if (id === 'ticket') return <TicketForm back={back} onSent={addCase} />;
  if (id === 'estado') return <CaseStatus back={back} cases={cases} />;
  if (id === 'reclamaciones') return <ClaimBook back={back} />;

  const options = [
    { id: 'error-resumen', icon: <FlagIcon />, title: 'Reportar un error del resumen', desc: 'Si una idea dice algo que la noticia no dice. Lo corregimos en 24 horas.' },
    { id: 'ticket', icon: <MailIcon />, title: 'Escribir al equipo', desc: 'Para un problema, una duda o una sugerencia. Recibes un número de caso.' },
    { id: 'estado', icon: <SearchIcon />, title: 'Ver en qué va mi caso', desc: 'Con tu número de caso.' },
  ];
  return (
    <div className="hc-stack">
      <h3 className="hc-h3" tabIndex={-1} data-hc-focus>Contacto y reclamos</h3>
      <ul className="hc-list">
        {options.map((o) => (
          <li key={o.id}>
            <button type="button" className="hc-card" onClick={() => go({ section: 'contacto', id: o.id })}>
              <span className="hc-card-ic" aria-hidden="true">{o.icon}</span>
              <span><b>{o.title}</b><small>{o.desc}</small></span>
            </button>
          </li>
        ))}
      </ul>
      <button type="button" className="hc-claim-notice" onClick={() => go({ section: 'contacto', id: 'reclamaciones' })}>
        <OpenBookIcon size={44} />
        <span><b>Libro de Reclamaciones</b><small>Registra un reclamo o una queja. Respondemos en máximo 15 días hábiles.</small></span>
      </button>
      <section className="hc-sla" aria-labelledby="hc-sla-t">
        <h4 id="hc-sla-t" className="hc-h4"><ClockIcon /> Cuánto tardamos en responder</h4>
        <ul>{SEVERITIES.map((s) => <li key={s.value}><b>{s.label}:</b> {s.desc}</li>)}</ul>
      </section>
      <ServiceStatus />
    </div>
  );
}


/** Al mostrar una confirmación: el contenido vuelve arriba y el foco va al título */
export function useShowFromTop() {
  useEffect(() => {
    document.querySelector('.hc-main')?.scrollTo({ top: 0 });
    document.querySelector<HTMLElement>('.hc-main [data-hc-focus]')?.focus({ preventScroll: true });
  }, []);
}

function Sent({ back, c, extra }: { back: React.ReactNode; c: SupportCase; extra?: string }) {
  const [copied, setCopied] = useState(false);
  useShowFromTop();
  return (
    <div className="hc-stack">
      {back}
      <div className="hc-done" role="status">
        <h3 className="hc-h3" tabIndex={-1} data-hc-focus>¡Recibido!</h3>
        <p>Tu número de caso es</p>
        <p className="hc-case">{c.number}</p>
        <p>{c.promise}</p>
        {extra && <p className="hc-muted">{extra}</p>}
        <button type="button" className="btn" onClick={async () => {
          try { await navigator.clipboard.writeText(c.number); setCopied(true); } catch { setCopied(false); }
        }}>{copied ? 'Número copiado' : 'Copiar el número'}</button>
      </div>
      <p className="hc-tip">Prototipo académico: el caso se guarda solo en este equipo y no llega a ninguna persona.</p>
    </div>
  );
}

const EMPTY_ERR = { idea: '', kind: '', detail: '', email: '' };

function ReportError({ back, idea, onSent }: { back: React.ReactNode; idea?: number; onSent: (c: SupportCase) => void }) {
  const [f, setF, reset] = useStoredState('borrador-error', { ...EMPTY_ERR, idea: idea != null ? String(idea) : '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState<SupportCase | null>(null);
  const set = (k: keyof typeof EMPTY_ERR) => (v: string) => setF({ ...f, [k]: v });
  const [versionId] = useStoredState<SummaryVersionId>('version-resumen', DEFAULT_SUMMARY_VERSION);
  const version = getSummaryVersion(versionId);
  if (done) return <Sent back={back} c={done} extra="Si la idea estaba mal, la corregimos y lo verás en el resumen." />;

  const submit = () => {
    const e: Record<string, string> = {};
    if (!f.idea) e['er-idea'] = 'Elige qué idea tiene el error.';
    if (!f.kind) e['er-kind'] = 'Elige qué está mal.';
    if (f.email && !/^\S+@\S+\.\S+$/.test(f.email)) e['er-email'] = 'Revisa el correo: debe tener la forma nombre@correo.com.';
    setErrors(e);
    if (Object.keys(e).length) return;
    const c: SupportCase = { number: newCaseNumber('ERR'), kind: 'Error del resumen', title: `${version.ideas[Number(f.idea)]?.title ?? ''} (versión ${version.label})`, date: todayLabel(), promise: 'Lo revisamos y corregimos en un plazo máximo de 24 horas.' };
    onSent(c); reset(); setDone(c);
  };

  return (
    <form className="hc-stack" noValidate onSubmit={(ev) => { ev.preventDefault(); submit(); }}>
      {back}
      <h3 className="hc-h3" tabIndex={-1} data-hc-focus>Reportar un error del resumen</h3>
      <p className="hc-muted">Gracias por avisar. Así el resumen mejora para todas las personas.</p>
      <ErrorSummary errors={errors} />
      <SelectField id="er-idea" label="¿Qué idea tiene el error?" required value={f.idea} onChange={set('idea')} error={errors['er-idea']}
        options={version.ideas.map((s, i) => ({ value: String(i), label: `Idea ${i + 1}: ${s.title}` }))} />
      <RadioCards id="er-kind" label="¿Qué está mal?" required value={f.kind} onChange={set('kind')} error={errors['er-kind']} options={[
        { value: 'inventado', label: 'Dice algo que la noticia no dice' },
        { value: 'equivocado', label: 'Un dato está equivocado', desc: 'Por ejemplo, un número o un lugar.' },
        { value: 'falta', label: 'Falta algo importante' },
        { value: 'confuso', label: 'Se entiende mal' },
      ]} />
      <TextArea id="er-detail" label="Cuéntanos más" hint="Por ejemplo, qué dice la noticia en realidad." value={f.detail} onChange={set('detail')} rows={3} />
      <TextField id="er-email" label="Correo para avisarte" type="email" autoComplete="email" inputMode="email" hint="Solo si quieres que te avisemos cuando esté corregido." value={f.email} onChange={set('email')} error={errors['er-email']} />
      <DraftNote />
      <button type="submit" className="btn primary">Enviar reporte</button>
    </form>
  );
}

const EMPTY_TICKET = { topic: '', severity: '', detail: '', email: '' };

function TicketForm({ back, onSent }: { back: React.ReactNode; onSent: (c: SupportCase) => void }) {
  const [f, setF, reset] = useStoredState('borrador-ticket', EMPTY_TICKET);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState<SupportCase | null>(null);
  const set = (k: keyof typeof EMPTY_TICKET) => (v: string) => setF({ ...f, [k]: v });
  if (done) return <Sent back={back} c={done} />;

  const submit = () => {
    const e: Record<string, string> = {};
    if (!f.topic) e['tk-topic'] = 'Elige sobre qué nos escribes.';
    if (!f.severity) e['tk-sev'] = 'Elige qué tan grave es.';
    if (f.detail.trim().length < 10) e['tk-detail'] = 'Cuéntanos qué pasó (al menos 10 letras).';
    if (!/^\S+@\S+\.\S+$/.test(f.email)) e['tk-email'] = 'Escribe un correo para responderte, con la forma nombre@correo.com.';
    setErrors(e);
    if (Object.keys(e).length) return;
    const sev = SEVERITIES.find((s) => s.value === f.severity)!;
    const c: SupportCase = { number: newCaseNumber(), kind: 'Consulta', title: f.topic, date: todayLabel(), promise: sev.promise };
    onSent(c); reset(); setDone(c);
  };

  return (
    <form className="hc-stack" noValidate onSubmit={(ev) => { ev.preventDefault(); submit(); }}>
      {back}
      <h3 className="hc-h3" tabIndex={-1} data-hc-focus>Escribir al equipo</h3>
      <ErrorSummary errors={errors} />
      <SelectField id="tk-topic" label="¿Sobre qué nos escribes?" required value={f.topic} onChange={set('topic')} error={errors['tk-topic']} options={[
        { value: 'Una herramienta no funciona', label: 'Una herramienta no funciona' },
        { value: 'Problema en un diario', label: 'No funciona en un diario' },
        { value: 'Duda de uso', label: 'Tengo una duda' },
        { value: 'Sugerencia', label: 'Tengo una sugerencia' },
        { value: 'Otro', label: 'Otro tema' },
      ]} />
      <RadioCards id="tk-sev" label="¿Qué tan grave es?" required value={f.severity} onChange={set('severity')} error={errors['tk-sev']} options={SEVERITIES} />
      <TextArea id="tk-detail" label="¿Qué pasó?" hint="Cuéntalo con tus palabras. No hace falta que sea largo." required value={f.detail} onChange={set('detail')} error={errors['tk-detail']} />
      <TextField id="tk-email" label="Correo" type="email" autoComplete="email" inputMode="email" required hint="Para enviarte la respuesta." value={f.email} onChange={set('email')} error={errors['tk-email']} />
      <DraftNote />
      <button type="submit" className="btn primary">Enviar</button>
    </form>
  );
}

function CaseStatus({ back, cases }: { back: React.ReactNode; cases: SupportCase[] }) {
  const [q, setQ] = useState('');
  const [searched, setSearched] = useState(false);
  const found = cases.find((c) => c.number.toLowerCase() === q.trim().toLowerCase());
  return (
    <div className="hc-stack">
      {back}
      <h3 className="hc-h3" tabIndex={-1} data-hc-focus>Ver en qué va mi caso</h3>
      <form className="hc-inline-form" onSubmit={(e) => { e.preventDefault(); setSearched(true); }}>
        <TextField id="st-num" label="Número de caso" hint="Por ejemplo: NSB-2026-12345" required value={q} onChange={(v) => { setQ(v); setSearched(false); }} />
        <button type="submit" className="btn primary">Buscar</button>
      </form>
      <div aria-live="polite">
        {searched && (found ? <CaseTimeline c={found} /> : <p className="f-error">No encontramos ese número. Revisa que esté bien escrito.</p>)}
      </div>
      {cases.length > 0 && (
        <section aria-labelledby="st-mine">
          <h4 id="st-mine" className="hc-h4">Tus casos en este equipo</h4>
          <ul className="hc-list">
            {cases.map((c) => (
              <li key={c.number}><button type="button" className="hc-row" onClick={() => { setQ(c.number); setSearched(true); }}>
                <span><b>{c.number}</b><small>{c.kind} · {c.title} · {c.date}</small></span>
              </button></li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function CaseTimeline({ c }: { c: SupportCase }) {
  const steps = [
    { label: 'Recibido', detail: c.date, state: 'done' },
    { label: 'En revisión', detail: c.promise, state: 'now' },
    { label: 'Resuelto', detail: 'Te avisaremos por correo.', state: 'next' },
  ];
  return (
    <ol className="hc-timeline" aria-label={`Estado del caso ${c.number}`}>
      {steps.map((s) => (
        <li key={s.label} data-state={s.state}>
          <b>{s.label}{s.state === 'now' && ' (ahora)'}</b>
          <small>{s.detail}</small>
        </li>
      ))}
    </ol>
  );
}
