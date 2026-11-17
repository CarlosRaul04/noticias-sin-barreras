import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { prefersLessMotion } from '../../lib/motion';
import type { TourStep } from '../../data/tourSteps';
import { CheckIcon, ChevronLeftIcon, ChevronRightIcon, CloseIcon } from '../ui/Icons';
import { Mascot } from './Mascot';

/**
 * Guía de primer uso con foco.
 * Pensada para TDAH, dislexia y autismo nivel 1:
 * - Solo el bloque señalado queda nítido; todo lo demás se difumina y oscurece.
 * - Un mensaje corto por paso y progreso visible («Paso 2 de 6»).
 * - Anterior / Siguiente / Saltar siempre en el mismo lugar.
 * - Notín saluda solo 3 veces; sin animaciones si se pidió reducir movimiento.
 * - Teclado: ← → para moverse, Esc para salir; el foco queda dentro de la tarjeta.
 */

interface Props {
  open: boolean;
  steps: TourStep[];
  /** Avisa qué paso se muestra (para que la app muestre la barra si hace falta) */
  onStepShown: (step: TourStep | null) => void;
  /** completed = llegó al final; false = la saltó o la cerró */
  onClose: (completed: boolean) => void;
}

type Hole = { top: number; left: number; right: number; bottom: number; r: number };
const PAD = 8;
const GAP = 16;

const reducedMotion = prefersLessMotion;

/** ¿El bloque se ve en esta pantalla? (el botón flotante, por ejemplo, solo existe en escritorio) */
const isVisible = (el: Element | null): el is HTMLElement => {
  if (!el) return false;
  const r = el.getBoundingClientRect();
  const cs = getComputedStyle(el);
  return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none';
};

/** Recorte del velo: toda la pantalla menos un rectángulo redondeado */
const holePath = (h: Hole, w: number, H: number) => {
  const { top: t, left: l, right: rr, bottom: b, r } = h;
  return `path(evenodd, 'M0 0 H${w} V${H} H0 Z M${l + r} ${t} H${rr - r} A${r} ${r} 0 0 1 ${rr} ${t + r} V${b - r} A${r} ${r} 0 0 1 ${rr - r} ${b} H${l + r} A${r} ${r} 0 0 1 ${l} ${b - r} V${t + r} A${r} ${r} 0 0 1 ${l + r} ${t} Z')`;
};

export function GuidedTour({ open, steps, onStepShown, onClose }: Props) {
  const [active, setActive] = useState<TourStep[]>(steps);
  const [index, setIndex] = useState(0);
  const [rect, setRect] = useState<(DOMRect & { radius: number }) | null>(null);
  const [card, setCard] = useState({ w: 360, h: 240 });
  const [vp, setVp] = useState({ w: window.innerWidth, h: window.innerHeight });
  const cardRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  // Al abrir: decide qué pasos aplican en esta pantalla y empieza desde el primero
  useEffect(() => {
    if (!open) return;
    returnFocus.current = document.activeElement as HTMLElement;
    setActive(steps.filter((s) => !s.optional || isVisible(document.querySelector(s.target!))));
    setIndex(0);
  }, [open, steps]);

  const step = open ? active[index] : undefined;
  useEffect(() => { onStepShown(step ?? null); }, [step, onStepShown]);

  // Sigue la posición del bloque señalado (cambia al abrir la barra, al girar el celular…)
  useEffect(() => {
    if (!open) return;
    let raf = 0;
    let last = '';
    const tick = () => {
      setVp((v) => (v.w !== window.innerWidth || v.h !== window.innerHeight ? { w: window.innerWidth, h: window.innerHeight } : v));
      const el = step?.target ? document.querySelector(step.target) : null;
      if (isVisible(el)) {
        const r = el.getBoundingClientRect();
        const key = `${Math.round(r.top)}|${Math.round(r.left)}|${Math.round(r.width)}|${Math.round(r.height)}`;
        if (key !== last) {
          last = key;
          setRect(Object.assign(r, { radius: parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0 }));
        }
      } else if (last !== 'none') {
        last = 'none';
        setRect(null);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [open, step]);

  // Mide la tarjeta para que no se salga de la pantalla
  useLayoutEffect(() => {
    if (!open || !cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    if (Math.abs(r.width - card.w) > 1 || Math.abs(r.height - card.h) > 1) setCard({ w: r.width, h: r.height });
  });

  // Foco en el botón principal en cada paso
  useEffect(() => {
    if (open) window.setTimeout(() => nextRef.current?.focus({ preventScroll: true }), 30);
  }, [open, index]);

  const isFirst = index === 0;
  const isLast = index === active.length - 1;
  const numbered = active.filter((s) => s.target);
  const numberedIndex = step?.target ? numbered.indexOf(step) + 1 : 0;

  const close = (completed: boolean) => {
    onClose(completed);
    window.setTimeout(() => {
      const back = returnFocus.current && returnFocus.current !== document.body ? returnFocus.current : document.querySelector<HTMLElement>('.tab, .fab');
      back?.focus?.({ preventScroll: true });
    }, 30);
  };
  const goNext = () => (isLast ? close(true) : setIndex(index + 1));
  const goPrev = () => { if (!isFirst) setIndex(index - 1); };

  // Teclado (en captura: se atiende antes que el Esc del resto del plugin)
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); e.stopImmediatePropagation(); close(false); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); goNext(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); goPrev(); }
      else if (e.key === 'Tab' && cardRef.current) {
        const f = Array.from(cardRef.current.querySelectorAll<HTMLElement>('button'));
        if (!f.length) return;
        const first = f[0], lastBtn = f[f.length - 1];
        if (!cardRef.current.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
        else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); lastBtn.focus(); }
        else if (!e.shiftKey && document.activeElement === lastBtn) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKey, true);
    return () => document.removeEventListener('keydown', onKey, true);
  });

  if (!open || !step) return null;

  // ---- hueco del foco ----
  const hole: Hole | null = rect ? {
    top: Math.max(0, rect.top - PAD),
    left: Math.max(0, rect.left - PAD),
    right: Math.min(vp.w, rect.right + PAD),
    bottom: Math.min(vp.h, rect.bottom + PAD),
    r: Math.min(rect.radius + PAD, (rect.height + 2 * PAD) / 2, (rect.width + 2 * PAD) / 2),
  } : null;

  // ---- posición de la tarjeta: al lado, arriba o abajo del bloque, sin taparlo ----
  const centered = !step.target;
  const cw = Math.min(centered ? 420 : 360, vp.w - 24);
  const ch = card.h;
  let pos: { top: number; left: number };
  let arrow: 'left' | 'right' | 'top' | 'bottom' | null = null;
  if (!hole) {
    pos = { top: Math.max(12, (vp.h - ch) / 2), left: Math.max(12, (vp.w - cw) / 2) };
  } else {
    const clampTop = (t: number) => Math.min(Math.max(12, t), vp.h - ch - 12);
    const clampLeft = (l: number) => Math.min(Math.max(12, l), vp.w - cw - 12);
    const midY = (hole.top + hole.bottom) / 2;
    const midX = (hole.left + hole.right) / 2;
    const wide = vp.w >= 700;
    if (wide && hole.left - GAP - cw >= 12) { pos = { top: clampTop(midY - ch / 2), left: hole.left - GAP - cw }; arrow = 'right'; }
    else if (wide && vp.w - hole.right - GAP - cw >= 12) { pos = { top: clampTop(midY - ch / 2), left: hole.right + GAP }; arrow = 'left'; }
    else if (hole.top - GAP - ch >= 12) { pos = { top: hole.top - GAP - ch, left: clampLeft(midX - cw / 2) }; arrow = 'bottom'; }
    else if (vp.h - hole.bottom - GAP - ch >= 12) { pos = { top: hole.bottom + GAP, left: clampLeft(midX - cw / 2) }; arrow = 'top'; }
    else pos = { top: 12, left: clampLeft(midX - cw / 2) };
  }
  const arrowStyle: CSSProperties = {};
  if (hole && arrow) {
    if (arrow === 'left' || arrow === 'right') arrowStyle.top = Math.min(Math.max(20, (hole.top + hole.bottom) / 2 - pos.top - 9), ch - 38);
    else arrowStyle.left = Math.min(Math.max(20, (hole.left + hole.right) / 2 - pos.left - 9), cw - 38);
  }

  return (
    <div className="tour">
      {hole ? (
        <>
          <div className="tour-veil" style={{ inset: 0, clipPath: holePath(hole, vp.w, vp.h) }} />
          <div className="tour-ring" style={{ top: hole.top, left: hole.left, width: hole.right - hole.left, height: hole.bottom - hole.top, borderRadius: hole.r }} />
        </>
      ) : (
        <div className="tour-veil" style={{ inset: 0 }} />
      )}

      <div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="tour-title"
        aria-describedby="tour-body"
        className={`tour-card${centered ? ' tour-card--center' : ''}`}
        style={{ top: pos.top, left: pos.left, width: cw, transition: reducedMotion() ? 'none' : undefined }}
      >
        {arrow && <span className={`tour-arrow tour-arrow--${arrow}`} style={arrowStyle} aria-hidden="true" />}
        <button type="button" className="tour-close" onClick={() => close(false)} aria-label="Salir de la guía (Esc)"><CloseIcon size={20} /></button>

        {centered ? (
          <div className="tour-center">
            {isFirst && <div className="tour-bubble" aria-hidden="true">¡Hola!</div>}
            <Mascot waving animateIn={isFirst} cheer={isLast} />
            <h2 id="tour-title" className="tour-title">{step.title}</h2>
            <p id="tour-body" className="tour-body">{step.body}</p>
          </div>
        ) : (
          <div className="tour-head">
            <Mascot />
            <div>
              <p className="tour-step">Paso {numberedIndex} de {numbered.length}</p>
              <h2 id="tour-title" className="tour-title">{step.title}</h2>
              <p id="tour-body" className="tour-body">{step.body}</p>
            </div>
          </div>
        )}

        {step.target && (
          <div className="tour-progress" aria-hidden="true">
            {numbered.map((s, i) => <i key={s.id} className={i < numberedIndex ? 'on' : ''} />)}
          </div>
        )}

        <div className={`tour-actions${isLast ? ' tour-actions--center' : ''}`}>
          {isFirst ? (
            <button type="button" className="btn" onClick={() => close(false)}>Ahora no</button>
          ) : !isLast && (
            <button type="button" className="btn" onClick={goPrev}><ChevronLeftIcon size={18} />Anterior</button>
          )}
          <button ref={nextRef} type="button" className="btn primary" onClick={goNext}>
            {isFirst ? 'Ver la guía' : isLast ? <>Empezar a leer <CheckIcon /></> : <>Siguiente <ChevronRightIcon size={18} /></>}
          </button>
        </div>
        {!isFirst && !isLast && <button type="button" className="tour-skip" onClick={() => close(false)}>Saltar la guía</button>}
      </div>

      <div className="sr-only" role="status" aria-live="polite">
        {step.target ? `Paso ${numberedIndex} de ${numbered.length}. ` : ''}{step.title}. {step.body}
      </div>
    </div>
  );
}
