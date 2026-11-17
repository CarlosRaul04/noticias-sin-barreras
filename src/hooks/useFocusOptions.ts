import { useCallback, useState } from 'react';
import type { FocusOptionId, FocusState } from '../types';

const INITIAL: FocusState = { 'hide-ads': false, 'hide-video': false, 'hide-links': false, 'hide-img': false, 'on-ruler': false };

/**
 * «Leer sin distracciones»: cada interruptor es una clase CSS.
 * Las clases se aplican al contenedor de la app.
 */
export function useFocusOptions() {
  const [focus, setFocus] = useState<FocusState>(INITIAL);

  const toggle = useCallback((id: FocusOptionId) => setFocus((f) => ({ ...f, [id]: !f[id] })), []);

  const activeCount = Object.values(focus).filter(Boolean).length;
  const classes: string[] = (Object.keys(focus) as FocusOptionId[]).filter((id) => focus[id]);
  // Si se quitó todo lo de la columna lateral, la noticia se centra
  if (focus['hide-ads'] && focus['hide-video'] && focus['hide-links']) classes.push('rail-empty');
  const appClasses = classes.join(' ');

  return { focus, toggle, activeCount, appClasses };
}
