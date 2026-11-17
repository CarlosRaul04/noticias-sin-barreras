import type { Faq } from './types';

/** Preguntas frecuentes, agrupadas por tema. Respuestas cortas y honestas. */
export const FAQS: Faq[] = [
  { id: 'gratis', category: 'Uso', q: '¿Lectura fácil cuesta algo?', a: 'No. Durante el prototipo es gratis.' },
  { id: 'combinar', category: 'Uso', q: '¿Puedo usar varias herramientas a la vez?', a: 'Sí. Por ejemplo, puedes quitar los anuncios, agrandar la letra y escuchar la nota al mismo tiempo. El punto verde te dice qué está activo.' },
  { id: 'guia', category: 'Uso', q: '¿Cómo vuelvo a ver la guía del inicio?', a: 'En el Centro de ayuda, toca «Ver la guía paso a paso».', link: { label: 'Ver la guía ahora', target: { tour: true } } },
  { id: 'ia-error', category: 'Resumen e IA', q: '¿El resumen puede equivocarse?', a: 'Sí. Lo hace una inteligencia artificial y a veces se equivoca. Por eso cada idea tiene «Ver dónde lo dice la noticia», para que compruebes de dónde sale.', link: { label: 'Cómo revisar el resumen', target: { section: 'guias', id: 'verificar' } } },
  { id: 'ia-reportar', category: 'Resumen e IA', q: 'Encontré un error en el resumen. ¿Qué hago?', a: 'Toca «Reportar un error en esta idea» en el resumen. Lo revisamos y corregimos en un plazo máximo de 24 horas.', link: { label: 'Reportar un error', target: { section: 'contacto', id: 'error-resumen' } } },
  { id: 'diagnostico', category: 'Privacidad', q: '¿Tengo que decir que tengo TDAH, dislexia o autismo?', a: 'No. Nunca te lo preguntamos. Las herramientas sirven para cualquier persona que quiera leer más cómodo.' },
  { id: 'datos', category: 'Privacidad', q: '¿Qué datos guardan de mí?', a: 'Solo tus ajustes, y quedan en tu propio equipo. No guardamos qué noticias lees.', link: { label: 'Leer más sobre privacidad', target: { section: 'guias', id: 'privacidad' } } },
  { id: 'celular', category: 'Compatibilidad', q: '¿Funciona en el celular?', a: 'El prototipo funciona en el navegador del celular. Como extensión, Chrome para Android todavía no permite instalarla; estamos evaluando otras opciones.' },
  { id: 'diarios', category: 'Compatibilidad', q: '¿En qué diarios funciona?', a: 'El prototipo funciona en una página de prueba. La meta es funcionar en los principales diarios digitales peruanos.' },
  { id: 'demora', category: 'Soporte', q: '¿Cuánto tardan en responder?', a: 'Depende de qué tan grave sea: un problema que impide leer se atiende en 2 horas. Un reclamo en el Libro de Reclamaciones se responde en un máximo de 15 días hábiles.', link: { label: 'Ir a Contacto y reclamos', target: { section: 'contacto' } } },
];
