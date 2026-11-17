import type { CommunityPost } from './types';

/** Reglas de la comunidad (siempre visibles arriba del foro) */
export const COMMUNITY_RULES = [
  'Sé amable. Aquí cada persona lee a su manera.',
  'No compartas tu diagnóstico, tu nombre completo ni tus datos personales.',
  'Comparte trucos y dudas sobre cómo leer mejor, no opiniones sobre las noticias.',
  'Cada mensaje se revisa antes de publicarse.',
];

export const COMMUNITY_CATEGORIES = ['Trucos', 'Dudas', 'Sugerencias'];

/**
 * Conversaciones de EJEMPLO para mostrar el diseño del foro en el prototipo.
 * No son testimonios reales: se muestran con la etiqueta «Ejemplo del prototipo».
 */
export const COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'bienvenida', alias: 'Equipo Noticias sin barreras', category: 'Dudas', pinned: true,
    title: 'Bienvenida: cómo funciona esta comunidad',
    body: 'Este es un espacio para compartir trucos y resolver dudas sobre Lectura fácil. El equipo responde de lunes a viernes.',
    replies: [],
  },
  {
    id: 'combo', alias: 'lector_azul', category: 'Trucos', example: true,
    title: 'Mi combinación para leer de noche',
    body: 'Uso «Poca luz» con la guía de renglón y quito los anuncios. Así no se me cansa la vista.',
    replies: [
      { alias: 'mariposa_27', body: 'Lo probé y me funcionó. Yo además subo un poco la letra.' },
      { alias: 'Equipo Noticias sin barreras', body: '¡Gracias por compartir! Lo agregamos a las guías.', team: true },
    ],
  },
  {
    id: 'voz', alias: 'cafe_con_pan', category: 'Dudas', example: true,
    title: '¿Se puede empezar a escuchar desde la mitad?',
    body: 'A veces solo quiero escuchar el final de la noticia.',
    replies: [
      { alias: 'Equipo Noticias sin barreras', body: 'Sí: abre «Escuchar» y toca la frase desde donde quieres empezar.', team: true },
    ],
  },
  {
    id: 'idea', alias: 'paso_a_paso', category: 'Sugerencias', example: true,
    title: 'Sugerencia: guardar mis ajustes',
    body: 'Sería bueno que el plugin recuerde mi letra cuando vuelvo otro día.',
    replies: [],
  },
];
