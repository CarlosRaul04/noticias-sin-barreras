import { useEffect, useRef, type ReactNode } from 'react';

/**
 * Campos de formulario accesibles: etiqueta visible, «(obligatorio)» escrito con palabras,
 * ayuda debajo y error que dice cómo corregir (WCAG 3.3.1, 3.3.2 y 3.3.3).
 */
interface Base { id: string; label: string; hint?: string; error?: string; required?: boolean; }

const describedBy = (id: string, hint?: string, error?: string) =>
  [hint ? `${id}-hint` : '', error ? `${id}-err` : ''].filter(Boolean).join(' ') || undefined;

function Label({ id, label, required }: Base) {
  return (
    <label htmlFor={id} className="f-label">
      {label} <span className="f-req">{required ? '(obligatorio)' : '(opcional)'}</span>
    </label>
  );
}
function Help({ id, hint, error }: Base) {
  return (
    <>
      {hint && <p id={`${id}-hint`} className="f-hint">{hint}</p>}
      {error && <p id={`${id}-err`} className="f-error">{error}</p>}
    </>
  );
}

export function TextField(p: Base & { value: string; onChange: (v: string) => void; type?: string; autoComplete?: string; inputMode?: 'text' | 'numeric' | 'email' | 'tel' | 'decimal' }) {
  return (
    <div className="f-field">
      <Label {...p} />
      <input id={p.id} className="f-input" type={p.type ?? 'text'} value={p.value} autoComplete={p.autoComplete} inputMode={p.inputMode}
        aria-required={p.required} aria-invalid={!!p.error} aria-describedby={describedBy(p.id, p.hint, p.error)}
        onChange={(e) => p.onChange(e.target.value)} />
      <Help {...p} />
    </div>
  );
}

export function TextArea(p: Base & { value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <div className="f-field">
      <Label {...p} />
      <textarea id={p.id} className="f-input f-textarea" rows={p.rows ?? 4} value={p.value}
        aria-required={p.required} aria-invalid={!!p.error} aria-describedby={describedBy(p.id, p.hint, p.error)}
        onChange={(e) => p.onChange(e.target.value)} />
      <Help {...p} />
    </div>
  );
}

export function SelectField(p: Base & { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <div className="f-field">
      <Label {...p} />
      <select id={p.id} className="f-input" value={p.value} aria-required={p.required} aria-invalid={!!p.error}
        aria-describedby={describedBy(p.id, p.hint, p.error)} onChange={(e) => p.onChange(e.target.value)}>
        <option value="">Elige una opción</option>
        {p.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <Help {...p} />
    </div>
  );
}

/** Opciones grandes, una por fila, con descripción opcional */
export function RadioCards(p: Base & { value: string; onChange: (v: string) => void; options: { value: string; label: string; desc?: string }[] }) {
  return (
    <fieldset className="f-field f-radios" aria-describedby={describedBy(p.id, p.hint, p.error)} aria-invalid={!!p.error}>
      <legend className="f-label">{p.label} <span className="f-req">{p.required ? '(obligatorio)' : '(opcional)'}</span></legend>
      {p.options.map((o) => (
        <label key={o.value} className="f-radio" data-checked={p.value === o.value || undefined}>
          <input type="radio" name={p.id} id={`${p.id}-${o.value}`} value={o.value} checked={p.value === o.value} onChange={() => p.onChange(o.value)} />
          <span><b>{o.label}</b>{o.desc && <small>{o.desc}</small>}</span>
        </label>
      ))}
      <Help {...p} />
    </fieldset>
  );
}

export function Checkbox({ id, label, checked, onChange, error }: { id: string; label: ReactNode; checked: boolean; onChange: (v: boolean) => void; error?: string }) {
  return (
    <div className="f-field">
      <label className="f-check" htmlFor={id}>
        <input id={id} type="checkbox" checked={checked} aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined} onChange={(e) => onChange(e.target.checked)} />
        <span>{label}</span>
      </label>
      {error && <p id={`${id}-err`} className="f-error">{error}</p>}
    </div>
  );
}

/** Resumen de errores arriba del formulario: recibe el foco y enlaza a cada campo */
export function ErrorSummary({ errors }: { errors: Record<string, string> }) {
  const ref = useRef<HTMLDivElement>(null);
  const list = Object.entries(errors);
  useEffect(() => { if (list.length) ref.current?.focus(); }, [errors]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!list.length) return null;
  return (
    <div className="f-summary" role="alert" tabIndex={-1} ref={ref}>
      <b>{list.length === 1 ? 'Falta corregir 1 dato:' : `Faltan corregir ${list.length} datos:`}</b>
      <ul>
        {list.map(([id, msg]) => (
          <li key={id}><a href={`#${id}`} onClick={(e) => { e.preventDefault(); document.getElementById(id)?.focus(); }}>{msg}</a></li>
        ))}
      </ul>
    </div>
  );
}

/** Aviso de que el borrador se guarda solo */
export function DraftNote() {
  return <p className="f-draft">Lo que escribes se guarda solo en este equipo. Puedes cerrar y volver después.</p>;
}
