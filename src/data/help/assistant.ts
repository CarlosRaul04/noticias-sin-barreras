import type { AssistantTopic } from './types';

/**
 * Asistente Notín: respuestas fijas (sin IA), para no inventar respuestas.
 * El usuario elige qué necesita y Notín lo lleva al lugar correcto.
 */
export const ASSISTANT_TOPICS: AssistantTopic[] = [
  {
    id: 'larga', ask: 'La noticia es muy larga',
    answer: 'Prueba «Resumir»: te muestra la noticia en 4 ideas cortas, una a la vez.',
    actions: [{ label: 'Abrir Resumir', target: { tool: 'resumen' } }, { label: 'Ver la guía', target: { section: 'guias', id: 'resumir' } }],
  },
  {
    id: 'distrae', ask: 'Me distraen los anuncios',
    answer: 'En «Sin anuncios» puedes quitar anuncios, video y otras noticias. Tú eliges qué.',
    actions: [{ label: 'Abrir Sin anuncios', target: { tool: 'foco' } }, { label: 'Ver el video', target: { section: 'videos', id: 'sin-anuncios' } }],
  },
  {
    id: 'letra', ask: 'Me cuesta leer la letra',
    answer: 'En «Letra» puedes agrandar la letra, darle más espacio o cambiar el fondo.',
    actions: [{ label: 'Abrir Letra', target: { tool: 'letra' } }, { label: 'Ver la guía', target: { section: 'guias', id: 'letra' } }],
  },
  {
    id: 'escuchar', ask: 'Prefiero escuchar',
    answer: 'En «Escuchar» una voz te lee la noticia y resalta la frase que suena.',
    actions: [{ label: 'Abrir Escuchar', target: { tool: 'voz' } }, { label: 'Ver el video', target: { section: 'videos', id: 'escuchar' } }],
  },
  {
    id: 'error', ask: 'El resumen tiene un error',
    answer: 'Gracias por avisar. Cuéntanos qué idea está mal y la revisamos en 24 horas.',
    actions: [{ label: 'Reportar el error', target: { section: 'contacto', id: 'error-resumen' } }],
  },
  {
    id: 'reclamo', ask: 'Quiero hacer un reclamo',
    answer: 'Puedes registrarlo en nuestro Libro de Reclamaciones. Te respondemos en máximo 15 días hábiles.',
    actions: [{ label: 'Abrir el Libro de Reclamaciones', target: { section: 'contacto', id: 'reclamaciones' } }],
  },
];
