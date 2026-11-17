import { Fragment, useEffect, useState } from 'react';
import { GLOSSARY, SUMMARY_IDEAS, SUMMARY_VARIANTS } from '../../../data/summary';
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
  const [variant, setVariant] = useState(SUMMARY_VARIANTS[0]);
  const idea = SUMMARY_IDEAS[k];
  const total = SUMMARY_IDEAS.length;

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
        <span>Idea {k + 1} de {total}</span>
        <div className="dots" aria-hidden="true">
          {SUMMARY_IDEAS.map((_, n) => <i key={n} className={n === k ? 'on' : ''} />)}
        </div>
      </div>

      <div className="idea" aria-live="polite">
        <h3>{idea.title}</h3>
        <p>
          {parts.map((part, n) => n % 2 === 1 ? (
            <button key={n} type="button" className="term" aria-expanded={term === part} aria-label={`${part}: ver qué significa`} onClick={() => setTerm(term === part ? null : part)}>
              {part}<span className="term-ic" aria-hidden="true">?</span>
            </button>
          ) : <Fragment key={n}>{part}</Fragment>)}
        </p>
        <button className="src" type="button" onClick={() => onShowSource(idea.source)}>Ver dónde lo dice la noticia</button>
        {entry && (
          <div className="pop" role="note">
            <b>{entry.term}</b>{entry.definition}
            <div className="pop-actions">
              <button className="btn quiet" type="button" onClick={() => onListen(`${entry.term}. ${entry.definition}`)}>Escuchar definición</button>
            </div>
          </div>
        )}
      </div>

      <p className="ai-note">
        <SparkleIcon size={16} />
        <span>Resumen hecho con IA a partir de esta nota. Puede equivocarse: revisa dónde lo dice la noticia.{' '}
          <button type="button" className="ai-report" onClick={() => onReportError(k)}>Reportar un error en esta idea</button></span>
      </p>

      <div className="row">
        <button className="btn" type="button" disabled={k === 0} onClick={() => setK(k - 1)}>‹ Anterior</button>
        <button className="btn primary" type="button" onClick={() => setK((k + 1) % total)}>
          {k === total - 1 ? 'Volver a la primera' : 'Siguiente ›'}
        </button>
      </div>
      <div className="row">
        <button className="btn" type="button" onClick={() => { onListen(`${idea.title}. ${plain(idea.text)}`); onShowSource(idea.source); }}>
          <SpeakerIcon size={20} waves={1} />Escuchar idea
        </button>
        <button className="btn" type="button" onClick={onGoFull}>Ver la noticia</button>
      </div>
      <MoreOptions summary="Cambiar versión del resumen">
        <SegmentedControl
          label="Versión del resumen"
          options={SUMMARY_VARIANTS.map((v) => ({ value: v, label: v }))}
          value={variant}
          onChange={setVariant}
        />
      </MoreOptions>
    </Pane>
  );
}
