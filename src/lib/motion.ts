/**
 * ¿La persona pidió menos movimiento? Sí, si activó «Reducir animaciones» en el plugin
 * o si su sistema tiene activada la preferencia de reducir movimiento.
 */
export const prefersLessMotion = () => {
  try {
    return document.documentElement.classList.contains('reduce') || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch { return false; }
};

/** Desplazamiento suave solo si no se pidió reducir el movimiento */
export const scrollBehavior = (): ScrollBehavior => (prefersLessMotion() ? 'auto' : 'smooth');
