import { useCallback, useEffect, useRef, useState } from 'react';
import type { ToolId } from './types';
import { ARTICLE } from './data/article';
import { TOUR_STEPS, type TourStep } from './data/tourSteps';
import { useReadingSettings } from './hooks/useReadingSettings';
import { useFocusOptions } from './hooks/useFocusOptions';
import { speakOnce, useVoiceReader } from './hooks/useVoiceReader';
import { useGuidedTour } from './hooks/useGuidedTour';
import { useAnnouncer } from './hooks/useAnnouncer';
import { SiteHeader } from './components/site/SiteHeader';
import { Ad } from './components/site/Ad';
import { Sidebar } from './components/site/Sidebar';
import { SiteFooter } from './components/site/SiteFooter';
import { AnchorAd } from './components/site/AnchorAd';
import { NewsArticle } from './components/site/NewsArticle';
import { ReadingBar } from './components/plugin/ReadingBar';
import { FloatingButton } from './components/plugin/FloatingButton';
import { ToolSheet } from './components/plugin/ToolSheet';
import { CoachMark } from './components/plugin/CoachMark';
import { UndoToast } from './components/plugin/UndoToast';
import { SummaryPane } from './components/plugin/panes/SummaryPane';
import { FocusPane } from './components/plugin/panes/FocusPane';
import { TextStylePane } from './components/plugin/panes/TextStylePane';
import { VoicePane } from './components/plugin/panes/VoicePane';
import { GuidedTour } from './components/tour/GuidedTour';
import { HelpCenter, type HelpView } from './components/help/HelpCenter';
import type { HelpTarget } from './data/help/types';

/**
 * Noticias sin barreras 3.1
 * Una noticia a pantalla completa y una barra de lectura anclada al pulgar.
 * Móvil: barra fija abajo y hoja inferior · Tablet: barra y hoja flotantes ·
 * Escritorio: botón «Lectura fácil» y panel a la derecha (ver styles/plugin.css).
 */
export default function App() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLElement>(null);

  const [current, setCurrent] = useState<ToolId | null>(null);
  const [coachVisible, setCoachVisible] = useState(true);
  const [flashIndex, setFlashIndex] = useState<number | null>(null);
  const [sourceMode, setSourceMode] = useState(false);
  const [tourBar, setTourBar] = useState(false);
  const [anchorOpen, setAnchorOpen] = useState(true);
  const [helpView, setHelpView] = useState<HelpView | null>(null);

  const reading = useReadingSettings();
  const focus = useFocusOptions();
  const voice = useVoiceReader(ARTICLE.sentences);
  const tour = useGuidedTour();
  const { message, announce } = useAnnouncer();

  // ---------- abrir y cerrar herramientas ----------
  const openTool = useCallback((id: ToolId) => {
    setCurrent(id);
    setCoachVisible(false);
  }, []);

  const closeSheet = useCallback((returnFocus = false) => {
    setCurrent((t) => {
      if (returnFocus && t) window.setTimeout(() => document.querySelector<HTMLElement>(`.tab[data-tab="${t}"]`)?.focus(), 0);
      return null;
    });
    setSourceMode(false);
  }, []);

  const selectTool = (id: ToolId) => (current === id ? closeSheet() : openTool(id));

  // Esc cierra el panel y devuelve el foco a su pestaña
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && current) closeSheet(true); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [current, closeSheet]);

  // Deja espacio bajo la noticia para poder subir cualquier frase por encima de la hoja
  useEffect(() => {
    const scroller = scrollerRef.current;
    const sheet = sheetRef.current;
    if (!scroller || !sheet) return;
    const pad = () => {
      const bar = document.getElementById('bar');
      scroller.style.paddingBottom = current ? `${sheet.offsetHeight + (bar?.offsetHeight ?? 0) + 28}px` : '';
    };
    pad();
    const ro = new ResizeObserver(pad);
    ro.observe(sheet);
    window.addEventListener('resize', pad);
    return () => { ro.disconnect(); window.removeEventListener('resize', pad); };
  }, [current]);

  // ---------- llevar una frase a la vista (tercio superior, no detrás de la hoja) ----------
  const revealSentence = useCallback((i: number) => {
    const scroller = scrollerRef.current;
    const app = appRef.current;
    const el = scroller?.querySelector<HTMLElement>(`.s[data-i="${i}"]`);
    if (!scroller || !app || !el) return;
    const fr = app.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    scroller.scrollTo({ top: scroller.scrollTop + (r.top - fr.top) - fr.height * 0.2, behavior: 'smooth' });
  }, []);

  // «Ver dónde lo dice la noticia»: aclara el fondo y marca la frase unos segundos
  const flashTimers = useRef<number[]>([]);
  const showSource = useCallback((i: number) => {
    revealSentence(i);
    flashTimers.current.forEach(window.clearTimeout);
    setSourceMode(true);
    setFlashIndex(i);
    flashTimers.current = [
      window.setTimeout(() => setFlashIndex(null), 2600),
      window.setTimeout(() => setSourceMode(false), 2800),
    ];
  }, [revealSentence]);
  useEffect(() => () => flashTimers.current.forEach(window.clearTimeout), []);

  // La página sigue a la voz
  useEffect(() => {
    if (voice.playing) revealSentence(voice.index);
  }, [voice.playing, voice.index, revealSentence]);

  const goFull = () => {
    closeSheet(true);
    scrollerRef.current?.scrollTo({ top: 0 });
  };

  const listen = (text: string) => {
    if (!speakOnce(text)) announce('Este navegador no tiene voz disponible.');
  };

  // ---------- guía ----------
  const startTour = useCallback(() => {
    closeSheet();
    tour.start();
  }, [closeSheet, tour]);
  const onTourStep = useCallback((s: TourStep | null) => setTourBar(!!s?.showBar), []);
  const onTourClose = useCallback((completed: boolean) => {
    tour.finish();
    setTourBar(false);
    // Si la terminó, ya no hace falta el aviso inicial
    if (completed) setCoachVisible(false);
    announce(completed ? 'Guía terminada. Ya puedes usar Lectura fácil.' : 'Guía cerrada. Puedes volver a verla con «Ver la guía».');
  }, [tour, announce]);

  // ---------- centro de ayuda ----------
  // Se abre sobre la noticia; el panel abierto se cierra para no apilar capas.
  const openHelp = useCallback((v: HelpView = { section: 'inicio' }) => {
    closeSheet();
    setCoachVisible(false);
    setHelpView(v);
  }, [closeSheet]);
  const onHelpExternal = useCallback((t: HelpTarget) => {
    setHelpView(null);
    if ('tool' in t) window.setTimeout(() => openTool(t.tool), 0);
    else if ('tour' in t) window.setTimeout(() => tour.start(), 0);
  }, [openTool, tour]);
  const helpFromPane = useCallback(() => openHelp(), [openHelp]);

  // ---------- reset con deshacer ----------
  const resetText = () => {
    reading.reset();
    announce('Se restableció la letra y el color. Puedes deshacerlo durante 10 segundos.');
  };

  const anchorVisible = anchorOpen && !focus.focus['hide-ads'];
  const appClass = ['app', focus.appClasses, anchorVisible ? 'has-anchor' : ''].filter(Boolean).join(' ');

  return (
    <div
      ref={appRef}
      className={appClass}
      data-open={current ? '' : undefined}
      data-src={sourceMode ? '' : undefined}
      data-tour-bar={tourBar ? '' : undefined}
      data-help={helpView ? '' : undefined}
    >
      <div className="scroller" id="scroller" ref={scrollerRef}>
        <SiteHeader />
        <Ad id="billboard" />
        <div className="page">
          <NewsArticle
            readingIndex={voice.playing ? voice.index : null}
            flashIndex={flashIndex}
            rulerOn={focus.focus['on-ruler']}
            onSentenceClick={(i) => { if (current === 'voz') voice.playFrom(i); }}
            onOpenGuide={startTour}
            onOpenHelp={(sec) => openHelp(sec ? { section: 'contacto', id: sec } : undefined)}
          />
          <Sidebar />
        </div>
        <SiteFooter />
      </div>

      {anchorVisible && <AnchorAd onClose={() => setAnchorOpen(false)} />}

      {coachVisible && !tour.open && <CoachMark onClose={() => setCoachVisible(false)} />}

      <ToolSheet ref={sheetRef} onClose={() => closeSheet(true)}>
        <SummaryPane
          visible={current === 'resumen'}
          onClose={() => closeSheet(true)}
          onHelp={helpFromPane}
          onShowSource={showSource}
          onGoFull={goFull}
          onListen={listen}
          onReportError={(idea) => openHelp({ section: 'contacto', id: 'error-resumen', idea })}
        />
        <FocusPane
          visible={current === 'foco'}
          focus={focus.focus}
          activeCount={focus.activeCount}
          onToggle={focus.toggle}
          onClose={() => closeSheet(true)}
          onHelp={helpFromPane}
        />
        <TextStylePane
          visible={current === 'letra'}
          settings={reading.settings}
          activePreset={reading.activePreset}
          onUpdate={reading.update}
          onPreset={reading.applyPreset}
          onReset={resetText}
          onClose={() => closeSheet(true)}
          onHelp={helpFromPane}
        />
        <VoicePane
          visible={current === 'voz'}
          index={voice.index}
          total={ARTICLE.sentences.length}
          playing={voice.playing}
          progress={voice.progress}
          speedIndex={voice.speedIndex}
          onTogglePlay={voice.togglePlay}
          onPrev={voice.prev}
          onNext={voice.next}
          onSpeed={voice.setSpeedIndex}
          onClose={() => closeSheet(true)}
          onHelp={helpFromPane}
        />
      </ToolSheet>

      <FloatingButton onClick={() => openTool('resumen')} />
      <ReadingBar
        current={current}
        active={{ foco: focus.activeCount > 0, letra: reading.isChanged, voz: voice.playing }}
        onSelect={selectTool}
      />

      {reading.canUndo && <UndoToast message="Se restableció la letra y el color" onUndo={reading.undo} />}

      <HelpCenter view={tour.open ? null : helpView} onNavigate={setHelpView} onClose={() => setHelpView(null)} onExternal={onHelpExternal} />

      <GuidedTour open={tour.open} steps={TOUR_STEPS} onStepShown={onTourStep} onClose={onTourClose} />

      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">{message}</div>
    </div>
  );
}
