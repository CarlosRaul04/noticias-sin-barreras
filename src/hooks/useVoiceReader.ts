import { useCallback, useEffect, useRef, useState } from 'react';
import { VOICE_SPEEDS } from '../data/readingOptions';

/** Milisegundos por frase cuando el navegador no tiene voz (simulación de la versión 3.0) */
const SIMULATED_MS = 3200;

const spanishVoice = () => {
  try {
    const voices = window.speechSynthesis.getVoices();
    return voices.find((v) => v.lang.toLowerCase().startsWith('es-pe'))
      ?? voices.find((v) => v.lang.toLowerCase().startsWith('es'))
      ?? null;
  } catch { return null; }
};
const canSpeak = () => {
  try { return 'speechSynthesis' in window && window.speechSynthesis.getVoices().length > 0; } catch { return false; }
};

/** Lee un texto suelto (definición de un término, una idea del resumen). Devuelve false si no hay voz. */
/**
 * Voz corta («Escuchar» una idea o una definición) que se puede detener.
 * speakingId dice qué se está leyendo, para que ese botón cambie a «Detener».
 */
export function useSpeakOnce() {
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const current = useRef<SpeechSynthesisUtterance | null>(null);

  const stop = useCallback(() => {
    const u = current.current;
    if (u) { u.onend = null; u.onerror = null; current.current = null; }
    try { if (canSpeak()) window.speechSynthesis.cancel(); } catch { /* sin voz */ }
    setSpeakingId(null);
  }, []);

  const speak = useCallback((id: string, text: string, rate = 1): boolean => {
    if (!canSpeak()) return false;
    stop();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'es-PE';
    u.rate = rate;
    const v = spanishVoice();
    if (v) u.voice = v;
    const done = () => { if (current.current === u) { current.current = null; setSpeakingId(null); } };
    u.onend = done;
    u.onerror = done;
    current.current = u;
    window.speechSynthesis.speak(u);
    setSpeakingId(id);
    return true;
  }, [stop]);

  // Al salir de la página no sigue hablando
  useEffect(() => stop, [stop]);

  return { speakingId, speak, stop };
}

/**
 * «Escuchar la nota»: lee las frases una por una y avisa cuál suena para resaltarla.
 * Usa la voz del navegador cuando existe; si no, simula el avance como en la versión 3.0.
 */
export function useVoiceReader(sentences: string[]) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speedIndex, setSpeedIndex] = useState(1);
  const utterance = useRef<SpeechSynthesisUtterance | null>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!playing) return;
    const speed = VOICE_SPEEDS[speedIndex];
    const last = sentences.length - 1;
    const advance = () => {
      if (index < last) setIndex(index + 1);
      else { setPlaying(false); setIndex(0); }
    };
    const simulate = () => { timer.current = window.setTimeout(advance, SIMULATED_MS * speed.delay); };

    if (canSpeak()) {
      const u = new SpeechSynthesisUtterance(sentences[index]);
      u.lang = 'es-PE';
      u.rate = speed.rate;
      const v = spanishVoice();
      if (v) u.voice = v;
      u.onend = advance;
      u.onerror = simulate;
      utterance.current = u;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    } else {
      simulate();
    }

    return () => {
      window.clearTimeout(timer.current);
      if (utterance.current) {
        utterance.current.onend = null;
        utterance.current.onerror = null;
        utterance.current = null;
        try { window.speechSynthesis.cancel(); } catch { /* sin voz */ }
      }
    };
  }, [playing, index, speedIndex, sentences]);

  const togglePlay = useCallback(() => setPlaying((p) => !p), []);
  const prev = useCallback(() => setIndex((i) => Math.max(0, i - 1)), []);
  const next = useCallback(() => setIndex((i) => Math.min(sentences.length - 1, i + 1)), [sentences.length]);
  const playFrom = useCallback((i: number) => { setIndex(i); setPlaying(true); }, []);
  const stop = useCallback(() => setPlaying(false), []);

  const progress = ((index + (playing ? 1 : 0)) / sentences.length) * 100;

  return { index, playing, progress, speedIndex, setSpeedIndex, togglePlay, prev, next, playFrom, stop };
}
