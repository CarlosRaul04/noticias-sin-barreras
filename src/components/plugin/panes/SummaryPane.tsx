import { Fragment, useEffect, useRef, useState } from 'react';
import { scrollBehavior } from '../../../lib/motion';
import { DEFAULT_SUMMARY_VERSION, GLOSSARY, SUMMARY_VERSIONS, getSummaryVersion, type SummaryVersionId } from '../../../data/summary';
import { useStoredState } from '../../../hooks/useStoredState';
import { SegmentedControl } from '../../ui/SegmentedControl';
import { MoreOptions } from '../../ui/MoreOptions';
import { SparkleIcon, SpeakerIcon } from '../../ui/Icons';
import { Pane } from './Pane';

interface Props {
  visible: boolean;
  onClose: () => void;
  onHelp: () => void;
  /** Señala en la noticia la frase que respalda la idea */
  onShowSource: (sentence: number) => void;
  onGoFull: () => void;
  onListen: (text: string) => void;
  /** Abre el Centro de ayuda en «Reportar un error» con esta idea elegida */
  onReportError: (idea: number) => void;
}

/** Quita las marcas [[ ]] para leer la idea en voz alta */
const plain = (text: string) => text.replace(/\[\[(.+?)\]\]/g, '$1');

/** Resumen en 4 ideas, una a la vez. Cada idea enlaza con la frase de la noticia que la respalda. */
export function SummaryPane({ visible, onClose, onHelp, onShowSource, onGoFull, onListen, onReportError }: Props) {
  const [k, setK] = useState(0);
  const [term, setTerm] = useState<string | null>(null);
  // La versión elegida se recuerda (y el formulario de «Reportar un error» la usa)
  const [versionId, setVersionId] = useStoredState<SummaryVersionId>('version-resumen', DEFAULT_SUMMARY_VERSION);
  const version = getSummaryVersion(versionId);
  const ideas = version.ideas;
  const total = ideas.length;
  const idea = ideas[Math.min(k, total - 1)];
  const [changed, setChanged] = useState(false);

  // Al cambiar de versión se vuelve a la primera idea y se marca el cambio un momento
  const chooseVersion = (id: SummaryVersionId) => {
    if (id === versionId) return;
    setVersionId(id);
    setK(0);
    setChanged(true);
  };
  const ideaRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!changed) return;
    // Lleva la idea nueva a la vista (en el celular el selector queda más abajo)
    const r = window.requestAnimationFrame(() => ideaRef.current?.scrollIntoView({ block: 'center', behavior: scrollBehavior() }));
    const t = window.setTimeout(() => setChanged(false), 1600);
    return () => { window.cancelAnimationFrame(r); window.clearTimeout(t); };
  }, [changed]);

  // Al cambiar de idea se cierra la explicación abierta
  useEffect(() => setTerm(null), [k]);

  // Esc cierra primero la explicación del término (antes que el panel)
  useEffect(() => {
    if (!term) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.stopImmediatePropagation(); setTerm(null); }
    };
    document.addEventListener('keydown', onKey, true);
    return () => document.removeEventListener('keydown', onKey, true);
  }, [term]);

  const parts = idea.text.split(/\[\[(.+?)\]\]/g); // impares = términos
  const entry = term ? GLOSSARY[term] : null;

  return (
    <Pane id="resumen" visible={visible} onClose={onClose} onHelp={onHelp}>
      <div className="stepper">
        <span>Idea {k + 1} de {total} <span className="ver-chip">· {version.label}</span></span>
        <div className="dots" aria-hidden="true">
          {ideas.map((_, n) => <i key={n} className={n === k ? 'on' : ''} />)}
        </div>
      </div>

      <article className={`idea${changed ? ' idea--changed' : ''}`} aria-live="polite" key={version.id} ref={ideaRef}>
        <h3>{idea.title}</h3>
        <p>
          {parts.map((part, n) => n % 2 === 1 ? (
            <button key={n} type="button" className="term" aria-expanded={term === part} aria-label={`${part}: ver qué significa`} onClick={() => setTerm(term === part ? null : part)}>
              {part}<span className="term-ic" aria-hidden="true">?</span>
            </button>
          ) : <Fragment key={n}>{part}</Fragment>)}
        </p>
        {entry && (
          <div className="pop" role="note">
            <b>{entry.term}</b>{entry.definition}
            <div className="pop-actions">
              <button className="btn quiet" type="button" onClick={() => onListen(`${entry.term}. ${entry.definition}`)}>Escuchar definición</button>
            </div>
          </div>
        )}
        <div className="idea-actions">
          <button className="src" type="button" onClick={() => onShowSource(idea.source)}>Ver dónde lo dice</button>
          <button className="idea-listen" type="button" onClick={() => { onListen(`${idea.title}. ${plain(idea.text)}`); onShowSource(idea.source); }}>
            <SpeakerIcon size={18} waves={1} />Escuchar
          </button>
        </div>
      </article>

      <div className="row idea-nav">
        <button className="btn" type="button" disabled={k === 0} onClick={() => setK(k - 1)}>‹ Anterior</button>
        <button className="btn primary" type="button" onClick={() => setK((k + 1) % total)}>
          {k === total - 1 ? 'Volver a la primera' : 'Siguiente ›'}
        </button>
      </div>

      <p className="ai-note">
        <SparkleIcon size={16} />
        <span>Hecho con IA: puede equivocarse.{' '}
          <button type="button" className="ai-report" onClick={() => onReportError(k)}>Reportar un error</button></span>
      </p>

      <MoreOptions summary="Más opciones">
        <div className="more-body">
          <div className="fld"><b>Versión del resumen</b>
            <SegmentedControl<SummaryVersionId>
              label="Versión del resumen"
              options={SUMMARY_VERSIONS.map((v) => ({ value: v.id, label: v.label }))}
              value={version.id}
              onChange={chooseVersion}
            />
            <p className="ver-hint" aria-live="polite">{changed ? `Listo: ahora ves la versión «${version.label}». ` : ''}{version.hint}</p>
          </div>
          <button className="btn" type="button" onClick={onGoFull}>Leer la noticia completa</button>
        </div>
      </MoreOptions>
    </Pane>
  );
}
