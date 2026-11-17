import { useCallback, useEffect, useState } from 'react';

const PREFIX = 'nsb-';

const read = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch { return fallback; }
};

/**
 * Estado que se guarda en este navegador (borradores de formularios, casos enviados).
 * Si el navegador no permite guardar, funciona igual, solo que no recuerda.
 * Sirve para que nadie pierda lo que escribió si se distrae o cierra el panel.
 */
export function useStoredState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => read(key, initial));
  useEffect(() => {
    try { localStorage.setItem(PREFIX + key, JSON.stringify(value)); } catch { /* sin almacenamiento */ }
  }, [key, value]);
  const reset = useCallback(() => {
    try { localStorage.removeItem(PREFIX + key); } catch { /* nada */ }
    setValue(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return [value, setValue, reset] as const;
}

/** Número de caso legible, p. ej. NSB-2026-48213 */
export const newCaseNumber = (prefix = 'NSB') => `${prefix}-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 89999)}`;

export const todayLabel = () =>
  new Date().toLocaleString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
