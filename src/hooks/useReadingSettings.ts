import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { PresetId, ReadingSettings } from '../types';
import { DEFAULT_SETTINGS, FONTS, PALETTES, PRESETS } from '../data/readingOptions';

const same = (a: ReadingSettings, b: ReadingSettings) =>
  a.font === b.font && a.size === b.size && a.lh === b.lh && a.pal === b.pal;

/**
 * «Letra y color»: guarda los ajustes y los aplica a toda la noticia como variables CSS (--r-*).
 * «Restablecer» se puede deshacer durante 10 segundos.
 */
export function useReadingSettings() {
  const [settings, setSettings] = useState<ReadingSettings>(DEFAULT_SETTINGS);
  const [undoState, setUndoState] = useState<ReadingSettings | null>(null);
  const undoTimer = useRef<number | undefined>(undefined);

  // Aplica los ajustes a las variables de lectura
  useEffect(() => {
    const [bg, ink, muted, line] = PALETTES[settings.pal].colors;
    const font = FONTS[settings.font];
    const r = document.documentElement.style;
    r.setProperty('--r-font', font.family);
    r.setProperty('--r-size', `${settings.size}px`);
    r.setProperty('--r-lh', String(settings.lh));
    r.setProperty('--r-bg', bg);
    r.setProperty('--r-ink', ink);
    r.setProperty('--r-muted', muted);
    r.setProperty('--r-line', line);
    r.setProperty('--r-ls', font.spaced ? '.06em' : 'normal');
    r.setProperty('--r-ws', font.spaced ? '.12em' : 'normal');
  }, [settings]);

  useEffect(() => () => window.clearTimeout(undoTimer.current), []);

  const update = useCallback((patch: Partial<ReadingSettings>) => setSettings((s) => ({ ...s, ...patch })), []);
  const applyPreset = useCallback((id: PresetId) => setSettings({ ...PRESETS[id].settings }), []);

  const activePreset = useMemo(
    () => (Object.keys(PRESETS) as PresetId[]).find((id) => same(PRESETS[id].settings, settings)) ?? null,
    [settings],
  );
  const isChanged = !same(settings, DEFAULT_SETTINGS);

  const reset = useCallback(() => {
    setUndoState(settings);
    setSettings(DEFAULT_SETTINGS);
    window.clearTimeout(undoTimer.current);
    undoTimer.current = window.setTimeout(() => setUndoState(null), 10000);
  }, [settings]);

  const undo = useCallback(() => {
    if (undoState) setSettings(undoState);
    setUndoState(null);
    window.clearTimeout(undoTimer.current);
  }, [undoState]);

  return { settings, update, applyPreset, activePreset, isChanged, reset, undo, canUndo: undoState !== null };
}
