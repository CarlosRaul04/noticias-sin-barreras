/**
 * ¿La persona pidió menos movimiento? Se respeta la preferencia «Reducir movimiento»
 * de su sistema (Windows, macOS, Android o iOS).
 */
export const prefersLessMotion = () => {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch { return false; }
};

/** Desplazamiento suave solo si el sistema no pide reducir el movimiento */
export const scrollBehavior = (): ScrollBehavior => (prefersLessMotion() ? 'auto' : 'smooth');
