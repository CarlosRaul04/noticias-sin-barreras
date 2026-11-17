import { useEffect, useRef } from 'react';
import type { HelpTarget, HelpSection } from '../../data/help/types';
import { Mascot } from '../tour/Mascot';
import { ArrowLeftIcon, CloseIcon } from '../ui/Icons';
import { SECTIONS } from './sections';
import { HelpHome } from './HelpHome';
import { KnowledgeBase } from './KnowledgeBase';
import { VideoLibrary } from './VideoLibrary';
import { FaqList } from './FaqList';
import { Community } from './Community';
import { ContactHub } from './ContactHub';

export interface HelpView { section: HelpSection; id?: string; idea?: number; }

interface Props {
  view: HelpView | null;
  onNavigate: (v: HelpView) => void;
  onClose: () => void;
  /** Destinos fuera del centro: abrir una herramienta o la guía paso a paso */
  onExternal: (t: HelpTarget) => void;
}

/**
 * Centro de ayuda: un solo lugar para guías, videos, preguntas, comunidad y contacto.
 * Se abre desde el «?» de cada panel y desde el final de la noticia.
 * Ancho: menú a la izquierda · Angosto: pantalla completa con botón «Volver».
 */
export function HelpCenter({ view, onNavigate, onClose, onExternal }: Props) {
  const ref = useRef<HTMLElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const open = !!view;

  const go = (t: HelpTarget) => {
    if ('section' in t) onNavigate({ section: t.section, id: t.id });
    else onExternal(t);
  };
  const back = () => {
    if (!view) return;
    if (view.id) onNavigate({ section: view.section });
    else if (view.section !== 'inicio') onNavigate({ section: 'inicio' });
    else onClose();
  };

  // Guardar y devolver el foco
  useEffect(() => {
    if (open) lastFocus.current = document.activeElement as HTMLElement;
    else lastFocus.current?.focus?.();
  }, [open]);

  // Al cambiar de vista, el foco va al título (o al diálogo) y el contenido vuelve arriba
  useEffect(() => {
    if (!view) return;
    const t = window.setTimeout(() => {
      const root = ref.current;
      root?.querySelector('.hc-main')?.scrollTo({ top: 0 });
      const h = root?.querySelector<HTMLElement>('.hc-main [data-hc-focus]');
      (h ?? root)?.focus({ preventScroll: true });
    }, 30);
    return () => window.clearTimeout(t);
  }, [view?.section, view?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Esc: primero vuelve atrás, luego cierra. Tab queda dentro del diálogo.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopImmediatePropagation(); e.preventDefault();
        if (view?.id) back(); else onClose();
      }
      if (e.key === 'Tab' && ref.current) {
        const els = [...ref.current.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input,select,textarea,video,[tabindex]:not([tabindex="-1"])')].filter((x) => x.offsetParent !== null);
        if (!els.length) return;
        const first = els[0], last = els[els.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKey, true);
    return () => document.removeEventListener('keydown', onKey, true);
  });

  if (!view) return null;
  const sec = SECTIONS.find((s) => s.id === view.section)!;

  let body;
  switch (view.section) {
    case 'guias': body = <KnowledgeBase id={view.id} go={go} />; break;
    case 'videos': body = <VideoLibrary id={view.id} go={go} />; break;
    case 'preguntas': body = <FaqList id={view.id} go={go} />; break;
    case 'comunidad': body = <Community id={view.id} go={go} />; break;
    case 'contacto': body = <ContactHub id={view.id} idea={view.idea} go={go} />; break;
    default: body = <HelpHome go={go} />;
  }

  return (
    <>
      <div className="hc-scrim" onClick={onClose} aria-hidden="true" />
      <section ref={ref} className="hc" role="dialog" aria-modal="true" aria-labelledby="hc-title" tabIndex={-1} data-section={view.section} data-sub={view.id ? '' : undefined}>
        <header className="hc-top">
          {view.section !== 'inicio' && (
            <button type="button" className="hc-top-back" onClick={back} aria-label={view.id ? `Volver a ${sec.label}` : 'Volver al inicio de la ayuda'}>
              <ArrowLeftIcon />
            </button>
          )}
          <Mascot className="hc-top-notin" />
          <div className="hc-top-t">
            <h2 id="hc-title">Centro de ayuda</h2>
            <p>{view.section === 'inicio' ? 'Guías, videos, preguntas y contacto' : sec.label}</p>
          </div>
          <button type="button" className="xbtn hc-close" onClick={onClose} aria-label="Cerrar el Centro de ayuda"><CloseIcon /></button>
        </header>
        <div className="hc-body">
          <nav className="hc-nav" aria-label="Secciones de ayuda">
            <ul>
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <button type="button" aria-current={s.id === view.section ? 'page' : undefined} onClick={() => onNavigate({ section: s.id })}>
                    <span aria-hidden="true">{s.icon}</span>{s.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          <div className="hc-main">{body}</div>
        </div>
      </section>
    </>
  );
}
